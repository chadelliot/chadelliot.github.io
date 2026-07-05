# Commercial Strategy Model Schema

This document defines the target Commercial Strategy Model contract for future platform outputs.

The section contract for website and proposal-style outputs is canonical in `commercial-strategy-platform/methodology/page-sections.md`. This schema must follow that contract when rendering the Commercial Strategy page format.

## Design Goals

- Preserve the current Commercial Strategy page design.
- Match the current Commercial Strategy left-side navigation exactly.
- Make opportunity-specific outputs possible by changing model content, not code.
- Keep model authoring practical for dozens of future outputs.
- Support lightweight validation before publishing.

Supported outputs include VP Marketing applications, RevHub agency work, Audaption consulting work, proposals, executive dashboards, interview preparation, cover letters, and LinkedIn/recruiter outreach.

## Top-Level Shape

```json
{
  "schemaVersion": "1.0",
  "slug": "example-company",
  "opportunity": {},
  "company": {},
  "source": {},
  "page": {},
  "stages": {}
}
```

## Required Top-Level Fields

| Field | Type | Required | Purpose |
| --- | --- | --- | --- |
| `schemaVersion` | string | yes | Allows future content migrations. |
| `slug` | string | yes | URL-safe opportunity identifier. |
| `opportunity` | object | yes | Opportunity type, audience, and desired outputs. |
| `company` | object | yes | Account, company, client, or target organization context. |
| `source` | object | yes | Inputs used to generate the model. |
| `page` | object | yes | Website/page display metadata when rendered as a page. |
| `stages` | object | yes | Content for each Commercial Strategy chapter. |

## Opportunity

```json
{
  "type": "vp-marketing-application",
  "primaryUseCase": "VP Marketing application",
  "audience": "Hiring leader and executive team",
  "outputTargets": [
    "website",
    "interview-prep",
    "cover-letter",
    "linkedin-outreach"
  ],
  "intakeSummary": "Opportunity Intake summary, including role, business context, and desired outputs."
}
```

Recommended `type` values:

- `vp-marketing-application`
- `revhub-agency`
- `audaption-consulting`
- `proposal`
- `executive-dashboard`
- `interview-prep`
- `cover-letter`
- `linkedin-outreach`

## Company

```json
{
  "name": "Example Company",
  "industry": "Industrial distribution",
  "website": "https://www.example.com",
  "roleTitle": "VP Commercial Strategy",
  "location": "Atlanta, GA",
  "businessModel": "B2B distribution",
  "primaryCustomer": "Multi-site operators"
}
```

Recommended fields:

- `name`
- `industry`
- `website`
- `roleTitle`
- `location`
- `businessModel`
- `primaryCustomer`

## Source

```json
{
  "opportunityIntakeSummary": "Short summary of the opportunity, audience, and requested outputs.",
  "researchSummary": "Short summary of organization, market, and opportunity research.",
  "researchContext": {},
  "sourceUrls": [
    "https://www.example.com/careers/example-role"
  ],
  "generatedAt": "2026-07-04"
}
```

Source fields exist for traceability. They should not all be rendered on the page.

## Research Context

The optional `source.researchContext` object should capture the research inputs that inform the rendered strategy. These fields are primarily for traceability and generation quality.

```json
{
  "companyOverview": "Example Company provides specialized services for multi-site operators.",
  "industry": "Industrial distribution",
  "competitors": [
    "Competitor A",
    "Competitor B"
  ],
  "customerSegments": [
    "Enterprise operators",
    "Regional operators"
  ],
  "publicLeadershipPriorities": [
    "Improve sales productivity",
    "Expand strategic account penetration"
  ],
  "recentAcquisitions": [
    {
      "name": "Acquired Company",
      "date": "2025",
      "strategicRationale": "Expanded geographic coverage"
    }
  ],
  "financialPerformance": "Public results suggest growth investment with margin discipline.",
  "existingMarketingMaturity": "Moderate maturity with opportunity to improve account-based orchestration.",
  "probableMarTechStack": [
    "CRM",
    "Marketing automation",
    "Web analytics"
  ],
  "aiOpportunities": [
    "Account research automation",
    "Signal-based prioritization"
  ],
  "risks": [
    "Long sales cycles",
    "Fragmented buying committees"
  ],
  "growthOpportunities": [
    "Segment-specific campaigns",
    "Executive account expansion plays"
  ]
}
```

If a field is inferred rather than sourced, the research notes or value text should make that clear.

## Page

```json
{
  "title": "Commercial Strategy for Example Company",
  "subtitle": "A practical operating model for segmentation, market intelligence, activation, and measurement.",
  "navLabel": "Example Company",
  "theme": {
    "accent": "#4a9e7a"
  }
}
```

The `page` object is used by a website Renderer. Proposal, cover-letter, outreach, dashboard, and interview-prep Output Generators may use different display metadata while still reading the same Commercial Strategy Model.

## Stages

For website and proposal-style outputs, the `stages` object must use fixed keys that match the canonical Commercial Strategy navigation.

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

## Stage Metadata

Each stage may include shared display metadata:

```json
{
  "eyebrow": "Chapter 01 - The Scoreboard",
  "title": "We start with the executive outcomes.",
  "body": "Before a single campaign is built, we align on what the business is actually trying to accomplish.",
  "quote": "Before we build the strategy, we define the scoreboard."
}
```

Display metadata should preserve the role of each chapter while allowing opportunity-specific language.

## Stage Content Keys

These content keys are recommended starting points for the website/proposal Renderer. The required visual components and never-change rules live in `commercial-strategy-platform/methodology/page-sections.md`.

### `kpiFoundation`

```json
{
  "metrics": [
    {
      "label": "Revenue Growth",
      "value": "14.3%",
      "status": "Above target",
      "tone": "positive"
    }
  ],
  "supportingNote": "These outcomes anchor every layer of the commercial system."
}
```

### `segmentation`

```json
{
  "reveals": [
    "Who the audience actually is",
    "Where the largest revenue opportunity sits"
  ],
  "growthObjectives": [
    "Revenue growth from highest-value segments",
    "Market share expansion into whitespace"
  ],
  "segments": [
    {
      "label": "Segment A",
      "name": "High-Value Existing Customers",
      "description": "Top-tier accounts by revenue and category breadth.",
      "opportunity": "Opportunity size: High",
      "indicator": "90%",
      "motion": "Expand & Retain"
    }
  ]
}
```

### `totalAddressableMarket`

```json
{
  "summary": {
    "addressableAccounts": "895",
    "activeCustomers": "161",
    "warmPipeline": "314",
    "whitespace": "420"
  },
  "legend": [
    "Active customer",
    "Engaged / recent",
    "Lead / prospect",
    "Lapsed"
  ],
  "mapDots": [
    {
      "label": "Active customer",
      "x": 72,
      "y": 64,
      "tone": "active"
    }
  ],
  "assumptions": [
    "Map coordinates are percentages from 0 to 100."
  ]
}
```

### `audienceArchitecture`

```json
{
  "tiers": [
    {
      "label": "T1",
      "name": "Highest-Value Accounts",
      "segment": "Segment A - Protect & Grow",
      "description": "Largest revenue contribution and deepest relationship.",
      "motions": [
        "Executive relationship management",
        "Strategic account plans"
      ]
    }
  ],
  "personas": [
    {
      "role": "Executive Buyer",
      "name": "VP / C-Suite Leader",
      "segment": "Found in Tier 1 & 2",
      "badge": "T1 Accounts",
      "rows": [
        {
          "label": "Job to do",
          "value": "Drive revenue growth and competitive positioning."
        }
      ]
    }
  ],
  "additionalBuyerRoles": []
}
```

### `prospectFunnel`

```json
{
  "stages": [
    {
      "label": "Market Reach",
      "value": "2.4M",
      "note": "Impressions"
    }
  ],
  "prospectTiers": [
    {
      "label": "Tier 1 Prospects",
      "title": "High-fit / High-value",
      "description": "Account-based selling, direct outreach, and priority sales assignment.",
      "motion": "Actively pursue"
    }
  ]
}
```

### `signalIntelligence`

```json
{
  "customerSignals": [
    {
      "name": "Declining Purchase Frequency",
      "description": "Spend down 30%+ versus prior quarter.",
      "tag": "At Risk",
      "steps": [
        "Signal",
        "Alert seller",
        "Re-engagement offer",
        "Track recovery"
      ]
    }
  ],
  "prospectSignals": []
}
```

### `campaignActivation`

```json
{
  "campaignName": "Public Funding Recipients - Q4 Outreach",
  "steps": [
    {
      "label": "01 Audience",
      "value": "14 funded accounts",
      "description": "Matched to TAM and priority prospects."
    }
  ],
  "performance": [
    "Open rate 34%",
    "3 SQLs in week 1"
  ]
}
```

### `salesMotion`

```json
{
  "columns": [
    {
      "title": "Tier 1 Accounts",
      "subtitle": "Protect / Grow / Retain",
      "items": [
        "Assigned to senior sellers",
        "Weekly executive touchpoints",
        "KPI: NRR, LTV growth, wallet share"
      ]
    }
  ]
}
```

### `marketingSalesAlignment`

```json
{
  "marketingOutputs": [
    "Segment-targeted campaigns",
    "Demand generation and content"
  ],
  "sharedIntelligenceLayer": [
    "KPI Framework",
    "Segmentation",
    "TAM + Personas",
    "Tiering",
    "Signals"
  ],
  "salesOutputs": [
    "Account and territory assignment",
    "Signal-driven outreach"
  ]
}
```

### `returnToDashboard`

```json
{
  "metrics": [
    {
      "layer": "Segmentation + TAM",
      "kpi": "Market Share: 18.0%",
      "source": "161 active of 895 addressable accounts"
    }
  ],
  "systemFlow": [
    {
      "label": "Executive KPIs",
      "items": [
        "Revenue growth",
        "Market share",
        "Acquisition"
      ]
    }
  ],
  "finalSummary": "This is how we move from executive goals to market intelligence, from market intelligence to action, and from action back to measurable business performance."
}
```

## Validation Guardrails

A future validator should require:

- a valid `schemaVersion`
- a URL-safe `slug`
- a valid `opportunity.type`
- at least one `opportunity.outputTargets` value
- a non-empty company name
- a research context that separates sourced facts from inferred assumptions when used
- all ten fixed stage keys
- stage keys in canonical order
- no extra generated website/proposal sections
- valid URLs in `website` and `sourceUrls`
- map dot coordinates from 0 to 100
- no empty rendered strings
- content that respects the never-change rules in `commercial-strategy-platform/methodology/page-sections.md` when rendered as a Commercial Strategy page

## Authoring Guidance

Content should be specific enough to fit the opportunity, but structured enough to support multiple Output Generators.

Prefer:

- concise labels
- short strategy statements
- concrete operating recommendations
- numbers with clear assumptions
- role-specific personas
- measurable next actions

Avoid:

- long paragraphs
- generic company praise
- unsupported market claims
- content that requires new visual layouts
- adding optional fields without a clear rendering need
