export type OutreachConfidence = "high" | "medium" | "low";
export type HubSpotStatus = "created" | "not_loaded_email_unavailable" | "not_loaded_needs_validation";
export type EmailStatus = "exact" | "pattern_supported" | "not_available" | "not_stored_in_repo";

export type ProposalOutreachResearchContact = {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
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

export const proposalOutreachResearch: Record<string, ProposalOutreachResearchRecord> = {
  "who-gives-a-crap": {
    slug: "who-gives-a-crap",
    companyName: "Who Gives A Crap",
    opportunityTitle: "Fractional Head of Marketing Operations & Planning",
    sourceTools: ["GoFractional", "Clay", "HubSpot"],
    lastResearched: "2026-05-16",
    roleContext: "Marketing operations and planning role for a distributed, multi-market consumer goods/eCommerce brand. The core need appears to be planning cadence, campaign governance, resourcing clarity, cross-functional alignment, budget visibility, and operating rhythm across brand, growth, lifecycle, creative, analytics, and commercial stakeholders.",
    contacts: [
      {
        name: "Victoria Ortega",
        title: "Head of Marketing Operations",
        company: "Who Gives A Crap",
        linkedinUrl: "https://www.linkedin.com/in/victoria-ortega/",
        location: "Melbourne, Victoria, Australia",
        relationshipToOpportunity: "Likely direct functional stakeholder or hiring-path contact.",
        confidence: "high",
        emailStatus: "pattern_supported",
        hubspotStatus: "created",
        hubspotContactId: "487057202915",
        hubspotNoteId: "369873521373",
        selectionRationale: "Her title directly matches the marketing operations, planning, resourcing, process, and campaign governance scope of the role.",
        outreachTone: "Direct, operator-to-operator, and practical. Lead with marketing operations systems, planning cadence, resourcing clarity, and cross-functional execution. Avoid generic brand/growth language.",
        suggestedAngle: "I can help build the operating layer underneath marketing so priorities, resourcing, campaign execution, and reporting move as one system."
      },
      {
        name: "Taryn Morais",
        title: "Director of Lifecycle Marketing",
        company: "Who Gives A Crap",
        linkedinUrl: "https://www.linkedin.com/in/taryn-morais-316aa369/",
        location: "Greater Melbourne Area, Australia",
        relationshipToOpportunity: "Strong adjacent lifecycle stakeholder.",
        confidence: "high",
        emailStatus: "pattern_supported",
        hubspotStatus: "created",
        hubspotContactId: "487056770769",
        hubspotNoteId: "369875374799",
        selectionRationale: "Lifecycle marketing will likely be impacted by planning, prioritization, campaign governance, segmentation, and operating cadence decisions.",
        outreachTone: "Collaborative and lifecycle-oriented. Lead with relevance, customer journey visibility, retention and activation workflows, and cross-functional alignment.",
        suggestedAngle: "I can help connect lifecycle planning, campaign intake, reporting, and growth priorities into a clearer operating rhythm."
      },
      {
        name: "Kat Kearney",
        title: "Senior Director, Global Brand Marketing",
        company: "Who Gives A Crap",
        linkedinUrl: "https://www.linkedin.com/in/kat-kearney-1406893a/",
        location: "Greater Melbourne Area, Australia",
        relationshipToOpportunity: "Senior brand stakeholder and possible executive sponsor or influencer.",
        confidence: "medium",
        emailStatus: "pattern_supported",
        hubspotStatus: "created",
        hubspotContactId: "487052448505",
        hubspotNoteId: "369861675766",
        selectionRationale: "Relevant if the role supports global campaign prioritization, resourcing, brand/growth handoffs, or planning governance.",
        outreachTone: "Strategic and brand-sensitive. Lead with preserving creative momentum while improving planning clarity, decision visibility, and execution discipline.",
        suggestedAngle: "I can help create the operating model that lets brand, growth, lifecycle, and commercial teams move faster without losing clarity or cohesion."
      },
      {
        name: "Jason Brain",
        title: "Director of Growth Marketing UK & EU",
        company: "Who Gives A Crap",
        linkedinUrl: "https://www.linkedin.com/in/jason-brain/",
        location: "London, England, United Kingdom",
        relationshipToOpportunity: "Regional growth stakeholder and adjacent influencer.",
        confidence: "medium",
        emailStatus: "pattern_supported",
        hubspotStatus: "created",
        hubspotContactId: "487052722882",
        hubspotNoteId: "369875374800",
        selectionRationale: "Relevant if planning work supports UK/EU growth campaigns, creative testing, channel prioritization, or operating cadence.",
        outreachTone: "Commercial and performance-oriented. Lead with campaign velocity, growth planning, test-and-learn discipline, and better visibility across priorities and outcomes.",
        suggestedAngle: "I can help align growth marketing execution with a more scalable planning and reporting system across markets."
      }
    ]
  },
  "attest": {
    slug: "attest",
    companyName: "Attest",
    opportunityTitle: "Interim Senior Growth Marketing Manager",
    sourceTools: ["GoFractional", "Clay", "HubSpot", "Apollo"],
    lastResearched: "2026-05-16",
    roleContext: "Interim senior growth marketing role for a B2B SaaS / consumer insights platform. The role emphasizes UK/US growth strategy, AI-enhanced customer acquisition, self-service conversion paths, predictive scoring with Revenue Operations, retention campaigns, marketing automation, attribution, forecasting, Product Marketing partnership, and Marketing Director partnership.",
    contacts: [
      {
        name: "Jennifer Armstrong",
        title: "Marketing Director",
        company: "Attest",
        linkedinUrl: "https://www.linkedin.com/in/jennifer-armstrong-50572236/",
        relationshipToOpportunity: "High-confidence senior marketing stakeholder and likely hiring-path contact for an interim senior growth marketing role.",
        confidence: "high",
        emailStatus: "not_available",
        hubspotStatus: "created",
        hubspotContactId: "487073401558",
        selectionRationale: "Her Marketing Director title is directly aligned to the role's stated partnership with marketing leadership and growth execution priorities.",
        outreachTone: "Senior, concise, and outcome-led. Treat as a likely decision-maker or close sponsor; lead with growth operating systems, lifecycle execution, RevOps partnership, and measurable pipeline impact.",
        suggestedAngle: "I can help Attest connect growth marketing ambition to the operating system underneath it — lifecycle, segmentation, attribution, automation, AI workflows, and RevOps partnership that make growth measurable."
      },
      {
        name: "Morgan Tilling",
        title: "People Partner",
        company: "Attest",
        linkedinUrl: "https://www.linkedin.com/in/morgan-tilling/",
        relationshipToOpportunity: "Medium-confidence people/recruiting path who may be connected to the hiring process or able to route the inquiry.",
        confidence: "medium",
        emailStatus: "not_available",
        hubspotStatus: "created",
        hubspotContactId: "487062131442",
        selectionRationale: "People Partner role may support hiring logistics or point to the internal owner if the marketing leader is not directly reachable.",
        outreachTone: "Respectful and routing-oriented. Do not assume ownership; ask whether they can point you to the person managing the interim growth marketing search.",
        suggestedAngle: "I saw the interim senior growth marketing role and would appreciate guidance on the right person to discuss fit with."
      },
      {
        name: "Katherine Millar",
        title: "Senior Product Marketing Manager",
        company: "Attest",
        linkedinUrl: "https://www.linkedin.com/in/katherinemillar/",
        location: "United Kingdom",
        relationshipToOpportunity: "Visible adjacent stakeholder; Product Marketing is explicitly part of the role's partnership model.",
        confidence: "medium",
        emailStatus: "not_available",
        hubspotStatus: "created",
        hubspotContactId: "487067779812",
        hubspotNoteId: "369873593034",
        selectionRationale: "The role references partnership with Product Marketing for feature launches, market research, competitive intelligence, and strategic positioning. She may not own hiring, but is a relevant GTM stakeholder.",
        outreachTone: "GTM and product-marketing aligned. Keep the note consultative and focused on lifecycle-to-launch alignment, AI-enhanced growth programs, attribution, and funnel conversion rather than generic job-application language.",
        suggestedAngle: "I can help bridge product marketing, growth marketing, RevOps, lifecycle automation, and attribution into a connected growth operating system."
      },
      {
        name: "O’Brien Sharjeel",
        title: "Digital Marketing Manager",
        company: "Attest",
        linkedinUrl: "https://www.linkedin.com/in/obrien-sharjeel-673846318/",
        relationshipToOpportunity: "Medium-confidence adjacent marketing execution stakeholder who may understand growth marketing priorities or route to the hiring owner.",
        confidence: "medium",
        emailStatus: "not_available",
        hubspotStatus: "created",
        hubspotContactId: "487057433276",
        selectionRationale: "Digital Marketing Manager is relevant to growth marketing execution, campaign operations, funnel conversion, and activation work tied to the role.",
        outreachTone: "Peer-level and practical. Do not assume hiring ownership; ask for context or direction while referencing shared growth marketing execution priorities.",
        suggestedAngle: "I can help connect campaign execution, lifecycle workflows, and RevOps measurement into a cleaner growth operating system."
      }
    ]
  },
  "enmacc": {
    slug: "enmacc",
    companyName: "enmacc",
    opportunityTitle: "Revenue Business Manager / Revenue Chief of Staff",
    sourceTools: ["GoFractional", "Clay", "HubSpot", "Apollo"],
    lastResearched: "2026-05-16",
    roleContext: "Revenue Chief of Staff-style contract role for a high-growth B2B energy trading technology company. The role is explicitly described as an impact multiplier for the CRO, working closely with the CRO, Chief of Staff, and Head of RevOps to drive strategic initiatives, OKR management, project execution, stakeholder communication, revenue meeting cadence, and data-driven decision support across Sales, Marketing, Revenue Operations, and Customer Success.",
    contacts: [
      {
        name: "Jeuel Ventura",
        title: "Chief Revenue Officer (CRO)",
        company: "enmacc",
        linkedinUrl: "https://www.linkedin.com/in/jeuel-ventura-92979038/",
        location: "London, England, United Kingdom",
        relationshipToOpportunity: "Direct executive sponsor; the role is designed to act as an impact multiplier for the CRO.",
        confidence: "high",
        emailStatus: "not_available",
        hubspotStatus: "created",
        hubspotContactId: "487079927538",
        hubspotNoteId: "369877824218",
        selectionRationale: "The job description directly states the role partners with and supports the Chief Revenue Officer.",
        outreachTone: "Executive, concise, and outcome-led. Lead with operating cadence, OKR execution, strategic initiative throughput, decision-ready reporting, and revenue leadership leverage.",
        suggestedAngle: "I can help turn CRO priorities into a practical revenue operating system with clearer ownership, metrics, reporting, and cross-functional accountability."
      },
      {
        name: "Isa Korn",
        title: "Head of Revenue Operations",
        company: "enmacc",
        linkedinUrl: "https://www.linkedin.com/in/isa-korn-894ba463/",
        location: "London, England, United Kingdom",
        relationshipToOpportunity: "Direct functional partner; the role explicitly works with the Head of RevOps.",
        confidence: "high",
        emailStatus: "not_available",
        hubspotStatus: "created",
        hubspotContactId: "487077999318",
        hubspotNoteId: "369887738558",
        selectionRationale: "The job description names Head of RevOps as a close partner, making Isa one of the strongest target-path stakeholders.",
        outreachTone: "RevOps peer/operator-to-operator. Speak in terms of cadence, OKRs, pipeline visibility, project governance, reporting architecture, and making revenue priorities executable.",
        suggestedAngle: "I can help strengthen the operating rhythm between CRO priorities, RevOps execution, OKR governance, and executive reporting."
      },
      {
        name: "Michael McBride",
        title: "Senior Revenue Operations Manager",
        company: "enmacc",
        linkedinUrl: "https://www.linkedin.com/in/michaeljohnmcbride/",
        location: "Tarbes, Occitanie, France",
        relationshipToOpportunity: "RevOps execution stakeholder and adjacent influencer.",
        confidence: "medium",
        emailStatus: "not_available",
        hubspotStatus: "created",
        hubspotContactId: "487069569750",
        hubspotNoteId: "369877969626",
        selectionRationale: "Senior RevOps manager likely has context on reporting, process, revenue cadence, project execution, and operating friction the role is meant to solve.",
        outreachTone: "Execution-oriented and practical. Lead with dashboards, cadence, project governance, clean handoffs, and reducing operational drag across revenue teams.",
        suggestedAngle: "I can help translate revenue leadership priorities into cleaner operating rhythms, project trackers, dashboards, and follow-through mechanisms."
      },
      {
        name: "Simon Blake",
        title: "Head of Marketing",
        company: "enmacc",
        linkedinUrl: "https://www.linkedin.com/in/simon-blake-munich/",
        location: "Munich, Bavaria, Germany",
        relationshipToOpportunity: "Adjacent revenue stakeholder across marketing alignment.",
        confidence: "medium",
        emailStatus: "not_available",
        hubspotStatus: "created",
        hubspotContactId: "487059273458",
        hubspotNoteId: "369877845693",
        selectionRationale: "The role aligns Sales, Marketing, RevOps, and Customer Success around the revenue organization's OKRs and strategic initiatives.",
        outreachTone: "Marketing/revenue alignment tone. Emphasize GTM visibility, OKR alignment, campaign-to-revenue reporting, and cross-functional execution.",
        suggestedAngle: "I can help connect marketing priorities into the broader revenue operating cadence so campaigns, pipeline, OKRs, and leadership reporting stay aligned."
      }
    ]
  }
};
