# Assumption Confidence

Commercial Intelligence uses confidence scoring to show how much trust to place in each inference or recommendation.

## Confidence Scale

Use three levels:

- `high`
- `medium`
- `low`

## High Confidence

Use `high` when:

- the evidence is direct
- multiple sources align
- the conclusion is stable and specific

Typical use:

- known company facts
- explicit role requirements
- direct public priorities

## Medium Confidence

Use `medium` when:

- the evidence is credible but indirect
- the conclusion is inferential, not explicit
- the signal is useful but still needs validation

Typical use:

- likely priorities
- probable KPIs
- segment emphasis
- technology stack inference

## Low Confidence

Use `low` when:

- evidence is thin
- only one weak signal exists
- the point is plausible but not well supported

Typical use:

- internal operating constraints
- unverified roadmap assumptions
- speculative budget or ownership guesses

## Scoring Rules

1. Facts can be `high` confidence when directly supported.
2. Inferences should default to `medium`.
3. If there is only one weak signal, use `low`.
4. Do not upgrade confidence just because the conclusion is useful.
5. Do not downgrade useful facts simply because they are not strategic enough.

## Assumption Handling

When evidence is missing:

- state the assumption plainly
- label it as unvalidated
- explain why the assumption is needed
- identify what would confirm or disprove it

## Directional Recommendation Handling

Directional recommendations should use wording like:

- likely
- recommended
- should
- appears to
- directionally

Directional recommendations should not imply certainty about internal priorities.

## Escalation Rule

If a recommendation materially changes scope, economics, or execution risk and confidence is `low`, the model should flag it for validation before publishing.
