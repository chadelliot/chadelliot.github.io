# Inference Engine

The inference engine is the rule set that converts research evidence into Commercial Intelligence.

It sits between raw research and the Opportunity Model.

## Purpose

The engine determines:

- what can be treated as fact
- what should be treated as inference
- what needs an explicit assumption
- what must remain unresolved
- what confidence level is appropriate

## Inputs

The inference engine reads:

- company research
- product or service research
- leadership messaging
- financial materials
- job descriptions
- customer evidence
- market evidence
- technology evidence
- competitive evidence
- acquisition evidence

## Output Types

The engine can produce:

- facts
- inferred observations
- assumptions
- confidence ratings
- strategic implications
- recommendations

## Fact Versus Inference

### Fact

Use fact when the statement is directly supported by source material.

Fact indicators:

- named in a source
- repeated in multiple sources
- directly observable
- explicitly stated by the company or a credible third party

### Inference

Use inference when the conclusion follows from evidence but is not directly stated.

Inference indicators:

- the source implies the point but does not state it
- multiple public signals point in the same direction
- the conclusion is directionally useful but not proven

### Assumption

Use assumption when the strategy needs a working hypothesis that cannot be fully validated from available sources.

Assumption indicators:

- internal priorities are unknown
- operating constraints are unknown
- data quality is unknown
- buyer behavior is not directly observable

## Inference Rules

1. Prefer explicit facts when available.
2. Use one-step inference when the evidence is strong and direct.
3. Use multi-step inference only when the chain is short and explainable.
4. Mark assumptions whenever the conclusion depends on missing internal context.
5. Never convert a guess into a fact.
6. Never use a recommendation as if it were evidence.

## Output Format

Each inferred statement should carry:

- the inferred point
- the supporting evidence
- the confidence level
- the implication for strategy

## Example

```text
Evidence: public hiring posts emphasize demand generation and analytics.
Inference: the organization likely wants more disciplined measurement and segmentation.
Confidence: medium
Implication: prioritize dashboard clarity and segment-level reporting in the Opportunity Model.
```

## Failure Mode To Avoid

The engine must not produce language like:

- "the company definitely needs..."
- "the executive team wants..."
- "the internal mandate is..."

unless that is explicitly sourced.
