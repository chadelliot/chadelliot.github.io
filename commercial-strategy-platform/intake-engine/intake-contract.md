# Intake Contract

The Intake Contract defines the common intake object produced by the Intake Engine.

The contract normalizes every engagement into one shape before discovery begins.

## Supported Engagement Types

1. Executive Hire
2. Consulting Engagement
3. Agency Engagement

## Required Fields

The Intake Engine requires:

- `schemaVersion`
- `intakeId`
- `status`
- `engagementType`
- `company.name`
- `source`
- `normalized`
- `routing`

The `source` object must contain at least one of:

- `jobDescriptionUrl`
- `jobDescriptionText`
- `notes`

## Optional Fields

The following fields are optional:

- `company.website`
- `recruiterInformation`
- `hiringManager`
- `source.jobDescriptionUrl`
- `source.jobDescriptionText`
- `source.notes`
- `normalized.roleTitle`
- `normalized.primaryAudience`
- `normalized.decisionToSupport`
- `normalized.requestedOutputs`
- `normalized.sourceSummary`
- `normalized.missingInformation`
- `normalized.followUpQuestions`
- `normalized.confidence`

## Normalized Output

The Intake Engine should normalize raw inputs into:

- a stable `company` object
- a common `source` object
- named contact objects
- a concise `normalized` summary
- a discovery handoff in `routing`

## Common Intake Object

```json
{
  "schemaVersion": "1.0",
  "intakeId": "example-company-vp-marketing",
  "status": "ready-for-discovery",
  "engagementType": "executive-hire",
  "company": {
    "name": "Example Company",
    "website": "https://example.com"
  },
  "source": {
    "jobDescriptionUrl": "https://example.com/jobs/vp-marketing",
    "jobDescriptionText": "Placeholder source text.",
    "notes": [
      "Placeholder note."
    ]
  },
  "recruiterInformation": {
    "name": "Placeholder Recruiter"
  },
  "hiringManager": {
    "name": "Placeholder Hiring Manager"
  },
  "normalized": {
    "roleTitle": "VP Marketing",
    "primaryAudience": "Hiring leader and executive team",
    "decisionToSupport": "Whether the company wants to advance the candidate or client conversation.",
    "requestedOutputs": [
      "strategy-website",
      "cover-letter"
    ],
    "sourceSummary": "A short summary of the opportunity intake.",
    "missingInformation": [
      {
        "field": "company financial context",
        "reason": "Not present in the intake.",
        "impact": "Medium",
        "question": "What financial or growth context should the strategy assume?"
      }
    ],
    "followUpQuestions": [
      "What outcome matters most for this engagement?"
    ],
    "confidence": "medium"
  },
  "routing": {
    "nextEngine": "discovery",
    "handoffStatus": "ready"
  }
}
```
