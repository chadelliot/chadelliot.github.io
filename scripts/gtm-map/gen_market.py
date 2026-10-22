#!/usr/bin/env python3
"""
Generate the market data for /gtm-strategy from Census county boundaries.

    python3 scripts/gtm-map/gen_market.py counties-10m.json > market.json

Input: us-atlas counties-10m.json (public domain Census boundaries):
    https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-10m.json
Output: one JSON document the page embeds (county shapes, neighbours, accounts,
competitors, territories, budget model). Everything is ILLUSTRATIVE, and
deterministic (fixed seed) so reruns give the same page.

To build another state, change MARKET (state FIPS, counties, cities, weights).
The page itself reads only the JSON.
"""
import json, math, random, sys

random.seed(24)
topo = json.load(open(sys.argv[1]))

# ────────────────────────────── market definition (Maryland) ──────────────────────────────
MARKET = {
    "name": "Maryland", "fips": "24", "lon0": -77.27, "lat0": 38.8, "S": 300,
    "neighbors": {"42": "Pennsylvania", "10": "Delaware", "51": "Virginia", "54": "West Virginia", "11": "D.C.", "34": "New Jersey"},
    "counties": {  # fips: (name, weight, territory)
        "24001": ("Allegany", .12, "west"), "24003": ("Anne Arundel", .85, "metro"), "24005": ("Baltimore", 1.0, "metro"),
        "24009": ("Calvert", .15, "capital"), "24011": ("Caroline", .07, "west"), "24013": ("Carroll", .35, "metro"),
        "24015": ("Cecil", .25, "metro"), "24017": ("Charles", .30, "capital"), "24019": ("Dorchester", .07, "west"),
        "24021": ("Frederick", .60, "capital"), "24023": ("Garrett", .05, "west"), "24025": ("Harford", .45, "metro"),
        "24027": ("Howard", .70, "metro"), "24029": ("Kent", .05, "west"), "24031": ("Montgomery", 1.0, "capital"),
        "24033": ("Prince George's", .95, "capital"), "24035": ("Queen Anne's", .10, "west"), "24037": ("St. Mary's", .20, "capital"),
        "24039": ("Somerset", .05, "west"), "24041": ("Talbot", .10, "west"), "24043": ("Washington", .30, "west"),
        "24045": ("Wicomico", .22, "west"), "24047": ("Worcester", .10, "west"), "24510": ("Baltimore City", .90, "metro"),
    },
    "territories": [
        {"id": "metro", "name": "Metro corridor", "owner": "Rep A", "color": "#4a9e7a", "msg": "Fast response, same-day service", "hub": "Baltimore",
         "cap": 520, "k": 40},
        {"id": "capital", "name": "Capital region", "owner": "Rep B", "color": "#3b6fb0", "msg": "One partner, fewer vendors", "hub": "Rockville",
         "cap": 900, "k": 80},
        {"id": "west", "name": "West and Shore", "owner": "Rep C", "color": "#7a6fb0", "msg": "Local service you can count on", "hub": "Salisbury",
         "cap": 240, "k": 30},
    ],
    "cities": {  # name: (lon, lat)
        "Baltimore": (-76.612, 39.290), "Annapolis": (-76.492, 38.978), "Rockville": (-77.153, 39.084), "Frederick": (-77.411, 39.414),
        "Hagerstown": (-77.720, 39.642), "Cumberland": (-78.763, 39.652), "Salisbury": (-75.599, 38.360), "Ocean City": (-75.085, 38.336),
        "Columbia": (-76.839, 39.204), "Towson": (-76.602, 39.401), "Waldorf": (-76.939, 38.624), "Bowie": (-76.779, 39.007),
        "Elkton": (-75.833, 39.607), "Easton": (-76.077, 38.774), "Aberdeen": (-76.164, 39.509), "Lexington Park": (-76.453, 38.267),
        "Silver Spring": (-77.026, 38.991),
    },
    "pois": [  # market intelligence: kind, label, lon, lat, line
        ("anchor", "Port of Baltimore", -76.575, 39.265, "Terminals, cold storage and warehouses run heavy mechanical loads."),
        ("plane", "BWI Marshall", -76.668, 39.175, "Airport and airline facilities need round-the-clock mechanical service."),
        ("flask", "I-270 biotech corridor", -77.30, 39.20, "Labs and cleanrooms need precise, certified HVAC."),
        ("truck", "Hagerstown logistics hub", -77.720, 39.620, "New warehouses along I-70 and I-81 mean new service contracts."),
        ("shield", "Pax River and APG", -76.43, 38.30, "Defense sites buy on long, procurement-led cycles."),
        ("wheat", "Delmarva poultry and agriculture", -75.70, 38.55, "Poultry and food plants run refrigeration and need fast, local service."),
    ],
    "competitors": [  # key, branch cities
        ("A", ["Baltimore", "Hagerstown"]), ("B", ["Columbia", "Salisbury"]), ("C", ["Rockville", "Waldorf"]),
    ],
    "reach_miles": 22,
    "corridors": {
        "I-95": [(-75.83, 39.60), (-76.16, 39.51), (-76.45, 39.38), (-76.61, 39.29), (-76.80, 39.14), (-76.88, 39.03), (-76.95, 38.83)],
        "I-270": [(-77.15, 39.08), (-77.20, 39.14), (-77.28, 39.26), (-77.41, 39.41)],
        "I-70": [(-76.70, 39.30), (-77.05, 39.30), (-77.41, 39.41), (-77.72, 39.64), (-78.76, 39.65)],
        "US-50": [(-76.49, 38.98), (-76.08, 38.77), (-75.60, 38.36), (-75.09, 38.33)],
    },
    "named": [  # name, industry, city, fit, intent, signal
        ("Harborline Fabrication", "Metal fabrication", "Baltimore", 92, 88, "compete"),
        ("Patapsco Machine Works", "Machining", "Towson", 88, 81, "expand"),
        ("Monocacy Biologics", "Biotech manufacturing", "Frederick", 90, 84, "funding"),
        ("Potomac Facility Services", "Facilities management", "Rockville", 85, 72, "hire"),
        ("Severn Logistics", "3PL warehousing", "Annapolis", 80, 76, "funding"),
        ("Prince George's Builders", "Commercial contracting", "Bowie", 82, 79, "expand"),
        ("Chesapeake Cold Storage", "Cold chain", "Aberdeen", 83, 58, None),
        ("Antietam Packaging", "Packaging", "Hagerstown", 78, 61, "hire"),
        ("Delmarva Poultry Foods", "Food processing", "Salisbury", 74, 66, None),
        ("Conowingo Metals", "Metals", "Elkton", 70, 52, None),
    ],
    "n_random_accounts": 130,
    "budget": 150,            # $K per quarter, matches the Growth Engine page
    "total_opportunity_m": 14.6,
}

# ────────────────────────────── geometry helpers ──────────────────────────────
T = topo["transform"]; SX, SY = T["scale"]; TX, TY = T["translate"]
ARCS = []
for arc in topo["arcs"]:
    x = y = 0; pts = []
    for dx, dy in arc:
        x += dx; y += dy; pts.append((x * SX + TX, y * SY + TY))
    ARCS.append(pts)

def ring(idxs):
    pts = []
    for i in idxs:
        a = ARCS[i] if i >= 0 else ARCS[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts

def polygons(geom):
    if geom["type"] == "Polygon": return [[ring(r) for r in geom["arcs"]]]
    return [[ring(r) for r in poly] for poly in geom["arcs"]]

def proj(lon, lat):
    return ((lon - MARKET["lon0"]) * math.cos(math.radians(MARKET["lat0"])) * MARKET["S"], -(lat - MARKET["lat0"]) * MARKET["S"])

def pr(ring_pts): return [proj(lo, la) for lo, la in ring_pts]

def dp(pts, tol):
    if len(pts) < 4: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True; stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop(); (x1, y1), (x2, y2) = pts[a], pts[b]; dx, dy = x2 - x1, y2 - y1; L = dx * dx + dy * dy; m, idx = 0, -1
        for i in range(a + 1, b):
            px, py = pts[i]
            d = abs((px - x1) * dy - (py - y1) * dx) / math.sqrt(L) if L else math.hypot(px - x1, py - y1)
            if d > m: m, idx = d, i
        if m > tol: keep[idx] = True; stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(pts, keep) if k]

def clip(pts, box):
    xmin, ymin, xmax, ymax = box
    def edge(poly, inside, inter):
        out = []
        for i, cur in enumerate(poly):
            prev = poly[i - 1]
            if inside(cur):
                if not inside(prev): out.append(inter(prev, cur))
                out.append(cur)
            elif inside(prev): out.append(inter(prev, cur))
        return out
    def ix(x):  return lambda p, q: (x, p[1] + (q[1] - p[1]) * (x - p[0]) / (q[0] - p[0]))
    def iy(y):  return lambda p, q: (p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1]), y)
    for inside, inter in [(lambda p: p[0] >= xmin, ix(xmin)), (lambda p: p[0] <= xmax, ix(xmax)), (lambda p: p[1] >= ymin, iy(ymin)), (lambda p: p[1] <= ymax, iy(ymax))]:
        if not pts: break
        pts = edge(pts, inside, inter)
    return pts

def path(rings, tol=.5):
    d = ""
    for r in rings:
        r = dp(r, tol)
        if len(r) < 3: continue
        d += "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in r) + "Z"
    return d

def pip(x, y, poly):
    inside = False; n = len(poly); j = n - 1
    for i in range(n):
        xi, yi = poly[i]; xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi: inside = not inside
        j = i
    return inside

def centroid(poly):
    a = cx = cy = 0
    for i in range(len(poly)):
        x0, y0 = poly[i]; x1, y1 = poly[(i + 1) % len(poly)]; c = x0 * y1 - x1 * y0
        a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
    a *= .5
    return (cx / (6 * a), cy / (6 * a)) if a else poly[0]

def area(poly):
    return abs(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly))) / 2)

# ────────────────────────────── counties ──────────────────────────────
geoms = {str(g["id"]): g for g in topo["objects"]["counties"]["geometries"]}
counties = []; allx = []; ally = []
for fips, (name, w, terr) in MARKET["counties"].items():
    parts = [[pr(r) for r in poly] for poly in polygons(geoms[fips])]
    ext = [p[0] for p in parts]; big = max(ext, key=area)
    for r in ext:
        for x, y in r: allx.append(x); ally.append(y)
    cx, cy = centroid(big)
    counties.append({"id": fips, "name": name, "w": w, "terr": terr, "cx": round(cx, 1), "cy": round(cy, 1),
                     "d": path([r for p in parts for r in p[:1]], .35), "_parts": ext})
minx, maxx, miny, maxy = min(allx), max(allx), min(ally), max(ally)
pad = 26; view = [round(minx - pad, 1), round(miny - pad, 1), round(maxx - minx + 2 * pad, 1), round(maxy - miny + 2 * pad, 1)]
box = (minx - 220, miny - 220, maxx + 220, maxy + 220)

# neighbours (context), clipped and simplified
nb = []
sgeoms = {str(g["id"]): g for g in topo["objects"]["states"]["geometries"]}
for fips, nm in MARKET["neighbors"].items():
    rings = []
    for poly in polygons(sgeoms[fips]):
        c = clip(pr(poly[0]), box)
        if len(c) > 3: rings.append(c)
    nb.append({"name": nm, "d": path(rings, .8)})

# ────────────────────────────── market model ──────────────────────────────
sw = sum(c["w"] for c in counties)
for c in counties:
    c["opp"] = round(MARKET["total_opportunity_m"] * c["w"] / sw, 2)

cities = {n: proj(*ll) for n, ll in MARKET["cities"].items()}
R = MARKET["reach_miles"] / 69 * MARKET["S"]
comp = []
for key, depots in MARKET["competitors"]:
    comp.append({"k": key, "depots": [{"city": c, "x": round(cities[c][0], 1), "y": round(cities[c][1], 1)} for c in depots]})
for c in counties:
    near = [k["k"] for k in comp if any(math.hypot(d["x"] - c["cx"], d["y"] - c["cy"]) <= R for d in k["depots"])]
    c["comp"] = near
    base = .385 - .045 * len(near) + random.uniform(-.008, .008)
    c["win"] = round(min(.44, max(.22, base)), 3)
    c["white"] = len(near) == 0

# accounts
def which(x, y):
    for c in counties:
        for ext in c["_parts"]:
            if pip(x, y, ext): return c
    return None

accts = []
for (name, ind, city, fit, intent, sig) in MARKET["named"]:
    x, y = cities[city]; x += random.uniform(-3, 3); y += random.uniform(-3, 3)
    c = which(x, y) or which(cities[city][0], cities[city][1])
    accts.append({"name": name, "ind": ind, "city": city, "x": round(x, 1), "y": round(y, 1), "fit": fit, "intent": intent, "sig": sig, "county": c["name"] if c else ""})
weights = [c["w"] for c in counties]
tries = 0
while len([a for a in accts if not a.get("name")]) < MARKET["n_random_accounts"] and tries < 20000:
    tries += 1
    c = random.choices(counties, weights)[0]; ext = random.choice(c["_parts"])
    xs = [p[0] for p in ext]; ys = [p[1] for p in ext]
    x = random.uniform(min(xs), max(xs)); y = random.uniform(min(ys), max(ys))
    if not pip(x, y, ext): continue
    fit = int(max(35, min(96, random.gauss(62, 14)))); intent = int(max(4, min(95, random.gauss(38, 22))))
    accts.append({"x": round(x, 1), "y": round(y, 1), "fit": fit, "intent": intent, "county": c["name"]})
for a in accts:
    a["score"] = round(.6 * a["fit"] + .4 * a["intent"])
    a["tier"] = 1 if a["score"] >= 72 else 2 if a["score"] >= 52 else 3
tiers = {t: sum(1 for a in accts if a["tier"] == t) for t in (1, 2, 3)}

# territories: opportunity, accounts, win rate, budget curves
terr = []
for t in MARKET["territories"]:
    cs = [c for c in counties if c["terr"] == t["id"]]
    opp = sum(c["opp"] for c in cs); win = sum(c["win"] * c["opp"] for c in cs) / opp
    n = sum(1 for a in accts if any(a["county"] == c["name"] for c in cs))
    terr.append({**t, "counties": [c["name"] for c in cs], "opp": round(opp, 1), "win": round(win, 3), "accts": n,
                 "hub": {"city": t["hub"], "x": round(cities[t["hub"]][0], 1), "y": round(cities[t["hub"]][1], 1)}})
overall_win = sum(c["win"] * c["opp"] for c in counties) / sum(c["opp"] for c in counties)

B = MARKET["budget"]
def pipe(t, s): return t["cap"] * (1 - math.exp(-s / t["k"]))
def marg(t, s): return t["cap"] / t["k"] * math.exp(-s / t["k"])
equal = [B / len(terr)] * len(terr)
lo, hi = 0.0, 5.0     # bisection on the shared marginal return, floor $10K each
def alloc(l):
    return [max(10, t["k"] * math.log(t["cap"] / t["k"] / l)) for t in terr]
for _ in range(80):
    mid = (lo + hi) / 2
    if sum(alloc(mid)) > B: lo = mid
    else: hi = mid
opt = alloc((lo + hi) / 2)
scale = B / sum(opt); opt = [round(s * scale) for s in opt]
opt[0] += B - sum(opt)
for i, t in enumerate(terr):
    t["equal"] = round(equal[i]); t["opt"] = opt[i]
    t["pipe_equal"] = round(pipe(t, equal[i])); t["pipe_opt"] = round(pipe(t, opt[i]))
    t["marg_equal"] = round(marg(t, equal[i]), 2); t["marg_opt"] = round(marg(t, opt[i]), 2)
    t["rev_opt"] = round(t["pipe_opt"] * t["win"])
money = {
    "budget": B, "pipe_equal": sum(t["pipe_equal"] for t in terr), "pipe_opt": sum(t["pipe_opt"] for t in terr),
    "rev_equal": round(sum(t["pipe_equal"] * t["win"] for t in terr)), "rev_opt": sum(t["rev_opt"] for t in terr),
}

# repeat: the same score applied to other markets (illustrative)
repeat = [
    {"name": "Maryland", "fips": "24", "score": 82, "note": "Playbook proven", "parts": [80, 85, 82]},
    {"name": "Virginia", "fips": "51", "score": 88, "note": "Shares the Capital region", "parts": [90, 82, 92]},
    {"name": "Pennsylvania", "fips": "42", "score": 74, "note": "Two metros, long cycles", "parts": [78, 66, 78]},
    {"name": "North Carolina", "fips": "37", "score": 69, "note": "Fast growth, thin coverage", "parts": [72, 80, 54]},
    {"name": "Ohio", "fips": "39", "score": 61, "note": "Strong incumbents", "parts": [66, 48, 69]},
]
for r in repeat:
    rings = []
    for poly in polygons(sgeoms[r["fips"]]):
        rings.append([(lo, -la) for lo, la in poly[0]])
    allp = [p for rg in rings for p in rg]
    x0 = min(p[0] for p in allp); x1 = max(p[0] for p in allp); y0 = min(p[1] for p in allp); y1 = max(p[1] for p in allp)
    k = 100 / max((x1 - x0) * math.cos(math.radians(39)), (y1 - y0)); fx = k * math.cos(math.radians(39))
    norm = [[((x - x0) * fx, (y - y0) * k) for x, y in rg] for rg in rings]
    r["d"] = path(norm, .6); r["w"] = round((x1 - x0) * fx, 1); r["h"] = round((y1 - y0) * k, 1)

out = {
    "market": {"name": MARKET["name"], "view": view, "reach": round(R, 1), "reach_miles": MARKET["reach_miles"], "total_opp_m": MARKET["total_opportunity_m"],
               "win": round(overall_win, 3), "budget": B, "tiers": tiers, "accounts": len(accts)},
    "counties": [{k: v for k, v in c.items() if not k.startswith("_")} for c in counties],
    "neighbors": nb,
    "cities": {n: [round(p[0], 1), round(p[1], 1)] for n, p in cities.items()},
    "pois": [{"icon": i, "label": l, "x": round(proj(lo, la)[0], 1), "y": round(proj(lo, la)[1], 1), "line": ln} for (i, l, lo, la, ln) in MARKET["pois"]],
    "competitors": comp,
    "corridors": {k: "M" + "L".join(f"{proj(lo, la)[0]:.1f} {proj(lo, la)[1]:.1f}" for lo, la in v) for k, v in MARKET["corridors"].items()},
    "accounts": accts, "territories": terr, "money": money, "repeat": repeat,
}
json.dump(out, sys.stdout, separators=(",", ":"))
sys.stderr.write(f"view={view} counties={len(counties)} accts={len(accts)} tiers={tiers} win={overall_win:.3f} white={[c['name'] for c in counties if c['white']]}\n")
sys.stderr.write(f"money={money} terr={[(t['id'],t['opp'],t['win'],t['accts'],t['equal'],t['opt']) for t in terr]}\n")
