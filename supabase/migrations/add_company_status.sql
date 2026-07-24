-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Creates a real, cloud-backed status field per company/proposal record,
-- replacing what would otherwise be another browser-only localStorage flag.

create table if not exists public.company_status (
  slug text primary key,
  status text not null default 'new'
    check (status in (
      'new',
      'responded',
      'meeting_scheduled',
      'proposal_shared',
      'closed'
    )),
  notes text,
  updated_at timestamptz not null default now()
);

-- Keep updated_at accurate on every change, automatically.
create or replace function public.set_company_status_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_company_status_updated_at on public.company_status;
create trigger trg_company_status_updated_at
  before update on public.company_status
  for each row execute function public.set_company_status_updated_at();

-- Lock the table down: only signed-in users of this app can read or write it.
-- (Matches the same access level as the rest of the private directory today.)
alter table public.company_status enable row level security;

drop policy if exists "Authenticated users can read company_status" on public.company_status;
create policy "Authenticated users can read company_status"
  on public.company_status for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can write company_status" on public.company_status;
create policy "Authenticated users can write company_status"
  on public.company_status for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update company_status" on public.company_status;
create policy "Authenticated users can update company_status"
  on public.company_status for update
  to authenticated
  using (true)
  with check (true);
