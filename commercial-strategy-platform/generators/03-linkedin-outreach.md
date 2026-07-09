# 03 LinkedIn Outreach Generator

## Purpose

Generate LinkedIn, recruiter, or short-form outreach messages based on the Opportunity Model.

## Primary Audience

- Executive Hire: recruiter, hiring leader, executive stakeholder
- Consulting Engagement: client sponsor or functional leader
- Agency Engagement: marketing or revenue buyer

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.primaryAudience`
- `opportunity.intakeSummary`
- `company.name`
- `company.description`
- `role`
- `objectives`
- `growthOpportunities`
- `audience`
- `personas`
- `signals`
- `campaigns`
- `recommendations`
- `assumptions`

## Optional Inputs

- recipient name
- recipient title
- relationship context
- character limit
- desired CTA
- prior message history

## Dependencies

- Opportunity Model
- engagement type contract
- writing style guide

## Output Format

Short outreach message or sequence. May include connection request, first message, follow-up, or recruiter reply.

## Writing Style

Concise, specific, curious, and low-friction. Avoid inflated claims, long paragraphs, and generic networking language.

## Validation Rules

- The generator does not perform research.
- The message uses only model-supported facts or clearly framed hypotheses.
- The call to action is simple.
- The message fits the requested channel length.
- Engagement type determines the ask and level of commercial detail.

## Success Criteria

- The message earns attention without sounding automated.
- The recipient can quickly understand the relevance.
- The CTA is easy to answer.
- The message does not overstate familiarity with internal priorities.

## Example Output Structure

```text
Connection request
  Specific context
  Reason for reaching out
  Light CTA

Follow-up
  Commercial insight
  Relevance to recipient
  Next-step question
```
