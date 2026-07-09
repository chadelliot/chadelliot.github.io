# Commercial Intelligence

Commercial Intelligence is the interpretation layer between Discovery and the Opportunity Model.

It turns discovery output and source material into structured strategic understanding before the Opportunity Model is written.

## Why This Layer Exists

Discovery produces facts, observations, signals, and research priorities. That is not yet a strategy.

Commercial Intelligence translates the discovery output and supporting evidence into:

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

This layer keeps the platform disciplined. It prevents the model from collapsing raw notes, assumptions, and recommendations into one undifferentiated blob.

## Architecture

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
Engagement Type
  |
  v
Generators
  |
  v
Deliverables
```

## What Commercial Intelligence Does

Commercial Intelligence:

- interprets public evidence
- labels what is known versus inferred
- scores confidence
- highlights gaps and risks
- produces directional commercial recommendations
- maps insight into the Opportunity Model

## What Commercial Intelligence Does Not Do

Commercial Intelligence does not:

- perform additional research beyond the source set
- invent private priorities or internal constraints
- overstate certainty
- create final deliverables
- replace the Opportunity Model
- replace engagement-type framing

## Core Contracts

- `inference-engine.md` defines how inference works.
- `evidence-standards.md` defines what qualifies as support.
- `assumption-confidence.md` defines confidence scoring and escalation.
- `commercial-priorities.md` defines the priority categories the layer can infer.
- `insight-to-strategy-map.md` defines how intelligence maps into the Opportunity Model.

## Operating Rule

Commercial Intelligence should be directional, explicit, and disciplined. If evidence is thin, the layer should say so and lower confidence instead of padding the conclusion.
