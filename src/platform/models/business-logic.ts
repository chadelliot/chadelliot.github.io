import { z } from "zod";
import { EngagementType, engagementTypeSchema } from "./shared";

export interface OpportunityScore {
  opportunityId: string;
  engagementType: EngagementType;
  overallScore: number;
  dimensions: {
    commercialFit: number;
    urgency: number;
    evidenceStrength: number;
    executionReadiness: number;
  };
  rationale: string[];
}

export const opportunityScoreSchema = z
  .object({
    opportunityId: z.string().min(1),
    engagementType: engagementTypeSchema,
    overallScore: z.number().int().min(0).max(100),
    dimensions: z
      .object({
        commercialFit: z.number().int().min(0).max(100),
        urgency: z.number().int().min(0).max(100),
        evidenceStrength: z.number().int().min(0).max(100),
        executionReadiness: z.number().int().min(0).max(100),
      })
      .strict(),
    rationale: z.array(z.string().min(1)),
  })
  .strict();

export interface Recommendations {
  opportunityId: string;
  engagementType: EngagementType;
  primary: string[];
  secondary: string[];
  notes: string[];
}

export const recommendationsSchema = z
  .object({
    opportunityId: z.string().min(1),
    engagementType: engagementTypeSchema,
    primary: z.array(z.string().min(1)),
    secondary: z.array(z.string().min(1)),
    notes: z.array(z.string().min(1)),
  })
  .strict();

export interface PriorityAssessment {
  opportunityId: string;
  engagementType: EngagementType;
  topPriorities: string[];
  sequencing: string[];
  rationale: string[];
}

export const priorityAssessmentSchema = z
  .object({
    opportunityId: z.string().min(1),
    engagementType: engagementTypeSchema,
    topPriorities: z.array(z.string().min(1)),
    sequencing: z.array(z.string().min(1)),
    rationale: z.array(z.string().min(1)),
  })
  .strict();

export interface RiskItem {
  area: string;
  severity: "low" | "medium" | "high";
  description: string;
  mitigation: string[];
}

export const riskItemSchema = z
  .object({
    area: z.string().min(1),
    severity: z.enum(["low", "medium", "high"]),
    description: z.string().min(1),
    mitigation: z.array(z.string().min(1)),
  })
  .strict();

export interface RiskAssessment {
  opportunityId: string;
  engagementType: EngagementType;
  risks: RiskItem[];
  summary: string;
}

export const riskAssessmentSchema = z
  .object({
    opportunityId: z.string().min(1),
    engagementType: engagementTypeSchema,
    risks: z.array(riskItemSchema),
    summary: z.string().min(1),
  })
  .strict();

export interface RoadmapPhase {
  name: string;
  duration: string;
  goals: string[];
  dependencies: string[];
}

export const roadmapPhaseSchema = z
  .object({
    name: z.string().min(1),
    duration: z.string().min(1),
    goals: z.array(z.string().min(1)),
    dependencies: z.array(z.string().min(1)),
  })
  .strict();

export interface ImplementationRoadmap {
  opportunityId: string;
  engagementType: EngagementType;
  summary: string;
  phases: RoadmapPhase[];
}

export const implementationRoadmapSchema = z
  .object({
    opportunityId: z.string().min(1),
    engagementType: engagementTypeSchema,
    summary: z.string().min(1),
    phases: z.array(roadmapPhaseSchema),
  })
  .strict();

export interface SuccessMetric {
  name: string;
  definition: string;
  type: "leading" | "lagging" | "guardrail";
}

export const successMetricSchema = z
  .object({
    name: z.string().min(1),
    definition: z.string().min(1),
    type: z.enum(["leading", "lagging", "guardrail"]),
  })
  .strict();

export interface SuccessMetrics {
  opportunityId: string;
  engagementType: EngagementType;
  northStar: string;
  metrics: SuccessMetric[];
}

export const successMetricsSchema = z
  .object({
    opportunityId: z.string().min(1),
    engagementType: engagementTypeSchema,
    northStar: z.string().min(1),
    metrics: z.array(successMetricSchema),
  })
  .strict();

export interface BusinessLogic {
  opportunityScore: OpportunityScore;
  recommendations: Recommendations;
  priorityAssessment: PriorityAssessment;
  riskAssessment: RiskAssessment;
  implementationRoadmap: ImplementationRoadmap;
  successMetrics: SuccessMetrics;
}

export const businessLogicSchema = z
  .object({
    opportunityScore: opportunityScoreSchema,
    recommendations: recommendationsSchema,
    priorityAssessment: priorityAssessmentSchema,
    riskAssessment: riskAssessmentSchema,
    implementationRoadmap: implementationRoadmapSchema,
    successMetrics: successMetricsSchema,
  })
  .strict();
