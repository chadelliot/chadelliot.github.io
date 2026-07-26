-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Supports the Google Calendar "grab time" link: once a rep connects their
-- calendar, contacts can book directly off their real availability instead
-- of a manual back-and-forth over email.
--
-- google_refresh_token is what actually lets the Edge Function check
-- freebusy and create events on the rep's behalf later - it's a long-lived
-- credential, so it's never sent to the frontend (only read/written by the
-- google-calendar Edge Function via the service role key).

alter table public.team_members
  add column if not exists google_refresh_token text,
  add column if not exists google_calendar_email text,
  add column if not exists google_calendar_connected boolean not null default false;

-- fetchTeamMembers() in the frontend does `select=*` on this table (it's
-- used broadly - rep dropdowns, the Team page, etc.) - without this, a
-- long-lived Google credential would ship to every signed-in team member's
-- browser. Revoking column-level SELECT here means even a `select=*` from
-- the anon/authenticated roles silently omits this column, while the
-- google-calendar Edge Function (using the service role key, which bypasses
-- these grants entirely) can still read and write it. Same pattern already
-- used for canonical_lead_type/opportunity_type in leadtype_phase1_foundation.sql.
revoke select on public.team_members from authenticated, anon;
grant select (id, name, email, role, title, linkedin_url, photo_url, resume_url, credibility_line, background_tags, google_calendar_connected, google_calendar_email)
  on public.team_members to authenticated, anon;

notify pgrst, 'reload schema';
