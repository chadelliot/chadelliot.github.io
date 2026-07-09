import { z } from "zod";
import {
  ConfidenceSummary,
  confidenceSummarySchema,
  Contact,
  contactSchema,
  EngagementType,
  engagementTypeSchema,
  SourceLink,
  sourceLinkSchema,
} from "./shared";
import { CommercialBlueprint, commercialBlueprintSchema } from "./commercial-blueprint";
import { CommercialIntelligence, commercialIntelligenceSchema } from "./commercial-intelligence";

export type OpportunityStatus = "draft" | "reviewed" | "complete";

export interface OpportunityAudience {
  customerSegments: string[];
  buyingCommittee: string[];
  personaNeeds: string[];
}

export const opportunityAudienceSchema = z
  .object({
    customerSegments: z.array(z.string().min(1)),
    buyingCommittee: z.array(z.string().min(1)),
    personaNeeds: z.array(z.string().min(1)),
  })
  .strict();

export interface OpportunityTAM {
  marketDefinition: string;
  addressableUnits: string[];
  assumptions: string[];
}

export const opportunityTAMSchema = z
  .object({
    marketDefinition: z.string().min(1),
    addressableUnits: z.array(z.string().min(1)),
    assumptions: z.array(z.string().min(1)),
  })
  .strict();

export interface OpportunityModel {
  schemaVersion: string;
  opportunityId: string;
  blueprintId: string;
  intelligenceId: string;
  intakeId: string;
  generatedAt: string;
  status: OpportunityStatus;
  engagementType: EngagementType;
  client: CommercialBlueprint["client"];
  sourceLinks: SourceLink[];
  role?: {
    title?: string;
    summary?: string;
  };
  objectives: string[];
  commercialChallenges: string[];
  growthOpportunities: string[];
  audience: OpportunityAudience;
  segmentation: string[];
  tam: OpportunityTAM;
  personas: string[];
  journey: string[];
  signals: string[];
  campaigns: string[];
  salesMotion: string[];
  measurement: string[];
  technology: string[];
  competitiveLandscape: string[];
  risks: string[];
  assumptions: string[];
  recommendations: string[];
  outputTargets: string[];
  blueprintSnapshot: CommercialBlueprint;
  intelligenceSnapshot: CommercialIntelligence;
  confidenceSummary: ConfidenceSummary;
  contacts?: {
    recruiterInformation?: Contact;
    hiringManager?: Contact;
  };
}

export const opportunityModelSchema = z
  .object({
    schemaVersion: z.string().min(1),
    opportunityId: z.string().min(1),
    blueprintId: z.string().min(1),
    intelligenceId: z.string().min(1),
    intakeId: z.string().min(1),
    generatedAt: z.string().datetime(),
    status: z.enum(["draft", "reviewed", "complete"]),
    engagementType: engagementTypeSchema,
    client: commercialBlueprintSchema.shape.client,
    sourceLinks: z.array(sourceLinkSchema),
    role: z
      .object({
        title: z.string().optional(),
        summary: z.string().optional(),
      })
      .strict()
      .optional(),
    objectives: z.array(z.string().min(1)),
    commercialChallenges: z.array(z.string().min(1)),
    growthOpportunities: z.array(z.string().min(1)),
    audience: opportunityAudienceSchema,
    segmentation: z.array(z.string().min(1)),
    tam: opportunityTAMSchema,
    personas: z.array(z.string().min(1)),
    journey: z.array(z.string().min(1)),
    signals: z.array(z.string().min(1)),
    campaigns: z.array(z.string().min(1)),
    salesMotion: z.array(z.string().min(1)),
    measurement: z.array(z.string().min(1)),
    technology: z.array(z.string().min(1)),
    competitiveLandscape: z.array(z.string().min(1)),
    risks: z.array(z.string().min(1)),
    assumptions: z.array(z.string().min(1)),
    recommendations: z.array(z.string().min(1)),
    outputTargets: z.array(z.string().min(1)),
    blueprintSnapshot: commercialBlueprintSchema,
    intelligenceSnapshot: commercialIntelligenceSchema,
    confidenceSummary: confidenceSummarySchema,
    contacts: z
      .object({
        recruiterInformation: contactSchema.optional(),
        hiringManager: contactSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

