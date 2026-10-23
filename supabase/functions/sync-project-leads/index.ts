import { contactKey, contactsFromCsv, signalsFromCsv } from './source.mjs';

// SHA-256 of a random credential held in Supabase Vault, never in the browser.
const SCHEDULER_TOKEN_HASH = 'ffce73f180482d44b9df44f47cef081975c099626833ede0e49177f2732cf9c4';
const WORKBOOK = '1BOTCJTXNPOwUVB9BmILDF4xgDavNOWVGQJSHQCcxy3M';
async function source(tab: string) {
  const url = `https://docs.google.com/spreadsheets/d/${WORKBOOK}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000), cache: 'no-store' });
  if (!response.ok) throw new Error(`${tab} source failed (${response.status})`);
  return response.text();
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const token = req.headers.get('x-sync-token') || '';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  if (hash !== SCHEDULER_TOKEN_HASH) return new Response('Unauthorized', { status: 401 });
  try {
    const [industrial, marketing, signalCsv] = await Promise.all([
      source('Contacts'), source('RevHub-Marketing'), source('RevHub-Marketing Signals'),
    ]);
    const contacts = new Map();
    for (const row of [...contactsFromCsv(industrial), ...contactsFromCsv(marketing)]) {
      const key = contactKey(row);
      contacts.set(key, { ...contacts.get(key), ...row });
    }
    const signals = signalsFromCsv(signalCsv);
    if (!contacts.size || !signals.length) throw new Error('Empty source; import stopped');
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/sync_project_leads`, {
      method: 'POST',
      headers: {
        apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contacts: [...contacts.values()], signals }),
      signal: AbortSignal.timeout(90000),
    });
    if (!response.ok) throw new Error(`Database import failed (${response.status}): ${await response.text()}`);
    const report = await response.json();
    console.log('Projects sheet sync completed', report);
    return Response.json(report);
  } catch (error) {
    console.error('Projects sheet sync failed', String(error));
    return Response.json({ error: String(error) }, { status: 500 });
  }
});
