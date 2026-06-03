import { type CompanyLandingPage } from "./companyLandingPages";

const proofPoints = [
  "Built enterprise marketing infrastructure from zero, including funnel architecture, segmentation, attribution, lifecycle operations, and cross-functional growth systems.",
  "Scaled digital revenue impact to $1.25B and influenced $2.5B in branch sales through measurable marketing and revenue systems.",
  "Created a full-funnel engine generating roughly 30K leads, 10K qualified prospects, and 1,500 customers per quarter.",
  "Delivered measurable incremental return: $1.82 EBITDA for every $1 spent."
];

const phases = [
  { title: "Assess", duration: "Contract or fractional engagement", description: "Review goals, systems, workflows, reporting, stakeholders, and execution friction." },
  { title: "Design", duration: "Contract or fractional engagement", description: "Define the operating model, automation workflow, campaign structure, and measurement cadence." },
  { title: "Activate", duration: "Contract or fractional engagement", description: "Support execution, documentation, stakeholder alignment, reporting, and optimization." }
];

const makePage = (slug: string, companyName: string, industry: string, roleTitle: string, headline: string, fitSummary: string, priorities: string[], bullets: string[], outreachAngle: string): CompanyLandingPage => ({
  slug,
  companyName,
  industry,
  eyebrow: `${companyName} × Chad Parker`,
  headline,
  subheadline: `A proposal-style response to ${companyName}'s ${roleTitle} opportunity.`,
  fitSummary,
  likelyPriorities: priorities,
  recommendedEngagement: { title: roleTitle, description: "Focused fractional, contract, advisory, or project-based support aligned to the posted opportunity.", bullets },
  proposal: {
    situation: `${companyName} appears to need support tied to ${roleTitle}, with work sitting across marketing systems, automation, lifecycle strategy, reporting, and execution.` ,
    opportunity: "The opportunity is to connect strategy, systems, workflows, and reporting into a practical operating model that improves execution and visibility.",
    investment: "Fractional, contract, consulting, or project-based engagement; compensation not listed in source summary",
    phases,
    outcomes: ["Clearer operating model.", "Better marketing and revenue systems alignment.", "Improved automation, reporting, and lifecycle execution.", "More practical handoff documentation and stakeholder visibility."]
  },
  proofPoints,
  outreachAngle,
  ctaLabel: "Discuss fit",
  ctaHref: "/contact",
  status: "ready"
});

export const fractionalOpportunityWave9CompanyLandingPages: Record<string, CompanyLandingPage> = {
  "blue-star-partners-pardot-consultant-contract-june": makePage(
    "blue-star-partners-pardot-consultant-contract-june",
    "Blue Star Partners",
    "Salesforce Account Engagement / Pardot consulting",
    "Salesforce Pardot Consultant (Account Engagement) — Intermediate Contract",
    "A practical Pardot optimization plan for cleaner automation, lifecycle execution, and measurable demand generation.",
    "Very strong fit across Salesforce Account Engagement, Pardot optimization, lifecycle marketing, campaign automation, analytics, and RevOps alignment.",
    ["Optimize Pardot / Account Engagement workflows.", "Improve campaign automation, lead management, segmentation, and reporting.", "Bridge strategy and hands-on execution."],
    ["Audit Pardot architecture, automation rules, segmentation, forms, and campaign workflows.", "Identify quick wins across nurture paths, lead routing, scoring, reporting, and Salesforce alignment.", "Document recommendations and support implementation."],
    "I can help Blue Star Partners bring senior Pardot, lifecycle marketing, RevOps, automation, and analytics judgment into a focused contract engagement."
  ),
  "gravity-infosolutions-pardot-consultant-contract": makePage(
    "gravity-infosolutions-pardot-consultant-contract",
    "Gravity Infosolutions",
    "Salesforce consulting / Pardot implementation",
    "Pardot Consultant (Salesforce Account Engagement)",
    "Salesforce Account Engagement support that connects automation, CRM integration, and measurable lifecycle marketing.",
    "Strong fit across Salesforce Account Engagement, Pardot consulting, CRM integration, campaign automation, and lifecycle performance.",
    ["Support Pardot implementation and optimization.", "Connect Salesforce CRM processes to campaign and nurture execution.", "Improve automation, reporting, and stakeholder clarity."],
    ["Review Pardot setup, Salesforce integration, workflows, campaign assets, and reporting needs.", "Define implementation priorities based on business value and effort.", "Support documentation, QA, and stakeholder alignment."],
    "I can help Gravity Infosolutions translate Pardot and Salesforce requirements into practical lifecycle, automation, and reporting improvements."
  ),
  "top-employers-institute-freelance-marketing-specialist": makePage(
    "top-employers-institute-freelance-marketing-specialist",
    "Top Employers Institute",
    "B2B certification / freelance marketing operations",
    "Freelance Marketing Specialist",
    "Freelance marketing operations support that strengthens lead nurturing, Salesforce execution, and funnel performance.",
    "Strong fit across fractional marketing operations, Salesforce/Pardot, lead nurturing, campaign execution, and funnel progression.",
    ["Improve campaign execution and nurture performance.", "Use Salesforce and Account Engagement to support funnel progression.", "Create clearer reporting and operating rhythm."],
    ["Audit campaign workflows, nurture paths, CRM handoffs, and reporting gaps.", "Build a practical campaign operating cadence.", "Improve segmentation, lifecycle paths, and lead management."],
    "I can help Top Employers Institute strengthen campaign execution, lead nurturing, Salesforce workflows, and lifecycle reporting without needing a full-time hire."
  ),
  "rdi-technologies-demand-generation-manager": makePage(
    "rdi-technologies-demand-generation-manager",
    "RDI Technologies",
    "Industrial technology / demand generation",
    "Demand Generation Marketing Manager",
    "A demand generation system built around nurture strategy, lead scoring, sales alignment, and measurable pipeline impact.",
    "Strong fit across demand generation, Pardot, lead scoring, segmentation, sales alignment, lifecycle nurture, and analytics.",
    ["Strengthen nurture programs, segmentation, scoring, and database hygiene.", "Improve sales alignment and lead progression.", "Connect demand generation work to pipeline and revenue outcomes."],
    ["Audit lead flow, nurture journeys, scoring logic, segmentation, and campaign performance.", "Build a practical demand generation operating model tied to ICP and funnel stage.", "Improve reporting on qualified demand and pipeline movement."],
    "I can help RDI Technologies connect Pardot, lifecycle marketing, lead scoring, segmentation, sales alignment, and analytics into a stronger demand generation engine."
  ),
  "participate-learning-campaign-lead-lifecycle": makePage(
    "participate-learning-campaign-lead-lifecycle",
    "Participate Learning",
    "Education / lifecycle marketing / campaign strategy",
    "Marketing Strategist — Campaign & Lead Lifecycle",
    "A campaign and lead lifecycle operating model that connects strategy, automation, routing, and funnel performance.",
    "Strong fit across lifecycle marketing, lead management, Salesforce Marketing Cloud, Pardot, scoring, routing, workflow optimization, and campaign strategy.",
    ["Clarify lead lifecycle stages, scoring, routing, and nurture logic.", "Improve campaign strategy and automation workflows.", "Create better visibility into funnel progression."],
    ["Map lifecycle stages, handoffs, scoring, routing, and campaign workflows.", "Define automation and segmentation improvements.", "Build reporting around funnel progression, engagement, and conversion."],
    "I can help Participate Learning connect campaign strategy, lead lifecycle design, Salesforce/Pardot automation, scoring, routing, and analytics into a practical operating model."
  ),
  "intradiem-marketing-automation-specialist": makePage(
    "intradiem-marketing-automation-specialist",
    "Intradiem",
    "B2B SaaS / marketing automation",
    "Marketing Automation Specialist",
    "Marketing automation support that improves Pardot execution, nurture workflows, campaign tracking, and analytics.",
    "Strong fit across Pardot execution, nurture programs, segmentation, workflows, landing pages, forms, tracking, and analytics.",
    ["Improve Pardot execution and campaign operations.", "Strengthen nurture workflows, segmentation, landing pages, and forms.", "Create clearer campaign analytics."],
    ["Audit Pardot campaigns, forms, landing pages, segmentation, workflows, tracking, and reporting.", "Prioritize quick improvements across nurture logic, QA, attribution, and campaign execution.", "Document repeatable operating practices."],
    "I can help Intradiem improve Pardot execution, lifecycle workflows, campaign analytics, and automation discipline in a way that supports measurable demand generation."
  ),
  "salesfive-account-engagement-consultant-refresh": makePage(
    "salesfive-account-engagement-consultant-refresh",
    "Salesfive",
    "Salesforce consulting / Account Engagement",
    "Consultant, Marketing Cloud Account Engagement",
    "Salesforce Account Engagement consulting that bridges workshops, requirements, journey design, and automation architecture.",
    "Very strong fit across Pardot, Sales Cloud integration, client workshops, requirements gathering, automation, and journey design.",
    ["Support client workshops and requirements gathering.", "Design Account Engagement and Sales Cloud workflows.", "Translate customer journeys into automation and reporting models."],
    ["Facilitate discovery around lifecycle goals, Salesforce structure, campaign workflows, and reporting needs.", "Design automation, segmentation, scoring, routing, and journey logic.", "Support documentation and implementation handoff."],
    "I can help Salesfive deliver Account Engagement consulting that connects Pardot, Salesforce, lifecycle marketing, automation architecture, and RevOps into practical client outcomes."
  ),
  "revops-careers-fractional-network-june": makePage(
    "revops-careers-fractional-network-june",
    "RevOps Careers Network",
    "Fractional RevOps / consulting marketplace",
    "Fractional RevOps Opportunities",
    "A fractional RevOps profile for companies that need marketing operations, lifecycle systems, automation, and revenue visibility.",
    "Strong pipeline fit across fractional revenue operations, marketing operations, customer operations, and GTM advisory work.",
    ["Position Chad for fractional RevOps and marketing operations engagements.", "Package Salesforce, Pardot, lifecycle, analytics, and AI-enabled operations.", "Create an outreach path for marketplace operators, founders, and RevOps leaders."],
    ["Position a clear fractional RevOps and marketing operations profile.", "Use proposal pages to support outreach to fractional networks and agency operators.", "Package services into diagnostics, advisory retainers, and project-based operating system builds."],
    "I can support fractional RevOps and marketing operations engagements that need Salesforce/Pardot expertise, lifecycle architecture, automation, analytics, and executive-ready operating cadence."
  )
};