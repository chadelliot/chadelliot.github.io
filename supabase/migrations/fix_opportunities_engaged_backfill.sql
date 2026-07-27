-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Fixes a bug in the one-time backfill in add_opportunities_engaged_stage.sql:
-- that backfill promoted a company to opportunities_engaged if any contact
-- had contact_progress.status <> 'not_contacted'. do_not_contact satisfies
-- that condition but means the opposite of engagement - someone flagged
-- that contact as one NOT to reach out to (e.g. a duplicate/legacy mapping
-- like the Ian Gresham cleanup). 92 of the 100 companies backfilled were
-- promoted solely because of do_not_contact contacts, not real outreach.
--
-- This reverts exactly those 92 back to new_signal - any company with at
-- least one contact genuinely marked connection_sent, introduction_sent,
-- follow_up_sent, or meeting_set stays on opportunities_engaged untouched.
-- Nothing here changes the app-side auto-advance logic (copying/sending a
-- message), which was never affected by this bug.

update public.companies c
set company_stage = 'new_signal',
    updated_at = now()
where c.company_stage = 'opportunities_engaged'
  and not exists (
    select 1
    from public.project_contacts pc
    join public.contact_progress cp on cp.contact_id = pc.id
    where pc.company_id = c.id
      and cp.status in ('connection_sent', 'introduction_sent', 'follow_up_sent', 'meeting_set')
  );
