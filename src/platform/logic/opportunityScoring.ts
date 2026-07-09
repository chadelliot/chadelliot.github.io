import { OpportunityModel } from "../models";
import { OpportunityScore } from "../models";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * TODO: Replace this placeholder score with business rules that consider:
 * - quality and completeness of the opportunity model
 * - segment clarity and market definition
 * - evidence quality from discovery and intelligence layers
 * - execution complexity and implementation readiness
 * - engagement type-specific scoring weights
 * - source confidence and unresolved assumptions
 *
 * This layer must remain pure business logic with no prompt generation and no rendering concerns.
 */
export function opportunityScoring(opportunity: OpportunityModel): OpportunityScore {
  const commercialFit = clamp(55 + opportunity.objectives.length * 4 + opportunity.segmentation.length * 3);
  const urgency = clamp(50 + opportunity.signals.length * 5 + opportunity.risks.length * 2);
  const evidenceStrength = clamp(45 + opportunity.sourceLinks.length * 6 + opportunity.recommendations.length * 2);
  const executionReadiness = clamp(40 + opportunity.measurement.length * 5 + opportunity.campaigns.length * 3);
  const overallScore = clamp(
    (commercialFit + urgency + evidenceStrength + executionReadiness) / 4,
  );

  return {
    opportunityId: opportunity.opportunityId,
    engagementType: opportunity.engagementType,
    overallScore,
    dimensions: {
      commercialFit,
      urgency,
      evidenceStrength,
      executionReadiness,
    },
    rationale: [
      "Placeholder score derived from model completeness and content breadth.",
      "Future scoring should weight evidence, urgency, and execution complexity explicitly.",
    ],
  };
}

