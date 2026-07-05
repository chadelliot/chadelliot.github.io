# Opportunity Model Field Dictionary

This dictionary documents every field in `company-model-template.json`.

Generator abbreviations:

- `SW`: Strategy Website
- `CL`: Cover Letter
- `LO`: LinkedIn Outreach
- `RA`: Resume Alignment
- `IP`: Interview Preparation
- `ES`: Executive Summary
- `PR`: Proposal
- `SOW`: Statement Of Work
- `DW`: Discovery Workshop
- `PT`: Presentation
- `FE`: Follow-Up Email
- `SOP`: Sales One-Pager
- `All`: all generators

## Metadata

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `schemaVersion` | Opportunity Model schema version. | string | yes | `1.0` | All |
| `modelId` | Stable model identifier. | string | yes | `placeholder-opportunity` | All |
| `createdAt` | Date the model was created. | date string | yes | `2026-07-04` | All |
| `updatedAt` | Date the model was last updated. | date string | yes | `2026-07-04` | All |
| `sourceStatus` | Research and validation state. | enum string | yes | `draft` | All |

## Opportunity

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `opportunity.name` | Human-readable opportunity name. | string | yes | `Example VP Marketing Opportunity` | All |
| `opportunity.engagementType` | One of the three supported engagement types. | enum string | yes | `executive-hire` | All |
| `opportunity.stage` | Model workflow stage. | enum string | yes | `model-ready` | All |
| `opportunity.primaryAudience` | Primary reader or decision maker. | string | yes | `Hiring leader and executive team` | All |
| `opportunity.outputTargets[]` | Requested generator outputs. | string array | yes | `["strategy-website"]` | All |
| `opportunity.decisionToSupport` | Decision the output should help the audience make. | string | yes | `Whether to advance the conversation` | All |
| `opportunity.intakeSummary` | Summary of opportunity intake. | string | yes | `The opportunity calls for a commercial growth plan.` | All |
| `opportunity.owner` | Person responsible for the model. | string | no | `Chad Elliot` | All |
| `opportunity.sourceUrls[]` | Source URLs used during intake or research. | URL array | no | `["https://example.com/source"]` | ES, PR, SOW, DW, PT |

## Company

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `company.name` | Organization name. | string | yes | `Example Company` | All |
| `company.website` | Organization website. | URL string | yes | `https://example.com` | All |
| `company.description` | Brief organization description. | string | yes | `A B2B services company.` | All |
| `company.headquarters` | Headquarters or primary location. | string | yes | `Atlanta, GA` | SW, CL, LO, RA, IP, ES, PR, SOW, PT |
| `company.size` | Public or estimated company size. | string | yes | `1,000-5,000 employees` | SW, IP, ES, PR, SOW, PT |
| `company.ownership` | Public, private, PE-backed, nonprofit, or similar. | string | yes | `Private` | SW, IP, ES, PR, SOW, PT |
| `company.sourceNotes` | Notes about company source confidence. | string | no | `Size inferred from public profiles.` | ES, PR, DW, PT |

## Industry

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `industry.name` | Industry name. | string | yes | `Industrial distribution` | All |
| `industry.category` | Broader market category. | string | yes | `B2B services` | SW, CL, LO, RA, IP, ES, PR, PT, SOP |
| `industry.trends[]` | Relevant industry trends. | string array | yes | `["Consolidation"]` | SW, IP, ES, PR, DW, PT, SOP |
| `industry.regulatoryFactors[]` | Regulatory or compliance factors. | string array | no | `["State-level requirements"]` | ES, PR, SOW, DW, PT |
| `industry.marketDynamics[]` | Market conditions shaping the strategy. | string array | yes | `["Margin pressure"]` | SW, IP, ES, PR, DW, PT, SOP |
| `industry.sourceNotes` | Notes about industry sources. | string | no | `Trend based on public reporting.` | ES, PR, DW, PT |

## Business Model

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `businessModel.type` | Business model category. | string | yes | `B2B subscription and services` | All |
| `businessModel.revenueStreams[]` | Primary revenue sources. | string array | yes | `["Subscriptions"]` | SW, IP, ES, PR, SOW, PT, SOP |
| `businessModel.pricingModel` | Known or inferred pricing model. | string | yes | `Contracted annual pricing` | SW, IP, ES, PR, SOW, PT |
| `businessModel.salesMotion` | Dominant go-to-market motion. | string | yes | `Enterprise sales-led` | All |
| `businessModel.customerEconomics` | Notes on customer value, retention, expansion, or economics. | string | no | `Expansion likely depends on multi-site penetration.` | SW, IP, ES, PR, PT, SOP |
| `businessModel.sourceNotes` | Notes about business model source confidence. | string | no | `Pricing inferred from offer language.` | ES, PR, DW, PT |

## Role

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `role.title` | Role, mandate, or stakeholder title. | string | yes | `VP Marketing` | CL, LO, RA, IP, ES, PR, SOW, DW, PT |
| `role.function` | Functional area. | string | yes | `Marketing` | CL, RA, IP, ES, PR, SOW, DW, PT |
| `role.seniority` | Level or decision authority. | string | yes | `Executive` | CL, LO, RA, IP, ES, PR, SOW, PT |
| `role.responsibilities[]` | Role responsibilities or mandate elements. | string array | yes | `["Pipeline creation"]` | CL, RA, IP, ES, PR, SOW, DW, PT |
| `role.successMetrics[]` | Metrics likely used to judge success. | string array | yes | `["Qualified pipeline"]` | SW, CL, RA, IP, ES, PR, SOW, PT, SOP |
| `role.stakeholders[]` | Key internal or external stakeholders. | string array | no | `["CEO"]` | SW, CL, RA, IP, ES, PR, SOW, DW, PT |
| `role.sourceNotes` | Notes about role source confidence. | string | no | `Responsibilities sourced from posting.` | CL, RA, IP, DW |

## Objectives

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `objectives.primaryObjective` | Main business objective. | string | yes | `Increase high-quality pipeline.` | All |
| `objectives.businessOutcomes[].label` | Outcome label. | string | yes | `Revenue growth` | SW, CL, RA, IP, ES, PR, SOW, PT, SOP |
| `objectives.businessOutcomes[].target` | Target, range, or directional goal. | string | yes | `Improve qualified pipeline` | SW, IP, ES, PR, SOW, PT, SOP |
| `objectives.businessOutcomes[].rationale` | Why the outcome matters. | string | yes | `Supports market expansion.` | SW, IP, ES, PR, PT, SOP |
| `objectives.operatingPrinciples[]` | Principles that should guide execution. | string array | yes | `["Prioritize measurable growth"]` | SW, IP, ES, PR, DW, PT |
| `objectives.validationQuestions[]` | Questions that need internal validation. | string array | no | `["Which segments have highest margin?"]` | IP, ES, PR, DW, PT |

## Commercial Challenges

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `commercialChallenges[].name` | Challenge name. | string | yes | `Fragmented demand signals` | SW, IP, ES, PR, DW, PT, SOP |
| `commercialChallenges[].description` | Challenge explanation. | string | yes | `Signals exist but may not be operationalized.` | SW, IP, ES, PR, DW, PT, SOP |
| `commercialChallenges[].evidence` | Public evidence or note. | string | no | `Inferred from current site and role scope.` | ES, PR, DW, PT |
| `commercialChallenges[].impact` | Expected business impact. | string | yes | `Lower conversion efficiency.` | SW, IP, ES, PR, DW, PT, SOP |
| `commercialChallenges[].confidence` | Confidence level. | enum string | yes | `medium` | ES, PR, DW, PT |

## Growth Opportunities

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `growthOpportunities[].name` | Opportunity name. | string | yes | `Segment-based expansion` | All |
| `growthOpportunities[].description` | Opportunity explanation. | string | yes | `Build segment-specific acquisition and expansion plays.` | SW, CL, RA, IP, ES, PR, SOW, PT, SOP |
| `growthOpportunities[].segment` | Segment connected to the opportunity. | string | no | `Enterprise accounts` | SW, IP, ES, PR, PT, SOP |
| `growthOpportunities[].impact` | Expected commercial impact. | string | yes | `Higher deal quality.` | SW, CL, RA, IP, ES, PR, PT, SOP |
| `growthOpportunities[].activationPath` | How the opportunity should be activated. | string | yes | `Prioritize signals and launch account plays.` | SW, IP, ES, PR, SOW, DW, PT, SOP |
| `growthOpportunities[].confidence` | Confidence level. | enum string | yes | `medium` | ES, PR, DW, PT |

## Audience

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `audience.icp` | Ideal customer profile. | string | yes | `Multi-site operators with complex buying groups.` | SW, IP, ES, PR, PT, SOP |
| `audience.customerSegmentsSummary` | Summary of customer segments. | string | yes | `Enterprise and regional operators have different buying needs.` | SW, IP, ES, PR, PT, SOP |
| `audience.buyingCommittee[].role` | Buying committee role. | string | yes | `Economic buyer` | SW, IP, ES, PR, DW, PT, SOP |
| `audience.buyingCommittee[].influence` | Influence level or type. | string | yes | `Final decision authority` | SW, IP, ES, PR, DW, PT |
| `audience.buyingCommittee[].priorities[]` | Priorities for the role. | string array | yes | `["Revenue growth"]` | SW, IP, ES, PR, DW, PT, SOP |
| `audience.buyingCommittee[].objections[]` | Likely objections or concerns. | string array | yes | `["Implementation effort"]` | SW, IP, ES, PR, DW, PT, SOP |
| `audience.notes` | Additional audience notes. | string | no | `Buyer roles may vary by segment.` | ES, PR, DW, PT |

## Segmentation

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `segmentation.segmentLogic` | Rationale for segmentation. | string | no | `Prioritize accounts by size, urgency, and fit.` | SW, IP, ES, PR, PT, SOP |
| `segmentation.segments[].label` | Short segment label. | string | yes | `Segment A` | SW, ES, PR, PT, SOP |
| `segmentation.segments[].name` | Segment name. | string | yes | `Enterprise operators` | SW, IP, ES, PR, PT, SOP |
| `segmentation.segments[].description` | Segment description. | string | yes | `Large accounts with multi-location needs.` | SW, IP, ES, PR, PT, SOP |
| `segmentation.segments[].priority` | Segment priority. | enum string | yes | `high` | SW, IP, ES, PR, PT, SOP |
| `segmentation.segments[].opportunitySize` | Relative or quantified opportunity size. | string | yes | `High` | SW, ES, PR, PT, SOP |
| `segmentation.segments[].painPoints[]` | Segment pain points. | string array | yes | `["Operational complexity"]` | SW, IP, ES, PR, PT, SOP |
| `segmentation.segments[].recommendedMotion` | Recommended commercial motion. | string | yes | `Expand and retain` | SW, IP, ES, PR, SOW, PT, SOP |
| `segmentation.exclusions[]` | Segments or use cases to avoid. | string array | no | `["Low-fit accounts"]` | ES, PR, SOW, DW |

## TAM

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `tam.headlineMetric` | TAM headline or key sizing statement. | string | yes | `A focused set of high-fit accounts.` | SW, ES, PR, PT, SOP |
| `tam.addressableAccounts` | Account count, range, or proxy. | string | yes | `2,000-4,000 accounts` | SW, ES, PR, PT, SOP |
| `tam.assumptions[]` | TAM assumptions. | string array | yes | `["Based on public market sizing proxies"]` | SW, ES, PR, DW, PT |
| `tam.marketSegments[].label` | Market segment label. | string | yes | `Enterprise` | SW, ES, PR, PT, SOP |
| `tam.marketSegments[].value` | Segment value, count, or directional weight. | string | yes | `High` | SW, ES, PR, PT, SOP |
| `tam.marketSegments[].assumption` | Segment sizing assumption. | string | yes | `Requires validation with internal CRM data.` | SW, ES, PR, DW, PT |
| `tam.mapDots[].label` | Visual map point label. | string | no | `High-value accounts` | SW, PT |
| `tam.mapDots[].x` | Horizontal map coordinate from 0 to 100. | number | no | `50` | SW, PT |
| `tam.mapDots[].y` | Vertical map coordinate from 0 to 100. | number | no | `50` | SW, PT |
| `tam.mapDots[].tone` | Visual tone for map point. | enum string | no | `primary` | SW, PT |
| `tam.sourceNotes` | Notes about TAM source confidence. | string | no | `Sizing is directional.` | ES, PR, DW, PT |

## Personas

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `personas[].role` | Persona role. | string | yes | `Revenue leader` | SW, IP, ES, PR, DW, PT, SOP |
| `personas[].name` | Optional persona label. | string | no | `The growth executive` | SW, PT |
| `personas[].decisionLens` | How the persona evaluates decisions. | string | yes | `Impact on pipeline quality.` | SW, IP, ES, PR, DW, PT, SOP |
| `personas[].jobToDo` | Job the persona needs accomplished. | string | yes | `Prioritize high-fit opportunities.` | SW, IP, ES, PR, DW, PT, SOP |
| `personas[].painPoints[]` | Persona pain points. | string array | yes | `["Low signal quality"]` | SW, IP, ES, PR, PT, SOP |
| `personas[].triggers[]` | Triggers that create urgency. | string array | no | `["New growth target"]` | SW, IP, ES, PR, DW, PT, SOP |
| `personas[].message` | Recommended message. | string | yes | `Focus effort where buyer urgency is visible.` | SW, CL, LO, IP, ES, PR, PT, SOP |
| `personas[].proofNeeded[]` | Proof points needed to build confidence. | string array | no | `["Pipeline conversion evidence"]` | SW, IP, ES, PR, DW, PT, SOP |

## Journey

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `journey.stages[].name` | Journey stage name. | string | yes | `Problem recognition` | SW, IP, ES, PR, DW, PT, SOP |
| `journey.stages[].buyerQuestion` | Buyer question at that stage. | string | yes | `Why change now?` | SW, IP, ES, PR, DW, PT, SOP |
| `journey.stages[].contentNeed` | Content needed to support the buyer. | string | yes | `Problem framing` | SW, PR, SOW, DW, PT, SOP |
| `journey.stages[].salesAction` | Sales action for the stage. | string | yes | `Confirm urgency and fit.` | SW, PR, SOW, DW, PT, SOP |
| `journey.stages[].friction` | Likely friction at the stage. | string | yes | `Unclear cost of inaction.` | SW, IP, ES, PR, DW, PT |
| `journey.frictionNotes` | Additional journey friction notes. | string | no | `Procurement can slow late-stage movement.` | ES, PR, DW, PT |

## Signals

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `signals.customerSignals[].name` | Existing-customer signal name. | string | yes | `Expansion intent` | SW, ES, PR, SOW, DW, PT, SOP |
| `signals.customerSignals[].description` | Existing-customer signal description. | string | yes | `Usage or account behavior indicates expansion fit.` | SW, ES, PR, SOW, DW, PT, SOP |
| `signals.customerSignals[].threshold` | Threshold that should trigger action. | string | yes | `Crosses expansion-readiness score.` | SW, PR, SOW, DW, PT |
| `signals.customerSignals[].interpretation` | Meaning of the signal. | string | yes | `Account may be ready for broader adoption.` | SW, ES, PR, DW, PT, SOP |
| `signals.customerSignals[].activationSteps[]` | Actions to take when signal appears. | string array | yes | `["Launch expansion play"]` | SW, PR, SOW, DW, PT, SOP |
| `signals.prospectSignals[].name` | Prospect signal name. | string | yes | `Hiring for growth roles` | SW, ES, PR, SOW, DW, PT, SOP |
| `signals.prospectSignals[].description` | Prospect signal description. | string | yes | `A public hiring signal suggests investment.` | SW, ES, PR, SOW, DW, PT, SOP |
| `signals.prospectSignals[].threshold` | Threshold that should trigger action. | string | yes | `Multiple relevant signals in 90 days.` | SW, PR, SOW, DW, PT |
| `signals.prospectSignals[].interpretation` | Meaning of the prospect signal. | string | yes | `Likely commercial transformation need.` | SW, ES, PR, DW, PT, SOP |
| `signals.prospectSignals[].activationSteps[]` | Actions to take when signal appears. | string array | yes | `["Prioritize account research"]` | SW, PR, SOW, DW, PT, SOP |
| `signals.dataGaps[]` | Data gaps limiting signal quality. | string array | no | `["CRM source-of-truth unclear"]` | ES, PR, SOW, DW, PT |

## Campaigns

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `campaigns[].name` | Campaign or activation play name. | string | yes | `Executive account expansion` | SW, ES, PR, SOW, DW, PT, SOP |
| `campaigns[].audience` | Campaign audience. | string | yes | `Enterprise operators` | SW, ES, PR, SOW, DW, PT, SOP |
| `campaigns[].message` | Campaign message. | string | yes | `Align commercial effort to visible demand.` | SW, CL, LO, IP, ES, PR, PT, SOP |
| `campaigns[].channels[]` | Channels used by the campaign. | string array | yes | `["Email", "LinkedIn"]` | SW, LO, ES, PR, SOW, DW, PT, SOP |
| `campaigns[].offer` | Offer or call to action. | string | yes | `Commercial signal assessment` | SW, LO, ES, PR, SOW, DW, PT, SOP |
| `campaigns[].salesHandoff` | Sales handoff rule or note. | string | no | `Route high-intent accounts to sales within 24 hours.` | SW, PR, SOW, DW, PT, SOP |
| `campaigns[].successMetric` | Campaign success metric. | string | yes | `Qualified meetings created` | SW, ES, PR, SOW, PT, SOP |

## Sales Motion

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `salesMotion.plays[].name` | Sales play name. | string | yes | `Expansion readiness play` | SW, ES, PR, SOW, DW, PT, SOP |
| `salesMotion.plays[].owner` | Role accountable for the play. | string | yes | `Account executive` | SW, ES, PR, SOW, DW, PT |
| `salesMotion.plays[].entryPoint` | Trigger or condition to begin the play. | string | yes | `Account shows expansion signal.` | SW, ES, PR, SOW, DW, PT, SOP |
| `salesMotion.plays[].stakeholders[]` | Stakeholders involved in the play. | string array | yes | `["Sales", "Marketing"]` | SW, ES, PR, SOW, DW, PT |
| `salesMotion.plays[].assets[]` | Assets needed for the play. | string array | yes | `["Executive one-pager"]` | SW, PR, SOW, DW, PT, SOP |
| `salesMotion.plays[].exitCriteria` | Criteria for completing or exiting the play. | string | yes | `Opportunity created or disqualified.` | SW, PR, SOW, DW, PT |
| `salesMotion.plays[].kpis[]` | KPIs for the play. | string array | yes | `["Conversion rate"]` | SW, ES, PR, SOW, PT, SOP |
| `salesMotion.enablementNeeds[]` | Enablement gaps or required materials. | string array | no | `["Discovery questions"]` | PR, SOW, DW, PT, SOP |
| `salesMotion.constraints[]` | Constraints affecting sales execution. | string array | no | `["Limited CRM hygiene"]` | ES, PR, SOW, DW, PT |

## Measurement

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `measurement.northStarMetric` | Primary operating metric. | string | yes | `Qualified pipeline from priority segments` | All |
| `measurement.dashboardMetrics[].label` | Metric label. | string | yes | `Qualified pipeline` | SW, CL, RA, IP, ES, PR, SOW, PT, SOP |
| `measurement.dashboardMetrics[].value` | Placeholder, target, or directional value. | string | yes | `Directional target` | SW, ES, PR, SOW, PT, SOP |
| `measurement.dashboardMetrics[].source` | Source system or data origin. | string | yes | `CRM` | SW, ES, PR, SOW, DW, PT |
| `measurement.dashboardMetrics[].cadence` | Review cadence. | enum string | yes | `monthly` | SW, ES, PR, SOW, DW, PT |
| `measurement.dashboardMetrics[].owner` | Metric owner. | string | yes | `Marketing leader` | SW, ES, PR, SOW, DW, PT |
| `measurement.reviewCadence[].meeting` | Review meeting name. | string | yes | `Monthly revenue review` | SW, ES, PR, SOW, DW, PT |
| `measurement.reviewCadence[].frequency` | Meeting frequency. | enum string | yes | `monthly` | SW, ES, PR, SOW, DW, PT |
| `measurement.reviewCadence[].participants[]` | Meeting participants. | string array | yes | `["Sales", "Marketing"]` | SW, ES, PR, SOW, DW, PT |
| `measurement.reviewCadence[].decisions[]` | Decisions the meeting should make. | string array | yes | `["Where to reallocate budget"]` | SW, ES, PR, SOW, DW, PT |
| `measurement.reportingRisks[]` | Risks to reporting accuracy. | string array | no | `["Attribution gaps"]` | ES, PR, SOW, DW, PT |

## Technology

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `technology.currentSignals[]` | Public or inferred technology signals. | string array | yes | `["CRM likely in place"]` | SW, IP, ES, PR, SOW, DW, PT |
| `technology.probableStack[]` | Probable MarTech, RevTech, data, or analytics stack. | string array | yes | `["CRM", "Marketing automation"]` | SW, IP, ES, PR, SOW, DW, PT |
| `technology.dataNeeds[]` | Data required to execute or validate the strategy. | string array | yes | `["Account fit scoring"]` | SW, ES, PR, SOW, DW, PT |
| `technology.automationOpportunities[]` | Automation opportunities. | string array | yes | `["Signal-based routing"]` | SW, ES, PR, SOW, DW, PT, SOP |
| `technology.aiOpportunities[]` | AI-enabled opportunities. | string array | yes | `["Account research automation"]` | SW, IP, ES, PR, SOW, DW, PT, SOP |
| `technology.constraints[]` | Known or likely technology constraints. | string array | no | `["Data quality unknown"]` | ES, PR, SOW, DW, PT |

## Competitive Landscape

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `competitiveLandscape.competitors[].name` | Competitor or alternative name. | string | yes | `Competitor A` | SW, IP, ES, PR, DW, PT, SOP |
| `competitiveLandscape.competitors[].type` | Competitor type. | string | yes | `Direct competitor` | SW, IP, ES, PR, DW, PT |
| `competitiveLandscape.competitors[].positioning` | Public positioning or market stance. | string | yes | `Full-service provider` | SW, IP, ES, PR, DW, PT, SOP |
| `competitiveLandscape.competitors[].implication` | Strategic implication. | string | yes | `Need clearer differentiation.` | SW, IP, ES, PR, DW, PT, SOP |
| `competitiveLandscape.differentiators[]` | Potential differentiators. | string array | yes | `["Speed to value"]` | SW, CL, LO, IP, ES, PR, PT, SOP |
| `competitiveLandscape.threats[]` | Competitive threats. | string array | yes | `["Commoditization"]` | SW, IP, ES, PR, DW, PT |
| `competitiveLandscape.sourceNotes` | Notes about competitive source confidence. | string | no | `Competitors selected from public search.` | ES, PR, DW, PT |

## Risks

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `risks[].name` | Risk name. | string | yes | `Data quality risk` | SW, IP, ES, PR, SOW, DW, PT |
| `risks[].description` | Risk description. | string | yes | `Incomplete source data could limit prioritization.` | SW, IP, ES, PR, SOW, DW, PT |
| `risks[].likelihood` | Likelihood level. | enum string | yes | `medium` | ES, PR, SOW, DW, PT |
| `risks[].impact` | Impact level. | enum string | yes | `high` | ES, PR, SOW, DW, PT |
| `risks[].mitigation` | Mitigation approach. | string | yes | `Validate with CRM and sales leadership.` | SW, ES, PR, SOW, DW, PT |
| `risks[].assumptionFlag` | Whether the risk depends on an assumption. | boolean | no | `true` | ES, PR, SOW, DW, PT |

## Assumptions

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `assumptions[].id` | Stable assumption identifier. | string | yes | `A1` | ES, PR, SOW, DW, PT |
| `assumptions[].statement` | Assumption statement. | string | yes | `Internal CRM data can support segment prioritization.` | SW, IP, ES, PR, SOW, DW, PT |
| `assumptions[].basis` | Basis for the assumption. | string | yes | `Public role language suggests data focus.` | ES, PR, SOW, DW, PT |
| `assumptions[].validationMethod` | How the assumption should be validated. | string | yes | `Review CRM fields and interview sales leaders.` | IP, ES, PR, SOW, DW, PT |
| `assumptions[].owner` | Person or role responsible for validation. | string | no | `Revenue operations` | PR, SOW, DW, PT |
| `assumptions[].status` | Validation status. | enum string | yes | `unvalidated` | ES, PR, SOW, DW, PT |

## Recommendations

| Name | Description | Type | Required | Example | Used by which generators |
| --- | --- | --- | --- | --- | --- |
| `recommendations[].name` | Recommendation name. | string | yes | `Launch segment-first growth plan` | All |
| `recommendations[].rationale` | Why the recommendation matters. | string | yes | `It focuses resources on highest-fit demand.` | All |
| `recommendations[].action` | Practical action to take. | string | yes | `Define priority segments and launch signal-based plays.` | SW, CL, LO, RA, IP, ES, PR, SOW, DW, PT, FE, SOP |
| `recommendations[].stage` | Timing or roadmap stage. | enum string | yes | `near-term` | SW, IP, ES, PR, SOW, DW, PT, SOP |
| `recommendations[].priority` | Priority level. | enum string | yes | `high` | SW, IP, ES, PR, SOW, DW, PT, SOP |
| `recommendations[].dependencies[]` | Dependencies required before action. | string array | no | `["CRM field validation"]` | ES, PR, SOW, DW, PT |
| `recommendations[].expectedOutcome` | Expected result. | string | yes | `Better conversion from target accounts.` | SW, CL, RA, IP, ES, PR, SOW, PT, SOP |
| `recommendations[].measure` | How success should be measured. | string | yes | `Qualified pipeline by priority segment.` | SW, ES, PR, SOW, PT, SOP |
