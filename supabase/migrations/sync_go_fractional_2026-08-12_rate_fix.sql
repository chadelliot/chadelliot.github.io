-- Correct detailed compensation from the live Go Fractional posting.
update public.company_signals
set engagement_details = $$Remote · Contract-to-Hire · ~20 hrs/week · $60–$80/hr contract phase + commission · Full-time conversion $100k–$130k base + variable$$,
    updated_at = now()
where lower(trim(company)) = $$go fractional$$
  and role_title = $$Head of Growth Marketing (Internal)$$
  and posted_date = date $$2026-03-09$$
  and source_url = $$https://www.gofractional.com/job/head-of-growth-marketing-cmmjdad9$$;