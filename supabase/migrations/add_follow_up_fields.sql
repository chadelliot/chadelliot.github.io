-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- NOT YET APPLIED. The /projects Outreach queue works without it (it falls
-- back to "days since last status change"), but follow-up dates, next
-- actions and "last contacted" need these columns.
--
-- Deliberately does NOT touch contact_progress.status - relationship stage
-- stays exactly as it is. These columns only describe the *task*: when the
-- rep next needs to act and what they last did.
--
-- Rollback: alter table public.contact_progress drop column follow_up_at, ...
-- Existing RLS policies and table-level grants on contact_progress apply to
-- new columns automatically; if column-level grants are in use, grant
-- select/update on these four columns to the same roles as `status`.

alter table public.contact_progress
  add column if not exists follow_up_at date,
  add column if not exists next_action text,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists last_channel text;

alter table public.contact_progress
  drop constraint if exists contact_progress_last_channel_check;
alter table public.contact_progress
  add constraint contact_progress_last_channel_check
  check (last_channel is null or last_channel in ('linkedin', 'email', 'phone', 'other'));

create index if not exists contact_progress_follow_up_at_idx
  on public.contact_progress (follow_up_at)
  where follow_up_at is not null;
