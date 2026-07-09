import { OpportunityModel } from "../models";
import { ImplementationRoadmap } from "../models";

/**
 * TODO: Build an implementation roadmap that:
 * - sequences work from discovery to execution
 * - captures dependencies between tasks and workstreams
 * - distinguishes near-term discovery from medium-term operational changes
 * - uses engagement type to change the rollout emphasis
 * - remains a planning artifact only, not a renderer or a deliverable template
 */
export function implementationRoadmap(
  opportunity: OpportunityModel,
): ImplementationRoadmap {
  return {
    opportunityId: opportunity.opportunityId,
    engagementType: opportunity.engagementType,
    summary: "Placeholder roadmap organized from the current opportunity model.",
    phases: [
      {
        name: "Phase 1",
        duration: "0-30 days",
        goals: [
          "Validate the commercial problem statement.",
          "Confirm stakeholder priorities and success criteria.",
        ],
        dependencies: ["Discovery and commercial intelligence"],
      },
      {
        name: "Phase 2",
        duration: "31-90 days",
        goals: [
          "Operationalize the highest-priority recommendation.",
          "Stand up the first measurement cadence.",
        ],
        dependencies: ["Agreement on the initial blueprint"],
      },
      {
        name: "Phase 3",
        duration: "3-12 months",
        goals: [
          "Scale the operating model and reporting system.",
          "Expand the roadmap across additional stakeholder groups.",
        ],
        dependencies: ["Execution capacity and leadership support"],
      },
    ],
  };
}

