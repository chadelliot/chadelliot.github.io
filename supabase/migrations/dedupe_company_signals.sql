-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Root cause: scripts/sync-marketing-signals.mjs dedupes by first querying
-- for an existing row matching (company, role_title, posted_date,
-- source_url) and PATCHing it if found, POSTing a new row otherwise. That
-- check-then-act pattern found 51 pairs of true duplicates in production
-- (e.g. CLUTCH's "Strategic Media Planning + Investment Lead" - same
-- source_url, inserted twice two days apart) - the matching key itself is
-- solid (spot-checked: no duplicate group has a null role_title or
-- source_url, so this key isn't at risk of merging unrelated signals), but
-- a check-then-act query run from application code can always race or miss
-- for reasons that never show up in application logs.
--
-- Fix has two parts:
-- 1. Clean up the 51 existing duplicate pairs here (keeps the
--    earliest-created row per group; companies.primary_signal_id and the
--    other derived owner-only fields are recomputed automatically by the
--    existing trg_company_signals_recompute_lead_type trigger on delete, no
--    manual repointing needed).
-- 2. A real UNIQUE index below makes a duplicate insert impossible at the
--    database level going forward, regardless of what the sync script's
--    application-level check does - see the companion change to
--    scripts/sync-marketing-signals.mjs, which now uses this index for a
--    real upsert (on_conflict + Prefer: resolution=merge-duplicates)
--    instead of a separate GET-then-branch, closing the race entirely.

delete from public.company_signals cs
using (
  select id,
    row_number() over (
      partition by company, role_title, posted_date, source_url
      order by created_at asc
    ) as rn
  from public.company_signals
) ranked
where cs.id = ranked.id and ranked.rn > 1;

create unique index if not exists company_signals_natural_key
  on public.company_signals (company, role_title, posted_date, source_url)
  nulls not distinct;
