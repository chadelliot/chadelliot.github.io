# Opportunity Model Validation Rules

These rules define how to validate an Opportunity Model before it is passed to generators or published.

Validation should confirm that the model is structurally complete, factually disciplined, and suitable for the requested output targets. Generators should not repair missing research by performing new research.

## Required Fields

Every Opportunity Model must include:

- `schemaVersion`
- `modelId`
- `createdAt`
- `updatedAt`
- `sourceStatus`
- `opportunity`
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

Each section must include the required fields listed in `opportunity-model.md`.

## Allowed Values

### `sourceStatus`

Allowed values:

- `draft`
- `researched`
- `validated`
- `needs-review`

### `opportunity.engagementType`

Allowed values:

- `executive-hire`
- `consulting-engagement`
- `agency-engagement`

### `opportunity.stage`

Allowed values:

- `intake`
- `research`
- `model-ready`
- `generator-ready`
- `published`
- `archived`

### `opportunity.outputTargets`

Allowed values:

- `strategy-website`
- `cover-letter`
- `linkedin-outreach`
- `resume-alignment`
- `interview-preparation`
- `executive-summary`
- `proposal`
- `statement-of-work`
- `discovery-workshop`
- `presentation`
- `follow-up-email`
- `sales-one-pager`

### Confidence Fields

Allowed values for `commercialChallenges[].confidence` and `growthOpportunities[].confidence`:

- `low`
- `medium`
- `high`

### Priority Fields

Allowed values for `segmentation.segments[].priority` and `recommendations[].priority`:

- `low`
- `medium`
- `high`

### Risk Fields

Allowed values for `risks[].likelihood` and `risks[].impact`:

- `low`
- `medium`
- `high`

### Timing Fields

Allowed values for `recommendations[].stage`:

- `near-term`
- `mid-term`
- `long-term`
- `12-month`
- `24-month`

### Cadence Fields

Allowed values for `measurement.dashboardMetrics[].cadence` and `measurement.reviewCadence[].frequency`:

- `weekly`
- `monthly`
- `quarterly`
- `annually`
- `ad hoc`

### Assumption Status

Allowed values for `assumptions[].status`:

- `unvalidated`
- `partially-validated`
- `validated`
- `rejected`

### TAM Map Tone

Allowed values for `tam.mapDots[].tone`:

- `primary`
- `secondary`
- `accent`
- `muted`

## Date Formats

Date fields must use `YYYY-MM-DD`.

Required date fields:

- `createdAt`
- `updatedAt`

Placeholder templates may use `YYYY-MM-DD`, but production models must use real dates.

## URLs

URL fields must be valid absolute URLs.

URL fields:

- `opportunity.sourceUrls[]`
- `company.website`

Rules:

- URLs must start with `https://` unless there is a specific reason to use `http://`.
- URLs should not include tracking parameters unless the source requires them.
- Broken, private, or inaccessible URLs should be removed or documented in source notes.

## Arrays

Required arrays must exist and contain at least one item unless a validation exception is explicitly documented.

Required arrays include:

- `opportunity.outputTargets`
- `industry.trends`
- `industry.marketDynamics`
- `businessModel.revenueStreams`
- `role.responsibilities`
- `role.successMetrics`
- `objectives.businessOutcomes`
- `objectives.operatingPrinciples`
- `commercialChallenges`
- `growthOpportunities`
- `audience.buyingCommittee`
- `segmentation.segments`
- `tam.assumptions`
- `tam.marketSegments`
- `personas`
- `journey.stages`
- `signals.customerSignals`
- `signals.prospectSignals`
- `campaigns`
- `salesMotion.plays`
- `measurement.dashboardMetrics`
- `measurement.reviewCadence`
- `technology.currentSignals`
- `technology.probableStack`
- `technology.dataNeeds`
- `technology.automationOpportunities`
- `technology.aiOpportunities`
- `competitiveLandscape.competitors`
- `competitiveLandscape.differentiators`
- `competitiveLandscape.threats`
- `risks`
- `assumptions`
- `recommendations`

Optional arrays may be empty only when the absence of data is intentional.

## Numeric Ranges

`tam.mapDots[].x` and `tam.mapDots[].y` must be numbers from `0` through `100`.

These values are visual coordinates, not percentages of market share. They should be used only by renderers that need map-like positioning.

## Missing Data Handling

The platform should never pretend to know internal priorities, financial details, or operating constraints.

When information is missing:

- Use an assumption in `assumptions`.
- Add source confidence context to the relevant `sourceNotes` field.
- Phrase the generated output directionally.
- Avoid exact claims unless they are sourced.
- Use validation questions when an internal constraint must be learned later.

When required information is missing:

- Keep `sourceStatus` as `needs-review`.
- Do not mark `opportunity.stage` as `generator-ready`.
- Do not publish the output.

## Generator Validation

Before a generator runs:

- the Opportunity Model must exist
- `opportunity.outputTargets` must include the requested generator
- required fields for that generator must exist
- no generator should perform research
- no generator should introduce facts that are not in the model
- output tone must follow `commercial-strategy-platform/methodology/writing-style.md`

## Strategy Website Validation

When `strategy-website` is an output target, validate compatibility with the canonical Commercial Strategy section contract in `commercial-strategy-platform/methodology/page-sections.md`.

The generated website must preserve the existing 10-section structure:

1. KPI Foundation
2. Segmentation
3. Total Addressable Market
4. Audience Architecture
5. Prospect Funnel
6. Signal Intelligence
7. Commercial Activation
8. Sales Motion
9. M+S Alignment
10. Return to Dashboard

Renderer-specific fields may be derived from the Opportunity Model, but the renderer should not change the model shape or perform research.

## Publishing Validation

Before publishing or exporting:

- confirm the model validates
- confirm assumptions are visible where they materially affect recommendations
- confirm generated claims trace back to the model
- confirm requested deliverables match the engagement type
- confirm the output does not expose private notes unless intentionally included
- confirm website outputs remain GitHub Pages compatible
