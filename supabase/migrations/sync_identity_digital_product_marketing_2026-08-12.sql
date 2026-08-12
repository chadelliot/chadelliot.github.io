-- Sync Identity Digital DNSid Product Marketing opportunity from RevHub Target Accounts workbook.
-- Source rows verified 2026-08-12:
--   RevHub-Marketing: Lauren Goulston (new), Rachel Sterling (new), Matt Overman (refreshed)
--   RevHub-Marketing Signals: Product Marketing Manager (Contractor), posted 2026-07-27
-- Idempotent source-of-truth sync. Intentionally leaves assignment, pipeline stage,
-- outreach progress, meetings, notes/history, and other user-maintained state untouched.

insert into public.companies (name, normalized_name, industry, sector, website)
select $$Identity Digital$$, $$identity digital$$, $$Software Development$$,
       $$Domain Registry / AI Agent Identity Infrastructure$$, $$https://identity.digital/$$
where not exists (
  select 1 from public.companies
  where lower(trim(name)) = $$identity digital$$ or normalized_name = $$identity digital$$
);

update public.companies
set industry = $$Software Development$$,
    sector = $$Domain Registry / AI Agent Identity Infrastructure$$,
    website = coalesce(nullif(website, ''), $$https://identity.digital/$$),
    updated_at = now()
where lower(trim(name)) = $$identity digital$$ or normalized_name = $$identity digital$$;

-- Lauren Goulston — Target 1
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Identity Digital$$,
 (select id from public.companies where normalized_name=$$identity digital$$ limit 1),
 $$Lauren Goulston$$, $$General Manager, Identity Digital Innovation Labs$$,
 $$https://www.linkedin.com/in/lauren-goulston-07778626/$$,
 $$lauren.goulston@identity.digital$$, $$A$$, $$Target 1$$,
 $$Identity Digital is hiring a founding Product Marketing contractor for DNSid. The role reports directly to the Innovation Labs General Manager and owns positioning, ICP/personas, competitive intelligence, enablement, launches, and pricing/packaging input. Lauren is the direct executive sponsor.$$, 
 $$RevHub can help Lauren turn DNSid category creation into a connected commercial operating system across ICP and segmentation, positioning, pricing and packaging hypotheses, product marketing, partner and account signals, sales enablement, CRM and RevOps measurement, and executive decisioning.$$, 
 $$Direct executive sponsor. Identity Digital’s April 27, 2026 Innovation Labs launch identifies Lauren as General Manager, and the contractor posting states the founding Product Marketing leader reports to the General Manager.$$, 
 $$Lauren, Identity Digital’s founding DNSid Product Marketing contractor search stood out. The mandate spans category positioning, ICPs, enablement, launches and pricing/packaging—directly inside the Innovation Labs growth engine you lead. I’d value connecting.$$, 
 $$Thanks for connecting, Lauren.\n\nI saw the Product Marketing Manager contractor search for Innovation Labs. Because the role reports to you and is expected to define how the market understands AI Agent Identity, the mandate looks bigger than a typical PMM seat: ICP and persona design, positioning, pricing and packaging input, sales enablement, proof points, launch process, and customer and competitive insight all need to reinforce the same commercial motion.\n\nThrough RevHub, my partner and I help teams connect market intelligence, positioning, marketing, sales, RevOps and analytics into one growth operating system.\n\nWould you be open to a conversation about the operating layer behind DNSid’s category creation and early commercial adoption?$$,
 $$Lauren, following up because a practical first phase could connect DNSid’s target segments, buyer journeys, messaging, design-partner evidence, pricing and packaging hypotheses, sales plays, and funnel measures into one shared GTM model. Would a brief conversation be worthwhile?$$,
 $$Building the commercial operating layer behind DNSid category creation$$,
 $$Hi Lauren,\n\nI saw Identity Digital’s Product Marketing Manager contractor search for DNSid. Because the role reports to you and owns positioning, ICPs, competitive intelligence, sales enablement, launches, and pricing and packaging input, the opportunity looks broader than adding product-marketing capacity alone.\n\nThe leverage is connecting those decisions into one commercial system across market intelligence, segmentation, product marketing, sales, RevOps, analytics, and executive measurement. That is closely aligned with the work my partner and I lead through RevHub.\n\nWould you be open to a 20-minute conversation about the operating layer behind DNSid’s category creation and early commercial adoption?\n\nBest,\nChad Parker$$,
 $$Hi Lauren,\n\nA practical first phase could connect DNSid’s target segments, buyer journeys, messaging, design-partner evidence, pricing and packaging hypotheses, sales plays, and funnel measures into one shared GTM model.\n\nWould a brief conversation next week be worthwhile?$$,
 $$Hi Lauren,\n\nClosing the loop. The fit I see is helping Innovation Labs turn early category and customer learning into a repeatable commercial system as DNSid moves from design partners toward broader adoption.\n\nIs there a 20-minute window worth holding?$$,
 $$Business email returned through current commercial-data enrichment; no email pattern was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company))=$$identity digital$$ and lower(trim(contact_name))=$$lauren goulston$$)
    or linkedin_url=$$https://www.linkedin.com/in/lauren-goulston-07778626/$$
    or lower(email)=$$lauren.goulston@identity.digital$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$identity digital$$ limit 1),
 title=$$General Manager, Identity Digital Innovation Labs$$,
 linkedin_url=$$https://www.linkedin.com/in/lauren-goulston-07778626/$$,
 email=$$lauren.goulston@identity.digital$$,
 priority=$$A$$, target_type_raw=$$Target 1$$,
 outreach_angle=$$Identity Digital is hiring a founding Product Marketing contractor for DNSid. The role reports directly to the Innovation Labs General Manager and owns positioning, ICP/personas, competitive intelligence, enablement, launches, and pricing/packaging input. Lauren is the direct executive sponsor.$$, 
 value_hypothesis=$$RevHub can help Lauren turn DNSid category creation into a connected commercial operating system across ICP and segmentation, positioning, pricing and packaging hypotheses, product marketing, partner and account signals, sales enablement, CRM and RevOps measurement, and executive decisioning.$$, 
 stakeholder_selection_reason=$$Direct executive sponsor. Identity Digital’s April 27, 2026 Innovation Labs launch identifies Lauren as General Manager, and the contractor posting states the founding Product Marketing leader reports to the General Manager.$$, 
 linkedin_connect_message=$$Lauren, Identity Digital’s founding DNSid Product Marketing contractor search stood out. The mandate spans category positioning, ICPs, enablement, launches and pricing/packaging—directly inside the Innovation Labs growth engine you lead. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Lauren.\n\nI saw the Product Marketing Manager contractor search for Innovation Labs. Because the role reports to you and is expected to define how the market understands AI Agent Identity, the mandate looks bigger than a typical PMM seat: ICP and persona design, positioning, pricing and packaging input, sales enablement, proof points, launch process, and customer and competitive insight all need to reinforce the same commercial motion.\n\nThrough RevHub, my partner and I help teams connect market intelligence, positioning, marketing, sales, RevOps and analytics into one growth operating system.\n\nWould you be open to a conversation about the operating layer behind DNSid’s category creation and early commercial adoption?$$,
 follow_up_message=$$Lauren, following up because a practical first phase could connect DNSid’s target segments, buyer journeys, messaging, design-partner evidence, pricing and packaging hypotheses, sales plays, and funnel measures into one shared GTM model. Would a brief conversation be worthwhile?$$,
 email_subject=$$Building the commercial operating layer behind DNSid category creation$$,
 email_intro_message=$$Hi Lauren,\n\nI saw Identity Digital’s Product Marketing Manager contractor search for DNSid. Because the role reports to you and owns positioning, ICPs, competitive intelligence, sales enablement, launches, and pricing and packaging input, the opportunity looks broader than adding product-marketing capacity alone.\n\nThe leverage is connecting those decisions into one commercial system across market intelligence, segmentation, product marketing, sales, RevOps, analytics, and executive measurement. That is closely aligned with the work my partner and I lead through RevHub.\n\nWould you be open to a 20-minute conversation about the operating layer behind DNSid’s category creation and early commercial adoption?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Lauren,\n\nA practical first phase could connect DNSid’s target segments, buyer journeys, messaging, design-partner evidence, pricing and packaging hypotheses, sales plays, and funnel measures into one shared GTM model.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Lauren,\n\nClosing the loop. The fit I see is helping Innovation Labs turn early category and customer learning into a repeatable commercial system as DNSid moves from design partners toward broader adoption.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$Business email returned through current commercial-data enrichment; no email pattern was guessed or inferred.$$
where lower(trim(company))=$$identity digital$$ and lower(trim(contact_name))=$$lauren goulston$$;

-- Rachel Sterling — Target 3
insert into public.project_contacts (
 company, company_id, contact_name, title, linkedin_url, email, priority,
 target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason,
 linkedin_connect_message, intro_message, follow_up_message, email_subject,
 email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice
)
select $$Identity Digital$$,
 (select id from public.companies where normalized_name=$$identity digital$$ limit 1),
 $$Rachel Sterling$$, $$Chief Marketing Officer$$,
 $$https://www.linkedin.com/in/rachelsterling/$$,
 $$rachel.sterling@identity.digital$$, $$A$$, $$Target 3$$,
 $$The founding DNSid Product Marketing role owns the commercial narrative, positioning, buyer personas, launches, enablement, and market evidence. Rachel is Identity Digital’s current Chief Marketing Officer and the senior marketing leader responsible for ensuring this new category story scales coherently across the broader brand and market portfolio.$$, 
 $$RevHub can help Rachel connect the emerging AI-agent identity narrative to audience and account segmentation, launch architecture, partner and channel activation, sales enablement, CRM signals, and shared commercial measurement so category building translates into measurable adoption.$$, 
 $$Senior marketing governance stakeholder. Identity Digital’s current company and careers materials identify Rachel as Chief Marketing Officer; the founding Product Marketing mandate directly overlaps category positioning, launches, buyer insight, and commercial narrative.$$, 
 $$Rachel, Identity Digital’s founding DNSid Product Marketing contractor search caught my attention. Building a new AI Agent Identity category requires positioning, buyer insight, launches and enablement to connect cleanly to the broader brand and commercial system. I’d value connecting.$$, 
 $$Thanks for connecting, Rachel.\n\nI saw Identity Digital’s Product Marketing Manager contractor search for DNSid. The role is being asked to define positioning, buyer personas and ICPs, competitive intelligence, launches, enablement, and pricing and packaging input for a new AI Agent Identity category.\n\nGiven your leadership as CMO, the opportunity I see is making sure that category creation connects to the broader market architecture: audience priorities, brand narrative, partner activation, sales motions, CRM signals, and commercial measurement.\n\nThrough RevHub, my partner and I help teams connect those pieces into one growth operating system.\n\nWould you be open to a conversation about how DNSid’s product-marketing foundation can scale into a measurable market and revenue motion?$$,
 $$Rachel, following up because a useful first phase could map DNSid’s category narrative, ICPs and buyer journeys to launch programs, partner channels, sales enablement, account signals, and the measures used to judge commercial adoption. Would a brief conversation be useful?$$,
 $$Scaling DNSid category creation into measurable market adoption$$,
 $$Hi Rachel,\n\nI saw Identity Digital’s founding Product Marketing contractor search for DNSid. The mandate covers positioning, ICPs and personas, competitive intelligence, launches, sales enablement, and pricing and packaging input for the emerging AI Agent Identity category.\n\nGiven your role as CMO, the larger opportunity appears to be connecting that work to the broader market system: audience priorities, brand narrative, partner channels, sales execution, CRM signals, and commercial measurement.\n\nThat connective layer is what my partner and I build through RevHub across marketing, sales, RevOps, analytics, and technology.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 $$Hi Rachel,\n\nA useful first step could map DNSid’s category narrative, ICPs, and buyer journeys to launch programs, partner channels, sales enablement, account signals, and the measures used to judge adoption.\n\nWould a brief conversation next week be worthwhile?$$,
 $$Hi Rachel,\n\nClosing the loop. The opportunity I see is helping Identity Digital make the new DNSid category legible across marketing, partners, sales, and executive measurement rather than treating product marketing as a standalone workstream.\n\nIs there a 20-minute window worth holding?$$,
 $$Business email returned through current commercial-data enrichment; no email pattern was guessed or inferred.$$
where not exists (
 select 1 from public.project_contacts
 where (lower(trim(company))=$$identity digital$$ and lower(trim(contact_name))=$$rachel sterling$$)
    or linkedin_url=$$https://www.linkedin.com/in/rachelsterling/$$
    or lower(email)=$$rachel.sterling@identity.digital$$
);

update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$identity digital$$ limit 1),
 title=$$Chief Marketing Officer$$,
 linkedin_url=$$https://www.linkedin.com/in/rachelsterling/$$,
 email=$$rachel.sterling@identity.digital$$,
 priority=$$A$$, target_type_raw=$$Target 3$$,
 outreach_angle=$$The founding DNSid Product Marketing role owns the commercial narrative, positioning, buyer personas, launches, enablement, and market evidence. Rachel is Identity Digital’s current Chief Marketing Officer and the senior marketing leader responsible for ensuring this new category story scales coherently across the broader brand and market portfolio.$$, 
 value_hypothesis=$$RevHub can help Rachel connect the emerging AI-agent identity narrative to audience and account segmentation, launch architecture, partner and channel activation, sales enablement, CRM signals, and shared commercial measurement so category building translates into measurable adoption.$$, 
 stakeholder_selection_reason=$$Senior marketing governance stakeholder. Identity Digital’s current company and careers materials identify Rachel as Chief Marketing Officer; the founding Product Marketing mandate directly overlaps category positioning, launches, buyer insight, and commercial narrative.$$, 
 linkedin_connect_message=$$Rachel, Identity Digital’s founding DNSid Product Marketing contractor search caught my attention. Building a new AI Agent Identity category requires positioning, buyer insight, launches and enablement to connect cleanly to the broader brand and commercial system. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Rachel.\n\nI saw Identity Digital’s Product Marketing Manager contractor search for DNSid. The role is being asked to define positioning, buyer personas and ICPs, competitive intelligence, launches, enablement, and pricing and packaging input for a new AI Agent Identity category.\n\nGiven your leadership as CMO, the opportunity I see is making sure that category creation connects to the broader market architecture: audience priorities, brand narrative, partner activation, sales motions, CRM signals, and commercial measurement.\n\nThrough RevHub, my partner and I help teams connect those pieces into one growth operating system.\n\nWould you be open to a conversation about how DNSid’s product-marketing foundation can scale into a measurable market and revenue motion?$$,
 follow_up_message=$$Rachel, following up because a useful first phase could map DNSid’s category narrative, ICPs and buyer journeys to launch programs, partner channels, sales enablement, account signals, and the measures used to judge commercial adoption. Would a brief conversation be useful?$$,
 email_subject=$$Scaling DNSid category creation into measurable market adoption$$,
 email_intro_message=$$Hi Rachel,\n\nI saw Identity Digital’s founding Product Marketing contractor search for DNSid. The mandate covers positioning, ICPs and personas, competitive intelligence, launches, sales enablement, and pricing and packaging input for the emerging AI Agent Identity category.\n\nGiven your role as CMO, the larger opportunity appears to be connecting that work to the broader market system: audience priorities, brand narrative, partner channels, sales execution, CRM signals, and commercial measurement.\n\nThat connective layer is what my partner and I build through RevHub across marketing, sales, RevOps, analytics, and technology.\n\nWould you be open to a 20-minute conversation?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Rachel,\n\nA useful first step could map DNSid’s category narrative, ICPs, and buyer journeys to launch programs, partner channels, sales enablement, account signals, and the measures used to judge adoption.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Rachel,\n\nClosing the loop. The opportunity I see is helping Identity Digital make the new DNSid category legible across marketing, partners, sales, and executive measurement rather than treating product marketing as a standalone workstream.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$Business email returned through current commercial-data enrichment; no email pattern was guessed or inferred.$$
where lower(trim(company))=$$identity digital$$ and lower(trim(contact_name))=$$rachel sterling$$;

-- Matt Overman — existing contact refreshed, Target 2
update public.project_contacts set
 company_id=(select id from public.companies where normalized_name=$$identity digital$$ limit 1),
 title=$$Chief Revenue Officer$$,
 email=$$matt.overman@identity.digital$$,
 priority=$$A$$, target_type_raw=$$Target 2$$,
 outreach_angle=$$Identity Digital is hiring a founding Product Marketing contractor for DNSid to define positioning, ICPs, launches, sales enablement, competitive intelligence, and pricing and packaging input. As Chief Revenue Officer, Matt is the primary enterprise commercial beneficiary of a repeatable buyer model and sales motion.$$, 
 value_hypothesis=$$RevHub can help Matt connect DNSid’s category and buyer model to account and partner segmentation, sales plays, enablement, CRM stages, opportunity evidence, pricing hypotheses, pipeline, and forecast visibility so early product-market learning becomes a repeatable revenue motion.$$, 
 stakeholder_selection_reason=$$Primary commercial beneficiary. Identity Digital’s current leadership materials identify Matt as Chief Revenue Officer; the founding DNSid Product Marketing mandate directly feeds the sales motion through ICP definition, enablement, launches, competitive insight, and pricing/packaging input.$$, 
 linkedin_connect_message=$$Matt, Identity Digital’s founding DNSid Product Marketing contractor search stood out. The mandate spans ICPs, positioning, enablement, launches and pricing/packaging—the pieces Revenue needs to turn a new category into repeatable commercial adoption. I’d value connecting.$$, 
 intro_message=$$Thanks for connecting, Matt.\n\nI saw the Product Marketing Manager contractor search for DNSid. The role is expected to define ICPs and personas, positioning, competitive intelligence, sales enablement, launches, and pricing and packaging input for a new AI Agent Identity category.\n\nFor Revenue, the leverage is turning those decisions into a repeatable commercial motion across target accounts and partners, sales plays, CRM stages, opportunity evidence, pipeline, and forecast visibility.\n\nThrough RevHub, my partner and I help teams build that connective operating layer across marketing, sales, RevOps, analytics, and technology.\n\nWould you be open to a conversation about how DNSid’s early category and customer learning can translate into a scalable revenue motion?$$,
 follow_up_message=$$Matt, following up because a useful first phase could connect DNSid’s ICPs, buyer journeys, messaging, pricing hypotheses, enablement, design-partner evidence, CRM stages, and pipeline measures into one shared commercial model. Would a brief conversation be useful?$$,
 email_subject=$$Turning DNSid category creation into a repeatable revenue motion$$,
 email_intro_message=$$Hi Matt,\n\nI saw Identity Digital’s Product Marketing Manager contractor search for DNSid. The mandate includes ICP and persona definition, positioning, competitive intelligence, sales enablement, launches, and pricing and packaging input for a new AI Agent Identity category.\n\nFrom the revenue side, the opportunity is connecting that work directly to target accounts and partners, sales plays, CRM stages, opportunity evidence, pipeline, and forecast visibility.\n\nRevHub helps commercial teams build that connective operating layer across marketing, sales, RevOps, analytics, and technology.\n\nWould you be open to a 20-minute conversation about turning DNSid’s early market learning into a scalable commercial motion?\n\nBest,\nChad Parker$$,
 email_follow_up_1=$$Hi Matt,\n\nA practical first step could connect DNSid’s ICPs, buyer journeys, messaging, pricing hypotheses, design-partner evidence, enablement, CRM stages, and pipeline measures into one shared commercial model.\n\nWould a brief conversation next week be worthwhile?$$,
 email_follow_up_2=$$Hi Matt,\n\nClosing the loop. The fit I see is helping Revenue turn DNSid’s category and customer learning into repeatable targeting, sales plays, opportunity progression, and forecast evidence.\n\nIs there a 20-minute window worth holding?$$,
 email_assumption_notice=$$Business email returned through current commercial-data enrichment; no email pattern was guessed or inferred.$$
where lower(trim(company))=$$identity digital$$ and lower(trim(contact_name))=$$matt overman$$;

-- Company-level signal. Current schema keeps one active signal per company, so this
-- intentionally promotes the newer July 27 DNSid Product Marketing opportunity.
insert into public.company_signals (company, role_title, posted_date, source_url, notes)
values (
 $$Identity Digital$$,
 $$Product Marketing Manager (Contractor)$$,
 date $$2026-07-27$$,
 $$https://www.gofractional.com/job/identity-digital-product-marketing-manager-contractor$$,
 $$SOURCE PRIORITY 1. Separate Innovation Labs contractor mandate from Identity Digital’s existing integrated-marketing search. Founding product-marketing leader for DNSid owns positioning, ICPs/personas, competitive intelligence, pricing/packaging input, sales enablement, and product launches; reports to the Innovation Labs GM and partners closely with the commercial lead. Engagement: Remote U.S. · Contractor · 10–30 hrs/week · Indefinite · $100–$150/hr estimated.$$
)
on conflict (company) do update set
 role_title=excluded.role_title,
 posted_date=excluded.posted_date,
 source_url=excluded.source_url,
 notes=excluded.notes;
