# Opportunity Model Contract

This document defines the canonical data model for Commercial Strategy Platform engagements.

The Opportunity Model is the only data object that generators should consume. Research produces the model once. Generators then format the model into deliverables.

## Model Rules

- One engagement produces one Opportunity Model.
- The model must include all required sections.
- Engagement type changes framing, required inputs, and deliverables, but not the model shape.
- Generators may read from the model, but should not research or invent missing facts.
- Assumptions must be labeled when internal priorities, financial details, or operating constraints are not publicly known.

## Top-Level Metadata

Purpose: Identify the model version, lifecycle state, and traceability information.

Required fields:

- `schemaVersion`
- `modelId`
- `createdAt`
- `updatedAt`
- `sourceStatus`

Optional fields:

- `notes`

Dependencies:

- Validation rules.
- Generator compatibility.
- Publishing workflow.

## Opportunity

Purpose: Define the engagement, audience, requested outputs, and decision the strategy needs to support.

Required fields:

- `opportunity.name`
- `opportunity.engagementType`
- `opportunity.stage`
- `opportunity.primaryAudience`
- `opportunity.outputTargets`
- `opportunity.decisionToSupport`
- `opportunity.intakeSummary`

Optional fields:

- `opportunity.owner`
- `opportunity.sourceUrls`

Dependencies:

- Engagement Types.
- Generator contracts.
- Research methodology.

## Company

Purpose: Capture the target organization, client, account, or employer context.

Required fields:

- `company.name`
- `company.website`
- `company.description`
- `company.headquarters`
- `company.size`
- `company.ownership`

Optional fields:

- `company.sourceNotes`

Dependencies:

- Research sources.
- Industry.
- Competitive Landscape.
- Business Model.

## Industry

Purpose: Define the market context shaping the opportunity.

Required fields:

- `industry.name`
- `industry.category`
- `industry.trends`
- `industry.marketDynamics`

Optional fields:

- `industry.regulatoryFactors`
- `industry.sourceNotes`

Dependencies:

- Company.
- Competitive Landscape.
- TAM.
- Risks.

## Business Model

Purpose: Describe how the organization creates revenue and how commercial motions should be designed.

Required fields:

- `businessModel.type`
- `businessModel.revenueStreams`
- `businessModel.pricingModel`
- `businessModel.salesMotion`

Optional fields:

- `businessModel.customerEconomics`
- `businessModel.sourceNotes`

Dependencies:

- Company.
- Industry.
- Sales Motion.
- Measurement.

## Role

Purpose: Capture the role, stakeholder, or mandate context relevant to the engagement.

Required fields:

- `role.title`
- `role.function`
- `role.seniority`
- `role.responsibilities`
- `role.successMetrics`

Optional fields:

- `role.stakeholders`
- `role.sourceNotes`

Dependencies:

- Opportunity.
- Objectives.
- Engagement Type.

## Objectives

Purpose: Define the business outcomes the strategy is designed to support.

Required fields:

- `objectives.primaryObjective`
- `objectives.businessOutcomes`
- `objectives.operatingPrinciples`

Optional fields:

- `objectives.validationQuestions`

Dependencies:

- Opportunity.
- Role.
- Measurement.
- Recommendations.

## Commercial Challenges

Purpose: Identify the barriers that may prevent the organization from achieving the objectives.

Required fields:

- `commercialChallenges[].name`
- `commercialChallenges[].description`
- `commercialChallenges[].impact`
- `commercialChallenges[].confidence`

Optional fields:

- `commercialChallenges[].evidence`

Dependencies:

- Research.
- Risks.
- Recommendations.

## Growth Opportunities

Purpose: Identify practical growth paths that the strategy can activate.

Required fields:

- `growthOpportunities[].name`
- `growthOpportunities[].description`
- `growthOpportunities[].impact`
- `growthOpportunities[].activationPath`
- `growthOpportunities[].confidence`

Optional fields:

- `growthOpportunities[].segment`

Dependencies:

- Objectives.
- Segmentation.
- Campaigns.
- Sales Motion.

## Audience

Purpose: Define the ideal customer, buyer groups, and buying committee logic.

Required fields:

- `audience.icp`
- `audience.customerSegmentsSummary`
- `audience.buyingCommittee`

Optional fields:

- `audience.notes`

Dependencies:

- Company.
- Industry.
- Segmentation.
- Personas.

## Segmentation

Purpose: Prioritize customer or market segments for activation.

Required fields:

- `segmentation.segments`

Optional fields:

- `segmentation.segmentLogic`
- `segmentation.exclusions`

Dependencies:

- Audience.
- TAM.
- Campaigns.
- Sales Motion.

## TAM

Purpose: Document total addressable market assumptions and relative opportunity sizing.

Required fields:

- `tam.headlineMetric`
- `tam.addressableAccounts`
- `tam.assumptions`
- `tam.marketSegments`

Optional fields:

- `tam.mapDots`
- `tam.sourceNotes`

Dependencies:

- Industry.
- Segmentation.
- Research sources.
- Strategy Website generator.

## Personas

Purpose: Represent the major decision makers, influencers, and users in the buying process.

Required fields:

- `personas[].role`
- `personas[].decisionLens`
- `personas[].jobToDo`
- `personas[].painPoints`
- `personas[].message`

Optional fields:

- `personas[].name`
- `personas[].triggers`
- `personas[].proofNeeded`

Dependencies:

- Audience.
- Journey.
- Campaigns.
- Sales Motion.

## Journey

Purpose: Map how buyers move from problem recognition to decision and expansion.

Required fields:

- `journey.stages`

Optional fields:

- `journey.frictionNotes`

Dependencies:

- Personas.
- Campaigns.
- Sales Motion.
- Measurement.

## Signals

Purpose: Define the behavioral, account, market, or operational signals that should trigger action.

Required fields:

- `signals.customerSignals`
- `signals.prospectSignals`

Optional fields:

- `signals.dataGaps`

Dependencies:

- Technology.
- Campaigns.
- Sales Motion.
- Measurement.

## Campaigns

Purpose: Translate segmentation, personas, and signals into practical activation plays.

Required fields:

- `campaigns[].name`
- `campaigns[].audience`
- `campaigns[].message`
- `campaigns[].channels`
- `campaigns[].offer`
- `campaigns[].successMetric`

Optional fields:

- `campaigns[].salesHandoff`

Dependencies:

- Growth Opportunities.
- Personas.
- Signals.
- Sales Motion.

## Sales Motion

Purpose: Define how sales, marketing, and account teams should act on the strategy.

Required fields:

- `salesMotion.plays`

Optional fields:

- `salesMotion.enablementNeeds`
- `salesMotion.constraints`

Dependencies:

- Campaigns.
- Signals.
- Measurement.
- Technology.

## Measurement

Purpose: Define the executive dashboard, review cadence, and operating metrics.

Required fields:

- `measurement.northStarMetric`
- `measurement.dashboardMetrics`
- `measurement.reviewCadence`

Optional fields:

- `measurement.reportingRisks`

Dependencies:

- Objectives.
- Sales Motion.
- Technology.
- Recommendations.

## Technology

Purpose: Document known or probable systems, data needs, automation opportunities, AI opportunities, and constraints.

Required fields:

- `technology.currentSignals`
- `technology.probableStack`
- `technology.dataNeeds`
- `technology.automationOpportunities`
- `technology.aiOpportunities`

Optional fields:

- `technology.constraints`

Dependencies:

- Research.
- Signals.
- Measurement.
- Recommendations.

## Competitive Landscape

Purpose: Capture external alternatives, market pressure, and differentiation opportunities.

Required fields:

- `competitiveLandscape.competitors`
- `competitiveLandscape.differentiators`
- `competitiveLandscape.threats`

Optional fields:

- `competitiveLandscape.sourceNotes`

Dependencies:

- Industry.
- Company.
- Risks.
- Recommendations.

## Risks

Purpose: Identify strategic, execution, data, market, or assumption risks that should be considered before activation.

Required fields:

- `risks[].name`
- `risks[].description`
- `risks[].likelihood`
- `risks[].impact`
- `risks[].mitigation`

Optional fields:

- `risks[].assumptionFlag`

Dependencies:

- Assumptions.
- Recommendations.
- Measurement.

## Assumptions

Purpose: Make unknowns explicit so the strategy does not pretend to know internal priorities or constraints.

Required fields:

- `assumptions[].id`
- `assumptions[].statement`
- `assumptions[].basis`
- `assumptions[].validationMethod`
- `assumptions[].status`

Optional fields:

- `assumptions[].owner`

Dependencies:

- Research.
- Risks.
- Discovery Workshop generator.
- Recommendations.

## Recommendations

Purpose: Convert the model into practical actions, priorities, and expected outcomes.

Required fields:

- `recommendations[].name`
- `recommendations[].rationale`
- `recommendations[].action`
- `recommendations[].stage`
- `recommendations[].priority`
- `recommendations[].expectedOutcome`
- `recommendations[].measure`

Optional fields:

- `recommendations[].dependencies`

Dependencies:

- Objectives.
- Challenges.
- Growth Opportunities.
- Measurement.
- Engagement Type.
