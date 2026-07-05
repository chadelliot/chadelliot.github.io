# Commercial Strategy Renderer Schema

This document defines the renderer-facing schema for website and proposal-style Commercial Strategy outputs.

It is not the canonical data model. The canonical model is documented in `commercial-strategy-platform/opportunity-model/opportunity-model.md`.

## Relationship To The Opportunity Model

The platform data flow is:

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
Output Generator / Renderer
  |
  v
Deliverable
```

The Discovery Engine identifies the evidence that should be gathered, Commercial Intelligence interprets it, and the Opportunity Model captures the normalized output. The Strategy Website Renderer then maps that model into the existing Commercial Strategy page structure.

The renderer schema exists only to protect the current website design and section order. It should not become a separate research model or alternate source of truth.

## Design Goals

- Preserve the current Commercial Strategy page design.
- Match the current Commercial Strategy left-side navigation exactly.
- Keep website generation predictable.
- Let broad Opportunity Model fields support many deliverables.
- Avoid adding page-specific data requirements to every generator.

## Required Opportunity Model Inputs

Website and proposal-style renderers should derive page content from:

- `opportunity`
- `company`
- `industry`
- `businessModel`
- `role`
- `objectives`
- `commercialChallenges`
- `growthOpportunities`
- `audience`
- `segmentation`
- `tam`
- `personas`
- `journey`
- `signals`
- `campaigns`
- `salesMotion`
- `measurement`
- `technology`
- `competitiveLandscape`
- `risks`
- `assumptions`
- `recommendations`

The renderer may add display metadata, route metadata, or theme defaults, but those are output concerns. They should not replace the Opportunity Model.

## Renderer View Model

A future website renderer may create a view model similar to:

```json
{
  "slug": "example-opportunity",
  "modelId": "example-opportunity",
  "page": {
    "title": "Commercial Strategy for Example Company",
    "subtitle": "A practical operating model for segmentation, activation, and measurement.",
    "navLabel": "Example Company",
    "theme": {
      "accent": "#4a9e7a"
    }
  },
  "stages": {
    "kpiFoundation": {},
    "segmentation": {},
    "totalAddressableMarket": {},
    "audienceArchitecture": {},
    "prospectFunnel": {},
    "signalIntelligence": {},
    "campaignActivation": {},
    "salesMotion": {},
    "marketingSalesAlignment": {},
    "returnToDashboard": {}
  }
}
```

This view model should be derived from the Opportunity Model and approved renderer defaults.

## Canonical Stage Keys

For website and proposal-style outputs, renderers must use fixed keys that match the canonical Commercial Strategy navigation.

```json
{
  "kpiFoundation": {},
  "segmentation": {},
  "totalAddressableMarket": {},
  "audienceArchitecture": {},
  "prospectFunnel": {},
  "signalIntelligence": {},
  "campaignActivation": {},
  "salesMotion": {},
  "marketingSalesAlignment": {},
  "returnToDashboard": {}
}
```

Do not add, remove, rename, or reorder stage keys for generated website/proposal-style outputs.

## Canonical Navigation

The rendered page must preserve this navigation:

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

The detailed section contract lives in `commercial-strategy-platform/methodology/page-sections.md`.

## Stage Mapping Guidance

| Renderer stage | Primary Opportunity Model sources |
| --- | --- |
| `kpiFoundation` | `objectives`, `measurement`, `role`, `recommendations` |
| `segmentation` | `audience`, `segmentation`, `growthOpportunities`, `commercialChallenges` |
| `totalAddressableMarket` | `industry`, `tam`, `segmentation`, `assumptions` |
| `audienceArchitecture` | `audience`, `personas`, `journey` |
| `prospectFunnel` | `journey`, `campaigns`, `salesMotion`, `measurement` |
| `signalIntelligence` | `signals`, `technology`, `commercialChallenges`, `assumptions` |
| `campaignActivation` | `campaigns`, `personas`, `growthOpportunities`, `signals` |
| `salesMotion` | `salesMotion`, `campaigns`, `audience`, `technology` |
| `marketingSalesAlignment` | `salesMotion`, `measurement`, `technology`, `risks` |
| `returnToDashboard` | `measurement`, `recommendations`, `risks`, `assumptions` |

## Required Renderer Behavior

The Strategy Website Renderer must:

- load one Opportunity Model
- perform no research
- derive the 10-stage view model from the Opportunity Model
- use approved fallback copy only where documented
- preserve the current Commercial Strategy design, interactions, and route behavior
- keep generated website outputs static and GitHub Pages compatible

## Validation

Before rendering a website output:

- validate the Opportunity Model against `commercial-strategy-platform/opportunity-model/validation-rules.md`
- confirm `opportunity.outputTargets` includes `strategy-website`
- confirm the renderer can populate all 10 canonical sections
- confirm any unresolved internal unknowns are represented as assumptions or validation questions
- confirm output copy follows `commercial-strategy-platform/methodology/writing-style.md`
