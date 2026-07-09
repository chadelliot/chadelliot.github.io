import { DiscoveryOutput } from "../models";
import { Intake } from "../models";

/**
 * TODO: Convert intake into discovery priorities by:
 * - preserving source traceability from the intake object
 * - separating external research needs from internal follow-up questions
 * - grouping discovery tasks by company, market, customer, and measurement themes
 * - carrying forward engagement type without changing the underlying problem framing
 * - keeping this step free of AI prompts and free of final strategic interpretation
 * - leaving room for later enrichment from documents, websites, and analyst research
 */
export function intakeToDiscovery(intake: Intake): DiscoveryOutput {
  const sourceLinks = [
    intake.source.jobDescriptionUrl
      ? {
          label: "Job description",
          url: intake.source.jobDescriptionUrl,
          type: "job description",
        }
      : undefined,
  ].filter(Boolean);

  return {
    schemaVersion: intake.schemaVersion,
    discoveryId: `discovery-${intake.intakeId}`,
    intakeId: intake.intakeId,
    generatedAt: new Date().toISOString(),
    status: "draft",
    engagementType: intake.engagementType,
    company: intake.company,
    researchPlan: {
      externalResearchNeeded: [],
      internalResearchNeeded: [],
      openQuestions: [...intake.normalized.followUpQuestions],
      priorityAreas: [],
    },
    findings: {
      companyOverview: [],
      productsServices: [],
      industry: [],
      competitors: [],
      customers: [],
      businessModel: [],
      revenueModel: [],
      hiringContext: [],
      marketingMaturity: [],
      technologySignals: [],
      growthSignals: [],
      risks: [],
    },
    sourceLinks: sourceLinks as DiscoveryOutput["sourceLinks"],
    confidenceSummary: {
      overallLevel: intake.normalized.confidence,
      overallScore: 50,
      lowConfidenceAreas: [],
    },
  };
}

