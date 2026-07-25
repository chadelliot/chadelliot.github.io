-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Phase 2b: company detail page + 4-stage board.
--
-- Per the handoff notes, several Phase 1/2 schema changes (company_id on
-- project_contacts, company_signals, meetings, closed_deals; the companies
-- table itself) were applied directly in Supabase and never committed to
-- git - the live database is ground truth there, not this repo. Every
-- statement below is written with IF NOT EXISTS, so it's safe to run
-- regardless of what's already in place: anything that already exists is
-- a no-op, and this migration now documents that state in git going
-- forward.

alter table public.company_signals add column if not exists company_id uuid references public.companies(id);
alter table public.meetings add column if not exists company_id uuid references public.companies(id);
alter table public.closed_deals add column if not exists company_id uuid references public.companies(id);

-- Speeds up the company detail page, which filters contacts/signals/
-- meetings/deals down to a single company_id, and the board, which
-- groups companies by stage and looks up assigned reps.
create index if not exists idx_project_contacts_company_id on public.project_contacts(company_id);
create index if not exists idx_company_signals_company_id on public.company_signals(company_id);
create index if not exists idx_meetings_company_id on public.meetings(company_id);
create index if not exists idx_closed_deals_company_id on public.closed_deals(company_id);
create index if not exists idx_companies_company_stage on public.companies(company_stage);
create index if not exists idx_companies_assigned_rep on public.companies(assigned_rep);
