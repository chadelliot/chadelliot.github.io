# Validation Rules

These rules define how Discovery Engine output should be validated before Commercial Intelligence begins.

## Required Fields

- `schemaVersion` must exist and be `1.0.0`.
- `discoveryId` must exist.
- `intakeId` must exist.
- `generatedAt` must be a valid ISO 8601 date-time string.
- `status` must be one of `draft`, `reviewed`, or `complete`.
- `engagementType` must be one of the three supported engagement types.
- `company.name` must exist.
- `researchPlan.externalResearchNeeded` must exist.
- `researchPlan.internalResearchNeeded` must exist.
- `researchPlan.openQuestions` must exist.
- All canonical discovery area arrays must exist.
- `sourceLinks` must exist.
- `confidenceSummary.overallLevel` must exist.
- `confidenceSummary.overallScore` must exist.
- `confidenceSummary.lowConfidenceAreas` must exist.

## Allowed Values

- Engagement type:
  - `Executive Hire`
  - `Consulting Engagement`
  - `Agency Engagement`
- Finding type:
  - `fact`
  - `inference`
  - `assumption`
  - `recommendation`
- Confidence level:
  - `high`
  - `medium`
  - `low`
- Overall status:
  - `draft`
  - `reviewed`
  - `complete`

## Date Formats

- Use ISO 8601 for timestamps.
- Do not use locale-specific date strings in machine-readable fields.

## URL Rules

- Source URLs must be valid absolute URLs.
- Prefer canonical public URLs over redirected or shortened URLs.
- Do not include unsupported local paths in machine-readable source links.

## Array Rules

- Discovery area arrays may be empty only when the source set does not support a safe finding.
- Open questions should be an array, even if there is only one question.
- Source links should be an array, even if there is only one source.

## Numeric Rules

- `confidenceScore` must be an integer from 0 to 100.
- `overallScore` must be an integer from 0 to 100.
- Do not use percentages as strings.

## Confidence Rules

- High confidence requires direct evidence from strong sources.
- Medium confidence requires useful evidence but still leaves some interpretation.
- Low confidence is acceptable when evidence is thin or contradictory.
- If a finding is low confidence, the reason should be visible in notes or follow-up questions.
- A strong statement without source support should not be marked high confidence.

## Missing Information Handling

- If a discovery area cannot be supported, leave the finding open and lower confidence.
- If the intake is missing a key input, call it out in `researchPlan.openQuestions`.
- Do not fabricate competitors, customers, or technology details.
- Do not compress uncertainty into a false fact.

## Validation Checks

- Verify every discovery area is represented.
- Verify each finding has a statement, finding type, confidence level, confidence score, evidence, and source links.
- Verify source links are unique enough to trace the claim.
- Verify low-confidence areas are listed in the summary.
- Verify the output is ready for Commercial Intelligence, not final deliverables.
