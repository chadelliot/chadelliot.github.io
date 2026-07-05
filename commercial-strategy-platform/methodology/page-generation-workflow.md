# Output Generation Workflow

This workflow describes how to create future Commercial Strategy Platform outputs without duplicating strategy work or page code.

The intended flow is:

```text
Opportunity Intake
Intake Engine
Discovery Engine
Commercial Intelligence
Opportunity Model
Output Generator / Renderer
Publish / Export / Use
```

Supported engagement types:

1. Executive Hire
2. Consulting Engagement
3. Agency Engagement

The Opportunity Model stays consistent across all three. The engagement type determines audience framing, required inputs, and deliverables. See `commercial-strategy-platform/engagement-types/README.md`.

## Step 1: Capture The Opportunity Intake

Save the Opportunity Intake as source material.

Capture what applies:

- company name
- engagement type
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

The Opportunity Intake should drive the strategic emphasis of the Intake Engine, Discovery Engine, research, Commercial Intelligence, Opportunity Model, and the format of the generated output.

## Step 2: Run The Intake Engine

Use `commercial-strategy-platform/intake-engine/workflow.md`.

Normalize the raw opportunity inputs into a common intake object.

Before discovery begins, confirm:

- company name is present
- engagement type is present
- a source document or notes exist
- recruiter or hiring manager details are normalized when available
- missing information is captured explicitly
- the intake is ready for discovery or flagged for review

## Step 3: Run The Discovery Engine

Use `commercial-strategy-platform/discovery-engine/workflow.md`.

The Discovery Engine identifies what needs to be researched and how confident each finding is before Commercial Intelligence is created.

Complete `commercial-strategy-platform/discovery-engine/validation-rules.md` and `commercial-strategy-platform/discovery-engine/research-source-map.md` as part of this step.

The discovery output should identify:

- company overview
- products/services
- industry
- competitors
- customers
- business model
- revenue model
- hiring context
- marketing maturity
- technology signals
- growth signals
- risks
- source links
- confidence levels for each finding

The Discovery Engine should also capture external research needs, internal research needs, and open questions for follow-up.

## Step 4: Research The Opportunity

Use `commercial-strategy-platform/methodology/research-methodology.md`.

Before building Commercial Intelligence and the Opportunity Model, complete `commercial-strategy-platform/methodology/research-checklist.md`.

Produce a short discovery and research brief before drafting Commercial Intelligence. The brief should identify:

- opportunity context
- engagement type
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

The normalized intake object is the source material for discovery and research. It is not a generator input and should not be used to bypass the intelligence or model layers.

## Step 5: Build Commercial Intelligence

Use the research brief and source material to produce a Commercial Intelligence brief that captures:

- likely commercial priorities
- implied executive KPIs
- customer segments
- market opportunities
- revenue bottlenecks
- competitive pressures
- technology gaps
- sales and marketing alignment needs
- risks
- assumptions
- confidence levels
- strategic recommendations

Commercial Intelligence should separate facts, inferences, assumptions, and recommendations.

## Step 6: Generate The Opportunity Model

Create exactly one Opportunity Model that follows `commercial-strategy-platform/opportunity-model/opportunity-model.md`.

Use `commercial-strategy-platform/opportunity-model/company-model-template.json` as the placeholder structure.

Use `commercial-strategy-platform/opportunity-model/field-dictionary.md` to confirm field meaning and generator usage.

Use `commercial-strategy-platform/methodology/writing-style.md` for model language and generated copy.

For website and proposal-style outputs, use `commercial-strategy-platform/methodology/page-sections.md` and `commercial-strategy-platform/content-schema.md` to confirm the renderer can map the model into the current Commercial Strategy section contract.

Recommended future location:

```text
public/opportunity-models/{opportunity-slug}.json
```

Use URL-safe lowercase slugs:

```text
example-company
acme-industrial
gainbridge
```

For website and proposal-style outputs, the renderer should fit the canonical Commercial Strategy navigation. Do not add new stages unless a future implementation explicitly supports them.

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

## Step 7: Validate The Opportunity Model

Before publishing, validate that:

- required top-level fields exist
- engagement type and output targets exist
- company intelligence fields are included in the appropriate Opportunity Model sections
- arrays contain enough content for the visual layout
- URLs are valid
- map coordinates are valid
- dashboard and measurement fields have clear owners or inspection cadence where applicable
- roadmap horizons are practical and ordered
- copy follows `commercial-strategy-platform/methodology/writing-style.md`
- no rendered strings are empty
- website/proposal copy is concise enough for the design

Commercial Intelligence should also be validated for:

- fact versus inference separation
- confidence scoring
- evidence support
- explicit assumptions
- directional recommendations

Use `commercial-strategy-platform/opportunity-model/validation-rules.md` as the validation authority.

A future script may provide:

```text
npm run validate:strategies
```

Until that exists, review the model manually against the Opportunity Model contract and validation rules.

## Step 8: Generate The Output

The future Output Generator or Renderer should:

- load the Opportunity Model by slug
- use the selected generator contract in `commercial-strategy-platform/generators/`
- perform no research
- preserve the Opportunity Model shape
- use fallback default content only where intentional

The Strategy Website Renderer should derive a 10-section renderer view model from the Opportunity Model, pass content into the existing Commercial Strategy stage layout, preserve the current visual classes and page structure, and preserve the current navigation and interactions.

Available generator contracts:

- `01-strategy-website.md`
- `02-cover-letter.md`
- `03-linkedin-outreach.md`
- `04-resume-alignment.md`
- `05-interview-preparation.md`
- `06-executive-summary.md`
- `07-proposal.md`
- `08-statement-of-work.md`
- `09-discovery-workshop.md`
- `10-presentation.md`
- `11-follow-up-email.md`
- `12-sales-one-pager.md`

The Renderer should not require a new component for every opportunity.

## Step 8: Preview Locally

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

## Step 9: Publish, Export, Or Use

Commit:

- the Opportunity Model
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

### Phase 2: Commercial Intelligence And Generator Architecture

Document the Commercial Intelligence layer and the generator layer.

Keep the existing Commercial Strategy page unchanged.

### Phase 3: Lightweight Renderer

Add a new route that loads one Opportunity Model and renders it through the existing Commercial Strategy layout.

Preserve the existing `/commercial-strategy` page.

### Phase 4: Validation

Add a small validation script for all Opportunity Models.

The script should fail fast on missing fields, invalid URLs, invalid map coordinates, and empty rendered content.

### Phase 5: Scale Page Generation

Create additional Opportunity Models using the Opportunity Intake, Discovery, research, and Commercial Intelligence workflow.

Only refactor components when repeated output generation proves that the refactor will reduce real friction.
