-- Sync Uncapped from the RevHub Target Accounts workbook.
-- Source rows verified 2026-08-12:
--   RevHub-Marketing: Ronak Patel, Piotr Pisarz
--   RevHub-Marketing Signals: Fractional Content Marketing Manager (Go Fractional)
-- Idempotent source-of-truth sync. Does not overwrite assignment, stage,
-- outreach progress, meetings, notes/history, or other user-maintained state.

insert into public.companies (name, normalized_name, industry, sector, website)
select $$Uncapped$$, $$uncapped$$, $$Financial Services / Fintech$$,
       $$Working Capital / Ecommerce Growth Financing$$, $$https://www.weareuncapped.com$$
where not exists (
  select 1 from public.companies
  where lower(trim(name)) = $$uncapped$$ or normalized_name = $$uncapped$$
);

update public.companies
set industry = $$Financial Services / Fintech$$,
    sector = $$Working Capital / Ecommerce Growth Financing$$,
    website = coalesce(nullif(website, ''), $$https://www.weareuncapped.com$$),
    updated_at = now()
where lower(trim(name)) = $$uncapped$$ or normalized_name = $$uncapped$$;

-- Ronak Patel — Target 1
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Uncapped$$,
 (select id from public.companies where normalized_name = $$uncapped$$ limit 1),
 $$Ronak Patel$$, $$Senior Vice President, Growth and Revenue$$,
 $$https://www.linkedin.com/in/ronak-patel-04b92323/$$,
 $$ronak.patel@weareuncapped.com$$, $$A$$, $$Target 1$$,
 $$Uncapped is adding a fractional Content Marketing Manager who will work directly with Sales, Product and commercial leadership to build brand voice, distribution, customer stories, community and measurable pipeline. Ronak leads Growth and Revenue, making him the closest commercial sponsor for whether the new content engine translates into acquisition and pipeline.$$, 
 $$RevHub can help Ronak connect ICP and founder segmentation, content and community signals, CRM/funnel data, sales priorities, attribution and revenue reporting so the fractional content investment becomes a measurable component of the wider growth system.$$, 
 $$Closest functional and commercial sponsor. Current data confirms Ronak as Senior Vice President, Growth and Revenue at Uncapped, and the fractional content role explicitly partners with commercial leadership and is measured on awareness and pipeline.$$, 
 $$Ronak, Uncapped’s fractional Content Marketing Manager search stood out given your Growth & Revenue remit. The role is expected to work with commercial leadership and measure content against pipeline—not output alone. That connective growth system is closely aligned with what I build. I’d value connecting.$$, 
 $$Thanks for connecting, Ronak. I saw Uncapped’s search for a fractional Content Marketing Manager to build the content operation end-to-end and work directly with Sales, Product and commercial leadership. Given your role leading Growth and Revenue, the larger opportunity is connecting founder and account segmentation, distribution, community engagement, CRM signals, sales priorities and attribution into one commercial growth system. Would you be open to a conversation about how Uncapped is connecting the new content engine to pipeline and revenue?$$,
 $$Ronak, following up because a practical first phase could map priority founder segments, content themes, distribution channels, engagement signals, CRM stages and pipeline contribution into one shared operating model. Would a brief conversation next week be worthwhile?$$,
 $$Connecting Uncapped’s fractional content engine to pipeline$$,
 $$Hi Ronak, I saw Uncapped’s fractional Content Marketing Manager opening. The role is being asked to build brand voice and content operations while partnering directly with Sales, Product and commercial leadership—and to measure the work against pipeline. Given your Growth and Revenue remit, the opportunity I see is connecting founder segmentation, distribution, community engagement, CRM signals, sales priorities and attribution into a shared commercial model. Would you be open to a 20-minute conversation?$$,
 $$A useful first step could connect priority founder segments, content themes, distribution/community channels, engagement signals, CRM stages and pipeline contribution into one measurable operating model. Would a brief conversation next week be worthwhile?$$,
 $$Closing the loop. The fit I see is helping Uncapped make the new fractional content capacity measurable inside the wider growth and revenue system. Is there a 20-minute window worth holding?$$,
 $$Business email was returned by current commercial-data enrichment for Ronak at Uncapped; no email pattern was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company)) = $$uncapped$$ and lower(trim(contact_name)) = $$ronak patel$$)
    or linkedin_url = $$https://www.linkedin.com/in/ronak-patel-04b92323/$$
    or email = $$ronak.patel@weareuncapped.com$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name = $$uncapped$$ limit 1),
 title=$$Senior Vice President, Growth and Revenue$$,
 linkedin_url=$$https://www.linkedin.com/in/ronak-patel-04b92323/$$,
 email=$$ronak.patel@weareuncapped.com$$,
 priority=$$A$$, target_type_raw=$$Target 1$$,
 stakeholder_selection_reason=$$Closest functional and commercial sponsor. Current data confirms Ronak as Senior Vice President, Growth and Revenue at Uncapped, and the fractional content role explicitly partners with commercial leadership and is measured on awareness and pipeline.$$
where lower(trim(company)) = $$uncapped$$ and lower(trim(contact_name)) = $$ronak patel$$;

-- Piotr Pisarz — Target 2
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Uncapped$$,
 (select id from public.companies where normalized_name = $$uncapped$$ limit 1),
 $$Piotr Pisarz$$, $$Founder & CEO$$,
 $$https://www.linkedin.com/in/piotrpisarz/$$,
 $$piotr.pisarz@weareuncapped.com$$, $$A$$, $$Target 2$$,
 $$Uncapped is hiring a fractional Content Marketing Manager to build its brand voice and content engine from the ground up, with direct accountability for distribution, customer stories, community, systems and pipeline. As Founder & CEO, Piotr is the executive sponsor for whether that operating model supports Uncapped’s next stage of commercial growth.$$, 
 $$RevHub can help Piotr turn the new fractional content capacity into an integrated growth system connecting founder/customer intelligence, segmentation, messaging, distribution, sales execution, CRM signals, pipeline measurement and executive reporting.$$, 
 $$Executive sponsor and founder. Current sources confirm Piotr as Founder & CEO of Uncapped; the fractional role is designed to establish a scalable brand/content operating system and align directly with the wider commercial strategy.$$, 
 $$Piotr, Uncapped’s fractional Content Marketing Manager search caught my attention. The mandate goes beyond publishing—build the operating system, work with commercial leadership and tie content to pipeline. That is very close to the integrated growth systems I lead. I’d value connecting.$$, 
 $$Thanks for connecting, Piotr. I saw Uncapped’s search for a fractional Content Marketing Manager to build the brand voice and content operation end-to-end, establish the playbooks and tooling, and connect the work directly to commercial leadership and pipeline. The mandate is really an operating-model problem: deciding which founders and segments matter most, what stories and channels earn attention, how engagement flows into Sales and CRM, and how leadership sees the revenue contribution. Would you be open to a conversation?$$,
 $$Piotr, following up because the role is explicitly expected to leave behind a scalable content system. A useful first phase could connect audience priorities, distribution, customer proof, CRM/pipeline signals and executive measurement so the system outlasts the contractor’s hours. Would a brief conversation be useful?$$,
 $$A commercial growth system behind Uncapped’s fractional content hire$$,
 $$Hi Piotr, I saw Uncapped’s fractional Content Marketing Manager search. The role is designed to build the brand voice and content operation end-to-end, create the playbooks and tooling, and work directly with Sales, Product and commercial leadership while measuring pipeline impact. That makes the opportunity broader than content production; it is about connecting customer intelligence, segmentation, messaging, distribution, CRM signals, sales execution and measurement into one commercial growth system. Would you be open to a 20-minute conversation?$$,
 $$One practical deliverable could be a 90-day growth map tying priority founder segments and messages to content/distribution, sales follow-through, CRM stages, pipeline contribution and an executive scorecard. Would a brief conversation next week be worthwhile?$$,
 $$Closing the loop. The fit I see is helping Uncapped use the fractional hire to establish a repeatable commercial operating system rather than another isolated marketing workstream. Is there a 20-minute window worth holding?$$,
 $$Business email was returned by current commercial-data enrichment for Piotr at Uncapped; no email pattern was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company)) = $$uncapped$$ and lower(trim(contact_name)) = $$piotr pisarz$$)
    or linkedin_url = $$https://www.linkedin.com/in/piotrpisarz/$$
    or email = $$piotr.pisarz@weareuncapped.com$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name = $$uncapped$$ limit 1),
 title=$$Founder & CEO$$,
 linkedin_url=$$https://www.linkedin.com/in/piotrpisarz/$$,
 email=$$piotr.pisarz@weareuncapped.com$$,
 priority=$$A$$, target_type_raw=$$Target 2$$,
 stakeholder_selection_reason=$$Executive sponsor and founder. Current sources confirm Piotr as Founder & CEO of Uncapped; the fractional role is designed to establish a scalable brand/content operating system and align directly with the wider commercial strategy.$$
where lower(trim(company)) = $$uncapped$$ and lower(trim(contact_name)) = $$piotr pisarz$$;

insert into public.company_signals (company, role_title, posted_date, source_url, notes)
values (
 $$Uncapped$$,
 $$Fractional Content Marketing Manager$$,
 date $$2026-07-21$$,
 $$https://www.gofractional.com/job/uncapped-content-marketing-manager-part-time$$,
 $$SOURCE PRIORITY 1. Named-company remote fractional/part-time contractor role. Remote U.S./Canada; 10–15 hrs/week; indefinite; $95–$145/hr estimated. Builds brand voice and content operations across editorial, newsletter, social, video, distribution/community, customer stories and PR; partners with Sales, Product and commercial leadership and is measured on awareness and pipeline.$$
)
on conflict (company) do update set
 role_title=excluded.role_title,
 posted_date=excluded.posted_date,
 source_url=excluded.source_url,
 notes=excluded.notes;
