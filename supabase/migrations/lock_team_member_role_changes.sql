-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Two layers of protection, since RLS alone can't restrict a single column:
--   1. RLS: you can update your own row (e.g. your name), or any row if
--      you're an owner.
--   2. Trigger: no matter what RLS allows, changing the `role` column
--      itself always requires the requester to already be an owner - so a
--      member editing their own name can never accidentally (or
--      deliberately) promote themselves.

drop policy if exists "authenticated_update_team_members" on public.team_members;

create policy "self_or_owner_update_team_members"
  on public.team_members for update
  to authenticated
  using (
    email = auth.email()
    or exists (select 1 from public.team_members oc where oc.email = auth.email() and oc.role = 'owner')
  )
  with check (
    email = auth.email()
    or exists (select 1 from public.team_members oc where oc.email = auth.email() and oc.role = 'owner')
  );

create or replace function public.prevent_role_change_by_non_owners()
returns trigger as $$
begin
  if new.role is distinct from old.role then
    if not exists (
      select 1 from public.team_members oc where oc.email = auth.email() and oc.role = 'owner'
    ) then
      raise exception 'Only an owner can change a team member''s role.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_prevent_role_change_by_non_owners on public.team_members;
create trigger trg_prevent_role_change_by_non_owners
  before update on public.team_members
  for each row execute function public.prevent_role_change_by_non_owners();
