-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Phase 1 foundation for lead-origin / opportunity-type classification on
-- /projects (RevHub). Scope: schema, canonical-type derivation, and real
-- server-side hiding of the new fields from Members - not the assignment-mix
-- engine or analytics charts, which come in a later phase.
--
-- IMPORTANT - READ BEFORE RUNNING:
-- This migration changes column-level privileges on company_signals,
-- companies, meetings, and closed_deals. After running it, any query that
-- does `select=*` against those tables from the app will start failing for
-- BOTH Owners and Members, because Postgres denies a whole SELECT if it
-- touches a column the caller doesn't have privilege on. The app code in
-- this same deploy has already been updated to use explicit column lists
-- instead of `select=*` for these tables - if you run this migration
-- without deploying that app change at the same time, /projects will break
-- for everyone until both are live. Deploy the app change first (it's
-- backward compatible with the old schema), then run this migration.

-- =========================================================================
-- 1. New columns
-- =========================================================================

alter table public.company_signals
  add column if not exists lead_origin text
    check (lead_origin in ('Active Hiring Signal', 'Direct Flexible-Work Opportunity')),
  add column if not exists opportunity_type text
    check (opportunity_type in (
      'Fractional Opportunity',
      'Contract Opportunity',
      'Contract-to-Hire',
      'Interim Opportunity',
      'Temporary Assignment',
      'Consulting Project',
      'Full-Time Hiring Signal'
    )),
  add column if not exists engagement_details text,
  -- Original, unnormalized values from the sheet - kept for debugging when
  -- a value doesn't cleanly map to an approved option.
  add column if not exists raw_lead_origin text,
  add column if not exists raw_opportunity_type text;

alter table public.companies
  add column if not exists canonical_lead_type text,
  add column if not exists all_signal_types text[],
  add column if not exists primary_signal_id uuid references public.company_signals(id) on delete set null,
  add column if not exists signal_count integer not null default 0,
  -- Set when a signal's type couldn't be confidently classified - surfaced
  -- to Owners for manual review, never shown to Members, never exposed as
  -- an eighth filter option.
  add column if not exists lead_type_needs_review boolean not null default false;

alter table public.meetings
  add column if not exists meeting_lead_type_snapshot text,
  add column if not exists meeting_lead_origin_snapshot text;

alter table public.closed_deals
  add column if not exists closed_won_lead_type_snapshot text,
  add column if not exists closed_won_lead_origin_snapshot text;

-- =========================================================================
-- 2. Owner check helper - reuses the same email-matched pattern already
--    used in lock_team_member_role_changes.sql, so there's one authoritative
--    definition of "is this caller an owner" instead of a second system.
-- =========================================================================

create or replace function public.is_owner()
returns boolean as $$
  select exists (
    select 1 from public.team_members tm
    where tm.email = auth.email() and tm.role = 'owner'
  );
$$ language sql security definer stable;

-- =========================================================================
-- 3. Canonical lead-type derivation
--    Hierarchy (highest buying intent first): Fractional > Contract-to-Hire
--    > Contract > Interim > Consulting > Temporary > Full-Time > Cold
--    Outreach. Cold Outreach is only canonical when a company has zero
--    signals with a classified opportunity_type.
-- =========================================================================

create or replace function public.recompute_company_lead_type(p_company_id uuid)
returns void as $$
declare
  v_types text[];
  v_canonical text;
  v_primary_id uuid;
  v_count integer;
  v_needs_review boolean;
begin
  select
    array_agg(distinct s.opportunity_type) filter (where s.opportunity_type is not null),
    count(*)
  into v_types, v_count
  from public.company_signals s
  where s.company_id = p_company_id;

  v_needs_review := exists (
    select 1 from public.company_signals s
    where s.company_id = p_company_id and s.opportunity_type is null
  );

  if v_types is null or array_length(v_types, 1) is null then
    v_canonical := 'Cold Outreach';
  else
    v_canonical := (
      select t from unnest(v_types) as t
      order by case t
        when 'Fractional Opportunity' then 1
        when 'Contract-to-Hire' then 2
        when 'Contract Opportunity' then 3
        when 'Interim Opportunity' then 4
        when 'Consulting Project' then 5
        when 'Temporary Assignment' then 6
        when 'Full-Time Hiring Signal' then 7
        else 8
      end
      limit 1
    );
  end if;

  select s.id into v_primary_id
  from public.company_signals s
  where s.company_id = p_company_id
    and (v_canonical = 'Cold Outreach' or s.opportunity_type = v_canonical)
  order by s.posted_date desc nulls last
  limit 1;

  update public.companies
  set canonical_lead_type = v_canonical,
      all_signal_types = v_types,
      primary_signal_id = v_primary_id,
      signal_count = coalesce(v_count, 0),
      lead_type_needs_review = v_needs_review
  where id = p_company_id;
end;
$$ language plpgsql security definer;

create or replace function public.trg_recompute_company_lead_type()
returns trigger as $$
begin
  if tg_op = 'DELETE' then
    if old.company_id is not null then
      perform public.recompute_company_lead_type(old.company_id);
    end if;
    return old;
  end if;

  if new.company_id is not null then
    perform public.recompute_company_lead_type(new.company_id);
  end if;
  if tg_op = 'UPDATE' and old.company_id is not null and old.company_id is distinct from new.company_id then
    perform public.recompute_company_lead_type(old.company_id);
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_company_signals_recompute_lead_type on public.company_signals;
create trigger trg_company_signals_recompute_lead_type
  after insert or update or delete on public.company_signals
  for each row execute function public.trg_recompute_company_lead_type();

-- One-time backfill for every company that exists today, including those
-- with zero signals (they become Cold Outreach).
do $$
declare
  r record;
begin
  for r in select id from public.companies loop
    perform public.recompute_company_lead_type(r.id);
  end loop;
end $$;

-- =========================================================================
-- 3b. Attribution snapshots - captured automatically by trigger at the
--     moment a meeting or closed deal is created, from whatever the
--     company's canonical_lead_type/lead_origin is *right then*. This runs
--     as a trigger (not client-side) because meetings are created by
--     whichever rep the company is assigned to, and that rep's session
--     can't read companies.canonical_lead_type directly once it's revoked
--     below - the trigger runs with the security-definer privileges of the
--     function that defines it, not the caller's.
--     Later signals never change these values - that's the whole point.
-- =========================================================================

create or replace function public.snapshot_meeting_lead_type()
returns trigger as $$
begin
  if new.company_id is not null then
    select
      c.canonical_lead_type,
      case when c.canonical_lead_type = 'Cold Outreach' then 'Cold Outreach' else s.lead_origin end
    into new.meeting_lead_type_snapshot, new.meeting_lead_origin_snapshot
    from public.companies c
    left join public.company_signals s on s.id = c.primary_signal_id
    where c.id = new.company_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_meetings_snapshot_lead_type on public.meetings;
create trigger trg_meetings_snapshot_lead_type
  before insert on public.meetings
  for each row execute function public.snapshot_meeting_lead_type();

create or replace function public.snapshot_closed_deal_lead_type()
returns trigger as $$
begin
  if new.company_id is not null then
    select
      c.canonical_lead_type,
      case when c.canonical_lead_type = 'Cold Outreach' then 'Cold Outreach' else s.lead_origin end
    into new.closed_won_lead_type_snapshot, new.closed_won_lead_origin_snapshot
    from public.companies c
    left join public.company_signals s on s.id = c.primary_signal_id
    where c.id = new.company_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_closed_deals_snapshot_lead_type on public.closed_deals;
create trigger trg_closed_deals_snapshot_lead_type
  before insert on public.closed_deals
  for each row execute function public.snapshot_closed_deal_lead_type();

-- =========================================================================
-- 4. Lock the new columns down from direct table access. Nobody - Owner or
--    Member - reads these columns off the base tables anymore; both roles
--    go through the RPCs below, which self-enforce is_owner() and return
--    nothing to a Member even if they call the RPC directly.
-- =========================================================================

revoke select (lead_origin, opportunity_type, engagement_details, raw_lead_origin, raw_opportunity_type)
  on public.company_signals from authenticated;

revoke select (canonical_lead_type, all_signal_types, primary_signal_id, signal_count, lead_type_needs_review)
  on public.companies from authenticated;

revoke select (meeting_lead_type_snapshot, meeting_lead_origin_snapshot)
  on public.meetings from authenticated;

revoke select (closed_won_lead_type_snapshot, closed_won_lead_origin_snapshot)
  on public.closed_deals from authenticated;

-- Inserts/updates to these columns still need to work (for the ingestion
-- script and for the app writing meeting/closed-deal snapshots at the
-- moment they happen), so only SELECT is revoked, not INSERT/UPDATE.

-- =========================================================================
-- 5. Owner-only RPCs - the only path to the fields revoked above.
-- =========================================================================

create or replace function public.get_owner_signal_fields()
returns table (
  id uuid,
  lead_origin text,
  opportunity_type text,
  engagement_details text,
  raw_lead_origin text,
  raw_opportunity_type text
) as $$
  select s.id, s.lead_origin, s.opportunity_type, s.engagement_details, s.raw_lead_origin, s.raw_opportunity_type
  from public.company_signals s
  where public.is_owner();
$$ language sql security definer stable;

create or replace function public.get_owner_company_lead_fields()
returns table (
  id uuid,
  canonical_lead_type text,
  all_signal_types text[],
  primary_signal_id uuid,
  signal_count integer,
  lead_type_needs_review boolean
) as $$
  select c.id, c.canonical_lead_type, c.all_signal_types, c.primary_signal_id, c.signal_count, c.lead_type_needs_review
  from public.companies c
  where public.is_owner();
$$ language sql security definer stable;

grant execute on function public.get_owner_signal_fields() to authenticated;
grant execute on function public.get_owner_company_lead_fields() to authenticated;
grant execute on function public.is_owner() to authenticated;
