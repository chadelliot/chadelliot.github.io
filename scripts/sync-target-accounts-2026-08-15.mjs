#!/usr/bin/env node

// One-time, idempotent production sync for the 2026-08-15 RevHub target-account batch.
// Source of truth: the published RevHub Target Accounts workbook.
// This script writes ONLY the /projects Supabase tables `companies` and
// `project_contacts`; it does not touch the separate /company directory data.

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const PUBLISHED_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLKem89kammP8oGHNI3TEEmHQ0euvVCOtUh-mUdTaFY_gbBHtJtYo98Ok1Uq9FDwaCqXMVUIR2omyI/pub";
const TARGET_ACCOUNTS_CSV = `${PUBLISHED_BASE}?gid=1634326845&single=true&output=csv`;
const CONTACTS_CSV = `${PUBLISHED_BASE}?gid=1770272755&single=true&output=csv`;

const BATCH_COMPANIES = [
  "R+L Carriers",
  "Prime Inc.",
  "Kenan Advantage Group",
  "Purolator",
  "Evans Network of Companies",
  "PS Logistics",
  "Central Transport International",
  "CRST The Transportation Solution",
  "OnTrac",
  "Anderson Trucking Service",
  "Crete Carrier",
  "Bennett Family of Companies",
  "Western Express",
  "Heartland Express",
  "KLLM Transport Services",
  "C.R. England",
  "Arrive Logistics",
  "MODE Global",
  "PSA BDP",
  "KLN Logistics Group, Americas",
  "Capstone Logistics",
  "Scotlynn",
  "Priority1",
  "Armstrong Transport Group",
  "Allen Lund Company",
  "Redwood Logistics",
  "Ryan Transportation Service",
  "TRAFFIX",
  "Axle Logistics",
  "Trinity Logistics",
  "Metro Supply Chain",
  "Canada Cartage / The GTI Group",
  "Rollins",
  "MYR Group",
  "IES Holdings",
  "Centuri Holdings",
  "Sterling Infrastructure",
  "Trinity Industries",
  "The Greenbrier Companies",
  "Parts Town Unlimited",
  "ScanSource",
  "Convergint",
  "AAR CORP.",
  "FTAI Aviation",
  "Culligan International",
  "Watco",
  "Baker Tilly US",
  "RSK Group",
  "Grant Thornton Advisors",
  "Gates Industrial",
];

const QXO_REVIEW_COMPANIES = new Set([
  "MYR Group",
  "IES Holdings",
  "Centuri Holdings",
  "Sterling Infrastructure",
]);

const canonical = (value = "") =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const normalizedLinkedIn = (value = "") => value.trim().toLowerCase().replace(/[/?#].*$/, "").replace(/\/$/, "");

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

const csvToObjects = (text) => {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))
  );
};

const fetchText = async (url) => {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`Failed to fetch source CSV (${response.status}) ${url}`);
  return response.text();
};

const supabaseFetch = async (path, options = {}) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed (${response.status}): ${text}`);
  }
  return text ? JSON.parse(text) : null;
};

const loadAll = async (table, select) => {
  const output = [];
  const pageSize = 1000;
  let offset = 0;
  while (true) {
    const page = await supabaseFetch(
      `${table}?select=${encodeURIComponent(select)}&order=id.asc&offset=${offset}&limit=${pageSize}`
    );
    output.push(...page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }
  return output;
};

const main = async () => {
  const [accountCsv, contactCsv] = await Promise.all([
    fetchText(TARGET_ACCOUNTS_CSV),
    fetchText(CONTACTS_CSV),
  ]);

  const batchKeys = new Set(BATCH_COMPANIES.map(canonical));
  const accountRows = csvToObjects(accountCsv).filter((row) => batchKeys.has(canonical(row.Company)));
  const contactRows = csvToObjects(contactCsv).filter(
    (row) => batchKeys.has(canonical(row.Company)) && row["Date Added"]?.trim() === "2026-08-15"
  );

  if (accountRows.length !== 50) {
    throw new Error(`Source validation failed: expected 50 companies, found ${accountRows.length}.`);
  }
  if (contactRows.length !== 150) {
    throw new Error(`Source validation failed: expected 150 contacts, found ${contactRows.length}.`);
  }

  for (const company of BATCH_COMPANIES) {
    const rows = contactRows.filter((row) => canonical(row.Company) === canonical(company));
    const slots = new Set(rows.map((row) => row["Target Slot"]));
    if (rows.length !== 3 || !["Target 1", "Target 2", "Target 3"].every((slot) => slots.has(slot))) {
      throw new Error(`Source validation failed for ${company}: expected exactly Target 1/2/3.`);
    }
    for (const row of rows) {
      if (!/^https:\/\/www\.linkedin\.com\/in\//i.test(row["LinkedIn URL / Search"] || "")) {
        throw new Error(`Source validation failed for ${company}/${row["Contact Name"]}: direct LinkedIn URL missing.`);
      }
    }
  }

  console.log(`SOURCE_COMPANIES=${accountRows.length}`);
  console.log(`SOURCE_CONTACTS=${contactRows.length}`);

  let companies = await loadAll("companies", "id,name,normalized_name");
  const companyByKey = new Map();
  for (const company of companies) {
    companyByKey.set(canonical(company.name), company);
    if (company.normalized_name) companyByKey.set(canonical(company.normalized_name), company);
  }

  let companiesInserted = 0;
  let companiesUpdated = 0;

  for (const row of accountRows) {
    const key = canonical(row.Company);
    let company = companyByKey.get(key);
    const payload = {
      name: row.Company.trim(),
      industry: row["Industry Logged"]?.trim() || null,
      sector: row["Sector / Sub-Industry"]?.trim() || null,
      website: row["Source URL"]?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (!company) {
      const created = await supabaseFetch("companies?select=id,name,normalized_name", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ ...payload, normalized_name: row.Company.trim().toLowerCase() }),
      });
      company = created[0];
      companiesInserted++;
    } else {
      const updated = await supabaseFetch(`companies?id=eq.${encodeURIComponent(company.id)}&select=id,name,normalized_name`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
      company = updated[0] || company;
      companiesUpdated++;
    }

    companyByKey.set(key, company);
    companyByKey.set(canonical(company.name), company);
    if (company.normalized_name) companyByKey.set(canonical(company.normalized_name), company);
  }

  let contacts = await loadAll(
    "project_contacts",
    "id,company,company_id,contact_name,linkedin_url"
  );
  const contactByLinkedIn = new Map();
  const contactByCompanyName = new Map();
  for (const contact of contacts) {
    if (contact.linkedin_url) contactByLinkedIn.set(normalizedLinkedIn(contact.linkedin_url), contact);
    contactByCompanyName.set(`${canonical(contact.company)}::${canonical(contact.contact_name)}`, contact);
  }

  let contactsInserted = 0;
  let contactsUpdated = 0;

  for (const row of contactRows) {
    const company = companyByKey.get(canonical(row.Company));
    if (!company) throw new Error(`Could not resolve company record for ${row.Company}.`);

    const linkedinKey = normalizedLinkedIn(row["LinkedIn URL / Search"]);
    const nameKey = `${canonical(row.Company)}::${canonical(row["Contact Name"])}`;
    let contact = contactByLinkedIn.get(linkedinKey) || contactByCompanyName.get(nameKey);

    const isQxoReview = QXO_REVIEW_COMPANIES.has(row.Company.trim());
    const validationNote = row["Source / Validation"]?.trim();
    const statusNote = row.Status?.trim();
    const caution = isQxoReview ? "Needs Review for QXO adjacency before outreach." : "";
    const legacyStatusNotes = [caution, validationNote, statusNote].filter(Boolean).join(" ");

    const payload = {
      company: row.Company.trim(),
      company_id: company.id,
      industry: row["Industry Logged"]?.trim() || null,
      sector: row["Sector / Sub-Industry"]?.trim() || null,
      contact_name: row["Contact Name"]?.trim() || null,
      title: row.Title?.trim() || null,
      linkedin_url: row["LinkedIn URL / Search"]?.trim() || null,
      priority: row.Priority?.trim() || null,
      target_type_raw: row["Target Slot"]?.trim() || null,
      outreach_angle: row["Outreach Angle"]?.trim() || null,
      value_hypothesis: row["Value Hypothesis"]?.trim() || null,
      stakeholder_selection_reason: row.Notes?.trim() || null,
      legacy_status_notes: legacyStatusNotes || null,
      linkedin_connect_message: row["LinkedIn Connect Message"]?.trim() || null,
      intro_message: row["Intro Message"]?.trim() || null,
      follow_up_message: row["Follow-up Message"]?.trim() || null,
    };

    if (!contact) {
      const created = await supabaseFetch("project_contacts?select=id,company,company_id,contact_name,linkedin_url", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ ...payload, needs_research: isQxoReview, do_not_contact: false }),
      });
      contact = created[0];
      contactsInserted++;
    } else {
      const updatePayload = isQxoReview ? { ...payload, needs_research: true } : payload;
      const updated = await supabaseFetch(
        `project_contacts?id=eq.${encodeURIComponent(contact.id)}&select=id,company,company_id,contact_name,linkedin_url`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(updatePayload),
        }
      );
      contact = updated[0] || contact;
      contactsUpdated++;
    }

    contactByLinkedIn.set(linkedinKey, contact);
    contactByCompanyName.set(nameKey, contact);
  }

  // Production readback. Re-fetch from Supabase and prove that all source
  // records now exist there before allowing the workflow to succeed.
  companies = await loadAll("companies", "id,name,normalized_name");
  contacts = await loadAll("project_contacts", "id,company,company_id,contact_name,linkedin_url,target_type_raw,title");

  const verifiedCompanyMap = new Map();
  for (const company of companies) {
    verifiedCompanyMap.set(canonical(company.name), company);
    if (company.normalized_name) verifiedCompanyMap.set(canonical(company.normalized_name), company);
  }

  const missingCompanies = BATCH_COMPANIES.filter((name) => !verifiedCompanyMap.has(canonical(name)));
  if (missingCompanies.length) {
    throw new Error(`Production verification failed. Missing companies: ${missingCompanies.join(", ")}`);
  }

  let verifiedContacts = 0;
  const missingContacts = [];
  for (const source of contactRows) {
    const linkedinKey = normalizedLinkedIn(source["LinkedIn URL / Search"]);
    const match = contacts.find(
      (contact) =>
        normalizedLinkedIn(contact.linkedin_url || "") === linkedinKey ||
        (canonical(contact.company) === canonical(source.Company) && canonical(contact.contact_name) === canonical(source["Contact Name"]))
    );
    if (!match) missingContacts.push(`${source.Company}: ${source["Contact Name"]}`);
    else verifiedContacts++;
  }

  if (verifiedContacts !== 150 || missingContacts.length) {
    throw new Error(`Production verification failed. Verified ${verifiedContacts}/150 contacts. Missing: ${missingContacts.join("; ")}`);
  }

  console.log(`COMPANIES_INSERTED=${companiesInserted}`);
  console.log(`COMPANIES_UPDATED=${companiesUpdated}`);
  console.log(`CONTACTS_INSERTED=${contactsInserted}`);
  console.log(`CONTACTS_UPDATED=${contactsUpdated}`);
  console.log("QXO_REVIEW_COMPANIES=4");
  console.log("VERIFIED_COMPANIES=50");
  console.log("VERIFIED_CONTACTS=150");
  console.log("PRODUCTION_SYNC_OK=true");
};

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
