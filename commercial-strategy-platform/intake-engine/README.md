# Intake Engine

The Intake Engine is the first normalized step in the Commercial Strategy Platform.

It turns raw opportunity inputs into one common intake object that can be handed to the Discovery Engine.

## Purpose

The Intake Engine exists so every engagement starts from the same structured intake, regardless of whether the work is an Executive Hire, Consulting Engagement, or Agency Engagement.

It normalizes:

- company identity
- source material
- recruiter or sponsor contacts
- hiring manager or decision-maker contacts
- notes
- missing information
- follow-up questions
- discovery readiness

## Architecture

```text
Opportunity Intake
  |
  v
Intake Engine
  |
  v
Normalized Intake Object
  |
  v
Discovery Engine
  |
  v
Commercial Intelligence
  |
  v
Opportunity Model
```

## What The Intake Engine Does

The Intake Engine:

- captures the raw inputs
- validates the minimum required fields
- normalizes the structure
- flags gaps and ambiguity
- routes the intake to Discovery

## What The Intake Engine Does Not Do

The Intake Engine does not:

- perform market research
- infer commercial priorities
- generate strategy
- write the Opportunity Model
- create deliverables

## Files

- `intake-contract.md` defines the canonical intake contract.
- `company-intake-schema.json` defines the JSON Schema for the intake object.
- `validation-rules.md` defines required fields, validation, normalization, and error handling.
- `workflow.md` documents the operational intake flow.
- `example-job-intake.json` shows a normalized Executive Hire intake.
- `example-consulting-intake.json` shows a normalized Consulting Engagement intake.
- `example-agency-intake.json` shows a normalized Agency Engagement intake.
