-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Phase 2, part 1: when a contact's status becomes Meeting Set, the company
-- automatically flips to "Meeting Scheduled" and records which contact
-- generated it - but only the FIRST time. If more contacts at the same
-- company later reach Meeting Set too, the company stays on the original
-- meeting-generating contact, since that's "who actually got the meeting,"
-- not just "who most recently changed status."

create or replace function public.handle_meeting_set()
returns trigger as $$
declare
  target_company_id uuid;
begin
  if new.status = 'meeting_set' and (old.status is distinct from 'meeting_set') then
    select company_id into target_company_id from public.project_contacts where id = new.contact_id;

    if target_company_id is not null then
      update public.companies
        set company_stage = 'meeting_scheduled',
            meeting_contact_id = new.contact_id,
            updated_at = now()
        where id = target_company_id
          and company_stage = 'new_signal';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_handle_meeting_set on public.contact_progress;
create trigger trg_handle_meeting_set
  after update on public.contact_progress
  for each row execute function public.handle_meeting_set();

-- Convenience view: for any contact, is there a meeting already scheduled
-- at their company by someone else? The app uses this to show the
-- "meeting scheduled with X" notice and to lock outreach for that contact.
create or replace view public.contact_meeting_block as
select
  pc.id as contact_id,
  pc.company_id,
  c.company_stage,
  c.meeting_contact_id,
  (c.company_stage = 'meeting_scheduled' and c.meeting_contact_id is distinct from pc.id) as is_blocked,
  mc.contact_name as meeting_contact_name,
  mc.title as meeting_contact_title
from public.project_contacts pc
join public.companies c on c.id = pc.company_id
left join public.project_contacts mc on mc.id = c.meeting_contact_id;
