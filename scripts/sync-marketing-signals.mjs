#!/usr/bin/env node
// Ingests the RevHub-Marketing Signals tab (columns A-H) from a published
// CSV export into Supabase's company_signals table, normalizing
// lead_origin/opportunity_type against the approved value lists. The
// canonical company-level fields (canonical_lead_type, signal_count, etc.)
// are NOT computed here - they're recomputed automatically by the
// trg_company_signals_recompute_lead_type trigger in
// supabase/migrations/leadtype_phase1_foundation.sql the moment a signal
// row is inserted or updated.
//
// Usage:
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=xxxx \
//   node scripts/sync-marketing-signals.mjs --csv "https://docs.google.com/.../pub?output=csv"
//
// Or against a local file (useful for a dry run before you have a
// published link):
//   node scripts/sync-marketing-signals.mjs --csv ./signals.csv --dry-run
//
// Why the service role key: this script needs to write lead_origin,
// opportunity_type, and engagement_details, which the Phase 1 migration
// revokes SELECT (and by extension, any privilege check PostgREST does on
// a write) on for the `authenticated` role - by design, so a Member's
// logged-in session can never touch them. The service role key bypasses
// that, which is appropriate here because this script runs on your
// machine, not in the browser.

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const getArg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const DRY_RUN = args.includes("--dry-run");
const CSV_SOURCE = getArg("csv");

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!CSV_SOURCE) {
  console.error("Usage: node scripts/sync-marketing-signals.mjs --csv <url-or-path> [--dry-run]");
  process.exit(1);
}
if (!DRY_RUN && (!SUPABASE_URL || !SERVICE_KEY)) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or pass --dry-run to only preview normalization.");
  process.exit(1);
}

const LEAD_ORIGIN_VALUES = ["Active Hiring Signal", "Direct Flexible-Work Opportunity"];
const OPPORTUNITY_TYPE_VALUES = [
  "Fractional Opportunity",
  "Contract Opportunity",
  "Contract-to-Hire",
  "Interim Opportunity",
  "Temporary Assignment",
  "Consulting Project",
  "Full-Time Hiring Signal",
];

// Case-insensitive, whitespace-trimmed match against the approved list.
// Returns null (not a guess) when nothing matches closely - the raw value
// is preserved separately either way, so nothing is lost, just left
// unclassified for Owner review instead of silently misfiled.
const normalizeAgainst = (raw, allowedValues) => {
  if (!raw) return null;
  const cleaned = raw.trim();
  if (!cleaned) return null;
  const match = allowedValues.find((v) => v.toLowerCase() === cleaned.toLowerCase());
  return match ?? null;
};

// Minimal CSV parser - handles quoted fields with embedded commas/quotes/
// newlines, which is all a Google Sheets CSV export produces. Not a
// general-purpose CSV library; don't reuse this for arbitrary CSVs.
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
};

const loadCsv = async (source) => {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Failed to fetch CSV (${res.status}). Is the tab published to web?`);
    return await res.text();
  }
  return readFileSync(source, "utf8");
};

const supabaseFetch = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`Supabase request failed (${res.status}): ${await res.text()}`);
  return res.status === 204 ? null : res.json();
};

const main = async () => {
  const csvText = await loadCsv(CSV_SOURCE);
  const rows = parseCsv(csvText);
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const dataRows = rows.slice(1).filter((r) => r.some((cell) => cell.trim() !== ""));

  const col = (row, name) => {
    const idx = header.indexOf(name);
    return idx >= 0 ? (row[idx] ?? "").trim() : "";
  };

  const report = {
    total: dataRows.length,
    classified: 0,
    needsReview: 0,
    companyNotFound: [],
    upserted: 0,
    errors: [],
  };

  let companiesByLowerName = new Map();
  if (!DRY_RUN) {
    const companies = await supabaseFetch("companies?select=id,name");
    companiesByLowerName = new Map(companies.map((c) => [c.name.trim().toLowerCase(), c.id]));
  }

  for (const row of dataRows) {
    const company = col(row, "company");
    if (!company) continue;

    const rawLeadOrigin = col(row, "lead_origin");
    const rawOpportunityType = col(row, "opportunity_type");
    const leadOrigin = normalizeAgainst(rawLeadOrigin, LEAD_ORIGIN_VALUES);
    const opportunityType = normalizeAgainst(rawOpportunityType, OPPORTUNITY_TYPE_VALUES);

    if (opportunityType) report.classified++;
    else report.needsReview++;

    const payload = {
      company,
      role_title: col(row, "role_title") || null,
      posted_date: col(row, "posted_date") || null,
      source_url: col(row, "source_url") || null,
      notes: col(row, "notes") || null,
      lead_origin: leadOrigin,
      opportunity_type: opportunityType,
      engagement_details: col(row, "engagement_details") || null,
      raw_lead_origin: rawLeadOrigin || null,
      raw_opportunity_type: rawOpportunityType || null,
    };

    const companyId = companiesByLowerName.get(company.toLowerCase());
    if (!companyId) report.companyNotFound.push(company);
    else payload.company_id = companyId;

    if (DRY_RUN) continue;

    // Real upsert on (company, role_title, posted_date, source_url) - the
    // closest thing to a natural key this data has, backed by the
    // company_signals_natural_key unique index (see
    // supabase/migrations/dedupe_company_signals.sql). This used to be a
    // separate GET-then-PATCH-or-POST check, which is a classic
    // check-then-act race: it found 51 duplicate pairs in production (the
    // GET missed an existing row for reasons that never showed up in this
    // script's own logs), because a second, independent request always has
    // a window to fail silently. Resolving the conflict inside a single
    // request lets Postgres itself guarantee there's never a duplicate,
    // regardless of what causes any one request to behave unexpectedly.
    try {
      await supabaseFetch(`company_signals?on_conflict=company,role_title,posted_date,source_url`, {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(payload),
      });
      report.upserted++;
    } catch (err) {
      report.errors.push(`${company}: ${err.message}`);
    }
  }

  console.log(`\n${DRY_RUN ? "DRY RUN — " : ""}RevHub-Marketing Signals sync report`);
  console.log("=".repeat(50));
  console.log(`Rows processed:        ${report.total}`);
  console.log(`Classified (typed):    ${report.classified}`);
  console.log(`Needs owner review:    ${report.needsReview} (opportunity_type didn't match an approved value)`);
  if (!DRY_RUN) {
    console.log(`Upserted:              ${report.upserted}`);
  }
  if (report.companyNotFound.length) {
    const unique = [...new Set(report.companyNotFound)];
    console.log(`\nCompanies not found in companies table (${unique.length}) - signal written with company_id left null, so it won't roll up into that company's canonical lead type until the company record exists:`);
    unique.forEach((c) => console.log(`  - ${c}`));
  }
  if (report.errors.length) {
    console.log(`\nErrors (${report.errors.length}):`);
    report.errors.forEach((e) => console.log(`  - ${e}`));
  }
  console.log("");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
