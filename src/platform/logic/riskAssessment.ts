import { OpportunityModel } from "../models";
import { RiskAssessment } from "../models";

function inferSeverity(text: string): "low" | "medium" | "high" {
  const normalized = text.toLowerCase();
  if (normalized.includes("critical") || normalized.includes("high")) {
    return "high";
  }
  if (normalized.includes("fragment") || normalized.includes("unclear")) {
    return "medium";
  }
  return "low";
}

/**
 * TODO: Turn opportunity risks into a structured risk view by:
 * - distinguishing strategic, operational, and execution risks
 * - attaching mitigations for each risk area
 * - ranking by severity and business impact
 * - aligning mitigations to the commercial blueprint and roadmap
 * - keeping the output purely analytical, not visual or presentational
 */
export function riskAssessment(opportunity: OpportunityModel): RiskAssessment {
  const risks = opportunity.risks.length
    ? opportunity.risks.map((risk) => ({
        area: "Opportunity risk",
        severity: inferSeverity(risk),
        description: risk,
        mitigation: [
          "Validate the assumption with stakeholders.",
          "Convert the risk into a tracked implementation item.",
        ],
      }))
    : [
        {
          area: "No explicit risk recorded",
          severity: "low" as const,
          description: "The current model does not yet surface explicit risk items.",
          mitigation: ["Capture risks during discovery and blueprint refinement."],
        },
      ];

  return {
    opportunityId: opportunity.opportunityId,
    engagementType: opportunity.engagementType,
    risks,
    summary: "Placeholder risk assessment derived from the opportunity model.",
  };
}

