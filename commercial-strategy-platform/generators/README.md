# Generators

Generators turn a validated Opportunity Model into a specific output.

Research happens once upstream. Generators do not perform research. They consume the same Opportunity Model, apply engagement-type framing, and produce the requested deliverable.

Chapter quality rule for website-style generators: every chapter should answer, "What would this look like if we had already built it?"

## Core Rule

Every generator consumes the same Opportunity Model.

The engagement type changes:

- tone
- scope
- audience framing
- required input emphasis
- deliverables

The engagement type does not change:

- the underlying Opportunity Model
- the canonical Commercial Strategy section contract
- the distinction between sourced facts, directional hypotheses, and recommendations
- the requirement to acknowledge internal constraints
- the requirement to keep content concise, specific, and free of empty placeholder sections

## Supported Engagement Types

Every generator supports exactly these engagement types:

1. Executive Hire
2. Consulting Engagement
3. Agency Engagement

## Generator Inventory

| Generator | Output |
| --- | --- |
| `01-strategy-website.md` | Commercial Strategy website/page |
| `02-cover-letter.md` | Cover letter |
| `03-linkedin-outreach.md` | LinkedIn or recruiter outreach |
| `04-resume-alignment.md` | Resume alignment notes |
| `05-interview-preparation.md` | Interview preparation brief |
| `06-executive-summary.md` | Executive summary |
| `07-proposal.md` | Proposal |
| `08-statement-of-work.md` | Statement of work |
| `09-discovery-workshop.md` | Discovery workshop plan |
| `10-presentation.md` | Presentation outline |
| `11-follow-up-email.md` | Follow-up email |
| `12-sales-one-pager.md` | Sales one-pager |

## Shared Generator Inputs

All generators may read:

- `opportunity.engagementType`
- `opportunity.primaryAudience`
- `opportunity.outputTargets`
- `opportunity.intakeSummary`
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

## Shared Validation Rules

Every generator must verify:

- the Opportunity Model exists
- `opportunity.engagementType` is one of the three supported engagement types
- the requested output target is appropriate for the generator
- required Opportunity Model sections are present
- no research is performed inside the generator
- unsupported internal claims are not introduced
- output copy follows `commercial-strategy-platform/methodology/writing-style.md`
- renderer-style outputs preserve the canonical rail headers and do not force blank cards or fixed counts

## Related Docs

- `commercial-strategy-platform/content-schema.md`
- `commercial-strategy-platform/opportunity-model/README.md`
- `commercial-strategy-platform/opportunity-model/opportunity-model.md`
- `commercial-strategy-platform/opportunity-model/validation-rules.md`
- `commercial-strategy-platform/engagement-types/README.md`
- `commercial-strategy-platform/methodology/page-generation-workflow.md`
- `commercial-strategy-platform/methodology/page-sections.md`
- `commercial-strategy-platform/methodology/writing-style.md`
