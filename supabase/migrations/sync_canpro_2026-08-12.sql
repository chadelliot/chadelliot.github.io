-- Sync CanPro Roofing Partners from the RevHub Target Accounts workbook.
-- Source rows verified on 2026-08-12:
--   RevHub-Marketing: Kelly Wade, Pranit Tukrel, Rav Bance
--   RevHub-Marketing Signals: Fractional Marketing Director (GoFractional)
--
-- This migration is intentionally idempotent and only updates source-of-truth
-- research/outreach fields. It does NOT overwrite assignment, pipeline stage,
-- outreach progress, meetings, notes/history, or other user-maintained state.

-- Ensure the canonical company exists.
insert into public.companies (name, normalized_name, industry, sector, website)
select
  $$CanPro Roofing Partners$$,
  $$canpro roofing partners$$,
  $$Facilities Services$$,
  $$Commercial Roofing / Multi-Entity Platform$$,
  $$https://canproroofing.com$$
where not exists (
  select 1 from public.companies
  where lower(trim(name)) = $$canpro roofing partners$$
     or normalized_name = $$canpro roofing partners$$
);

update public.companies
set
  industry = $$Facilities Services$$,
  sector = $$Commercial Roofing / Multi-Entity Platform$$,
  website = coalesce(nullif(website, ''), $$https://canproroofing.com$$),
  updated_at = now()
where lower(trim(name)) = $$canpro roofing partners$$
   or normalized_name = $$canpro roofing partners$$;

-- Kelly Wade — Target 1
insert into public.project_contacts (
  company, company_id, contact_name, title, linkedin_url, email, priority,
  target_type_raw, outreach_angle, value_hypothesis,
  stakeholder_selection_reason, linkedin_connect_message, intro_message,
  follow_up_message, email_subject, email_intro_message, email_follow_up_1,
  email_follow_up_2, email_assumption_notice
)
select
  $$CanPro Roofing Partners$$,
  (select id from public.companies where normalized_name = $$canpro roofing partners$$ limit 1),
  $$Kelly Wade$$,
  $$Chief Executive Officer$$,
  $$https://www.linkedin.com/in/kellywade14/$$,
  $$kelly.wade@canproroofing.com$$,
  $$A$$,
  $$Target 1$$,
  $$CanPro is hiring a fractional Marketing Director to build the marketing function from zero and report directly to the CEO. As CEO of an acquisitive, multi-entity roofing platform, Kelly is the primary sponsor for whether the new marketing capability becomes a scalable commercial system across operating companies.$$, 
  $$RevHub can help Kelly turn the “marketing in a box” mandate into a reusable growth operating model connecting market and segment priorities, HubSpot governance, B2B demand, local-company activation, commercial handoffs, reporting and operating cadence as CanPro adds partners.$$, 
  $$Primary hiring sponsor and functional owner. The live fractional Marketing Director role reports directly to the CEO and is charged with building CanPro’s marketing function from zero and creating a scalable playbook across operating companies. CanPro’s current leadership page confirms Kelly as CEO.$$, 
  $$Kelly, CanPro’s fractional Marketing Director search stood out. Building a zero-to-one marketing function and a reusable playbook across operating companies is very close to the commercial growth systems I build. I’d value connecting.$$, 
  $$Thanks for connecting, Kelly.\n\nI saw CanPro’s search for a fractional Marketing Director reporting directly to the CEO. The mandate is unusually clear: build the marketing function from zero, create a reusable “marketing in a box” playbook across operating companies, and personally lead HubSpot email, segmentation, B2B campaigns, freelancers, budget and performance reporting.\n\nThat kind of platform build is where RevHub can add leverage. My partner and I help multi-entity businesses connect customer and market intelligence, segmentation, marketing execution, CRM, commercial handoffs, analytics and executive reporting into one reusable growth operating system.\n\nWould you be open to a 15-minute conversation about making the fractional marketing build scalable across CanPro’s partner companies?$$,
  $$Kelly, following up because a useful first phase could define the platform-wide marketing operating model: priority customer segments, shared vs. local campaigns, HubSpot governance, partner-company activation, lead handoffs, measures and CEO reporting. Would a brief conversation be worthwhile?$$,
  $$Making CanPro’s fractional marketing build scalable$$,
  $$Hi Kelly,\n\nI saw CanPro’s live search for a fractional Marketing Director to build the function from zero and create a scalable “marketing in a box” model across operating companies.\n\nThe opportunity I see is making that playbook more than a set of campaigns—connecting customer and segment priorities, HubSpot governance, local-company activation, commercial handoffs, performance measures and executive reporting into one operating system CanPro can deploy as the platform grows.\n\nThrough RevHub, my partner and I combine senior commercial strategy with hands-on marketing, RevOps and analytics capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  $$Hi Kelly,\n\nOne practical deliverable could be a platform marketing map defining what is centralized, what stays local, how HubSpot and lead flow are governed, which B2B plays are repeatable, and what KPIs the CEO and operating companies use together.\n\nWould a brief conversation next week be worthwhile?$$,
  $$Hi Kelly,\n\nClosing the loop. The opportunity I see is helping CanPro use this fractional hire to leave behind a commercial growth system that becomes easier—not harder—to scale with each partner company.\n\nIs there a 20-minute window worth holding?$$,
  $$Business email verified through current commercial data; no inferred email pattern was used.$$
where not exists (
  select 1 from public.project_contacts
  where (lower(trim(company)) = $$canpro roofing partners$$ and lower(trim(contact_name)) = $$kelly wade$$)
     or linkedin_url = $$https://www.linkedin.com/in/kellywade14/$$
     or lower(email) = $$kelly.wade@canproroofing.com$$
);

update public.project_contacts set
  company_id = (select id from public.companies where normalized_name = $$canpro roofing partners$$ limit 1),
  title = $$Chief Executive Officer$$,
  linkedin_url = $$https://www.linkedin.com/in/kellywade14/$$,
  email = $$kelly.wade@canproroofing.com$$,
  priority = $$A$$,
  target_type_raw = $$Target 1$$,
  outreach_angle = $$CanPro is hiring a fractional Marketing Director to build the marketing function from zero and report directly to the CEO. As CEO of an acquisitive, multi-entity roofing platform, Kelly is the primary sponsor for whether the new marketing capability becomes a scalable commercial system across operating companies.$$, 
  value_hypothesis = $$RevHub can help Kelly turn the “marketing in a box” mandate into a reusable growth operating model connecting market and segment priorities, HubSpot governance, B2B demand, local-company activation, commercial handoffs, reporting and operating cadence as CanPro adds partners.$$, 
  stakeholder_selection_reason = $$Primary hiring sponsor and functional owner. The live fractional Marketing Director role reports directly to the CEO and is charged with building CanPro’s marketing function from zero and creating a scalable playbook across operating companies. CanPro’s current leadership page confirms Kelly as CEO.$$, 
  linkedin_connect_message = $$Kelly, CanPro’s fractional Marketing Director search stood out. Building a zero-to-one marketing function and a reusable playbook across operating companies is very close to the commercial growth systems I build. I’d value connecting.$$, 
  intro_message = $$Thanks for connecting, Kelly.\n\nI saw CanPro’s search for a fractional Marketing Director reporting directly to the CEO. The mandate is unusually clear: build the marketing function from zero, create a reusable “marketing in a box” playbook across operating companies, and personally lead HubSpot email, segmentation, B2B campaigns, freelancers, budget and performance reporting.\n\nThat kind of platform build is where RevHub can add leverage. My partner and I help multi-entity businesses connect customer and market intelligence, segmentation, marketing execution, CRM, commercial handoffs, analytics and executive reporting into one reusable growth operating system.\n\nWould you be open to a 15-minute conversation about making the fractional marketing build scalable across CanPro’s partner companies?$$,
  follow_up_message = $$Kelly, following up because a useful first phase could define the platform-wide marketing operating model: priority customer segments, shared vs. local campaigns, HubSpot governance, partner-company activation, lead handoffs, measures and CEO reporting. Would a brief conversation be worthwhile?$$,
  email_subject = $$Making CanPro’s fractional marketing build scalable$$,
  email_intro_message = $$Hi Kelly,\n\nI saw CanPro’s live search for a fractional Marketing Director to build the function from zero and create a scalable “marketing in a box” model across operating companies.\n\nThe opportunity I see is making that playbook more than a set of campaigns—connecting customer and segment priorities, HubSpot governance, local-company activation, commercial handoffs, performance measures and executive reporting into one operating system CanPro can deploy as the platform grows.\n\nThrough RevHub, my partner and I combine senior commercial strategy with hands-on marketing, RevOps and analytics capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  email_follow_up_1 = $$Hi Kelly,\n\nOne practical deliverable could be a platform marketing map defining what is centralized, what stays local, how HubSpot and lead flow are governed, which B2B plays are repeatable, and what KPIs the CEO and operating companies use together.\n\nWould a brief conversation next week be worthwhile?$$,
  email_follow_up_2 = $$Hi Kelly,\n\nClosing the loop. The opportunity I see is helping CanPro use this fractional hire to leave behind a commercial growth system that becomes easier—not harder—to scale with each partner company.\n\nIs there a 20-minute window worth holding?$$,
  email_assumption_notice = $$Business email verified through current commercial data; no inferred email pattern was used.$$
where lower(trim(company)) = $$canpro roofing partners$$ and lower(trim(contact_name)) = $$kelly wade$$;

-- Pranit Tukrel — Target 2
insert into public.project_contacts (
  company, company_id, contact_name, title, linkedin_url, email, priority,
  target_type_raw, outreach_angle, value_hypothesis,
  stakeholder_selection_reason, linkedin_connect_message, intro_message,
  follow_up_message, email_subject, email_intro_message, email_follow_up_1,
  email_follow_up_2, email_assumption_notice
)
select
  $$CanPro Roofing Partners$$,
  (select id from public.companies where normalized_name = $$canpro roofing partners$$ limit 1),
  $$Pranit Tukrel$$,
  $$Vice President, Commercial Growth$$,
  $$https://www.linkedin.com/in/pranit-tukrel-a201a161/$$,
  $$pranit.tukrel@canproroofing.com$$,
  $$A$$,
  $$Target 2$$,
  $$CanPro’s fractional marketing build is designed to support a growing platform of partner companies. As Vice President, Commercial Growth, Pranit is directly affected by how market segmentation, partner narratives, B2B demand, HubSpot activity and commercial partnerships translate into scalable growth.$$, 
  $$RevHub can help Pranit connect acquisition and partnership growth to a repeatable commercial activation model across target markets, customer segments, partner companies, CRM, campaigns, business-development handoffs and pipeline visibility.$$, 
  $$Senior commercial-growth stakeholder. CanPro’s current leadership page identifies Pranit as Vice President, Commercial Growth, while the fractional marketing mandate is explicitly designed to create repeatable platform-wide B2B activation and support growth across partner companies.$$, 
  $$Pranit, CanPro’s fractional Marketing Director search caught my attention. The “marketing in a box” mandate looks tightly connected to commercial growth and partner-company scaling. I build those integrated GTM systems and would value connecting.$$, 
  $$Thanks for connecting, Pranit.\n\nI saw CanPro’s search for a fractional Marketing Director to build the function from zero and create a reusable platform playbook across operating companies.\n\nGiven your Commercial Growth remit, the part that stood out is the opportunity to connect the partner-growth strategy to repeatable market activation: customer segmentation, B2B narratives, HubSpot campaigns, lead flow, BD follow-up and visibility into which plays work across companies.\n\nThrough RevHub, my partner and I help businesses connect commercial strategy, marketing, CRM, sales execution and analytics into one operating system.\n\nWould you be open to a conversation about the commercial-growth layer behind CanPro’s new marketing function?$$,
  $$Pranit, following up because a useful first step could map priority markets and customer groups to partner-company propositions, campaigns, HubSpot ownership, BD actions and pipeline measures so the playbook compounds as CanPro grows. Would a brief conversation be useful?$$,
  $$Connecting CanPro’s marketing playbook to commercial growth$$,
  $$Hi Pranit,\n\nI saw CanPro’s live search for a fractional Marketing Director to build the marketing function from zero and create a reusable playbook across operating companies.\n\nGiven your Commercial Growth remit, the larger opportunity is connecting that playbook to the platform-growth system: target markets and segments, partner-company propositions, B2B campaigns, HubSpot governance, lead flow, business-development actions and pipeline visibility.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  $$Hi Pranit,\n\nA useful first phase could map priority markets and customer groups to partner-company propositions, campaigns, HubSpot ownership, BD actions and pipeline measures so the playbook compounds as CanPro grows.\n\nWould a brief conversation next week be worthwhile?$$,
  $$Hi Pranit,\n\nClosing the loop. The opportunity I see is helping CanPro connect its new marketing function directly to the commercial-growth engine supporting partner companies and national scale.\n\nIs there a 20-minute window worth holding?$$,
  $$Business email verified through current commercial data; no inferred email pattern was used.$$
where not exists (
  select 1 from public.project_contacts
  where (lower(trim(company)) = $$canpro roofing partners$$ and lower(trim(contact_name)) = $$pranit tukrel$$)
     or linkedin_url = $$https://www.linkedin.com/in/pranit-tukrel-a201a161/$$
     or lower(email) = $$pranit.tukrel@canproroofing.com$$
);

update public.project_contacts set
  company_id = (select id from public.companies where normalized_name = $$canpro roofing partners$$ limit 1),
  title = $$Vice President, Commercial Growth$$,
  linkedin_url = $$https://www.linkedin.com/in/pranit-tukrel-a201a161/$$,
  email = $$pranit.tukrel@canproroofing.com$$,
  priority = $$A$$,
  target_type_raw = $$Target 2$$,
  outreach_angle = $$CanPro’s fractional marketing build is designed to support a growing platform of partner companies. As Vice President, Commercial Growth, Pranit is directly affected by how market segmentation, partner narratives, B2B demand, HubSpot activity and commercial partnerships translate into scalable growth.$$, 
  value_hypothesis = $$RevHub can help Pranit connect acquisition and partnership growth to a repeatable commercial activation model across target markets, customer segments, partner companies, CRM, campaigns, business-development handoffs and pipeline visibility.$$, 
  stakeholder_selection_reason = $$Senior commercial-growth stakeholder. CanPro’s current leadership page identifies Pranit as Vice President, Commercial Growth, while the fractional marketing mandate is explicitly designed to create repeatable platform-wide B2B activation and support growth across partner companies.$$, 
  linkedin_connect_message = $$Pranit, CanPro’s fractional Marketing Director search caught my attention. The “marketing in a box” mandate looks tightly connected to commercial growth and partner-company scaling. I build those integrated GTM systems and would value connecting.$$, 
  intro_message = $$Thanks for connecting, Pranit.\n\nI saw CanPro’s search for a fractional Marketing Director to build the function from zero and create a reusable platform playbook across operating companies.\n\nGiven your Commercial Growth remit, the part that stood out is the opportunity to connect the partner-growth strategy to repeatable market activation: customer segmentation, B2B narratives, HubSpot campaigns, lead flow, BD follow-up and visibility into which plays work across companies.\n\nThrough RevHub, my partner and I help businesses connect commercial strategy, marketing, CRM, sales execution and analytics into one operating system.\n\nWould you be open to a conversation about the commercial-growth layer behind CanPro’s new marketing function?$$,
  follow_up_message = $$Pranit, following up because a useful first step could map priority markets and customer groups to partner-company propositions, campaigns, HubSpot ownership, BD actions and pipeline measures so the playbook compounds as CanPro grows. Would a brief conversation be useful?$$,
  email_subject = $$Connecting CanPro’s marketing playbook to commercial growth$$,
  email_intro_message = $$Hi Pranit,\n\nI saw CanPro’s live search for a fractional Marketing Director to build the marketing function from zero and create a reusable playbook across operating companies.\n\nGiven your Commercial Growth remit, the larger opportunity is connecting that playbook to the platform-growth system: target markets and segments, partner-company propositions, B2B campaigns, HubSpot governance, lead flow, business-development actions and pipeline visibility.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  email_follow_up_1 = $$Hi Pranit,\n\nA useful first phase could map priority markets and customer groups to partner-company propositions, campaigns, HubSpot ownership, BD actions and pipeline measures so the playbook compounds as CanPro grows.\n\nWould a brief conversation next week be worthwhile?$$,
  email_follow_up_2 = $$Hi Pranit,\n\nClosing the loop. The opportunity I see is helping CanPro connect its new marketing function directly to the commercial-growth engine supporting partner companies and national scale.\n\nIs there a 20-minute window worth holding?$$,
  email_assumption_notice = $$Business email verified through current commercial data; no inferred email pattern was used.$$
where lower(trim(company)) = $$canpro roofing partners$$ and lower(trim(contact_name)) = $$pranit tukrel$$;

-- Rav Bance — Target 3
insert into public.project_contacts (
  company, company_id, contact_name, title, linkedin_url, email, priority,
  target_type_raw, outreach_angle, value_hypothesis,
  stakeholder_selection_reason, linkedin_connect_message, intro_message,
  follow_up_message, email_subject, email_intro_message, email_follow_up_1,
  email_follow_up_2, email_assumption_notice
)
select
  $$CanPro Roofing Partners$$,
  (select id from public.companies where normalized_name = $$canpro roofing partners$$ limit 1),
  $$Rav Bance$$,
  $$Business Development Manager$$,
  $$https://www.linkedin.com/in/rav-bance-824956372/$$,
  $$rav.bance@canproroofing.com$$,
  $$B$$,
  $$Target 3$$,
  $$As CanPro’s Business Development Manager, Rav is a direct user of the B2B segmentation, HubSpot campaigns, target lists, messaging and local or national demand the fractional marketing leader is being hired to build.$$, 
  $$RevHub can help connect the marketing playbook to BD execution through target-account segmentation, buying signals, HubSpot lead and account routing, campaign-to-opportunity handoffs, follow-up rules and pipeline attribution.$$, 
  $$Direct business-development beneficiary and execution collaborator. Current commercial data identifies Rav as CanPro’s Business Development Manager. The fractional marketing mandate directly builds the B2B segmentation, HubSpot campaigns, target lists and messaging that feed the BD motion.$$, 
  $$Rav, CanPro’s fractional Marketing Director search stood out because the role will build the HubSpot, B2B campaign and segmentation system feeding business development. I work on that marketing-to-sales operating layer and would value connecting.$$, 
  $$Thanks for connecting, Rav.\n\nI saw CanPro’s fractional Marketing Director search. The role is being hired to build the marketing function from zero, including HubSpot email and automation, B2B list campaigns, segmentation, content and a repeatable playbook for operating companies.\n\nFrom a business-development perspective, the leverage is making sure those activities translate into clearer target accounts, stronger buying signals, consistent routing and follow-up, and visible pipeline impact.\n\nThrough RevHub, my partner and I help connect marketing, CRM, sales execution and analytics into one commercial operating model.\n\nWould you be open to a conversation about connecting CanPro’s new marketing playbook directly to the BD motion?$$,
  $$Rav, following up because a practical first step could map target customer groups, B2B campaigns, HubSpot signals, routing, BD actions and pipeline outcomes so Marketing and Business Development work from the same model. Would a brief conversation be useful?$$,
  $$Connecting CanPro’s marketing build to business development$$,
  $$Hi Rav,\n\nI saw CanPro’s live search for a fractional Marketing Director to build the marketing function from zero. The mandate includes HubSpot email and automation, B2B campaigns, segmentation and a repeatable playbook across operating companies.\n\nFrom a BD perspective, the value is connecting those activities to target-account priorities, buying signals, routing, follow-up and measurable pipeline progression.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  $$Hi Rav,\n\nOne useful first deliverable could be a marketing-to-BD map showing priority customer groups, campaigns, HubSpot signals, routing, follow-up rules and pipeline measures.\n\nWould a brief conversation next week be worthwhile?$$,
  $$Hi Rav,\n\nClosing the loop. The opportunity I see is making CanPro’s new marketing capability directly usable by BD through shared targeting, HubSpot rules, follow-up and pipeline measurement.\n\nIs there a 20-minute window worth holding?$$,
  $$Business email verified through current commercial data; no inferred email pattern was used.$$
where not exists (
  select 1 from public.project_contacts
  where (lower(trim(company)) = $$canpro roofing partners$$ and lower(trim(contact_name)) = $$rav bance$$)
     or linkedin_url = $$https://www.linkedin.com/in/rav-bance-824956372/$$
     or lower(email) = $$rav.bance@canproroofing.com$$
);

update public.project_contacts set
  company_id = (select id from public.companies where normalized_name = $$canpro roofing partners$$ limit 1),
  title = $$Business Development Manager$$,
  linkedin_url = $$https://www.linkedin.com/in/rav-bance-824956372/$$,
  email = $$rav.bance@canproroofing.com$$,
  priority = $$B$$,
  target_type_raw = $$Target 3$$,
  outreach_angle = $$As CanPro’s Business Development Manager, Rav is a direct user of the B2B segmentation, HubSpot campaigns, target lists, messaging and local or national demand the fractional marketing leader is being hired to build.$$, 
  value_hypothesis = $$RevHub can help connect the marketing playbook to BD execution through target-account segmentation, buying signals, HubSpot lead and account routing, campaign-to-opportunity handoffs, follow-up rules and pipeline attribution.$$, 
  stakeholder_selection_reason = $$Direct business-development beneficiary and execution collaborator. Current commercial data identifies Rav as CanPro’s Business Development Manager. The fractional marketing mandate directly builds the B2B segmentation, HubSpot campaigns, target lists and messaging that feed the BD motion.$$, 
  linkedin_connect_message = $$Rav, CanPro’s fractional Marketing Director search stood out because the role will build the HubSpot, B2B campaign and segmentation system feeding business development. I work on that marketing-to-sales operating layer and would value connecting.$$, 
  intro_message = $$Thanks for connecting, Rav.\n\nI saw CanPro’s fractional Marketing Director search. The role is being hired to build the marketing function from zero, including HubSpot email and automation, B2B list campaigns, segmentation, content and a repeatable playbook for operating companies.\n\nFrom a business-development perspective, the leverage is making sure those activities translate into clearer target accounts, stronger buying signals, consistent routing and follow-up, and visible pipeline impact.\n\nThrough RevHub, my partner and I help connect marketing, CRM, sales execution and analytics into one commercial operating model.\n\nWould you be open to a conversation about connecting CanPro’s new marketing playbook directly to the BD motion?$$,
  follow_up_message = $$Rav, following up because a practical first step could map target customer groups, B2B campaigns, HubSpot signals, routing, BD actions and pipeline outcomes so Marketing and Business Development work from the same model. Would a brief conversation be useful?$$,
  email_subject = $$Connecting CanPro’s marketing build to business development$$,
  email_intro_message = $$Hi Rav,\n\nI saw CanPro’s live search for a fractional Marketing Director to build the marketing function from zero. The mandate includes HubSpot email and automation, B2B campaigns, segmentation and a repeatable playbook across operating companies.\n\nFrom a BD perspective, the value is connecting those activities to target-account priorities, buying signals, routing, follow-up and measurable pipeline progression.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  email_follow_up_1 = $$Hi Rav,\n\nOne useful first deliverable could be a marketing-to-BD map showing priority customer groups, campaigns, HubSpot signals, routing, follow-up rules and pipeline measures.\n\nWould a brief conversation next week be worthwhile?$$,
  email_follow_up_2 = $$Hi Rav,\n\nClosing the loop. The opportunity I see is making CanPro’s new marketing capability directly usable by BD through shared targeting, HubSpot rules, follow-up and pipeline measurement.\n\nIs there a 20-minute window worth holding?$$,
  email_assumption_notice = $$Business email verified through current commercial data; no inferred email pattern was used.$$
where lower(trim(company)) = $$canpro roofing partners$$ and lower(trim(contact_name)) = $$rav bance$$;

-- Direct flexible-work signal. The natural-key index created by
-- dedupe_company_signals.sql makes this a safe repeatable upsert.
insert into public.company_signals (
  company, company_id, role_title, posted_date, source_url, notes,
  lead_origin, opportunity_type, engagement_details,
  raw_lead_origin, raw_opportunity_type
)
values (
  $$CanPro Roofing Partners$$,
  (select id from public.companies where normalized_name = $$canpro roofing partners$$ limit 1),
  $$Fractional Marketing Director$$,
  date $$2026-06-12$$,
  $$https://www.gofractional.com/job/toiture-perreault-inc-marketing-director-fractional$$,
  $$SOURCE PRIORITY 1. Live remote fractional marketing-leadership role. Build CanPro’s zero-to-one marketing function and a scalable “marketing in a box” playbook across operating companies; owns HubSpot email, segmentation and automation, B2B campaigns, freelancers, budget, local coordination and CEO performance reporting.$$, 
  $$Direct Flexible-Work Opportunity$$,
  $$Fractional Opportunity$$,
  $$Remote · Fractional · Part-Time · 10–30 hrs/week · $120–$180/hr · Indefinite$$,
  $$Direct Flexible-Work Opportunity$$,
  $$Fractional Opportunity$$
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
