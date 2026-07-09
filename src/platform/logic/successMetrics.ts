import { OpportunityModel } from "../models";
import { SuccessMetrics } from "../models";

/**
 * TODO: Define success metrics by:
 * - linking metrics to the business problem and objectives
 * - separating leading, lagging, and guardrail metrics
 * - ensuring the metrics can be inspected by executives
 * - tailoring the metric set by engagement type and use case
 * - keeping the output measurement-oriented only, with no page rendering logic
 */
export function successMetrics(opportunity: OpportunityModel): SuccessMetrics {
  const metrics = opportunity.measurement.slice(0, 3).map((measurement, index) => ({
    name: measurement || `Metric ${index + 1}`,
    definition: "Placeholder metric definition derived from the opportunity model.",
    type: index === 0 ? "leading" : index === 1 ? "lagging" : "guardrail",
  })) as SuccessMetrics["metrics"];

  return {
    opportunityId: opportunity.opportunityId,
    engagementType: opportunity.engagementType,
    northStar: opportunity.objectives[0] ?? "Executive decision support quality",
    metrics,
  };
}

