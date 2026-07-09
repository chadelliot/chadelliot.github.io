import { z } from "zod";

export const engagementTypeValues = [
  "Executive Hire",
  "Consulting Engagement",
  "Agency Engagement",
] as const;

export type EngagementType = (typeof engagementTypeValues)[number];

export const engagementTypeSchema = z.enum(engagementTypeValues);

export const confidenceLevelValues = ["low", "medium", "high"] as const;

export type ConfidenceLevel = (typeof confidenceLevelValues)[number];

export const confidenceLevelSchema = z.enum(confidenceLevelValues);

export interface SourceLink {
  label: string;
  url: string;
  type?: string;
  notes?: string;
}

export const sourceLinkSchema = z
  .object({
    label: z.string().min(1),
    url: z.string().url(),
    type: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

export interface Contact {
  name?: string;
  title?: string;
  email?: string;
  linkedinUrl?: string;
  notes?: string;
}

export const contactSchema = z
  .object({
    name: z.string().optional(),
    title: z.string().optional(),
    email: z.string().email().optional(),
    linkedinUrl: z.string().url().optional(),
    notes: z.string().optional(),
  })
  .strict();

export interface MissingInformation {
  field: string;
  reason: string;
  impact: "low" | "medium" | "high";
  question: string;
}

export const missingInformationSchema = z
  .object({
    field: z.string().min(1),
    reason: z.string().min(1),
    impact: z.enum(["low", "medium", "high"]),
    question: z.string().min(1),
  })
  .strict();

export interface ConfidenceSummary {
  overallLevel: ConfidenceLevel;
  overallScore: number;
  lowConfidenceAreas: string[];
}

export const confidenceSummarySchema = z
  .object({
    overallLevel: confidenceLevelSchema,
    overallScore: z.number().int().min(0).max(100),
    lowConfidenceAreas: z.array(z.string().min(1)),
  })
  .strict();

