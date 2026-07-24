-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Automatically creates a team_members row (role = 'member') the instant you
-- invite someone through Authentication -> Users -> Invite. No more manual
-- SQL insert for every new hire - they just show up ready to go, using the
-- part of their email before the @ as a starting name, which they can
-- change themselves once they're in the tool.

create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.team_members (name, email, role)
  values (split_part(new.email, '@', 1), new.email, 'member')
  on conflict (email) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
