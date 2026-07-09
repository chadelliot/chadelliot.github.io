# Business Logic

## Purpose

The Business Logic layer sits between the Opportunity Model and all future Deliverables.

It converts a modeled engagement into reusable analytical outputs that generators and renderers can consume without embedding business rules in presentation code.

## Pipeline Position

```text
Intake
  |
  v
Discovery
  |
  v
Commercial Intelligence
  |
  v
Commercial Blueprint
  |
  v
Opportunity Model
  |
  v
Business Logic
  |
  v
Generators
  |
  v
Renderers
```

## What This Layer Does

This layer should:

- score the opportunity
- rank recommendations
- assess priorities
- assess risk
- outline an implementation roadmap
- define success metrics

## What This Layer Does Not Do

This layer does not:

- perform research
- generate AI prompts
- render pages
- write UI copy
- bind to routes or React components

## Reuse Across Engagement Types

This layer should remain reusable across Executive Hire, Consulting Engagement, and Agency Engagement work.

The upstream model determines the context. The business logic layer turns that context into operational outputs that can be reused by proposals, statements of work, executive briefs, commercial strategy pages, interview prep, cover letters, and other deliverables.
