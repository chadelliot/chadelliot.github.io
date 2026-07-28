-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Chad's call: owners should never hold assigned leads. Owners already see
-- everything via Company board and can reach out to anyone regardless of
-- assignment - having a deleted member's whole book dumped onto an owner
-- just locks those leads away from the pool a newly-joined member draws
-- their first batch from (assign_next_company_batch.sql only offers up
-- companies where assigned_rep is null).
--
-- 1. handle_deleted_auth_user() previously reassigned the deleted member's
--    contact_progress.assigned_to to "the longest-standing owner" - that's
--    exactly what put 51 contacts on Chad Parker's account after
--    celliot.parker@gmail.com was deleted. Now unassigns instead (sets
--    null), returning those contacts to the pool.
-- 2. Extended to also clear companies.assigned_rep on deletion - this was
--    never touched by any reassignment logic before (confirmed: celliot.
--    parker@gmail.com still held 25 companies after their account was
--    deleted, same root problem as #1 just on the company side).
-- 3. One-time cleanup below unassigns the two cases already found live:
--    Chad Parker's 51 inherited contacts, and celliot.parker's 25 stuck
--    companies.

create or replace function public.handle_deleted_auth_user()
returns trigger as $$
declare
  deleted_member_id uuid;
begin
  select id into deleted_member_id from public.team_members where email = old.email;

  if deleted_member_id is not null then
    update public.contact_progress
      set assigned_to = null
      where assigned_to = deleted_member_id;

    update public.companies
      set assigned_rep = null
      where assigned_rep = deleted_member_id;

    -- Deliberately not touching meetings.set_by or closed_deals.credited_to -
    -- that's historical credit, not a live assignment.
  end if;

  return old;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute function public.handle_deleted_auth_user();

-- One-time cleanup: unassign leads currently sitting on owners or on the
-- already-deleted celliot.parker@gmail.com account.
update public.contact_progress cp
set assigned_to = null
from public.team_members tm
where cp.assigned_to = tm.id and tm.role = 'owner';

update public.companies c
set assigned_rep = null
from public.team_members tm
where c.assigned_rep = tm.id
  and (tm.role = 'owner' or not exists (select 1 from auth.users u where u.email = tm.email));
