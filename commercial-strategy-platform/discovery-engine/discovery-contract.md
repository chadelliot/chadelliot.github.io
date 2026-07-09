# Discovery Contract

This file is the canonical contract for the Discovery Engine.

The Discovery Engine sits after the Intake Engine and before Commercial Intelligence. Its job is to identify what needs to be researched, what can already be confirmed, and how confident the platform should be about each finding.

## Purpose

The Discovery Engine converts a normalized intake object into a structured discovery package that can be used to build Commercial Intelligence without guessing at the evidence base.

## Inputs

Required inputs:

- normalized intake object
- engagement type
- company name
- source material captured during intake

Optional inputs:

- job description URL
- job description text
- company website
- recruiter information
- hiring manager information
- notes
- prior strategy notes
- customer or account context

## Outputs

The Discovery Engine must produce:

- a discovery output object
- a source map
- an evidence summary
- a list of open questions
- a list of external research needs
- a list of internal or provided research needs
- confidence scores for each finding

## Canonical Discovery Areas

The Discovery Engine must cover these areas:

1. Company overview
2. Products/services
3. Industry
4. Competitors
5. Customers
6. Business model
7. Revenue model
8. Hiring context
9. Marketing maturity
10. Technology signals
11. Growth signals
12. Risks

Each area should contain findings with:

- a clear statement
- a finding type
- source links
- supporting evidence
- a confidence level
- a confidence score
- notes about missing information when relevant

## Required Behavior

The Discovery Engine must:

- keep facts, inferences, and assumptions distinct
- lower confidence when evidence is thin
- avoid presenting hypotheses as facts
- preserve source traceability
- surface missing information instead of hiding it
- identify what should be researched externally versus internally

## Non-Negotiables

- Do not write final strategy in the Discovery Engine.
- Do not claim internal knowledge that has not been provided or sourced.
- Do not skip confidence scoring.
- Do not leave a discovery area undocumented without an explicit reason.
- Do not change the Opportunity Model shape here.
