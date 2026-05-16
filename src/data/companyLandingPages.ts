export type CompanyLandingPage = {
  slug: string;
  companyName: string;
  industry: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  fitSummary: string;
  likelyPriorities: string[];
  recommendedEngagement: {
    title: string;
    description: string;
    bullets: string[];
  };
  proofPoints: string[];
  outreachAngle: string;
  ctaLabel: string;
  ctaHref: string;
  status?: "draft" | "ready";
};

const defaultProofPoints = [
  "Built enterprise marketing infrastructure from zero, including funnel architecture, CDP activation, segmentation, attribution, and cross-functional growth operations.",
  "Scaled digital revenue impact to $1.25B and influenced $2.5B in branch sales through measurable marketing and revenue systems.",
  "Created a full-funnel engine generating roughly 30K leads, 10K qualified prospects, and 1,500 customers per quarter.",
  "Delivered measurable incremental return: $1.82 EBITDA for every $1 spent."
];

export const companyLandingPages: Record<string, CompanyLandingPage> = {
  "business-talent-group": {
    slug: "business-talent-group",
    companyName: "Business Talent Group",
    industry: "Independent consulting / on-demand executive talent",
    eyebrow: "Business Talent Group × Chad Parker",
    headline: "A revenue systems operator for high-impact consulting engagements.",
    subheadline: "I help leadership teams turn disconnected CRM, marketing automation, customer data, segmentation, and reporting workflows into measurable revenue operating systems.",
    fitSummary: "Business Talent Group engagements often require senior operators who can step into ambiguous environments, diagnose the commercial system, and create practical execution paths. My strongest value is connecting strategy, marketing operations, data, technology, and executive reporting into a system teams can actually run.",
    likelyPriorities: [
      "Revenue marketing and GTM systems diagnostics for clients with disconnected tools, unclear funnel visibility, or weak attribution.",
      "Customer segmentation and lifecycle strategy for teams trying to prioritize accounts, audiences, offers, and next-best actions.",
      "Executive-ready reporting that connects marketing activity, sales motion, pipeline quality, and revenue outcomes.",
      "Practical operating models that help marketing, sales, data, and technology teams align around shared definitions and measurable growth."
    ],
    recommendedEngagement: {
      title: "Fractional Revenue Systems Diagnostic",
      description: "A focused advisory engagement designed for companies that need senior-level GTM clarity without adding permanent headcount.",
      bullets: [
        "Assess CRM, marketing automation, CDP, funnel reporting, campaign operations, and attribution gaps.",
        "Identify where process, data quality, segmentation, or tool utilization is slowing revenue decisions.",
        "Deliver an executive roadmap with prioritized fixes, quick wins, and longer-term operating model recommendations.",
        "Support knowledge transfer so internal teams can maintain and evolve the system after the engagement."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "I bring the combination of strategy, operating discipline, and hands-on revenue systems architecture that consulting clients often need when the problem sits between marketing, sales, data, and technology.",
    ctaLabel: "Discuss fit",
    ctaHref: "mailto:cparker@audaption.com?subject=Business%20Talent%20Group%20Consulting%20Fit",
    status: "ready"
  },
  "catalant": {
    slug: "catalant",
    companyName: "Catalant",
    industry: "Independent consulting marketplace / enterprise talent platform",
    eyebrow: "Catalant × Chad Parker",
    headline: "Enterprise-ready GTM, lifecycle, and revenue operations support.",
    subheadline: "I help companies build clearer revenue systems across funnel visibility, segmentation, attribution, AI-enabled marketing operations, and executive reporting.",
    fitSummary: "Catalant project work is a strong match for packaged, outcome-based consulting. My background fits projects where companies need an operator who can diagnose revenue friction, translate business priorities into system requirements, and create decision-grade reporting and activation models.",
    likelyPriorities: [
      "Marketing operations transformation for teams with underutilized Salesforce, HubSpot, CDP, analytics, or campaign infrastructure.",
      "Segmentation and lifecycle models that help companies prioritize growth, retention, expansion, and customer-value opportunities.",
      "Attribution and performance measurement frameworks that leadership teams can trust for investment decisions.",
      "AI-assisted workflow design that improves campaign planning, content operations, decisioning, and execution speed without losing governance."
    ],
    recommendedEngagement: {
      title: "Revenue Marketing Systems Roadmap",
      description: "A project-based engagement for organizations that need a practical bridge between marketing strategy, data architecture, GTM operations, and executive visibility.",
      bullets: [
        "Map the current-state GTM system across people, process, data, tools, and reporting.",
        "Define the highest-value segmentation, lifecycle, attribution, and automation opportunities.",
        "Prioritize a practical implementation roadmap based on business value, technical effort, and speed to impact.",
        "Create executive-ready recommendations that can be owned by marketing, sales, RevOps, analytics, and IT."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "I am strongest in consulting situations where the client does not just need a recommendation — they need a senior operator who understands how to turn growth strategy into systems, workflows, dashboards, and adoption.",
    ctaLabel: "Start a conversation",
    ctaHref: "mailto:cparker@audaption.com?subject=Catalant%20Consulting%20Fit",
    status: "ready"
  },
  "right-side-up": {
    slug: "right-side-up",
    companyName: "Right Side Up",
    industry: "Growth marketing consulting network",
    eyebrow: "Right Side Up × Chad Parker",
    headline: "A senior growth systems partner for companies scaling beyond campaign execution.",
    subheadline: "I help growth teams connect acquisition, lifecycle marketing, segmentation, experimentation, analytics, and revenue attribution into one operating model.",
    fitSummary: "Right Side Up is a natural fit when companies need senior growth guidance that goes deeper than channel management. My value is strongest when the growth challenge requires better systems, cleaner segmentation, measurable lifecycle strategy, and executive visibility across the full customer journey.",
    likelyPriorities: [
      "Lifecycle and retention strategy for growth teams trying to move beyond acquisition-only performance marketing.",
      "Segmentation models that improve audience prioritization, campaign relevance, and conversion quality.",
      "Marketing operations systems that help lean teams scale campaigns, tests, reporting, and personalization.",
      "Performance narratives that connect channel activity to pipeline, revenue, margin, retention, and customer value."
    ],
    recommendedEngagement: {
      title: "Growth Systems Advisory Sprint",
      description: "A focused sprint for teams that have growth ambition but need better infrastructure, segmentation, and performance visibility to scale efficiently.",
      bullets: [
        "Audit current acquisition, lifecycle, CRM, automation, and reporting motions.",
        "Identify gaps between campaign execution and measurable business outcomes.",
        "Build a prioritization model for segments, channels, tests, and lifecycle opportunities.",
        "Create a repeatable operating rhythm for experimentation, reporting, and optimization."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "I can help Right Side Up clients move from growth activity to growth infrastructure — the operating layer that makes campaigns more measurable, scalable, and connected to revenue outcomes.",
    ctaLabel: "Discuss growth systems",
    ctaHref: "mailto:cparker@audaption.com?subject=Right%20Side%20Up%20Consulting%20Fit",
    status: "ready"
  },
  "cerius-executives": {
    slug: "cerius-executives",
    companyName: "Cerius Executives",
    industry: "Interim and fractional executive network",
    eyebrow: "Cerius Executives × Chad Parker",
    headline: "Fractional revenue marketing leadership for companies that need operating clarity fast.",
    subheadline: "I help executive teams stabilize and scale marketing operations, GTM systems, segmentation, lifecycle strategy, and revenue reporting without adding permanent leadership overhead.",
    fitSummary: "Cerius is a strong fit for interim or fractional leadership assignments where the business needs an experienced operator to clarify priorities, organize the system, and create momentum across marketing, sales, analytics, and technology teams.",
    likelyPriorities: [
      "Interim marketing operations or revenue marketing leadership during transition, transformation, or scale-up periods.",
      "Executive alignment around funnel definitions, campaign governance, segmentation, attribution, and reporting standards.",
      "MarTech and CRM operating-model improvements that reduce friction between strategy and execution.",
      "Team structure, workflow design, and cross-functional rhythms that help internal teams move faster with clearer ownership."
    ],
    recommendedEngagement: {
      title: "Fractional Revenue Marketing Executive Engagement",
      description: "A senior leadership engagement for companies that need marketing operations, lifecycle, analytics, and GTM systems leadership on a fractional basis.",
      bullets: [
        "Assess current marketing operations maturity, team structure, platform utilization, and executive reporting needs.",
        "Establish priorities across lifecycle marketing, segmentation, campaign governance, and revenue measurement.",
        "Create a practical operating cadence between marketing, sales, analytics, technology, and finance stakeholders.",
        "Support leadership-level decision-making while building internal capability and reducing dependency."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "I bring interim executive value where marketing is not just a communications function, but a revenue operating system that needs structure, accountability, data, and cross-functional alignment.",
    ctaLabel: "Explore fractional fit",
    ctaHref: "mailto:cparker@audaption.com?subject=Cerius%20Executives%20Fractional%20Fit",
    status: "ready"
  },
  "graphite": {
    slug: "graphite",
    companyName: "Graphite",
    industry: "Independent consulting and expert marketplace",
    eyebrow: "Graphite × Chad Parker",
    headline: "Project-based GTM and revenue systems consulting for complex growth environments.",
    subheadline: "I support companies that need strategic clarity and practical execution across marketing operations, segmentation, attribution, lifecycle workflows, and AI-enabled GTM systems.",
    fitSummary: "Graphite is a fit for focused project work where clients need independent expertise and clear deliverables. My background maps well to projects involving revenue operations diagnostics, marketing technology optimization, customer segmentation, funnel analytics, and executive reporting.",
    likelyPriorities: [
      "GTM systems diagnostics for teams with unclear ownership, fragmented tooling, or inconsistent reporting.",
      "CDP, CRM, and marketing automation strategy that turns customer data into audience activation and decisioning.",
      "Segmentation and lifecycle frameworks that help companies prioritize growth, retention, and expansion opportunities.",
      "Executive dashboards and operating narratives that make performance easier to understand and act on."
    ],
    recommendedEngagement: {
      title: "GTM Systems Diagnostic and Roadmap",
      description: "A defined project that helps leadership teams understand what is working, what is creating drag, and what should be fixed first.",
      bullets: [
        "Review CRM, marketing automation, analytics, segmentation, and campaign workflows.",
        "Identify process gaps, data gaps, reporting gaps, and underutilized technology investments.",
        "Define a practical roadmap across quick wins, operating-model improvements, and platform optimization.",
        "Package findings in a format that leadership can use for prioritization, budget, and team alignment."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "I can support Graphite clients that need a senior, project-based operator to turn GTM complexity into a clear revenue systems roadmap.",
    ctaLabel: "Discuss project fit",
    ctaHref: "mailto:cparker@audaption.com?subject=Graphite%20Consulting%20Fit",
    status: "ready"
  },
  "contra": {
    slug: "contra",
    companyName: "Contra",
    industry: "Independent work and portfolio platform",
    eyebrow: "Contra × Chad Parker",
    headline: "Premium revenue marketing consulting packaged for independent project work.",
    subheadline: "I help companies improve GTM systems, lifecycle marketing, segmentation, CRM/CDP activation, AI decisioning, and revenue reporting through focused advisory and buildout engagements.",
    fitSummary: "Contra is best used as a polished storefront for premium independent consulting, not commodity freelance work. This page positions my services as packaged, executive-level offers built around revenue systems outcomes rather than hourly marketing tasks.",
    likelyPriorities: [
      "Clear service packaging for revenue systems audits, GTM diagnostics, segmentation strategy, and AI marketing operations roadmaps.",
      "A premium positioning layer that communicates executive value, not task-based freelance support.",
      "Project scopes that can be sold as fixed-fee diagnostics, monthly retainers, or targeted advisory engagements.",
      "Proof-driven messaging that connects enterprise outcomes to practical deliverables for smaller or scaling companies."
    ],
    recommendedEngagement: {
      title: "Packaged Revenue Systems Consulting Offers",
      description: "A set of focused consulting offers designed to make it easy for companies to buy strategic support without turning the engagement into a full-time role.",
      bullets: [
        "Revenue Marketing Systems Audit for teams with disconnected platforms and unclear funnel visibility.",
        "Segmentation and Lifecycle Strategy Buildout for companies trying to improve relevance, retention, and expansion.",
        "AI Decisioning and Marketing Automation Roadmap for teams moving from AI experiments to operational workflows.",
        "Fractional Advisory Retainer for ongoing executive guidance across GTM systems, analytics, and campaign operations."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "I use Contra as a way to package executive-level consulting into clear project offers, making it easier for companies to understand the outcome, scope, and value before we begin.",
    ctaLabel: "Request consulting scope",
    ctaHref: "mailto:cparker@audaption.com?subject=Contra%20Consulting%20Scope",
    status: "ready"
  },
  "linkedin-services": {
    slug: "linkedin-services",
    companyName: "LinkedIn Services",
    industry: "Professional services marketplace / owned consulting channel",
    eyebrow: "LinkedIn Services × Chad Parker",
    headline: "A direct consulting channel for revenue marketing, GTM systems, and AI-enabled operations.",
    subheadline: "I help companies diagnose and improve the operating layer between marketing strategy, sales execution, customer data, automation, attribution, and executive decision-making.",
    fitSummary: "LinkedIn Services is the strongest owned-channel path because it lets me control the positioning, pricing, service packaging, and audience. The goal is to present a clear, premium consulting offer for companies that need senior revenue marketing systems expertise without a full-time hire.",
    likelyPriorities: [
      "A services profile that clearly positions revenue marketing operations, GTM systems, segmentation, CDP activation, and AI decisioning.",
      "Direct inquiry flow for fractional advisory, project-based diagnostics, and monthly retainer work.",
      "Messaging that appeals to founders, CMOs, CROs, RevOps leaders, and PE-backed operators with complex growth systems.",
      "A consistent bridge between LinkedIn outreach, resume proof, and personalized company landing pages on aboutchad.com."
    ],
    recommendedEngagement: {
      title: "Owned-Channel Consulting Funnel",
      description: "A direct inbound and outbound system that uses LinkedIn as the entry point and aboutchad.com landing pages as the proof and conversion layer.",
      bullets: [
        "Create clear LinkedIn service categories around revenue marketing operations, GTM systems, segmentation, and AI marketing automation.",
        "Use company-specific landing pages to support outbound messages and application follow-up.",
        "Package services into fixed-fee audits, 6–8 week diagnostics, and monthly advisory retainers.",
        "Keep positioning senior, strategic, and outcome-based to avoid commodity marketing support inquiries."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "LinkedIn should become the front door for premium advisory work, while aboutchad.com provides the tailored proof layer for each company or platform conversation.",
    ctaLabel: "Start the conversation",
    ctaHref: "mailto:cparker@audaption.com?subject=LinkedIn%20Services%20Consulting%20Inquiry",
    status: "ready"
  }
};
