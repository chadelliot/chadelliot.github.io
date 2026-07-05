# Output Generation Workflow

This workflow describes how to create future Commercial Strategy Platform outputs without duplicating strategy work or page code.

The intended flow is:

```text
Opportunity Intake
Research
Commercial Strategy Model
Output Generator / Renderer
Publish / Export / Use
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

## Step 1: Capture The Opportunity Intake

Save the Opportunity Intake as source material.

Capture what applies:

- company name
- opportunity type
- desired output targets
- role title
- location or remote status
- reporting line, if listed
- responsibilities
- success metrics
- required commercial capabilities
- proposal or consulting objective
- dashboard or measurement objective
- outreach audience
- interview or application context
- language that hints at priorities or pain points

The Opportunity Intake should drive the strategic emphasis of the Commercial Strategy Model and the format of the generated output.

## Step 2: Research The Opportunity

Use `commercial-strategy-platform/methodology/research-methodology.md`.

Before drafting the model, complete `commercial-strategy-platform/methodology/research-checklist.md`.

Produce a short research brief before drafting the model. The brief should identify:

- opportunity context
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

## Step 3: Generate The Commercial Strategy Model

Create one Commercial Strategy Model that follows `commercial-strategy-platform/content-schema.md`.

Write page copy using `commercial-strategy-platform/methodology/writing-style.md`.

Use `commercial-strategy-platform/methodology/page-sections.md` to confirm each section has the right strategic purpose, required components, customizable content, and never-change elements.

Recommended future location:

```text
public/commercial-strategy-models/{opportunity-slug}.json
```

Use URL-safe lowercase slugs:

```text
example-company
acme-industrial
gainbridge
```

For website and proposal-style outputs, the model should fit the canonical Commercial Strategy navigation. Do not add new stages unless a future implementation explicitly supports them.

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

## Step 4: Validate The Commercial Strategy Model

Before publishing, validate that:

- required top-level fields exist
- opportunity type and output targets exist
- company intelligence fields are included in source metadata where useful
- all fixed stages exist
- arrays contain enough content for the visual layout
- URLs are valid
- map coordinates are valid
- dashboard and measurement fields have clear owners or inspection cadence where applicable
- roadmap horizons are practical and ordered
- copy follows `commercial-strategy-platform/methodology/writing-style.md`
- no rendered strings are empty
- website/proposal copy is concise enough for the design

A future script may provide:

```text
npm run validate:strategies
```

Until that exists, review the model manually against the schema.

## Step 5: Generate The Output

The future Output Generator or Renderer should:

- load the Commercial Strategy Model by slug
- pass content into the existing Commercial Strategy stage layout
- preserve the current visual classes and page structure
- preserve the current navigation and interactions
- use fallback default content only where intentional

The Renderer should not require a new component for every opportunity.

For non-website outputs, the Output Generator should map the same model into the appropriate format:

- proposal narrative
- executive dashboard outline
- interview preparation brief
- cover letter
- LinkedIn or recruiter outreach
- RevHub or Audaption consulting artifact

## Step 6: Preview Locally

For website outputs, run the local site and review the generated page.

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

For non-website outputs, review the generated artifact for audience fit, specificity, tone, and factual discipline.

## Step 7: Publish, Export, Or Use

Commit:

- the Commercial Strategy Model
- any registry or manifest update
- any required validation fixture

Do not commit:

- `node_modules/`
- `dist/`
- `.DS_Store`
- `.claude/`
- local scratch files

GitHub Pages should publish website outputs through the existing workflow. Proposal, cover-letter, interview, dashboard, and outreach outputs may be exported or used outside the site.

## Future Implementation Phases

### Phase 1: Documentation And Guardrails

Add project guidance, schema documentation, research methodology, workflow documentation, and ignore rules.

No React changes.

### Phase 2: Data Contract

Add TypeScript schema types and a sample Commercial Strategy Model.

Keep the existing Commercial Strategy page unchanged.

### Phase 3: Lightweight Renderer

Add a new route that loads one Commercial Strategy Model and renders it through the existing Commercial Strategy layout.

Preserve the existing `/commercial-strategy` page.

### Phase 4: Validation

Add a small validation script for all Commercial Strategy Models.

The script should fail fast on missing fields, invalid URLs, invalid map coordinates, and empty rendered content.

### Phase 5: Scale Page Generation

Create additional Commercial Strategy Models using the Opportunity Intake and research workflow.

Only refactor components when repeated output generation proves that the refactor will reduce real friction.
