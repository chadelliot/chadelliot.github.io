-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Chad's rule: if an owner reaches out to a contact whose company is
-- currently assigned to a member, that company comes off the member's
-- plate (an owner working it directly is exactly the "don't let a member
-- also reach out to someone an owner already engaged" case), and the
-- member gets a fresh replacement company so their working count doesn't
-- quietly drop below what they should have.
--
-- Detects this via contact_progress.updated_by, which every status change
-- already records (see updateContactProgress calls in the app) - if the
-- actor is an owner and the contact's company is assigned to a member (not
-- another owner, not already unassigned), unassign that company + its
-- contacts from the member and backfill them one fresh company via the
-- existing assign_next_company_batch() RPC.

create or replace function public.handle_owner_engagement()
returns trigger as $$
declare
  actor_role text;
  contact_company_id uuid;
  current_assigned_rep uuid;
  current_assigned_role text;
begin
  if new.status in ('connection_sent', 'introduction_sent', 'follow_up_sent', 'meeting_set')
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

drop trigger if exists trg_handle_owner_engagement on public.contact_progress;
create trigger trg_handle_owner_engagement
  after update on public.contact_progress
  for each row execute function public.handle_owner_engagement();
