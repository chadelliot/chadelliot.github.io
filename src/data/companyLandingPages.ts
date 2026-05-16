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

export const companyLandingPages: Record<string, CompanyLandingPage> = {};
