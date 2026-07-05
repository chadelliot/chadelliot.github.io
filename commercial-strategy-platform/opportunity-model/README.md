# Opportunity Model

The Opportunity Model is the canonical source of truth for every Commercial Strategy Platform engagement.

The Intake Engine should normalize raw opportunity inputs before discovery begins. The Discovery Engine should identify what must be researched and gather the supporting evidence. Commercial Intelligence should interpret that material. The Opportunity Model should then capture the normalized strategy input. Every generator should consume that model. No generator should perform independent research.

## Purpose

The Opportunity Model turns opportunity intake, research, and Commercial Intelligence into structured commercial strategy data that can support many deliverables without duplicating research, strategy, or page code.

It is designed to support:

- Executive Hire
- Consulting Engagement
- Agency Engagement
- strategy websites
- proposals
- executive summaries
- statements of work
- discovery workshops
- presentations
- follow-up emails
- sales one-pagers
- cover letters
- resume alignment
- LinkedIn and recruiter outreach
- interview preparation

## Why The Opportunity Model Exists

The platform needs one structured model that can be reused across outputs.

Without this layer, each generator would be tempted to interpret research differently, ask for its own data shape, or repeat strategic work. The Opportunity Model prevents that by making research, assumptions, recommendations, commercial priorities, and audience logic explicit before output generation begins.

The model is intentionally practical. It captures enough structure to generate consistent executive-facing artifacts while avoiding a heavy CMS or full application rewrite.

## Architecture

```text
Opportunity Intake
  |
  v
Intake Engine
  |
  v
Discovery Engine
  |
  v
Commercial Intelligence
  |
  v
Opportunity Model
  |
  v
Generators
  |
  v
Deliverables
```

## Relationship To Discovery And Research

Discovery happens upstream of the Opportunity Model.

The Discovery Engine should identify the research scope, and supporting research should collect source material, identify public evidence, document assumptions, and clarify what is known versus inferred. That work should not create final deliverables directly.

Commercial Intelligence should interpret that source material before the Opportunity Model is written.

The final output is one Opportunity Model, built from discovery and supporting research, with enough traceability to support validation, writing, and generator-specific formatting.

## Relationship To Engagement Types

The platform supports exactly three engagement types:

1. Executive Hire
2. Consulting Engagement
3. Agency Engagement

The Opportunity Model stays consistent across all engagement types. The engagement type changes audience framing, required inputs, tone, scope, and deliverables. It does not create a separate model shape.

## Relationship To Generators

Generators consume the Opportunity Model and produce specific outputs.

Generators do not:

- perform independent research
- introduce unsupported claims
- change the model shape
- create a separate source of truth

Generators may:

- select the fields relevant to their output
- apply engagement-type framing
- use approved fallback defaults
- format the same strategy for a website, proposal, email, presentation, interview brief, or other deliverable

## Relationship To Publishing

Publishing happens after the Opportunity Model has been created, validated, and passed through a generator or renderer.

For website outputs, publishing should remain compatible with GitHub Pages static delivery. For non-website outputs, publishing may mean exporting, copying into a proposal workflow, preparing interview materials, or using generated outreach.

## Files

- `opportunity-model.md` documents the canonical model sections.
- `../commercial-intelligence/README.md` documents the interpretation layer.
- `company-model-template.json` provides a complete placeholder JSON template.
- `field-dictionary.md` documents every model field.
- `validation-rules.md` defines validation rules and missing-data handling.
