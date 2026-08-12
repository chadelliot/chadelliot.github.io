-- Sync Owlet Baby Care from the RevHub Target Accounts workbook.
-- Source rows verified 2026-08-12:
--   RevHub-Marketing: Elizabeth Teran, Jennifer Billington, Kurt Workman
--   RevHub-Marketing Signals: Fractional Performance Marketing Strategist (Go Fractional)
-- Idempotent source-of-truth sync. Does not overwrite assignment, stage,
-- outreach progress, meetings, notes/history, or other user-maintained state.

insert into public.companies (name, normalized_name, industry, sector, website)
select $$Owlet Baby Care$$, $$owlet baby care$$, $$Digital Health / Consumer Health$$,
       $$Connected Infant Health / DTC Medical Devices$$, $$https://www.owletcare.com/$$
where not exists (
  select 1 from public.companies
  where lower(trim(name)) in ($$owlet baby care$$,$$owlet$$)
     or normalized_name in ($$owlet baby care$$,$$owlet$$)
);

update public.companies
set industry = $$Digital Health / Consumer Health$$,
    sector = $$Connected Infant Health / DTC Medical Devices$$,
    website = coalesce(nullif(website, ''), $$https://www.owletcare.com/$$),
    updated_at = now()
where lower(trim(name)) in ($$owlet baby care$$,$$owlet$$)
   or normalized_name in ($$owlet baby care$$,$$owlet$$);

-- Elizabeth Teran — Target 1
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Owlet Baby Care$$,
 (select id from public.companies where normalized_name in ($$owlet baby care$$,$$owlet$$) limit 1),
 $$Elizabeth Teran$$, $$Chief Parent Officer$$,
 $$https://www.linkedin.com/in/elizabeth-teran2023$$, null, $$A$$, $$Target 1$$,
 $$Owlet is hiring a part-time Performance Marketing Strategist to own paid media, agency accountability, CAC/ROAS and revenue growth. Elizabeth leads the parent experience across product, design, customer service and marketing and has directly driven major acquisition-efficiency improvements, making her the closest executive sponsor to the mandate.$$, 
 $$RevHub can help Owlet connect paid acquisition, lifecycle/customer intelligence, segmentation, attribution, agency governance, CRM signals and executive measurement into one commercial growth system that improves CAC while protecting LTV and brand trust.$$, 
 $$Direct marketing executive sponsor. Owlet’s current management page identifies Elizabeth as Chief Parent Officer leading the parent experience across product, design, customer service and marketing; the new contractor role directly owns acquisition efficiency and paid growth.$$, 
 $$Elizabeth, Owlet’s part-time Performance Marketing Strategist search stood out. The mandate combines paid acquisition, agency accountability, CAC/ROAS and revenue growth—very close to the parent-experience and marketing system you lead. I’d value connecting.$$, 
 $$Thanks for connecting, Elizabeth. I saw Owlet’s search for a part-time Performance Marketing Strategist to own paid media, agency performance, CAC, ROAS and revenue growth. Given your remit across parent experience and marketing, the opportunity looks broader than channel execution alone. Through RevHub, my partner and I help teams build that connective commercial layer across marketing, RevOps, analytics and executive decisioning. Would you be open to a conversation about where Owlet sees the biggest constraint in scaling efficient acquisition today?$$,
 $$Elizabeth, following up because a useful first phase could connect paid-channel performance, parent segments, creative testing, lifecycle behavior and revenue/LTV measures into one decision model for growth. Would a brief conversation be worthwhile?$$,
 $$Connecting Owlet’s paid-growth mandate to CAC, LTV and parent intelligence$$,
 $$Hi Elizabeth, I saw Owlet’s part-time Performance Marketing Strategist opening. The role owns paid media strategy, agency accountability, CAC, ROAS and revenue growth. Given your leadership across parent experience and marketing, the larger opportunity I see is connecting acquisition performance to parent segmentation, lifecycle behavior, creative learning, attribution and LTV—not optimizing media in isolation. Would you be open to a 20-minute conversation?$$,
 $$A practical first step could map paid-channel economics, parent segments, lifecycle signals, creative tests and revenue/LTV measures into one shared growth model. Would a brief conversation next week be worthwhile?$$,
 $$Closing the loop. The fit I see is helping Owlet make the new paid-growth capacity measurable across acquisition, retention and long-term customer value. Is there a 20-minute window worth holding?$$,
 $$No current individual Owlet business email was publicly verified for Elizabeth, so no address was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company)) in ($$owlet baby care$$,$$owlet$$) and lower(trim(contact_name))=$$elizabeth teran$$)
    or linkedin_url=$$https://www.linkedin.com/in/elizabeth-teran2023$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name in ($$owlet baby care$$,$$owlet$$) limit 1),
 title=$$Chief Parent Officer$$, linkedin_url=$$https://www.linkedin.com/in/elizabeth-teran2023$$,
 priority=$$A$$, target_type_raw=$$Target 1$$,
 stakeholder_selection_reason=$$Direct marketing executive sponsor. Owlet’s current management page identifies Elizabeth as Chief Parent Officer leading the parent experience across product, design, customer service and marketing; the new contractor role directly owns acquisition efficiency and paid growth.$$
where lower(trim(company)) in ($$owlet baby care$$,$$owlet$$) and lower(trim(contact_name))=$$elizabeth teran$$;

-- Jennifer Billington — Target 2
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Owlet Baby Care$$,
 (select id from public.companies where normalized_name in ($$owlet baby care$$,$$owlet$$) limit 1),
 $$Jennifer Billington$$, $$Chief Revenue Officer$$,
 $$https://www.linkedin.com/in/jennifer-billington-24023a13/$$, null, $$A$$, $$Target 2$$,
 $$The new Performance Marketing Strategist is explicitly accountable for customer acquisition and revenue growth. As Owlet’s Chief Revenue Officer, Jennifer owns revenue strategy and execution across domestic and international sales.$$, 
 $$RevHub can help Jennifer connect paid demand, customer acquisition economics, channel and retail signals, CRM/funnel measurement, lifecycle value and revenue forecasting into a shared commercial view across marketing and sales.$$, 
 $$Senior commercial stakeholder. Owlet’s current management page identifies Jennifer as Chief Revenue Officer leading revenue strategy and execution; the contractor mandate explicitly targets acquisition efficiency and revenue growth.$$, 
 $$Jennifer, Owlet’s part-time Performance Marketing Strategist search caught my attention given your revenue remit. The role is accountable for CAC, ROAS and revenue—not just media execution—which is exactly where we help connect marketing signals to commercial performance. I’d value connecting.$$, 
 $$Thanks for connecting, Jennifer. I saw Owlet’s part-time Performance Marketing Strategist opening. Given your role leading revenue strategy, the leverage I see is connecting acquisition activity to customer segments, channel mix, lifecycle value, attribution and forecast visibility. Would you be open to a conversation about how Owlet is tying paid-acquisition decisions to total revenue and customer value?$$,
 $$Jennifer, following up because a useful first phase could connect paid-media economics, customer segments, channel performance, lifecycle value and revenue reporting into one shared model for investment decisions. Would a brief conversation be useful?$$,
 $$Connecting Owlet’s paid acquisition to total revenue and customer value$$,
 $$Hi Jennifer, I saw Owlet’s part-time Performance Marketing Strategist search. Given your remit as CRO, the bigger opportunity appears to be connecting channel decisions to customer segments, retail and direct revenue, lifecycle value, attribution and forecast visibility. Would you be open to a 20-minute conversation?$$,
 $$A useful first step could connect acquisition economics, customer/channel segments, lifecycle value and revenue reporting so media decisions are evaluated against the same commercial model used by leadership. Would a brief conversation next week be worthwhile?$$,
 $$Closing the loop. The fit I see is helping Owlet connect paid-growth execution to the revenue system around it rather than measuring channels in isolation. Is there a 20-minute window worth holding?$$,
 $$No full individual Owlet business email was verified for Jennifer; no address was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company)) in ($$owlet baby care$$,$$owlet$$) and lower(trim(contact_name))=$$jennifer billington$$)
    or linkedin_url=$$https://www.linkedin.com/in/jennifer-billington-24023a13/$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name in ($$owlet baby care$$,$$owlet$$) limit 1),
 title=$$Chief Revenue Officer$$, linkedin_url=$$https://www.linkedin.com/in/jennifer-billington-24023a13/$$,
 priority=$$A$$, target_type_raw=$$Target 2$$,
 stakeholder_selection_reason=$$Senior commercial stakeholder. Owlet’s current management page identifies Jennifer as Chief Revenue Officer leading revenue strategy and execution; the contractor mandate explicitly targets acquisition efficiency and revenue growth.$$
where lower(trim(company)) in ($$owlet baby care$$,$$owlet$$) and lower(trim(contact_name))=$$jennifer billington$$;

-- Kurt Workman — Target 3
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Owlet Baby Care$$,
 (select id from public.companies where normalized_name in ($$owlet baby care$$,$$owlet$$) limit 1),
 $$Kurt Workman$$, $$President, Chief Executive Officer & Co-Founder$$,
 $$https://www.linkedin.com/in/kurt-workman-28707131$$, null, $$A$$, $$Target 3$$,
 $$Owlet brought Kurt Workman back as President and CEO in April 2026 with a mandate to lead the company’s next phase of scale. The part-time Performance Marketing Strategist opening is directly tied to profitable customer acquisition and revenue growth.$$, 
 $$RevHub can help Kurt connect acquisition investment, parent/customer intelligence, lifecycle value, channel economics, forecasting and executive reporting into a growth system aligned to Owlet’s focus on profitable scale and expanding LTV.$$, 
 $$Executive sponsor. Owlet formally reappointed Kurt as President and CEO effective April 6, 2026 to lead its next phase of scale; the contractor role directly supports profitable acquisition and revenue growth.$$, 
 $$Kurt, Owlet’s part-time Performance Marketing Strategist search stood out given your return to lead the next phase of scale. The role is accountable for CAC, ROAS and revenue growth—the same economics behind profitable growth and LTV expansion. I’d value connecting.$$, 
 $$Thanks for connecting, Kurt. I saw Owlet’s search for a part-time Performance Marketing Strategist to own paid media, agency performance, CAC, ROAS and revenue growth. With your return to the CEO role and Owlet’s focus on profitable scale and expanding lifetime value, the opportunity looks bigger than adding a channel specialist. Would you be open to a conversation about where Owlet sees the greatest leverage in its growth system today?$$,
 $$Kurt, following up because a useful first phase could connect acquisition spend, customer segments, lifecycle value, channel economics and forecast outcomes into one operating model for profitable growth. Would a brief conversation be worthwhile?$$,
 $$Building the commercial operating layer behind Owlet’s next phase of scale$$,
 $$Hi Kurt, I saw Owlet’s part-time Performance Marketing Strategist opening. Given your return to lead Owlet’s next phase of scale, the opportunity I see is connecting that execution to customer intelligence, lifecycle value, channel performance, forecasting and executive decisioning. Would you be open to a 20-minute conversation?$$,
 $$A practical first step could connect acquisition investment, customer segments, channel economics, lifecycle value and forecast outcomes into one shared growth model. Would a brief conversation next week be worthwhile?$$,
 $$Closing the loop. The fit I see is helping Owlet turn paid-growth capacity into a repeatable operating system for profitable scale rather than another standalone marketing workstream. Is there a 20-minute window worth holding?$$,
 $$No full individual Owlet business email was verified for Kurt; no address was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company)) in ($$owlet baby care$$,$$owlet$$) and lower(trim(contact_name))=$$kurt workman$$)
    or linkedin_url=$$https://www.linkedin.com/in/kurt-workman-28707131$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name in ($$owlet baby care$$,$$owlet$$) limit 1),
 title=$$President, Chief Executive Officer & Co-Founder$$, linkedin_url=$$https://www.linkedin.com/in/kurt-workman-28707131$$,
 priority=$$A$$, target_type_raw=$$Target 3$$,
 stakeholder_selection_reason=$$Executive sponsor. Owlet formally reappointed Kurt as President and CEO effective April 6, 2026 to lead its next phase of scale; the contractor role directly supports profitable acquisition and revenue growth.$$
where lower(trim(company)) in ($$owlet baby care$$,$$owlet$$) and lower(trim(contact_name))=$$kurt workman$$;

insert into public.company_signals (company, role_title, posted_date, source_url, notes)
values (
 $$Owlet Baby Care$$,
 $$Fractional Performance Marketing Strategist$$,
 date $$2026-07-20$$,
 $$https://www.gofractional.com/job/owlet-baby-care-performance-marketing-strategist-part-time-contractor$$,
 $$SOURCE PRIORITY 1. Named-company remote part-time contractor opportunity. Owns paid social/search/display, agency accountability, media planning, forecasting, creative testing and performance analytics with direct CAC, ROAS and revenue targets. Remote U.S.; 10–30 hrs/week; indefinite; $85–$130/hr estimated.$$
)
on conflict (company) do update set
 role_title=excluded.role_title,
 posted_date=excluded.posted_date,
 source_url=excluded.source_url,
 notes=excluded.notes;
