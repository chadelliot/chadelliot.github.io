# Building a case like the Approach page

Use this when turning call intelligence (transcripts, notes, decks) from a company into a story-driven case at `public/approach/index.html` or a sibling page. The page is static HTML; there is no build step.

## 1. What to extract from the calls

Pull these into a short intake note first, each tagged **stated** (said on a call or in a document), **derived** (computed from stated numbers) or **assumed** (our placeholder). Do not mix them silently. This follows `commercial-strategy-platform/commercial-intelligence/assumption-confidence.md`.

| Need | Feeds | Example from the Meridian case |
|---|---|---|
| The problem in one line, with 2 numbers | Exec summary, Ch 1 | 31.9% win rate vs a 38% target |
| Scoreboard: ~8 KPIs, one of them the problem | Ch 1 | Sales conversion is the hero, the rest are muted |
| Segments: deal size, buying committee, cycle, expansion | Ch 2 | Enterprise / Growth / Mid-Market / Emerging |
| Markets or regions, and where the company already holds share | Ch 3 | Open opportunity by market and segment |
| Buyer personas per focus market, and what to say | Ch 4 | Northeast Enterprise vs Southwest Mid-Market |
| Funnel stages with counts and conversion | Ch 5, Ch 6 | Impressions to closed-won |
| The leak: one stage, its fix, its expected lift | Ch 5 | Opportunity to closed-won, +37 deals, ~$16M |
| Buying and risk signals, tied to a funnel stage | Ch 6 | Eleven signals across seven stages |
| Budget, channels, and a response model | Ch 7 | $150K split across two market plays |
| Gross or contribution margin, program costs | Exec summary | **Usually not on calls. Assume and flag.** |

If a number the story needs is missing, ask for it or assume it and label it. Never present an assumption as a company fact.

## 2. The executive summary is data-driven

`public/approach/index.html` contains a `CASE` object (search for `const CASE`). The first screen renders entirely from it. Change the inputs and the headline, EBITDA bridge, stretch case, payback, metrics, problem, plan and ask all update.

```text
gapRevenueM        annual revenue lost between today's rate and target
captureShare       share of the gap closed in the base case (0.5 = half)
contributionMargin share of incremental revenue left after variable costs   ASSUMED
program.campaignsM campaign spend over the horizon
program.enablementM sales enablement and tooling                            ASSUMED
campaignReturn     revenue per $1 of campaign spend, plan vs today
coverage           pipeline coverage today
nrr                net revenue retention today (secondary line)
plan               three short moves: focus, fix, align
```

Derived on the page:

```text
revenue    = gapRevenueM x captureShare
contrib    = revenue x contributionMargin
EBITDA     = contrib - (campaignsM + enablementM)
payback    = program cost / (contrib / months)
stretch    = full gap (captureShare = 1)
```

The assumptions footnote under the summary is generated from the same inputs. Keep it visible.

## 3. Chapter data lives in the HTML

Chapters 1 to 7 are static HTML plus small scripts. Where numbers must tie out, check them:

- Segment pools and account counts (Ch 2) must equal the totals in Ch 3 (sum of the market x segment grid).
- Ch 3 held accounts must sum to the SOM figure in the rings strip.
- Ch 5 funnel numbers, the Ch 6 funnel graph and Ch 1 KPIs must agree.
- Ch 7 plan returns come from the response model archived in `docs/approach-archive.md`: `pipeline = cap x (1 - e^(-spend/k))`, `revenue = pipeline x winRate`.
- ROI figures in the exec summary, Ch 1 and Ch 7 must be reconciled (today vs plan vs delivered).

## 4. Story rules this page follows

- Open with a short executive summary that is a story first: the character, the company, the problem in two numbers, a three-move plan, then the returns.
- Metric tiers: **primary** (three, big): revenue recovered, ad return, margin defended (EBITDA after program cost). **Secondary** (one small line, never boxes): win rate, payback, pipeline coverage, NRR. If a case has no ad spend or margin data, pick the three marketing-impact numbers the evidence supports and say what is assumed.
- No charts in the summary that need explaining. Numbers carry it; charts belong in the chapters.
- One focus per chapter. Highlight the one thing that matters and grey out the rest.
- Make the answer non-obvious where the data supports it (the best segment differs by market).
- Everything loads in progressively, and charts animate in. Honor reduced motion.
- A character (Maya) asks one question per chapter; the next chapter answers it.
- Mark illustrative companies and illustrative regional or financial data as such.

## 5. QA before sharing

1. Load every chapter at desktop and phone width. No console errors.
2. Count-up numbers settle on their written values (the page self-checks via `data-final`).
3. Search the file for stray names from the previous company.
4. Re-read every assumption and every "stated" number against the source notes.
5. Do not publish until the owner approves. Work on a branch and open a pull request.
