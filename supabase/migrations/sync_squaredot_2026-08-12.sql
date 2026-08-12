-- Sync Squaredot from the RevHub Target Accounts workbook.
-- Source rows verified 2026-08-12:
--   RevHub-Marketing: Kris Krokosz, Joseph Huddleston, Paul Tupman
--   RevHub-Marketing Signals: Fractional Marketing Manager (Go Fractional)
-- Idempotent source-of-truth sync. Does not overwrite assignment, stage,
-- outreach progress, meetings, notes/history, or other user-maintained state.

insert into public.companies (name, normalized_name, industry, sector, website)
select $$Squaredot$$, $$squaredot$$, $$Design Services / Workplace Strategy$$,
       $$Corporate Workplace Design / Commercial Interiors$$, $$https://www.squaredot.co.uk/$$
where not exists (
  select 1 from public.companies
  where lower(trim(name)) = $$squaredot$$ or normalized_name = $$squaredot$$
);

update public.companies
set industry = $$Design Services / Workplace Strategy$$,
    sector = $$Corporate Workplace Design / Commercial Interiors$$,
    website = coalesce(nullif(website, ''), $$https://www.squaredot.co.uk/$$),
    updated_at = now()
where lower(trim(name)) = $$squaredot$$ or normalized_name = $$squaredot$$;

-- Kris Krokosz — Target 1
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Squaredot$$,
 (select id from public.companies where normalized_name=$$squaredot$$ limit 1),
 $$Kris Krokosz$$, $$Director & Co-Founder$$,
 $$https://www.linkedin.com/in/kris-krokosz-3ab7b/$$, null, $$A$$, $$Target 1$$,
 $$Squaredot is hiring a fractional Marketing Manager to own strategy, lead generation performance and freelancer direction while representing marketing in weekly commercial meetings. As Director and Co-Founder, Kris is the clearest executive sponsor for the mandate.$$, 
 $$RevHub can help Squaredot turn the fractional hire into a connected commercial growth system spanning ICP and segment definition, lead generation, CRM/funnel measurement, campaign governance, sales alignment and executive reporting.$$, 
 $$Executive sponsor. Squaredot’s current company content identifies Kris as Director and Co-Founder, and the fractional role owns marketing strategy, lead generation and commercial-meeting accountability.$$, 
 $$Kris, Squaredot’s fractional Marketing Manager search stood out. The mandate combines strategy, lead generation, freelancer direction and commercial reporting—the same intersection where we help teams connect marketing, sales and measurement. I’d value connecting.$$, 
 $$Thanks for connecting, Kris.\n\nI saw Squaredot’s search for a fractional Marketing Manager working two days a week and owning both strategy and lead-generation performance.\n\nWhat stood out is that the role is expected to be the voice of marketing in the sales meeting, which usually means the bigger opportunity is connecting campaigns, CRM, funnel visibility and commercial decisions—not simply adding execution capacity.\n\nThrough RevHub, my partner and I help organizations connect customer intelligence, marketing activation, sales execution, RevOps and analytics into one growth operating system.\n\nWould you be open to a conversation about where Squaredot sees the biggest constraint in turning marketing activity into predictable pipeline?$$,
 $$Kris, following up because a useful first phase could map Squaredot’s target segments, lead-generation motions, CRM/funnel stages and the KPIs used in the weekly sales meeting, then identify where the new fractional capacity can create the most leverage. Would a brief conversation be worthwhile?$$,
 $$Connecting Squaredot’s fractional marketing hire to predictable pipeline$$,
 $$Hi Kris,\n\nI saw Squaredot’s fractional Marketing Manager opening—remote, two days per week, with ownership of strategy, lead generation and marketing performance in the sales meeting.\n\nThe opportunity I see is connecting that added capacity to the broader commercial system: target segments, campaigns, CRM stages, sales handoffs, attribution and the KPIs leadership uses to make decisions.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps and analytics capability.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 $$Hi Kris,\n\nA practical first step could define the shared growth model across target segments, campaigns, CRM stages, lead quality and sales outcomes so the fractional role is measured against pipeline rather than activity alone.\n\nWould a brief conversation next week be worthwhile?$$,
 $$Hi Kris,\n\nClosing the loop. The fit I see is helping Squaredot use the fractional hire to build a repeatable commercial growth system rather than another standalone marketing layer.\n\nIs there a 20-minute window worth holding?$$,
 $$No current individual Squaredot business email was verified for Kris, so no address was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company))=$$squaredot$$ and lower(trim(contact_name))=$$kris krokosz$$)
    or linkedin_url=$$https://www.linkedin.com/in/kris-krokosz-3ab7b/$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$squaredot$$ limit 1),
 title=$$Director & Co-Founder$$,
 linkedin_url=$$https://www.linkedin.com/in/kris-krokosz-3ab7b/$$,
 priority=$$A$$, target_type_raw=$$Target 1$$,
 outreach_angle=$$Squaredot is hiring a fractional Marketing Manager to own strategy, lead generation performance and freelancer direction while representing marketing in weekly commercial meetings. As Director and Co-Founder, Kris is the clearest executive sponsor for the mandate.$$, 
 value_hypothesis=$$RevHub can help Squaredot turn the fractional hire into a connected commercial growth system spanning ICP and segment definition, lead generation, CRM/funnel measurement, campaign governance, sales alignment and executive reporting.$$, 
 stakeholder_selection_reason=$$Executive sponsor. Squaredot’s current company content identifies Kris as Director and Co-Founder, and the fractional role owns marketing strategy, lead generation and commercial-meeting accountability.$$, 
 linkedin_connect_message=$$Kris, Squaredot’s fractional Marketing Manager search stood out. The mandate combines strategy, lead generation, freelancer direction and commercial reporting—the same intersection where we help teams connect marketing, sales and measurement. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Kris.\n\nI saw Squaredot’s search for a fractional Marketing Manager working two days a week and owning both strategy and lead-generation performance.\n\nWhat stood out is that the role is expected to be the voice of marketing in the sales meeting, which usually means the bigger opportunity is connecting campaigns, CRM, funnel visibility and commercial decisions—not simply adding execution capacity.\n\nThrough RevHub, my partner and I help organizations connect customer intelligence, marketing activation, sales execution, RevOps and analytics into one growth operating system.\n\nWould you be open to a conversation about where Squaredot sees the biggest constraint in turning marketing activity into predictable pipeline?$$,
 follow_up_message=$$Kris, following up because a useful first phase could map Squaredot’s target segments, lead-generation motions, CRM/funnel stages and the KPIs used in the weekly sales meeting, then identify where the new fractional capacity can create the most leverage. Would a brief conversation be worthwhile?$$,
 email_subject=$$Connecting Squaredot’s fractional marketing hire to predictable pipeline$$,
 email_intro_message=$$Hi Kris,\n\nI saw Squaredot’s fractional Marketing Manager opening—remote, two days per week, with ownership of strategy, lead generation and marketing performance in the sales meeting.\n\nThe opportunity I see is connecting that added capacity to the broader commercial system: target segments, campaigns, CRM stages, sales handoffs, attribution and the KPIs leadership uses to make decisions.\n\nThrough RevHub, my partner and I combine commercial strategy with hands-on marketing, RevOps and analytics capability.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Kris,\n\nA practical first step could define the shared growth model across target segments, campaigns, CRM stages, lead quality and sales outcomes so the fractional role is measured against pipeline rather than activity alone.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Kris,\n\nClosing the loop. The fit I see is helping Squaredot use the fractional hire to build a repeatable commercial growth system rather than another standalone marketing layer.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$No current individual Squaredot business email was verified for Kris, so no address was guessed or inferred.$$
where lower(trim(company))=$$squaredot$$ and lower(trim(contact_name))=$$kris krokosz$$;

-- Joseph Huddleston — Target 2
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Squaredot$$,
 (select id from public.companies where normalized_name=$$squaredot$$ limit 1),
 $$Joseph Huddleston$$, $$Business Design Development Executive$$,
 $$https://www.linkedin.com/in/joseph-huddleston-7b07b336/$$,
 $$joe@squaredot.co.uk$$, $$A$$, $$Target 2$$,
 $$The fractional Marketing Manager is expected to drive lead generation and participate directly in weekly sales meetings. Joseph’s business development remit makes him the closest day-to-day commercial stakeholder in marketing-to-pipeline execution.$$, 
 $$RevHub can help Joseph connect marketing campaigns, target-account strategy, CRM/funnel stages, sales follow-up and performance reporting into a repeatable pipeline system.$$, 
 $$Direct commercial stakeholder. Current profile data confirms Joseph as Business Design Development Executive at Squaredot; the fractional role’s lead-generation and sales-meeting mandate directly affects his remit.$$, 
 $$Joseph, Squaredot’s fractional Marketing Manager search caught my attention given your business-development remit. The role’s focus on lead generation and weekly sales alignment is exactly where we help connect marketing activity to pipeline and commercial decisions. I’d value connecting.$$, 
 $$Thanks for connecting, Joseph.\n\nI saw Squaredot’s fractional Marketing Manager search. Because the role is explicitly accountable for lead generation and expected to sit alongside sales in the weekly commercial rhythm, your business-development role seems especially close to the outcome it needs to create.\n\nThrough RevHub, my partner and I help teams connect targeting, marketing activation, CRM, sales follow-up, pipeline measurement and executive reporting into one operating system.\n\nWould you be open to a conversation about how Squaredot is currently connecting marketing activity to qualified opportunities?$$,
 $$Joseph, following up because a useful first deliverable could map target segments, campaigns, CRM stages, lead quality, sales follow-up and weekly pipeline metrics into one shared model. Would a brief conversation be useful?$$,
 $$Turning Squaredot marketing activity into qualified pipeline$$,
 $$Hi Joseph,\n\nI saw Squaredot’s fractional Marketing Manager opening and the explicit expectation that the person own lead-generation performance and represent marketing in the weekly sales meeting.\n\nGiven your business-development remit, the leverage I see is connecting campaigns and freelancer activity to target accounts, CRM stages, lead quality, follow-up and pipeline visibility.\n\nThat is the operating layer we build through RevHub across marketing, sales and analytics.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 $$Hi Joseph,\n\nOne practical first phase could define how marketing-generated demand should move through CRM and sales follow-up, with shared measures for lead quality, conversion and pipeline contribution.\n\nWould a brief conversation next week be worthwhile?$$,
 $$Hi Joseph,\n\nClosing the loop. The fit I see is helping Squaredot make the new fractional marketing capacity measurable from campaign through commercial outcome.\n\nIs there a 20-minute window worth holding?$$,
 $$Business email returned through current commercial data enrichment; no email pattern was inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company))=$$squaredot$$ and lower(trim(contact_name))=$$joseph huddleston$$)
    or linkedin_url=$$https://www.linkedin.com/in/joseph-huddleston-7b07b336/$$
    or lower(email)=$$joe@squaredot.co.uk$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$squaredot$$ limit 1),
 title=$$Business Design Development Executive$$,
 linkedin_url=$$https://www.linkedin.com/in/joseph-huddleston-7b07b336/$$,
 email=$$joe@squaredot.co.uk$$, priority=$$A$$, target_type_raw=$$Target 2$$,
 outreach_angle=$$The fractional Marketing Manager is expected to drive lead generation and participate directly in weekly sales meetings. Joseph’s business development remit makes him the closest day-to-day commercial stakeholder in marketing-to-pipeline execution.$$, 
 value_hypothesis=$$RevHub can help Joseph connect marketing campaigns, target-account strategy, CRM/funnel stages, sales follow-up and performance reporting into a repeatable pipeline system.$$, 
 stakeholder_selection_reason=$$Direct commercial stakeholder. Current profile data confirms Joseph as Business Design Development Executive at Squaredot; the fractional role’s lead-generation and sales-meeting mandate directly affects his remit.$$, 
 linkedin_connect_message=$$Joseph, Squaredot’s fractional Marketing Manager search caught my attention given your business-development remit. The role’s focus on lead generation and weekly sales alignment is exactly where we help connect marketing activity to pipeline and commercial decisions. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Joseph.\n\nI saw Squaredot’s fractional Marketing Manager search. Because the role is explicitly accountable for lead generation and expected to sit alongside sales in the weekly commercial rhythm, your business-development role seems especially close to the outcome it needs to create.\n\nThrough RevHub, my partner and I help teams connect targeting, marketing activation, CRM, sales follow-up, pipeline measurement and executive reporting into one operating system.\n\nWould you be open to a conversation about how Squaredot is currently connecting marketing activity to qualified opportunities?$$,
 follow_up_message=$$Joseph, following up because a useful first deliverable could map target segments, campaigns, CRM stages, lead quality, sales follow-up and weekly pipeline metrics into one shared model. Would a brief conversation be useful?$$,
 email_subject=$$Turning Squaredot marketing activity into qualified pipeline$$,
 email_intro_message=$$Hi Joseph,\n\nI saw Squaredot’s fractional Marketing Manager opening and the explicit expectation that the person own lead-generation performance and represent marketing in the weekly sales meeting.\n\nGiven your business-development remit, the leverage I see is connecting campaigns and freelancer activity to target accounts, CRM stages, lead quality, follow-up and pipeline visibility.\n\nThat is the operating layer we build through RevHub across marketing, sales and analytics.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Joseph,\n\nOne practical first phase could define how marketing-generated demand should move through CRM and sales follow-up, with shared measures for lead quality, conversion and pipeline contribution.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Joseph,\n\nClosing the loop. The fit I see is helping Squaredot make the new fractional marketing capacity measurable from campaign through commercial outcome.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$Business email returned through current commercial data enrichment; no email pattern was inferred.$$
where lower(trim(company))=$$squaredot$$ and lower(trim(contact_name))=$$joseph huddleston$$;

-- Paul Tupman — Target 3
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Squaredot$$,
 (select id from public.companies where normalized_name=$$squaredot$$ limit 1),
 $$Paul Tupman$$, $$Studio Lead | Senior Designer$$,
 $$https://www.linkedin.com/in/paul-tupman-a3b7b48/$$, null, $$B$$, $$Target 3$$,
 $$Paul leads the studio and sits close to the client story, service proposition and evidence-led workplace methodology that marketing must translate into demand. He is an important functional stakeholder in positioning and content quality.$$, 
 $$RevHub can help Paul connect Squaredot’s evidence-led workplace expertise to sharper segment positioning, proof-driven content, campaign execution and measurable commercial outcomes.$$, 
 $$Positioning and delivery stakeholder. Current profile data confirms Paul as Studio Lead | Senior Designer; his role is close to the evidence-led methodology, client value proposition and proof points the fractional marketer will need to activate.$$, 
 $$Paul, Squaredot’s fractional Marketing Manager search stood out given your studio leadership. Turning evidence-led workplace expertise into clear market positioning, content and measurable demand is exactly the kind of cross-functional growth problem we work on. I’d value connecting.$$, 
 $$Thanks for connecting, Paul.\n\nI saw Squaredot’s fractional Marketing Manager opening. The role will need to translate the company’s evidence-led workplace approach into campaigns and lead generation while coordinating specialist freelancers.\n\nGiven your studio leadership, the opportunity I see is ensuring the market story stays tightly connected to the client problems, proof points and design methodology that differentiate Squaredot.\n\nThrough RevHub, my partner and I help organizations connect positioning, content, activation, CRM and commercial measurement.\n\nWould you be open to a conversation about how Squaredot is turning its expertise into repeatable demand?$$,
 $$Paul, following up because a useful first phase could map Squaredot’s strongest client problems, proof points and segment narratives into a campaign architecture tied to CRM and commercial outcomes. Would a brief conversation be worthwhile?$$,
 $$Turning Squaredot’s workplace expertise into measurable demand$$,
 $$Hi Paul,\n\nI saw Squaredot’s fractional Marketing Manager opening.\n\nGiven your studio leadership, what stood out is the need to make sure the company’s evidence-led workplace expertise translates cleanly into market positioning, proof-driven content, campaigns and qualified demand.\n\nThrough RevHub, my partner and I work across positioning, marketing activation, CRM and commercial measurement so the story and the growth system reinforce each other.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 $$Hi Paul,\n\nA useful first step could identify the client problems, proof points and segment narratives most likely to create demand, then connect those messages to campaigns and measurable commercial outcomes.\n\nWould a brief conversation next week be worthwhile?$$,
 $$Hi Paul,\n\nClosing the loop. The fit I see is helping Squaredot turn its differentiated workplace methodology into a repeatable market and demand system.\n\nIs there a 20-minute window worth holding?$$,
 $$No current individual Squaredot business email was verified for Paul, so no address was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company))=$$squaredot$$ and lower(trim(contact_name))=$$paul tupman$$)
    or linkedin_url=$$https://www.linkedin.com/in/paul-tupman-a3b7b48/$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$squaredot$$ limit 1),
 title=$$Studio Lead | Senior Designer$$,
 linkedin_url=$$https://www.linkedin.com/in/paul-tupman-a3b7b48/$$,
 priority=$$B$$, target_type_raw=$$Target 3$$,
 outreach_angle=$$Paul leads the studio and sits close to the client story, service proposition and evidence-led workplace methodology that marketing must translate into demand. He is an important functional stakeholder in positioning and content quality.$$, 
 value_hypothesis=$$RevHub can help Paul connect Squaredot’s evidence-led workplace expertise to sharper segment positioning, proof-driven content, campaign execution and measurable commercial outcomes.$$, 
 stakeholder_selection_reason=$$Positioning and delivery stakeholder. Current profile data confirms Paul as Studio Lead | Senior Designer; his role is close to the evidence-led methodology, client value proposition and proof points the fractional marketer will need to activate.$$, 
 linkedin_connect_message=$$Paul, Squaredot’s fractional Marketing Manager search stood out given your studio leadership. Turning evidence-led workplace expertise into clear market positioning, content and measurable demand is exactly the kind of cross-functional growth problem we work on. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Paul.\n\nI saw Squaredot’s fractional Marketing Manager opening. The role will need to translate the company’s evidence-led workplace approach into campaigns and lead generation while coordinating specialist freelancers.\n\nGiven your studio leadership, the opportunity I see is ensuring the market story stays tightly connected to the client problems, proof points and design methodology that differentiate Squaredot.\n\nThrough RevHub, my partner and I help organizations connect positioning, content, activation, CRM and commercial measurement.\n\nWould you be open to a conversation about how Squaredot is turning its expertise into repeatable demand?$$,
 follow_up_message=$$Paul, following up because a useful first phase could map Squaredot’s strongest client problems, proof points and segment narratives into a campaign architecture tied to CRM and commercial outcomes. Would a brief conversation be worthwhile?$$,
 email_subject=$$Turning Squaredot’s workplace expertise into measurable demand$$,
 email_intro_message=$$Hi Paul,\n\nI saw Squaredot’s fractional Marketing Manager opening.\n\nGiven your studio leadership, what stood out is the need to make sure the company’s evidence-led workplace expertise translates cleanly into market positioning, proof-driven content, campaigns and qualified demand.\n\nThrough RevHub, my partner and I work across positioning, marketing activation, CRM and commercial measurement so the story and the growth system reinforce each other.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Paul,\n\nA useful first step could identify the client problems, proof points and segment narratives most likely to create demand, then connect those messages to campaigns and measurable commercial outcomes.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Paul,\n\nClosing the loop. The fit I see is helping Squaredot turn its differentiated workplace methodology into a repeatable market and demand system.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$No current individual Squaredot business email was verified for Paul, so no address was guessed or inferred.$$
where lower(trim(company))=$$squaredot$$ and lower(trim(contact_name))=$$paul tupman$$;

insert into public.company_signals (company, role_title, posted_date, source_url, notes)
values (
 $$Squaredot$$,
 $$Fractional Marketing Manager$$,
 date $$2026-07-27$$,
 $$https://www.gofractional.com/job/spor-group-fractional-marketing-manager$$,
 $$SOURCE PRIORITY 1. Named-company remote fractional marketing mandate for a UK workplace-design firm. Owns marketing strategy, lead-generation performance, freelancer direction, analytics/reporting and participation in weekly sales meetings. Strong direct-buying signal around connecting marketing execution to commercial pipeline. Engagement: Remote · Fractional · 16 hrs/week · 2 days/week · Contract-to-Hire · $125–$165/hr estimated.$$
)
on conflict (company) do update set
 role_title=excluded.role_title,
 posted_date=excluded.posted_date,
 source_url=excluded.source_url,
 notes=excluded.notes;
