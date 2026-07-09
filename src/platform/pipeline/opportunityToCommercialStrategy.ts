import { CommercialStrategy, CommercialStrategySection } from "../models";
import { OpportunityModel } from "../models";

const buildSection = (
  key: CommercialStrategySection["key"],
  title: string,
  purpose: string,
  summary: string,
  content: string[],
): CommercialStrategySection => ({
  key,
  title,
  purpose,
  summary,
  content,
});

/**
 * TODO: Convert an Opportunity Model into the final Commercial Strategy representation by:
 * - mapping model content to the canonical 10-section Commercial Strategy structure
 * - preserving the current Commercial Strategy narrative order and readability
 * - allowing future renderers to reuse the same section model for the public page
 * - keeping the transformation deterministic and free of AI prompt logic
 * - leaving all page-specific layout and visual decisions to the renderer layer
 */
export function opportunityToCommercialStrategy(
  opportunity: OpportunityModel,
): CommercialStrategy {
  return {
    schemaVersion: opportunity.schemaVersion,
    strategyId: `strategy-${opportunity.opportunityId}`,
    opportunityId: opportunity.opportunityId,
    blueprintId: opportunity.blueprintId,
    generatedAt: new Date().toISOString(),
    status: "draft",
    engagementType: opportunity.engagementType,
    title: `${opportunity.client.name} Commercial Strategy`,
    subtitle: "Generated from the commercial blueprint and opportunity model.",
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
      kpiFoundation: buildSection(
        "kpiFoundation",
        "KPI Foundation",
        "Define the executive scoreboard that anchors the strategy.",
        "Translate objectives and measurement into a single opening frame.",
        opportunity.objectives,
      ),
      segmentation: buildSection(
        "segmentation",
        "Segmentation",
        "Turn the market into actionable customer and prospect groups.",
        "Carry forward the core segmentation logic from the opportunity model.",
        opportunity.segmentation,
      ),
      totalAddressableMarket: buildSection(
        "totalAddressableMarket",
        "Total Addressable Market",
        "Map the reachable market and whitespace opportunity.",
        "Use the TAM model and its assumptions to populate the market view.",
        opportunity.tam.addressableUnits,
      ),
      audienceArchitecture: buildSection(
        "audienceArchitecture",
        "Audience Architecture",
        "Define account priority and persona-level messaging logic.",
        "Connect buying committee framing to audience needs.",
        [...opportunity.audience.customerSegments, ...opportunity.audience.personaNeeds],
      ),
      prospectFunnel: buildSection(
        "prospectFunnel",
        "Prospect Funnel",
        "Convert market opportunity into qualified pipeline stages.",
        "Use journey and campaign inputs to outline the funnel logic.",
        [...opportunity.journey, ...opportunity.campaigns],
      ),
      signalIntelligence: buildSection(
        "signalIntelligence",
        "Signal Intelligence",
        "Surface the signals that should trigger action.",
        "Translate signal inputs into operational watchpoints.",
        opportunity.signals,
      ),
      commercialActivation: buildSection(
        "commercialActivation",
        "Commercial Activation",
        "Connect the strategy to practical activation economics.",
        "Keep activation ideas focused on channel return, pipeline, and revenue.",
        opportunity.campaigns,
      ),
      salesMotion: buildSection(
        "salesMotion",
        "Sales Motion",
        "Align the strategy with a practical sales play.",
        "Use the sales motion logic from the opportunity model.",
        opportunity.salesMotion,
      ),
      marketingSalesAlignment: buildSection(
        "marketingSalesAlignment",
        "M+S Alignment",
        "Define the shared operating rhythm across marketing and sales.",
        "Use the measurement and risk layers to frame alignment.",
        opportunity.measurement,
      ),
      returnToDashboard: buildSection(
        "returnToDashboard",
        "Return to Dashboard",
        "Summarize the strategy in an executive-facing inspection layer.",
        "Use recommendations and risks to create a leadership summary.",
        opportunity.recommendations,
      ),
    },
  };
}
