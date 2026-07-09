import {
  BusinessLogic,
  CommercialStrategy,
  CommercialStrategySection,
  OpportunityModel,
} from "../models";

const buildSection = (
  key: CommercialStrategySection["key"],
  title: string,
  purpose: string,
  summary: string,
  content: string[],
  metrics?: string[],
  notes?: string[],
): CommercialStrategySection => ({
  key,
  title,
  purpose,
  summary,
  content,
  metrics,
  notes,
});

const uniqueStrings = (values: string[]): string[] =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

/**
 * TODO: Keep this generator pure and deterministic.
 * Future implementation should:
 * - map the Opportunity Model and Business Logic into the current ten-section Commercial Strategy structure
 * - preserve the existing website order, labels, and content flow
 * - avoid any new business-rule decisions inside the generator
 * - use business logic outputs to fill in section content and measurement summaries
 * - leave presentation concerns to the renderer layer
 * - support future renderers for the public Commercial Strategy page, proposals, SOWs, briefs, and interview artifacts
 */
export function commercialStrategyGenerator(
  opportunity: OpportunityModel,
  businessLogic: BusinessLogic,
): CommercialStrategy {
  const title = `${opportunity.client.name} Commercial Strategy`;
  const subtitle =
    businessLogic.recommendations.primary[0] ??
    "A structured operating model for commercial decision-making.";

  const kpiFoundation = buildSection(
    "kpiFoundation",
    "KPI Foundation",
    "Define the executive scoreboard that anchors the strategy.",
    "Use the current objectives, success metrics, and business logic to define the opening scoreboard.",
    uniqueStrings([
      opportunity.objectives[0] ?? businessLogic.successMetrics.northStar,
      ...businessLogic.successMetrics.metrics.map((metric) => metric.name),
      ...businessLogic.priorityAssessment.topPriorities.slice(0, 2),
    ]),
    businessLogic.successMetrics.metrics.map((metric) => metric.name),
    [
      "Placeholder content should be replaced by the current executive scorecard and KPI definitions.",
      "Keep the section aligned to the commercial problem rather than the implementation checklist.",
    ],
  );

  const segmentation = buildSection(
    "segmentation",
    "Segmentation",
    "Turn the market into actionable customer and prospect groups.",
    "Translate the opportunity model's audience and segmentation inputs into the visible section structure.",
    uniqueStrings([
      ...opportunity.segmentation,
      ...opportunity.audience.customerSegments,
      ...businessLogic.priorityAssessment.topPriorities.slice(0, 2),
    ]),
    undefined,
    [
      "Placeholder segment labels should come from the Opportunity Model and be refined by logic outputs.",
    ],
  );

  const totalAddressableMarket = buildSection(
    "totalAddressableMarket",
    "Total Addressable Market",
    "Map the reachable market and whitespace opportunity.",
    "Use the TAM object and blueprint assumptions to explain the market shape.",
    uniqueStrings([
      opportunity.tam.marketDefinition,
      ...opportunity.tam.addressableUnits,
      ...opportunity.tam.assumptions,
    ]),
    undefined,
    [
      "This section still needs explicit numeric TAM inputs if the renderer should show counts, ranges, or maps.",
    ],
  );

  const audienceArchitecture = buildSection(
    "audienceArchitecture",
    "Audience Architecture",
    "Define account priority and persona-level messaging logic.",
    "Use customer segments, buying committee inputs, and priority assessment to define the audience structure.",
    uniqueStrings([
      ...opportunity.audience.customerSegments,
      ...opportunity.audience.buyingCommittee,
      ...opportunity.audience.personaNeeds,
      ...businessLogic.priorityAssessment.topPriorities.slice(0, 3),
    ]),
    undefined,
    [
      "Future versions should separate tiering, personas, and decision questions more explicitly if needed.",
    ],
  );

  const prospectFunnel = buildSection(
    "prospectFunnel",
    "Prospect Funnel",
    "Convert market opportunity into qualified pipeline stages.",
    "Turn journey inputs and recommendations into a simple funnel narrative.",
    uniqueStrings([
      ...opportunity.journey,
      ...opportunity.campaigns,
      ...businessLogic.recommendations.primary.slice(0, 2),
    ]),
    undefined,
    [
      "This section should stay focused on how the opportunity moves through the buying process.",
    ],
  );

  const signalIntelligence = buildSection(
    "signalIntelligence",
    "Signal Intelligence",
    "Surface the signals that should trigger action.",
    "Use the signals array and risk assessment to populate the signal view.",
    uniqueStrings([
      ...opportunity.signals,
      ...businessLogic.riskAssessment.risks.map((risk) => `${risk.area}: ${risk.description}`),
    ]),
    undefined,
    [
      "The renderer can later visualize signal categories, trigger points, and confidence levels.",
    ],
  );

  const commercialActivation = buildSection(
    "commercialActivation",
    "Commercial Activation",
    "Connect the strategy to channel economics, pipeline, and ROI.",
    "Use activation choices to show where spend creates revenue and where the return is strongest.",
    uniqueStrings([
      ...opportunity.campaigns,
      ...businessLogic.recommendations.primary,
      ...businessLogic.recommendations.secondary,
    ]),
    undefined,
    [
      "Commercial activation should remain tied to the commercial problem, not generic messaging.",
    ],
  );

  const salesMotion = buildSection(
    "salesMotion",
    "Sales Motion",
    "Align the strategy with a practical sales play.",
    "Use the sales motion input and implementation roadmap to describe execution.",
    uniqueStrings([
      ...opportunity.salesMotion,
      ...businessLogic.implementationRoadmap.phases.map((phase) => phase.goals[0] ?? phase.name),
    ]),
    undefined,
    [
      "Future logic can expand this into entry points, stakeholders, and exit criteria.",
    ],
  );

  const marketingSalesAlignment = buildSection(
    "marketingSalesAlignment",
    "M+S Alignment",
    "Define the shared operating rhythm across marketing and sales.",
    "Use measurement, priority sequencing, and implementation cadence to show alignment.",
    uniqueStrings([
      ...opportunity.measurement,
      ...businessLogic.priorityAssessment.sequencing,
      ...businessLogic.implementationRoadmap.phases.map((phase) => phase.dependencies.join(", ")),
    ]),
    businessLogic.successMetrics.metrics.map((metric) => `${metric.type}: ${metric.name}`),
    [
      "This section should later show owners, handoffs, and governance if the data exists.",
    ],
  );

  const returnToDashboard = buildSection(
    "returnToDashboard",
    "Return to Dashboard",
    "Summarize the strategy in an executive-facing inspection layer.",
    "Use recommendations, risks, and success metrics to create a leadership summary.",
    uniqueStrings([
      businessLogic.successMetrics.northStar,
      ...businessLogic.recommendations.primary,
      ...businessLogic.riskAssessment.risks.map((risk) => `${risk.area} (${risk.severity})`),
    ]),
    businessLogic.successMetrics.metrics.map((metric) => metric.name),
    [
      "The dashboard should remain a compact executive summary rather than a separate report format.",
    ],
  );

  return {
    schemaVersion: opportunity.schemaVersion,
    strategyId: `strategy-${opportunity.opportunityId}`,
    opportunityId: opportunity.opportunityId,
    blueprintId: opportunity.blueprintId,
    generatedAt: new Date().toISOString(),
    status: "draft",
    engagementType: opportunity.engagementType,
    title,
    subtitle,
    sourceOpportunity: opportunity,
    navigation: [
      {
        group: "FOUNDATION",
        sections: [
          { key: "kpiFoundation", label: "01. KPI Foundation" },
          { key: "segmentation", label: "02. Segmentation" },
          { key: "totalAddressableMarket", label: "03. Total Addressable Market" },
          { key: "audienceArchitecture", label: "04. Audience Architecture" },
        ],
      },
      {
        group: "EXECUTION",
        sections: [
          { key: "prospectFunnel", label: "05. Prospect Funnel" },
          { key: "signalIntelligence", label: "06. Signal Intelligence" },
          { key: "commercialActivation", label: "07. Commercial Activation" },
        ],
      },
      {
        group: "MEASUREMENT & SYSTEM",
        sections: [
          { key: "salesMotion", label: "08. Sales Motion" },
          { key: "marketingSalesAlignment", label: "09. M+S Alignment" },
          { key: "returnToDashboard", label: "10. Return to Dashboard" },
        ],
      },
    ],
    sections: {
      kpiFoundation,
      segmentation,
      totalAddressableMarket,
      audienceArchitecture,
      prospectFunnel,
      signalIntelligence,
      commercialActivation,
      salesMotion,
      marketingSalesAlignment,
      returnToDashboard,
    },
  };
}
