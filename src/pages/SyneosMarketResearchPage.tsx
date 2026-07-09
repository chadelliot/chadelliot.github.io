import { CommercialStrategyRenderer } from "@/platform/renderers";
import { syneosMarketResearchStrategy } from "@/platform/engagements";

export default function SyneosMarketResearchPage() {
  return <CommercialStrategyRenderer strategy={syneosMarketResearchStrategy} />;
}

