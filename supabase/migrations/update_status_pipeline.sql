-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Switches the RevHub /projects contact status pipeline to:
--   Not Contacted -> Connection Sent -> Introduction Sent -> Follow-Up Sent
--   -> Meeting Set, plus Do Not Contact as an any-time exit.
-- This does NOT touch the separate /company status system (company_status
-- table) - that's untouched.
--
-- Mapping judgment calls worth knowing about:
--   'connected'  -> 'connection_sent'  (the old model tracked "connection
--                    accepted" separately; the new model doesn't, so this
--                    rolls back to the closest tracked step)
--   'responded'  -> 'follow_up_sent'   (closest available proxy for "we were
--                    mid-conversation")
--   'closed'     -> 'meeting_set'      ("closed" now lives at the company
--                    level, not the contact level; this preserves that the
--                    contact at least reached the meeting stage)

alter table public.contact_progress drop constraint if exists contact_progress_status_check;

update public.contact_progress set status = 'not_contacted' where status = 'not_started';
update public.contact_progress set status = 'connection_sent' where status = 'connected';
update public.contact_progress set status = 'introduction_sent' where status = 'messaged';
update public.contact_progress set status = 'follow_up_sent' where status = 'responded';
update public.contact_progress set status = 'meeting_set' where status = 'closed';
-- 'meeting_set' and 'do_not_contact' already have their final names.

alter table public.contact_progress alter column status set default 'not_contacted';

alter table public.contact_progress add constraint contact_progress_status_check
  check (status in (
    'not_contacted',
    'connection_sent',
    'introduction_sent',
    'follow_up_sent',
    'meeting_set',
    'do_not_contact'
  ));
