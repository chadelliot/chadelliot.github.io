-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Adds the fields + storage buckets needed for the richer Profile tab:
-- LinkedIn URL, a photo, an uploaded resume, and a short "credibility line"
-- reps can write about their own background (used to personalize outreach -
-- see EMAIL_SEQUENCE / signature-line personalization in projectContacts.ts).
--
-- credibility_line is the short sentence that gets appended to outreach
-- (e.g. "I spent 6 years in supply chain ops before this..."). background_tags
-- is a simple comma-separated list of industries/keywords a rep associates
-- with their own experience - used for context-aware matching against a
-- contact's industry/sector, no AI required for that part.

alter table public.team_members
  add column if not exists linkedin_url text,
  add column if not exists photo_url text,
  add column if not exists resume_url text,
  add column if not exists credibility_line text,
  add column if not exists background_tags text;

-- Two buckets: avatars (small headshots, fine to be publicly readable since
-- they're shown right on the outreach UI) and resumes (personal documents -
-- kept private, readable only by the owning rep and Owners).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- Storage objects are stored under a path like "<team_member_id>/photo.jpg"
-- or "<team_member_id>/resume.pdf" - these policies scope reads/writes to
-- the uploading rep's own folder (matched against their signed-in auth uid
-- via the team_members row that links auth users to a team_member id).
drop policy if exists "Avatar photos are publicly readable" on storage.objects;
create policy "Avatar photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Reps can upload their own avatar" on storage.objects;
create policy "Reps can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and exists (
      select 1 from public.team_members tm
      where tm.id::text = (storage.foldername(name))[1]
        and lower(tm.email) = lower(auth.jwt() ->> 'email')
    )
  );

drop policy if exists "Reps can replace their own avatar" on storage.objects;
create policy "Reps can replace their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and exists (
      select 1 from public.team_members tm
      where tm.id::text = (storage.foldername(name))[1]
        and lower(tm.email) = lower(auth.jwt() ->> 'email')
    )
  );

drop policy if exists "Reps can read their own resume" on storage.objects;
create policy "Reps can read their own resume"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and exists (
      select 1 from public.team_members tm
      where tm.id::text = (storage.foldername(name))[1]
        and (
          lower(tm.email) = lower(auth.jwt() ->> 'email')
          or exists (
            select 1 from public.team_members me
            where lower(me.email) = lower(auth.jwt() ->> 'email') and me.role = 'owner'
          )
        )
    )
  );

drop policy if exists "Reps can upload their own resume" on storage.objects;
create policy "Reps can upload their own resume"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and exists (
      select 1 from public.team_members tm
      where tm.id::text = (storage.foldername(name))[1]
        and lower(tm.email) = lower(auth.jwt() ->> 'email')
    )
  );

drop policy if exists "Reps can replace their own resume" on storage.objects;
create policy "Reps can replace their own resume"
  on storage.objects for update
  using (
    bucket_id = 'resumes'
    and exists (
      select 1 from public.team_members tm
      where tm.id::text = (storage.foldername(name))[1]
        and lower(tm.email) = lower(auth.jwt() ->> 'email')
    )
  );

notify pgrst, 'reload schema';
