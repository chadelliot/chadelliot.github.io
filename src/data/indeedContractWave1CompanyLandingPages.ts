import type { CompanyLandingPage } from "./companyLandingPages";

const proofPoints = [
  "Built enterprise marketing infrastructure from zero, including funnel architecture, CDP activation, segmentation, attribution, lifecycle operations, and cross-functional growth systems.",
  "Scaled digital revenue impact to $1.25B and influenced $2.5B in branch sales through measurable marketing and revenue systems.",
  "Created a full-funnel engine generating roughly 30K leads, 10K qualified prospects, and 1,500 customers per quarter.",
  "Delivered measurable incremental return: $1.82 EBITDA for every $1 spent."
];

const linkedInSearch = (query: string) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;

const page = (args: Omit<CompanyLandingPage, "proofPoints" | "status" | "ctaHref" | "ctaLabel">): CompanyLandingPage => ({
  ...args,
  proofPoints,
  ctaLabel: "Discuss fit",
  ctaHref: "/contact",
  status: "ready"
});

export const indeedContractWave1CompanyLandingPages: Record<string, CompanyLandingPage> = {
  "judge-anthony-consulting": page({
    slug: "judge-anthony-consulting",
    companyName: "Judge Anthony Consulting",
    industry: "Info-product / creator education growth",
    eyebrow: "Judge Anthony Consulting × Chad Parker",
    headline: "A revenue growth system for scaling content, funnels, webinars, lifecycle, and attribution.",
    subheadline: "A proposal-style response to the Senior Growth Marketer opportunity across paid acquisition, content library activation, webinar funnels, nurture, retention, reporting, and AI-enabled execution.",
    fitSummary: "Judge Anthony Consulting needs a senior growth operator to own the revenue path from cold traffic to converted customer and retained member. This is a strong fit because the opportunity combines content assets, lifecycle, paid acquisition, conversion paths, attribution, reporting, and automation.",
    likelyPriorities: [
      "Diagnose leaks across traffic, email capture, webinar conversion, checkout, retargeting, and ascension.",
      "Turn the existing content library into a structured acquisition and nurture engine.",
      "Build performance reporting around CAC, CPL, show rate, conversion, LTV, and paid-acquired revenue.",
      "Use AI and automation to scale content, testing, lifecycle, and reporting."
    ],
    recommendedEngagement: {
      title: "Info-Product Growth Operating System",
      description: "A fractional growth engagement focused on turning existing content, funnels, webinars, and lifecycle assets into a measurable revenue engine.",
      bullets: [
        "Audit the current funnel, content library, webinar paths, email/SMS nurture, paid acquisition, retargeting, attribution, and reporting.",
        "Build a prioritized growth roadmap that identifies the highest-leverage conversion and revenue opportunities.",
        "Create an AI-enabled content and campaign rhythm for creative testing, nurture, reporting, and lifecycle optimization.",
        "Define the 90-day scorecard across traffic, conversion, revenue, retention, and LTV."
      ]
    },
    proposal: {
      situation: "Judge Anthony Consulting has a seven-figure education and coaching business with a large social audience, multiple courses, membership communities, live webinars, an existing content library, and an AI legal companion platform.",
      opportunity: "The opportunity is to connect paid acquisition, organic capture, webinar operations, lifecycle, retargeting, attribution, and AI-enabled content workflows into a cleaner revenue system.",
      investment: "$6,000-$10,000/month; remote; fractional 10-20 hrs/week; potential full-time after 90 days",
      phases: [
        { title: "Growth diagnostic", duration: "90-day fractional scorecard", description: "Review funnel performance, content assets, webinars, paid media, lifecycle, checkout, retargeting, and attribution." },
        { title: "System build", duration: "90-day fractional scorecard", description: "Create the growth roadmap, content activation model, campaign cadence, lifecycle improvements, testing plan, and reporting dashboard." },
        { title: "Optimization and scale", duration: "90-day fractional scorecard", description: "Run experiments, improve conversion paths, document the operating system, and identify what to automate, delegate, or scale next." }
      ],
      outcomes: [
        "Clear view of the largest funnel and revenue constraints.",
        "Stronger content-to-email and webinar-to-revenue motion.",
        "Repeatable growth cadence tied to CAC, CPL, show rate, conversion, and LTV.",
        "AI-enabled workflows that reduce manual marketing execution over time."
      ]
    },
    outreachAngle: "I can help turn the existing content, webinar, lifecycle, and paid acquisition engine into a more measurable and automated growth system.",
    outreachContacts: [
      { name: "Tom Shipley", title: "Founder / platform leader", linkedinUrl: linkedInSearch("Tom Shipley Deal Boardroom"), selectionRationale: "The role description names Tom as the senior leader behind the platform and likely economic buyer or sponsor for the growth-marketing work." },
      { name: "Judge Anthony Consulting hiring lead", title: "Growth marketing hiring path", linkedinUrl: linkedInSearch("Judge Anthony Consulting growth marketer"), selectionRationale: "Role-based search path for the person coordinating the Senior Growth Marketer engagement if Tom is not the direct contact." }
    ]
  }),

  "cro-metrics": page({
    slug: "cro-metrics",
    companyName: "Cro Metrics",
    industry: "Experiment-led growth agency / conversion copy",
    eyebrow: "Cro Metrics × Chad Parker",
    headline: "A conversion copy and AI-agent system built for faster experimentation and measurable lift.",
    subheadline: "A proposal-style response to Cro Metrics’ Copywriter — Conversion & Growth Copy role across CRO copy, landing pages, lifecycle, paid ads, testing hypotheses, and AI writing agents.",
    fitSummary: "Cro Metrics needs a conversion copywriter who can write for measurable experiments and build AI writing agents that preserve brand voice. This is a strong fit because my background connects lifecycle marketing, landing pages, A/B testing, campaign strategy, AI workflows, and performance measurement.",
    likelyPriorities: [
      "Write hypothesis-driven copy for A/B tests, landing pages, email/SMS, and paid ads.",
      "Move quickly across B2B, B2C, nonprofit, and ecommerce client voices.",
      "Build and maintain brand-specific AI writing agents with guardrails and voice calibration.",
      "Partner with strategists, designers, and analysts to connect copy decisions to conversion outcomes."
    ],
    recommendedEngagement: {
      title: "Conversion Copy + AI Agent System",
      description: "A contract engagement focused on producing test-ready conversion copy while building reusable AI writing systems for client-specific brand voices.",
      bullets: [
        "Create copy variants for landing pages, lifecycle campaigns, paid media, and CRO experiments with clear strategic rationale.",
        "Build voice calibration files, prompt systems, reusable copy frameworks, and AI guardrails for assigned clients.",
        "Partner with strategists and designers to turn hypotheses into conversion-focused copy.",
        "Document test learnings to improve future variants, client voice systems, and team-wide copy velocity."
      ]
    },
    proposal: {
      situation: "Cro Metrics is expanding its design and creative bench to support conversion-focused copy across CRO experimentation, website design, lifecycle marketing, and paid media.",
      opportunity: "The opportunity is to deliver copy that tests clear hypotheses while using AI-agent systems to increase speed and consistency without losing brand voice.",
      investment: "$53,036-$73,901 annualized; remote; part-time contract; long-term fractional with potential full-time conversion",
      phases: [
        { title: "Voice and experiment calibration", duration: "Long-term fractional contract", description: "Review client voice guides, prior tests, briefs, funnels, and performance goals." },
        { title: "Copy production and AI-agent build", duration: "Long-term fractional contract", description: "Produce test-ready copy while building prompts, calibration files, copy frameworks, and quality guardrails." },
        { title: "Iteration and knowledge system", duration: "Long-term fractional contract", description: "Use results and feedback to improve variants, AI-agent output, and reusable team workflows." }
      ],
      outcomes: [
        "Faster production of test-ready landing page, lifecycle, and paid media copy.",
        "Reusable AI writing agents calibrated to client voice and conversion goals.",
        "Clearer copy rationale tied to hypotheses, objections, and value propositions.",
        "A repeatable system for scaling conversion copy without losing quality."
      ]
    },
    outreachAngle: "I can combine conversion copy, lifecycle strategy, experimentation, and AI-agent building to help Cro Metrics increase copy velocity while keeping every variant tied to measurable outcomes.",
    outreachContacts: [
      { name: "Kate Caulfield", title: "Director of Design", linkedinUrl: "https://www.linkedin.com/in/kate-caulfield/", selectionRationale: "The listing reports into Design, and Kate leads the design function connected to conversion copy and experimentation." },
      { name: "Dave Albert", title: "EVP, Product", linkedinUrl: "https://www.linkedin.com/in/davidpaulalbert", selectionRationale: "Executive over Product Design, Analytics, and R&D; likely senior influencer for experimentation and AI-enabled creative systems." },
      { name: "Gwen Hammes", title: "Co-CEO", linkedinUrl: "https://www.linkedin.com/in/gwen-hammes", selectionRationale: "Executive sponsor for agency growth and client impact; useful for higher-level positioning." },
      { name: "Taylor Miller", title: "Sr. Manager, People & Culture", linkedinUrl: "https://www.linkedin.com/in/tmiller2020/", selectionRationale: "People and Culture leader; likely hiring process contact or influencer." },
      { name: "Chris Neumann", title: "Founder & CEO", linkedinUrl: "https://www.linkedin.com/in/chrisneumann/", selectionRationale: "Founder and CEO; useful if the outreach angle is framed around AI-enabled experimentation and agency leverage." }
    ]
  }),

  "sage-haus": page({
    slug: "sage-haus",
    companyName: "Sage Haus",
    industry: "Household staffing / lifecycle and conversion growth",
    eyebrow: "Sage Haus × Chad Parker",
    headline: "A lifecycle and conversion engine for moving families and candidates from interest to action.",
    subheadline: "A proposal-style response to Sage Haus’s Growth Marketing Lead — Lifecycle & Conversion role across email, SMS, outbound automation, funnel optimization, dashboards, and AI-enabled personalization.",
    fitSummary: "Sage Haus needs a hands-on growth marketer to own lifecycle, SMS, outbound automation, funnel conversion, and reporting. This is a strong fit because my work is centered on lifecycle architecture, segmentation, automation, conversion paths, dashboards, and practical systems.",
    likelyPriorities: [
      "Audit email and SMS lifecycle across families and candidates.",
      "Fix the highest-impact drop-offs and relaunch nurture with stage-level conversion targets.",
      "Run outbound automation experiments that balance personalization, scale, and channel health.",
      "Build lifecycle and funnel dashboards that leadership can understand and use."
    ],
    recommendedEngagement: {
      title: "Lifecycle Conversion Operating System",
      description: "A contract growth engagement focused on improving email/SMS lifecycle, outbound automation, funnel conversion, and performance visibility.",
      bullets: [
        "Map the full lifecycle across families and candidates.",
        "Rebuild high-value sequences with conversion goals, segment logic, messaging hierarchy, and measurement rules.",
        "Pilot outbound automation using AI-assisted personalization, targeting, scripts, and reporting.",
        "Stand up a dashboard and documentation layer that shows what is running, why it exists, and how it is performing."
      ]
    },
    proposal: {
      situation: "Sage Haus is hiring a Growth Marketing Lead to own lifecycle marketing, email, SMS, outbound automation, funnel optimization, and reporting for a growing household staffing category.",
      opportunity: "The opportunity is to make every touchpoint work harder across families and candidates through a structured lifecycle system and clearer performance visibility.",
      investment: "$5,000-$6,000/month; remote; 1099 contract; 30 hrs/week; potential W2",
      phases: [
        { title: "Lifecycle audit", duration: "First 90 days", description: "Map journeys, sequences, funnel drop-offs, forms, conversion paths, and reporting gaps." },
        { title: "Sequence and outbound rebuild", duration: "First 90 days", description: "Relaunch nurture sequences, test outbound automation, and align messaging to conversion stages." },
        { title: "Dashboard and documentation", duration: "First 90 days", description: "Build lifecycle/funnel dashboards and document the architecture." }
      ],
      outcomes: [
        "Higher-performing email and SMS lifecycle across families and candidates.",
        "Clearer funnel visibility and drop-off prioritization.",
        "Outbound automation experiments with measurable connection-to-conversation rates.",
        "A documented lifecycle architecture that can scale with the company."
      ]
    },
    outreachAngle: "I can help Sage Haus turn lifecycle, SMS, outbound, and funnel reporting into a measurable conversion system that supports both families and candidates.",
    outreachContacts: [
      { name: "Nelson Boyd", title: "VP Growth Marketing", linkedinUrl: linkedInSearch("Nelson Boyd Sage Haus VP Growth Marketing"), selectionRationale: "The role details list Nelson Boyd as the reporting path, making him the strongest likely hiring manager." },
      { name: "Kelly Hubbell", title: "Founder & CEO", linkedinUrl: linkedInSearch("Kelly Hubbell Sage Haus Founder CEO"), selectionRationale: "Founder-led company; likely executive sponsor or influencer for a conversion and lifecycle growth role." }
    ]
  }),

  "welcomelend": page({
    slug: "welcomelend",
    companyName: "WelcomeLend",
    industry: "Capital markets advisory / outbound growth",
    eyebrow: "WelcomeLend × Chad Parker",
    headline: "An outbound email lifecycle built for deliverability, segmentation, testing, and pipeline contribution.",
    subheadline: "A proposal-style response to WelcomeLend’s Growth Marketing Lead contract role across cold email infrastructure, Apollo/Clay, lead sourcing, segmentation, campaign copy, and performance analytics.",
    fitSummary: "WelcomeLend needs someone to own outbound email infrastructure, deliverability, segmentation, sequencing, copy, and pipeline reporting. This is a strong fit because it connects CRM hygiene, targeting, campaign operations, copy testing, analytics, and automation.",
    likelyPriorities: [
      "Set up and maintain outbound infrastructure, domains, mailboxes, DNS, warm-up, and sender reputation.",
      "Source, enrich, segment, and maintain lead lists using Apollo, Clay, or similar tools.",
      "Write and test outbound sequences that generate qualified replies and pipeline.",
      "Report on open rate, reply rate, bounce rate, positive reply rate, and pipeline contribution."
    ],
    recommendedEngagement: {
      title: "Outbound Growth Infrastructure System",
      description: "A contract growth engagement focused on building clean outbound infrastructure, campaign workflows, segmentation, copy testing, and pipeline reporting.",
      bullets: [
        "Audit outbound infrastructure, data sources, segmentation, deliverability, copy, reporting, and sales handoff process.",
        "Build the domain/mailbox and data hygiene operating model required for scalable sending.",
        "Create campaign sequences, audience segments, A/B tests, and personalization rules.",
        "Develop reporting that connects send health, response quality, and qualified pipeline contribution."
      ]
    },
    proposal: {
      situation: "WelcomeLend is hiring a contract Growth Marketing Lead to own the full outbound email lifecycle for a capital markets advisory business.",
      opportunity: "The opportunity is to build an outbound system that is technically sound, segmented, measurable, and sustainable.",
      investment: "$40-$65/hour; remote; independent contractor",
      phases: [
        { title: "Outbound infrastructure audit", duration: "Contract engagement", description: "Review domains, mailboxes, DNS, warm-up, sender reputation, bounce risk, tooling, data sources, and reporting." },
        { title: "Campaign system build", duration: "Contract engagement", description: "Define ICP segments, lead sourcing, enrichment workflows, sequence logic, copy testing, and personalization rules." },
        { title: "Optimization and reporting", duration: "Contract engagement", description: "Monitor deliverability and reply quality, improve campaigns, and connect results to qualified pipeline." }
      ],
      outcomes: [
        "Healthier outbound infrastructure and deliverability process.",
        "Cleaner lead sourcing, enrichment, and segmentation workflow.",
        "More disciplined campaign testing and copy iteration.",
        "Clearer connection between outbound activity and pipeline contribution."
      ]
    },
    outreachAngle: "I can help WelcomeLend build a clean outbound growth system across deliverability, segmentation, copy testing, enrichment, and pipeline reporting.",
    outreachContacts: [
      { name: "WelcomeLend Growth Marketing Hiring Lead", title: "Growth / Marketing leadership search path", linkedinUrl: linkedInSearch("WelcomeLend growth marketing lead"), selectionRationale: "No exact public hiring manager was verified; this search path targets the function most likely to own the role." },
      { name: "WelcomeLend Founder or Capital Markets Lead", title: "Founder / commercial leadership search path", linkedinUrl: linkedInSearch("WelcomeLend founder capital markets"), selectionRationale: "The role supports outbound pipeline in a capital markets advisory, so founder/commercial leadership is likely to influence the hire." }
    ]
  }),

  "vantagescore": page({
    slug: "vantagescore",
    companyName: "VantageScore",
    industry: "Financial services / search marketing and SEO",
    eyebrow: "VantageScore × Chad Parker",
    headline: "A search performance system that connects paid search, SEO, content gaps, and reporting.",
    subheadline: "A proposal-style response to VantageScore’s Search Marketing & SEO Manager contract role across Google/Microsoft Ads, SEO, keyword maps, technical audits, content briefs, and performance reporting.",
    fitSummary: "VantageScore needs an optimization-focused search marketer who can improve paid search efficiency while driving organic SEO strategy. This is a solid fit because my background includes SEO, content relevance, paid media ROI, reporting, landing page strategy, and tying search activity to business outcomes.",
    likelyPriorities: [
      "Optimize Google and Microsoft Ads campaign structure, bidding, keywords, negatives, and Quality Scores.",
      "Build keyword maps and brief content teams on SEO priorities.",
      "Run technical SEO audits and identify crawl, Core Web Vitals, structured data, and indexation issues.",
      "Use paid search data to identify organic content gaps and search intent opportunities."
    ],
    recommendedEngagement: {
      title: "Search Performance Optimization System",
      description: "A 1099 search engagement focused on improving paid search efficiency, SEO visibility, keyword strategy, and reporting clarity.",
      bullets: [
        "Audit paid search structure, keyword coverage, negatives, landing page relevance, Quality Scores, budget allocation, and reporting.",
        "Develop SEO keyword maps, technical audit recommendations, content briefs, and content gap priorities.",
        "Create a unified search reporting cadence across CPC, CVR, ROAS, impression share, rankings, traffic, and index coverage.",
        "Use paid search learnings to guide organic content and landing page optimization priorities."
      ]
    },
    proposal: {
      situation: "VantageScore is looking for a 1099 contractor to own paid search performance across Google and Microsoft Ads while driving organic SEO strategy.",
      opportunity: "The opportunity is to connect paid and organic search into one decision system.",
      investment: "$50/hour; remote; 1099 contract",
      phases: [
        { title: "Search audit", duration: "Contract engagement", description: "Review campaign structure, keywords, negatives, Quality Scores, landing pages, SEO health, rankings, and reporting." },
        { title: "Optimization roadmap", duration: "Contract engagement", description: "Prioritize paid search fixes, SEO keyword maps, technical recommendations, content briefs, and content gaps." },
        { title: "Measurement cadence", duration: "Contract engagement", description: "Create recurring reporting around paid efficiency, organic visibility, ranking movement, and conversion impact." }
      ],
      outcomes: [
        "More efficient paid search campaign structure and keyword coverage.",
        "Clear SEO roadmap tied to technical health and content priorities.",
        "Better connection between paid search insights and organic content planning.",
        "Search reporting that converts data into actionable decisions."
      ]
    },
    outreachAngle: "I can help VantageScore connect paid search, SEO, content gaps, landing page relevance, and reporting into one optimization system.",
    outreachContacts: [
      { name: "Ola Fadahunsi", title: "SVP and Head of Communications", linkedinUrl: linkedInSearch("Ola Fadahunsi VantageScore LinkedIn"), selectionRationale: "Public reporting identifies Ola as SVP and Head of Communications; search/SEO work often touches communications, content, and brand visibility." },
      { name: "VantageScore Search Marketing Hiring Lead", title: "Marketing / digital acquisition search path", linkedinUrl: linkedInSearch("VantageScore search marketing SEO manager"), selectionRationale: "No exact hiring manager was verified; this role-based path targets the person most likely to own paid search and SEO contractor selection." }
    ]
  }),

  "peak-creative": page({
    slug: "peak-creative",
    companyName: "Peak Creative",
    industry: "Digital marketing agency / AI-enabled paid media",
    eyebrow: "Peak Creative × Chad Parker",
    headline: "An AI-enabled campaign operating system for paid media, content workflows, and performance learning.",
    subheadline: "A proposal-style response to Peak Creative’s Digital Marketing Specialist — AI Solutions role across Meta, Google Ads, AI workflows, content library systems, analytics, SEO, email, and CMS support.",
    fitSummary: "Peak Creative needs a contractor who can manage paid campaigns, diagnose performance issues, use AI tools in marketing workflows, and organize a content library system. This is a good fit because it blends paid media, campaign optimization, AI workflow design, analytics, and content operations.",
    likelyPriorities: [
      "Plan, manage, and optimize Google, Facebook, and Instagram campaigns.",
      "Use AI tools for campaign ideation, creative variations, audience research, analysis, and automation.",
      "Build and organize a centralized content library to streamline social creation and repurposing.",
      "Support SEO, email marketing, WordPress/CMS updates, and performance reporting."
    ],
    recommendedEngagement: {
      title: "AI-Enabled Campaign Operations System",
      description: "A contract engagement focused on campaign optimization, AI-assisted creative workflows, content library organization, and performance reporting.",
      bullets: [
        "Audit current Google/Meta campaigns, tracking, creative testing, reporting, and client workflow.",
        "Build an AI-assisted campaign workflow for ideation, creative variants, audience research, analysis, and optimization notes.",
        "Organize a reusable content library and repurposing system.",
        "Create performance reporting that translates campaign data into clear action steps."
      ]
    },
    proposal: {
      situation: "Peak Creative is hiring a contract Digital Marketing Specialist focused on Meta and Google Ads, AI-enabled workflows, content library organization, analytics, SEO, email, and WordPress support.",
      opportunity: "The opportunity is to pair paid media optimization with AI-assisted workflows and a structured content library.",
      investment: "$2,000-$3,500/month; remote contract",
      phases: [
        { title: "Campaign and workflow audit", duration: "Contract engagement", description: "Review paid campaigns, creative process, reporting, AI use cases, content library, SEO/email/CMS support needs, and blockers." },
        { title: "AI workflow and content system", duration: "Contract engagement", description: "Build repeatable prompts, content library taxonomy, campaign testing workflow, and reporting templates." },
        { title: "Optimization cadence", duration: "Contract engagement", description: "Manage campaigns, iterate creative/audience tests, and surface weekly recommendations." }
      ],
      outcomes: [
        "Better structured paid campaign optimization across Google and Meta.",
        "Reusable AI workflows for ideation, creative variants, and performance analysis.",
        "A more organized content library for social and campaign reuse.",
        "Clearer reporting and recommendations for agency leadership."
      ]
    },
    outreachAngle: "I can help Peak Creative combine paid media execution, AI workflows, and content operations into a repeatable campaign system.",
    outreachContacts: [
      { name: "Peak Creative Agency Leadership", title: "Founder / owner search path", linkedinUrl: linkedInSearch("Peak Creative digital marketing agency founder"), selectionRationale: "No exact hiring manager was verified; agency leadership is likely to influence a small-team contract paid media/AI workflow hire." },
      { name: "Peak Creative Paid Media Lead", title: "Paid media / client strategy search path", linkedinUrl: linkedInSearch("Peak Creative paid media marketing"), selectionRationale: "Role-based path for the person likely to evaluate Google/Meta campaign capability." }
    ]
  }),

  "tactics-marketing": page({
    slug: "tactics-marketing",
    companyName: "Tactics Marketing",
    industry: "Marketing agency / HubSpot and growth execution",
    eyebrow: "Tactics Marketing × Chad Parker",
    headline: "A client growth operating layer across HubSpot, WordPress, email, paid, organic, and reporting.",
    subheadline: "A proposal-style response to Tactics Marketing’s Digital Marketing Specialist role across client communication, HubSpot, WordPress, Semrush, campaigns, positioning, execution, and outcomes.",
    fitSummary: "Tactics Marketing needs a marketer who can think strategically, communicate clearly, and execute across HubSpot, WordPress, email, paid, organic, positioning, and analytics. This is a good fit because my background combines strategic clarity, marketing operations, campaign execution, HubSpot migration, reporting, and outcome ownership.",
    likelyPriorities: [
      "Translate client requests into practical growth plans and campaign execution.",
      "Build and ship campaigns across HubSpot, WordPress, email, paid, and organic channels.",
      "Sharpen positioning, messaging, and strategy while staying execution-oriented.",
      "Use analytics dashboards and platform data to own outcomes, not just deliverables."
    ],
    recommendedEngagement: {
      title: "Agency Client Growth Execution System",
      description: "A remote marketing engagement focused on client communication, HubSpot and WordPress execution, campaign delivery, positioning, and performance visibility.",
      bullets: [
        "Audit client campaign workflow, HubSpot/WordPress execution process, reporting needs, and positioning gaps.",
        "Build reusable campaign templates, landing page/email workflows, reporting rhythms, and strategy-to-execution briefs.",
        "Create AI-assisted processes for content drafting, campaign QA, reporting summaries, and optimization recommendations.",
        "Help client teams move from vague lead goals to clear plans, deliverables, outcomes, and next steps."
      ]
    },
    proposal: {
      situation: "Tactics Marketing is looking for a remote marketing professional who can own client communication, drive outcomes, and execute across HubSpot, WordPress, Semrush, email, paid, organic, brand, positioning, and strategy.",
      opportunity: "The opportunity is to add a systems-minded marketer who can move quickly from strategy to live execution.",
      investment: "From $60,000 annualized; remote; full-time listed with flexible schedule",
      phases: [
        { title: "Client workflow audit", duration: "Contract or full-time engagement", description: "Review client communication, campaign planning, HubSpot/WordPress process, reporting, and execution templates." },
        { title: "Execution system build", duration: "Contract or full-time engagement", description: "Create repeatable campaign workflows, briefs, checklists, email/landing page templates, and reporting views." },
        { title: "Optimization cadence", duration: "Contract or full-time engagement", description: "Use performance data and client feedback to improve campaigns, positioning, and operating process." }
      ],
      outcomes: [
        "Faster campaign execution across HubSpot, WordPress, email, paid, and organic channels.",
        "Clearer client communication and outcome ownership.",
        "Reusable workflows that reduce repeat work and improve quality.",
        "More actionable analytics and campaign optimization rhythm."
      ]
    },
    outreachAngle: "I can help Tactics Marketing turn client requests into repeatable campaigns, HubSpot workflows, landing pages, and reporting that actually drive outcomes.",
    outreachContacts: [
      { name: "Tactics Marketing Agency Leadership", title: "Founder / owner search path", linkedinUrl: linkedInSearch("Tactics Marketing agency founder"), selectionRationale: "No exact hiring manager was verified; agency leadership is likely to influence this HubSpot/WordPress/client execution role." },
      { name: "Tactics Marketing Client Strategy Lead", title: "Client strategy / marketing operations search path", linkedinUrl: linkedInSearch("Tactics Marketing HubSpot WordPress marketing manager"), selectionRationale: "Role-based path for the person likely to evaluate HubSpot, WordPress, and client communication capability." }
    ]
  }),

  "two-rivers-marketing": page({
    slug: "two-rivers-marketing",
    companyName: "Two Rivers Marketing / VGM Group",
    industry: "Agency / marketing automation and CRM strategy",
    eyebrow: "Two Rivers Marketing × Chad Parker",
    headline: "A marketing automation and CRM strategy layer for cleaner journeys, segmentation, QA, and reporting.",
    subheadline: "A proposal-style response to the Freelance Marketing Automation Strategist role across CRM, automation, email, segmentation, data hygiene, HubSpot, Salesforce Marketing Cloud, Marketo, Pardot, QA, and analytics.",
    fitSummary: "Two Rivers Marketing needs a freelance automation strategist who can support CRM, marketing automation, email strategy, segmentation, data hygiene, analytics, QA, and scalable processes. This is a very strong fit because my background sits directly in marketing automation migration, Salesforce/HubSpot/Pardot, segmentation, lifecycle journeys, QA governance, analytics, and process documentation.",
    likelyPriorities: [
      "Lead or support CRM, automation, email, and customer journey strategy for agency clients.",
      "Build segmentation frameworks, data hygiene practices, and personalization logic.",
      "Support platform execution across Salesforce Marketing Cloud, HubSpot, Marketo, Pardot, and Salesforce CRM.",
      "Create QA protocols, KPI reporting, and best-practice documentation for scalable delivery."
    ],
    recommendedEngagement: {
      title: "Marketing Automation Strategy Bench",
      description: "A freelance strategist engagement focused on CRM, automation, segmentation, QA, analytics, and scalable client delivery processes.",
      bullets: [
        "Assess client CRM/automation requirements, current journeys, data structure, segmentation, platform constraints, and reporting needs.",
        "Design campaign architecture, journey logic, segmentation frameworks, QA protocols, and measurement plans.",
        "Support execution across HubSpot, Salesforce Marketing Cloud, Marketo, Pardot, Salesforce CRM, analytics, and email development needs.",
        "Document repeatable processes, best practices, and client-ready recommendations."
      ]
    },
    proposal: {
      situation: "Two Rivers Marketing is building a freelance network for experienced marketing automation strategists who can support CRM, email, segmentation, data management, platform execution, analytics, QA, and project delivery.",
      opportunity: "The opportunity is to bring a senior systems operator into the freelance bench who can move from requirements gathering to platform logic, QA, reporting, and client-facing recommendations.",
      investment: "Freelance network; remote with possible Des Moines strategy sessions; rate requested by candidate",
      phases: [
        { title: "Client automation diagnostic", duration: "Project-based freelance engagement", description: "Review client requirements, platform stack, CRM data, journey goals, segmentation, QA needs, and reporting expectations." },
        { title: "Journey and process design", duration: "Project-based freelance engagement", description: "Design automation logic, audience rules, email QA, KPI framework, data hygiene approach, and delivery workflow." },
        { title: "Execution support and documentation", duration: "Project-based freelance engagement", description: "Support platform buildout, testing, reporting, optimization, and reusable documentation." }
      ],
      outcomes: [
        "Stronger CRM and marketing automation strategy for agency clients.",
        "Cleaner segmentation, data hygiene, QA, and reporting practices.",
        "More scalable delivery processes and reusable best practices.",
        "Senior-level platform guidance across HubSpot, Salesforce Marketing Cloud, Marketo, Pardot, and Salesforce CRM."
      ]
    },
    outreachAngle: "I can help Two Rivers strengthen its freelance automation bench with senior CRM, segmentation, lifecycle, QA, analytics, and platform strategy experience.",
    outreachContacts: [
      { name: "Two Rivers Marketing Automation Lead", title: "Marketing automation / CRM strategy search path", linkedinUrl: linkedInSearch("Two Rivers Marketing marketing automation strategist"), selectionRationale: "No exact hiring manager was verified; this path targets the functional owner of automation and CRM strategy." },
      { name: "Two Rivers Marketing Digital Strategy Lead", title: "Digital strategy / agency leadership search path", linkedinUrl: linkedInSearch("Two Rivers Marketing digital strategy director"), selectionRationale: "Likely influencer for freelance network assignments that touch CRM, email, data, and analytics." },
      { name: "VGM Group Talent or Resource Lead", title: "Freelance network / resource management search path", linkedinUrl: linkedInSearch("VGM Group Two Rivers Marketing talent acquisition"), selectionRationale: "The role is positioned as joining a freelance network, so a talent/resource lead may help route the conversation." }
    ]
  }),

  "auq-seo-specialist": page({
    slug: "auq-seo-specialist",
    companyName: "AUQ",
    industry: "SEO agency / content SEO and AI workflows",
    eyebrow: "AUQ × Chad Parker",
    headline: "A scalable SEO content operating system for SaaS clients, content briefs, AI flows, and reporting.",
    subheadline: "A proposal-style response to AUQ’s Senior Remote SEO Specialist role across SEO strategy, content briefs, AI flows, technical troubleshooting, authors, linkbuilders, GA4, and client campaign management.",
    fitSummary: "AUQ needs a freelance SEO specialist who can manage strategy, content briefs, AI flows, authors, linkbuilders, technical troubleshooting, and reporting for SaaS/startup clients. This is a solid fit because my work includes SEO/AEO strategy, content frameworks, analytics, campaign operations, and building systems that make content production more scalable.",
    likelyPriorities: [
      "Set SEO campaign strategy with a strong focus on content SEO.",
      "Create content briefs, manage authors or AI flows, and coordinate linkbuilders or junior SEOs.",
      "Troubleshoot SEO issues and work with design/development teams to ship improvements.",
      "Use GA4 and reporting to connect SEO activity to business outcomes."
    ],
    recommendedEngagement: {
      title: "SEO Content Operations System",
      description: "A freelance SEO engagement focused on campaign strategy, content briefs, AI-assisted workflows, author coordination, technical troubleshooting, and performance reporting.",
      bullets: [
        "Audit client SEO goals, content strategy, technical issues, author workflows, AI opportunities, reporting, and development dependencies.",
        "Create content brief frameworks, AI-assisted content workflows, QA checks, and prioritization rules.",
        "Coordinate authors, linkbuilders, junior SEOs, and cross-functional stakeholders.",
        "Use GA4/reporting to translate content and SEO activity into optimization priorities."
      ]
    },
    proposal: {
      situation: "AUQ is looking for a freelance SEO specialist to support national SaaS and startup clients through SEO strategy, content briefs, technical troubleshooting, AI flows, author management, linkbuilder coordination, and reporting.",
      opportunity: "The opportunity is to make SEO content production more systemized and measurable.",
      investment: "$1,000-$1,500/month per client; remote freelance; scales with number of accounts",
      phases: [
        { title: "SEO campaign audit", duration: "Freelance client engagement", description: "Review client goals, keyword opportunities, content gaps, technical issues, reporting, author workflow, and AI use cases." },
        { title: "Content workflow build", duration: "Freelance client engagement", description: "Create brief templates, AI flows, QA criteria, author guidance, linkbuilding coordination, and prioritization logic." },
        { title: "Reporting and optimization", duration: "Freelance client engagement", description: "Use GA4, rankings, and performance data to identify improvements and keep the campaign focused on outcomes." }
      ],
      outcomes: [
        "More scalable SEO content briefs and production workflows.",
        "AI-assisted content operations that support speed without lowering quality.",
        "Clearer technical and content prioritization for SaaS/startup clients.",
        "Better reporting that connects SEO work to visibility, engagement, and conversion."
      ]
    },
    outreachAngle: "I can help AUQ systemize SEO campaign strategy, content briefs, AI workflows, author coordination, and reporting for SaaS clients.",
    outreachContacts: [
      { name: "AUQ Senior SEO Manager", title: "Senior SEO Manager / reporting path search", linkedinUrl: linkedInSearch("AUQ Senior SEO Manager SEO agency"), selectionRationale: "The role reports to a Senior SEO Manager, making this the most direct likely hiring path." },
      { name: "AUQ Founder or Agency Operator", title: "Founder / agency leadership search path", linkedinUrl: linkedInSearch("AUQ SEO agency founder"), selectionRationale: "Likely influencer for freelance SEO bench work and client allocation." }
    ]
  })
};
