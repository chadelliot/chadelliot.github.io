-- Sync Develop Health from the RevHub Target Accounts workbook.
-- Source rows verified 2026-08-12:
--   RevHub-Marketing: Nicolas Kernick, Mel van Londen, Bailey Sullivan
--   RevHub-Marketing Signals: Fractional Marketing & Design Lead (Go Fractional)
-- Idempotent source-of-truth sync. Does not overwrite assignment, stage,
-- outreach progress, meetings, notes/history, or other user-maintained state.

insert into public.companies (name, normalized_name, industry, sector, website)
select $$Develop Health$$, $$develop health$$, $$HealthTech / B2B SaaS$$,
       $$Medication Access AI / Prior Authorization Automation$$, $$https://www.develophealth.ai$$
where not exists (
  select 1 from public.companies
  where lower(trim(name)) = $$develop health$$ or normalized_name = $$develop health$$
);

update public.companies
set industry = $$HealthTech / B2B SaaS$$,
    sector = $$Medication Access AI / Prior Authorization Automation$$,
    website = coalesce(nullif(website, ''), $$https://www.develophealth.ai$$),
    updated_at = now()
where lower(trim(name)) = $$develop health$$ or normalized_name = $$develop health$$;

-- Nicolas Kernick — Target 1
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Develop Health$$,
 (select id from public.companies where normalized_name=$$develop health$$ limit 1),
 $$Nicolas Kernick$$, $$Head of Growth and Operations$$,
 $$https://www.linkedin.com/in/nicolas-kernick-56733445/$$,
 $$nicolas@develophealth.ai$$, $$A$$, $$Target 1$$,
 $$Develop Health is hiring a remote fractional Marketing & Design Lead. Nicolas is the senior growth-and-operations leader closest to the mandate and is accountable for translating market expansion into repeatable commercial execution.$$, 
 $$RevHub can help Nicolas connect positioning, growth strategy, content/design, CRM, commercial analytics and operating cadence into one measurable growth system as Develop Health scales provider and life-sciences demand.$$, 
 $$Direct functional sponsor. Develop Health’s current leadership page confirms Nicolas as Head of Growth and Operations, and the fractional Marketing & Design Lead mandate directly supports the growth and commercial system he leads.$$, 
 $$Nicolas, Develop Health’s fractional Marketing & Design Lead search stood out. The combination of growth, commercial strategy, content and design is close to the integrated growth systems we build across marketing, data and execution. I’d value connecting.$$, 
 $$Thanks for connecting, Nicolas.\n\nI saw Develop Health’s search for a fractional Marketing & Design Lead. The role signals a need for more than creative capacity—it sits at the intersection of market narrative, demand creation and the systems required to support a fast-scaling healthcare platform.\n\nThrough RevHub, my partner and I help companies connect customer and market intelligence, positioning, marketing activation, CRM, analytics and commercial execution into one growth operating system.\n\nWould you be open to a conversation about where Develop Health is trying to create the most leverage as the commercial engine scales?$$,
 $$Nicolas, following up because a useful first phase could map Develop Health’s provider and life-sciences audiences, journeys, growth motions, CRM signals and executive KPIs into one operating model. Would a brief conversation be worthwhile?$$,
 $$Develop Health’s next-stage growth operating system$$,
 $$Hi Nicolas,\n\nI saw Develop Health’s fractional Marketing & Design Lead opening—remote, part-time and designed to add senior flexible capacity to the growth engine.\n\nThe opportunity I see is connecting market positioning and creative execution to the broader commercial system: provider and life-sciences segmentation, demand generation, CRM signals, customer journeys, analytics and executive reporting.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps and analytics capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 $$Hi Nicolas,\n\nA practical first phase could define the shared growth model across provider and life-sciences audiences: segments, journeys, messaging, activation, CRM signals and the KPIs that determine where to invest.\n\nWould a brief conversation next week be worthwhile?$$,
 $$Hi Nicolas,\n\nClosing the loop. The fit I see is helping Develop Health turn added fractional marketing capacity into a connected commercial operating system rather than another isolated channel layer.\n\nIs there a 20-minute window worth holding?$$,
 $$Business email verified through current commercial data; no inferred email pattern was used.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company))=$$develop health$$ and lower(trim(contact_name))=$$nicolas kernick$$)
    or linkedin_url=$$https://www.linkedin.com/in/nicolas-kernick-56733445/$$
    or lower(email)=$$nicolas@develophealth.ai$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$develop health$$ limit 1),
 title=$$Head of Growth and Operations$$, linkedin_url=$$https://www.linkedin.com/in/nicolas-kernick-56733445/$$,
 email=$$nicolas@develophealth.ai$$, priority=$$A$$, target_type_raw=$$Target 1$$,
 outreach_angle=$$Develop Health is hiring a remote fractional Marketing & Design Lead. Nicolas is the senior growth-and-operations leader closest to the mandate and is accountable for translating market expansion into repeatable commercial execution.$$, 
 value_hypothesis=$$RevHub can help Nicolas connect positioning, growth strategy, content/design, CRM, commercial analytics and operating cadence into one measurable growth system as Develop Health scales provider and life-sciences demand.$$, 
 stakeholder_selection_reason=$$Direct functional sponsor. Develop Health’s current leadership page confirms Nicolas as Head of Growth and Operations, and the fractional Marketing & Design Lead mandate directly supports the growth and commercial system he leads.$$, 
 linkedin_connect_message=$$Nicolas, Develop Health’s fractional Marketing & Design Lead search stood out. The combination of growth, commercial strategy, content and design is close to the integrated growth systems we build across marketing, data and execution. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Nicolas.\n\nI saw Develop Health’s search for a fractional Marketing & Design Lead. The role signals a need for more than creative capacity—it sits at the intersection of market narrative, demand creation and the systems required to support a fast-scaling healthcare platform.\n\nThrough RevHub, my partner and I help companies connect customer and market intelligence, positioning, marketing activation, CRM, analytics and commercial execution into one growth operating system.\n\nWould you be open to a conversation about where Develop Health is trying to create the most leverage as the commercial engine scales?$$,
 follow_up_message=$$Nicolas, following up because a useful first phase could map Develop Health’s provider and life-sciences audiences, journeys, growth motions, CRM signals and executive KPIs into one operating model. Would a brief conversation be worthwhile?$$,
 email_subject=$$Develop Health’s next-stage growth operating system$$,
 email_intro_message=$$Hi Nicolas,\n\nI saw Develop Health’s fractional Marketing & Design Lead opening—remote, part-time and designed to add senior flexible capacity to the growth engine.\n\nThe opportunity I see is connecting market positioning and creative execution to the broader commercial system: provider and life-sciences segmentation, demand generation, CRM signals, customer journeys, analytics and executive reporting.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps and analytics capacity.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Nicolas,\n\nA practical first phase could define the shared growth model across provider and life-sciences audiences: segments, journeys, messaging, activation, CRM signals and the KPIs that determine where to invest.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Nicolas,\n\nClosing the loop. The fit I see is helping Develop Health turn added fractional marketing capacity into a connected commercial operating system rather than another isolated channel layer.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$Business email verified through current commercial data; no inferred email pattern was used.$$
where lower(trim(company))=$$develop health$$ and lower(trim(contact_name))=$$nicolas kernick$$;

-- Mel van Londen — Target 2
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Develop Health$$,
 (select id from public.companies where normalized_name=$$develop health$$ limit 1),
 $$Mel van Londen$$, $$Co-Founder & CEO$$, $$https://www.linkedin.com/in/mvanlonden/$$,
 $$mel@develophealth.ai$$, $$A$$, $$Target 2$$,
 $$Develop Health’s fractional Marketing & Design Lead search is an explicit flexible-capacity signal as the company scales its medication-access platform. As co-founder and CEO, Mel is the executive sponsor for growth priorities and resource allocation.$$, 
 $$RevHub can help Mel connect customer and market intelligence, provider and manufacturer segmentation, positioning, growth activation, RevOps and executive reporting into a scalable commercial system.$$, 
 $$Executive sponsor. Develop Health’s current leadership page confirms Mel as Co-Founder & CEO, and she owns company-level growth priorities, resource allocation and the operating model the fractional marketing role will support.$$, 
 $$Mel, Develop Health’s fractional Marketing & Design Lead opening caught my attention. Adding flexible senior capacity while scaling a healthcare platform often exposes broader opportunities across segmentation, growth operations and measurement. I’d value connecting.$$, 
 $$Thanks for connecting, Mel.\n\nI saw Develop Health’s search for a fractional Marketing & Design Lead. What stood out is the timing: the company is scaling across provider workflows and life-sciences access intelligence while adding flexible senior marketing capacity.\n\nThrough RevHub, my partner and I help growth-stage organizations connect customer intelligence, segmentation, positioning, marketing activation, RevOps, analytics and executive decision systems.\n\nWould you be open to a conversation about where Develop Health sees the biggest commercial scaling challenge right now?$$,
 $$Mel, following up because the fractional marketing hire could be a useful entry point for a broader commercial architecture—audiences, journeys, growth motions, CRM/data, KPIs and decision cadence. Would a brief conversation be worthwhile?$$,
 $$Scaling Develop Health’s commercial engine without adding fragmentation$$,
 $$Hi Mel,\n\nI saw Develop Health’s remote fractional Marketing & Design Lead opening, posted July 31.\n\nThe signal that stood out is not simply the hire itself, but the need to add senior flexible marketing capacity while Develop Health scales a two-sided commercial story across providers and life sciences.\n\nThrough RevHub, my partner and I help companies connect segmentation, positioning, growth activation, CRM, analytics and commercial decision-making into one operating system.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 $$Hi Mel,\n\nA useful first step could map Develop Health’s provider and life-sciences growth architecture—segments, journeys, messages, channels, CRM signals and executive KPIs—to identify where added capacity will create the greatest return.\n\nWould a brief conversation next week be worthwhile?$$,
 $$Hi Mel,\n\nClosing the loop. I see a fit around helping Develop Health add growth capability without creating another disconnected layer of marketing activity.\n\nIs there a 20-minute window worth holding?$$,
 $$Business email verified through current commercial data; no inferred email pattern was used.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company))=$$develop health$$ and lower(trim(contact_name))=$$mel van londen$$)
    or linkedin_url=$$https://www.linkedin.com/in/mvanlonden/$$
    or lower(email)=$$mel@develophealth.ai$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$develop health$$ limit 1),
 title=$$Co-Founder & CEO$$, linkedin_url=$$https://www.linkedin.com/in/mvanlonden/$$,
 email=$$mel@develophealth.ai$$, priority=$$A$$, target_type_raw=$$Target 2$$,
 outreach_angle=$$Develop Health’s fractional Marketing & Design Lead search is an explicit flexible-capacity signal as the company scales its medication-access platform. As co-founder and CEO, Mel is the executive sponsor for growth priorities and resource allocation.$$, 
 value_hypothesis=$$RevHub can help Mel connect customer and market intelligence, provider and manufacturer segmentation, positioning, growth activation, RevOps and executive reporting into a scalable commercial system.$$, 
 stakeholder_selection_reason=$$Executive sponsor. Develop Health’s current leadership page confirms Mel as Co-Founder & CEO, and she owns company-level growth priorities, resource allocation and the operating model the fractional marketing role will support.$$, 
 linkedin_connect_message=$$Mel, Develop Health’s fractional Marketing & Design Lead opening caught my attention. Adding flexible senior capacity while scaling a healthcare platform often exposes broader opportunities across segmentation, growth operations and measurement. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Mel.\n\nI saw Develop Health’s search for a fractional Marketing & Design Lead. What stood out is the timing: the company is scaling across provider workflows and life-sciences access intelligence while adding flexible senior marketing capacity.\n\nThrough RevHub, my partner and I help growth-stage organizations connect customer intelligence, segmentation, positioning, marketing activation, RevOps, analytics and executive decision systems.\n\nWould you be open to a conversation about where Develop Health sees the biggest commercial scaling challenge right now?$$,
 follow_up_message=$$Mel, following up because the fractional marketing hire could be a useful entry point for a broader commercial architecture—audiences, journeys, growth motions, CRM/data, KPIs and decision cadence. Would a brief conversation be worthwhile?$$,
 email_subject=$$Scaling Develop Health’s commercial engine without adding fragmentation$$,
 email_intro_message=$$Hi Mel,\n\nI saw Develop Health’s remote fractional Marketing & Design Lead opening, posted July 31.\n\nThe signal that stood out is not simply the hire itself, but the need to add senior flexible marketing capacity while Develop Health scales a two-sided commercial story across providers and life sciences.\n\nThrough RevHub, my partner and I help companies connect segmentation, positioning, growth activation, CRM, analytics and commercial decision-making into one operating system.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Mel,\n\nA useful first step could map Develop Health’s provider and life-sciences growth architecture—segments, journeys, messages, channels, CRM signals and executive KPIs—to identify where added capacity will create the greatest return.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Mel,\n\nClosing the loop. I see a fit around helping Develop Health add growth capability without creating another disconnected layer of marketing activity.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$Business email verified through current commercial data; no inferred email pattern was used.$$
where lower(trim(company))=$$develop health$$ and lower(trim(contact_name))=$$mel van londen$$;

-- Bailey Sullivan — Target 3
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Develop Health$$,
 (select id from public.companies where normalized_name=$$develop health$$ limit 1),
 $$Bailey Sullivan$$, $$Senior Manager, Commercial Strategy & Operations$$,
 $$https://www.linkedin.com/in/bailey-sullivan-6b728538/$$, null, $$B$$, $$Target 3$$,
 $$Bailey joined Develop Health in 2026 in Commercial Strategy & Operations and is an operating stakeholder in how growth initiatives translate into commercial processes, measurement and execution.$$, 
 $$RevHub can help Bailey connect the fractional marketing work to commercial operations through segment definitions, funnel instrumentation, CRM handoffs, performance measurement and operating cadence.$$, 
 $$Commercial-operations stakeholder. Current commercial data confirms Bailey as Senior Manager, Commercial Strategy & Operations at Develop Health, directly adjacent to CRM, funnel measurement and operating execution for the fractional marketing mandate.$$, 
 $$Bailey, Develop Health’s fractional Marketing & Design Lead search stood out given your commercial strategy and operations remit. Connecting added marketing capacity to CRM, funnel measurement and operating decisions is exactly the layer we focus on. I’d value connecting.$$, 
 $$Thanks for connecting, Bailey.\n\nI saw Develop Health’s fractional Marketing & Design Lead opening. Given your commercial strategy and operations role, the opportunity I see is making sure the new capacity plugs into a measurable commercial system rather than operating as a standalone creative function.\n\nThrough RevHub, my partner and I work across segmentation, marketing activation, CRM/RevOps, analytics and executive reporting.\n\nWould you be open to a conversation about how Develop Health is connecting growth activity to commercial operations and measurement?$$,
 $$Bailey, following up because a useful first deliverable could connect segments, campaigns, CRM handoffs, pipeline stages and executive KPIs so added marketing capacity is measurable from activity through commercial outcome. Would a brief conversation be useful?$$,
 $$Connecting fractional marketing capacity to commercial operations$$,
 $$Hi Bailey,\n\nI saw Develop Health’s fractional Marketing & Design Lead opening.\n\nGiven your commercial strategy and operations remit, the leverage I see is connecting the added marketing capacity to the full commercial system—segment definitions, campaign and content signals, CRM handoffs, pipeline visibility and executive performance measurement.\n\nThat is the layer we build through RevHub across marketing, RevOps and analytics.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 $$Hi Bailey,\n\nOne practical first phase could map how marketing activity should flow into CRM, commercial stages and reporting so the new fractional capacity is measurable against pipeline and growth outcomes.\n\nWould a brief conversation next week be worthwhile?$$,
 $$Hi Bailey,\n\nClosing the loop. The fit I see is helping Develop Health connect growth activity to the operating and measurement system underneath it.\n\nIs there a 20-minute window worth holding?$$,
 $$No current individual Develop Health business email was verified for Bailey, so no address was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company))=$$develop health$$ and lower(trim(contact_name))=$$bailey sullivan$$)
    or linkedin_url=$$https://www.linkedin.com/in/bailey-sullivan-6b728538/$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$develop health$$ limit 1),
 title=$$Senior Manager, Commercial Strategy & Operations$$,
 linkedin_url=$$https://www.linkedin.com/in/bailey-sullivan-6b728538/$$,
 priority=$$B$$, target_type_raw=$$Target 3$$,
 outreach_angle=$$Bailey joined Develop Health in 2026 in Commercial Strategy & Operations and is an operating stakeholder in how growth initiatives translate into commercial processes, measurement and execution.$$, 
 value_hypothesis=$$RevHub can help Bailey connect the fractional marketing work to commercial operations through segment definitions, funnel instrumentation, CRM handoffs, performance measurement and operating cadence.$$, 
 stakeholder_selection_reason=$$Commercial-operations stakeholder. Current commercial data confirms Bailey as Senior Manager, Commercial Strategy & Operations at Develop Health, directly adjacent to CRM, funnel measurement and operating execution for the fractional marketing mandate.$$, 
 linkedin_connect_message=$$Bailey, Develop Health’s fractional Marketing & Design Lead search stood out given your commercial strategy and operations remit. Connecting added marketing capacity to CRM, funnel measurement and operating decisions is exactly the layer we focus on. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Bailey.\n\nI saw Develop Health’s fractional Marketing & Design Lead opening. Given your commercial strategy and operations role, the opportunity I see is making sure the new capacity plugs into a measurable commercial system rather than operating as a standalone creative function.\n\nThrough RevHub, my partner and I work across segmentation, marketing activation, CRM/RevOps, analytics and executive reporting.\n\nWould you be open to a conversation about how Develop Health is connecting growth activity to commercial operations and measurement?$$,
 follow_up_message=$$Bailey, following up because a useful first deliverable could connect segments, campaigns, CRM handoffs, pipeline stages and executive KPIs so added marketing capacity is measurable from activity through commercial outcome. Would a brief conversation be useful?$$,
 email_subject=$$Connecting fractional marketing capacity to commercial operations$$,
 email_intro_message=$$Hi Bailey,\n\nI saw Develop Health’s fractional Marketing & Design Lead opening.\n\nGiven your commercial strategy and operations remit, the leverage I see is connecting the added marketing capacity to the full commercial system—segment definitions, campaign and content signals, CRM handoffs, pipeline visibility and executive performance measurement.\n\nThat is the layer we build through RevHub across marketing, RevOps and analytics.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Bailey,\n\nOne practical first phase could map how marketing activity should flow into CRM, commercial stages and reporting so the new fractional capacity is measurable against pipeline and growth outcomes.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Bailey,\n\nClosing the loop. The fit I see is helping Develop Health connect growth activity to the operating and measurement system underneath it.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$No current individual Develop Health business email was verified for Bailey, so no address was guessed or inferred.$$
where lower(trim(company))=$$develop health$$ and lower(trim(contact_name))=$$bailey sullivan$$;

insert into public.company_signals (company, role_title, posted_date, source_url, notes)
values (
 $$Develop Health$$,
 $$Fractional Marketing & Design Lead$$,
 date $$2026-07-31$$,
 $$https://www.gofractional.com/jobs/remote$$,
 $$SOURCE PRIORITY 1. Named-company remote fractional marketing role. Develop Health is adding flexible senior capacity across marketing and design while scaling an AI medication-access platform serving providers and life sciences; strong RevHub fit around segmentation, positioning, growth operations, CRM and commercial measurement.$$
)
on conflict (company) do update set
 role_title=excluded.role_title,
 posted_date=excluded.posted_date,
 source_url=excluded.source_url,
 notes=excluded.notes;
