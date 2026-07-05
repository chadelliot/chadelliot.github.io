# Page Generation Workflow

This workflow describes how to create future Executive Strategy pages without duplicating page code.

The intended flow is:

```text
Job Description
Research
Company JSON
Existing Components Render
Publish
```

## Step 1: Capture The Job Description

Save the job description as source material.

Capture:

- company name
- role title
- location or remote status
- reporting line, if listed
- responsibilities
- success metrics
- required commercial capabilities
- language that hints at priorities or pain points

The job description should drive the strategic emphasis of the page.

## Step 2: Research The Company

Use `strategy-framework/methodology/research-methodology.md`.

Before drafting JSON, complete `strategy-framework/methodology/research-checklist.md`.

Produce a short research brief before drafting JSON. The brief should identify:

- company context
- role context
- company overview
- industry
- competitors
- customer segments
- public leadership priorities
- recent acquisitions
- financial performance
- existing marketing maturity
- probable MarTech stack
- AI opportunities
- risks
- growth opportunities
- business objectives
- audience architecture
- total addressable market assumptions
- revenue intelligence
- customer journey
- buying committee
- demand signals
- campaign themes
- sales motion
- executive dashboard metrics
- measurement plan
- 12-24 month roadmap
- assumptions to validate

## Step 3: Generate Company JSON

Create one JSON document that follows `strategy-framework/content-schema.md`.

Write page copy using `strategy-framework/methodology/writing-style.md`.

Use `strategy-framework/methodology/page-sections.md` to confirm each section has the right strategic purpose, required components, customizable content, and never-change elements.

Recommended future location:

```text
public/executive-strategies/{company-slug}.json
```

Use URL-safe lowercase slugs:

```text
example-company
acme-industrial
gainbridge
```

The JSON should fit the canonical Commercial Strategy navigation. Do not add new stages unless a future implementation explicitly supports them.

Canonical sequence:

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

## Step 4: Validate The JSON

Before publishing, validate that:

- required top-level fields exist
- company intelligence fields are included in source metadata where useful
- all fixed stages exist
- arrays contain enough content for the visual layout
- URLs are valid
- map coordinates are valid
- dashboard and measurement fields have clear owners or inspection cadence where applicable
- roadmap horizons are practical and ordered
- copy follows `strategy-framework/methodology/writing-style.md`
- no rendered strings are empty
- page copy is concise enough for the design

A future script may provide:

```text
npm run validate:strategies
```

Until that exists, review the JSON manually against the schema.

## Step 5: Render With Existing Components

The future renderer should:

- load company JSON by slug
- pass content into the existing Commercial Strategy stage layout
- preserve the current visual classes and page structure
- preserve the current navigation and interactions
- use fallback default content only where intentional

The renderer should not require a new component for every company.

## Step 6: Preview Locally

Run the local site and review the generated page.

Recommended checks:

- route loads directly
- refresh works
- top navigation remains intact
- stage rail works
- Back and Next controls work
- progress indicator updates
- responsive layout remains usable
- text fits within cards and panels
- SVG/map visuals render correctly
- no console errors

## Step 7: Publish

Commit:

- the company JSON
- any registry or manifest update
- any required validation fixture

Do not commit:

- `node_modules/`
- `dist/`
- `.DS_Store`
- `.claude/`
- local scratch files

GitHub Pages should publish the static build through the existing workflow.

## Future Implementation Phases

### Phase 1: Documentation And Guardrails

Add project guidance, schema documentation, research methodology, workflow documentation, and ignore rules.

No React changes.

### Phase 2: Data Contract

Add TypeScript schema types and a sample JSON file.

Keep the existing Commercial Strategy page unchanged.

### Phase 3: Lightweight Renderer

Add a new route that loads one company JSON file and renders it through the existing Commercial Strategy layout.

Preserve the existing `/commercial-strategy` page.

### Phase 4: Validation

Add a small validation script for all strategy JSON files.

The script should fail fast on missing fields, invalid URLs, invalid map coordinates, and empty rendered content.

### Phase 5: Scale Page Generation

Create additional company JSON files using the job description and research workflow.

Only refactor components when repeated page generation proves that the refactor will reduce real friction.
