import { OpportunityModel } from "../models";
import { PriorityAssessment } from "../models";

/**
 * TODO: Rank strategic priorities by:
 * - urgency implied by signals and risks
 * - business value of the objective set
 * - implementation dependencies and sequencing
 * - level of confidence in the underlying evidence
 * - engagement-type-specific stakeholder needs
 */
export function priorityEngine(opportunity: OpportunityModel): PriorityAssessment {
  const topPriorities = [
    ...opportunity.objectives.slice(0, 2),
    ...opportunity.growthOpportunities.slice(0, 1),
  ].filter(Boolean);

  return {
    opportunityId: opportunity.opportunityId,
    engagementType: opportunity.engagementType,
    topPriorities,
    sequencing: [
      "Validate the commercial problem and success criteria.",
      "Align stakeholder priorities and operating cadence.",
      "Sequence the highest-value insight and implementation work first.",
    ],
    rationale: [
      "Placeholder priority logic favors objectives and growth opportunities already present in the model.",
      "Future logic should use score thresholds and business constraints.",
    ],
  };
}

