-- Refresh sync of RevHub-Marketing sheet content into project_contacts.
-- Companies: 0 new (all sheet companies already exist in `companies`).
-- Signals: 0 changes (RevHub-Marketing Signals already fully in sync).
-- Jacob Cacheria/Cars & Bids priority intentionally left null; sheet still
-- has the invalid 'Target 3' value from the prior sync pass.

-- 42 existing contacts backfilled/updated with sheet messaging

update public.project_contacts set
  outreach_angle = $$Direct hiring authority for the remote Fractional Growth Marketing Leader. The role reports to Sarah and owns a zero-to-one reach strategy, 3-4x trial growth, 100 new customers by the end of October, vertical playbooks, positioning, channel diversification, and trustworthy measurement.$$,
  value_hypothesis = $$Chad can step directly into the owner's seat, assess prior growth efforts, launch immediate high-conviction tests, improve attribution and CAC visibility, and build repeatable acquisition playbooks for pet care first and Pro Beauty second, with broader RevHub analytics support available as needed.$$,
  linkedin_connect_message = $$Hi Sarah, I saw Manifest's fractional Growth Marketing Leader search. The zero-to-one mandate, 3-4x trial goal, vertical playbooks, and measurement challenge map closely to growth systems I have built. I would value connecting.$$,
  intro_message = $$Thanks for connecting, Sarah.

Based on your work as Chief Executive Officer at Manifest, I wanted to be direct about why I reached out.

Over the past 15 years, I’ve helped organizations connect customer and market intelligence, segmentation, pricing, marketing, sales execution, operations, and analytics into a unified commercial growth system. That work led me to co-found RevHub, a team of experienced commercial strategy, marketing, revenue operations, analytics, sales, and technology leaders who help companies build and execute integrated growth systems.

I noticed Manifest is hiring for a authority, which made me curious whether bringing greater alignment across customer intelligence, segmentation, pricing, marketing, sales execution, operations, forecasting, and executive reporting is an area you are currently exploring or encountering challenges with.

Would you be open to a quick 15-minute conversation to learn more about what we do and determine whether it could support any of your current priorities?$$
where lower(contact_name) = lower('Sarah Horn') and company = 'Manifest';

update public.project_contacts set
  outreach_angle = $$The posting explicitly names the CPTO as a close collaborator. Growth performance depends on connecting channel experiments, message-market fit, product instrumentation, the KPI dashboard, AI-native workflows, and trustworthy attribution.$$,
  value_hypothesis = $$Chad can partner with Zack to build a clean growth-data loop from acquisition source through trial behavior, activation, conversion, retention, and vertical economics, ensuring the 90-day plan becomes measurable and repeatable rather than a disconnected set of campaigns.$$,
  linkedin_connect_message = $$Hi Zack, I saw Manifest's fractional growth search and that the role will work closely with you. The blend of AI-native execution, vertical growth playbooks, product data, and trustworthy measurement is right in my wheelhouse. I would value connecting.$$,
  intro_message = $$Thanks for connecting, Zack.

Based on your work as Chief Product and Technology Officer at Manifest, I wanted to be direct about why I reached out.

Over the past 15 years, I’ve helped organizations connect customer and market intelligence, segmentation, pricing, marketing, sales execution, operations, and analytics into a unified commercial growth system. That work led me to co-found RevHub, a team of experienced commercial strategy, marketing, revenue operations, analytics, sales, and technology leaders who help companies build and execute integrated growth systems.

I’m curious whether bringing greater alignment across customer and market data, analytics, automation, forecasting, and executive reporting is an area you are currently exploring or encountering challenges with.

Would you be open to a quick 15-minute conversation to learn more about what we do and determine whether it could support any of your current priorities?$$
where lower(contact_name) = lower('Zack Avshalomov') and company = 'Manifest';

update public.project_contacts set
  outreach_angle = $$Oliver leads Manifest's day-to-day growth work and is closest to challenges around channel diversification, trial quality, CAC visibility, attribution, and repeatable vertical playbooks. Because his role is below the fractional growth leadership mandate, outreach should explore those challenges rather than suggest that he owns the hiring decision.$$,
  value_hypothesis = $$Chad can compare notes with Oliver on the systems required to increase test velocity and connect acquisition source, message, trial behavior, conversion, CAC, and retention without positioning the conversation as an application to a role Oliver may not control.$$,
  stakeholder_selection_reason = $$Directly affected growth operator and named collaborator, but below the seniority of the fractional leadership mandate. Retained as Target 3 for operational insight only; outreach is challenge-led and does not imply hiring authority.$$,
  linkedin_connect_message = $$Hi Oliver, your work leading growth at Manifest caught my attention. I have built systems connecting acquisition tests, trial quality, CAC, attribution, and lifecycle performance. I would value connecting and comparing notes on the growth challenges you are working through.$$,
  intro_message = $$Thanks for connecting, Oliver.

Based on your work as Director of Growth at Manifest, I wanted to be direct about why I reached out.

Over the past 15 years, I’ve helped organizations connect customer and market intelligence, segmentation, pricing, marketing, sales execution, operations, and analytics into a unified commercial growth system. That work led me to co-found RevHub, a team of experienced commercial strategy, marketing, revenue operations, analytics, sales, and technology leaders who help companies build and execute integrated growth systems.

I noticed Manifest is hiring for a decision, which made me curious whether bringing greater alignment across customer insight, segmentation, campaign execution, attribution, and pipeline visibility is an area you are currently exploring or encountering challenges with.

Would you be open to a quick 15-minute conversation to learn more about what we do and determine whether it could support any of your current priorities?$$
where lower(contact_name) = lower('Oliver Hughes') and company = 'Manifest';

update public.project_contacts set
  outreach_angle = $$The fractional Marketing Leader reports directly to Girish and is expected to build predictable enterprise pipeline, strengthen ABM, lead the team, and connect marketing execution to company growth.$$,
  value_hypothesis = $$Chad can provide immediate senior marketing ownership while connecting positioning, account segmentation, demand generation, pipeline measurement, and RevOps into one operating model that the permanent team can inherit.$$,
  linkedin_connect_message = $$Hi Girish, I saw Flosum's fractional Marketing Leader search. The mandate to build predictable enterprise pipeline, strengthen ABM, and connect marketing with RevOps closely matches growth systems I have built. I would value connecting.$$,
  intro_message = $$Thanks for connecting, Girish.

Based on your work as Chief Executive Officer at Flosum, I wanted to be direct about why I reached out.

Over the past 15 years, I’ve helped organizations connect customer and market intelligence, segmentation, pricing, marketing, sales execution, operations, and analytics into a unified commercial growth system. That work led me to co-found RevHub, a team of experienced commercial strategy, marketing, revenue operations, analytics, sales, and technology leaders who help companies build and execute integrated growth systems.

I’m curious whether bringing greater alignment across customer intelligence, segmentation, pricing, marketing, sales execution, operations, forecasting, and executive reporting is an area you are currently exploring or encountering challenges with.

Would you be open to a quick 15-minute conversation to learn more about what we do and determine whether it could support any of your current priorities?$$
where lower(contact_name) = lower('Girish Jashnani') and company = 'Flosum';

update public.project_contacts set
  outreach_angle = $$Shaun owns Americas sales and would directly depend on the fractional leader for account focus, enterprise messaging, ABM execution, lead quality, pipeline creation, and sales enablement.$$,
  value_hypothesis = $$Chad can align marketing programs with sales priorities by connecting ICP and account selection, value propositions, campaign signals, lead handoffs, pipeline stages, and forecast visibility.$$,
  linkedin_connect_message = $$Hi Shaun, I saw Flosum's fractional Marketing Leader search. The focus on enterprise pipeline, ABM, and a predictable growth engine clearly depends on tight sales alignment. That is central to the commercial systems work I lead. I would value connecting.$$,
  intro_message = $$Thanks for connecting, Shaun.

Based on your work as VP of Sales, Americas at Flosum, I wanted to be direct about why I reached out.

Over the past 15 years, I’ve helped organizations connect customer and market intelligence, segmentation, pricing, marketing, sales execution, operations, and analytics into a unified commercial growth system. That work led me to co-found RevHub, a team of experienced commercial strategy, marketing, revenue operations, analytics, sales, and technology leaders who help companies build and execute integrated growth systems.

I’m curious whether bringing greater alignment across segmentation, account prioritization, pricing, sales execution, forecasting, and pipeline visibility is an area you are currently exploring or encountering challenges with.

Would you be open to a quick 15-minute conversation to learn more about what we do and determine whether it could support any of your current priorities?$$
where lower(contact_name) = lower('Shaun Birch') and company = 'Flosum';

update public.project_contacts set
  outreach_angle = $$Stan is building Flosum's RevOps foundation and is close to challenges around funnel definitions, source data, forecasting, GTM infrastructure, and executive reporting. Because he is below the seniority of the fractional Marketing Leader mandate, outreach should focus on the problems he is solving rather than the open role.$$,
  value_hypothesis = $$Chad can compare operating approaches with Stan and help connect commercial strategy to lifecycle definitions, campaign taxonomy, shared KPIs, forecast inputs, and activation rules without presenting Stan as the hiring authority for senior marketing leadership.$$,
  stakeholder_selection_reason = $$Direct RevOps operator with strong proximity to the work, but below the seniority of the fractional Marketing Leader mandate. Retained as Target 3 for challenge discovery only; outreach does not reference the hiring process or imply decision authority.$$,
  linkedin_connect_message = $$Hi Stan, your work building Flosum's RevOps foundation caught my attention. I have led similar programs across lifecycle definitions, source data, forecasting, and executive reporting. I would value connecting and comparing notes on the GTM challenges you are solving.$$
where lower(contact_name) = lower('Stan Kuperberg') and company = 'Flosum';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Governance-level stakeholder above the fractional COO mandate. AIRA identifies Marie as its 2025-2026 Board President, and the board guides the organization's strategic vision and executive oversight.$$
where lower(contact_name) = lower('Marie Bottomley Hartel') and company = 'American Immunization Registry Association';

update public.project_contacts set
  target_type_raw = $$Target 3$$,
  stakeholder_selection_reason = $$Governance and financial-oversight stakeholder above the fractional COO mandate. AIRA identifies Steve as Board Treasurer, a member of the Finance and Executive Committees, and an experienced software executive and consultant.$$
where lower(contact_name) = lower('Steve Murchie') and company = 'American Immunization Registry Association';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Explicit hiring promoter and founder. Johnathan publicly announced the current B2B paid-ads openings and described the Growth Manager role, making him the clearest executive owner of the hiring need and the client-delivery model it supports.$$
where lower(contact_name) = lower('Johnathan Dane') and company = 'KlientBoost';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Primary functional and operating collaborator. Kylee is KlientBoost's Growth Director and publicly leads B2B paid-media thinking around CRM value, lead quality, and revenue outcomes, making her the most relevant day-to-day leader for the Growth Manager mandate.$$
where lower(contact_name) = lower('Kylee Shaughnessy Cimilluca') and company = 'KlientBoost';

update public.project_contacts set
  target_type_raw = $$Target 3$$,
  stakeholder_selection_reason = $$Direct commercial beneficiary. John leads revenue partnerships and brings customer-success experience, while the role explicitly owns client relationships, upsell and cross-sell opportunities, renewals, and long-term revenue stability.$$
where lower(contact_name) = lower('John Morinaga') and company = 'KlientBoost';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Explicit reporting manager and direct functional owner. E3n's posting states that the fractional contractor reports to the Director of Marketing, and E3n's current team directory identifies Daren as Director of Marketing.$$
where lower(contact_name) = lower('Daren Worcester') and company = 'E3n';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Primary cross-functional business owner. Christina is E3n's Vice President of Member Relations, and the role's stated outcomes include member engagement, renewal, upsell, fewer service calls, and collaboration with Member Success.$$
where lower(contact_name) = lower('Christina Dotchin, MPA') and company = 'E3n';

update public.project_contacts set
  target_type_raw = $$Target 3$$,
  stakeholder_selection_reason = $$Executive sponsor and escalation contact. Mike is E3n's inaugural CEO and is accountable for integrating ERB and EMA, delivering the new membership promise, and ensuring post-merger systems and communications support organizational growth.$$
where lower(contact_name) = lower('Mike Flanagan') and company = 'E3n';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Primary functional owner. Sean is publicly identified as Sui Foundation's Head of Partner Marketing and leads partner, retail, and event-related ecosystem growth that directly aligns with the contract mandate.$$
where lower(contact_name) = lower('Sean Taylor') and company = 'Sui Foundation';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Explicit operating collaborator and direct beneficiary. John currently leads global event marketing at Sui Foundation and publicly supports the exact event portfolio, systems, and execution responsibilities described in the contract role.$$
where lower(contact_name) = lower('John Flynn') and company = 'Sui Foundation';

update public.project_contacts set
  target_type_raw = $$Target 3$$,
  stakeholder_selection_reason = $$Senior partner and ecosystem stakeholder. Sarah leads Strategic Partnerships & Ecosystem Development, and the contract role explicitly requires close collaboration with internal leaders and external partners on goals, audiences, messaging, and business outcomes.$$
where lower(contact_name) = lower('Sarah Chow') and company = 'Sui Foundation';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Explicit reporting manager and direct functional owner. The posting states that the contractor works directly with the Head of Community & Events, and Kira publicly identifies Lindsay as Head of Community.$$
where lower(contact_name) = lower('Lindsay Rothfeld') and company = 'Kira';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Primary commercial collaborator. Tim leads global sales and publicly participates in Kira's conference and field-event motion, making him directly affected by event-generated district engagement, handoffs, and pipeline outcomes.$$
where lower(contact_name) = lower('Tim Melton') and company = 'Kira';

update public.project_contacts set
  target_type_raw = $$Target 3$$,
  stakeholder_selection_reason = $$Executive sponsor and escalation contact. Andrea is Kira's co-founder and CEO and is accountable for the company's product launch, category positioning, educator adoption, district growth, and overall operating scale.$$
where lower(contact_name) = lower('Andrea Pasinetti') and company = 'Kira';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Primary functional owner and likely hiring authority. Cast Influence identifies Leah as Co-Founder and Chief Communications Officer, and the role leads strategic PR programs while working closely with agency leadership.$$
where lower(contact_name) = lower('Leah R. Taylor') and company = 'Cast Influence';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Executive sponsor and escalation contact. Cast Influence identifies Justin as Co-Founder and CEO, accountable for agency growth, integrated service delivery, client outcomes, and whether the fractional role becomes permanent.$$
where lower(contact_name) = lower('Justin Kraft') and company = 'Cast Influence';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Explicit reporting manager and primary functional owner. The posting states that the fractional lead reports to the VP of Data, Digital and Technology, and CLUTCH identifies Dennis as the leader of that function.$$
where lower(contact_name) = lower('Dennis Hecht') and company = 'CLUTCH';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Primary business and revenue-operations collaborator. Alyssa leads Revenue Operations and the business function responsible for connecting client delivery, commercial performance, and company growth.$$
where lower(contact_name) = lower('Alyssa Hammerschmidt') and company = 'CLUTCH';

update public.project_contacts set
  target_type_raw = $$Target 3$$,
  stakeholder_selection_reason = $$Executive sponsor and escalation contact. Troy is CLUTCH's founder and CEO and is accountable for the firm's growth model, category strategy, client value, and expansion of the media-planning capability.$$
where lower(contact_name) = lower('Troy Schroeder') and company = 'CLUTCH';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Founder-level executive and current COO of Outlook Advisory Group. Melissa is the only publicly verified company leader, owns the fractional COO service model, and is the senior decision-maker for adding consultants or complementary delivery partners.$$
where lower(contact_name) = lower('Melissa Hansel') and company = 'Outlook Advisory Group';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Explicit founder and executive owner. HR Transformed publicly identifies Allyns as CEO and Founder, and the fractional Chief Marketing and Growth mandate requires an executive decision-maker at or above the C-suite role being sourced.$$
where lower(contact_name) = lower('Allyns Melendez, MBA') and company = 'HR Transformed';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Explicit program authority and likely hiring owner. Sue directs the Population Health Innovation Lab, and the Lead Research Scientist reports to PHIL leadership while stewarding its applied research and evaluation portfolio.$$
where lower(contact_name) = lower('Sue Grinnell') and company = 'Public Health Institute';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Executive sponsor above the Lead Research Scientist role. Melissa is PHI's President and CEO and is accountable for organization-wide mission impact, partnerships, program sustainability, and the management value created by research and evaluation.$$
where lower(contact_name) = lower('Melissa Stafford Jones, MPH') and company = 'Public Health Institute';

update public.project_contacts set
  target_type_raw = $$Target 3$$,
  stakeholder_selection_reason = $$Senior executive beneficiary above the Lead Research Scientist role. Ken leads PHI's development and strategic initiatives, and the role explicitly supports proposals, funder relationships, research translation, partner products, and new service offerings.$$
where lower(contact_name) = lower('Ken Shapiro') and company = 'Public Health Institute';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  outreach_angle = $$Rest & Reset is seeking a fractional Chief Marketing & Growth Officer to own brand strategy, profitable acquisition, conversion, retention, B2B expansion, pricing, merchandising, Klaviyo, attribution, and executive reporting. Alejandra is a mission-driven consumer-brand founder and co-created the company, making her the strongest verified executive owner of the brand, customer proposition, and growth mandate.$$,
  value_hypothesis = $$Chad can help Alejandra turn Rest & Reset's premium sanctuary positioning into a disciplined commercial growth system across audience segmentation, creative strategy, paid acquisition, conversion, lifecycle marketing, pricing, partnerships, B2B expansion, and one executive revenue scorecard.$$,
  stakeholder_selection_reason = $$Co-founder and strongest verified executive owner for a fractional CMO and Head of Growth mandate. Alejandra publicly describes herself as a mission-driven consumer-brand founder and identifies David Shalam as her Rest & Reset co-founder, placing her at the same executive level as the opportunity and close to brand, customer, and growth decisions.$$,
  linkedin_connect_message = $$Hi Alejandra, I saw Rest & Reset's fractional Chief Marketing & Growth Officer search. The mandate to connect premium brand positioning, profitable acquisition, retention, B2B expansion, and trustworthy measurement closely matches consumer growth systems I have built. I would value connecting.$$,
  intro_message = $$Thanks for connecting, Alejandra.

Based on your work as Co-Founder at Rest & Reset, I wanted to be direct about why I reached out.

Over the past 15 years, I’ve helped organizations connect customer and market intelligence, segmentation, pricing, marketing, sales execution, operations, and analytics into a unified commercial growth system. That work led me to co-found RevHub, a team of experienced commercial strategy, marketing, revenue operations, analytics, sales, and technology leaders who help companies build and execute integrated growth systems.

I noticed Rest & Reset is hiring for a fractional Chief Marketing & Growth Officer, which made me curious whether bringing greater alignment across customer intelligence, segmentation, pricing, marketing, sales execution, operations, forecasting, and executive reporting is an area you are currently exploring or encountering challenges with.

Would you be open to a quick 15-minute conversation to learn more about what we do and determine whether it could support any of your current priorities?$$
where lower(contact_name) = lower('Alejandra Colmenares') and company = 'Rest & Reset';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  outreach_angle = $$Rest & Reset's fractional Chief Marketing & Growth Officer will own the full customer-growth system while the early-stage brand scales its D2C and commercial channels. David founded the company around its rest-as-ritual proposition and publicly communicates its product, brand, press, and growth story, making him an executive-level decision-maker for the mandate.$$,
  value_hypothesis = $$Chad can help David connect the founder narrative and product foundation to measurable audience growth, channel economics, conversion, retention, wholesale and hospitality partnerships, revenue forecasting, and disciplined investment decisions.$$,
  stakeholder_selection_reason = $$Co-founder and executive-level stakeholder at the same level as the fractional CMO mandate. David publicly states that he founded Rest & Reset and credits Alejandra as his co-founder, while regularly communicating the company's product, brand, press, and growth narrative.$$,
  linkedin_connect_message = $$Hi David, I saw Rest & Reset's fractional Chief Marketing & Growth Officer search. Your work building the rest-as-ritual proposition and premium home collection creates a strong opportunity to connect brand storytelling, channel economics, retention, and B2B growth. I would value connecting.$$,
  intro_message = $$Thanks for connecting, David.

Based on your work as Co-Founder at Rest & Reset, I wanted to be direct about why I reached out.

Over the past 15 years, I’ve helped organizations connect customer and market intelligence, segmentation, pricing, marketing, sales execution, operations, and analytics into a unified commercial growth system. That work led me to co-found RevHub, a team of experienced commercial strategy, marketing, revenue operations, analytics, sales, and technology leaders who help companies build and execute integrated growth systems.

I’m curious whether bringing greater alignment across customer intelligence, segmentation, pricing, marketing, sales execution, operations, forecasting, and executive reporting is an area you are currently exploring or encountering challenges with.

Would you be open to a quick 15-minute conversation to learn more about what we do and determine whether it could support any of your current priorities?$$
where lower(contact_name) = lower('David Shalam') and company = 'Rest & Reset';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Named founder and sole publicly verified executive owner. Gusher identifies Chris Joyce as Forkoff Co.'s founder, and the open Growth & Outbound and CMO roles are equity-based partner positions that require founder-level approval.$$
where lower(contact_name) = lower('Chris Joyce') and company = 'Forkoff Co.';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Founder, CEO, and sole publicly verified executive at or above the fractional Director of Marketing mandate. Conceptual Minds' official site identifies Taran as Founder and CEO, making him the likely hiring authority and executive owner of client strategy, agency capacity, and new-business growth.$$
where lower(contact_name) = lower('Taran Sodhi, MBA') and company = 'Conceptual Minds';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Senior executive owner above the contract Growth Marketing Operator mandate. Craig is SH/FT's COO and CFO and is accountable for scalable operations, financial performance, organizational development, and the systems supporting the company's next phase of growth.$$
where lower(contact_name) = lower('Craig Ayers') and company = 'SH/FT (Shift Paradigm)';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Direct executive owner above the contract role. Arturo is SH/FT's Chief Growth Officer and leads the commercial system most affected by growth strategy, client acquisition, positioning, partnerships, and measurable expansion.$$
where lower(contact_name) = lower('Arturo Mendiola') and company = 'SH/FT (Shift Paradigm)';

update public.project_contacts set
  target_type_raw = $$Target 3$$,
  stakeholder_selection_reason = $$VP-level functional influencer accepted under the seniority rule. Isaac leads Growth Strategy and is uniquely close to the strategy-to-execution challenges behind the contract operator signal. Outreach is challenge-led and does not imply that he owns the hiring decision.$$
where lower(contact_name) = lower('Isaac Ferreira') and company = 'SH/FT (Shift Paradigm)';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Same-level senior marketing leader and closest verified functional influencer. Amanda publicly identifies as BleuBully's Fractional CMO and documents building the brand, pricing, positioning, website, email flows, D2C launch, and demand engine. Outreach is challenge-led and partnership-oriented because she may influence the engagement but is not assumed to be the founder or final hiring authority.$$
where lower(contact_name) = lower('Amanda Pond') and company = 'BleuBully Bedding';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Explicit reporting manager and highest-level decision authority. The current Head of Analytics posting states that the role reports directly to the CEO, and 360training's official leadership page identifies Tom as CEO and Managing Partner.$$
where lower(contact_name) = lower('Tom Anderson') and company = '360training';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Senior executive functional beneficiary at or above the Head-level signal. Ryan is 360training's Chief Marketing Officer with responsibility for business development and B2B sales, and the role explicitly supports marketing analytics, cross-functional insight, and acquisition integration.$$
where lower(contact_name) = lower('Ryan Linders') and company = '360training';

update public.project_contacts set
  target_type_raw = $$Target 1$$,
  stakeholder_selection_reason = $$Primary functional owner above the Director-level signal. Zone & Co publicly identifies Jessica as Chief Marketing Officer leading global marketing strategy, and the role directly supports pipeline, ABM, marketing operations, attribution, and global GTM alignment.$$
where lower(contact_name) = lower('Jessica Garrett, MBA') and company = 'Zone & Co';

update public.project_contacts set
  target_type_raw = $$Target 2$$,
  stakeholder_selection_reason = $$Senior executive revenue owner above the Director-level signal. Zone & Co identifies Steven as Chief Revenue Officer leading global GTM strategy, sales, partnerships, and revenue operations, all directly affected by the revenue-marketing mandate.$$
where lower(contact_name) = lower('Steven Bachert') and company = 'Zone & Co';

-- 3 new contacts

insert into public.project_contacts (company, company_id, contact_name, title, linkedin_url, email, priority, target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason, linkedin_connect_message, intro_message, follow_up_message, email_subject, email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice) values ($$BleuBully Bedding$$, 'd6f0833f-f6e1-4402-bc61-3ce6fc2668b7', $$Kelsey Koster$$, $$Founder, KK Public Relations; PR and Communications Partner, BleuBully Bedding$$, $$https://www.linkedin.com/in/kelsey-koster-pr$$, $$kelsey@bleubully.com$$, $$A/B$$, $$Target 3$$, $$BleuBully is seeking fractional CMO leadership while expanding a premium bedding brand across D2C, product launches, retail and wholesale opportunities, retention, and measurable growth. Kelsey is the public relations and communications partner translating the founder story, product differentiation, awards, and mission into earned visibility, making her directly affected by the new marketing leadership model.$$, $$RevHub can help Kelsey connect earned media, founder thought leadership, product stories, audience segments, ecommerce campaigns, CRM and lifecycle signals, and revenue evidence into a shared communications-to-growth system that strengthens both brand authority and commercial performance.$$, $$Directly affected communications leader below the fractional CMO mandate. BleuBully's official press page publicly directs inquiries to Kelsey, and her direct LinkedIn profile identifies her as Founder of KK Public Relations while documenting BleuBully as a current client. The fractional CMO will shape brand strategy, audience priorities, campaigns, and measurement that must integrate with Kelsey's earned-media and founder-communications work. Outreach is partnership-led and does not imply hiring authority.$$, $$Kelsey, I saw BleuBully's fractional CMO search and your work building the brand's PR and communications visibility. Connecting earned media, founder narrative, ecommerce growth, and measurable customer outcomes is central to the commercial systems I lead. I would value connecting.$$, $$Thanks for connecting, Kelsey.

Based on your work as Founder of KK Public Relations and communications partner to BleuBully Bedding, I wanted to be direct about why I reached out.

I saw BleuBully's search for fractional CMO leadership. The brand already has strong product proof, founder visibility, press momentum, and a distinctive Sheets for Shelters mission. The next opportunity is making sure those communications assets connect consistently to priority audiences, ecommerce campaigns, lifecycle programs, wholesale conversations, and measurable revenue outcomes.

Over the past 15 years, I have helped organizations connect customer intelligence, positioning, marketing execution, CRM, operations, and analytics into one commercial growth system. Through RevHub, my partner and I combine senior strategy with hands-on analytical capacity.

Would you be open to a quick 15-minute conversation to compare approaches for connecting BleuBully's communications momentum to its broader growth system?$$, $$Kelsey, following up because a practical starting point could be a communications-to-growth map connecting founder and product narratives, press placements, audience segments, ecommerce traffic, campaign follow-up, lifecycle engagement, wholesale interest, and revenue evidence. Would you be open to a brief conversation?$$, $$Connecting BleuBully's press momentum to measurable growth$$, $$Hi Kelsey,

I saw BleuBully's search for fractional CMO leadership and your work building the brand's public-relations and communications momentum. The company already has strong founder visibility, product awards, customer proof, and a mission-led Sheets for Shelters story.

The next opportunity appears to be connecting those assets to a broader commercial system across audience segmentation, ecommerce campaigns, lifecycle engagement, wholesale opportunities, CRM signals, and revenue measurement. I have spent more than 15 years building growth systems that connect customer insight, positioning, marketing execution, operations, and analytics. Through RevHub, my partner and I add both strategic leadership and hands-on analytical capacity.

For BleuBully, a useful first phase could establish one communications-to-growth map showing which narratives serve which audiences, how press and content enter the customer journey, and which signals indicate commercial impact.

Would you be open to a 20-minute conversation next week? My approach is here: https://www.aboutchad.com/approach

Best,
Chad Parker$$, $$Hi Kelsey,

One practical deliverable could be a communications-to-growth map linking founder stories, product proof, press placements, audience segments, ecommerce traffic, campaign follow-up, lifecycle engagement, wholesale interest, and revenue outcomes.

Would a brief conversation next week be worthwhile?$$, $$Hi Kelsey,

Closing the loop. The opportunity I see is helping BleuBully preserve its strong brand and PR momentum while giving the broader marketing function clearer audience priorities, follow-through, and evidence of commercial impact.

Is there a 20-minute window worth holding?$$, $$Verified public business email published on BleuBully Bedding's official press page for its PR and press team.$$);

insert into public.project_contacts (company, company_id, contact_name, title, linkedin_url, email, priority, target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason, linkedin_connect_message, intro_message, follow_up_message, email_subject, email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice) values ($$HR Transformed$$, 'f879e845-6f97-416e-93ec-572a758737b7', $$Roselyn Vega$$, $$Chief of Staff$$, $$https://www.linkedin.com/in/roselyn-urena/$$, $$roselyn@hrtransformed.com$$, $$A/B$$, $$Target 3$$, $$HR Transformed is seeking fractional Chief Marketing & Growth leadership to connect brand, acquisition, conversion, retention, B2B expansion, attribution, and executive reporting. As Chief of Staff, Roselyn is positioned at the center of executive priorities, cross-functional coordination, operating cadence, and translating the fractional leader's strategy into accountable execution.$$, $$RevHub can help Roselyn turn the fractional growth mandate into a practical operating system connecting leadership priorities, marketing execution, client-service capacity, CRM and lifecycle workflows, ownership, and performance reporting without creating additional coordination burden.$$, $$Senior cross-functional operating stakeholder beneath the CEO and functional marketing owner. HR Transformed's official team page and Roselyn's public bio verify her current Chief of Staff title. The fractional executive's broad mandate will directly affect executive prioritization, team coordination, operating cadence, and implementation oversight under her remit. Outreach is challenge-led and does not imply that she owns the hiring decision.$$, $$Roselyn, HR Transformed's fractional Chief Marketing & Growth search stood out. Your Chief of Staff role puts you at the center of translating executive priorities into coordinated execution across teams, systems, and reporting. I would value connecting.$$, $$Thanks for connecting, Roselyn.

Based on your work as Chief of Staff at HR Transformed, I wanted to be direct about why I reached out.

I saw the search for fractional Chief Marketing & Growth leadership. The mandate spans brand, acquisition, conversion, retention, B2B expansion, attribution, dashboards, and revenue optimization. From your seat, success will likely depend on more than the strategy itself. It will require clear priorities, ownership, operating cadence, and coordination between the fractional leader, internal team, client-delivery work, and executive decision-making.

Over the past 15 years, I have helped organizations connect customer intelligence, marketing, sales execution, operations, CRM, analytics, and forecasting into one commercial growth system. Through RevHub, my partner and I combine strategic leadership with hands-on analytical and operating capacity.

Would you be open to a quick 15-minute conversation to compare approaches for operationalizing the growth mandate?$$, $$Roselyn, following up because a practical first step could be a growth operating map connecting executive priorities, audience and campaign work, consultation and client lifecycle stages, team ownership, service capacity, CRM workflows, and weekly performance measures. Would you be open to a brief conversation?$$, $$Operationalizing HR Transformed's fractional growth mandate$$, $$Hi Roselyn,

I saw HR Transformed's search for fractional Chief Marketing & Growth leadership. The role is expected to connect brand, acquisition, conversion, retention, B2B expansion, attribution, dashboards, and revenue optimization.

As Chief of Staff, you are likely close to the part that determines whether the engagement succeeds: translating executive direction into clear priorities, ownership, operating cadence, and coordinated execution across the fractional leader, internal team, client-delivery work, and supporting systems.

I have spent more than 15 years building commercial operating systems across customer intelligence, marketing, sales, CRM, operations, forecasting, analytics, and executive reporting. Through RevHub, my partner and I provide both strategic leadership and hands-on analytical capacity.

For HR Transformed, a useful first phase could create one growth operating map connecting priorities, audiences, campaigns, consultation and client lifecycle stages, service capacity, ownership, CRM workflows, and weekly performance measures.

Would you be open to a 20-minute conversation next week? My approach is here: https://www.aboutchad.com/approach

Best,
Chad Parker$$, $$Hi Roselyn,

One practical deliverable could be a growth operating map showing how executive priorities, audience and campaign work, consultation conversion, recurring services, team ownership, delivery capacity, CRM workflows, and performance reporting fit together.

Would a brief conversation next week be worthwhile?$$, $$Hi Roselyn,

Closing the loop. The opportunity I see is helping HR Transformed ensure the fractional growth strategy becomes a coordinated system the internal team can execute and leadership can manage, rather than a set of disconnected initiatives.

Is there a 20-minute window worth holding?$$, $$Verified public business email published on Roselyn Vega's official HR Transformed team biography.$$);

insert into public.project_contacts (company, company_id, contact_name, title, linkedin_url, email, priority, target_type_raw, outreach_angle, value_hypothesis, stakeholder_selection_reason, linkedin_connect_message, intro_message, follow_up_message, email_subject, email_intro_message, email_follow_up_1, email_follow_up_2, email_assumption_notice) values ($$Sparq$$, '84efbb58-9ba4-4f45-be44-6a5cd0e1c8fe', $$Barry Newton$$, $$Chief Sales Officer$$, $$https://www.linkedin.com/in/barrynewton1$$, null, $$A/B$$, $$Target 3$$, $$Sparq's fractional Community Manager and SEO/GEO/AEO writer is expected to build LinkedIn visibility, engage target clients and influencers, and show pipeline influence. Barry leads enterprise sales and is directly affected by whether that content and community activity reaches the right accounts, supports complex AI-transformation conversations, and converts visibility into qualified opportunities.$$, $$RevHub can help Barry connect executive thought leadership, AI-search visibility, account segmentation, engagement signals, CRM capture, sales follow-up, and pipeline attribution into one measurable commercial system so Sparq's content investment supports enterprise growth rather than awareness alone.$$, $$Direct commercial beneficiary and senior executive above the fractional role. Sparq's official leadership materials and public appointment announcement verify Barry as Chief Sales Officer. The fractional mandate explicitly targets clients and prospects, tracks pipeline influence, and develops executive thought leadership, making Barry responsible for converting visibility and engagement into enterprise opportunities. He is not the functional hiring owner, so Target 3 is appropriate.$$, $$Barry, I saw Sparq's fractional LinkedIn and SEO/GEO/AEO content search. Your enterprise sales mandate makes the connection between executive thought leadership, target-account engagement, AI-search visibility, and pipeline especially relevant. I would value connecting.$$, $$Thanks for connecting, Barry.

Based on your work as Chief Sales Officer at Sparq, I wanted to be direct about why I reached out.

I saw Sparq's fractional Community Manager and SEO/GEO/AEO Content Writer search. The role is expected to build LinkedIn presence, engage relevant clients and influencers, strengthen visibility in traditional and AI-powered search, and track pipeline influence.

From a sales perspective, the opportunity is connecting those activities to priority accounts, buying committees, CRM signals, follow-up plays, opportunity progression, and evidence of commercial impact. Over the past 15 years, I have helped organizations connect customer intelligence, marketing, sales execution, RevOps, operations, forecasting, and analytics into one commercial growth system. Through RevHub, my partner and I combine strategic leadership with hands-on analytical capacity.

Would you be open to a quick 15-minute conversation to compare approaches for connecting Sparq's content and community investment to enterprise pipeline?$$, $$Barry, following up because a practical first step could be a thought-leadership-to-pipeline map connecting priority enterprise segments, executive narratives, LinkedIn and AI-search engagement, CRM capture, sales follow-up, opportunity stages, and pipeline influence. Would you be open to a brief conversation?$$, $$Connecting Sparq's AI visibility to enterprise pipeline$$, $$Hi Barry,

I saw Sparq's search for a fractional Community Manager and SEO/GEO/AEO Content Writer. The role is expected to own LinkedIn, engage relevant clients and influencers, improve visibility in traditional and AI-powered search, support executive thought leadership, and report on pipeline influence.

Given your role leading enterprise sales, the larger opportunity is making sure that visibility connects to priority accounts, buying committees, CRM activity, sales follow-up, and measurable opportunity progression.

I have spent more than 15 years building commercial systems that connect customer intelligence, positioning, marketing, sales execution, RevOps, forecasting, and analytics. Through RevHub, my partner and I add both strategic leadership and hands-on analytical capacity.

For Sparq, a useful first phase could map executive narratives and content themes to target segments, engagement signals, account ownership, follow-up plays, opportunity stages, and pipeline evidence.

Would you be open to a 20-minute conversation next week? My approach is here: https://www.aboutchad.com/approach

Best,
Chad Parker$$, $$Hi Barry,

One practical deliverable could be a thought-leadership-to-pipeline map showing which enterprise audiences and narratives matter, how LinkedIn and AI-search engagement should be captured, who follows up, and which signals indicate real opportunity creation.

Would a brief conversation next week be worthwhile?$$, $$Hi Barry,

Closing the loop. The opportunity I see is helping Sparq turn executive visibility and AI-search authority into a measurable enterprise growth system rather than treating content performance and sales pipeline as separate workstreams.

Is there a 20-minute window worth holding?$$, $$No individual business email was publicly verified, so no email address was added.$$);
