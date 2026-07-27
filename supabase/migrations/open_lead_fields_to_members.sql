-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
--
-- Opens the Opportunity Intelligence panel's classification data (canonical
-- lead type, lead origin, engagement details, related signal count/types) up
-- to all authenticated team members on /projects, not just Owners - per
-- Chad's request that Members see this on the company detail page too.
--
-- lead_type_needs_review (companies) and raw_lead_origin/raw_opportunity_type
-- (company_signals) stay Owner-only and unchanged: lead_type_needs_review is
-- an internal manual-review flag (see leadtype_phase1_foundation.sql's
-- comment: "never shown to Members"), and the raw_* columns are debugging
-- fallbacks nothing in the UI reads for Members. get_owner_company_lead_fields
-- and get_owner_signal_fields are untouched - Owners keep using those for the
-- full field set.
--
-- These new RPCs read the same columns already revoked from direct table
-- SELECT in leadtype_phase1_foundation.sql; they're the Member-facing
-- counterpart to that migration's Owner-only RPCs, without the is_owner()
-- gate.

create or replace function public.get_member_company_lead_fields()
returns table (
  id uuid,
  canonical_lead_type text,
  all_signal_types text[],
  primary_signal_id uuid,
  signal_count integer
) as $$
  select c.id, c.canonical_lead_type, c.all_signal_types, c.primary_signal_id, c.signal_count
  from public.companies c;
$$ language sql security definer stable;

create or replace function public.get_member_signal_fields()
returns table (
  id uuid,
  lead_origin text,
  opportunity_type text,
  engagement_details text
) as $$
  select s.id, s.lead_origin, s.opportunity_type, s.engagement_details
  from public.company_signals s;
$$ language sql security definer stable;

grant execute on function public.get_member_company_lead_fields() to authenticated;
grant execute on function public.get_member_signal_fields() to authenticated;
