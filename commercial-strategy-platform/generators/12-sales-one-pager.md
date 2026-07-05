# 12 Sales One-Pager Generator

## Purpose

Generate a one-page sales or executive enablement artifact from the Opportunity Model.

## Primary Audience

- Executive Hire: hiring or executive audience needing a concise strategic snapshot
- Consulting Engagement: client sponsor or internal champion
- Agency Engagement: client buyer, account team, or sales stakeholder

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.primaryAudience`
- `company`
- `objectives`
- `commercialChallenges`
- `growthOpportunities`
- `audience`
- `segmentation`
- `personas`
- `signals`
- `campaigns`
- `salesMotion`
- `measurement`
- `competitiveLandscape`
- `recommendations`
- `assumptions`

## Optional Inputs

- one-pager objective
- target recipient
- offer or CTA
- proof points
- constraints
- preferred layout

## Dependencies

- Opportunity Model
- engagement type contract
- writing style guide

## Output Format

One-page structured artifact with headline, audience, problem, recommended motion, proof points, expected outcomes, and CTA.

## Writing Style

Sharp, skimmable, specific, and outcome-oriented. Use short sections and concrete labels.

## Validation Rules

- The generator does not perform research.
- The one-pager must fit on one page.
- It must not overload the reader with full strategy detail.
- It must include a clear audience and CTA.
- Engagement type determines the offer, proof, and call to action.

## Success Criteria

- The one-pager can support a conversation or decision.
- It makes the commercial value clear quickly.
- The recipient understands what to do next.
- The output is specific to the opportunity and grounded in the model.

## Example Output Structure

```text
Headline
Audience / context
Business problem
Recommended commercial motion
Key proof points
Expected outcomes
Measurement
CTA
```
