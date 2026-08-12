-- Sync Mechanism Ventures from the RevHub Target Accounts workbook.
-- Source rows verified 2026-08-12:
--   RevHub-Marketing: Isabel Plana, Breanden Beneschott, Ben Klecker
--   RevHub-Marketing Signals: Lifecycle Growth Consultant (GoFractional)
--
-- Idempotent source-of-truth sync. This intentionally does not overwrite
-- assignment, pipeline stage, outreach progress, meetings, notes/history,
-- or other user-maintained state.

insert into public.companies (name, normalized_name, industry, sector, website)
select
  $$Mechanism Ventures$$,
  $$mechanism ventures$$,
  $$Venture Studio / Growth$$,
  $$Portfolio Company Building / DTC Growth$$,
  $$https://mechanism.com$$
where not exists (
  select 1 from public.companies
  where lower(trim(name)) = $$mechanism ventures$$
     or normalized_name = $$mechanism ventures$$
);

update public.companies
set
  industry = $$Venture Studio / Growth$$,
  sector = $$Portfolio Company Building / DTC Growth$$,
  website = coalesce(nullif(website, ''), $$https://mechanism.com$$),
  updated_at = now()
where lower(trim(name)) = $$mechanism ventures$$
   or normalized_name = $$mechanism ventures$$;

-- Isabel Plana — Target 1
insert into public.project_contacts (
  company, company_id, contact_name, title, linkedin_url, email, priority,
  target_type_raw, outreach_angle, value_hypothesis,
  stakeholder_selection_reason, linkedin_connect_message, intro_message,
  follow_up_message, email_subject, email_intro_message, email_follow_up_1,
  email_follow_up_2, email_assumption_notice
)
select
  $$Mechanism Ventures$$,
  (select id from public.companies where normalized_name = $$mechanism ventures$$ limit 1),
  $$Isabel Plana$$,
  $$Chief Growth Officer$$,
  $$https://www.linkedin.com/in/isabel-plana-79a36763/$$,
  $$isabel@mechanism.com$$,
  $$A$$,
  $$Target 1$$,
  $$Mechanism is hiring a freelance Lifecycle Growth Consultant reporting directly to the Chief Growth Officer to own lifecycle strategy, systems and revenue across its portfolio. Isabel is the direct functional sponsor and the executive accountable for how lifecycle capabilities compound profitable growth across portfolio companies.$$, 
  $$RevHub can help Isabel turn the lifecycle-consultant mandate into a broader portfolio growth operating system connecting customer journeys, segmentation, experimentation, retention economics, marketing data, executive reporting and reusable playbooks across multiple companies.$$, 
  $$Direct functional sponsor. Mechanism’s live Lifecycle Growth Consultant role reports to the Chief Growth Officer, and Mechanism’s current team page confirms Isabel Plana in that role with responsibility for accelerating portfolio-company growth and profitability.$$, 
  $$Isabel, Mechanism’s Lifecycle Growth Consultant search stood out. The portfolio-wide mandate around journeys, segmentation, retention and revenue is close to the commercial growth systems we build across marketing, data and execution. I’d value connecting.$$, 
  $$Thanks for connecting, Isabel.\n\nI saw Mechanism’s search for a Lifecycle Growth Consultant reporting directly to the Chief Growth Officer. The mandate goes beyond email execution—it owns lifecycle strategy, segmentation, technical infrastructure, retention and revenue across a portfolio of companies.\n\nThat portfolio-level operating challenge is where RevHub can add leverage. My partner and I help organizations connect customer intelligence, segmentation, lifecycle activation, CRM/data, experimentation and executive reporting into reusable commercial growth systems.\n\nWould you be open to a conversation about how Mechanism is standardizing the lifecycle engine across portfolio companies?$$,
  $$Isabel, following up because a useful first phase could map the common lifecycle architecture across the portfolio—customer states, segments, triggers, journeys, KPIs, experimentation rules and reporting—while preserving company-specific execution. Would a brief conversation be worthwhile?$$,
  $$Mechanism’s portfolio-wide lifecycle growth system$$,
  $$Hi Isabel,\n\nI saw Mechanism’s live search for a Lifecycle Growth Consultant to own lifecycle strategy, systems and revenue across the portfolio.\n\nThe opportunity I see is extending that mandate into a reusable growth operating model: customer states and segmentation, lifecycle journeys, experimentation, retention economics, data infrastructure and executive reporting that can be deployed across companies without forcing every team to reinvent the system.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and activation capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  $$Hi Isabel,\n\nA useful first deliverable could be a portfolio lifecycle map defining shared customer states, trigger logic, journey standards, measurement and what stays company-specific.\n\nWould a brief conversation next week be worthwhile?$$,
  $$Hi Isabel,\n\nClosing the loop. The opportunity I see is helping Mechanism turn this lifecycle hire into a reusable capability that compounds across the portfolio rather than a one-company-at-a-time build.\n\nIs there a 20-minute window worth holding?$$,
  $$Business email verified through current commercial data; no inferred email pattern was used.$$
where not exists (
  select 1 from public.project_contacts
  where (lower(trim(company)) = $$mechanism ventures$$ and lower(trim(contact_name)) = $$isabel plana$$)
     or linkedin_url = $$https://www.linkedin.com/in/isabel-plana-79a36763/$$
     or lower(email) = $$isabel@mechanism.com$$
);

update public.project_contacts set
  company_id = (select id from public.companies where normalized_name = $$mechanism ventures$$ limit 1),
  title = $$Chief Growth Officer$$,
  linkedin_url = $$https://www.linkedin.com/in/isabel-plana-79a36763/$$,
  email = $$isabel@mechanism.com$$,
  priority = $$A$$,
  target_type_raw = $$Target 1$$,
  outreach_angle = $$Mechanism is hiring a freelance Lifecycle Growth Consultant reporting directly to the Chief Growth Officer to own lifecycle strategy, systems and revenue across its portfolio. Isabel is the direct functional sponsor and the executive accountable for how lifecycle capabilities compound profitable growth across portfolio companies.$$, 
  value_hypothesis = $$RevHub can help Isabel turn the lifecycle-consultant mandate into a broader portfolio growth operating system connecting customer journeys, segmentation, experimentation, retention economics, marketing data, executive reporting and reusable playbooks across multiple companies.$$, 
  stakeholder_selection_reason = $$Direct functional sponsor. Mechanism’s live Lifecycle Growth Consultant role reports to the Chief Growth Officer, and Mechanism’s current team page confirms Isabel Plana in that role with responsibility for accelerating portfolio-company growth and profitability.$$, 
  linkedin_connect_message = $$Isabel, Mechanism’s Lifecycle Growth Consultant search stood out. The portfolio-wide mandate around journeys, segmentation, retention and revenue is close to the commercial growth systems we build across marketing, data and execution. I’d value connecting.$$, 
  intro_message = $$Thanks for connecting, Isabel.\n\nI saw Mechanism’s search for a Lifecycle Growth Consultant reporting directly to the Chief Growth Officer. The mandate goes beyond email execution—it owns lifecycle strategy, segmentation, technical infrastructure, retention and revenue across a portfolio of companies.\n\nThat portfolio-level operating challenge is where RevHub can add leverage. My partner and I help organizations connect customer intelligence, segmentation, lifecycle activation, CRM/data, experimentation and executive reporting into reusable commercial growth systems.\n\nWould you be open to a conversation about how Mechanism is standardizing the lifecycle engine across portfolio companies?$$,
  follow_up_message = $$Isabel, following up because a useful first phase could map the common lifecycle architecture across the portfolio—customer states, segments, triggers, journeys, KPIs, experimentation rules and reporting—while preserving company-specific execution. Would a brief conversation be worthwhile?$$,
  email_subject = $$Mechanism’s portfolio-wide lifecycle growth system$$,
  email_intro_message = $$Hi Isabel,\n\nI saw Mechanism’s live search for a Lifecycle Growth Consultant to own lifecycle strategy, systems and revenue across the portfolio.\n\nThe opportunity I see is extending that mandate into a reusable growth operating model: customer states and segmentation, lifecycle journeys, experimentation, retention economics, data infrastructure and executive reporting that can be deployed across companies without forcing every team to reinvent the system.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and activation capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  email_follow_up_1 = $$Hi Isabel,\n\nA useful first deliverable could be a portfolio lifecycle map defining shared customer states, trigger logic, journey standards, measurement and what stays company-specific.\n\nWould a brief conversation next week be worthwhile?$$,
  email_follow_up_2 = $$Hi Isabel,\n\nClosing the loop. The opportunity I see is helping Mechanism turn this lifecycle hire into a reusable capability that compounds across the portfolio rather than a one-company-at-a-time build.\n\nIs there a 20-minute window worth holding?$$,
  email_assumption_notice = $$Business email verified through current commercial data; no inferred email pattern was used.$$
where lower(trim(company)) = $$mechanism ventures$$ and lower(trim(contact_name)) = $$isabel plana$$;

-- Breanden Beneschott — Target 2
insert into public.project_contacts (
  company, company_id, contact_name, title, linkedin_url, email, priority,
  target_type_raw, outreach_angle, value_hypothesis,
  stakeholder_selection_reason, linkedin_connect_message, intro_message,
  follow_up_message, email_subject, email_intro_message, email_follow_up_1,
  email_follow_up_2, email_assumption_notice
)
select
  $$Mechanism Ventures$$,
  (select id from public.companies where normalized_name = $$mechanism ventures$$ limit 1),
  $$Breanden Beneschott$$,
  $$Cofounder & CEO$$,
  $$https://www.linkedin.com/in/breanden-beneschott-081a462/$$,
  $$breanden@mechanism.com$$,
  $$A$$,
  $$Target 2$$,
  $$Mechanism’s Lifecycle Growth Consultant search signals continued investment in a standardized growth operating system across its portfolio. As CEO and cofounder, Breanden owns the company-building model and the economics of turning repeatable growth systems into profitable portfolio companies.$$, 
  $$RevHub can help Breanden codify a cross-portfolio commercial intelligence and activation layer connecting customer economics, lifecycle, acquisition, experimentation, operating KPIs and decision cadence so growth learnings compound from one venture to the next.$$, 
  $$Executive sponsor for Mechanism’s company-building operating model. Mechanism’s current site confirms Breanden as CEO & Cofounder, while the lifecycle consultant role is explicitly portfolio-wide and designed to compound growth across multiple ventures.$$, 
  $$Breanden, Mechanism’s lifecycle consultant search caught my attention because it reflects the same idea behind our work: build reusable growth systems instead of solving each commercial problem from scratch. I’d value connecting.$$, 
  $$Thanks for connecting, Breanden.\n\nI saw Mechanism’s search for a Lifecycle Growth Consultant to build lifecycle engines across the portfolio. What stood out is the operating-model implication: the value is not only improving retention in one company, but codifying what can be reused across many companies.\n\nThrough RevHub, my partner and I work on that broader commercial layer—customer intelligence, segmentation, marketing and sales activation, revenue operations, analytics and executive decision systems.\n\nWould you be open to a conversation about where Mechanism still sees opportunities to standardize commercial growth capabilities across the portfolio?$$,
  $$Breanden, following up because the lifecycle role suggests a broader opportunity to capture cross-company learning in a shared commercial system—common metrics, customer states, test frameworks, decision rules and reusable activation patterns. Would a brief conversation be worthwhile?$$,
  $$Making growth learnings compound across Mechanism’s portfolio$$,
  $$Hi Breanden,\n\nI saw Mechanism’s live search for a Lifecycle Growth Consultant to build revenue-driving lifecycle systems across the portfolio.\n\nThe broader opportunity looks like codifying the commercial capabilities that should compound from venture to venture—customer states, segmentation, acquisition and retention economics, experimentation, CRM/data standards and executive performance signals.\n\nThat is close to the work we do through RevHub, combining commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  $$Hi Breanden,\n\nOne practical first step could identify which commercial growth components should be shared across Mechanism companies versus rebuilt locally, then define the data, KPIs and operating cadence behind them.\n\nWould a brief conversation next week be worthwhile?$$,
  $$Hi Breanden,\n\nClosing the loop. I see a strong fit around helping Mechanism make commercial-growth capabilities increasingly reusable as the portfolio scales.\n\nIs there a 20-minute window worth holding?$$,
  $$Business email is publicly listed by Breanden on his personal site and independently verified through current commercial data; no inferred pattern was used.$$
where not exists (
  select 1 from public.project_contacts
  where (lower(trim(company)) = $$mechanism ventures$$ and lower(trim(contact_name)) = $$breanden beneschott$$)
     or linkedin_url = $$https://www.linkedin.com/in/breanden-beneschott-081a462/$$
     or lower(email) = $$breanden@mechanism.com$$
);

update public.project_contacts set
  company_id = (select id from public.companies where normalized_name = $$mechanism ventures$$ limit 1),
  title = $$Cofounder & CEO$$,
  linkedin_url = $$https://www.linkedin.com/in/breanden-beneschott-081a462/$$,
  email = $$breanden@mechanism.com$$,
  priority = $$A$$,
  target_type_raw = $$Target 2$$,
  outreach_angle = $$Mechanism’s Lifecycle Growth Consultant search signals continued investment in a standardized growth operating system across its portfolio. As CEO and cofounder, Breanden owns the company-building model and the economics of turning repeatable growth systems into profitable portfolio companies.$$, 
  value_hypothesis = $$RevHub can help Breanden codify a cross-portfolio commercial intelligence and activation layer connecting customer economics, lifecycle, acquisition, experimentation, operating KPIs and decision cadence so growth learnings compound from one venture to the next.$$, 
  stakeholder_selection_reason = $$Executive sponsor for Mechanism’s company-building operating model. Mechanism’s current site confirms Breanden as CEO & Cofounder, while the lifecycle consultant role is explicitly portfolio-wide and designed to compound growth across multiple ventures.$$, 
  linkedin_connect_message = $$Breanden, Mechanism’s lifecycle consultant search caught my attention because it reflects the same idea behind our work: build reusable growth systems instead of solving each commercial problem from scratch. I’d value connecting.$$, 
  intro_message = $$Thanks for connecting, Breanden.\n\nI saw Mechanism’s search for a Lifecycle Growth Consultant to build lifecycle engines across the portfolio. What stood out is the operating-model implication: the value is not only improving retention in one company, but codifying what can be reused across many companies.\n\nThrough RevHub, my partner and I work on that broader commercial layer—customer intelligence, segmentation, marketing and sales activation, revenue operations, analytics and executive decision systems.\n\nWould you be open to a conversation about where Mechanism still sees opportunities to standardize commercial growth capabilities across the portfolio?$$,
  follow_up_message = $$Breanden, following up because the lifecycle role suggests a broader opportunity to capture cross-company learning in a shared commercial system—common metrics, customer states, test frameworks, decision rules and reusable activation patterns. Would a brief conversation be worthwhile?$$,
  email_subject = $$Making growth learnings compound across Mechanism’s portfolio$$,
  email_intro_message = $$Hi Breanden,\n\nI saw Mechanism’s live search for a Lifecycle Growth Consultant to build revenue-driving lifecycle systems across the portfolio.\n\nThe broader opportunity looks like codifying the commercial capabilities that should compound from venture to venture—customer states, segmentation, acquisition and retention economics, experimentation, CRM/data standards and executive performance signals.\n\nThat is close to the work we do through RevHub, combining commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  email_follow_up_1 = $$Hi Breanden,\n\nOne practical first step could identify which commercial growth components should be shared across Mechanism companies versus rebuilt locally, then define the data, KPIs and operating cadence behind them.\n\nWould a brief conversation next week be worthwhile?$$,
  email_follow_up_2 = $$Hi Breanden,\n\nClosing the loop. I see a strong fit around helping Mechanism make commercial-growth capabilities increasingly reusable as the portfolio scales.\n\nIs there a 20-minute window worth holding?$$,
  email_assumption_notice = $$Business email is publicly listed by Breanden on his personal site and independently verified through current commercial data; no inferred pattern was used.$$
where lower(trim(company)) = $$mechanism ventures$$ and lower(trim(contact_name)) = $$breanden beneschott$$;

-- Ben Klecker — Target 3
insert into public.project_contacts (
  company, company_id, contact_name, title, linkedin_url, email, priority,
  target_type_raw, outreach_angle, value_hypothesis,
  stakeholder_selection_reason, linkedin_connect_message, intro_message,
  follow_up_message, email_subject, email_intro_message, email_follow_up_1,
  email_follow_up_2, email_assumption_notice
)
select
  $$Mechanism Ventures$$,
  (select id from public.companies where normalized_name = $$mechanism ventures$$ limit 1),
  $$Ben Klecker$$,
  $$Head of Growth$$,
  $$https://www.linkedin.com/in/benjamin-klecker/$$,
  $$bklecker@mechanism.com$$,
  $$B$$,
  $$Target 3$$,
  $$Current commercial profile data places Ben in a Head of Growth role at Mechanism. The lifecycle consultant will work inside the same growth system, making Ben a direct operating stakeholder in how lifecycle, acquisition, experimentation and portfolio-company growth execution connect.$$, 
  $$RevHub can help Ben connect acquisition and lifecycle into one full-funnel growth system, with shared segmentation, experimentation, customer economics, measurement and operating rhythms that make channel and retention decisions more consistent across ventures.$$, 
  $$Direct growth-operations stakeholder. Current commercial profile data shows Ben as Head of Growth at Mechanism, and Mechanism’s current careers materials identify him as a senior growth leader working with founders to unlock channels and scale portfolio companies.$$, 
  $$Ben, Mechanism’s Lifecycle Growth Consultant search stood out. Connecting acquisition, lifecycle, experimentation and customer economics across multiple ventures is exactly the kind of growth operating-system work we focus on. I’d value connecting.$$, 
  $$Thanks for connecting, Ben.\n\nI saw Mechanism’s search for a Lifecycle Growth Consultant to build lifecycle engines across the portfolio.\n\nGiven your growth remit, the opportunity that stood out is connecting acquisition and lifecycle rather than managing them as separate motions: shared segmentation, customer economics, test design, retention signals, channel decisions and performance reporting.\n\nThrough RevHub, my partner and I help build those integrated commercial growth systems across marketing, data, RevOps and execution.\n\nWould you be open to a conversation about how Mechanism is connecting acquisition and lifecycle across portfolio companies?$$,
  $$Ben, following up because a useful first phase could connect acquisition cohorts to lifecycle behavior and customer economics, then create shared testing and reporting standards across ventures. Would a brief conversation be useful?$$,
  $$Connecting acquisition and lifecycle across Mechanism’s portfolio$$,
  $$Hi Ben,\n\nI saw Mechanism’s live search for a Lifecycle Growth Consultant to own customer journeys and retention across the portfolio.\n\nGiven your growth remit, the leverage I see is connecting acquisition and lifecycle into one system: segment and cohort economics, channel quality, lifecycle triggers, experimentation and reporting that show not only what acquires customers, but what creates durable value.\n\nThrough RevHub, my partner and I combine growth strategy with hands-on marketing, RevOps and analytics capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  $$Hi Ben,\n\nA useful first deliverable could link acquisition cohorts, lifecycle behavior, retention and contribution economics into a shared testing and reporting model across portfolio companies.\n\nWould a brief conversation next week be worthwhile?$$,
  $$Hi Ben,\n\nClosing the loop. The opportunity I see is helping Mechanism connect acquisition and lifecycle learning so each portfolio company benefits from the others’ experiments.\n\nIs there a 20-minute window worth holding?$$,
  $$Business email verified through current commercial data; no inferred email pattern was used.$$
where not exists (
  select 1 from public.project_contacts
  where (lower(trim(company)) = $$mechanism ventures$$ and lower(trim(contact_name)) = $$ben klecker$$)
     or linkedin_url = $$https://www.linkedin.com/in/benjamin-klecker/$$
     or lower(email) = $$bklecker@mechanism.com$$
);

update public.project_contacts set
  company_id = (select id from public.companies where normalized_name = $$mechanism ventures$$ limit 1),
  title = $$Head of Growth$$,
  linkedin_url = $$https://www.linkedin.com/in/benjamin-klecker/$$,
  email = $$bklecker@mechanism.com$$,
  priority = $$B$$,
  target_type_raw = $$Target 3$$,
  outreach_angle = $$Current commercial profile data places Ben in a Head of Growth role at Mechanism. The lifecycle consultant will work inside the same growth system, making Ben a direct operating stakeholder in how lifecycle, acquisition, experimentation and portfolio-company growth execution connect.$$, 
  value_hypothesis = $$RevHub can help Ben connect acquisition and lifecycle into one full-funnel growth system, with shared segmentation, experimentation, customer economics, measurement and operating rhythms that make channel and retention decisions more consistent across ventures.$$, 
  stakeholder_selection_reason = $$Direct growth-operations stakeholder. Current commercial profile data shows Ben as Head of Growth at Mechanism, and Mechanism’s current careers materials identify him as a senior growth leader working with founders to unlock channels and scale portfolio companies.$$, 
  linkedin_connect_message = $$Ben, Mechanism’s Lifecycle Growth Consultant search stood out. Connecting acquisition, lifecycle, experimentation and customer economics across multiple ventures is exactly the kind of growth operating-system work we focus on. I’d value connecting.$$, 
  intro_message = $$Thanks for connecting, Ben.\n\nI saw Mechanism’s search for a Lifecycle Growth Consultant to build lifecycle engines across the portfolio.\n\nGiven your growth remit, the opportunity that stood out is connecting acquisition and lifecycle rather than managing them as separate motions: shared segmentation, customer economics, test design, retention signals, channel decisions and performance reporting.\n\nThrough RevHub, my partner and I help build those integrated commercial growth systems across marketing, data, RevOps and execution.\n\nWould you be open to a conversation about how Mechanism is connecting acquisition and lifecycle across portfolio companies?$$,
  follow_up_message = $$Ben, following up because a useful first phase could connect acquisition cohorts to lifecycle behavior and customer economics, then create shared testing and reporting standards across ventures. Would a brief conversation be useful?$$,
  email_subject = $$Connecting acquisition and lifecycle across Mechanism’s portfolio$$,
  email_intro_message = $$Hi Ben,\n\nI saw Mechanism’s live search for a Lifecycle Growth Consultant to own customer journeys and retention across the portfolio.\n\nGiven your growth remit, the leverage I see is connecting acquisition and lifecycle into one system: segment and cohort economics, channel quality, lifecycle triggers, experimentation and reporting that show not only what acquires customers, but what creates durable value.\n\nThrough RevHub, my partner and I combine growth strategy with hands-on marketing, RevOps and analytics capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  email_follow_up_1 = $$Hi Ben,\n\nA useful first deliverable could link acquisition cohorts, lifecycle behavior, retention and contribution economics into a shared testing and reporting model across portfolio companies.\n\nWould a brief conversation next week be worthwhile?$$,
  email_follow_up_2 = $$Hi Ben,\n\nClosing the loop. The opportunity I see is helping Mechanism connect acquisition and lifecycle learning so each portfolio company benefits from the others’ experiments.\n\nIs there a 20-minute window worth holding?$$,
  email_assumption_notice = $$Business email verified through current commercial data; no inferred email pattern was used.$$
where lower(trim(company)) = $$mechanism ventures$$ and lower(trim(contact_name)) = $$ben klecker$$;

insert into public.company_signals (
  company, company_id, role_title, posted_date, source_url, notes,
  lead_origin, opportunity_type, engagement_details,
  raw_lead_origin, raw_opportunity_type
)
values (
  $$Mechanism Ventures$$,
  (select id from public.companies where normalized_name = $$mechanism ventures$$ limit 1),
  $$Lifecycle Growth Consultant$$,
  date $$2026-07-20$$,
  $$https://www.gofractional.com/job/mechanism-ventures-lifecycle-growth-consultant$$,
  $$SOURCE PRIORITY 1. Live named-company flexible-work opportunity. Senior lifecycle operator owns strategy, systems and revenue behind customer journeys across Mechanism’s portfolio of DTC companies, including segmentation, technical infrastructure, retention and reusable lifecycle engines. Reports directly to the Chief Growth Officer.$$, 
  $$Direct Flexible-Work Opportunity$$,
  $$Consulting Project$$,
  $$Remote US · Freelance / Consulting · 15–20 hrs/week · $130–$150/hr · Indefinite$$,
  $$Direct Flexible-Work Opportunity$$,
  $$Consulting Project$$
)
on conflict (company, role_title, posted_date, source_url)
do update set
  company_id = excluded.company_id,
  notes = excluded.notes,
  lead_origin = excluded.lead_origin,
  opportunity_type = excluded.opportunity_type,
  engagement_details = excluded.engagement_details,
  raw_lead_origin = excluded.raw_lead_origin,
  raw_opportunity_type = excluded.raw_opportunity_type;