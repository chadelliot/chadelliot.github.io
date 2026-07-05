# 04 Resume Alignment Generator

## Purpose

Generate resume alignment guidance that maps the Opportunity Model to resume positioning, bullets, and interview themes.

## Primary Audience

- Executive Hire: candidate and hiring stakeholders
- Consulting Engagement: consultant or advisor positioning for a client opportunity
- Agency Engagement: agency lead or team positioning for a client opportunity

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.intakeSummary`
- `company`
- `role`
- `objectives`
- `commercialChallenges`
- `growthOpportunities`
- `audience`
- `segmentation`
- `salesMotion`
- `measurement`
- `recommendations`
- `assumptions`

## Optional Inputs

- current resume
- role requirements
- selected accomplishments
- metrics from prior work
- preferred positioning themes

## Dependencies

- Opportunity Model
- engagement type contract
- writing style guide
- existing resume or background material when available

## Output Format

Resume alignment notes, suggested headline, summary positioning, accomplishment themes, and bullet rewrite guidance.

## Writing Style

Specific, evidence-oriented, commercially fluent, and concise. Avoid inventing accomplishments or metrics.

## Validation Rules

- The generator does not perform research.
- It does not invent experience, credentials, employers, or metrics.
- All suggested bullets must be grounded in supplied background or framed as placeholders.
- Engagement type determines whether the output is candidate, consultant, or agency-team positioning.

## Success Criteria

- Resume positioning aligns with the Opportunity Model.
- Suggested edits emphasize relevant business outcomes.
- Gaps and missing proof points are clear.
- No unsupported claims are introduced.

## Example Output Structure

```text
Positioning thesis
Resume headline options
Summary alignment
Priority accomplishment themes
Bullet rewrite guidance
Missing proof points
Interview bridge themes
```
