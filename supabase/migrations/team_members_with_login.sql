-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Deleting a user (Authentication -> Users -> delete) already reassigns
-- their live contact_progress.assigned_to to a fallback owner (see
-- reassign_contacts_on_user_deletion.sql) - but it never touched the
-- team_members row itself, so the person kept showing up on the /projects
-- Team page forever after their login was gone (found: celliot.parker@gmail.com,
-- a team_members row with no matching auth.users entry).
--
-- Deliberately NOT hard-deleting the team_members row here: meetings.set_by,
-- closed_deals.credited_to, and contact_activity.actor all reference
-- team_members(id) with no ON DELETE clause (confirmed via pg_constraint),
-- and reassign_contacts_on_user_deletion.sql's own comment says that
-- historical credit is meant to survive account deletion - a hard delete
-- would either fail outright (FK violation) for anyone with real meeting/
-- deal history, or destroy the name behind that history for everyone else.
--
-- Instead: a security-definer RPC that only returns team_members rows with
-- a live matching auth.users row (auth.users isn't queryable from the
-- client directly). The Team page uses this for what it displays; every
-- other lookup in the app (assigned_rep names, credited_to names, etc.)
-- keeps using the full team_members fetch so historical attribution still
-- resolves a real name after someone's account is gone.
--
-- Explicit column list, not `select tm.*` - a security-definer function
-- runs with the owner's privileges, so `tm.*` would bypass the column-level
-- grant that keeps google_refresh_token off of authenticated/anon (see
-- add_google_calendar_fields.sql) and leak it into this RPC's JSON
-- response. Matches TEAM_MEMBER_COLUMNS in src/lib/projectContacts.ts.

drop function if exists public.get_team_members_with_login();

create or replace function public.get_team_members_with_login()
returns table (
  id uuid,
  name text,
  email text,
  role text,
  title text,
  linkedin_url text,
  photo_url text,
  resume_url text,
  credibility_line text,
  background_tags text,
  google_calendar_connected boolean,
  google_calendar_email text
)
security definer
language sql
stable
as $$
  select tm.id, tm.name, tm.email, tm.role, tm.title, tm.linkedin_url, tm.photo_url,
         tm.resume_url, tm.credibility_line, tm.background_tags,
         tm.google_calendar_connected, tm.google_calendar_email
  from public.team_members tm
  where exists (select 1 from auth.users u where u.email = tm.email);
$$;

grant execute on function public.get_team_members_with_login() to authenticated;
