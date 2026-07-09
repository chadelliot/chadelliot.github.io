# 06 Executive Summary Generator

## Purpose

Generate a short executive summary that distills the Opportunity Model into a decision-ready narrative.

## Primary Audience

- Executive Hire: hiring leader or executive team
- Consulting Engagement: executive sponsor or steering group
- Agency Engagement: client sponsor or revenue leader

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.primaryAudience`
- `company`
- `industry`
- `businessModel`
- `objectives`
- `commercialChallenges`
- `growthOpportunities`
- `segmentation`
- `tam`
- `signals`
- `campaigns`
- `salesMotion`
- `measurement`
- `risks`
- `assumptions`
- `recommendations`

## Optional Inputs

- word count target
- decision context
- desired CTA
- executive sponsor notes
- risks to emphasize

## Dependencies

- Opportunity Model
- engagement type contract
- writing style guide

## Output Format

One-page or short narrative summary with objective, market read, recommended motion, measurement approach, and next step.

## Writing Style

Executive, concise, directional, data-driven, and practical. Avoid tactical detail unless it clarifies the recommendation.

## Validation Rules

- The generator does not perform research.
- It must fit the requested length.
- It must include assumptions or validation needs when internal constraints are unknown.
- It must preserve the commercial thesis from the model.
- Engagement type determines the decision frame.

## Success Criteria

- The audience can understand the strategy quickly.
- The summary is specific to the opportunity.
- It creates confidence without overstating evidence.
- It clearly explains the recommended next step.

## Example Output Structure

```text
Executive headline
Context
Commercial opportunity
Recommended strategy
Execution path
Measurement
Next step
```
