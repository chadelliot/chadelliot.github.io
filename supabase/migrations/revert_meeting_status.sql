-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Fixes: add_meeting_propagation.sql only handled the forward transition
-- (status -> meeting_set flips the company to "Meeting Scheduled"). There
-- was no symmetric handling for a rep reverting a contact's status away
-- from meeting_set, so a company could get stuck showing "Meeting
-- Scheduled" (and count toward that stat tile) even after the meeting
-- was un-set.
--
-- This replaces handle_meeting_set() with a version that also handles the
-- reverse case: if the contact credited with the company's meeting
-- (companies.meeting_contact_id) changes to any status other than
-- meeting_set, the company reverts to "New Signal" - unless another
-- contact at the same company is still sitting at meeting_set, in which
-- case that contact is promoted to meeting_contact_id instead and the
-- company stays "Meeting Scheduled". Works for every status a contact can
-- be reverted to (not_contacted, connection_sent, etc.), not just one.

create or replace function public.handle_meeting_set()
returns trigger as $$
declare
  target_company_id uuid;
  replacement_contact_id uuid;
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

  elsif old.status = 'meeting_set' and (new.status is distinct from 'meeting_set') then
    select company_id into target_company_id from public.project_contacts where id = new.contact_id;

    if target_company_id is not null then
      -- Only act if this contact is the one currently credited with the
      -- company's meeting - if someone else already holds that credit,
      -- this contact reverting doesn't change anything.
      if exists (
        select 1 from public.companies
        where id = target_company_id and meeting_contact_id = new.contact_id
      ) then
        select cp.contact_id into replacement_contact_id
        from public.contact_progress cp
        join public.project_contacts pc on pc.id = cp.contact_id
        where pc.company_id = target_company_id
          and cp.status = 'meeting_set'
          and cp.contact_id <> new.contact_id
        limit 1;

        if replacement_contact_id is not null then
          update public.companies
            set meeting_contact_id = replacement_contact_id,
                updated_at = now()
            where id = target_company_id;
        else
          update public.companies
            set company_stage = 'new_signal',
                meeting_contact_id = null,
                updated_at = now()
            where id = target_company_id
              and company_stage = 'meeting_scheduled';
        end if;
      end if;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition itself is unchanged - replacing the function body is
-- enough - but re-asserting it here keeps this file runnable standalone.
drop trigger if exists trg_handle_meeting_set on public.contact_progress;
create trigger trg_handle_meeting_set
  after update on public.contact_progress
  for each row execute function public.handle_meeting_set();
