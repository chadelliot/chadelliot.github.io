-- Add a confirmed LinkedIn acceptance stage without changing any existing contacts.
-- The /company workflow and all contact assignments are preserved.
-- Run on about-chad before deploying the related app change.
begin;

alter table public.contact_progress drop constraint if exists contact_progress_status_check;
alter table public.contact_progress add constraint contact_progress_status_check
  check (status in (
    'not_contacted',
    'connection_sent',
    'connection_accepted',
    'introduction_sent',
    'follow_up_sent',
    'meeting_set',
    'do_not_contact'
  ));

-- Meeting reversion counts an accepted connection as genuine engagement.
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
              and cp.status in ('connection_sent', 'connection_accepted', 'introduction_sent', 'follow_up_sent')
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

-- Preserve owner/member assignment logic when the accepted stage is logged.
create or replace function public.handle_owner_engagement()
returns trigger as $$
declare
  actor_role text;
  contact_company_id uuid;
  current_assigned_rep uuid;
  current_assigned_role text;
begin
  if new.status in ('connection_sent', 'connection_accepted', 'introduction_sent', 'follow_up_sent', 'meeting_set')
     and old.status is distinct from new.status
     and new.updated_by is not null then

    select role into actor_role from public.team_members where id = new.updated_by;

    if actor_role = 'owner' then
      select company_id into contact_company_id from public.project_contacts where id = new.contact_id;

      if contact_company_id is not null then
        select assigned_rep into current_assigned_rep from public.companies where id = contact_company_id;

        if current_assigned_rep is not null and current_assigned_rep <> new.updated_by then
          select role into current_assigned_role from public.team_members where id = current_assigned_rep;

          if current_assigned_role = 'member' then
            update public.companies
              set assigned_rep = null, updated_at = now()
              where id = contact_company_id;

            update public.contact_progress cp
              set assigned_to = null
              from public.project_contacts pc
              where cp.contact_id = pc.id
                and pc.company_id = contact_company_id
                and cp.assigned_to = current_assigned_rep;

            perform public.assign_next_company_batch(current_assigned_rep, 1);
          end if;
        end if;
      end if;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

commit;
