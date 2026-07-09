import { OpportunityModel } from "../models";
import { Recommendations } from "../models";

/**
 * TODO: Convert the opportunity model into ranked business recommendations by:
 * - prioritizing recommendations that are directly supported by the model
 * - separating must-do actions from supporting actions
 * - preserving engagement-type framing without changing the underlying model
 * - adding rationale tied to risks, assumptions, and opportunities
 * - avoiding any proposal copy or rendering-specific structure
 */
export function recommendationEngine(
  opportunity: OpportunityModel,
): Recommendations {
  const primary = opportunity.recommendations.slice(0, 3);
  const secondary = opportunity.assumptions.slice(0, 3);

  return {
    opportunityId: opportunity.opportunityId,
    engagementType: opportunity.engagementType,
    primary,
    secondary,
    notes: [
      "Placeholder recommendations should be replaced with ranked business actions.",
      "Future logic should separate executive recommendations from implementation support.",
    ],
  };
}

