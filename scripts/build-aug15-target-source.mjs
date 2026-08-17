#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";

const spreadsheetId = "1BOTCJTXNPOwUVB9BmILDF4xgDavNOWVGQJSHQCcxy3M";
const targetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=1634326845`;
const contactsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=1770272755`;

const companies = [
  "R+L Carriers", "Prime Inc.", "Kenan Advantage Group", "Purolator",
  "Evans Network of Companies", "PS Logistics", "Central Transport International",
  "CRST The Transportation Solution", "OnTrac", "Anderson Trucking Service",
  "Crete Carrier", "Bennett Family of Companies", "Western Express", "Heartland Express",
  "KLLM Transport Services", "C.R. England", "Arrive Logistics", "MODE Global",
  "PSA BDP", "KLN Logistics Group, Americas", "Capstone Logistics", "Scotlynn",
  "Priority1", "Armstrong Transport Group", "Allen Lund Company", "Redwood Logistics",
  "Ryan Transportation Service", "TRAFFIX", "Axle Logistics", "Trinity Logistics",
  "Metro Supply Chain", "Canada Cartage / The GTI Group", "Rollins", "MYR Group",
  "IES Holdings", "Centuri Holdings", "Sterling Infrastructure", "Trinity Industries",
  "The Greenbrier Companies", "Parts Town Unlimited", "ScanSource", "Convergint",
  "AAR CORP.", "FTAI Aviation", "Culligan International", "Watco", "Baker Tilly US",
  "RSK Group", "Grant Thornton Advisors", "Gates Industrial",
];

const canonical = (value = "") => value
  .normalize("NFKD").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "").trim();

const parseCsv = (text) => {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += char;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
};

const objects = (text) => {
  const rows = parseCsv(text);
  const headers = rows.shift().map((h) => h.trim());
  return rows.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])));
};

const load = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch workbook source (${response.status})`);
  return objects(await response.text());
};

const keys = new Set(companies.map(canonical));
const [allAccounts, allContacts] = await Promise.all([load(targetUrl), load(contactsUrl)]);
const accounts = allAccounts.filter((row) => keys.has(canonical(row.Company)));
const contacts = allContacts.filter((row) =>
  keys.has(canonical(row.Company)) && (row["Source / Validation"] || "").includes("2026-08-15")
);

if (accounts.length !== 50) throw new Error(`Expected 50 target accounts, found ${accounts.length}`);
if (contacts.length !== 150) throw new Error(`Expected 150 target contacts, found ${contacts.length}`);

for (const company of companies) {
  const rows = contacts.filter((row) => canonical(row.Company) === canonical(company));
  const slots = new Set(rows.map((row) => row["Target Slot"]));
  if (rows.length !== 3 || !["Target 1", "Target 2", "Target 3"].every((slot) => slots.has(slot))) {
    throw new Error(`${company}: target-slot validation failed`);
  }
}

mkdirSync("public/data", { recursive: true });
writeFileSync(
  "public/data/revhub-targets-2026-08-15.json",
  JSON.stringify({ batch: "2026-08-15", companies, accounts, contacts })
);
console.log(`Built /data/revhub-targets-2026-08-15.json (${accounts.length} companies, ${contacts.length} contacts)`);
