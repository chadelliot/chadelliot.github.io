# Commercial Strategy Framework

This document defines the lightweight architecture for publishing repeatable, personalized Commercial Strategy pages while preserving the existing AboutChad site and Commercial Strategy design.

The framework is content-driven. It is not a CMS, page builder, or broad React rewrite.

## Objective

Create a repeatable publishing system that turns a job description and company research into a personalized strategy page.

Target workflow:

```text
Job Description
Research
Company JSON
Existing Components Render
Publish
```

## Operating Principles

- Preserve the existing Commercial Strategy page almost exactly.
- Keep the current visual design and interactions.
- Use the approved Executive Strategy section sequence for future generated pages.
- Reuse existing components and CSS classes where practical.
- Make content generation the repeatable part of the system.
- Avoid broad React refactors until repeated content generation proves a real need.
- Keep the system compatible with GitHub Pages static publishing.

## What The Framework Is

The framework is a small set of conventions:

- a fixed content schema
- a repeatable research method
- a page generation workflow
- future validation for generated JSON
- a future renderer that maps company JSON into the current Commercial Strategy layout

The framework should make it possible to publish dozens of personalized pages by adding data, not duplicating page code.

## What The Framework Is Not

The framework should not become:

- a generic drag-and-drop page builder
- a headless CMS
- a complete design system rewrite
- a new routing architecture for the whole site
- a replacement for the current Commercial Strategy page
- a large abstraction layer around every visual component

## Canonical Template

The existing Commercial Strategy page is the canonical template.

Future personalized pages should inherit its:

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

Personalized pages should be represented as company JSON files that match `strategy-framework/content-schema.md`.

Section intent, required components, customizable content, and never-change elements are defined in `strategy-framework/methodology/page-sections.md`.

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

Company research should follow `strategy-framework/methodology/research-methodology.md`.

Before generating JSON, use `strategy-framework/methodology/research-checklist.md` to confirm the research is complete enough for the approved section sequence.

Page copy should follow `strategy-framework/methodology/writing-style.md`.

The research phase should produce enough context to personalize:

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

Page creation should follow `strategy-framework/methodology/page-generation-workflow.md`.

The preferred future model is:

1. Capture the target job description.
2. Research the company.
3. Produce a structured research brief.
4. Generate company JSON.
5. Validate the JSON.
6. Render through the existing Commercial Strategy experience.
7. Publish through GitHub Pages.

## Future Implementation Boundary

When implementation is approved, start with the smallest useful code path:

```text
public/executive-strategies/{company-slug}.json
        |
        v
lightweight route or loader
        |
        v
existing Commercial Strategy layout
```

The first implementation should not migrate every existing static work sample. It should prove that one personalized company JSON file can render correctly while the current `/commercial-strategy` page remains intact.

## Suggested Future File Shape

Implementation may eventually add:

```text
src/pages/ExecutiveStrategyPage.tsx
src/data/executive-strategies/schema.ts
src/data/executive-strategies/default-commercial.ts
src/data/executive-strategies/registry.ts
public/executive-strategies/example-company.json
scripts/validate-strategies.mjs
```

These files are suggestions, not current implementation requirements.

## Guardrails For Future Changes

Before changing React code:

- confirm which current Commercial Strategy behavior must be preserved
- identify the minimum content fields needed for the target page
- prefer passing data into existing sections over creating new layouts
- preserve the current `/commercial-strategy` route
- keep the first personalized route additive
- test direct navigation and refresh on GitHub Pages-style routes

Before adding new schema fields:

- confirm where the field renders
- confirm whether it is required or optional
- confirm whether existing company JSON files would need migration
- update schema documentation and validation together

## Success Criteria

The framework is working when a future page can be created by adding structured company content and performing a small, predictable publishing step.

Success looks like:

- no duplicated page code per company
- no manual copy/paste of the Commercial Strategy page
- company-specific recommendations feel credible
- existing design remains recognizable
- generated pages stay static and GitHub Pages friendly
- validation catches missing or malformed content before publish
