# Projects sheet sync

The production projects page reads Supabase, not the Google Sheet directly.
`sync-project-leads` now imports the Contacts, RevHub-Marketing, and
RevHub-Marketing Signals tabs of workbook
`1BOTCJTXNPOwUVB9BmILDF4xgDavNOWVGQJSHQCcxy3M` every 15 minutes.
Reload the projects page after an import to load new records. Existing page
filters and assignment permissions still determine what each person sees.

The importer creates company links, preserves contact IDs and outreach progress,
retains existing suppression/research flags, and ignores blank source fields.
Retired source rows and placeholder identities are skipped. Only direct LinkedIn
profiles populate linkedin_url. Email inference notices remain visible; importing
an address does not verify deliverability. Company aliases resolve through name
and direct profile identity. Other sourcing tools feed this same pipeline when
their leads are added to these tabs with the existing column headers.

## Deployment state on October 23, 2026

The database RPC, Edge Function v4, Vault credential, and 15-minute cron job are
already live. The function authenticates the scheduler using a SHA-256 hash of
a random Vault token. Its gateway JWT check is disabled because the function
does its own authentication. Neither the token nor service-role key is shipped
to the frontend. The import RPC is service-role-only and uses SECURITY INVOKER.

The frontend change in this PR still needs deployment: it disables the old
owner-triggered August 15 browser import, which can overwrite current data.
No frontend changes from the user's pre-existing local work are included.

Initial import: 249 contacts created and 648 updated; a subsequent run added one
contact after the old browser importer moved a company alias. Initial processing
covered 1,014 contact identities and 74 signals. Profile-based source deduplication
then reduced the source to 1,008 identities. Database totals after import: 1,608
contacts, 35 populated emails (previously 12), and 1,115 direct LinkedIn profiles
(previously 867). Counts include historical and suppressed contacts.

The initial import created 22 duplicates across company aliases/renames. Preview
them with `review-project-lead-duplicates.sql`. Cleanup is pending explicit user
approval; the proposed action is to suppress only the newly created, never-contacted
duplicates and retain original IDs/history. No duplicate cleanup has run.

## Verification

- `node --test scripts/project-lead-sync.test.mjs`: CSV quoting/newlines, retired
  rows, placeholders, profile validation, email notices and header/date handling.
- `verify-project-lead-sync.sql`: transactional integration test of repeated imports,
  identity retention, suppression, blank-field preservation and outreach history;
  fixture changes are rolled back. Passed in production.
- Live Edge Function HTTP 200 and successful database import reports.
- Signed-in browser check: projects loads company cards, Gates Industrial's three
  contacts and Shawn Kordes's direct LinkedIn profile; Bobbie shows an email.

## Operations

Success reports: `select * from public.project_lead_sync_runs order by id desc limit 10;`
HTTP failures: `select id,status_code,error_msg,content from net._http_response order by id desc limit 10;`
Schedule: `select jobid,jobname,schedule,active from cron.job where jobname='sync-project-leads';`

Source fetch/header errors fail before writes; database imports are transactional.
The next scheduled run retries failures. The success log is intentionally inaccessible
to anon/authenticated users; no RLS policy is needed on this service-only table.
No automatic external failure notifications are configured.

To recreate: apply `setup-project-lead-sync.sql` and enable pg_cron/pg_net; provision
a random `project_lead_sync_token` in Vault, update its SHA-256 hash in the function,
deploy both function files with gateway JWT verification off, and run
`schedule-project-lead-sync.sql`. Do not commit the plaintext token.
