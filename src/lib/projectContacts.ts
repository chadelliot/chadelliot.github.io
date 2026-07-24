// Reads/writes RevHub project contacts and their progress in Supabase.
// Shares the same login session as the /company directory (one Supabase
// project, two separate sets of tables).

import { getStoredProposalSession, type ProposalSession } from "./companyStatus";

export type ContactStatus =
  | "not_started"
  | "connected"
  | "messaged"
  | "responded"
  | "meeting_set"
  | "closed"
  | "do_not_contact";

export type ProjectContact = {
  id: string;
  company: string;
  industry?: string | null;
  sector?: string | null;
  contact_name?: string | null;
  title?: string | null;
  linkedin_url?: string | null;
  priority?: string | null;
  target_type_raw?: string | null;
  outreach_angle?: string | null;
  value_hypothesis?: string | null;
  legacy_status_notes?: string | null;
  linkedin_connect_message?: string | null;
  intro_message?: string | null;
  follow_up_message?: string | null;
  needs_research: boolean;
  do_not_contact: boolean;
};

export type ContactProgress = {
  contact_id: string;
  status: ContactStatus;
  assigned_to?: string | null;
  updated_at: string;
  updated_by?: string | null;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "member";
};

export type CompanySignal = {
  company: string;
  role_title?: string | null;
  posted_date?: string | null;
  source_url?: string | null;
  notes?: string | null;
};

export type Meeting = {
  id: string;
  contact_id: string;
  set_by?: string | null;
  meeting_date?: string | null;
  confirmed: boolean;
  notes?: string | null;
  created_at: string;
};

export type ClosedDeal = {
  id: string;
  company: string;
  credited_to?: string | null;
  contract_signed_date?: string | null;
  notes?: string | null;
  created_at: string;
};

const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;

const authHeaders = (session: ProposalSession) => ({
  apikey: DB_PUBLIC || "",
  Authorization: `Bearer ${session.access_token}`,
  "Content-Type": "application/json",
});

export { getStoredProposalSession };

export const fetchProjectContacts = async (session: ProposalSession): Promise<ProjectContact[]> => {
  if (!DB_URL) return [];
  const response = await fetch(`${DB_URL}/rest/v1/project_contacts?select=*&order=company.asc`, {
    headers: authHeaders(session),
  });
  if (!response.ok) return [];
  return (await response.json()) as ProjectContact[];
};

export const fetchContactProgress = async (session: ProposalSession): Promise<Record<string, ContactProgress>> => {
  if (!DB_URL) return {};
  const response = await fetch(`${DB_URL}/rest/v1/contact_progress?select=*`, {
    headers: authHeaders(session),
  });
  if (!response.ok) return {};
  const rows = (await response.json()) as ContactProgress[];
  return Object.fromEntries(rows.map((row) => [row.contact_id, row]));
};

export const fetchTeamMembers = async (session: ProposalSession): Promise<TeamMember[]> => {
  if (!DB_URL) return [];
  const response = await fetch(`${DB_URL}/rest/v1/team_members?select=*&order=name.asc`, {
    headers: authHeaders(session),
  });
  if (!response.ok) return [];
  return (await response.json()) as TeamMember[];
};

export const fetchCompanySignals = async (session: ProposalSession): Promise<Record<string, CompanySignal>> => {
  if (!DB_URL) return {};
  const response = await fetch(`${DB_URL}/rest/v1/company_signals?select=*`, {
    headers: authHeaders(session),
  });
  if (!response.ok) return {};
  const rows = (await response.json()) as CompanySignal[];
  return Object.fromEntries(rows.map((row) => [row.company, row]));
};

export const updateContactProgress = async (
  session: ProposalSession,
  contactId: string,
  updates: Partial<Pick<ContactProgress, "status" | "assigned_to">>
): Promise<ContactProgress | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/contact_progress?contact_id=eq.${contactId}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ ...updates, updated_by: session.user.id }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as ContactProgress[];
  return rows[0] ?? null;
};

export const logContactActivity = async (
  session: ProposalSession,
  contactId: string,
  eventType: string,
  eventDetail?: string
): Promise<void> => {
  if (!DB_URL) return;
  await fetch(`${DB_URL}/rest/v1/contact_activity`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({ contact_id: contactId, event_type: eventType, event_detail: eventDetail, actor: session.user.id }),
  });
};

export const fetchMeetings = async (session: ProposalSession): Promise<Meeting[]> => {
  if (!DB_URL) return [];
  const response = await fetch(`${DB_URL}/rest/v1/meetings?select=*&order=meeting_date.desc`, {
    headers: authHeaders(session),
  });
  if (!response.ok) return [];
  return (await response.json()) as Meeting[];
};

export const createMeeting = async (
  session: ProposalSession,
  contactId: string,
  setBy: string | null,
  meetingDate: string,
  notes: string
): Promise<Meeting | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/meetings`, {
    method: "POST",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ contact_id: contactId, set_by: setBy, meeting_date: meetingDate, notes, confirmed: true }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Meeting[];
  return rows[0] ?? null;
};

export const fetchClosedDeals = async (session: ProposalSession): Promise<ClosedDeal[]> => {
  if (!DB_URL) return [];
  const response = await fetch(`${DB_URL}/rest/v1/closed_deals?select=*&order=contract_signed_date.desc`, {
    headers: authHeaders(session),
  });
  if (!response.ok) return [];
  return (await response.json()) as ClosedDeal[];
};

export const createClosedDeal = async (
  session: ProposalSession,
  company: string,
  creditedTo: string | null,
  contractSignedDate: string,
  notes: string
): Promise<ClosedDeal | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/closed_deals`, {
    method: "POST",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ company, credited_to: creditedTo, contract_signed_date: contractSignedDate, notes }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as ClosedDeal[];
  return rows[0] ?? null;
};

// Matches the signed-in session to a team_members row by email, since that's
// what the person actually logs in with - avoids needing team_members.id to
// be manually set to match their Supabase Auth user ID.
export const findCurrentTeamMember = (session: ProposalSession, teamMembers: TeamMember[]): TeamMember | null => {
  const email = session.user.email?.toLowerCase();
  if (!email) return null;
  return teamMembers.find((m) => m.email.toLowerCase() === email) ?? null;
};

export const STATUS_LABELS: Record<ContactStatus, string> = {
  not_started: "Not started",
  connected: "Connected",
  messaged: "Messaged",
  responded: "Responded",
  meeting_set: "Meeting set",
  closed: "Closed",
  do_not_contact: "Do not contact",
};

export const getInitials = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
};
