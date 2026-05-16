export type ProposalContactOverride = {
  name: string;
  title: string;
  linkedinUrl: string;
  selectionRationale: string;
};

export const proposalContactOverrides: Record<string, ProposalContactOverride[]> = {
  everist: [
    {
      name: "Jayme Jenkins",
      title: "Co-Founder & Chief Brand Officer",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Jayme%20Jenkins%20Everist",
      selectionRationale: "The role states it reports to the Co-Founder & Chief Brand Officer, making Jayme the clearest likely hiring stakeholder."
    }
  ],
  "speridian-technologies": [
    {
      name: "Speridian DHCS Product Owner Chief",
      title: "Likely DHCS product leadership / interview stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Speridian%20DHCS%20Product%20Owner%20Chief%20Behavioral%20Health%20Transformation",
      selectionRationale: "The job post says the interview panel includes the Product Owner Chief, making this function a high-confidence stakeholder path."
    },
    {
      name: "Speridian DHCS Division Chief",
      title: "Likely DHCS division leadership / interview stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Speridian%20DHCS%20Division%20Chief%20MESMD%20Behavioral%20Health",
      selectionRationale: "The job post names a Division Chief as part of the interview panel, so this is a likely authority path for the engagement."
    },
    {
      name: "Speridian HCD Lead",
      title: "Likely HCD / adoption stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Speridian%20DHCS%20HCD%20Lead%20MESMD",
      selectionRationale: "The job post identifies the HCD Lead as part of the interview panel and the role works closely with HCD on readiness and adoption."
    }
  ],
  neolytix: [
    {
      name: "Neolytix CEO",
      title: "CEO / executive sponsor for Growth Services",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Neolytix%20CEO%20Growth%20Services",
      selectionRationale: "The job post says the role reports to the CEO / Head of NGS, making the CEO a high-confidence executive sponsor path."
    },
    {
      name: "Head of Neolytix Growth Services",
      title: "Likely NGS business owner",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Neolytix%20Growth%20Services%20NGS%20Head",
      selectionRationale: "The role is specifically for Neolytix Growth Services and reports to the CEO / Head of NGS, making this the closest functional buyer."
    },
    {
      name: "Neolytix Healthcare Business Development Lead",
      title: "Likely provider growth / referral-development stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Neolytix%20healthcare%20business%20development%20physician%20relations",
      selectionRationale: "The scope centers on referral development and healthcare business development, so this function likely influences the need."
    }
  ],
  farlinium: [
    {
      name: "Farlinium Sales Leadership",
      title: "Likely sales / pipeline stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Farlinium%20sales%20leadership%20pipeline%20growth",
      selectionRationale: "The role partners with sales and is measured on pipeline contribution, making sales leadership a practical door-opener."
    },
    {
      name: "Farlinium Marketing Leadership",
      title: "Likely growth marketing stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Farlinium%20marketing%20growth%20marketing%20leader",
      selectionRationale: "The role owns B2B growth marketing execution, HubSpot workflows, and campaign reporting, pointing to marketing leadership as a likely buyer."
    },
    {
      name: "Farlinium Talent Acquisition",
      title: "Likely recruiting / hiring process contact",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Farlinium%20talent%20acquisition%20recruiter",
      selectionRationale: "When the functional hiring manager is not named, a talent acquisition or recruiter profile can still open the process conversation."
    }
  ],
  "logic20-20": [
    {
      name: "Logic20/20 Digital Strategy & Transformation Leader",
      title: "Likely practice-area hiring stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Logic20%2F20%20Digital%20Strategy%20Transformation%20leader",
      selectionRationale: "The job post places the role in Digital Strategy & Transformation, making practice leadership the closest likely buyer."
    },
    {
      name: "Logic20/20 Talent Acquisition",
      title: "Likely recruiter / talent process contact",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Logic20%2F20%20talent%20acquisition%20solution%20architect",
      selectionRationale: "The role is posted through a recruiting workflow, so talent acquisition is a reasonable process owner to engage."
    },
    {
      name: "Logic20/20 Engineering Delivery Leader",
      title: "Likely solution delivery stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Logic20%2F20%20engineering%20delivery%20solution%20architect",
      selectionRationale: "The role owns implementation architecture and delivery support, so engineering or delivery leadership could influence selection."
    }
  ]
};
