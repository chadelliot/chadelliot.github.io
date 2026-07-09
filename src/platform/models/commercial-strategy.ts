import { z } from "zod";
import { EngagementType, engagementTypeSchema } from "./shared";
import { OpportunityModel, opportunityModelSchema } from "./opportunity-model";

export type CommercialStrategyStatus = "draft" | "reviewed" | "complete";

export type CommercialStrategySectionKey =
  | "kpiFoundation"
  | "segmentation"
  | "totalAddressableMarket"
  | "audienceArchitecture"
  | "prospectFunnel"
  | "signalIntelligence"
  | "commercialActivation"
  | "salesMotion"
  | "marketingSalesAlignment"
  | "returnToDashboard";

export interface CommercialStrategySection {
  key: CommercialStrategySectionKey;
  title: string;
  purpose: string;
  summary: string;
  content: string[];
  metrics?: string[];
  notes?: string[];
}

export const commercialStrategySectionSchema = z
  .object({
    key: z.enum([
      "kpiFoundation",
      "segmentation",
      "totalAddressableMarket",
      "audienceArchitecture",
      "prospectFunnel",
      "signalIntelligence",
      "commercialActivation",
      "salesMotion",
      "marketingSalesAlignment",
      "returnToDashboard",
    ]),
    title: z.string().min(1),
    purpose: z.string().min(1),
    summary: z.string().min(1),
    content: z.array(z.string().min(1)),
    metrics: z.array(z.string().min(1)).optional(),
    notes: z.array(z.string().min(1)).optional(),
  })
  .strict();

export interface CommercialStrategy {
  schemaVersion: string;
  strategyId: string;
  opportunityId: string;
  blueprintId: string;
  generatedAt: string;
  status: CommercialStrategyStatus;
  engagementType: EngagementType;
  title: string;
  subtitle: string;
  sourceOpportunity: OpportunityModel;
  navigation: Array<{ group: string; sections: Array<{ key: CommercialStrategySectionKey; label: string }> }>;
  sections: Record<CommercialStrategySectionKey, CommercialStrategySection>;
}

export const commercialStrategySchema = z
  .object({
    schemaVersion: z.string().min(1),
    strategyId: z.string().min(1),
    opportunityId: z.string().min(1),
    blueprintId: z.string().min(1),
    generatedAt: z.string().datetime(),
    status: z.enum(["draft", "reviewed", "complete"]),
    engagementType: engagementTypeSchema,
    title: z.string().min(1),
    subtitle: z.string().min(1),
    sourceOpportunity: opportunityModelSchema,
    navigation: z.array(
      z
        .object({
          group: z.string().min(1),
          sections: z.array(
            z
              .object({
                key: z.enum([
                  "kpiFoundation",
                  "segmentation",
                  "totalAddressableMarket",
                  "audienceArchitecture",
                  "prospectFunnel",
                  "signalIntelligence",
                  "commercialActivation",
                  "salesMotion",
                  "marketingSalesAlignment",
                  "returnToDashboard",
                ]),
                label: z.string().min(1),
              })
              .strict(),
          ),
        })
        .strict(),
    ),
    sections: z.object({
      kpiFoundation: commercialStrategySectionSchema,
      segmentation: commercialStrategySectionSchema,
      totalAddressableMarket: commercialStrategySectionSchema,
      audienceArchitecture: commercialStrategySectionSchema,
      prospectFunnel: commercialStrategySectionSchema,
      signalIntelligence: commercialStrategySectionSchema,
      commercialActivation: commercialStrategySectionSchema,
      salesMotion: commercialStrategySectionSchema,
      marketingSalesAlignment: commercialStrategySectionSchema,
      returnToDashboard: commercialStrategySectionSchema,
    }),
  })
  .strict();
