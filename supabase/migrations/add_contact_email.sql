-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Adds an email field to project_contacts. None of the currently-imported
-- contacts have one yet (the source data never had this column), but future
-- batches may include it, and having an email on file outranks even a real
-- LinkedIn profile link when deciding who gets assigned first.

alter table public.project_contacts add column if not exists email text;
