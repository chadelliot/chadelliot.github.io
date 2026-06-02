import { type CompanyLandingPage } from "./companyLandingPages";

const proofPoints = [
  "Built enterprise marketing infrastructure from zero, including funnel architecture, CDP activation, segmentation, attribution, lifecycle operations, and cross-functional growth systems.",
  "Scaled digital revenue impact to $1.25B and influenced $2.5B in branch sales through measurable marketing and revenue systems.",
  "Created a full-funnel engine generating roughly 30K leads, 10K qualified prospects, and 1,500 customers per quarter.",
  "Delivered measurable incremental return: $1.82 EBITDA for every $1 spent."
];

const makePhases = (audit: string, design: string, enablement: string) => [
  { title: audit, duration: "Contract or fractional engagement", description: "Review current goals, systems, messaging, workflows, reporting, stakeholders, and operating friction." },
  { title: design, duration: "Contract or fractional engagement", description: "Define the strategy, workflow, content, campaign, automation, and measurement model needed to support the role." },
  { title: enablement, duration: "Contract or fractional engagement", description: "Support execution planning, documentation, stakeholder alignment, reporting, and optimization." }
];

const makePage = ({ slug, companyName, industry, headline, subheadline, fitSummary, priorities, title, description, bullets, situation, opportunity, investment, outcomes, outreachAngle, ctaLabel = "Discuss fit" }: {
  slug: string;
  companyName: string;
  industry: string;
  headline: string;
  subheadline: string;
  fitSummary: string;
  priorities: string[];
  title: string;
  description: string;
  bullets: string[];
  situation: string;
  opportunity: string;
  investment: string;
  outcomes: string[];
  outreachAngle: string;
  ctaLabel?: string;
}): CompanyLandingPage => ({
  slug,
  companyName,
  industry,
  eyebrow: `${companyName} × Chad Parker`,
  headline,
  subheadline,
  fitSummary,
  likelyPriorities: priorities,
  recommendedEngagement: { title, description, bullets },
  proposal: {
    situation,
    opportunity,
    investment,
    phases: makePhases("Current-state assessment", "Strategy and operating design", "Execution enablement"),
    outcomes,
  },
  proofPoints,
  outreachAngle,
  ctaLabel,
  ctaHref: "/contact",
  status: "ready"
});

export const fractionalOpportunityWave8CompanyLandingPages: Record<string, CompanyLandingPage> = {
  "sleep-doctor-gtm-product-marketing": makePage({
    slug: "sleep-doctor-gtm-product-marketing",
    companyName: "Sleep Doctor",
    industry: "Digital health / sleep care / GTM product marketing",
    headline: "A GTM product-marketing system that connects positioning, lifecycle activation, and measurable growth.",
    subheadline: "A proposal-style response to Sleep Doctor’s GTM / product marketing opportunity across positioning, launch planning, lifecycle messaging, analytics, and growth operations.",
    fitSummary: "Sleep Doctor is a strong fit because the work sits at the intersection of healthcare consumer behavior, lifecycle marketing, product positioning, digital acquisition, attribution, and cross-functional GTM execution.",
    priorities: ["Clarify product positioning and audience needs across sleep-health solutions.", "Connect acquisition, lifecycle, content, and product messaging into a clearer GTM system.", "Create reporting that helps leadership understand what is driving conversion and retention."],
    title: "GTM Product Marketing Operating System",
    description: "A fractional GTM and product-marketing engagement focused on positioning, launch planning, lifecycle activation, and growth measurement.",
    bullets: ["Audit product messaging, audience segments, lifecycle paths, and conversion points.", "Build a launch and campaign rhythm that aligns product, content, growth, and analytics.", "Define reporting that connects GTM activity to acquisition, engagement, and revenue outcomes."],
    situation: "Sleep Doctor appears to need GTM and product-marketing support for a digital health model where trust, education, conversion, and lifecycle engagement all matter.",
    opportunity: "The opportunity is to connect product positioning to the marketing system around it so customer needs, campaigns, content, lifecycle messaging, and reporting reinforce one another.",
    investment: "Fractional or contract opportunity; compensation not listed in source summary",
    outcomes: ["Sharper product positioning and audience messaging.", "More coordinated GTM launch and lifecycle execution.", "Clearer attribution and performance visibility.", "A practical operating cadence across product, marketing, and analytics."],
    outreachAngle: "I can help Sleep Doctor connect product positioning, lifecycle marketing, content, paid media, automation, and analytics into a practical GTM operating system.",
    ctaLabel: "Discuss GTM fit"
  }),
  "whole-womans-health-fractional-marketing-director": makePage({
    slug: "whole-womans-health-fractional-marketing-director",
    companyName: "Whole Woman’s Health",
    industry: "Healthcare / reproductive health / fractional marketing leadership",
    headline: "A marketing operating model for patient access, trust-building, and measurable demand.",
    subheadline: "A proposal-style response to Whole Woman’s Health’s fractional marketing director opportunity across content, lifecycle communications, paid media, analytics, and patient-facing growth.",
    fitSummary: "Whole Woman’s Health is a strong adjacent fit because the role requires senior marketing judgment, sensitive audience understanding, patient trust, content strategy, digital acquisition, lifecycle communications, and clear measurement.",
    priorities: ["Strengthen patient-facing marketing strategy, content, and channel execution.", "Build more consistent lifecycle communications and campaign measurement.", "Support leadership with a practical marketing operating cadence and performance visibility."],
    title: "Fractional Marketing Leadership System",
    description: "A fractional marketing leadership engagement focused on patient access, content strategy, lifecycle communications, campaign execution, and reporting.",
    bullets: ["Assess current marketing channels, audience needs, content gaps, and conversion paths.", "Define a campaign and communications rhythm that balances trust, access, education, and growth.", "Build reporting that clarifies what is driving inquiries, engagement, and patient conversion."],
    situation: "Whole Woman’s Health needs marketing leadership in a sensitive healthcare category where clarity, empathy, trust, and performance discipline all matter.",
    opportunity: "The opportunity is to build a marketing system that supports patient access and organizational growth without reducing the work to generic demand generation.",
    investment: "Fractional marketing director opportunity; compensation not listed in source summary",
    outcomes: ["Clearer marketing priorities and campaign rhythm.", "Stronger lifecycle and patient communications.", "Improved visibility into channel and content performance.", "A scalable operating model for fractional marketing leadership."],
    outreachAngle: "I can help Whole Woman’s Health build a marketing operating rhythm that connects content, lifecycle communications, paid media, analytics, and patient access into one measurable system.",
    ctaLabel: "Discuss marketing leadership"
  }),
  "shaw-scott-contract-solutions-engineer-consultant": makePage({
    slug: "shaw-scott-contract-solutions-engineer-consultant",
    companyName: "Shaw/Scott",
    industry: "Marketing technology consulting / solutions engineering",
    headline: "Marketing technology solutions support grounded in strategy, systems, and practical execution.",
    subheadline: "A proposal-style response to Shaw/Scott’s contract solutions engineer consultant opportunity across marketing technology, client discovery, requirements, solution design, and enablement.",
    fitSummary: "Shaw/Scott is a strong adjacent fit because the work requires translating business needs into marketing technology solutions, workflows, requirements, stakeholder clarity, and client-facing recommendations.",
    priorities: ["Translate client business goals into clear marketing technology requirements.", "Support solution design across lifecycle, automation, data, and reporting needs.", "Bridge strategy, platform capability, and client adoption."],
    title: "Marketing Technology Solutions Consultant",
    description: "A contract consulting engagement focused on client discovery, MarTech solution design, lifecycle workflows, and enablement.",
    bullets: ["Assess client marketing systems, lifecycle workflows, data needs, and reporting gaps.", "Translate stakeholder requirements into practical solution recommendations.", "Support documentation, adoption planning, and handoff between strategy and implementation."],
    situation: "Shaw/Scott’s solutions engineer consultant need likely supports clients that need help connecting marketing objectives to platform design and delivery.",
    opportunity: "The opportunity is to bring senior marketing operations judgment into solution design so client recommendations are practical, measurable, and easier to adopt.",
    investment: "Contract consulting opportunity; compensation not listed in source summary",
    outcomes: ["Clearer client requirements and solution architecture.", "Better alignment between marketing goals and platform workflows.", "Stronger handoff from strategy to implementation.", "More practical enablement and adoption support."],
    outreachAngle: "I can help Shaw/Scott connect client marketing strategy, lifecycle architecture, platform workflows, and reporting into practical solutions clients can actually run.",
    ctaLabel: "Discuss solutions fit"
  }),
  "strenox-cro-strategist": makePage({
    slug: "strenox-cro-strategist",
    companyName: "Strenox",
    industry: "CRO / experimentation / growth strategy",
    headline: "A conversion strategy system that connects experimentation, messaging, analytics, and revenue outcomes.",
    subheadline: "A proposal-style response to Strenox’s CRO strategist opportunity across experimentation strategy, conversion insights, growth messaging, analytics, and performance improvement.",
    fitSummary: "Strenox is a strong fit because conversion strategy depends on the same operating muscles I use across funnel analytics, campaign performance, lifecycle messaging, testing priorities, and executive reporting.",
    priorities: ["Prioritize conversion opportunities based on funnel data and business value.", "Connect testing strategy to messaging, UX, lifecycle, and acquisition learnings.", "Create clear reporting that turns experimentation into growth decisions."],
    title: "CRO Strategy and Growth Operating Model",
    description: "A project or fractional engagement focused on conversion strategy, experimentation prioritization, messaging, analytics, and growth reporting.",
    bullets: ["Review funnel performance, conversion paths, campaign data, and audience segments.", "Build a prioritization model for tests, messaging improvements, and lifecycle opportunities.", "Create reporting that ties experimentation to pipeline, revenue, or customer outcomes."],
    situation: "Strenox needs CRO strategy support where testing, analytics, messaging, and growth decisions need to be connected into a repeatable system.",
    opportunity: "The opportunity is to move CRO from isolated tests into a broader growth operating model that helps teams learn faster and make better trade-offs.",
    investment: "Contract or fractional opportunity; compensation not listed in source summary",
    outcomes: ["Clearer CRO prioritization.", "Stronger connection between testing and business outcomes.", "Improved messaging and lifecycle insights.", "A repeatable reporting cadence for experimentation decisions."],
    outreachAngle: "I can help Strenox connect CRO strategy, lifecycle messaging, campaign performance, analytics, and executive-ready reporting into a practical growth system.",
    ctaLabel: "Discuss CRO fit"
  }),
  "run-studios-internal-communications-content-strategist": makePage({
    slug: "run-studios-internal-communications-content-strategist",
    companyName: "RUN Studios",
    industry: "Content strategy / internal communications / creative operations",
    headline: "A content operations system that turns complex priorities into clear, repeatable communications.",
    subheadline: "A proposal-style response to RUN Studios’ internal communications content strategist opportunity across content planning, stakeholder alignment, messaging, editorial operations, and performance feedback.",
    fitSummary: "RUN Studios is a medium-strong fit because the work requires content strategy, stakeholder alignment, editorial process, communications planning, and the ability to create structure around complex information.",
    priorities: ["Translate stakeholder priorities into clear internal communications and content plans.", "Build editorial workflows that improve consistency, speed, and quality.", "Use performance feedback and audience needs to refine messaging over time."],
    title: "Internal Communications Content Operations System",
    description: "A contract content strategy engagement focused on editorial planning, stakeholder alignment, messaging systems, and execution cadence.",
    bullets: ["Audit communications goals, audience needs, stakeholder inputs, and content workflow.", "Create an editorial operating rhythm for planning, drafting, review, approval, and reporting.", "Build messaging frameworks that make complex priorities easier to understand and act on."],
    situation: "RUN Studios needs content strategy support for internal communications where clarity, consistency, and stakeholder alignment are critical.",
    opportunity: "The opportunity is to create a practical content operations model so communications become easier to plan, produce, review, and improve.",
    investment: "Contract opportunity; compensation not listed in source summary",
    outcomes: ["Clearer internal communications planning.", "More consistent editorial workflow.", "Better stakeholder alignment around messaging priorities.", "A repeatable content operations rhythm."],
    outreachAngle: "I can help RUN Studios create a content operations rhythm that connects stakeholder priorities, editorial planning, review workflows, and measurable communications outcomes.",
    ctaLabel: "Discuss content fit"
  }),
  "xen-ai-fractional-gtm-advisory": makePage({
    slug: "xen-ai-fractional-gtm-advisory",
    companyName: "Xen.ai",
    industry: "AI / GTM advisory / growth systems",
    headline: "A practical GTM advisory model for AI-enabled growth, RevOps, and lifecycle execution.",
    subheadline: "A proposal-style response to Xen.ai’s fractional GTM advisory opportunity across positioning, revenue operations, lifecycle systems, AI workflows, and go-to-market execution.",
    fitSummary: "Xen.ai is a strong fit because the opportunity blends AI, GTM strategy, lifecycle operations, RevOps, automation, and the practical discipline needed to turn ideas into operating systems.",
    priorities: ["Clarify ICP, positioning, GTM motion, and growth priorities.", "Connect AI workflows to practical marketing, sales, and lifecycle execution.", "Build reporting and operating cadence around GTM performance."],
    title: "Fractional GTM and AI Growth Advisor",
    description: "A fractional advisory engagement focused on GTM strategy, AI-enabled workflows, lifecycle operations, RevOps, and performance visibility.",
    bullets: ["Assess ICP, positioning, funnel motion, lifecycle workflows, and GTM systems.", "Identify practical AI workflow opportunities across content, campaigns, routing, and reporting.", "Create an operating cadence that connects GTM execution to measurable outcomes."],
    situation: "Xen.ai needs fractional GTM guidance in a category where AI needs to be translated into practical commercial systems, not just positioning language.",
    opportunity: "The opportunity is to build a GTM operating model that connects strategy, data, workflows, content, sales alignment, and reporting into a repeatable growth engine.",
    investment: "Fractional advisory opportunity; compensation not listed in source summary",
    outcomes: ["Clearer GTM priorities and positioning.", "Practical AI-assisted marketing and RevOps workflows.", "Stronger lifecycle and funnel visibility.", "A repeatable execution cadence tied to business outcomes."],
    outreachAngle: "I can help Xen.ai turn GTM strategy and AI-enabled workflows into a practical operating system across lifecycle marketing, RevOps, content, and performance reporting.",
    ctaLabel: "Discuss GTM advisory"
  }),
  "bay-fc-fractional-marketing-pr-operator": makePage({
    slug: "bay-fc-fractional-marketing-pr-operator",
    companyName: "Bay FC",
    industry: "Sports / brand marketing / PR operations",
    headline: "A marketing and communications operating rhythm for a fast-moving sports brand.",
    subheadline: "A proposal-style response to the fractional marketing / PR operator opportunity across campaign coordination, communications workflow, brand moments, content planning, and performance visibility.",
    fitSummary: "Bay FC is a medium-strong fit because the role needs organized marketing execution, communications cadence, campaign operations, stakeholder alignment, and reporting discipline in a fast-moving brand environment.",
    priorities: ["Coordinate campaign, PR, content, and stakeholder workflows around key brand moments.", "Create a clearer operating rhythm for marketing and communications execution.", "Improve visibility into what is happening, what is next, and what impact it is creating."],
    title: "Fractional Marketing and PR Operations Support",
    description: "A fractional operator engagement focused on campaign coordination, communications process, content planning, and execution visibility.",
    bullets: ["Audit the current campaign and communications workflow.", "Create a practical planning cadence for PR, social, content, and marketing priorities.", "Build trackers and reporting views that improve clarity across stakeholders."],
    situation: "Bay FC’s marketing / PR operator need appears focused on execution support, coordination, and operating rhythm for a fast-growing sports brand.",
    opportunity: "The opportunity is to give the team a clearer system for managing marketing moments, communications priorities, approvals, and follow-through without slowing down the brand voice.",
    investment: "Fractional operator opportunity; compensation not listed in source summary",
    outcomes: ["Clearer campaign and PR operating cadence.", "Better visibility into marketing priorities and deadlines.", "More consistent stakeholder alignment.", "A practical rhythm for content, communications, and reporting."],
    outreachAngle: "I can help Bay FC bring more operating clarity to marketing and PR execution while keeping campaigns, content, stakeholder communication, and reporting moving quickly.",
    ctaLabel: "Discuss operator fit"
  }),
  "rippling-senior-lifecycle-marketing-manager-contractor": makePage({
    slug: "rippling-senior-lifecycle-marketing-manager-contractor",
    companyName: "Rippling",
    industry: "B2B SaaS / lifecycle marketing / growth operations",
    headline: "A lifecycle marketing operating system built for segmentation, automation, and measurable revenue impact.",
    subheadline: "A proposal-style response to Rippling’s senior lifecycle marketing contractor opportunity across lifecycle strategy, customer journeys, segmentation, automation, experimentation, and reporting.",
    fitSummary: "Rippling is a very strong fit because the work directly aligns with lifecycle marketing, segmentation, automation, CRM workflows, experimentation, revenue reporting, and cross-functional GTM alignment.",
    priorities: ["Improve lifecycle journeys across acquisition, activation, expansion, and retention.", "Strengthen segmentation, automation, testing, and performance reporting.", "Partner across growth, product marketing, RevOps, analytics, and sales to improve outcomes."],
    title: "Senior Lifecycle Marketing Operating System",
    description: "A contractor engagement focused on lifecycle strategy, segmentation, automation, experimentation, and revenue-connected reporting.",
    bullets: ["Audit lifecycle journeys, segments, triggers, content, and reporting.", "Design experiments and automation improvements tied to measurable funnel outcomes.", "Create a planning and optimization cadence across marketing, RevOps, product, and analytics."],
    situation: "Rippling’s lifecycle marketing contractor role needs a senior operator who can move between strategy, workflow design, execution, testing, and measurement.",
    opportunity: "The opportunity is to strengthen lifecycle marketing as an operating system, connecting audience data, automation, content, testing, and revenue visibility.",
    investment: "Contract / part-time opportunity; compensation not listed in source summary",
    outcomes: ["Sharper lifecycle segmentation and journey strategy.", "More effective automation and testing cadence.", "Clearer reporting tied to funnel and revenue outcomes.", "Better cross-functional alignment across GTM teams."],
    outreachAngle: "I can help Rippling improve lifecycle performance by connecting segmentation, automation, campaign operations, experimentation, RevOps, and analytics into one measurable system.",
    ctaLabel: "Discuss lifecycle fit"
  }),
  "classdojo-b2b-content-thought-leadership-strategist": makePage({
    slug: "classdojo-b2b-content-thought-leadership-strategist",
    companyName: "ClassDojo",
    industry: "EdTech / B2B content / thought leadership",
    headline: "A B2B content engine that turns expertise, audience needs, and growth priorities into thought leadership.",
    subheadline: "A proposal-style response to ClassDojo’s B2B content and thought leadership strategist contract across content strategy, executive narrative, audience insights, editorial operations, and campaign activation.",
    fitSummary: "ClassDojo is a strong fit because the role requires content strategy, executive narrative, audience understanding, editorial operations, campaign integration, and the ability to build a repeatable content engine.",
    priorities: ["Define a B2B thought leadership strategy tied to audience needs and business priorities.", "Build an editorial operating rhythm that improves quality, speed, and reuse across channels.", "Connect content themes to campaigns, lifecycle journeys, and measurable engagement."],
    title: "B2B Thought Leadership Content Engine",
    description: "A contract content strategy engagement focused on narrative, editorial operations, SME input, channel activation, and performance learning.",
    bullets: ["Audit audience needs, existing content, message pillars, and channel opportunities.", "Create a thought leadership framework that turns internal expertise into reusable content assets.", "Build a weekly editorial and review cadence connected to campaign and lifecycle needs."],
    situation: "ClassDojo needs B2B content and thought leadership support that can translate expertise, product value, market perspective, and audience questions into clear content.",
    opportunity: "The opportunity is to create a repeatable content engine that supports demand creation, credibility, executive voice, and lifecycle engagement without becoming generic content production.",
    investment: "Contract opportunity; compensation not listed in source summary",
    outcomes: ["Clearer thought leadership narrative and content priorities.", "Reusable content pillars across channels.", "Improved editorial workflow and SME input process.", "Stronger connection between content, campaigns, and measurable engagement."],
    outreachAngle: "I can help ClassDojo build a B2B content engine that connects audience needs, thought leadership, SME input, campaign priorities, and performance learning into a scalable operating rhythm.",
    ctaLabel: "Discuss content strategy"
  })
};
