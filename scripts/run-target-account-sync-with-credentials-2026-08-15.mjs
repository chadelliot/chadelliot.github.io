#!/usr/bin/env node

// Resolve an elevated Supabase key without ever printing it. Prefer a directly
// configured server key. If the repository instead has a Supabase Management
// API access token, retrieve the project's server-side API key in-memory and
// immediately run the one-time /projects sync.

const projectRef = "lihuwskumlfgvaltvmpl";

const directKey = [
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  process.env.SUPABASE_SECRET_KEY,
  process.env.SUPABASE_SERVICE_KEY,
  process.env.SUPABASE_SERVICE_ROLE,
].find((value) => value && value.trim());

if (directKey) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = directKey.trim();
  console.log("SUPABASE_ELEVATED_CREDENTIAL=direct");
  await import("./run-target-account-sync-2026-08-15.mjs");
} else {
  const accessToken = [
    process.env.SUPABASE_ACCESS_TOKEN,
    process.env.SUPABASE_PAT,
    process.env.SUPABASE_TOKEN,
  ].find((value) => value && value.trim());

  if (!accessToken) {
    console.error("No elevated Supabase key or Management API access token is configured in GitHub Actions secrets.");
    process.exit(1);
  }

  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys?reveal=true`, {
    headers: { Authorization: `Bearer ${accessToken.trim()}` },
  });
  const text = await response.text();
  if (!response.ok) {
    console.error(`Supabase Management API key lookup failed (${response.status}).`);
    process.exit(1);
  }

  const keys = JSON.parse(text);
  const elevated = keys.find((key) => {
    const name = String(key.name || "").toLowerCase();
    const type = String(key.type || "").toLowerCase();
    const apiKey = String(key.api_key || "");
    return name === "service_role" || type === "secret" || apiKey.startsWith("sb_secret_");
  });

  if (!elevated?.api_key) {
    console.error("Management API access succeeded, but no elevated project API key was returned.");
    process.exit(1);
  }

  process.env.SUPABASE_SERVICE_ROLE_KEY = elevated.api_key;
  console.log("SUPABASE_ELEVATED_CREDENTIAL=management_api");
  await import("./run-target-account-sync-2026-08-15.mjs");
}
