-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Company-level hiring signals: when a target company is actively hiring for
-- a role that suggests they're in-market for RevHub's services, this bumps
-- every contact at that company above the general cold-outreach list,
-- regardless of their individual A/B/C priority tier.

create table if not exists public.company_signals (
  company text primary key,
  role_title text,
  posted_date date,
  source_url text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.company_signals enable row level security;

drop policy if exists "authenticated_read_company_signals" on public.company_signals;
create policy "authenticated_read_company_signals" on public.company_signals for select to authenticated using (true);

drop policy if exists "authenticated_insert_company_signals" on public.company_signals;
create policy "authenticated_insert_company_signals" on public.company_signals for insert to authenticated with check (true);

drop policy if exists "authenticated_update_company_signals" on public.company_signals;
create policy "authenticated_update_company_signals" on public.company_signals for update to authenticated using (true) with check (true);

drop policy if exists "authenticated_delete_company_signals" on public.company_signals;
create policy "authenticated_delete_company_signals" on public.company_signals for delete to authenticated using (true);
