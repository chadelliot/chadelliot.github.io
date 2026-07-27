-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Same bug as fix_opportunities_engaged_backfill.sql, found in a second
-- place: handle_meeting_set()'s "still_engaged" check (used when an unset
-- meeting reverts a company) used `cp.status <> 'not_contacted'`, which
-- wrongly counts do_not_contact as engagement. A company reverting from
-- meeting_scheduled with only a do_not_contact contact left over would have
-- incorrectly landed on opportunities_engaged instead of new_signal.
--
-- Also tightens the trigger to match the app-side auto-advance change: only
-- connection_sent/introduction_sent/follow_up_sent count as genuine
-- engagement now (meeting_set is excluded from this particular check since
-- it can't apply here - this branch only runs when a contact's status is
-- moving AWAY from meeting_set).

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
              and cp.status in ('connection_sent', 'introduction_sent', 'follow_up_sent')
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
