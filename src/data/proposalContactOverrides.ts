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
      name: "Namratha Nagaraj",
      title: "Product Owner",
      linkedinUrl: "https://www.linkedin.com/in/namms/",
      selectionRationale: "Clay confirmed Namratha as a U.S.-based Speridian Product Owner in Plano, making her the strongest named replacement for the product-owner stakeholder path."
    },
    {
      name: "Kyle Donovan",
      title: "Senior Technical Product Owner",
      linkedinUrl: "https://www.linkedin.com/in/kyle-donovan-60983153/",
      selectionRationale: "Clay returned Kyle as a U.S.-based Senior Technical Product Owner with prior senior product experience, making him a strong technical/product stakeholder."
    },
    {
      name: "May Oyairo",
      title: "Digital Product Owner",
      linkedinUrl: "https://www.linkedin.com/in/mayoyairo/",
      selectionRationale: "Clay returned May as a U.S.-based Digital Product Owner, giving the outreach path another direct product-side stakeholder."
    },
    {
      name: "Amitoj Singh",
      title: "Product Owner",
      linkedinUrl: "https://www.linkedin.com/in/amitoj-singh-09206b18a/",
      selectionRationale: "Clay returned Amitoj as a U.S.-based Speridian Product Owner with enterprise systems experience, making him a practical secondary product contact."
    },
    {
      name: "Venkata Jitendra Chevuru",
      title: "Sr Technical Program Manager / Managing Principal",
      linkedinUrl: "https://www.linkedin.com/in/jitendra-kumar-30663a19/",
      selectionRationale: "Clay returned Venkata as a U.S.-based senior technical program leader and managing principal, making him a stronger leadership path than a generic division placeholder."
    },
    {
      name: "Veronica Barajas",
      title: "Agile Delivery Manager",
      linkedinUrl: "https://www.linkedin.com/in/veronicabarajas/",
      selectionRationale: "Clay returned Veronica as a U.S.-based Agile Delivery Manager with delivery and transformation credentials, making her a useful adoption/delivery stakeholder."
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
      selectionRationale: "Clay's role comparison kept Yusuf as the strongest commercial target because the opportunity is tied to sales partnership and pipeline contribution."
    },
    {
      name: "Jed Hamilton",
      title: "Marketing Specialist",
      linkedinUrl: "https://www.linkedin.com/in/jed-hamilton/",
      selectionRationale: "Clay returned Jed as a named Farlinium marketing contact, making him a practical supporting contact for the growth marketing and HubSpot workflow scope."
    },
    {
      name: "John Palazzolo",
      title: "Solution Sales Executive",
      linkedinUrl: "https://www.linkedin.com/in/john-palazzolo-7260a98/",
      selectionRationale: "Clay returned John as a Farlinium Solution Sales Executive, making him a secondary commercial path if sales leadership is the right entry point."
    }
  ],
  "logic20-20": [
    {
      name: "Lionel Bodin",
      title: "Senior Director - Digital Strategy and Transformation",
      linkedinUrl: "https://www.linkedin.com/in/lionel-bodin/",
      selectionRationale: "Clay returned Lionel as a senior Digital Strategy and Transformation leader, making him the clearest practice-area target for the opportunity."
    },
    {
      name: "Tejan Gabisi",
      title: "Director, Digital Strategy & Transformation | AI",
      linkedinUrl: "https://www.linkedin.com/in/tejangabisi/",
      selectionRationale: "Clay returned Tejan as a Digital Strategy & Transformation director with AI focus, making him a strong strategic stakeholder for the role."
    },
    {
      name: "Melanie Tran",
      title: "Senior Manager, Digital Strategy & Transformation Practice Area Lead",
      linkedinUrl: "https://www.linkedin.com/in/melanie-tran-97b19855/",
      selectionRationale: "Clay returned Melanie as a Digital Strategy & Transformation practice area lead, making her a strong functional stakeholder path."
    },
    {
      name: "Mick Wagner",
      title: "Sr. Solutions Architect of Advanced Analytics Practice",
      linkedinUrl: "https://www.linkedin.com/in/mick-wagner-0814065/",
      selectionRationale: "Clay returned Mick as a senior solutions architect in the advanced analytics practice, making him a relevant architecture-side stakeholder."
    },
    {
      name: "Anna Emmett",
      title: "Solution Architect",
      linkedinUrl: "https://www.linkedin.com/in/annaemmett/",
      selectionRationale: "Clay returned Anna as a Logic20/20 Solution Architect, making her a relevant peer or delivery stakeholder for the Solution Architect opportunity."
    }
  ]
};
