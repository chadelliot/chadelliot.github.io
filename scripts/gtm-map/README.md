# GTM Strategy page generator

Builds `public/gtm-strategy/index.html`: a stepped story about one market, shown on a zoomed-in state map with market and competitive intelligence layered on county by county. Meridian Supply and Maya Chen are illustrative. All figures are illustrative and the page says so on every map.

## Rebuild the page

```bash
# 1. Census county boundaries (public domain, about 830 KB; not committed)
curl -sL -o counties-10m.json https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-10m.json

# 2. Generate the market data (deterministic: fixed random seed)
python3 scripts/gtm-map/gen_market.py counties-10m.json > market.json

# 3. Assemble the page
python3 scripts/gtm-map/build_page.py market.json public/gtm-strategy/index.html
```

`template.html` holds the page (layout, copy, steps, map layers). `__DATA__` is replaced with `market.json`. Copy that quotes a number reads it from the data, so figures always tie out.

## Use a different state or a real client's market

Edit `MARKET` at the top of `gen_market.py`:

| Field | What it is |
|---|---|
| `fips`, `counties` | State FIPS and each county's name, opportunity weight and territory |
| `neighbors` | Surrounding states drawn for context (state FIPS) |
| `cities`, `pois` | City coordinates, and the market-intelligence points (port, airport, hubs) with a one-line reason each |
| `competitors`, `reach_miles` | Depot cities per competitor and how far each reaches. Open ground and win rates come from this |
| `territories` | Name, owner, colour, message, hub city, and the response curve (`cap`, `k`) used for budget |
| `named`, `n_random_accounts` | Named target accounts (fit, intent, signal) and how many scored dots to add |
| `budget`, `total_opportunity_m` | Quarterly budget in $K, and addressable opportunity in $M |
| `corridors` | Highway lines drawn on the market step |

Replace illustrative values with sourced ones for a real client, and tag each as stated, derived or assumed (see `docs/case-builder.md`).

## What each step shows

| Step | Map layer | Intelligence |
|---|---|---|
| Market | Opportunity by county, top cluster outlined | Port, airport, biotech corridor, logistics hubs |
| Competition | Depots, reach circles, open ground | Competitor coverage and white space |
| Customer | Scored account dots | Fit and intent, tiering, one record per account |
| Journey | Win rate by county | Where buyers stall, by competitor density |
| Touchpoints | Territory media zones | Geo-targeted advertising and message by zone |
| Signals | Pulsing signal icons | Funding, hires, permits, competitor evaluations |
| Motion | Territories and owners | One scoreboard |
| Fund | Budget bubbles | Marginal return curves: equal split vs follow the curve |
| Prove | Territory ranges | Revenue target with a range |
| Repeat | Mini state maps | The same score applied to the next markets |
| How I build it | Method and call to action | |
