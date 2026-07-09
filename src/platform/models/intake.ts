import { z } from "zod";
import {
  ConfidenceLevel,
  confidenceLevelSchema,
  Contact,
  contactSchema,
  EngagementType,
  engagementTypeSchema,
  MissingInformation,
  missingInformationSchema,
} from "./shared";

export type IntakeStatus = "raw" | "needs-review" | "ready-for-discovery";

export interface IntakeSource {
  jobDescriptionUrl?: string;
  jobDescriptionText?: string;
  notes?: string[];
}

export const intakeSourceSchema = z
  .object({
    jobDescriptionUrl: z.string().url().optional(),
    jobDescriptionText: z.string().min(1).optional(),
    notes: z.array(z.string().min(1)).min(1).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    const hasJobDescriptionUrl = Boolean(value.jobDescriptionUrl);
    const hasJobDescriptionText = Boolean(value.jobDescriptionText);
    const hasNotes = Boolean(value.notes && value.notes.length > 0);

    if (!hasJobDescriptionUrl && !hasJobDescriptionText && !hasNotes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Provide at least one intake source: job description URL, job description text, or notes.",
        path: [],
      });
    }
  });

export interface IntakeCompany {
  name: string;
  website?: string;
}

export const intakeCompanySchema = z
  .object({
    name: z.string().min(1),
    website: z.string().url().optional(),
  })
  .strict();

export interface IntakeNormalized {
  roleTitle?: string;
  primaryAudience: string;
  decisionToSupport?: string;
  requestedOutputs: string[];
  sourceSummary: string;
  missingInformation: MissingInformation[];
  followUpQuestions: string[];
  confidence: ConfidenceLevel;
}

export const intakeNormalizedSchema = z
  .object({
    roleTitle: z.string().optional(),
    primaryAudience: z.string().min(1),
    decisionToSupport: z.string().optional(),
    requestedOutputs: z.array(z.string().min(1)).min(1),
    sourceSummary: z.string().min(1),
    missingInformation: z.array(missingInformationSchema),
    followUpQuestions: z.array(z.string().min(1)),
    confidence: confidenceLevelSchema,
  })
  .strict();

export interface IntakeRouting {
  nextEngine: "discovery";
  handoffStatus: "ready" | "needs-review";
}

export const intakeRoutingSchema = z
  .object({
    nextEngine: z.literal("discovery"),
    handoffStatus: z.enum(["ready", "needs-review"]),
  })
  .strict();

export interface Intake {
  schemaVersion: string;
  intakeId: string;
  status: IntakeStatus;
  engagementType: EngagementType;
  company: IntakeCompany;
  source: IntakeSource;
  recruiterInformation?: Contact;
  hiringManager?: Contact;
  normalized: IntakeNormalized;
  routing: IntakeRouting;
}

export const intakeSchema = z
  .object({
    schemaVersion: z.string().min(1),
    intakeId: z.string().min(1),
    status: z.enum(["raw", "needs-review", "ready-for-discovery"]),
    engagementType: engagementTypeSchema,
    company: intakeCompanySchema,
    source: intakeSourceSchema,
    recruiterInformation: contactSchema.optional(),
    hiringManager: contactSchema.optional(),
    normalized: intakeNormalizedSchema,
    routing: intakeRoutingSchema,
  })
  .strict();

