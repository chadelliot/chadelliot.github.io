import { z } from "zod";
import {
  ConfidenceSummary,
  confidenceSummarySchema,
  ConfidenceLevel,
  confidenceLevelSchema,
  EngagementType,
  engagementTypeSchema,
  SourceLink,
  sourceLinkSchema,
} from "./shared";
import { DiscoveryOutput, discoveryOutputSchema } from "./discovery";

export type IntelligenceStatus = "draft" | "reviewed" | "complete";

export interface IntelligenceInsight {
  label: string;
  statement: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  sourceLinks: SourceLink[];
  notes?: string;
}

export const intelligenceInsightSchema = z
  .object({
    label: z.string().min(1),
    statement: z.string().min(1),
    confidenceLevel: confidenceLevelSchema,
    confidenceScore: z.number().int().min(0).max(100),
    sourceLinks: z.array(sourceLinkSchema),
    notes: z.string().optional(),
  })
  .strict();

export interface CommercialIntelligence {
  schemaVersion: string;
  intelligenceId: string;
  discoveryId: string;
  intakeId: string;
  generatedAt: string;
  status: IntelligenceStatus;
  engagementType: EngagementType;
  company: DiscoveryOutput["company"];
  sourceLinks: SourceLink[];
  commercialPriorities: IntelligenceInsight[];
  executiveKpis: IntelligenceInsight[];
  customerSegments: IntelligenceInsight[];
  marketOpportunities: IntelligenceInsight[];
  revenueBottlenecks: IntelligenceInsight[];
  competitivePressures: IntelligenceInsight[];
  technologyGaps: IntelligenceInsight[];
  salesMarketingAlignmentNeeds: IntelligenceInsight[];
  risks: IntelligenceInsight[];
  assumptions: IntelligenceInsight[];
  recommendations: IntelligenceInsight[];
  confidenceSummary: ConfidenceSummary;
}

export const commercialIntelligenceSchema = z
  .object({
    schemaVersion: z.string().min(1),
    intelligenceId: z.string().min(1),
    discoveryId: z.string().min(1),
    intakeId: z.string().min(1),
    generatedAt: z.string().datetime(),
    status: z.enum(["draft", "reviewed", "complete"]),
    engagementType: engagementTypeSchema,
    company: discoveryOutputSchema.shape.company,
    sourceLinks: z.array(sourceLinkSchema),
    commercialPriorities: z.array(intelligenceInsightSchema),
    executiveKpis: z.array(intelligenceInsightSchema),
    customerSegments: z.array(intelligenceInsightSchema),
    marketOpportunities: z.array(intelligenceInsightSchema),
    revenueBottlenecks: z.array(intelligenceInsightSchema),
    competitivePressures: z.array(intelligenceInsightSchema),
    technologyGaps: z.array(intelligenceInsightSchema),
    salesMarketingAlignmentNeeds: z.array(intelligenceInsightSchema),
    risks: z.array(intelligenceInsightSchema),
    assumptions: z.array(intelligenceInsightSchema),
    recommendations: z.array(intelligenceInsightSchema),
    confidenceSummary: confidenceSummarySchema,
  })
  .strict();

