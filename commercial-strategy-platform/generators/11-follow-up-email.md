# 11 Follow-Up Email Generator

## Purpose

Generate a follow-up email after a conversation, interview, proposal discussion, workshop, or client meeting.

## Primary Audience

- Executive Hire: hiring leader, recruiter, interviewer, executive stakeholder
- Consulting Engagement: client sponsor or workshop participant
- Agency Engagement: client marketing or revenue stakeholder

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.primaryAudience`
- `company.name`
- `objectives`
- `growthOpportunities`
- `campaigns`
- `salesMotion`
- `measurement`
- `recommendations`
- `assumptions`

## Optional Inputs

- meeting notes
- recipient name
- discussion highlights
- objections or concerns raised
- promised follow-up items
- desired next step
- timing

## Dependencies

- Opportunity Model
- meeting or conversation notes when available
- engagement type contract
- writing style guide

## Output Format

Short email with context, recap, value reinforcement, follow-up item, and next-step CTA.

## Writing Style

Concise, specific, appreciative, and practical. Avoid long recaps and generic thanks.

## Validation Rules

- The generator does not perform research.
- It must not invent meeting details.
- It must distinguish discussed facts from proposed next steps.
- The CTA must be clear.
- Engagement type determines the relationship framing and ask.

## Success Criteria

- The recipient quickly understands why the follow-up matters.
- The email reinforces the commercial thesis.
- The next step is easy to accept or respond to.
- The tone fits the engagement type.

## Example Output Structure

```text
Subject
Opening thanks/context
Specific discussion callback
Commercial insight or recommendation
Promised follow-up item
Next-step CTA
Close
```
