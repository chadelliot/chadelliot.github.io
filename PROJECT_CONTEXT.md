# Project Context

## Repository Purpose

This repository powers the AboutChad GitHub Pages site. It combines a Vite/React application with static HTML work samples and assets served directly from `public/` and `assets/`.

The site includes personal positioning pages, company-specific proposal pages, and interactive commercial strategy work samples.

## Current Architecture

The application uses:

- Vite
- React
- TypeScript
- React Router
- Tailwind CSS
- shadcn/Radix-style UI components
- GitHub Pages deployment

The React entrypoint is `src/main.tsx`. The main router lives in `src/App.tsx`.

The repository also contains standalone static pages in `public/`, including Commercial Strategy and related strategy examples. These static pages duplicate some layout, styling, and interaction patterns outside the React app.

## Important Existing Surfaces

Key public surfaces include:

- `/`
- `/approach`
- `/career`
- `/skills`
- `/contact`
- `/commercial-strategy`
- `/company`
- `/company/:slug`
- static work sample directories under `public/`

The current Commercial Strategy page is a high-value design reference and should be preserved unless a later task explicitly authorizes changes.

## Commercial Strategy Page Status

The Commercial Strategy experience currently has:

- a chapter-based strategy flow
- a fixed top navigation treatment
- a left stage rail
- progress indication
- Back and Next controls
- KPI, segmentation, TAM, audience, funnel, signal, campaign, sales, alignment, and dashboard sections
- custom CSS and SVG-heavy visuals
- current interactions that should be maintained

The short-term strategy is not to redesign this page. It should become the canonical template for future personalized Executive Strategy pages.

## Approved Direction

The project direction is to create a lightweight Executive Strategy publishing system:

```text
Job Description
Research
Company JSON
Existing Components Render
Publish
```

This should prioritize speed of page creation over maximum abstraction.

## Architecture Principle

Standardize the content first. Do not over-standardize the application.

The right near-term architecture is:

- one familiar visual strategy template
- one content schema that mirrors the template
- many company-specific JSON files
- one renderer that maps JSON into the existing design
- lightweight validation before publishing

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

## What Future Implementation Should Avoid

Avoid:

- large React rewrites
- generic page-builder abstractions
- a CMS
- broad CSS reorganization
- changing the Commercial Strategy design before data-driving it
- removing static pages before React parity exists
- introducing complex runtime dependencies for content loading

## GitHub Pages Considerations

The site must continue to work as a static GitHub Pages deployment.

Future implementation should:

- preserve existing public URLs
- support browser refreshes on deep links
- keep generated company content static and cacheable
- avoid server-only assumptions
- ensure any custom domain file is included in the deployed artifact if required

## Suggested Future File Direction

A later implementation may add files similar to:

```text
src/pages/ExecutiveStrategyPage.tsx
src/data/executive-strategies/schema.ts
src/data/executive-strategies/default-commercial.ts
src/data/executive-strategies/registry.ts
public/executive-strategies/example-company.json
scripts/validate-strategies.mjs
```

These files should be added only when the user approves implementation.
