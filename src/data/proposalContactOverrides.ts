export type ProposalContactOverride = {
  name: string;
  title: string;
  linkedinUrl: string;
  email?: string;
  selectionRationale: string;
};

const buildResearchContacts = (count: number, rationale: string): ProposalContactOverride[] =>
  Array.from({ length: count }, (_, index) => ({
    name: `Research contact ${String(index + 1).padStart(2, "0")}`,
    title: "Target profile retained privately",
    linkedinUrl: "#",
    selectionRationale: rationale,
  }));

export const proposalContactOverrides: Record<string, ProposalContactOverride[]> = {
  everist: buildResearchContacts(
    1,
    "One executive brand stakeholder was identified as the likely decision path based on the role's reporting structure and founder-level ownership."
  ),
  "speridian-technologies": buildResearchContacts(
    6,
    "Six product, technical product, program, and delivery stakeholders were identified as stronger fit paths based on Clay role comparison and U.S.-based product/delivery alignment."
  ),
  neolytix: buildResearchContacts(
    5,
    "Five executive, operations, process excellence, and marketing contacts were identified; three are recommended for priority outreach and two are retained as secondary operations paths."
  ),
  farlinium: buildResearchContacts(
    3,
    "Three commercial and marketing contacts were identified, with sales leadership as the strongest path because the opportunity is tied to pipeline contribution and sales partnership."
  ),
  "logic20-20": buildResearchContacts(
    5,
    "Five digital strategy, transformation, analytics architecture, and solution architecture stakeholders were identified as relevant practice or delivery paths."
  ),
};
