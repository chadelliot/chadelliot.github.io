# 01 Strategy Website Generator

## Purpose

Generate a website-style Commercial Strategy output using the existing Commercial Strategy page structure.

This generator must preserve the current 10-section Commercial Strategy structure:

```text
01 KPI Foundation
02 Segmentation
03 Total Addressable Market
04 Audience Architecture
05 Prospect Funnel
06 Signal Intelligence
07 Commercial Activation
08 Sales Motion
09 M+S Alignment
10 Return to Dashboard
```

## Primary Audience

- Executive Hire: hiring leader, executive team, recruiter
- Consulting Engagement: client executive sponsor and functional leaders
- Agency Engagement: client marketing or revenue leader and account stakeholders

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
- `role`
- `objectives`
- `commercialChallenges`
- `growthOpportunities`
- `audience`
- `segmentation`
- `tam`
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

- theme overrides
- route metadata
- custom page title
- output-specific summary copy
- approved source notes

## Dependencies

- `commercial-strategy-platform/opportunity-model/opportunity-model.md`
- `commercial-strategy-platform/content-schema.md`
- `commercial-strategy-platform/methodology/page-sections.md`
- `commercial-strategy-platform/methodology/writing-style.md`
- current Commercial Strategy visual and interaction pattern

## Output Format

Website/page content mapped to the existing Commercial Strategy stage layout.

## Writing Style

Use executive, direct, directional, data-driven, practical, confident, and curious language. Keep copy compact enough for cards, grids, metrics, and stage summaries.

## Validation Rules

- The output uses exactly 10 sections.
- Section labels and order match the canonical Commercial Strategy structure.
- The generator does not perform research.
- All generated content comes from the Opportunity Model or approved fallback defaults.
- The 10-section renderer view model is derived from the Opportunity Model.
- Engagement type changes audience framing, not the model shape.
- Chapter framing should answer how the business grows, not only how the marketing motion executes.
- Commercial Activation should surface channel economics, pipeline, revenue, and ROI when the source model supports those fields.
- Internal priorities or constraints are not stated as facts unless provided.

## Success Criteria

- The page preserves the current Commercial Strategy design.
- The content feels specific to the opportunity.
- The stage rail, progress model, and section structure remain intact.
- The output can be published statically.

## Example Output Structure

```text
Commercial Strategy Page
  Navigation
  Progress Bar
  Foundation
    01 KPI Foundation
    02 Segmentation
    03 Total Addressable Market
    04 Audience Architecture
  Execution
    05 Prospect Funnel
    06 Signal Intelligence
    07 Commercial Activation
  Measurement & System
    08 Sales Motion
    09 M+S Alignment
    10 Return to Dashboard
  Back / Next Controls
```
