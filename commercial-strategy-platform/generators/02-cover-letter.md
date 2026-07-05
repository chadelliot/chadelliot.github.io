# 02 Cover Letter Generator

## Purpose

Generate a concise cover letter that translates the Opportunity Model into a role, client, or opportunity-specific narrative.

## Primary Audience

- Executive Hire: hiring leader or recruiter
- Consulting Engagement: client sponsor or decision-maker
- Agency Engagement: marketing or revenue leader evaluating fit

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.primaryAudience`
- `opportunity.intakeSummary`
- `opportunity.decisionToSupport`
- `company.name`
- `company.description`
- `role`
- `objectives`
- `growthOpportunities`
- `audience`
- `personas`
- `campaigns`
- `salesMotion`
- `measurement.northStarMetric`
- `recommendations`
- `assumptions`

## Optional Inputs

- role title
- recruiter or stakeholder name
- prior conversation notes
- resume positioning
- preferred call to action

## Dependencies

- Opportunity Model
- engagement type contract
- writing style guide

## Output Format

Short letter format with greeting, focused opening, strategic fit proof, practical value, and clear close.

## Writing Style

Direct, executive, specific, and measured. Avoid generic enthusiasm and unsupported claims.

## Validation Rules

- The generator does not perform research.
- The letter is based on existing model inputs.
- The letter does not exceed a practical executive-read length.
- The engagement type controls tone and framing.
- The letter does not pretend to know internal priorities.

## Success Criteria

- The letter feels specific to the opportunity.
- It connects the model to the audience's likely decision.
- It creates a credible reason to continue the conversation.
- It does not sound like a generic application or pitch.

## Example Output Structure

```text
Greeting
Opening relevance
Commercial strategy thesis
Evidence of fit
Practical next-step value
Close / call to action
```
