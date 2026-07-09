# Discovery Engine

The Discovery Engine is the evidence-shaping layer between the Intake Engine and Commercial Intelligence.

It turns a normalized intake object into a structured discovery package that identifies what is already known, what still needs verification, and which external or internal sources should be used before Commercial Intelligence is written.

## Purpose

The Discovery Engine exists so the platform does not jump from intake directly into strategic interpretation.

It gives every engagement a repeatable discovery pass that:

- identifies the company facts that can be confirmed quickly
- surfaces gaps that need follow-up
- maps the research sources that should be consulted
- assigns confidence levels to each finding
- prepares the evidence set for Commercial Intelligence

## Why This Layer Exists

Without a Discovery Engine, research tends to become ad hoc and inconsistent.

This layer keeps the platform disciplined by making discovery explicit before strategy is inferred. It reduces the chance of overclaiming, prevents generators from seeing raw notes as strategy, and makes the research workload easier to scope.

## Architecture

```text
Opportunity Intake
  |
  v
Intake Engine
  |
  v
Normalized Intake Object
  |
  v
Discovery Engine
  |
  v
Discovery Output
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

## What The Discovery Engine Does

The Discovery Engine:

- consumes the normalized intake object
- identifies external and internal research needs
- collects or organizes source links
- documents company overview, products or services, industry, competitors, customers, business model, revenue model, hiring context, marketing maturity, technology signals, growth signals, and risks
- assigns confidence levels to each finding
- separates confirmed facts from inferences and assumptions
- produces a discovery output that Commercial Intelligence can interpret

## What The Discovery Engine Does Not Do

The Discovery Engine does not:

- write the final Commercial Intelligence brief
- invent private priorities or internal constraints
- create the Opportunity Model
- generate deliverables
- change the engagement type contract

## Core Files

- `discovery-contract.md` defines the canonical discovery contract.
- `discovery-output-schema.json` defines the discovery output schema.
- `example-discovery-output.json` shows a placeholder discovery output.
- `research-source-map.md` maps discovery areas to likely source types.
- `validation-rules.md` defines required fields, confidence rules, missing-data handling, and output checks.
- `workflow.md` documents the operational discovery flow.
