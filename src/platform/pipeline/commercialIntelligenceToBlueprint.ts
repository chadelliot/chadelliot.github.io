import { CommercialBlueprint } from "../models";
import { CommercialIntelligence } from "../models";

/**
 * TODO: Shape commercial intelligence into a reusable commercial blueprint by:
 * - consolidating the strategy architecture that can be reused across engagements
 * - separating durable commercial architecture from engagement-specific outputs
 * - standardizing audience, operating model, measurement, and roadmap sections
 * - keeping the blueprint reusable for proposals, SOWs, briefs, and executive artifacts
 * - avoiding any output-specific formatting decisions at this stage
 */
export function commercialIntelligenceToBlueprint(
  intelligence: CommercialIntelligence,
): CommercialBlueprint {
  return {
    schemaVersion: intelligence.schemaVersion,
    blueprintId: `blueprint-${intelligence.intelligenceId}`,
    intelligenceId: intelligence.intelligenceId,
    intakeId: intelligence.intakeId,
    generatedAt: new Date().toISOString(),
    status: "draft",
    engagementType: intelligence.engagementType,
    client: intelligence.company,
    sourceLinks: intelligence.sourceLinks,
    summary: "",
    businessObjectives: [],
    audienceArchitecture: {
      primaryStakeholders: [],
      secondaryStakeholders: [],
      decisionQuestions: [],
    },
    marketOpportunity: [],
    operatingModel: {
      currentStateHypothesis: "",
      targetState: "",
      capabilities: [],
      cadence: [],
    },
    measurementFramework: {
      northStar: "",
      leadingIndicators: [],
      laggingIndicators: [],
      reviewCadence: [],
    },
    roadmap: [],
    risks: [],
    assumptions: [],
    recommendations: [],
    confidenceSummary: {
      overallLevel: intelligence.confidenceSummary.overallLevel,
      overallScore: intelligence.confidenceSummary.overallScore,
      lowConfidenceAreas: [...intelligence.confidenceSummary.lowConfidenceAreas],
    },
  };
}

