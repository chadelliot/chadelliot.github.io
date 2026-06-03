import { type CompanyLandingPage } from "./companyLandingPages";

const proofPoints = [
  "Built enterprise marketing infrastructure from zero, including funnel architecture, CDP activation, segmentation, attribution, lifecycle operations, and cross-functional growth systems.",
  "Scaled digital revenue impact to $1.25B and influenced $2.5B in branch sales through measurable marketing and revenue systems.",
  "Created a full-funnel engine generating roughly 30K leads, 10K qualified prospects, and 1,500 customers per quarter.",
  "Delivered measurable incremental return: $1.82 EBITDA for every $1 spent."
];

const phases = [
  { title: "Assess", duration: "Contract or fractional engagement", description: "Review the current marketing, CRM, automation, lifecycle, reporting, stakeholder, and execution environment." },
  { title: "Design", duration: "Contract or fractional engagement", description: "Define the practical operating model, campaign structure, automation workflow, data needs, and measurement cadence." },
  { title: "Activate", duration: "Contract or fractional engagement", description: "Support execution, documentation, stakeholder alignment, reporting, optimization, and handoff." }
];

const makeContacts = (company: string, linkedinUrl: string, targets: string[], suggestedAngle: string) =>
  targets.map((target) => ({
    name: target,
    title: "Likely hiring-decision influencer",
    linkedinUrl,
    selectionRationale: `${target} is a likely outreach path for the ${company} opportunity based on role scope, functional ownership, and hiring-decision influence. ${suggestedAngle}`
  }));

const makePage = ({ slug, companyName, industry, roleTitle, headline, subheadline, fitSummary, priorities, bullets, situation, opportunity, outcomes, outreachAngle, ctaLabel, contacts }: {
  slug: string;
  companyName: string;
  industry: string;
  roleTitle: string;
  headline: string;
  subheadline: string;
  fitSummary: string;
  priorities: string[];
  bullets: string[];
  situation: string;
  opportunity: string;
  outcomes: string[];
  outreachAngle: string;
  ctaLabel: string;
  contacts: { name: string; title: string; linkedinUrl: string; selectionRationale?: string }[];
}): CompanyLandingPage => ({
  slug,
  companyName,
  industry,
  eyebrow: `${companyName} × Chad Parker`,
  headline,
  subheadline,
  fitSummary,
  likelyPriorities: priorities,
  recommendedEngagement: {
    title: roleTitle,
    description: "A focused proposal for fractional, contract, advisory, or project-based support aligned to the posted opportunity.",
    bullets
  },
  proposal: {
    situation,
    opportunity,
    investment: "Fractional, contract, consulting, or project-based engagement; compensation not listed in source summary",
    phases,
    outcomes
  },
  proofPoints,
  outreachAngle,
  ctaLabel,
  ctaHref: "/contact",
  outreachContacts: contacts,
  status: "ready"
});

export const fractionalOpportunityWave9CompanyLandingPages: Record<string, CompanyLandingPage> = {
  "blue-star-partners-pardot-consultant-contract-june": makePage({
    slug: "blue-star-partners-pardot-consultant-contract-june",
    companyName: "Blue Star Partners",
    industry: "Salesforce Account Engagement / Pardot consulting",
    roleTitle: "Salesforce Pardot Consultant (Account Engagement) — Intermediate Contract",
    headline: "A practical Pardot optimization plan for cleaner automation, lifecycle execution, and measurable demand generation.",
    subheadline: "A proposal-style response to Blue Star Partners’ Pardot consulting engagement across Salesforce Account Engagement, campaign operations, lead management, and marketing automation.",
    fitSummary: "Blue Star Partners is a very strong fit because the work maps directly to Salesforce Account Engagement, Pardot optimization, lifecycle marketing, campaign automation, analytics, and RevOps alignment.",
    priorities: ["Stabilize and optimize Pardot / Account Engagement workflows.", "Improve campaign automation, lead management, segmentation, and reporting.", "Provide senior guidance that bridges strategy and hands-on execution."],
    bullets: ["Audit Pardot / Account Engagement architecture, automation rules, segmentation, forms, and campaign workflows.", "Identify quick wins across nurture paths, lead routing, scoring, reporting, and Salesforce alignment.", "Document recommendations and support implementation against a short consulting timeline."],
    situation: "Blue Star Partners needs contract support around Salesforce Account Engagement where strategic guidance and practical Pardot execution both matter.",
    opportunity: "The opportunity is to quickly improve marketing automation reliability, campaign structure, lifecycle paths, and reporting confidence without overcomplicating the engagement.",
    outcomes: ["Cleaner Pardot / Salesforce operating model.", "Improved nurture, segmentation, and campaign execution.", "More reliable lead management and reporting.", "Clear handoff documentation for internal teams."],
    outreachAngle: "I can help Blue Star Partners bring senior Pardot, lifecycle marketing, RevOps, automation, and analytics judgment into a focused contract engagement.",
    ctaLabel: "Discuss Pardot fit",
    contacts: makeContacts("Blue Star Partners", "https://www.linkedin.com/company/blue-star-partners/", ["Salesforce Practice Lead", "Client Engagement Manager", "Contract Recruiting Lead"], "The strongest angle is fast Pardot optimization with executive-ready documentation.")
  }),
  "gravity-infosolutions-pardot-consultant-contract": makePage({
    slug: "gravity-infosolutions-pardot-consultant-contract",
    companyName: "Gravity Infosolutions",
    industry: "Salesforce consulting / Pardot implementation",
    roleTitle: "Pardot Consultant (Salesforce Account Engagement)",
    headline: "Salesforce Account Engagement support that connects automation, CRM integration, and measurable lifecycle marketing.",
    subheadline: "A proposal-style response to Gravity Infosolutions’ Pardot consulting opportunity across implementation, campaign automation, CRM integration, and optimization.",
    fitSummary: "Gravity Infosolutions is a strong fit because the opportunity is centered on Salesforce Account Engagement, Pardot consulting, CRM integration, campaign automation, and lifecycle performance.",
    priorities: ["Support Pardot implementation and optimization.", "Connect Salesforce CRM processes to campaign and nurture execution.", "Improve campaign automation, reporting, and stakeholder clarity."],
    bullets: ["Review Pardot setup, Salesforce integration, automation workflows, campaign assets, and reporting needs.", "Define implementation and optimization priorities based on business value and execution effort.", "Support documentation, QA, and stakeholder alignment so the client can operate the system confidently."],
    situation: "Gravity Infosolutions needs a Pardot consultant who can work across platform configuration, automation strategy, CRM integration, and client-facing recommendations.",
    opportunity: "The opportunity is to bring senior marketing operations judgment to the implementation layer so the system supports real demand generation and lifecycle needs.",
    outcomes: ["Stronger Pardot / Salesforce alignment.", "Cleaner automation and campaign workflows.", "Better client confidence in reporting and execution.", "Practical optimization roadmap."],
    outreachAngle: "I can help Gravity Infosolutions translate Pardot and Salesforce requirements into practical lifecycle, automation, and reporting improvements.",
    ctaLabel: "Discuss Pardot consulting",
    contacts: makeContacts("Gravity Infosolutions", "https://www.linkedin.com/company/gravity-infosolutions/", ["Salesforce Delivery Manager", "Practice Director", "Talent Acquisition Lead"], "The strongest angle is Pardot consulting that combines implementation discipline with lifecycle strategy.")
  }),
  "top-employers-institute-freelance-marketing-specialist": makePage({
    slug: "top-employers-institute-freelance-marketing-specialist",
    companyName: "Top Employers Institute",
    industry: "B2B certification / freelance marketing operations",
    roleTitle: "Freelance Marketing Specialist",
    headline: "Freelance marketing operations support that strengthens lead nurturing, Salesforce execution, and funnel performance.",
    subheadline: "A proposal-style response to Top Employers Institute’s freelance marketing specialist opportunity across Salesforce, Account Engagement, lead nurturing, and campaign execution.",
    fitSummary: "Top Employers Institute is a strong fit because the work blends fractional marketing operations, Salesforce/Pardot, lead nurturing, campaign execution, and funnel progression.",
    priorities: ["Improve campaign execution and nurture performance.", "Use Salesforce and Account Engagement to support funnel progression.", "Create clearer reporting and operating rhythm across marketing and sales."],
    bullets: ["Audit current campaign workflows, nurture paths, CRM handoffs, and reporting gaps.", "Build a practical campaign operating cadence for execution, optimization, and stakeholder updates.", "Improve segmentation, lifecycle paths, and lead management so marketing activity supports pipeline movement."],
    situation: "Top Employers Institute needs freelance marketing support that can operate inside a Salesforce and Account Engagement environment while still thinking strategically about lifecycle and demand generation.",
    opportunity: "The opportunity is to make campaign work more measurable, repeatable, and connected to funnel outcomes.",
    outcomes: ["More disciplined campaign and nurture execution.", "Better Salesforce / Account Engagement utilization.", "Clearer funnel reporting and sales alignment.", "A practical freelance operating rhythm."],
    outreachAngle: "I can help Top Employers Institute strengthen campaign execution, lead nurturing, Salesforce workflows, and lifecycle reporting without needing a full-time hire.",
    ctaLabel: "Discuss freelance support",
    contacts: makeContacts("Top Employers Institute", "https://www.linkedin.com/company/top-employers-institute/", ["Head of Marketing", "Demand Generation Director", "Marketing Operations Manager"], "The strongest angle is fractional marketing operations that connects campaigns to funnel movement.")
  }),
  "rdi-technologies-demand-generation-manager": makePage({
    slug: "rdi-technologies-demand-generation-manager",
    companyName: "RDI Technologies",
    industry: "Industrial technology / demand generation",
    roleTitle: "Demand Generation Marketing Manager",
    headline: "A demand generation system built around nurture strategy, lead scoring, sales alignment, and measurable pipeline impact.",
    subheadline: "A proposal-style response to RDI Technologies’ demand generation opportunity across Pardot, segmentation, scoring, database hygiene, and lifecycle programs.",
    fitSummary: "RDI Technologies is a strong fit because the role combines demand generation, Pardot, lead scoring, segmentation, sales alignment, lifecycle nurture, and analytics.",
    priorities: ["Strengthen nurture programs, segmentation, scoring, and database hygiene.", "Improve sales alignment and lead progression.", "Connect demand generation work to measurable pipeline and revenue outcomes."],
    bullets: ["Audit lead flow, nurture journeys, scoring logic, segmentation, campaign performance, and sales feedback loops.", "Build a practical demand generation operating model tied to ICP, funnel stage, and business priority.", "Improve reporting so leadership can see what is driving qualified demand and pipeline movement."],
    situation: "RDI Technologies needs demand generation leadership that can connect campaign work to Pardot, data quality, sales alignment, and measurable pipeline outcomes.",
    opportunity: "The opportunity is to turn nurture, scoring, and segmentation into a more reliable growth system rather than isolated campaign activity.",
    outcomes: ["Sharper nurture strategy and segmentation.", "More usable scoring and routing model.", "Better sales and marketing alignment.", "Clearer demand generation reporting."],
    outreachAngle: "I can help RDI Technologies connect Pardot, lifecycle marketing, lead scoring, segmentation, sales alignment, and analytics into a stronger demand generation engine.",
    ctaLabel: "Discuss demand gen fit",
    contacts: makeContacts("RDI Technologies", "https://www.linkedin.com/company/rdi-technologies/", ["VP Marketing", "Demand Generation Leader", "Revenue Operations Director"], "The strongest angle is demand generation architecture tied to lifecycle, Pardot, and sales alignment.")
  }),
  "participate-learning-campaign-lead-lifecycle": makePage({
    slug: "participate-learning-campaign-lead-lifecycle",
    companyName: "Participate Learning",
    industry: "Education / lifecycle marketing / campaign strategy",
    roleTitle: "Marketing Strategist — Campaign & Lead Lifecycle",
    headline: "A campaign and lead lifecycle operating model that connects strategy, automation, routing, and funnel performance.",
    subheadline: "A proposal-style response to Participate Learning’s campaign and lead lifecycle opportunity across Salesforce Marketing Cloud, Pardot, scoring, routing, and workflow optimization.",
    fitSummary: "Participate Learning is a strong fit because the role is centered on lifecycle marketing, lead management, Salesforce Marketing Cloud, Pardot, scoring, routing, workflow optimization, and campaign strategy.",
    priorities: ["Clarify lead lifecycle stages, scoring, routing, and nurture logic.", "Improve campaign strategy and automation workflows.", "Create better visibility into funnel progression and engagement."],
    bullets: ["Map current lead lifecycle stages, handoffs, scoring, routing, and campaign workflows.", "Define automation and segmentation improvements across Salesforce Marketing Cloud, Pardot, and CRM processes.", "Build reporting and operating cadence around funnel progression, engagement, and conversion."],
    situation: "Participate Learning needs lifecycle marketing support that can connect campaign strategy with marketing automation, CRM workflows, and funnel management.",
    opportunity: "The opportunity is to create a more coherent lead lifecycle system so campaigns, automation, routing, and reporting reinforce each other.",
    outcomes: ["Clearer lifecycle stage definitions and workflows.", "Improved scoring, routing, and nurture alignment.", "Stronger campaign strategy and reporting.", "Better coordination between marketing operations and revenue goals."],
    outreachAngle: "I can help Participate Learning connect campaign strategy, lead lifecycle design, Salesforce/Pardot automation, scoring, routing, and analytics into a practical operating model.",
    ctaLabel: "Discuss lifecycle fit",
    contacts: makeContacts("Participate Learning", "https://www.linkedin.com/company/participate-learning/", ["Director of Marketing", "Lifecycle Marketing Lead", "Marketing Operations Manager"], "The strongest angle is lead lifecycle design supported by automation and reporting.")
  }),
  "intradiem-marketing-automation-specialist": makePage({
    slug: "intradiem-marketing-automation-specialist",
    companyName: "Intradiem",
    industry: "B2B SaaS / marketing automation",
    roleTitle: "Marketing Automation Specialist",
    headline: "Marketing automation support that improves Pardot execution, nurture workflows, campaign tracking, and analytics.",
    subheadline: "A proposal-style response to Intradiem’s marketing automation opportunity across Pardot execution, landing pages, forms, workflows, segmentation, and campaign reporting.",
    fitSummary: "Intradiem is a strong fit because the work is directly tied to Pardot execution, nurture programs, segmentation, workflows, landing pages, forms, tracking, and analytics.",
    priorities: ["Improve Pardot execution and campaign operations.", "Strengthen nurture workflows, segmentation, landing pages, and forms.", "Create clearer campaign analytics and reporting discipline."],
    bullets: ["Audit Pardot campaigns, forms, landing pages, segmentation, workflows, tracking, and reporting.", "Prioritize quick improvements across nurture logic, QA, attribution, and campaign execution.", "Document repeatable operating practices for cleaner automation and reporting."],
    situation: "Intradiem needs marketing automation support that can improve execution quality while keeping campaigns connected to lifecycle and performance goals.",
    opportunity: "The opportunity is to turn automation execution into a more reliable operating system for engagement, lead progression, and campaign measurement.",
    outcomes: ["Cleaner Pardot campaign execution.", "Improved nurture and segmentation workflows.", "More reliable campaign tracking and analytics.", "Repeatable automation operating practices."],
    outreachAngle: "I can help Intradiem improve Pardot execution, lifecycle workflows, campaign analytics, and automation discipline in a way that supports measurable demand generation.",
    ctaLabel: "Discuss automation fit",
    contacts: makeContacts("Intradiem", "https://www.linkedin.com/company/intradiem/", ["Marketing Operations Director", "Demand Generation Manager", "Revenue Operations Manager"], "The strongest angle is practical Pardot execution connected to lifecycle and campaign analytics.")
  }),
  "salesfive-account-engagement-consultant-refresh": makePage({
    slug: "salesfive-account-engagement-consultant-refresh",
    companyName: "Salesfive",
    industry: "Salesforce consulting / Account Engagement",
    roleTitle: "Consultant, Marketing Cloud Account Engagement",
    headline: "Salesforce Account Engagement consulting that bridges workshops, requirements, journey design, and automation architecture.",
    subheadline: "A proposal-style response to Salesfive’s Marketing Cloud Account Engagement consulting role across Pardot solution design, Sales Cloud integration, client workshops, and customer journeys.",
    fitSummary: "Salesfive is a very strong fit because the work is pure Salesforce Account Engagement consulting, combining Pardot, Sales Cloud integration, client workshops, requirements gathering, automation, and journey design.",
    priorities: ["Support client workshops and requirements gathering.", "Design Account Engagement and Sales Cloud workflows that match business needs.", "Translate customer journeys into practical automation and reporting models."],
    bullets: ["Facilitate discovery around lifecycle goals, Salesforce structure, campaign workflows, and reporting needs.", "Design Account Engagement automation, segmentation, scoring, routing, and journey logic.", "Support documentation, stakeholder alignment, and implementation handoff."],
    situation: "Salesfive needs consulting support for clients using Marketing Cloud Account Engagement where business needs, Salesforce structure, and marketing automation must align.",
    opportunity: "The opportunity is to bring senior marketing operations and Pardot experience into client delivery so recommendations are practical, measurable, and easier to adopt.",
    outcomes: ["Clearer client requirements and solution design.", "Better Account Engagement / Sales Cloud alignment.", "More practical customer journey and automation models.", "Stronger documentation and stakeholder confidence."],
    outreachAngle: "I can help Salesfive deliver Account Engagement consulting that connects Pardot, Salesforce, lifecycle marketing, automation architecture, and RevOps into practical client outcomes.",
    ctaLabel: "Discuss consulting fit",
    contacts: makeContacts("Salesfive", "https://www.linkedin.com/company/salesfive/", ["Pardot Practice Lead", "Salesforce Consulting Director", "Client Engagement Manager"], "The strongest angle is senior Pardot consulting that translates business requirements into usable automation.")
  }),
  "revops-careers-fractional-network-june": makePage({
    slug: "revops-careers-fractional-network-june",
    companyName: "RevOps Careers Network",
    industry: "Fractional RevOps / consulting marketplace",
    roleTitle: "Fractional RevOps Opportunities",
    headline: "A fractional RevOps profile for companies that need marketing operations, lifecycle systems, automation, and revenue visibility.",
    subheadline: "A proposal-style response to RevOps Careers Network as an ongoing source of fractional RevOps, marketing operations, customer operations, and GTM advisory engagements.",
    fitSummary: "RevOps Careers Network is a strong pipeline fit because it matches ongoing fractional revenue operations, marketing operations, customer operations, and GTM advisory work.",
    priorities: ["Position Chad for fractional RevOps and marketing operations engagements.", "Package Salesforce, Pardot, lifecycle, analytics, and AI-enabled operations into clear service offers.", "Create an outreach path for marketplace operators, founders, and RevOps leaders."],
    bullets: ["Position a clear fractional RevOps and marketing operations profile built around Salesforce, automation, lifecycle, analytics, and GTM systems.", "Use proposal pages to support outreach to fractional networks and agency operators.", "Package services into diagnostics, advisory retainers, and project-based operating system builds."],
    situation: "RevOps Careers Network can serve as an ongoing pipeline source for fractional RevOps and marketing operations opportunities rather than a single company-direct opening.",
    opportunity: "The opportunity is to present a clear fractional profile that turns Chad’s enterprise RevOps, Salesforce/Pardot, lifecycle, analytics, and AI-enabled marketing systems experience into marketplace-ready offerings.",
    outcomes: ["Stronger fractional RevOps positioning.", "Clearer service packaging for network-based opportunities.", "Reusable proposal and outreach assets.", "A pipeline source for advisory, consulting, and project-based work."],
    outreachAngle: "I can support fractional RevOps and marketing operations engagements that need Salesforce/Pardot expertise, lifecycle architecture, automation, analytics, and executive-ready operating cadence.",
    ctaLabel: "Discuss fractional RevOps",
    contacts: makeContacts("RevOps Careers Network", "https://www.linkedin.com/company/revops-careers/", ["Fractional Talent Partner", "Founder", "RevOps Community Lead"], "The strongest angle is positioning Chad as a fractional RevOps and marketing operations operator for their network.")
  })
};