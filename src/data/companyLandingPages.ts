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
  proposal?: {
    situation: string;
    opportunity: string;
    investment?: string;
    phases: {
      title: string;
      duration: string;
      description: string;
    }[];
    outcomes: string[];
  };
  proofPoints: string[];
  outreachAngle: string;
  ctaLabel: string;
  ctaHref: string;
  outreachContacts?: {
    name: string;
    title: string;
    linkedinUrl: string;
    email?: string;
    selectionRationale?: string;
  }[];
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
    headline: "A senior revenue systems operator for BTG client engagements.",
    subheadline: "A proposal-style point of view for supporting high-impact consulting projects where growth strategy, GTM operations, customer data, and executive reporting need to work as one system.",
    fitSummary: "Business Talent Group engagements often require senior operators who can step into ambiguous environments, diagnose the commercial system, and create practical execution paths. My strongest value is connecting strategy, marketing operations, data, technology, and executive reporting into a system teams can actually run.",
    likelyPriorities: [
      "Diagnose fragmented GTM systems.",
      "Translate priorities into an operating model.",
      "Build segmentation and lifecycle frameworks.",
      "Create executive-ready revenue reporting."
    ],
    recommendedEngagement: {
      title: "Revenue Systems Diagnostic for BTG Clients",
      description: "A focused consulting engagement designed for companies that need senior-level GTM clarity without adding permanent headcount.",
      bullets: [
        "Audit the current-state revenue system across CRM, automation, CDP, campaign workflows, funnel reporting, and attribution.",
        "Identify where process, data quality, segmentation, ownership, or technology utilization is slowing decision-making.",
        "Build a prioritized roadmap with immediate fixes, operating-model recommendations, and longer-term revenue infrastructure improvements.",
        "Equip internal teams with a practical path to maintain and evolve the system after the engagement."
      ]
    },
    proposal: {
      situation: "BTG clients often come to an engagement with a real business goal already defined — accelerate growth, improve sales efficiency, prepare for scale, stabilize reporting, or unlock more value from existing systems. The friction usually sits between departments: marketing has activity, sales has pipeline pressure, analytics has partial visibility, and technology has tools that are not fully translated into a shared operating model.",
      opportunity: "The opportunity is to provide a senior operator who can move quickly from diagnosis to decision-ready recommendations. My work would help BTG clients understand what is happening across the commercial system, what is creating drag, and where targeted changes to segmentation, workflows, reporting, or platform utilization can unlock measurable progress.",
      investment: "Project-based, fractional, or monthly advisory depending on client need",
      phases: [
        {
          title: "Diagnose",
          duration: "Phase 1",
          description: "Interview key stakeholders, review current funnel definitions, platform usage, reporting outputs, campaign workflows, and decision gaps."
        },
        {
          title: "Design",
          duration: "Phase 2",
          description: "Translate findings into a practical revenue systems model covering segmentation, attribution, lifecycle workflows, reporting, and ownership."
        },
        {
          title: "Activate",
          duration: "Phase 3",
          description: "Prioritize quick wins, define implementation steps, and support knowledge transfer so the client team can execute with clarity."
        }
      ],
      outcomes: [
        "A clear view of what is limiting funnel visibility, sales efficiency, campaign performance, or executive confidence.",
        "A practical roadmap that connects business priorities to systems, data, workflows, and reporting improvements.",
        "A stronger bridge between marketing, sales, analytics, technology, and executive stakeholders.",
        "A deliverable package BTG can position as senior, outcome-based consulting rather than tactical marketing support."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "If a BTG client needs someone who can move between executive strategy and hands-on revenue systems design, I can help turn complexity into a practical operating plan.",
    ctaLabel: "Discuss fit",
    ctaHref: "mailto:cparker@audaption.com?subject=Business%20Talent%20Group%20Consulting%20Fit",
    status: "ready"
  },
  "catalant": {
    slug: "catalant",
    companyName: "Catalant",
    industry: "Independent consulting marketplace / enterprise talent platform",
    eyebrow: "Catalant × Chad Parker",
    headline: "A project-ready GTM systems proposal for Catalant clients.",
    subheadline: "A practical consulting model for companies that need stronger revenue visibility, better segmentation, cleaner lifecycle workflows, and more usable executive reporting.",
    fitSummary: "Catalant project work is a strong match for packaged, outcome-based consulting. My background fits projects where companies need an operator who can diagnose revenue friction, translate business priorities into system requirements, and create decision-grade reporting and activation models.",
    likelyPriorities: [
      "Assess underused GTM platforms.",
      "Build lifecycle segmentation models.",
      "Create decision-grade reporting.",
      "Design AI-assisted workflows."
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
    proposal: {
      situation: "Many Catalant clients are not missing tools — they are missing a connected revenue operating model. The CRM may not reflect the actual sales motion, marketing automation may be campaign-led but not lifecycle-led, analytics may be descriptive but not decision-grade, and segmentation may exist in theory but not in activation.",
      opportunity: "The opportunity is to package senior revenue marketing systems expertise into a clear, scoped project that turns ambiguity into a practical roadmap. I can help clients identify the highest-leverage improvements across data, workflows, attribution, segmentation, automation, and executive reporting.",
      investment: "Fixed-fee diagnostic, scoped roadmap, or fractional implementation support",
      phases: [
        {
          title: "Current-state review",
          duration: "Phase 1",
          description: "Review platform architecture, data flow, funnel definitions, lifecycle workflows, dashboard outputs, and stakeholder decision needs."
        },
        {
          title: "Opportunity model",
          duration: "Phase 2",
          description: "Identify priority gaps and rank opportunities by revenue impact, implementation effort, ownership, and speed to value."
        },
        {
          title: "Roadmap delivery",
          duration: "Phase 3",
          description: "Deliver an executive-ready roadmap with governance, measurement, activation, and implementation recommendations."
        }
      ],
      outcomes: [
        "A sharper understanding of how GTM systems are enabling or limiting growth.",
        "A prioritized roadmap leadership can use to fund, sequence, or resource the work.",
        "Cleaner alignment between business strategy, customer data, lifecycle activation, and reporting.",
        "A consulting deliverable that is practical enough for operators and clear enough for executives."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "For Catalant clients, I can operate as the translator between executive growth goals and the revenue systems required to make those goals measurable and executable.",
    ctaLabel: "Start a conversation",
    ctaHref: "mailto:cparker@audaption.com?subject=Catalant%20Consulting%20Fit",
    status: "ready"
  },
  "right-side-up": {
    slug: "right-side-up",
    companyName: "Right Side Up",
    industry: "Growth marketing consulting network",
    eyebrow: "Right Side Up × Chad Parker",
    headline: "A growth systems proposal for companies scaling beyond channel execution.",
    subheadline: "A senior advisory model for teams that need acquisition, lifecycle, segmentation, experimentation, analytics, and attribution connected into one growth operating system.",
    fitSummary: "Right Side Up is a natural fit when companies need senior growth guidance that goes deeper than channel management. My value is strongest when the growth challenge requires better systems, cleaner segmentation, measurable lifecycle strategy, and executive visibility across the full customer journey.",
    likelyPriorities: [
      "Move growth beyond channel execution.",
      "Prioritize audiences and accounts.",
      "Scale campaign operations.",
      "Connect performance to revenue."
    ],
    recommendedEngagement: {
      title: "Growth Systems Advisory Sprint",
      description: "A focused advisory model for teams that have growth ambition but need better infrastructure, segmentation, and performance visibility to scale efficiently.",
      bullets: [
        "Audit current acquisition, lifecycle, CRM, automation, and reporting motions.",
        "Identify gaps between campaign execution and measurable business outcomes.",
        "Build a prioritization model for segments, channels, tests, and lifecycle opportunities.",
        "Create a repeatable operating rhythm for experimentation, reporting, and optimization."
      ]
    },
    proposal: {
      situation: "Many growth teams can execute campaigns, but the next stage of scale requires a better operating layer. Teams need sharper segmentation, clearer lifecycle motions, more consistent experimentation, and reporting that connects channel activity to business outcomes rather than isolated metrics.",
      opportunity: "The opportunity is to bring senior growth systems support to Right Side Up clients that need to connect channel execution with retention, lifecycle automation, CRM workflows, experimentation, and revenue measurement.",
      investment: "Monthly advisory, fixed-fee growth audit, or scoped consulting",
      phases: [
        {
          title: "Growth audit",
          duration: "Phase 1",
          description: "Review the growth motion across acquisition, lifecycle, CRM, reporting, testing, segmentation, and customer-value signals."
        },
        {
          title: "Prioritization model",
          duration: "Phase 2",
          description: "Define where growth work should focus based on revenue potential, audience readiness, channel leverage, and operational feasibility."
        },
        {
          title: "Operating rhythm",
          duration: "Phase 3",
          description: "Build a repeatable cadence for campaign planning, testing, reporting, insight generation, and optimization."
        }
      ],
      outcomes: [
        "A more connected view of growth performance across acquisition, lifecycle, retention, and customer value.",
        "A clearer prioritization model for campaigns, tests, segments, and channel investments.",
        "A stronger operating layer for lean teams that need speed without losing measurement discipline.",
        "A senior advisory option for Right Side Up clients that need systems-level growth support."
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
    subheadline: "A proposal for interim or fractional support across marketing operations, GTM systems, segmentation, lifecycle strategy, revenue reporting, and cross-functional execution.",
    fitSummary: "Cerius is a strong fit for interim or fractional leadership assignments where the business needs an experienced operator to clarify priorities, organize the system, and create momentum across marketing, sales, analytics, and technology teams.",
    likelyPriorities: [
      "Stabilize revenue marketing leadership.",
      "Align funnel and reporting standards.",
      "Improve MarTech operating models.",
      "Clarify ownership and rhythms."
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
    proposal: {
      situation: "Companies seeking fractional leadership often have business urgency before they have the internal structure to absorb it. Marketing may need to influence revenue, but the operating model, data, governance, reporting, or team design may not yet support the expectation.",
      opportunity: "The opportunity is to provide fractional executive support that brings structure quickly: clarify the revenue marketing strategy, organize workflows, align stakeholders, and build the systems required to make growth measurable and repeatable.",
      investment: "Monthly fractional retainer or scoped interim leadership assignment",
      phases: [
        {
          title: "Stabilize",
          duration: "Phase 1",
          description: "Assess leadership needs, team capacity, platform utilization, reporting quality, campaign governance, and immediate business priorities."
        },
        {
          title: "Structure",
          duration: "Phase 2",
          description: "Define the operating model, stakeholder cadence, workflow ownership, reporting standards, and priority revenue initiatives."
        },
        {
          title: "Scale",
          duration: "Phase 3",
          description: "Support execution, build internal capability, and transition the operating rhythm into a sustainable model."
        }
      ],
      outcomes: [
        "Clear leadership direction across marketing operations, lifecycle, GTM systems, and revenue reporting.",
        "A more disciplined operating cadence between marketing, sales, analytics, technology, and finance.",
        "Reduced ambiguity around ownership, priorities, metrics, and platform usage.",
        "A stronger bridge between interim leadership needs and long-term internal capability."
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
    headline: "A project-based GTM systems proposal for Graphite clients.",
    subheadline: "A structured consulting offer for companies that need clearer revenue operations, segmentation, lifecycle activation, attribution, and executive decision support.",
    fitSummary: "Graphite is a fit for focused project work where clients need independent expertise and clear deliverables. My background maps well to projects involving revenue operations diagnostics, marketing technology optimization, customer segmentation, funnel analytics, and executive reporting.",
    likelyPriorities: [
      "Diagnose GTM system friction.",
      "Connect CDP, CRM, and automation.",
      "Build segmentation frameworks.",
      "Create executive dashboards."
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
    proposal: {
      situation: "Graphite clients may need targeted expertise without creating a permanent role. The need is often specific but complex: clarify reporting, clean up the funnel, improve platform utilization, build segmentation, or define a roadmap for better revenue visibility.",
      opportunity: "The opportunity is to package senior GTM systems expertise into a clear project that gives leadership a practical answer: what is broken, what matters most, what should be done first, and what outcomes the business can expect.",
      investment: "Fixed-fee project, diagnostic sprint, or advisory extension",
      phases: [
        {
          title: "Discovery",
          duration: "Phase 1",
          description: "Review the client’s GTM motion, platform usage, reporting stack, data flow, lifecycle programs, and stakeholder priorities."
        },
        {
          title: "Systems map",
          duration: "Phase 2",
          description: "Document gaps across tools, definitions, workflows, data, governance, segmentation, and reporting."
        },
        {
          title: "Roadmap",
          duration: "Phase 3",
          description: "Deliver a sequenced roadmap with quick wins, operating-model updates, and platform or workflow recommendations."
        }
      ],
      outcomes: [
        "A clear diagnosis of current GTM system friction.",
        "A sequenced roadmap leadership can use to prioritize resources and next steps.",
        "More actionable segmentation, lifecycle, reporting, and automation recommendations.",
        "A practical consulting deliverable designed for immediate decision-making."
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
    headline: "A premium consulting storefront for revenue marketing systems work.",
    subheadline: "A proposal-led landing page for packaging GTM systems audits, segmentation strategy, lifecycle activation, AI marketing operations, and fractional advisory services.",
    fitSummary: "Contra is best used as a polished storefront for premium independent consulting, not commodity freelance work. This page positions my services as packaged, executive-level offers built around revenue systems outcomes rather than hourly marketing tasks.",
    likelyPriorities: [
      "Package premium consulting offers.",
      "Position executive value clearly.",
      "Simplify scope and pricing paths.",
      "Connect proof to buyer outcomes."
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
    proposal: {
      situation: "Independent consulting platforms can easily pull premium operators into commodity pricing unless the offer is packaged clearly. The page needs to position the work as a business outcome: clearer revenue systems, better segmentation, smarter activation, and more trusted reporting.",
      opportunity: "The opportunity is to use Contra as a storefront for packaged offers that are easy to buy and hard to commoditize. Each offer should define the problem, the scope, the deliverable, and the business value before an hourly conversation begins.",
      investment: "Fixed-fee offers, monthly retainers, or scoped advisory packages",
      phases: [
        {
          title: "Package",
          duration: "Phase 1",
          description: "Define the core consulting offers, outcomes, deliverables, pricing logic, and buyer-facing positioning."
        },
        {
          title: "Qualify",
          duration: "Phase 2",
          description: "Use a short intake process to understand the buyer’s systems, stage, business goals, and urgency."
        },
        {
          title: "Deliver",
          duration: "Phase 3",
          description: "Execute the agreed audit, roadmap, advisory, or activation support with clear deliverables and decision-ready outputs."
        }
      ],
      outcomes: [
        "A stronger premium positioning layer for independent consulting work.",
        "Clear service offers that reduce scope ambiguity and protect pricing power.",
        "A better path from portfolio interest to project discussion.",
        "A structure that supports fixed-fee and retainer conversations rather than commodity hourly work."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "Contra should function as a polished consulting storefront — with aboutchad.com providing the proposal-style proof layer behind each premium offer.",
    ctaLabel: "Request consulting scope",
    ctaHref: "mailto:cparker@audaption.com?subject=Contra%20Consulting%20Scope",
    status: "ready"
  },
  "linkedin-services": {
    slug: "linkedin-services",
    companyName: "LinkedIn Services",
    industry: "Professional services marketplace / owned consulting channel",
    eyebrow: "LinkedIn Services × Chad Parker",
    headline: "A direct consulting funnel for revenue marketing, GTM systems, and AI-enabled operations.",
    subheadline: "A proposal-style page that turns LinkedIn interest into a clear next step for project-based consulting, fractional advisory, and monthly retainer work.",
    fitSummary: "LinkedIn Services is the strongest owned-channel path because it lets me control the positioning, pricing, service packaging, and audience. The goal is to present a clear, premium consulting offer for companies that need senior revenue marketing systems expertise without a full-time hire.",
    likelyPriorities: [
      "Position revenue systems services.",
      "Create a direct inquiry flow.",
      "Target senior growth buyers.",
      "Bridge LinkedIn to tailored pages."
    ],
    recommendedEngagement: {
      title: "Owned-Channel Consulting Funnel",
      description: "A direct inbound and outbound system that uses LinkedIn as the entry point and aboutchad.com landing pages as the proof and conversion layer.",
      bullets: [
        "Create clear LinkedIn service categories around revenue marketing operations, GTM systems, segmentation, and AI marketing automation.",
        "Use company-specific landing pages to support outbound messages and application follow-up.",
        "Package services into fixed-fee audits, scoped diagnostics, and monthly advisory retainers.",
        "Keep positioning senior, strategic, and outcome-based to avoid commodity marketing support inquiries."
      ]
    },
    proposal: {
      situation: "LinkedIn is likely to be the most direct path to premium advisory work, but it needs to be more than a profile. The services page should act as the front door, while aboutchad.com becomes the deeper proposal layer that demonstrates the thinking behind the offer.",
      opportunity: "The opportunity is to create an owned consulting funnel: LinkedIn generates interest, company-specific pages show relevance, and the offer structure moves prospects toward fixed-fee diagnostics, fractional advisory, or monthly retainer conversations.",
      investment: "Owned-channel setup, outbound support, and retainer-based consulting offers",
      phases: [
        {
          title: "Position",
          duration: "Phase 1",
          description: "Define the consulting categories, profile language, proof points, and offer architecture for LinkedIn Services."
        },
        {
          title: "Personalize",
          duration: "Phase 2",
          description: "Build company-specific proposal pages that connect the buyer’s likely needs to a tailored consulting point of view."
        },
        {
          title: "Convert",
          duration: "Phase 3",
          description: "Move interested companies into a scoped diagnostic, advisory retainer, or project-based consulting engagement."
        }
      ],
      outcomes: [
        "A stronger direct channel for premium consulting opportunities.",
        "Clearer positioning around revenue marketing operations, GTM systems, segmentation, and AI-enabled operations.",
        "A repeatable way to support outreach with tailored landing pages.",
        "A better path from profile view to consulting conversation."
      ]
    },
    proofPoints: defaultProofPoints,
    outreachAngle: "LinkedIn should become the front door for premium advisory work, while aboutchad.com provides the tailored proof layer for each company or platform conversation.",
    ctaLabel: "Start the conversation",
    ctaHref: "mailto:cparker@audaption.com?subject=LinkedIn%20Services%20Consulting%20Inquiry",
    status: "ready"
  }
};