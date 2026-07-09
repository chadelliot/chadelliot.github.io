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

export type DiscoveryStatus = "draft" | "reviewed" | "complete";

export type DiscoveryFindingType =
  | "fact"
  | "inference"
  | "assumption"
  | "recommendation";

export interface DiscoveryFinding {
  findingId: string;
  statement: string;
  findingType: DiscoveryFindingType;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  evidence: string[];
  sourceLinks: SourceLink[];
  notes?: string;
  followUpQuestions?: string[];
  usedBy?: Array<"Commercial Intelligence" | "Opportunity Model">;
}

export const discoveryFindingSchema = z
  .object({
    findingId: z.string().min(1),
    statement: z.string().min(1),
    findingType: z.enum(["fact", "inference", "assumption", "recommendation"]),
    confidenceLevel: confidenceLevelSchema,
    confidenceScore: z.number().int().min(0).max(100),
    evidence: z.array(z.string().min(1)),
    sourceLinks: z.array(sourceLinkSchema),
    notes: z.string().optional(),
    followUpQuestions: z.array(z.string().min(1)).optional(),
    usedBy: z.array(z.enum(["Commercial Intelligence", "Opportunity Model"])).optional(),
  })
  .strict();

export interface DiscoveryResearchPlan {
  externalResearchNeeded: string[];
  internalResearchNeeded: string[];
  openQuestions: string[];
  priorityAreas?: string[];
}

export const discoveryResearchPlanSchema = z
  .object({
    externalResearchNeeded: z.array(z.string().min(1)),
    internalResearchNeeded: z.array(z.string().min(1)),
    openQuestions: z.array(z.string().min(1)),
    priorityAreas: z.array(z.string().min(1)).optional(),
  })
  .strict();

export interface DiscoveryFindings {
  companyOverview: DiscoveryFinding[];
  productsServices: DiscoveryFinding[];
  industry: DiscoveryFinding[];
  competitors: DiscoveryFinding[];
  customers: DiscoveryFinding[];
  businessModel: DiscoveryFinding[];
  revenueModel: DiscoveryFinding[];
  hiringContext: DiscoveryFinding[];
  marketingMaturity: DiscoveryFinding[];
  technologySignals: DiscoveryFinding[];
  growthSignals: DiscoveryFinding[];
  risks: DiscoveryFinding[];
}

export const discoveryFindingsSchema = z
  .object({
    companyOverview: z.array(discoveryFindingSchema),
    productsServices: z.array(discoveryFindingSchema),
    industry: z.array(discoveryFindingSchema),
    competitors: z.array(discoveryFindingSchema),
    customers: z.array(discoveryFindingSchema),
    businessModel: z.array(discoveryFindingSchema),
    revenueModel: z.array(discoveryFindingSchema),
    hiringContext: z.array(discoveryFindingSchema),
    marketingMaturity: z.array(discoveryFindingSchema),
    technologySignals: z.array(discoveryFindingSchema),
    growthSignals: z.array(discoveryFindingSchema),
    risks: z.array(discoveryFindingSchema),
  })
  .strict();

export interface DiscoveryOutput {
  schemaVersion: string;
  discoveryId: string;
  intakeId: string;
  generatedAt: string;
  status: DiscoveryStatus;
  engagementType: EngagementType;
  company: {
    name: string;
    website?: string;
    industry?: string;
    location?: string;
  };
  researchPlan: DiscoveryResearchPlan;
  findings: DiscoveryFindings;
  sourceLinks: SourceLink[];
  confidenceSummary: ConfidenceSummary;
}

export const discoveryOutputSchema = z
  .object({
    schemaVersion: z.string().min(1),
    discoveryId: z.string().min(1),
    intakeId: z.string().min(1),
    generatedAt: z.string().datetime(),
    status: z.enum(["draft", "reviewed", "complete"]),
    engagementType: engagementTypeSchema,
    company: z
      .object({
        name: z.string().min(1),
        website: z.string().url().optional(),
        industry: z.string().optional(),
        location: z.string().optional(),
      })
      .strict(),
    researchPlan: discoveryResearchPlanSchema,
    findings: discoveryFindingsSchema,
    sourceLinks: z.array(sourceLinkSchema),
    confidenceSummary: confidenceSummarySchema,
  })
  .strict();

