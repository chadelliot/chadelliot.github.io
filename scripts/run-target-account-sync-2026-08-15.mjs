#!/usr/bin/env node

// Redirect the one-time sync's published-sheet URLs to the live, anyone-readable
// workbook exports. This keeps the production sync tied to the exact live source
// ranges verified in Google Drive rather than the older published snapshot.

const realFetch = globalThis.fetch;
const spreadsheetId = "1BOTCJTXNPOwUVB9BmILDF4xgDavNOWVGQJSHQCcxy3M";
const targetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=1634326845`;
const contactsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=1770272755`;

globalThis.fetch = (input, init) => {
  const raw = typeof input === "string" ? input : input?.url || String(input);
  if (raw.includes("gid=1634326845")) return realFetch(targetUrl, init);
  if (raw.includes("gid=1770272755")) return realFetch(contactsUrl, init);
  return realFetch(input, init);
};

await import("./sync-target-accounts-2026-08-15.mjs");
