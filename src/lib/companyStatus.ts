// Reads/writes the real, cloud-backed company status field in Supabase.
// This replaces what would otherwise be another localStorage-only flag —
// status now survives across devices and browsers, same as your login.

export type CompanyStatusValue =
  | "new"
  | "responded"
  | "meeting_scheduled"
  | "proposal_shared"
  | "closed";

export type CompanyStatusRecord = {
  slug: string;
  status: CompanyStatusValue;
  notes?: string | null;
  updated_at: string;
};

export type ProposalSession = { access_token: string; user: { id: string; email?: string } };

const SESSION_STORAGE_KEY = "aboutchad_proposal_directory_session_v1";
const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;

export const getStoredProposalSession = (): ProposalSession | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ProposalSession) : null;
  } catch {
    return null;
  }
};

const authHeaders = (session: ProposalSession) => ({
  apikey: DB_PUBLIC || "",
  Authorization: `Bearer ${session.access_token}`,
  "Content-Type": "application/json",
});

// Fetches every stored status row in one call, keyed by slug for easy lookup.
export const fetchAllCompanyStatuses = async (
  session: ProposalSession
): Promise<Record<string, CompanyStatusRecord>> => {
  if (!DB_URL) return {};
  const response = await fetch(`${DB_URL}/rest/v1/company_status?select=*`, {
    headers: authHeaders(session),
  });
  if (!response.ok) return {};
  const rows = (await response.json()) as CompanyStatusRecord[];
  return Object.fromEntries(rows.map((row) => [row.slug, row]));
};

// Creates or updates the status row for one company (upsert by slug).
export const upsertCompanyStatus = async (
  session: ProposalSession,
  slug: string,
  status: CompanyStatusValue,
  notes?: string
): Promise<CompanyStatusRecord | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/company_status`, {
    method: "POST",
    headers: {
      ...authHeaders(session),
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({ slug, status, notes }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as CompanyStatusRecord[];
  return rows[0] ?? null;
};

export type NextBestAction = { label: string; reason: string };

// Pure function: given what we actually know about a company, what should
// Chad do next? Manual status (responded / meeting scheduled / proposal
// shared / closed) always wins once it's set, since those can't be guessed
// from the data. Otherwise, the recommendation is derived from the real
// contact and outreach signals already in the directory.
export const getNextBestAction = (params: {
  status?: CompanyStatusValue;
  contactCount: number;
  hasContactedContact: boolean;
  hasEmailPath: boolean;
}): NextBestAction => {
  const { status, contactCount, hasContactedContact, hasEmailPath } = params;

  if (status === "closed") return { label: "Closed", reason: "Marked closed." };
  if (status === "proposal_shared")
    return { label: "Follow up on proposal", reason: "Proposal was shared; check in if you haven't heard back." };
  if (status === "meeting_scheduled")
    return { label: "Prepare for meeting", reason: "A meeting is scheduled for this opportunity." };
  if (status === "responded")
    return { label: "Move to proposal", reason: "They responded; next step is building the proposal." };

  if (contactCount === 0)
    return { label: "Find a contact", reason: "No contact identified yet for this opportunity." };
  if (!hasContactedContact)
    return {
      label: "Draft outreach",
      reason: hasEmailPath
        ? "A contact is identified but hasn't been reached out to yet."
        : "A contact is identified, but no email path is confirmed yet.",
    };
  return { label: "Follow up", reason: "Outreach was sent; follow up if it's been a while." };
};
