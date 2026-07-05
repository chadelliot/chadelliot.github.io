# 10 Presentation Generator

## Purpose

Generate a presentation outline from the Opportunity Model.

## Primary Audience

- Executive Hire: hiring leader, executive panel, recruiter
- Consulting Engagement: executive sponsor, steering group, implementation stakeholders
- Agency Engagement: client marketing, revenue, or procurement stakeholders

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
- `audience`
- `segmentation`
- `tam`
- `personas`
- `journey`
- `campaigns`
- `salesMotion`
- `measurement`
- `risks`
- `assumptions`
- `recommendations`

## Optional Inputs

- target duration
- slide count
- meeting objective
- visual style preference
- speaker notes requirement
- decision or CTA

## Dependencies

- Opportunity Model
- engagement type contract
- page section contract
- writing style guide

## Output Format

Slide outline with slide titles, key message, support points, recommended visual, and speaker notes.

## Writing Style

Executive, concise, sequenced, and presentation-ready. Each slide should make one clear point.

## Validation Rules

- The generator does not perform research.
- Slide flow must follow a coherent narrative.
- Each slide must map to model content.
- Claims must be sourced, inferred, or framed as recommendations.
- Engagement type determines the presentation objective and depth.

## Success Criteria

- The deck can be built without rethinking the strategy.
- The audience can follow the commercial logic quickly.
- The presentation has a clear decision or next step.
- The outline avoids generic filler slides.

## Example Output Structure

```text
Slide 1: Title / thesis
Slide 2: Situation
Slide 3: Business objective
Slide 4: Market and audience architecture
Slide 5: Activation strategy
Slide 6: Sales motion
Slide 7: Measurement
Slide 8: Roadmap or next step
Appendix: assumptions and sources
```
