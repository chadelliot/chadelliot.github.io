# RevHub intelligence-led LinkedIn outreach

## Non-negotiable approval
All invitations, blank connection requests, messages, follow-ups, comments and emails are **draft/review only** until Chad approves the exact content for the exact recipient and separately authorizes delivery. A copy or an activity log never proves delivery. Summit, show and conference prospects stay outside automated outreach.

## Account intelligence before drafting
Review current role, LinkedIn profile, company, shared context, publicly sourced revenue and commercial triggers. Store source/date/confidence and distinguish a hypothesis from a fact. The research panel displays a **five-factor evidence checklist**, not an invented probability of purchase:
- Commercial capacity 25%: cited revenue and likely ability to fund a $15k–$35k retainer (budget still unverified).
- Current commercial pressure 25%: sourced hiring, leadership, M&A or performance trigger.
- Decision access 20%: verified contact role and buying-influence hypothesis.
- Role/solution fit 20%: an outcome worth evaluating in that functional domain.
- Warm path 10%: meaningful common connection, real engagement or event.

Contractual/legal conflicts, do-not-contact restrictions, and event-handled exclusions are hard gates, not scoring factors. Do not invent a score when evidence is unavailable.

## Conversation sequence
1. Invite with a brief meaningful contextual note, or a blank invitation when no genuine context exists. Never manufacture a mutual connection or congratulation.
2. After verified acceptance, draft a short peer-to-peer message: one specific business outcome, a succinct reference to the platform built with a partner, AI-era domain decision ownership **and** outcome accountability. End with an offer of a relevant example, rather than a meeting request.
3. After a verified sent first message and no reply, prepare one **new-insight** follow-up 3–5 business days later, never before 24 hours. Consider an optional final touch 7–10 business days later only with a genuinely new reason and individual approval.
4. Stop scheduled outreach on any inbound reply, opt-out, human handoff, meeting, or active conversation. Any subsequent response is human-managed.

Never teach executives their own business, recycle boilerplate, cite unverified pain points, or describe the platform's architecture in an initial note.

## Conversion measurement
The CRM's **Log what happened** form records actual outcomes as `contact_activity.event_type='outcome_logged'` with an `event_detail` JSON object that includes the `action`, `note`, and `followUpAt`. Newly distinguishable classifications:
- `positive_reply`, `neutral_reply`, `negative_reply`: actual inbound reply classification. These are **not** outbound send confirmations.
- `qualified_conversation`: actual conversation that reached substantive business qualification.
- `proposal_sent`: proposal only when delivery was verified.
Existing `connection_sent`, `connection_accepted`, `linkedin_message`, `meeting`, `do_not_contact` and `closed_deals` provide other funnel stages. Historical records may be incomplete, so report missing evidence instead of treating it as zero.
Compare acceptance per invitation, positive replies per actually sent introduction, qualified discussions per initial invitation, meetings, proposals, and won value. Dedupe by contact ID and don't count copied messages as sent.

## Test discipline
Run small, user-approved comparable cohorts before scaling: contextual vs blank invitations; AI/domain-accountability vs direct financial-outcome framing; insight follow-up vs original. Don't make causal claims from a small observational test. Review outcomes after a reasonable invite-maturation window.

## Interface limitations
The research panel computes evidence coverage from *existing* verified fields, not a stored sales score. Warm relationship paths, budget authority and eventual proposal values still need explicit documentation. Additional reporting views can follow when reliable stages have been collected; this change does not automatically send LinkedIn messages or modify historical activity.
