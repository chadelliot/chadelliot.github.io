-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Supports the new email outreach thread (separate from the LinkedIn
-- connect/intro/follow-up sequence): contacts with a known or assumed
-- email get their own subject line + intro + 2 follow-ups, sourced from
-- the new email_* columns ChatGPT added to the RevHub-Marketing tab.
--
-- Deliberately NOT adding new values to contact_progress.status - that
-- field drives the main pipeline stat tiles and team reporting, and
-- folding a parallel email thread into it would force every report to
-- reason about two independent tracks at once. Instead, email progress
-- gets its own small ordered field (0-3) - simple enough to be one number,
-- not a named-status enum - kept separate from `status` entirely.

alter table public.project_contacts
  add column if not exists email_subject text,
  add column if not exists email_intro_message text,
  add column if not exists email_follow_up_1 text,
  add column if not exists email_follow_up_2 text,
  -- Non-null/non-empty means this contact's email was inferred from a
  -- company-domain pattern rather than confirmed directly - shown to the
  -- rep as a warning before they send anything to it.
  add column if not exists email_assumption_notice text;

alter table public.contact_progress
  add column if not exists email_sequence_position int not null default 0;

alter table public.contact_progress
  drop constraint if exists contact_progress_email_sequence_position_check;
alter table public.contact_progress
  add constraint contact_progress_email_sequence_position_check
  check (email_sequence_position between 0 and 3);
