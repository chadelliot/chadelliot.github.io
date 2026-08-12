-- Sync Go Fractional from the RevHub Target Accounts workbook.
-- Source rows verified 2026-08-12:
--   RevHub-Marketing: Jonathan Grana, Eric Friedman
--   RevHub-Marketing Signals: Head of Growth Marketing (Internal)
--
-- Idempotent source-of-truth sync. This intentionally does not overwrite
-- assignment, pipeline stage, outreach progress, meetings, notes/history,
-- or other user-maintained state.

insert into public.companies (name, normalized_name, industry, sector, website)
select
  $$Go Fractional$$,
  $$go fractional$$,
  $$Business Consulting and Services$$,
  $$Fractional Talent Platform / Executive Recruiting$$,
  $$https://www.gofractional.com$$
where not exists (
  select 1 from public.companies
  where lower(trim(name)) = $$go fractional$$
     or normalized_name = $$go fractional$$
);

update public.companies
set
  industry = $$Business Consulting and Services$$,
  sector = $$Fractional Talent Platform / Executive Recruiting$$,
  website = coalesce(nullif(website, ''), $$https://www.gofractional.com$$),
  updated_at = now()
where lower(trim(name)) = $$go fractional$$
   or normalized_name = $$go fractional$$;

-- Jonathan Grana — Target 1
insert into public.project_contacts (
  company, company_id, contact_name, title, linkedin_url, email, priority,
  target_type_raw, outreach_angle, value_hypothesis,
  stakeholder_selection_reason, linkedin_connect_message, intro_message,
  follow_up_message, email_subject, email_intro_message, email_follow_up_1,
  email_follow_up_2, email_assumption_notice
)
select
  $$Go Fractional$$,
  (select id from public.companies where normalized_name = $$go fractional$$ limit 1),
  $$Jonathan Grana$$,
  $$Co-Founder & CEO$$,
  $$https://www.linkedin.com/in/jgrana$$,
  $$jonathan@gofractional.com$$,
  $$A$$,
  $$Target 1$$,
  $$Go Fractional is hiring an internal Head of Growth Marketing on a remote contract-to-hire basis to own revenue-driven marketing, newsletter growth and monetization, segmentation, partnerships, experimentation and new growth channels. Jonathan is the founder/CEO and direct executive sponsor.$$, 
  $$RevHub can help connect audience segmentation, newsletter monetization, partner economics, demand generation, CRM, attribution, experimentation and executive revenue visibility into one growth operating system.$$, 
  $$Primary executive sponsor. Go Fractional's live internal role says the Head of Growth Marketing will work closely with the founder, and current Go Fractional materials identify Jonathan as Founder & CEO.$$, 
  $$Jonathan, Go Fractional's internal Head of Growth Marketing search stood out. The mix of revenue ownership, audience segmentation, monetization and partnerships is close to the commercial growth systems we build. I'd value connecting.$$, 
  $$Thanks for connecting, Jonathan.\n\nI saw Go Fractional's internal search for a Head of Growth Marketing on a contract-to-hire basis. The mandate owns revenue-driven growth, newsletter monetization, audience segmentation, partnerships and experimentation while working closely with the founder.\n\nThrough RevHub, my partner and I help companies connect customer intelligence, segmentation, marketing activation, sales/revenue execution, CRM and analytics into one commercial growth system.\n\nWould you be open to a conversation about the operating layer behind the role and where Go Fractional is trying to create the most leverage?$$,
  $$Jonathan, following up because a useful first step could map Go Fractional's audiences, monetization paths, partner motions, acquisition channels, CRM signals and revenue KPIs into one growth model so experiments compound rather than live channel by channel. Would a brief conversation be worthwhile?$$,
  $$Go Fractional's revenue-driven growth operating system$$,
  $$Hi Jonathan,\n\nI saw Go Fractional's internal Head of Growth Marketing role: remote, contract-to-hire, and explicitly focused on revenue generation rather than brand-only work.\n\nThe opportunity I see is connecting newsletter growth and monetization, audience segmentation, partnerships, acquisition experiments, CRM signals and revenue measurement into one repeatable growth operating model.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  $$Hi Jonathan,\n\nA practical first phase could define the shared growth model across talent, founders and company buyers: segments, journeys, monetization paths, partner motions, experiments and the KPIs that determine where to invest.\n\nWould a brief conversation next week be worthwhile?$$,
  $$Hi Jonathan,\n\nClosing the loop. The fit I see is helping Go Fractional build the commercial operating layer underneath the Head of Growth Marketing mandate so channel learnings, partnerships and monetization compound over time.\n\nIs there a 20-minute window worth holding?$$,
  $$Business email verified through current commercial data; no inferred email pattern was used.$$
where not exists (
  select 1 from public.project_contacts
  where (lower(trim(company)) = $$go fractional$$ and lower(trim(contact_name)) = $$jonathan grana$$)
     or linkedin_url in ($$https://www.linkedin.com/in/jgrana$$, $$https://www.linkedin.com/in/jgrana/$$)
     or lower(email) = $$jonathan@gofractional.com$$
);

update public.project_contacts set
  company_id = (select id from public.companies where normalized_name = $$go fractional$$ limit 1),
  title = $$Co-Founder & CEO$$,
  linkedin_url = $$https://www.linkedin.com/in/jgrana$$,
  email = $$jonathan@gofractional.com$$,
  priority = $$A$$,
  target_type_raw = $$Target 1$$,
  outreach_angle = $$Go Fractional is hiring an internal Head of Growth Marketing on a remote contract-to-hire basis to own revenue-driven marketing, newsletter growth and monetization, segmentation, partnerships, experimentation and new growth channels. Jonathan is the founder/CEO and direct executive sponsor.$$, 
  value_hypothesis = $$RevHub can help connect audience segmentation, newsletter monetization, partner economics, demand generation, CRM, attribution, experimentation and executive revenue visibility into one growth operating system.$$, 
  stakeholder_selection_reason = $$Primary executive sponsor. Go Fractional's live internal role says the Head of Growth Marketing will work closely with the founder, and current Go Fractional materials identify Jonathan as Founder & CEO.$$, 
  linkedin_connect_message = $$Jonathan, Go Fractional's internal Head of Growth Marketing search stood out. The mix of revenue ownership, audience segmentation, monetization and partnerships is close to the commercial growth systems we build. I'd value connecting.$$, 
  intro_message = $$Thanks for connecting, Jonathan.\n\nI saw Go Fractional's internal search for a Head of Growth Marketing on a contract-to-hire basis. The mandate owns revenue-driven growth, newsletter monetization, audience segmentation, partnerships and experimentation while working closely with the founder.\n\nThrough RevHub, my partner and I help companies connect customer intelligence, segmentation, marketing activation, sales/revenue execution, CRM and analytics into one commercial growth system.\n\nWould you be open to a conversation about the operating layer behind the role and where Go Fractional is trying to create the most leverage?$$,
  follow_up_message = $$Jonathan, following up because a useful first step could map Go Fractional's audiences, monetization paths, partner motions, acquisition channels, CRM signals and revenue KPIs into one growth model so experiments compound rather than live channel by channel. Would a brief conversation be worthwhile?$$,
  email_subject = $$Go Fractional's revenue-driven growth operating system$$,
  email_intro_message = $$Hi Jonathan,\n\nI saw Go Fractional's internal Head of Growth Marketing role: remote, contract-to-hire, and explicitly focused on revenue generation rather than brand-only work.\n\nThe opportunity I see is connecting newsletter growth and monetization, audience segmentation, partnerships, acquisition experiments, CRM signals and revenue measurement into one repeatable growth operating model.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  email_follow_up_1 = $$Hi Jonathan,\n\nA practical first phase could define the shared growth model across talent, founders and company buyers: segments, journeys, monetization paths, partner motions, experiments and the KPIs that determine where to invest.\n\nWould a brief conversation next week be worthwhile?$$,
  email_follow_up_2 = $$Hi Jonathan,\n\nClosing the loop. The fit I see is helping Go Fractional build the commercial operating layer underneath the Head of Growth Marketing mandate so channel learnings, partnerships and monetization compound over time.\n\nIs there a 20-minute window worth holding?$$,
  email_assumption_notice = $$Business email verified through current commercial data; no inferred email pattern was used.$$
where lower(trim(company)) = $$go fractional$$ and lower(trim(contact_name)) = $$jonathan grana$$;

-- Eric Friedman — Target 2
insert into public.project_contacts (
  company, company_id, contact_name, title, linkedin_url, priority,
  target_type_raw, outreach_angle, value_hypothesis,
  stakeholder_selection_reason, linkedin_connect_message, intro_message,
  follow_up_message, email_subject, email_intro_message, email_follow_up_1,
  email_follow_up_2, email_assumption_notice
)
select
  $$Go Fractional$$,
  (select id from public.companies where normalized_name = $$go fractional$$ limit 1),
  $$Eric Friedman$$,
  $$Co-Founder$$,
  $$https://www.linkedin.com/in/ericgfriedman$$,
  $$A$$,
  $$Target 2$$,
  $$Go Fractional is hiring an internal Head of Growth Marketing to own revenue generation, partnerships and monetization. Eric is a current co-founder whose documented remit spans sales and operations, making him a direct commercial stakeholder.$$, 
  $$RevHub can help connect growth marketing to the operating and revenue system: segment economics, partner motions, sales handoffs, pipeline visibility, attribution and experimentation.$$, 
  $$Commercial and operating sponsor. Current Go Fractional material identifies Eric as co-founder with sales and operations responsibilities, directly adjacent to the revenue and partnership outcomes the Head of Growth Marketing role is expected to drive.$$, 
  $$Eric, Go Fractional's internal Head of Growth Marketing search caught my attention. The role's focus on monetization, partnerships and revenue execution overlaps directly with the commercial systems work we do across marketing, sales and RevOps. I'd value connecting.$$, 
  $$Thanks for connecting, Eric.\n\nI saw Go Fractional's internal Head of Growth Marketing search. The mandate owns revenue-driven marketing, newsletter monetization, segmentation and partnerships rather than a narrow brand function.\n\nGiven your sales and operations role as co-founder, the opportunity I see is making the growth engine measurable end to end: audiences and offers, partner motions, campaign activity, CRM handoffs, pipeline and revenue attribution.\n\nThat is the layer we build through RevHub across commercial strategy, marketing, RevOps, analytics and sales execution.\n\nWould you be open to a conversation about where Go Fractional sees the biggest gap between growth activity and commercial visibility today?$$,
  $$Eric, following up because a useful first deliverable could connect Go Fractional's audience segments, partner motions, growth experiments, sales handoffs and revenue KPIs into a single operating model. Would a brief conversation be useful?$$,
  $$Connecting Go Fractional's marketing growth to revenue operations$$,
  $$Hi Eric,\n\nI saw Go Fractional's internal Head of Growth Marketing search. The role is unusually commercial: newsletter monetization, audience segmentation, partnerships, experimentation and revenue generation.\n\nGiven your sales and operations remit, the opportunity I see is connecting that work to the full commercial system: partner and buyer segments, CRM handoffs, pipeline, attribution and the operating cadence for deciding which growth plays to scale.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  $$Hi Eric,\n\nOne useful first phase could map the full buyer, talent and partner growth system, including segment economics, acquisition sources, sales handoffs, monetization and executive KPIs.\n\nWould a brief conversation next week be worthwhile?$$,
  $$Hi Eric,\n\nClosing the loop. I see a strong fit around helping Go Fractional connect its growth marketing mandate directly to sales, partner revenue and executive commercial visibility.\n\nIs there a 20-minute window worth holding?$$,
  $$No current individual Go Fractional business email was publicly verified for Eric, so no address was guessed or inferred.$$
where not exists (
  select 1 from public.project_contacts
  where (lower(trim(company)) = $$go fractional$$ and lower(trim(contact_name)) = $$eric friedman$$)
     or linkedin_url in ($$https://www.linkedin.com/in/ericgfriedman$$, $$https://www.linkedin.com/in/ericgfriedman/$$)
);

update public.project_contacts set
  company_id = (select id from public.companies where normalized_name = $$go fractional$$ limit 1),
  title = $$Co-Founder$$,
  linkedin_url = $$https://www.linkedin.com/in/ericgfriedman$$,
  priority = $$A$$,
  target_type_raw = $$Target 2$$,
  outreach_angle = $$Go Fractional is hiring an internal Head of Growth Marketing to own revenue generation, partnerships and monetization. Eric is a current co-founder whose documented remit spans sales and operations, making him a direct commercial stakeholder.$$, 
  value_hypothesis = $$RevHub can help connect growth marketing to the operating and revenue system: segment economics, partner motions, sales handoffs, pipeline visibility, attribution and experimentation.$$, 
  stakeholder_selection_reason = $$Commercial and operating sponsor. Current Go Fractional material identifies Eric as co-founder with sales and operations responsibilities, directly adjacent to the revenue and partnership outcomes the Head of Growth Marketing role is expected to drive.$$, 
  linkedin_connect_message = $$Eric, Go Fractional's internal Head of Growth Marketing search caught my attention. The role's focus on monetization, partnerships and revenue execution overlaps directly with the commercial systems work we do across marketing, sales and RevOps. I'd value connecting.$$, 
  intro_message = $$Thanks for connecting, Eric.\n\nI saw Go Fractional's internal Head of Growth Marketing search. The mandate owns revenue-driven marketing, newsletter monetization, segmentation and partnerships rather than a narrow brand function.\n\nGiven your sales and operations role as co-founder, the opportunity I see is making the growth engine measurable end to end: audiences and offers, partner motions, campaign activity, CRM handoffs, pipeline and revenue attribution.\n\nThat is the layer we build through RevHub across commercial strategy, marketing, RevOps, analytics and sales execution.\n\nWould you be open to a conversation about where Go Fractional sees the biggest gap between growth activity and commercial visibility today?$$,
  follow_up_message = $$Eric, following up because a useful first deliverable could connect Go Fractional's audience segments, partner motions, growth experiments, sales handoffs and revenue KPIs into a single operating model. Would a brief conversation be useful?$$,
  email_subject = $$Connecting Go Fractional's marketing growth to revenue operations$$,
  email_intro_message = $$Hi Eric,\n\nI saw Go Fractional's internal Head of Growth Marketing search. The role is unusually commercial: newsletter monetization, audience segmentation, partnerships, experimentation and revenue generation.\n\nGiven your sales and operations remit, the opportunity I see is connecting that work to the full commercial system: partner and buyer segments, CRM handoffs, pipeline, attribution and the operating cadence for deciding which growth plays to scale.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps, analytics and sales capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
  email_follow_up_1 = $$Hi Eric,\n\nOne useful first phase could map the full buyer, talent and partner growth system, including segment economics, acquisition sources, sales handoffs, monetization and executive KPIs.\n\nWould a brief conversation next week be worthwhile?$$,
  email_follow_up_2 = $$Hi Eric,\n\nClosing the loop. I see a strong fit around helping Go Fractional connect its growth marketing mandate directly to sales, partner revenue and executive commercial visibility.\n\nIs there a 20-minute window worth holding?$$,
  email_assumption_notice = $$No current individual Go Fractional business email was publicly verified for Eric, so no address was guessed or inferred.$$
where lower(trim(company)) = $$go fractional$$ and lower(trim(contact_name)) = $$eric friedman$$;

insert into public.company_signals (
  company, company_id, role_title, posted_date, source_url, notes,
  lead_origin, opportunity_type, engagement_details,
  raw_lead_origin, raw_opportunity_type
)
values (
  $$Go Fractional$$,
  (select id from public.companies where normalized_name = $$go fractional$$ limit 1),
  $$Head of Growth Marketing (Internal)$$,
  date $$2026-03-09$$,
  $$https://www.gofractional.com/job/head-of-growth-marketing-cmmjdad9$$,
  $$SOURCE PRIORITY 1. Named-company internal flexible-work opportunity. Current listing remains indexed without a closed notice. Hands-on revenue-focused growth role owning newsletter acquisition, retention and monetization, sponsorship strategy, segmentation across founders, operators, talent and executives, partnerships and channel experimentation; works closely with the founder.$$, 
  $$Direct Flexible-Work Opportunity$$,
  $$Contract-to-Hire$$,
  $$Remote · Contract-to-Hire · 20+ hrs/week · $80+/hr$$,
  $$Direct Flexible-Work Opportunity$$,
  $$Contract-to-Hire$$
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