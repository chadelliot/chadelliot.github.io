# Intake Engine Workflow

The Intake Engine workflow converts raw opportunity inputs into a normalized intake object.

## Flow

```text
Opportunity Intake
  |
  v
Capture Raw Inputs
  |
  v
Normalize Intake
  |
  v
Validate Intake
  |
  v
Emit Normalized Intake Object
  |
  v
Discovery Engine
```

## Step 1: Capture Raw Inputs

Capture whatever is available:

- job description URL
- job description text
- company website
- company name
- recruiter information
- hiring manager
- notes

## Step 2: Normalize Intake

Normalize the raw inputs into:

- a stable company object
- a source object
- contact objects
- a plain-language intake summary
- a list of requested outputs
- a list of missing fields
- a list of follow-up questions
- a readiness status

## Step 3: Validate Intake

Check for:

- required fields
- valid URLs
- non-empty strings
- supported engagement types
- a clear next engine
- explicit gaps

## Step 4: Emit Normalized Intake Object

When the intake is ready, hand the object to Discovery.

Discovery should not need to re-parse raw notes or infer the basic shape of the engagement.

## Step 5: Route To Discovery

The output of the Intake Engine becomes the input to the Discovery Engine.

The discovery process should consume the normalized intake object and then produce source-backed findings and research priorities for Commercial Intelligence.

## Operational Rules

- Do not invent missing contacts.
- Do not invent company details.
- Do not infer strategy in the Intake Engine.
- Do not skip validation for the sake of speed.
- Keep unanswered questions visible.
