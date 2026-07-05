# Agent Guidance

This repository is the AboutChad GitHub Pages site. Treat it as a production personal site with existing public URLs, static work samples, and a Vite/React application.

## Current Priority

The approved direction is to create a lightweight, repeatable Commercial Strategy Platform.

Optimize for:

- preserving the existing Commercial Strategy page and visual design
- generating many reusable strategy, proposal, dashboard, application, and outreach outputs from structured content
- minimizing React refactoring
- keeping future output creation fast
- maintaining GitHub Pages compatibility

Do not start with a large component or styling rewrite.

## Guardrails

- Do not refactor the React app unless the user explicitly asks for implementation work.
- Do not change `src/pages/CommercialStrategyPage.tsx` unless the user explicitly approves that step.
- Do not change the current Commercial Strategy design, route, interactions, or copy as part of documentation-only work.
- Prefer content-driven additions over new abstractions.
- Preserve existing routes and public static pages unless the user approves migration or removal.
- Keep changes scoped and reversible.
- Avoid touching generated output such as `dist/`.

## Preferred Architecture Direction

Future implementation should follow this workflow:

```text
Opportunity Intake
Research
Commercial Strategy Model
Output Generator / Renderer
Publish
```

The Commercial Strategy page should become the reference template for website-style strategy outputs. Other outputs should reuse the same Commercial Strategy Model where practical, including proposals, executive dashboards, interview preparation, cover letters, and LinkedIn/recruiter outreach.

## Supported Use Cases

The platform should support:

- VP Marketing applications
- RevHub agency work
- Audaption consulting work
- proposals
- executive dashboards
- interview preparation
- cover letters
- LinkedIn/recruiter outreach

## Canonical Commercial Strategy Navigation

Future generated strategy pages should use the current Commercial Strategy left-side navigation:

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

## Documentation Map

- `PROJECT_CONTEXT.md` explains the current repository architecture and implementation direction.
- `commercial-strategy-platform/commercial-strategy-framework.md` explains the lightweight platform.
- `commercial-strategy-platform/methodology/page-sections.md` defines the canonical Commercial Strategy section contract for generated website and proposal-style outputs.
- `commercial-strategy-platform/content-schema.md` defines the intended Commercial Strategy Model contract.
- `commercial-strategy-platform/methodology/research-methodology.md` defines how opportunity-specific strategy inputs should be researched.
- `commercial-strategy-platform/methodology/research-checklist.md` defines the pre-generation research completeness checklist.
- `commercial-strategy-platform/methodology/writing-style.md` defines the copy style for generated strategy outputs.
- `commercial-strategy-platform/methodology/page-generation-workflow.md` defines the repeatable publishing process.

## Development Notes

- This is a Vite, React, TypeScript, Tailwind, and GitHub Pages project.
- The production site uses GitHub Pages workflows.
- The app currently mixes React pages with static HTML pages in `public/`.
- The current Commercial Strategy experience exists both as a React page and as a static page under `public/commercial-strategy/`.
- Use existing styles, class names, and layout patterns when practical.
- Add validation before scaling content generation.

## Repo Hygiene

Ignore local and generated artifacts:

- `.DS_Store`
- `node_modules/`
- `dist/`
- `.claude/`

Do not commit local machine files, dependency installs, generated build output, or assistant scratch state.
