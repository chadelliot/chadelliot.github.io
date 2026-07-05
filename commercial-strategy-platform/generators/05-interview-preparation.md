# 05 Interview Preparation Generator

## Purpose

Generate an interview preparation brief from the Opportunity Model.

## Primary Audience

- Executive Hire: candidate preparing for interviews
- Consulting Engagement: consultant preparing for discovery or pitch conversations
- Agency Engagement: agency lead preparing for client or prospect meetings

## Supported Engagement Types

- Executive Hire
- Consulting Engagement
- Agency Engagement

## Required Opportunity Model Inputs

- `opportunity.engagementType`
- `opportunity.primaryAudience`
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
- `salesMotion`
- `measurement`
- `risks`
- `assumptions`
- `recommendations`

## Optional Inputs

- interview stage
- known interviewer names or roles
- prior conversation notes
- likely objections
- candidate background
- meeting agenda

## Dependencies

- Opportunity Model
- engagement type contract
- writing style guide

## Output Format

Preparation brief with strategic thesis, likely questions, answer themes, questions to ask, risks, assumptions, and follow-up topics.

## Writing Style

Executive, direct, practical, and curious. Use confident recommendations while clearly marking assumptions.

## Validation Rules

- The generator does not perform research.
- It does not invent interviewer priorities.
- It separates sourced facts, hypotheses, and recommended talking points.
- It includes questions that validate internal constraints.
- Engagement type determines whether preparation focuses on hiring, consulting, or agency buying dynamics.

## Success Criteria

- The user can enter the conversation with a clear commercial thesis.
- Likely questions and answers connect back to the model.
- Internal unknowns become thoughtful questions.
- The brief improves strategic readiness without overclaiming.

## Example Output Structure

```text
Conversation objective
Strategic thesis
Company and market read
Likely interviewer priorities
Answer themes
Questions to ask
Risks and assumptions
Follow-up plan
```
