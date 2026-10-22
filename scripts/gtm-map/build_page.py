#!/usr/bin/env python3
"""Assemble public/gtm-strategy/index.html from template.html and market.json.

    python3 scripts/gtm-map/gen_market.py counties-10m.json > market.json
    python3 scripts/gtm-map/build_page.py market.json public/gtm-strategy/index.html
"""
import sys, pathlib
here = pathlib.Path(__file__).parent
data = pathlib.Path(sys.argv[1]).read_text()
out = (here / "template.html").read_text().replace("__DATA__", data)
dest = pathlib.Path(sys.argv[2]); dest.parent.mkdir(parents=True, exist_ok=True); dest.write_text(out)
print(f"wrote {dest} ({len(out):,} bytes)")
