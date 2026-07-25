-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Phase 3: signal clustering + outreach-model badges.
--
-- Tags each hiring signal with which outreach model it calls for. Nothing
-- infers this in-app - it's set manually for now (owner or the company's
-- assigned rep, from the company detail page) and is meant to be populated
-- by ChatGPT's sourcing later. Written with IF NOT EXISTS so it's a safe
-- no-op if this has already been added live.

-- Defensive: the app's update/lookup calls assume company_signals has a
-- primary-key-style id column (standard for tables created via the
-- Supabase table editor). No-op if it's already there.
alter table public.company_signals add column if not exists id uuid default gen_random_uuid() not null;
create unique index if not exists idx_company_signals_id on public.company_signals(id);

alter table public.company_signals
  add column if not exists outreach_model text
    check (outreach_model in ('replace', 'bridge', 'build', 'augment', 'consolidate'));
