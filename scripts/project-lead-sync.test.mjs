import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactsFromCsv, signalsFromCsv, parseCsv } from '../supabase/functions/sync-project-leads/source.mjs';

test('CSV preserves multiline outreach, commas and escaped quotes', () => {
  assert.deepEqual(parseCsv('Name,Message\r\nPat,"Hi, Pat\n""Hello"""').rows, [{Name:'Pat',Message:'Hi, Pat\n"Hello"'}]);
  assert.throws(() => parseCsv('Name\n"unfinished'), /Incomplete/);
});
test('only selected identities sync; retired duplicates cannot replace them', () => {
  const rows = contactsFromCsv('Company,Contact Name,LinkedIn URL / Search,Status,Priority,Title\nAcme,Pat,https://www.linkedin.com/in/pat,Selected,A,VP\nAcme,Pat,,Retired duplicate,Retired,Old role\nAcme,SKIP QXO,,,,\n');
  assert.equal(rows.length,1); assert.equal(rows[0].title,'VP');
});
test('search links are not profiles; assumed email retains warning and slot', () => {
  const [row] = contactsFromCsv('Company,Contact Name,LinkedIn URL / Search,Email,target_type_raw,email_status\nAcme,Pat,https://www.linkedin.com/search/results/people/,pat@acme.com,Target 1,Assumed Company Pattern');
  assert.equal(row.linkedin_url,undefined); assert.match(row.email_assumption_notice,/May not work/); assert.equal(row.target_type_raw,'Target 1');
});
test('header drift fails closed; actual signal date header maps', () => {
  assert.throws(() => contactsFromCsv('<html>Sign in</html>'), /Missing contact/);
  assert.equal(signalsFromCsv('company,role_title,posted_date (YYYY-MM-DD)\nAcme,VP,2026-10-23')[0].posted_date,'2026-10-23');
});
