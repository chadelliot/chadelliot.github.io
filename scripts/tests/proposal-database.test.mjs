import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function loadModule(file, env, extra = {}) {
  const source = readFileSync(file, 'utf8').replaceAll('import.meta.env', JSON.stringify(env));
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, URL, console, ...extra }, { filename: file });
  return exports;
}
for (const schema of ['public', 'aboutchad']) {
  test(`${schema}: company reads and writes select the intended schema`, async () => {
    const env = { VITE_PROPOSAL_DB_URL: 'https://duqlvhfmmqxyoprlxtvs.supabase.co', VITE_PROPOSAL_DB_PUBLIC: 'test-publishable', VITE_PROPOSAL_DB_SCHEMA: schema };
    const config = loadModule('src/lib/proposalDatabase.ts', env);
    const requests = [];
    const api = loadModule('src/lib/companyStatus.ts', env, {
      require: () => config,
      fetch: async (url, options) => { requests.push({ url, options }); return { ok: true, json: async () => [] }; },
    });
    const session = { access_token: 'test-session', user: { id: 'test-user' } };
    await api.fetchAllCompanyStatuses(session);
    await api.upsertCompanyStatus(session, 'example', 'new');
    assert.equal(requests.length, 2);
    for (const { url, options } of requests) {
      assert.ok(url.startsWith(env.VITE_PROPOSAL_DB_URL + '/rest/v1/company_status'));
      assert.equal(options.headers['Accept-Profile'], schema);
      assert.equal(options.headers['Content-Profile'], schema);
      assert.equal(options.headers.Authorization, 'Bearer test-session');
    }
    assert.equal(requests[1].options.method, 'POST');
  });
}
test('legacy source session stays compatible; destination sessions are isolated', () => {
  const source = loadModule('src/lib/proposalDatabase.ts', { VITE_PROPOSAL_DB_URL: 'https://lihuwskumlfgvaltvmpl.supabase.co' });
  const destination = loadModule('src/lib/proposalDatabase.ts', { VITE_PROPOSAL_DB_URL: 'https://duqlvhfmmqxyoprlxtvs.supabase.co', VITE_PROPOSAL_DB_SCHEMA: 'aboutchad' });
  assert.equal(source.PROPOSAL_DB_SCHEMA, 'public');
  assert.equal(source.PROPOSAL_SESSION_STORAGE_KEY, 'aboutchad_proposal_directory_session_v1');
  assert.notEqual(source.PROPOSAL_SESSION_STORAGE_KEY, destination.PROPOSAL_SESSION_STORAGE_KEY);
});
test('invalid schema fails closed', () => {
  assert.throws(() => loadModule('src/lib/proposalDatabase.ts', { VITE_PROPOSAL_DB_SCHEMA: 'finance' }), /Unsupported/);
});
test('schema headers stay off Storage and Edge Function requests', async () => {
  const env = { VITE_PROPOSAL_DB_URL: 'https://duqlvhfmmqxyoprlxtvs.supabase.co', VITE_PROPOSAL_DB_PUBLIC: 'test-publishable', VITE_PROPOSAL_DB_SCHEMA: 'aboutchad' };
  const config = loadModule('src/lib/proposalDatabase.ts', env);
  const requests = [];
  const api = loadModule('src/lib/projectContacts.ts', env, {
    require: (name) => name.includes('proposalDatabase') ? config : {},
    fetch: async (url, options) => { requests.push({ url, options }); return { ok: true, json: async () => ({ signedURL: '/signed-test', line: 'test' }) }; },
  });
  await api.fetchResumeSignedUrl({ access_token: 'test-session' }, 'test/resume.pdf');
  assert.equal(requests.length, 1);
  assert.ok(requests[0].url.includes('/storage/v1/'));
  assert.equal(requests[0].options.headers['Accept-Profile'], undefined);
  assert.equal(requests[0].options.headers['Content-Profile'], undefined);
});
