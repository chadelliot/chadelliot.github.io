# 07 Proposal Generator

## Purpose

Generate a proposal from the Opportunity Model.

## Primary Audience

- Executive Hire: hiring team reviewing a strategic point of view
- Consulting Engagement: client executive sponsor and buying committee
- Agency Engagement: client marketing, revenue, or procurement stakeholders

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.primaryAudience`
- `opportunity.outputTargets`
- `company`
- `industry`
- `businessModel`
- `objectives`
- `commercialChallenges`
- `growthOpportunities`
- `audience`
- `segmentation`
- `personas`
- `journey`
- `signals`
- `campaigns`
- `salesMotion`
- `measurement`
- `technology`
- `competitiveLandscape`
- `risks`
- `assumptions`
- `recommendations`

## Optional Inputs

- scope boundaries
- pricing assumptions
- timeline
- team roles
- implementation constraints
- legal or procurement requirements

## Dependencies

- Opportunity Model
- engagement type contract
- page section contract when proposal uses website-style structure
- writing style guide

## Output Format

Proposal narrative with context, objectives, recommended approach, scope, deliverables, timeline, measurement, assumptions, and next step.

## Writing Style

Commercial, specific, practical, and buyer-oriented. Use clear recommendations and avoid generic capabilities language.

## Validation Rules

- The generator does not perform research.
- It does not invent scope, pricing, timeline, or team commitments.
- It distinguishes recommendations from assumptions.
- Engagement type determines proposal tone, level of implementation detail, and deliverables.
- The proposal ties execution to measurable outcomes.

## Success Criteria

- The buyer can see the business problem, recommended path, and expected value.
- Scope and assumptions are clear.
- The proposal can support a decision or next meeting.
- The output feels specific to the opportunity.

## Example Output Structure

```text
Executive context
Business objective
Current-state read
Recommended approach
Scope of work
Deliverables
Timeline
Measurement
Assumptions
Next step
```
