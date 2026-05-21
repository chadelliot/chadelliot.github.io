import type { CompanyLandingPage } from "./companyLandingPages";

type OutreachContact = NonNullable<CompanyLandingPage["outreachContacts"]>[number];

const linkedInSearch = (query: string) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;

export const indeedContractWave1OutreachContacts: Record<string, OutreachContact[]> = {
  "sage-haus": [
    { name: "Nelson Boyd", title: "VP Growth Marketing", linkedinUrl: linkedInSearch("Nelson Boyd Sage Haus VP Growth Marketing"), selectionRationale: "The role context points to Nelson as the reporting path and strongest likely hiring manager." },
    { name: "Kelly Hubbell", title: "Founder & CEO", linkedinUrl: linkedInSearch("Kelly Hubbell Sage Haus Founder CEO"), selectionRationale: "Founder-led company; likely sponsor or influencer for lifecycle growth and conversion decisions." },
    { name: "Lifecycle Marketing Hiring Lead", title: "Lifecycle / CRM search path", linkedinUrl: linkedInSearch("Sage Haus lifecycle marketing email SMS growth"), selectionRationale: "Fallback search path for lifecycle, CRM, and SMS stakeholders tied to the role scope." },
    { name: "Operations / Placement Lead", title: "Operations stakeholder search path", linkedinUrl: linkedInSearch("Sage Haus operations placement staffing"), selectionRationale: "The work touches family and candidate conversion paths, so an operations or placement leader may influence requirements." }
  ],
  "welcomelend": [
    { name: "Founder / Managing Partner", title: "Founder or managing partner search path", linkedinUrl: linkedInSearch("WelcomeLend founder managing partner capital markets"), selectionRationale: "For a lean advisory firm, founder or managing partner leadership is likely to own outbound growth economics." },
    { name: "Capital Markets Lead", title: "Capital markets leadership search path", linkedinUrl: linkedInSearch("WelcomeLend capital markets lead"), selectionRationale: "Likely influencer for ICP, offer positioning, and outbound pipeline quality." },
    { name: "Growth Marketing Hiring Lead", title: "Growth marketing search path", linkedinUrl: linkedInSearch("WelcomeLend Growth Marketing Lead"), selectionRationale: "Role-based path for the person coordinating the outbound growth contractor role." },
    { name: "Revenue Operations / Sales Lead", title: "Revenue operations search path", linkedinUrl: linkedInSearch("WelcomeLend revenue operations sales lead"), selectionRationale: "Outbound deliverability, Apollo/Clay, sequencing, and pipeline reporting usually intersect with sales or revenue operations." }
  ],
  "vantagescore": [
    { name: "Ola Fadahunsi", title: "SVP and Head of Communications", linkedinUrl: linkedInSearch("Ola Fadahunsi VantageScore LinkedIn"), selectionRationale: "Public reporting identifies Ola as SVP and Head of Communications; SEO/search visibility likely connects to communications and content strategy." },
    { name: "Digital Marketing Lead", title: "Digital marketing search path", linkedinUrl: linkedInSearch("VantageScore digital marketing manager SEO paid search"), selectionRationale: "Role-based path for the likely functional manager of paid search, SEO, and content briefs." },
    { name: "Search Marketing Hiring Lead", title: "Search marketing search path", linkedinUrl: linkedInSearch("VantageScore Search Marketing SEO Manager"), selectionRationale: "Direct search path for the 1099 Search Marketing & SEO Manager role." },
    { name: "Content / Communications Lead", title: "Content and communications search path", linkedinUrl: linkedInSearch("VantageScore content communications marketing"), selectionRationale: "SEO/content recommendations likely need approval or partnership from communications and brand/content stakeholders." }
  ],
  "peak-creative": [
    { name: "Agency Founder / Owner", title: "Agency leadership search path", linkedinUrl: linkedInSearch("Peak Creative digital marketing agency founder owner"), selectionRationale: "No exact public hiring manager verified; small agency founder/owner leadership is likely to influence a paid media and AI workflow contractor hire." },
    { name: "Paid Media Lead", title: "Paid media search path", linkedinUrl: linkedInSearch("Peak Creative Google Ads Meta Ads paid media"), selectionRationale: "Role-based search for the person likely to evaluate Google, Meta, and campaign optimization capability." },
    { name: "AI Solutions / Digital Marketing Lead", title: "AI marketing search path", linkedinUrl: linkedInSearch("Peak Creative AI Solutions digital marketing specialist"), selectionRationale: "The role title includes AI Solutions, making this a useful path to locate the stakeholder behind the AI workflow ask." },
    { name: "Client Strategy Lead", title: "Client strategy search path", linkedinUrl: linkedInSearch("Peak Creative client strategy digital marketing"), selectionRationale: "Client strategy is likely to influence contractor fit for campaign execution and reporting." }
  ],
  "tactics-marketing": [
    { name: "Agency Founder / Owner", title: "Agency leadership search path", linkedinUrl: linkedInSearch("Tactics Marketing agency founder owner"), selectionRationale: "No exact public hiring manager verified; agency leadership is likely to influence this HubSpot, WordPress, and client execution role." },
    { name: "HubSpot / Marketing Operations Lead", title: "HubSpot operations search path", linkedinUrl: linkedInSearch("Tactics Marketing HubSpot marketing operations"), selectionRationale: "Role-based path for the person likely to evaluate HubSpot, workflows, client execution, and campaign operations capability." },
    { name: "Client Strategy Lead", title: "Client strategy search path", linkedinUrl: linkedInSearch("Tactics Marketing client strategy digital marketing"), selectionRationale: "Likely influencer for client communication, strategy, positioning, and outcome ownership." },
    { name: "WordPress / Web Marketing Lead", title: "Web marketing search path", linkedinUrl: linkedInSearch("Tactics Marketing WordPress digital marketing specialist"), selectionRationale: "The role requires WordPress execution, so the web/client delivery lead may influence the hire." }
  ],
  "two-rivers-marketing": [
    { name: "Marketing Automation Lead", title: "Marketing automation search path", linkedinUrl: linkedInSearch("Two Rivers Marketing marketing automation strategist"), selectionRationale: "The role is specifically a Freelance Marketing Automation Strategist, so this is the most relevant functional hiring path." },
    { name: "Digital Strategy Director", title: "Digital strategy search path", linkedinUrl: linkedInSearch("Two Rivers Marketing digital strategy director"), selectionRationale: "Likely influencer for CRM, automation, email, analytics, and client journey strategy work." },
    { name: "CRM / Email Strategy Lead", title: "CRM and email search path", linkedinUrl: linkedInSearch("Two Rivers Marketing CRM email strategy"), selectionRationale: "Directly tied to the role's CRM, email, segmentation, data hygiene, and QA scope." },
    { name: "Talent / Resource Lead", title: "Talent or resource management search path", linkedinUrl: linkedInSearch("Two Rivers Marketing talent acquisition freelance"), selectionRationale: "Because the role is part of a freelance network, talent/resource leadership may route the conversation." }
  ],
  "auq-seo-specialist": [
    { name: "Senior SEO Manager", title: "Senior SEO Manager search path", linkedinUrl: linkedInSearch("AUQ Senior SEO Manager SEO agency"), selectionRationale: "The role reports to a Senior SEO Manager, making this the most direct likely hiring path." },
    { name: "Founder / Agency Operator", title: "Founder or agency operator search path", linkedinUrl: linkedInSearch("AUQ SEO agency founder"), selectionRationale: "Likely influencer for freelance SEO bench work, client allocation, and operating model fit." },
    { name: "Content SEO Lead", title: "Content SEO search path", linkedinUrl: linkedInSearch("AUQ content SEO lead SaaS"), selectionRationale: "The role is content-SEO heavy, including briefs, authors, and AI flows." },
    { name: "Client SEO Strategy Lead", title: "Client SEO strategy search path", linkedinUrl: linkedInSearch("AUQ SEO strategist client manager"), selectionRationale: "Likely influencer for client campaign strategy, reporting cadence, and account ownership." }
  ]
};
