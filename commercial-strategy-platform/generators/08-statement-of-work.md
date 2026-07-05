# 08 Statement Of Work Generator

## Purpose

Generate a Statement of Work from the Opportunity Model and approved scope inputs.

## Primary Audience

- Executive Hire: rarely used; may support advisory trial or project-based evaluation
- Consulting Engagement: client sponsor, procurement, legal, implementation stakeholders
- Agency Engagement: client sponsor, procurement, account team, delivery team

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.primaryAudience`
- `company`
- `objectives`
- `campaigns`
- `salesMotion`
- `measurement`
- `technology`
- `risks`
- `assumptions`
- `recommendations`

## Optional Inputs

- approved proposal
- scope boundaries
- deliverables
- timeline
- milestones
- fees or pricing model
- roles and responsibilities
- assumptions and exclusions
- approval process

## Dependencies

- Opportunity Model
- approved scope inputs
- engagement type contract
- writing style guide

## Output Format

Structured SOW with objectives, scope, deliverables, timeline, responsibilities, assumptions, exclusions, and acceptance criteria.

## Writing Style

Precise, operational, and unambiguous. Avoid sales language and avoid commitments not present in approved inputs.

## Validation Rules

- The generator does not perform research.
- It does not invent commercial terms, legal terms, dates, pricing, or commitments.
- Any missing scope details are flagged as placeholders or assumptions.
- Engagement type determines delivery framing but not model structure.
- Acceptance criteria are measurable where possible.

## Success Criteria

- Scope is clear.
- Deliverables are concrete.
- Responsibilities are assigned.
- Assumptions and exclusions reduce ambiguity.
- The SOW can move into review without rewriting the strategy.

## Example Output Structure

```text
Project overview
Objectives
Scope
Deliverables
Timeline and milestones
Roles and responsibilities
Assumptions
Exclusions
Acceptance criteria
Approval
```
