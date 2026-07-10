# Page Sections

This file is the canonical section contract for every future website or proposal-style Commercial Strategy Platform output.

Future generated website and proposal-style outputs must preserve this left-side navigation structure, section order, and interaction model unless a later implementation task explicitly changes the Commercial Strategy template itself.

Do not use this file to redesign the page. Use it to define which content can change while the current Commercial Strategy design remains stable.

Chapter quality rule: every chapter should answer, "What would this look like if we had already built it?"

## Canonical Navigation Structure

```text
FOUNDATION
01. KPI Foundation
02. Segmentation
03. Total Addressable Market
04. Audience Architecture

EXECUTION
05. Prospect Funnel
06. Signal Intelligence
07. Commercial Activation

MEASUREMENT & SYSTEM
08. Sales Motion
09. M+S Alignment
10. Return to Dashboard
```

## Global Contract

Required for every future opportunity-specific strategy output that uses the Commercial Strategy page format:

- Preserve all three rail groups: `FOUNDATION`, `EXECUTION`, and `MEASUREMENT & SYSTEM`.
- Preserve the ten section labels exactly.
- Preserve the numeric order from 01 through 10.
- Preserve the chapter-based left rail, active state, completion state, progress bar, Back button, Next button, and Start Over behavior.
- Preserve the current Commercial Strategy visual language, including compact cards, grids, metrics, map, personas, funnel, signal cards, commercial activation grid, sales board, alignment grid, and dashboard return.
- Preserve the three rail headers exactly: `FOUNDATION`, `EXECUTION`, and `MEASUREMENT & SYSTEM`.
- Keep content rhythm concise: short headings, short body copy, punchy labels, and minimal paragraph density.
- Size cards and grids to the available content. Do not introduce empty placeholder cards or force fixed counts that leave blank slots.
- Customize opportunity-specific content inside the existing section patterns.
- Do not add, remove, rename, or reorder sections for an opportunity-specific output.
- Do not imply knowledge of internal priorities, data, systems, budget, team capacity, or constraints unless provided.
- Acknowledge that recommendations should evolve after internal constraints are learned.

## FOUNDATION

### 01. KPI Foundation

Purpose:
Define the executive scoreboard that anchors the rest of the strategy.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- KPI dashboard grid
- KPI cards
- Short supporting note

Customizable content:

- KPI names
- KPI values
- KPI deltas or status labels
- KPI target language
- supporting note
- opportunity-specific executive outcomes
- assumptions that need internal validation

Never change elements:

- section label: `KPI Foundation`
- section number: `01`
- rail group: `FOUNDATION`
- dashboard/card structure
- role of this section as the opening scoreboard
- connection between executive outcomes and all later strategy layers
- concise KPI labels and concrete directional values
- balance the grid to the KPI count instead of forcing a fixed slot count — six KPIs should read as a 3×2 grid, not be stretched or padded to fill an 8-card layout

### 02. Segmentation

Purpose:
Turn the broad market into actionable customer and prospect groups.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- "What segmentation reveals" insight card
- "Growth objectives that follow" insight card
- Three segment cards
- Segment tags or motion labels
- Segment priority or opportunity indicators

Customizable content:

- segment names
- segment descriptions
- segment opportunity size
- progress or priority indicators
- motion labels
- insight list copy
- growth objective list copy
- opportunity-specific customer and prospect groups

Never change elements:

- section label: `Segmentation`
- section number: `02`
- rail group: `FOUNDATION`
- three-segment visual pattern
- two insight-card setup
- role of segmentation as the bridge between audience understanding and growth focus
- segment-specific behavior and value levers, not generic labels

### 03. Total Addressable Market

Purpose:
Map the market opportunity, whitespace, current coverage, and reachable account universe.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- One strong TAM visualization (see below)
- TAM summary card
- Market statistic grid

Visualization choice (added — pick one, don't force the dot-map):

- The account dot-map (`buildTAMMap()` / `.tam-shell`) works well when the addressable market is genuinely a scatter of individual named accounts.
- When the opportunity is better described by a handful of named categories (e.g. "Strategic Enterprise Pharma", "Launch-Stage Biotech"), use tiered opportunity cards instead (`.tam-cat-grid` / `.tam-cat-card`) — each card shows estimated accounts, estimated addressable revenue, priority, and a fit tag. This reads far better than forcing generic "Market 1 / Market 2" placeholders into a map that doesn't fit the data.
- If neither fits, a TAM/SAM/SOM concentric model or a whitespace matrix are also acceptable — the requirement is one strong, well-labeled visual, never a placeholder.
- If the map is unused on a given page, remove its dead code (`buildTAMMap()` and related DOM hooks) rather than leaving it disconnected.

Customizable content:

- addressable account count
- active customer count
- lead, prospect, whitespace, or warm-pipeline counts
- map marker distribution, or category card values if using the card layout
- legend labels
- market statistic labels
- market statistic values
- opportunity-specific market assumptions

Never change elements:

- section label: `Total Addressable Market`
- section number: `03`
- rail group: `FOUNDATION`
- statistic grid pattern
- use of this section to explain market share, whitespace, and reachable opportunity
- requirement to label estimates and assumptions clearly
- descriptive B2B account categories and directional estimates — never generic "Market 1 / Market 2 / Market 3" labels

### 04. Audience Architecture

Purpose:
Define account priority and persona-level messaging logic.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- Step 1 revenue tiering section
- Tier grid — each tier card is clickable and hoverable (`.tier-card.selectable`), calling `selectTier(tierId)`
- Step 2 personas section
- Audience explainer
- Primary persona cards, each tagged `data-tier` and toggled visible/hidden by the active tier (`.persona-card-lg.show`)
- Additional buyer role cards

Interaction contract (added — do not omit on future pages):

- Exactly one tier is active by default (Tier 1). Clicking or hovering a tier card sets it active and swaps the persona cards below to that tier's personas.
- The active tier uses a solid green background with white text; inactive tiers stay neutral.
- Two personas are shown per tier (six total), never all six at once.
- The swap animates in with a short fade (reuse the existing `fadeIn` keyframe) rather than popping.
- On touch devices this must work via `click`, not rely on `mouseenter` alone.
- Keyboard users can tab to a tier (`tabindex="0"`, `role="button"`) and activate it with Enter or Space.

Customizable content:

- tier names
- tier descriptions
- segment-to-tier mapping
- tier motions
- persona names
- persona roles
- job-to-do language
- pain points
- triggers
- messages
- additional buyer roles
- opportunity-specific buying committee assumptions

Never change elements:

- section label: `Audience Architecture`
- section number: `04`
- rail group: `FOUNDATION`
- two-step pattern: revenue tiering first, personas second
- primary persona card pattern
- additional buyer role card pattern
- distinction between account-level priority and person-level relevance
- tiering should include estimated account value where reasonable
- the interactive tier → persona toggle described above

## EXECUTION

### 05. Prospect Funnel

Purpose:
Convert market opportunity into qualified pipeline stages.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Funnel stage breakdown
- Funnel metric row/grid
- Tier composition bridge — a labeled connector (`.funnel-bridge`) plus a stacked composition bar (`.tier-comp-bar`) showing the tier mix behind Closed Won revenue, placed directly beneath the funnel and directly above the prospect tier cards
- Prospect tier cards
- Tier-specific recommended motion

Customizable content:

- funnel stage names
- funnel counts
- conversion notes
- prospect tier names
- prospect tier descriptions
- prospect motions
- qualification language
- opportunity-specific pipeline assumptions
- tier composition percentages

Never change elements:

- section label: `Prospect Funnel`
- section number: `05`
- rail group: `EXECUTION`
- funnel progression pattern
- prospect tier card pattern
- purpose of turning TAM and segmentation into pipeline logic
- standardized funnel stages: Reach, Leads, MQLs, SQLs, Opportunities, Closed Won, Revenue
- the tier composition bridge connecting the funnel to the prospect tier cards — tier callouts must never float as an unrelated second concept

### 06. Signal Intelligence

Purpose:
Define when marketing or sales should act based on observable customer or prospect signals.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- Customer signal column
- Prospect signal column
- Signal cards
- Signal header
- Signal detail/body
- Activation steps

Customizable content:

- signal categories
- signal names
- signal descriptions
- signal thresholds
- account or customer examples
- activation steps
- ownership language
- opportunity-specific signals

Never change elements:

- section label: `Signal Intelligence`
- section number: `06`
- rail group: `EXECUTION`
- customer/prospect signal split
- signal-to-action logic
- requirement that signals be observable, actionable, and not vague
- market signals should inform marketing and sales response

### 07. Commercial Activation

Purpose:
Turn signals and audience logic into coordinated commercial action with visible channel economics.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- Commercial activation container
- Commercial activation header with a specific campaign name (never a generic label like "commercial activation program")
- Four-part commercial activation grid
- Connector/bridge from Step 03 (Channels) down to a visually separate Channel Economics panel
- Channel Economics: a live budget summary strip (total investment / pipeline / revenue / blended ROI), a budget-allocated progress bar, and an editable table — one number input per channel, min/max constrained
- "Optimize Mix" button
- Directional-scenario disclaimer text

Interaction contract (added — do not omit on future pages):

- Investment is editable per channel. Editing recalculates that row's pipeline, revenue, and ROI immediately, plus the summary totals and budget bar.
- Pipeline and revenue follow a diminishing-returns curve — `pipeline(spend) = cap * (1 - e^(-spend / k))`, `revenue = pipeline * winRate` — never a flat linear multiplier. Calibrate `cap`, `k`, and `winRate` per channel so the default allocation's ROI matches the story you're telling.
- The sum of all channel investments can never exceed the stated max budget; an over-limit edit clamps to the remaining headroom.
- No single channel can exceed 45% of the total allocated budget. Channels that represent a strategic/relationship motion (e.g. executive email nurture, executive workshops) should carry a small minimum floor rather than being allowed to hit zero.
- "Optimize Mix" reallocates the full budget using marginal-return logic (spend flows to whichever channel has the highest marginal dollar return next), respecting the same min/max constraints — it must never dump the entire budget into the single highest-ROI channel, and every channel must retain meaningful spend after optimizing.
- All of this is illustrative and must say so — pair it with a disclaimer such as "Directional scenario based on illustrative response and conversion assumptions."

Customizable content:

- activation name
- audience definition
- message angle
- channel mix (names, cap/k/winRate parameters, default allocation)
- max total budget
- ROI or payback language
- sales handoff language
- performance indicators
- offer or call to action
- opportunity-specific activation example

Never change elements:

- section label: `Commercial Activation`
- section number: `07`
- rail group: `EXECUTION`
- four-step commercial activation structure
- connection from signal to activation to sales handoff
- commercial activations should show audience, channel economics, pipeline, revenue, and ROI
- the editable, diminishing-returns budget optimizer and the "Optimize Mix" behavior described above
- the campaign name convention — always a specific named campaign, never a generic program label

## MEASUREMENT & SYSTEM

### 08. Sales Motion

Purpose:
Define how sales uses the same intelligence layer to prioritize accounts, shape outreach, and create pipeline.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- Sales board
- Three sales motion columns
- Sales column headers
- Sales action lists

Customizable content:

- sales motion names
- account or prospect tier labels
- motion descriptors
- seller assignment logic
- talk-track guidance
- sales assets
- KPIs by motion
- opportunity-specific sales execution assumptions

Never change elements:

- section label: `Sales Motion`
- section number: `08`
- rail group: `MEASUREMENT & SYSTEM`
- three-column sales board pattern
- role of shared intelligence across marketing and sales
- connection to segmentation, TAM, tiering, and signals
- sales motion should stay concise and action-oriented

### 09. M+S Alignment

Purpose:
Show marketing and sales operating from the same KPI framework, customer intelligence, and market opportunity model.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- Alignment grid
- Marketing outputs column
- Shared intelligence layer center column
- Sales outputs column
- 30–60–90 day executive roadmap (`.roadmap-grid`), placed after the alignment grid within this section

Roadmap contract (added — do not omit on future pages):

- Three columns: 30 Days / Align, 60 Days / Activate, 90 Days / Optimize.
- This is a standalone roadmap block, not an eleventh section — it lives inside M+S Alignment (or, alternatively, inside Sales Motion or immediately before Return to Dashboard, but pick one placement and keep it consistent).
- Five short bullets per phase, executive-level, never a granular project-management task list.
- Tailor the language per opportunity (e.g. for a research/analytics engagement: operating-model baseline, insight adoption, launch readiness) while keeping the Align → Activate → Optimize arc intact.

Customizable content:

- marketing output labels
- shared intelligence labels
- sales output labels
- handoff language
- operating cadence references
- opportunity-specific alignment recommendations
- roadmap bullet language per phase

Never change elements:

- section label: `M+S Alignment`
- section number: `09`
- rail group: `MEASUREMENT & SYSTEM`
- three-part alignment layout
- marketing left, shared intelligence center, sales right
- purpose of showing one system with two execution engines
- shared intelligence should guide both swimlanes
- the 30–60–90 day roadmap and its three-phase structure

### 10. Return to Dashboard

Purpose:
Return to the executive dashboard and show how every metric now has a commercial system behind it.

Required components:

- Chapter eyebrow
- Stage title
- Stage body
- Stage quote
- Return dashboard grid
- Metric/source cards
- System flow
- Final complete-system box

Customizable content:

- dashboard layer names
- KPI labels
- KPI values
- metric source descriptions
- system flow labels
- system flow items
- final summary copy
- opportunity-specific measurement story

Never change elements:

- section label: `Return to Dashboard`
- section number: `10`
- rail group: `MEASUREMENT & SYSTEM`
- return dashboard grid pattern
- system flow pattern
- final complete-system box
- role of this section as the closing performance layer
- dashboard metrics should tie directly back to Chapter 1 KPI Foundation

## Validation Expectations

Every future opportunity-specific output using this page format should pass these checks before publish:

- The page has exactly ten sections.
- The section labels exactly match the canonical navigation structure.
- The sections appear in the canonical order.
- The three rail groups appear at the correct positions.
- Every section includes the required components listed in this contract.
- Custom content is opportunity-specific and fits the existing design.
- "Never change" elements are unchanged.
- Public facts, directional hypotheses, and recommendations are distinct.
- Internal priorities or constraints are not stated as facts unless provided.
- The final strategy acknowledges that recommendations should evolve after internal constraints are learned.
- Audience Architecture's tier cards are interactive and swap the correct two personas per tier, with a clear active state.
- The Prospect Funnel's tier callouts are visibly connected to the funnel (composition bridge/bar), never floating as an unrelated block.
- Commercial Activation's Channel Economics table is editable, enforces the budget cap and the 45%-per-channel cap, and "Optimize Mix" produces a believable mixed allocation.
- A 30–60–90 day roadmap is present in exactly one of: M+S Alignment, Sales Motion, or immediately before Return to Dashboard.
- No pharma/industry-specific language has leaked into the generic canonical template, and no generic placeholder language ("Market 1", "commercial activation program") has leaked into an opportunity-specific page.
