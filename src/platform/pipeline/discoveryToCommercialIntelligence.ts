import { CommercialIntelligence } from "../models";
import { DiscoveryOutput } from "../models";

/**
 * TODO: Interpret discovery output into commercial intelligence by:
 * - translating findings into business implications and strategic priorities
 * - separating facts, inferences, assumptions, and recommendations
 * - maintaining traceability back to discovery findings and source links
 * - scoring confidence based on evidence quality and consistency
 * - retaining the original engagement framing without converting it into deliverables yet
 * - leaving explicit hooks for later executive summary and strategy generation
 */
export function discoveryToCommercialIntelligence(
  discovery: DiscoveryOutput,
): CommercialIntelligence {
  return {
    schemaVersion: discovery.schemaVersion,
    intelligenceId: `intelligence-${discovery.discoveryId}`,
    discoveryId: discovery.discoveryId,
    intakeId: discovery.intakeId,
    generatedAt: new Date().toISOString(),
    status: "draft",
    engagementType: discovery.engagementType,
    company: discovery.company,
    sourceLinks: discovery.sourceLinks,
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
    confidenceSummary: {
      overallLevel: discovery.confidenceSummary.overallLevel,
      overallScore: discovery.confidenceSummary.overallScore,
      lowConfidenceAreas: [...discovery.confidenceSummary.lowConfidenceAreas],
    },
  };
}

