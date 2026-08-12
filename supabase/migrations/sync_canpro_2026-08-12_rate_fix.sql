-- Corrects CanPro's current GoFractional compensation band after fresh source verification.
-- Apply after sync_canpro_2026-08-12.sql.

update public.company_signals
set engagement_details = $$Remote · Fractional · Part-Time · 10–30 hrs/week · $125–$175/hr · Indefinite$$
where company = $$CanPro Roofing Partners$$
  and role_title = $$Fractional Marketing Director$$
  and posted_date = date $$2026-06-12$$
  and source_url = $$https://www.gofractional.com/job/toiture-perreault-inc-marketing-director-fractional$$;
