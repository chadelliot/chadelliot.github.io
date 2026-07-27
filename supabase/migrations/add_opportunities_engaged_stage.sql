-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Adds "Opportunities Engaged" as a company_stage value sitting between
-- "New Opportunity" (new_signal) and "Meeting Scheduled" (meeting_scheduled).
--
-- 0. companies_company_stage_check widened to allow the new value - this
--    constraint isn't defined in any migration file in this repo (it was
--    evidently added directly via the dashboard at some point), so its
--    current definition was pulled live from pg_constraint before writing
--    this ALTER.
-- 1. handle_meeting_set() updated so the new_signal -> meeting_scheduled
--    auto-advance also fires from opportunities_engaged (a company is very
--    often already "engaged" by the time a meeting gets set), and so
--    reverting an unset meeting drops back to opportunities_engaged rather
--    than all the way to new_signal when the company still has other
--    contacted contacts - otherwise un-setting one meeting would silently
--    erase the fact that outreach had already happened.
-- 2. A one-time backfill moving existing new_signal companies that already
--    have at least one contacted contact into opportunities_engaged, so
--    the board reflects reality immediately instead of only going forward.
--
-- The app-side auto-advance (new_signal -> opportunities_engaged on the
-- first LinkedIn/email send or copy) lives in application code, not here.

alter table public.companies drop constraint if exists companies_company_stage_check;
alter table public.companies add constraint companies_company_stage_check
  check (company_stage = any (array['new_signal', 'opportunities_engaged', 'meeting_scheduled', 'closed_won', 'closed_lost']));

create or replace function public.handle_meeting_set()
returns trigger as $$
declare
  target_company_id uuid;
  replacement_contact_id uuid;
  still_engaged boolean;
begin
  if new.status = 'meeting_set' and (old.status is distinct from 'meeting_set') then
    select company_id into target_company_id from public.project_contacts where id = new.contact_id;

    if target_company_id is not null then
      update public.companies
        set company_stage = 'meeting_scheduled',
            meeting_contact_id = new.contact_id,
            updated_at = now()
        where id = target_company_id
          and company_stage in ('new_signal', 'opportunities_engaged');
    end if;

  elsif old.status = 'meeting_set' and (new.status is distinct from 'meeting_set') then
    select company_id into target_company_id from public.project_contacts where id = new.contact_id;

    if target_company_id is not null then
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
          select exists (
            select 1
            from public.contact_progress cp
            join public.project_contacts pc on pc.id = cp.contact_id
            where pc.company_id = target_company_id
              and cp.status <> 'not_contacted'
              and cp.contact_id <> new.contact_id
          ) into still_engaged;

          update public.companies
            set company_stage = case when still_engaged then 'opportunities_engaged' else 'new_signal' end,
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

drop trigger if exists trg_handle_meeting_set on public.contact_progress;
create trigger trg_handle_meeting_set
  after update on public.contact_progress
  for each row execute function public.handle_meeting_set();

-- One-time backfill: any New Opportunity company with at least one
-- contacted contact moves to Opportunities Engaged immediately.
--
-- NOTE: this originally used `cp.status <> 'not_contacted'`, which wrongly
-- treats do_not_contact as engagement - it means the opposite (a contact
-- flagged as one NOT to reach out to). That bug promoted 92 companies with
-- no real outreach; see fix_opportunities_engaged_backfill.sql for the
-- correction applied to the live database. The query below is the
-- corrected version, so re-running this file from scratch (e.g. against a
-- fresh database) does not reintroduce the bug.
update public.companies c
set company_stage = 'opportunities_engaged',
    updated_at = now()
where c.company_stage = 'new_signal'
  and exists (
    select 1
    from public.contact_progress cp
    join public.project_contacts pc on pc.id = cp.contact_id
    where pc.company_id = c.id
      and cp.status in ('connection_sent', 'introduction_sent', 'follow_up_sent', 'meeting_set')
  );
