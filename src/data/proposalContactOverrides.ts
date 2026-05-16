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
      name: "Namrata Nagaraj",
      title: "Product Owner Chief / likely DHCS product leadership stakeholder",
      linkedinUrl: "https://www.linkedin.com/search/results/people/?keywords=Namrata%20Nagaraj%20Speridian%20DHCS%20Product%20Owner%20Chief",
      selectionRationale: "This replaces the Product Owner Chief placeholder with the likely named person surfaced from the LinkedIn profile search path."
    },
    {
      name: "Priyaanka Shil",
      title: "Product Owner / Product Lead",
      linkedinUrl: "https://www.linkedin.com/in/priyaanka-shil-46a5b233a/",
      selectionRationale: "Clay returned Priyaanka as a named Speridian Product Owner / Product Lead, making her a practical product-side target to test before outreach."
    },
    {
      name: "Kyle Donovan",
      title: "Senior Technical Product Owner",
      linkedinUrl: "https://www.linkedin.com/in/kyle-donovan-60983153/",
      selectionRationale: "Clay returned Kyle as a named Speridian Senior Technical Product Owner, making him a reasonable technical/product stakeholder path."
    }
  ],
  neolytix: [
    {
      name: "Ritu Kalsi Bhatnagar",
      title: "President & COO",
      linkedinUrl: "https://www.linkedin.com/in/ritu-kalsi-bhatnagar-54135a29/",
      selectionRationale: "Clay returned Ritu as Neolytix President & COO, making her the strongest named executive sponsor path for the Growth Services opportunity."
    },
    {
      name: "Garvit Chouhan",
      title: "Head - Operations and Process Excellence",
      linkedinUrl: "https://www.linkedin.com/in/chouhangarvit/",
      selectionRationale: "Clay returned Garvit as Head of Operations and Process Excellence, making him a logical operating-model stakeholder for the proposed growth architecture work."
    },
    {
      name: "Aashi Singh",
      title: "Assistant Marketing Manager",
      linkedinUrl: "https://www.linkedin.com/in/aashi-singh-983116193/",
      selectionRationale: "Clay returned Aashi as a named Neolytix marketing contact, making her a practical marketing-side path while higher-level growth ownership is validated."
    }
  ],
  farlinium: [
    {
      name: "Yusuf Abediyeh",
      title: "Director of Sales",
      linkedinUrl: "https://www.linkedin.com/in/yabediyeh/",
      selectionRationale: "Clay returned Yusuf as Farlinium Director of Sales, which aligns with the role's sales partnership and pipeline contribution focus."
    },
    {
      name: "Jed Hamilton",
      title: "Marketing Specialist",
      linkedinUrl: "https://www.linkedin.com/in/jed-hamilton/",
      selectionRationale: "Clay returned Jed as a named Farlinium marketing contact, making him a relevant path for the growth marketing and HubSpot workflow scope."
    },
    {
      name: "John Palazzolo",
      title: "Solution Sales Executive",
      linkedinUrl: "https://www.linkedin.com/in/john-palazzolo-7260a98/",
      selectionRationale: "Clay returned John as a Farlinium Solution Sales Executive, making him a secondary commercial stakeholder if sales leadership is the right entry point."
    }
  ],
  "logic20-20": [
    {
      name: "Lionel Bodin",
      title: "Senior Director - Digital Strategy and Transformation",
      linkedinUrl: "https://www.linkedin.com/in/lionel-bodin/",
      selectionRationale: "Clay returned Lionel as a senior Logic20/20 Digital Strategy and Transformation leader, matching the practice area tied to the opportunity."
    },
    {
      name: "Melanie Tran",
      title: "Senior Manager, Digital Strategy & Transformation Practice Area Lead",
      linkedinUrl: "https://www.linkedin.com/in/melanie-tran-97b19855/",
      selectionRationale: "Clay returned Melanie as a Digital Strategy & Transformation practice area lead, making her a strong functional stakeholder path."
    },
    {
      name: "Anna Emmett",
      title: "Solution Architect",
      linkedinUrl: "https://www.linkedin.com/in/annaemmett/",
      selectionRationale: "Clay returned Anna as a Logic20/20 Solution Architect, making her a relevant peer or delivery stakeholder for the Solution Architect opportunity."
    }
  ]
};
