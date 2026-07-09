import { z } from "zod";
import {
  ConfidenceSummary,
  confidenceSummarySchema,
  EngagementType,
  engagementTypeSchema,
  SourceLink,
  sourceLinkSchema,
} from "./shared";
import { CommercialIntelligence, commercialIntelligenceSchema } from "./commercial-intelligence";

export type BlueprintStatus = "draft" | "reviewed" | "complete";

export interface BlueprintAudienceArchitecture {
  primaryStakeholders: string[];
  secondaryStakeholders: string[];
  decisionQuestions: string[];
}

export const blueprintAudienceArchitectureSchema = z
  .object({
    primaryStakeholders: z.array(z.string().min(1)),
    secondaryStakeholders: z.array(z.string().min(1)),
    decisionQuestions: z.array(z.string().min(1)),
  })
  .strict();

export interface BlueprintOperatingModel {
  currentStateHypothesis: string;
  targetState: string;
  capabilities: string[];
  cadence: string[];
}

export const blueprintOperatingModelSchema = z
  .object({
    currentStateHypothesis: z.string().min(1),
    targetState: z.string().min(1),
    capabilities: z.array(z.string().min(1)),
    cadence: z.array(z.string().min(1)),
  })
  .strict();

export interface BlueprintMeasurementFramework {
  northStar: string;
  leadingIndicators: string[];
  laggingIndicators: string[];
  reviewCadence: string[];
}

export const blueprintMeasurementFrameworkSchema = z
  .object({
    northStar: z.string().min(1),
    leadingIndicators: z.array(z.string().min(1)),
    laggingIndicators: z.array(z.string().min(1)),
    reviewCadence: z.array(z.string().min(1)),
  })
  .strict();

export interface CommercialBlueprint {
  schemaVersion: string;
  blueprintId: string;
  intelligenceId: string;
  intakeId: string;
  generatedAt: string;
  status: BlueprintStatus;
  engagementType: EngagementType;
  client: CommercialIntelligence["company"];
  sourceLinks: SourceLink[];
  summary: string;
  businessObjectives: string[];
  audienceArchitecture: BlueprintAudienceArchitecture;
  marketOpportunity: string[];
  operatingModel: BlueprintOperatingModel;
  measurementFramework: BlueprintMeasurementFramework;
  roadmap: string[];
  risks: string[];
  assumptions: string[];
  recommendations: string[];
  confidenceSummary: ConfidenceSummary;
}

export const commercialBlueprintSchema = z
  .object({
    schemaVersion: z.string().min(1),
    blueprintId: z.string().min(1),
    intelligenceId: z.string().min(1),
    intakeId: z.string().min(1),
    generatedAt: z.string().datetime(),
    status: z.enum(["draft", "reviewed", "complete"]),
    engagementType: engagementTypeSchema,
    client: commercialIntelligenceSchema.shape.company,
    sourceLinks: z.array(sourceLinkSchema),
    summary: z.string().min(1),
    businessObjectives: z.array(z.string().min(1)),
    audienceArchitecture: blueprintAudienceArchitectureSchema,
    marketOpportunity: z.array(z.string().min(1)),
    operatingModel: blueprintOperatingModelSchema,
    measurementFramework: blueprintMeasurementFrameworkSchema,
    roadmap: z.array(z.string().min(1)),
    risks: z.array(z.string().min(1)),
    assumptions: z.array(z.string().min(1)),
    recommendations: z.array(z.string().min(1)),
    confidenceSummary: confidenceSummarySchema,
  })
  .strict();

