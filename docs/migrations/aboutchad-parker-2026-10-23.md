# About Chad → Parker Household migration

Status: data copied and verified; client access and production cutover remain disabled.

## Database verification

Source: `lihuwskumlfgvaltvmpl`, `public` application tables.
Destination: `duqlvhfmmqxyoprlxtvs`, isolated `aboutchad` schema.

| Table | Verified records |
| --- | ---: |
| closed_deals | 0 |
| companies | 388 |
| company_signals | 82 |
| company_status | 1 |
| contact_activity | 106 |
| contact_progress | 1,358 |
| meetings | 0 |
| project_contacts | 1,358 |
| proposal_contact_status | 1 |
| team_members | 7 |
| **Total** | **3,301** |

All 120 column definitions matched before import. Source rows were read in one SQL statement. The SQL editor rejected a single large copy query, so the snapshot was transferred in 87 bounded batches into a staging table with RLS and no client grants. The complete staged JSON matched the source snapshot exactly. A single destination transaction inserted all application rows and checked full JSON row contents before commit. No overwrite or truncate was used.

Counts and sorted-row content fingerprints for all 85 `public` finance tables matched before and after import. A final verification was repeated after database behavior tests.

The application constraints and indexes were restored, except the source `proposal_contact_status.user_id` foreign key into Auth, which must wait for identity migration. Eleven application triggers and 21 application functions were restored with schema-qualified references and fixed search paths. Client execution is revoked pending explicit authorization.

## Security preparation

- RLS is enabled on all imported tables. Membership-scoped policies replace source-wide authenticated access.
- Table privileges remain denied to `anon` and `authenticated`.
- Private Auth-to-team identity mapping is separate from household membership.
- One existing destination account was matched by email; its destination Auth UUID differs from the source UUID. Four source accounts do not yet exist in destination Auth.
- No global source Auth creation/deletion triggers were attached to destination Auth. Automatically enrolling every finance signup into About Chad would defeat application separation.
- The Google refresh-token column must never be granted to browser clients.
- Privileged assignment and read RPCs have membership/owner checks. Only a reviewed RPC whitelist should receive client execution rights.
- No Edge Function secrets or database passwords were exposed, reset, or placed in this repository.

Rolled-back grant tests verified mapped-member reads, outsider denial, anonymous denial, and calendar-token-column denial. Trigger tests verified default contact progress creation, progress updates, and invalid-status rejection; test rows were rolled back.

An unrelated authenticated identity was tested against all 85 finance tables. Shared reference catalogs are readable by design. Navigation telemetry was also readable under an existing broad policy, so a restrictive household-membership policy was added and tested: the existing household user retained all 292 rows, and an unrelated identity saw zero. Finance row contents were unchanged.

Supabase security advisor reported only two intentional RLS/no-policy notices on locked staging/private mapping tables, plus the existing warning that leaked-password protection is disabled. The advisor check does not replace live authentication and end-to-end tests.

## Website branch

Branch: `migration/aboutchad-parker-staging`.

- Set `VITE_PROPOSAL_DB_SCHEMA=aboutchad` only in a destination test build.
- Leave the production URL, public key, and schema variables unchanged until sign-in, authorization, CRUD, RPC, Storage, and Edge Function tests pass.
- PostgREST requests carry both `Accept-Profile` and `Content-Profile`.
- Storage and Edge Function calls do not carry PostgREST profile headers.
- Session storage is isolated by Supabase project host/schema; the original source/public session key is preserved for backward compatibility.
- The calendar Edge Function and marketing-sync script accept `PROPOSAL_DB_SCHEMA`, defaulting to `public`.

Validation: production build passed; five focused integration tests passed with `node --test scripts/tests/proposal-database.test.mjs`; marketing-sync script syntax check passed. No production deployment or configuration change was made.

## Remaining gates

1. Obtain action-time approval for new account access and any invitation emails. Migrate the four missing Auth users, map identities explicitly, and reconcile historical proposal-status ownership before adding its Auth foreign key. Preserve existing finance authentication and MFA settings.
2. Review destination Auth hooks and finance RPC authorization for all new team identities. Test both AAL1 and AAL2 identities before granting access.
3. Enable the reviewed member-only API grants and schema exposure for testing. Do not grant all functions or the calendar token column. Keep migration staging private.
4. Recreate namespaced avatars/private resumes buckets and scoped Storage policies. Source buckets contain zero objects; existing URLs in team records still need review.
5. Deploy and test isolated Edge Functions. Supply Anthropic and Google OAuth secrets through secure provider settings; existing secrets cannot be retrieved from the dashboard. Register the destination Google OAuth callback and verify signed state and authenticated disconnect ownership before activation.
6. Run browser sign-in, refresh, role/ownership, CRUD, RPC, profile upload/download, AI, and calendar flow tests against the destination build. Auth and Edge Function tests have not yet passed.
7. Reconcile source writes made since the snapshot. Only then change production variables, deploy, and smoke-test. Keep the source project available for rollback until the destination is stable.
8. Remove migration staging after successful activation and an agreed retention point. Do not run the original empty-destination copy script again: the destination is now populated.

No production cutover is authorized by this report.
