// Explicit PostgREST schema selection keeps About Chad separate from finance.
export const PROPOSAL_DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
export const PROPOSAL_DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;
export const PROPOSAL_DB_SCHEMA = (import.meta.env.VITE_PROPOSAL_DB_SCHEMA as string | undefined) || "public";
if (!["public", "aboutchad"].includes(PROPOSAL_DB_SCHEMA)) {
  throw new Error("Unsupported proposal database schema.");
}
export const proposalProfileHeaders = {
  "Accept-Profile": PROPOSAL_DB_SCHEMA,
  "Content-Profile": PROPOSAL_DB_SCHEMA,
};
const legacySessionKey = "aboutchad_proposal_directory_session_v1";
// Never reuse an access/refresh token from a different Supabase project.
export const PROPOSAL_SESSION_STORAGE_KEY = !PROPOSAL_DB_URL ||
  (PROPOSAL_DB_URL === "https://lihuwskumlfgvaltvmpl.supabase.co" && PROPOSAL_DB_SCHEMA === "public")
  ? legacySessionKey
  : `${legacySessionKey}:${new URL(PROPOSAL_DB_URL).host}:${PROPOSAL_DB_SCHEMA}`;
