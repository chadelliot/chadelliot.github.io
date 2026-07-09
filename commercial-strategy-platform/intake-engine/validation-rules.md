# Intake Engine Validation Rules

These rules define what the Intake Engine must check before handing a common intake object to Discovery.

## Required Validation

The intake object must include:

- `schemaVersion`
- `intakeId`
- `status`
- `engagementType`
- `company.name`
- `source`
- `normalized`
- `routing`

## Supported Values

### `engagementType`

Allowed values:

- `executive-hire`
- `consulting-engagement`
- `agency-engagement`

### `status`

Allowed values:

- `raw`
- `needs-review`
- `ready-for-discovery`

### `routing.nextEngine`

Allowed value:

- `discovery`

### `routing.handoffStatus`

Allowed values:

- `ready`
- `needs-review`

### `normalized.confidence`

Allowed values:

- `low`
- `medium`
- `high`

### `normalized.missingInformation[].impact`

Allowed values:

- `low`
- `medium`
- `high`

## Required Source Data

At least one of the following must be present:

- `source.jobDescriptionUrl`
- `source.jobDescriptionText`
- `source.notes[]`

## Normalization Rules

1. Normalize company names into `company.name`.
2. Normalize the primary URL into `company.website` when available.
3. Normalize the main source text into `source.jobDescriptionText`.
4. Normalize contact details into `recruiterInformation` and `hiringManager`.
5. Normalize the audience and requested outputs into `normalized`.
6. Convert gaps into `normalized.missingInformation`.
7. Convert follow-up questions into `normalized.followUpQuestions`.
8. Set `routing.nextEngine` to `discovery`.
9. Set `status` to `ready-for-discovery` only when the minimum fields are present.

## Error Handling

If required data is missing:

- preserve the intake object
- set `status` to `needs-review`
- set `routing.handoffStatus` to `needs-review`
- populate `normalized.missingInformation`
- populate `normalized.followUpQuestions`
- do not route the intake to Discovery as complete

## Missing Information Handling

Missing data should be handled explicitly rather than hidden.

Examples:

- If company website is missing, leave it blank and flag it for follow-up.
- If recruiter information is missing, do not invent it.
- If hiring manager is unknown, note the gap in `normalized.missingInformation`.
- If the source text is thin, keep the intake as `needs-review`.

## Validation Quality Gate

Before handing off to Discovery, confirm:

- the engagement type is valid
- the company name is present
- the source object is not empty
- the normalized summary is usable
- the missing information list is explicit
- the intake can be read without guessing the next step
