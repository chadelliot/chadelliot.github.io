# Commercial Strategy Platform

This document defines the lightweight architecture for producing repeatable Commercial Strategy outputs while preserving the existing AboutChad site and Commercial Strategy design.

The platform is content-driven. It is not a CMS, page builder, or broad React rewrite.

Chapter quality rule for website-style outputs: every chapter should answer, "What would this look like if we had already built it?"

## Objective

Create a repeatable system that turns an Opportunity Intake into a normalized intake object, then into discovery, Commercial Intelligence, and an Opportunity Model, then uses generators to produce deliverables.

Target workflow:

```text
Opportunity Intake
Intake Engine
Discovery Engine
Commercial Intelligence
Opportunity Model
Engagement Type
Generators
Deliverables
```

The platform supports exactly three engagement types:

1. Executive Hire
2. Consulting Engagement
3. Agency Engagement

The Opportunity Model stays consistent across engagement types. The engagement type determines audience framing, required inputs, and deliverables. See `commercial-strategy-platform/engagement-types/README.md`.

Common deliverables include:

- VP Marketing application materials
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
- Preserve the three rail headers exactly: `FOUNDATION`, `EXECUTION`, and `MEASUREMENT & SYSTEM`.
- Keep content rhythm concise and template-like.
- Size grids to actual content rather than forcing empty placeholder cards.
- Reuse existing components and CSS classes where practical.
- Make the Opportunity Model the repeatable part of the system.
- Frame each chapter as an executive decision: where to invest, which segments to prioritize, which channels deserve budget, which accounts can grow, where pipeline is slowing, and what to stop doing.
- Use financial operating model language where it fits: CAC, LTV, gross margin, EBITDA contribution, payback period, pipeline coverage, revenue mix, market share, and expansion revenue.
- Treat the commercial operating system as: Market → Signals → Commercial Intelligence → Marketing → Sales → Customer Success → Revenue → Executive Dashboard.
- Avoid broad React refactors until repeated content generation proves a real need.
- Keep the system compatible with GitHub Pages static publishing.

## What The Platform Is

The platform is a small set of conventions:

- a fixed Opportunity Model schema
- an Intake Engine that normalizes raw opportunity inputs
- a Discovery Engine that identifies the research needed and collects evidence
- a repeatable research method
- a Commercial Intelligence layer that interprets discovery output and research before the model is written
- an Opportunity Intake and Intake Engine workflow
- exactly three engagement type contracts
- a documented generator layer
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
- persona, market, signal, commercial activation, sales, dashboard, measurement, and roadmap visual patterns

Changes should be driven by structured content unless a later implementation task explicitly approves a design change.

## Content Model

Opportunity Models should match `commercial-strategy-platform/opportunity-model/opportunity-model.md`.

The complete placeholder template lives at `commercial-strategy-platform/opportunity-model/company-model-template.json`, field definitions live in `commercial-strategy-platform/opportunity-model/field-dictionary.md`, and validation rules live in `commercial-strategy-platform/opportunity-model/validation-rules.md`.

`commercial-strategy-platform/content-schema.md` is renderer-facing documentation for mapping the Opportunity Model into the existing Commercial Strategy website structure.

Section intent, required components, customizable content, and never-change elements are defined in `commercial-strategy-platform/methodology/page-sections.md`.
That file is the canonical contract for future page generation.

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
07. Commercial Activation

MEASUREMENT & SYSTEM
08. Sales Motion
09. M+S Alignment
10. Return to Dashboard
```

This fixed structure keeps rendering simple and protects the current design from layout drift.

## Research Model

Opportunity research should follow `commercial-strategy-platform/methodology/research-methodology.md`.

The Intake Engine should follow `commercial-strategy-platform/intake-engine/README.md` and its supporting docs.

Discovery should follow `commercial-strategy-platform/discovery-engine/README.md` and its supporting docs.

Commercial Intelligence should follow `commercial-strategy-platform/commercial-intelligence/README.md` and its supporting docs.

Before generating Commercial Intelligence and the Opportunity Model, use `commercial-strategy-platform/methodology/research-checklist.md` to confirm the intake normalization, discovery, and research are complete enough for the canonical section contract and selected output targets.

Output copy should follow `commercial-strategy-platform/methodology/writing-style.md`.

The Intake Engine normalizes raw opportunity inputs. Discovery identifies what should be researched and creates the evidence map. Research produces evidence and observations. Commercial Intelligence turns that into strategic interpretation. The Opportunity Model then captures the normalized output for generators and renderers.

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
- commercial activation scenarios
- sales plays
- executive dashboard metrics
- measurement cadence
- 12-24 month roadmap

Research should support practical strategy recommendations, not exhaustive diligence.

## Generator Model

Generators are documented in `commercial-strategy-platform/generators/README.md`.

Every generator consumes the same Opportunity Model. Generators do not perform research. Research happens once upstream, before the model is generated.

The engagement type changes tone, scope, audience framing, and deliverables. It does not change the underlying Opportunity Model.

Current generators:

- Strategy Website
- Cover Letter
- LinkedIn Outreach
- Resume Alignment
- Interview Preparation
- Executive Summary
- Proposal
- Statement Of Work
- Discovery Workshop
- Presentation
- Follow-Up Email
- Sales One-Pager

## Publishing Model

Output creation should follow `commercial-strategy-platform/methodology/page-generation-workflow.md`.

The preferred future model is:

1. Capture the Opportunity Intake.
2. Run the Intake Engine.
3. Run the Discovery Engine.
4. Research the opportunity.
5. Produce a structured discovery and research brief.
6. Build Commercial Intelligence.
7. Generate the Opportunity Model.
8. Validate the model.
9. Send it through the appropriate Output Generator or Renderer.
10. Publish, export, or use the output.

## Engagement Workspaces

Real client or prospect engagements should live under `commercial-strategy-platform/engagements/{engagement-slug}/`.

Each workspace should use this local flow:

```text
Client Brief
Commercial Discovery
Commercial Intelligence
Commercial Strategy Model
Generators
Deliverables
```

The workspace should keep the source posting, discovery notes, strategy model, generator plan, and deliverable definitions together so future output generation stays fast and traceable.

## Future Implementation Boundary

When implementation is approved, start with the smallest useful code path:

```text
public/opportunity-models/{opportunity-slug}.json
        |
        v
lightweight route, loader, or output generator
        |
        v
website, proposal, dashboard, interview, cover-letter, or outreach output
```

The first implementation should not migrate every existing static work sample. It should prove that one Opportunity Model can render correctly while the current `/commercial-strategy` page remains intact.

## Suggested Future File Shape

Implementation may eventually add:

```text
src/pages/ExecutiveStrategyPage.tsx
src/data/commercial-strategy-platform/schema.ts
src/data/commercial-strategy-platform/default-commercial.ts
src/data/commercial-strategy-platform/registry.ts
public/opportunity-models/example-opportunity.json
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
- confirm whether existing Opportunity Models would need migration
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
