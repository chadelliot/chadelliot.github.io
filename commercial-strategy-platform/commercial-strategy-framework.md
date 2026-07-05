# Commercial Strategy Platform

This document defines the lightweight architecture for producing repeatable Commercial Strategy outputs while preserving the existing AboutChad site and Commercial Strategy design.

The platform is content-driven. It is not a CMS, page builder, or broad React rewrite.

## Objective

Create a repeatable system that turns an Opportunity Intake and research into a Commercial Strategy Model, then uses an Output Generator or Renderer to produce the right artifact.

Target workflow:

```text
Opportunity Intake
Research
Commercial Strategy Model
Output Generator / Renderer
Publish
```

Supported outputs include:

- VP Marketing applications
- RevHub agency work
- Audaption consulting work
- proposals
- executive dashboards
- interview preparation
- cover letters
- LinkedIn/recruiter outreach

## Operating Principles

- Preserve the existing Commercial Strategy page almost exactly.
- Keep the current visual design and interactions.
- Use the canonical Commercial Strategy navigation for website and proposal-style outputs.
- Reuse existing components and CSS classes where practical.
- Make the Commercial Strategy Model the repeatable part of the system.
- Avoid broad React refactors until repeated content generation proves a real need.
- Keep the system compatible with GitHub Pages static publishing.

## What The Platform Is

The platform is a small set of conventions:

- a fixed Commercial Strategy Model schema
- a repeatable research method
- an Opportunity Intake workflow
- future validation for generated models
- future Output Generators or Renderers that map the model into websites, proposals, dashboards, interview materials, cover letters, or outreach

The platform should make it possible to create many strategic artifacts by changing structured content, not duplicating page code or rewriting strategy from scratch.

## What The Platform Is Not

The platform should not become:

- a generic drag-and-drop page builder
- a headless CMS
- a complete design system rewrite
- a new routing architecture for the whole site
- a replacement for the current Commercial Strategy page
- a large abstraction layer around every visual component

## Canonical Template

The existing Commercial Strategy page is the canonical visual template for website-style strategy outputs.

Future website and proposal-style outputs should inherit its:

- top navigation treatment
- chapter rail
- progress indicator
- Back and Next controls
- staged narrative interaction model
- card and grid styling
- TAM/map visual language
- persona, market, signal, campaign, sales, dashboard, measurement, and roadmap visual patterns

Changes should be driven by structured content unless a later implementation task explicitly approves a design change.

## Content Model

Commercial Strategy Models should match `commercial-strategy-platform/content-schema.md`.

Section intent, required components, customizable content, and never-change elements are defined in `commercial-strategy-platform/methodology/page-sections.md`.

The schema should follow the current Commercial Strategy navigation:

```text
FOUNDATION
01. KPI Foundation
02. Segmentation
03. Total Addressable Market
04. Audience Architecture

EXECUTION
05. Prospect Funnel
06. Signal Intelligence
07. Campaign Activation

MEASUREMENT & SYSTEM
08. Sales Motion
09. M+S Alignment
10. Return to Dashboard
```

This fixed structure keeps rendering simple and protects the current design from layout drift.

## Research Model

Opportunity research should follow `commercial-strategy-platform/methodology/research-methodology.md`.

Before generating the Commercial Strategy Model, use `commercial-strategy-platform/methodology/research-checklist.md` to confirm the research is complete enough for the canonical section contract and selected output targets.

Output copy should follow `commercial-strategy-platform/methodology/writing-style.md`.

The research phase should produce enough context to support the selected output:

- the company overview
- the industry and competitive context
- customer segments
- public leadership priorities
- recent acquisitions and financial performance
- existing marketing maturity and probable MarTech stack
- AI opportunities, risks, and growth opportunities
- the commercial objective
- buying committee
- total addressable market assumptions
- revenue intelligence
- customer journey
- demand signals
- campaign ideas
- sales plays
- executive dashboard metrics
- measurement cadence
- 12-24 month roadmap

Research should support practical strategy recommendations, not exhaustive diligence.

## Publishing Model

Output creation should follow `commercial-strategy-platform/methodology/page-generation-workflow.md`.

The preferred future model is:

1. Capture the Opportunity Intake.
2. Research the opportunity.
3. Produce a structured research brief.
4. Generate the Commercial Strategy Model.
5. Validate the model.
6. Send it through the appropriate Output Generator or Renderer.
7. Publish, export, or use the output.

## Future Implementation Boundary

When implementation is approved, start with the smallest useful code path:

```text
public/commercial-strategy-models/{opportunity-slug}.json
        |
        v
lightweight route, loader, or output generator
        |
        v
website, proposal, dashboard, interview, cover-letter, or outreach output
```

The first implementation should not migrate every existing static work sample. It should prove that one Commercial Strategy Model can render correctly while the current `/commercial-strategy` page remains intact.

## Suggested Future File Shape

Implementation may eventually add:

```text
src/pages/ExecutiveStrategyPage.tsx
src/data/commercial-strategy-platform/schema.ts
src/data/commercial-strategy-platform/default-commercial.ts
src/data/commercial-strategy-platform/registry.ts
public/commercial-strategy-models/example-opportunity.json
scripts/validate-strategies.mjs
```

These files are suggestions, not current implementation requirements.

## Guardrails For Future Changes

Before changing React code:

- confirm which current Commercial Strategy behavior must be preserved
- identify the minimum content fields needed for the target output
- prefer passing data into existing sections over creating new layouts
- preserve the current `/commercial-strategy` route
- keep the first generated route or output additive
- test direct navigation and refresh on GitHub Pages-style routes

Before adding new schema fields:

- confirm where the field renders
- confirm whether it is required or optional
- confirm whether existing Commercial Strategy Models would need migration
- update schema documentation and validation together

## Success Criteria

The platform is working when a future output can be created by adding structured opportunity content and performing a small, predictable generation step.

Success looks like:

- no duplicated page code per opportunity
- no manual copy/paste of the Commercial Strategy page
- opportunity-specific recommendations feel credible
- existing design remains recognizable
- website outputs stay static and GitHub Pages friendly
- validation catches missing or malformed content before publish
