import { CommercialBlueprint, OpportunityModel } from "../models";

/**
 * TODO: Convert the reusable commercial blueprint into an engagement-specific Opportunity Model by:
 * - translating blueprint architecture into client-specific context
 * - binding the model to the source posting, client, and stakeholder framing
 * - selecting output targets that future generators can consume
 * - preserving the distinction between reusable architecture and engagement-specific application
 * - keeping room for future proposal, SOW, interview prep, and strategy page generators
 */
export function blueprintToOpportunity(
  blueprint: CommercialBlueprint,
): OpportunityModel {
  return {
    schemaVersion: blueprint.schemaVersion,
    opportunityId: `opportunity-${blueprint.blueprintId}`,
    blueprintId: blueprint.blueprintId,
    intelligenceId: blueprint.intelligenceId,
    intakeId: blueprint.intakeId,
    generatedAt: new Date().toISOString(),
    status: "draft",
    engagementType: blueprint.engagementType,
    client: blueprint.client,
    sourceLinks: blueprint.sourceLinks,
    role: {},
    objectives: [],
    commercialChallenges: [],
    growthOpportunities: [],
    audience: {
      customerSegments: [],
      buyingCommittee: [],
      personaNeeds: [],
    },
    segmentation: [],
    tam: {
      marketDefinition: "",
      addressableUnits: [],
      assumptions: [],
    },
    personas: [],
    journey: [],
    signals: [],
    campaigns: [],
    salesMotion: [],
    measurement: [],
    technology: [],
    competitiveLandscape: [],
    risks: [],
    assumptions: [],
    recommendations: [],
    outputTargets: [],
    blueprintSnapshot: blueprint,
    intelligenceSnapshot: {
      schemaVersion: blueprint.schemaVersion,
      intelligenceId: blueprint.intelligenceId,
      discoveryId: blueprint.intelligenceId.replace("intelligence-", "discovery-"),
      intakeId: blueprint.intakeId,
      generatedAt: blueprint.generatedAt,
      status: "draft",
      engagementType: blueprint.engagementType,
      company: blueprint.client,
      sourceLinks: blueprint.sourceLinks,
      commercialPriorities: [],
      executiveKpis: [],
      customerSegments: [],
      marketOpportunities: [],
      revenueBottlenecks: [],
      competitivePressures: [],
      technologyGaps: [],
      salesMarketingAlignmentNeeds: [],
      risks: [],
      assumptions: [],
      recommendations: [],
      confidenceSummary: blueprint.confidenceSummary,
    },
    confidenceSummary: blueprint.confidenceSummary,
  };
}

