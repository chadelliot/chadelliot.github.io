-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- When a team member's login account is deleted (Authentication -> Users ->
-- delete), their assigned contacts should never just disappear or sit
-- orphaned - they get handed back to an owner, since owners act as the
-- fallback pool for everything. Meetings and closed deals stay credited to
-- whoever actually did that work, even after their account is gone -
-- that's attribution history, not a live assignment, so it shouldn't move.

create or replace function public.handle_deleted_auth_user()
returns trigger as $$
declare
  deleted_member_id uuid;
  fallback_owner_id uuid;
begin
  select id into deleted_member_id from public.team_members where email = old.email;

  if deleted_member_id is not null then
    -- Pick the longest-standing owner as the fallback holder, so this is
    -- always predictable rather than picking a random owner each time.
    select id into fallback_owner_id
      from public.team_members
      where role = 'owner' and id <> deleted_member_id
      order by created_at asc
      limit 1;

    update public.contact_progress
      set assigned_to = fallback_owner_id
      where assigned_to = deleted_member_id;

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
