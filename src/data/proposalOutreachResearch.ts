export type OutreachConfidence = "high" | "medium" | "low";
export type HubSpotStatus = "created" | "not_loaded_email_unavailable" | "not_loaded_needs_validation";
export type EmailStatus = "exact" | "pattern_supported" | "not_available" | "not_stored_in_repo";

export type ProposalOutreachResearchContact = {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  email?: string;
  location?: string;
  relationshipToOpportunity: string;
  confidence: OutreachConfidence;
  emailStatus: EmailStatus;
  hubspotStatus: HubSpotStatus;
  hubspotContactId?: string;
  hubspotNoteId?: string;
  selectionRationale: string;
  outreachTone: string;
  suggestedAngle: string;
};

export type ProposalOutreachResearchRecord = {
  slug: string;
  companyName: string;
  opportunityTitle: string;
  sourceTools: string[];
  lastResearched: string;
  roleContext: string;
  contacts: ProposalOutreachResearchContact[];
};

const makeHubSpotContact = ({ name, title, company, linkedinUrl, email, hubspotContactId, confidence = "medium" as OutreachConfidence, relationshipToOpportunity, selectionRationale, suggestedAngle }: {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  email?: string;
  hubspotContactId: string;
  confidence?: OutreachConfidence;
  relationshipToOpportunity?: string;
  selectionRationale?: string;
  suggestedAngle?: string;
}): ProposalOutreachResearchContact => ({
  name,
  title,
  company,
  linkedinUrl,
  email,
  relationshipToOpportunity: relationshipToOpportunity || "HubSpot contact with a LinkedIn profile and/or email associated with this proposal company.",
  confidence,
  emailStatus: email ? "exact" : "not_available",
  hubspotStatus: "created",
  hubspotContactId,
  selectionRationale: selectionRationale || "Added from HubSpot because the contact has usable outreach details for this proposal company.",
  outreachTone: "Concise, professional, and role-relevant. Use LinkedIn for short context and email for a more complete introduction when an email address is available.",
  suggestedAngle: suggestedAngle || "I can help connect strategy, operating rhythm, automation, reporting, and GTM execution into a clearer system tied to measurable outcomes."
});

export const proposalOutreachResearch: Record<string, ProposalOutreachResearchRecord> = {
  "who-gives-a-crap": {
    slug: "who-gives-a-crap",
    companyName: "Who Gives A Crap",
    opportunityTitle: "Fractional Head of Marketing Operations & Planning",
    sourceTools: ["GoFractional", "Clay", "HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "Marketing operations and planning role for a distributed, multi-market consumer goods/eCommerce brand. The core need appears to be planning cadence, campaign governance, resourcing clarity, cross-functional alignment, budget visibility, and operating rhythm across brand, growth, lifecycle, creative, analytics, and commercial stakeholders.",
    contacts: [
      makeHubSpotContact({ name: "Victoria Ortega", title: "Head of Marketing Operations", company: "Who Gives A Crap", linkedinUrl: "https://www.linkedin.com/in/victoria-ortega/", email: "victoria@whogivesacrap.org", hubspotContactId: "487057202915", confidence: "high", relationshipToOpportunity: "Likely direct functional stakeholder or hiring-path contact.", selectionRationale: "Her title directly matches the marketing operations, planning, resourcing, process, and campaign governance scope of the role.", suggestedAngle: "I can help build the operating layer underneath marketing so priorities, resourcing, campaign execution, and reporting move as one system." }),
      makeHubSpotContact({ name: "Taryn Morais", title: "Director of Lifecycle Marketing", company: "Who Gives A Crap", linkedinUrl: "https://www.linkedin.com/in/taryn-morais-316aa369/", email: "taryn@whogivesacrap.org", hubspotContactId: "487056770769", confidence: "high", relationshipToOpportunity: "Strong adjacent lifecycle stakeholder.", selectionRationale: "Lifecycle marketing will likely be impacted by planning, prioritization, campaign governance, segmentation, and operating cadence decisions.", suggestedAngle: "I can help connect lifecycle planning, campaign intake, reporting, and growth priorities into a clearer operating rhythm." }),
      makeHubSpotContact({ name: "Kat Kearney", title: "Senior Director, Global Brand Marketing", company: "Who Gives A Crap", linkedinUrl: "https://www.linkedin.com/in/kat-kearney-1406893a/", email: "kat@whogivesacrap.org", hubspotContactId: "487052448505", confidence: "medium", relationshipToOpportunity: "Senior brand stakeholder and possible executive sponsor or influencer.", selectionRationale: "Relevant if the role supports global campaign prioritization, resourcing, brand/growth handoffs, or planning governance.", suggestedAngle: "I can help create the operating model that lets brand, growth, lifecycle, and commercial teams move faster without losing clarity or cohesion." }),
      makeHubSpotContact({ name: "Jason Brain", title: "Director of Growth Marketing UK & EU", company: "Who Gives A Crap", linkedinUrl: "https://www.linkedin.com/in/jason-brain/", email: "jason@whogivesacrap.org", hubspotContactId: "487052722882", confidence: "medium", relationshipToOpportunity: "Regional growth stakeholder and adjacent influencer.", selectionRationale: "Relevant if planning work supports UK/EU growth campaigns, creative testing, channel prioritization, or operating cadence.", suggestedAngle: "I can help align growth marketing execution with a more scalable planning and reporting system across markets." })
    ]
  },
  "attest": {
    slug: "attest",
    companyName: "Attest",
    opportunityTitle: "Interim Senior Growth Marketing Manager",
    sourceTools: ["GoFractional", "Clay", "HubSpot", "Apollo"],
    lastResearched: "2026-05-17",
    roleContext: "Interim senior growth marketing role for a B2B SaaS / consumer insights platform. The role emphasizes UK/US growth strategy, AI-enhanced customer acquisition, self-service conversion paths, predictive scoring with Revenue Operations, retention campaigns, marketing automation, attribution, forecasting, Product Marketing partnership, and Marketing Director partnership.",
    contacts: [
      makeHubSpotContact({ name: "Jennifer Armstrong", title: "Marketing Director", company: "Attest", linkedinUrl: "https://www.linkedin.com/in/jennifer-armstrong-50572236/", hubspotContactId: "487073401558", confidence: "high", relationshipToOpportunity: "High-confidence senior marketing stakeholder and likely hiring-path contact for an interim senior growth marketing role.", selectionRationale: "Her Marketing Director title is directly aligned to the role's stated partnership with marketing leadership and growth execution priorities.", suggestedAngle: "I can help Attest connect growth marketing ambition to the operating system underneath it — lifecycle, segmentation, attribution, automation, AI workflows, and RevOps partnership that make growth measurable." }),
      makeHubSpotContact({ name: "Morgan Tilling", title: "People Partner", company: "Attest", linkedinUrl: "https://www.linkedin.com/in/morgan-tilling/", hubspotContactId: "487062131442", relationshipToOpportunity: "People/recruiting path who may be connected to the hiring process or able to route the inquiry.", selectionRationale: "People Partner role may support hiring logistics or point to the internal owner if the marketing leader is not directly reachable.", suggestedAngle: "I saw the interim senior growth marketing role and would appreciate guidance on the right person to discuss fit with." }),
      makeHubSpotContact({ name: "Katherine Millar", title: "Senior Product Marketing Manager", company: "Attest", linkedinUrl: "https://www.linkedin.com/in/katherinemillar/", hubspotContactId: "487067779812", relationshipToOpportunity: "Visible adjacent stakeholder; Product Marketing is explicitly part of the role's partnership model.", selectionRationale: "The role references partnership with Product Marketing for feature launches, market research, competitive intelligence, and strategic positioning.", suggestedAngle: "I can help bridge product marketing, growth marketing, RevOps, lifecycle automation, and attribution into a connected growth operating system." }),
      makeHubSpotContact({ name: "O’Brien Sharjeel", title: "Digital Marketing Manager", company: "Attest", linkedinUrl: "https://www.linkedin.com/in/obrien-sharjeel-673846318/", hubspotContactId: "487057433276", relationshipToOpportunity: "Adjacent marketing execution stakeholder who may understand growth marketing priorities or route to the hiring owner.", selectionRationale: "Digital Marketing Manager is relevant to growth marketing execution, campaign operations, funnel conversion, and activation work tied to the role.", suggestedAngle: "I can help connect campaign execution, lifecycle workflows, and RevOps measurement into a cleaner growth operating system." })
    ]
  },
  "enmacc": {
    slug: "enmacc",
    companyName: "enmacc",
    opportunityTitle: "Revenue Business Manager / Revenue Chief of Staff",
    sourceTools: ["GoFractional", "Clay", "HubSpot", "Apollo"],
    lastResearched: "2026-05-17",
    roleContext: "Revenue Chief of Staff-style contract role for a high-growth B2B energy trading technology company. The role supports CRO priorities, OKR management, project execution, stakeholder communication, revenue meeting cadence, and data-driven decision support across Sales, Marketing, Revenue Operations, and Customer Success.",
    contacts: [
      makeHubSpotContact({ name: "Jeuel Ventura", title: "Chief Revenue Officer (CRO)", company: "enmacc", linkedinUrl: "https://www.linkedin.com/in/jeuel-ventura-92979038/", hubspotContactId: "487079927538", confidence: "high", relationshipToOpportunity: "Direct executive sponsor; the role is designed to act as an impact multiplier for the CRO.", selectionRationale: "The job description directly states the role partners with and supports the Chief Revenue Officer.", suggestedAngle: "I can help turn CRO priorities into a practical revenue operating system with clearer ownership, metrics, reporting, and cross-functional accountability." }),
      makeHubSpotContact({ name: "Isa Korn", title: "Head of Revenue Operations", company: "enmacc", linkedinUrl: "https://www.linkedin.com/in/isa-korn-894ba463/", hubspotContactId: "487077999318", confidence: "high", relationshipToOpportunity: "Direct functional partner; the role explicitly works with the Head of RevOps.", selectionRationale: "The job description names Head of RevOps as a close partner, making Isa one of the strongest target-path stakeholders.", suggestedAngle: "I can help strengthen the operating rhythm between CRO priorities, RevOps execution, OKR governance, and executive reporting." }),
      makeHubSpotContact({ name: "Michael McBride", title: "Senior Revenue Operations Manager", company: "enmacc", linkedinUrl: "https://www.linkedin.com/in/michaeljohnmcbride/", hubspotContactId: "487069569750", relationshipToOpportunity: "RevOps execution stakeholder and adjacent influencer.", selectionRationale: "Senior RevOps manager likely has context on reporting, process, revenue cadence, project execution, and operating friction the role is meant to solve.", suggestedAngle: "I can help translate revenue leadership priorities into cleaner operating rhythms, project trackers, dashboards, and follow-through mechanisms." }),
      makeHubSpotContact({ name: "Simon Blake", title: "Head of Marketing", company: "enmacc", linkedinUrl: "https://www.linkedin.com/in/simon-blake-munich/", hubspotContactId: "487059273458", relationshipToOpportunity: "Adjacent revenue stakeholder across marketing alignment.", selectionRationale: "The role aligns Sales, Marketing, RevOps, and Customer Success around the revenue organization's OKRs and strategic initiatives.", suggestedAngle: "I can help connect marketing priorities into the broader revenue operating cadence so campaigns, pipeline, OKRs, and leadership reporting stay aligned." })
    ]
  },
  "turtl": {
    slug: "turtl",
    companyName: "Turtl",
    opportunityTitle: "Fractional VP of Customer Success",
    sourceTools: ["HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "Customer success and revenue leadership opportunity where executive operating cadence, customer lifecycle insight, retention, expansion, and cross-functional GTM alignment are likely relevant.",
    contacts: [
      makeHubSpotContact({ name: "Claire McNee", title: "Director of Customer Success", company: "Turtl", linkedinUrl: "https://www.linkedin.com/in/clairemcnee/", email: "claire.mcnee@turtl.co", hubspotContactId: "487045534420", confidence: "high", relationshipToOpportunity: "Direct customer success stakeholder for the opportunity.", selectionRationale: "Customer Success leadership is directly connected to the posted fractional VP CS work.", suggestedAngle: "I can help strengthen customer success operating rhythm, lifecycle visibility, retention programs, and executive reporting." }),
      makeHubSpotContact({ name: "Nick Mason", title: "CEO & Founder | Chief Storytelling Officer", company: "Turtl", linkedinUrl: "https://www.linkedin.com/in/nickmasonsays/", email: "nick@turtl.co", hubspotContactId: "487034561240", relationshipToOpportunity: "Executive stakeholder who may influence or sponsor leadership-level customer success work.", selectionRationale: "CEO/founder contact with email and LinkedIn in HubSpot.", suggestedAngle: "I can help connect customer success, lifecycle insight, and revenue reporting into a scalable operating model." }),
      makeHubSpotContact({ name: "Francesca Edwards", title: "Head of Revenue Operations", company: "Turtl", linkedinUrl: "https://www.linkedin.com/in/francescamedwards/", email: "francesca.edwards@turtl.co", hubspotContactId: "487049850595", confidence: "high", relationshipToOpportunity: "Revenue operations partner likely relevant to CS metrics, retention, and GTM operating cadence.", selectionRationale: "Head of RevOps role is directly relevant to customer success measurement and operating rhythm.", suggestedAngle: "I can help align CS priorities with RevOps reporting, lifecycle metrics, and revenue leadership cadence." })
    ]
  },
  "town-web": {
    slug: "town-web",
    companyName: "Town Web Design",
    opportunityTitle: "Fractional CPQ and RevOps Architect",
    sourceTools: ["HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "Fractional CPQ and revenue operations architecture opportunity where operational systems, process design, and implementation discipline are relevant.",
    contacts: [
      makeHubSpotContact({ name: "Angela Stănescu", title: "Operations Management", company: "Town Web Design", linkedinUrl: "https://www.linkedin.com/in/angela-stanescu/", email: "angela.stanescu@townweb.com", hubspotContactId: "487048049361", confidence: "high", relationshipToOpportunity: "Operations stakeholder likely connected to process, CPQ, and operating-system improvement.", selectionRationale: "Operations Management title aligns to the CPQ and RevOps architecture scope.", suggestedAngle: "I can help translate process complexity into cleaner CPQ, CRM, reporting, and operational workflows." })
    ]
  },
  "farlinium": {
    slug: "farlinium",
    companyName: "Farlinium",
    opportunityTitle: "B2B Growth Marketing Manager",
    sourceTools: ["HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "B2B growth marketing opportunity where sales alignment, demand generation, lifecycle execution, and measurement are relevant.",
    contacts: [
      makeHubSpotContact({ name: "John Palazzolo", title: "Solution Sales Executive", company: "Farlinium", linkedinUrl: "https://www.linkedin.com/in/john-palazzolo-7260a98/", email: "john@farlinium.com", hubspotContactId: "487041577662", relationshipToOpportunity: "Sales stakeholder adjacent to B2B growth marketing execution.", selectionRationale: "Sales perspective can help connect growth marketing to pipeline needs.", suggestedAngle: "I can help connect demand generation, sales follow-up, and pipeline reporting into a cleaner B2B growth engine." }),
      makeHubSpotContact({ name: "Jed Hamilton", title: "Marketing Specialist", company: "Farlinium", linkedinUrl: "https://www.linkedin.com/in/jed-hamilton/", email: "jed@farlinium.com", hubspotContactId: "487041645259", confidence: "high", relationshipToOpportunity: "Marketing execution stakeholder likely close to the growth marketing need.", selectionRationale: "Marketing Specialist is directly adjacent to campaign and growth execution.", suggestedAngle: "I can help build the growth marketing operating layer around campaign execution, lifecycle workflows, and reporting." }),
      makeHubSpotContact({ name: "Yusuf Abediyeh", title: "Director of Sales", company: "Farlinium", linkedinUrl: "https://www.linkedin.com/in/yabediyeh/", email: "yusuf@farlinium.com", hubspotContactId: "487028626166", confidence: "high", relationshipToOpportunity: "Sales leader and likely commercial stakeholder for growth marketing impact.", selectionRationale: "Director of Sales would be directly impacted by B2B demand generation and pipeline quality.", suggestedAngle: "I can help align growth marketing execution with sales pipeline visibility, lead quality, and revenue reporting." })
    ]
  },
  "speridian-technologies": {
    slug: "speridian-technologies",
    companyName: "Speridian Technologies",
    opportunityTitle: "Principal GTM Strategy Lead",
    sourceTools: ["HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "GTM strategy and technology consulting opportunity where product ownership, program management, and digital transformation execution are relevant.",
    contacts: [
      makeHubSpotContact({ name: "Amitoj Singh", title: "Product Owner", company: "Speridian Technologies", linkedinUrl: "https://www.linkedin.com/in/amitoj-singh-09206b18a/", email: "amitoj.singh@speridian.com", hubspotContactId: "487041105612" }),
      makeHubSpotContact({ name: "Namratha Nagaraj", title: "Product Owner", company: "Speridian Technologies", linkedinUrl: "https://www.linkedin.com/in/namms/", email: "namratha.nagaraj@speridian.com", hubspotContactId: "487040970484" }),
      makeHubSpotContact({ name: "Veronica Barajas", title: "Agile Delivery Manager", company: "Speridian Technologies", linkedinUrl: "https://www.linkedin.com/in/veronicabarajas/", email: "veronica.barajas@speridian.com", hubspotContactId: "487041575640" }),
      makeHubSpotContact({ name: "Kyle Donovan", title: "Senior Technical Product Owner", company: "Speridian Technologies", linkedinUrl: "https://www.linkedin.com/in/kyle-donovan-60983153/", email: "kyle.donovan@speridian.com", hubspotContactId: "487028567741" }),
      makeHubSpotContact({ name: "May Oyairo", title: "Digital Product Owner", company: "Speridian Technologies", linkedinUrl: "https://www.linkedin.com/in/mayoyairo/", email: "may.oyairo@speridian.com", hubspotContactId: "487028567742" }),
      makeHubSpotContact({ name: "Venkata Jitendra Chevuru", title: "Sr Technical Program Manager / Managing Principal", company: "Speridian Technologies", linkedinUrl: "https://www.linkedin.com/in/jitendra-kumar-30663a19/", email: "venkata.chevuru@speridian.com", hubspotContactId: "487040970487" })
    ]
  },
  "everist": {
    slug: "everist",
    companyName: "Everist",
    opportunityTitle: "Fractional VP Marketing",
    sourceTools: ["HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "Fractional VP marketing opportunity where brand, growth, customer acquisition, and operating cadence are relevant.",
    contacts: [
      makeHubSpotContact({ name: "Jayme Jenkins", title: "Co-Founder & Chief Brand Officer", company: "Everist", linkedinUrl: "https://www.linkedin.com/in/jayme-jenkins-a996a948/", email: "jayme.jenkins@helloeverist.com", hubspotContactId: "487039765224", confidence: "high", relationshipToOpportunity: "Founder/brand executive likely relevant to VP marketing discussions.", selectionRationale: "Chief Brand Officer role is directly adjacent to fractional marketing leadership.", suggestedAngle: "I can help connect brand strategy, growth execution, lifecycle marketing, and performance reporting into one operating system." })
    ]
  },
  "acuvance": {
    slug: "acuvance",
    companyName: "Acuvance",
    opportunityTitle: "Director of Revenue Operations",
    sourceTools: ["HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "Revenue operations leadership opportunity where CRM architecture, sales process, reporting, and GTM operating cadence are relevant.",
    contacts: [
      makeHubSpotContact({ name: "Josh Nazarian", title: "Chief Executive Officer", company: "Acuvance", linkedinUrl: "https://www.linkedin.com/in/josh-nazarian-a804611/", email: "josh.nazarian@acuvance.com", hubspotContactId: "487045534421", confidence: "high", relationshipToOpportunity: "CEO and likely executive sponsor for revenue operations maturity.", selectionRationale: "CEO contact with direct visibility into revenue operations needs.", suggestedAngle: "I can help build the operating system behind revenue growth: CRM process, reporting, segmentation, lifecycle, and executive visibility." })
    ]
  },
  "neolytix": {
    slug: "neolytix",
    companyName: "Neolytix",
    opportunityTitle: "Fractional Healthcare Growth Program Architect",
    sourceTools: ["HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "Healthcare growth program architecture opportunity involving operations, marketing, process design, and scalable execution.",
    contacts: [
      makeHubSpotContact({ name: "Mohit Sharma", title: "Operations Manager", company: "Neolytix", linkedinUrl: "https://www.linkedin.com/in/mohit-sharma-97b24958/", email: "mohit.sharma@neolytix.com", hubspotContactId: "487039975114" }),
      makeHubSpotContact({ name: "Ritu Kalsi Bhatnagar", title: "President & COO", company: "Neolytix", linkedinUrl: "https://www.linkedin.com/in/ritu-kalsi-bhatnagar-54135a29/", email: "ritu.bhatnagar@neolytix.com", hubspotContactId: "487041575641", confidence: "high" }),
      makeHubSpotContact({ name: "Mausam Sharma", title: "Operations Team Lead", company: "Neolytix", linkedinUrl: "https://www.linkedin.com/in/mausam-sharma-50a5531b1/", email: "mausam.sharma@neolytix.com", hubspotContactId: "487041960667" }),
      makeHubSpotContact({ name: "Aashi Singh", title: "Assistant Marketing Manager", company: "Neolytix", linkedinUrl: "https://www.linkedin.com/in/aashi-singh-983116193/", email: "aashi.singh@neolytix.com", hubspotContactId: "487028623084" }),
      makeHubSpotContact({ name: "Garvit Chouhan", title: "Head - Operations and Process Excellence", company: "Neolytix", linkedinUrl: "https://www.linkedin.com/in/chouhangarvit/", email: "garvit.chouhan@neolytix.com", hubspotContactId: "487040970488" })
    ]
  },
  "logic20-20": {
    slug: "logic20-20",
    companyName: "Logic20/20",
    opportunityTitle: "Solution Architect — Palantir Foundry",
    sourceTools: ["HubSpot"],
    lastResearched: "2026-05-17",
    roleContext: "Solution architecture and digital transformation opportunity where analytics, AI, product, and implementation leadership are relevant.",
    contacts: [
      makeHubSpotContact({ name: "Melanie Tran", title: "Senior Manager, Digital Strategy & Transformation Practice Area Lead", company: "Logic20/20", linkedinUrl: "https://www.linkedin.com/in/melanie-tran-97b19855/", email: "melaniet@logic2020.com", hubspotContactId: "487028572868", confidence: "high" }),
      makeHubSpotContact({ name: "Mick Wagner", title: "Sr. Solutions Architect of Advanced Analytics Practice", company: "Logic20/20", linkedinUrl: "https://www.linkedin.com/in/mick-wagner-0814065/", email: "mickw@logic2020.com", hubspotContactId: "487041109698" }),
      makeHubSpotContact({ name: "Anna Emmett", title: "Solution Architect", company: "Logic20/20", linkedinUrl: "https://www.linkedin.com/in/annaemmett/", email: "annae@logic2020.com", hubspotContactId: "487040972510" }),
      makeHubSpotContact({ name: "Lionel Bodin", title: "Senior Director - Digital Strategy and Transformation", company: "Logic20/20", linkedinUrl: "https://www.linkedin.com/in/lionel-bodin/", email: "lionelb@logic2020.com", hubspotContactId: "487041037042" }),
      makeHubSpotContact({ name: "Tejan Gabisi", title: "Director, Digital Strategy & Transformation | AI", company: "Logic20/20", linkedinUrl: "https://www.linkedin.com/in/tejangabisi/", email: "tejang@logic2020.com", hubspotContactId: "487041037048" })
    ]
  }
};
