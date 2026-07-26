-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Adds a self-service "title" field to team_members for the new Profile
-- tab (name + title editable there; email is intentionally left alone -
-- see the comment on updateTeamMemberProfile in projectContacts.ts for why).

alter table public.team_members add column if not exists title text;
