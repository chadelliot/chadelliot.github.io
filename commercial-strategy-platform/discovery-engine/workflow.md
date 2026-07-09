# Discovery Engine Workflow

The Discovery Engine converts normalized intake into a structured discovery package that tells the platform what to research, what can already be supported, and how confidently the evidence should be used.

## Flow

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
```

## Step 1: Receive Normalized Intake

Start with the Intake Engine output.

Do not re-parse raw notes unless the intake object is incomplete or ambiguous.

## Step 2: Identify Research Needs

Map the intake to the discovery areas:

- company overview
- products/services
- industry
- competitors
- customers
- business model
- revenue model
- hiring context
- marketing maturity
- technology signals
- growth signals
- risks

For each area, identify:

- what can already be supported
- what still needs external research
- what still needs internal or provided context
- what open questions should be carried forward

## Step 3: Gather Evidence

Collect source links and note which claims are:

- direct facts
- reasonable inferences
- assumptions that still need validation
- directional recommendations

## Step 4: Score Confidence

Assign confidence for each finding.

Confidence should reflect:

- quality of the source
- number of supporting sources
- recency of the evidence
- consistency across sources
- how much interpretation is required

## Step 5: Emit Discovery Output

Produce the structured discovery output.

The output should make it easy for Commercial Intelligence to:

- see what is known
- see what is uncertain
- see where evidence came from
- see what still needs validation

## Operational Rules

- Keep source links attached to the finding they support.
- Keep facts, inferences, assumptions, and recommendations separate.
- Lower confidence instead of overclaiming.
- Do not create final strategy in this layer.
- Do not invent private context that was not provided.
