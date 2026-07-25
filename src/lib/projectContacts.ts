// Reads/writes RevHub project contacts and their progress in Supabase.
// Shares the same login session as the /company directory (one Supabase
// project, two separate sets of tables).

import { getStoredProposalSession, type ProposalSession } from "./companyStatus";

export type ContactStatus =
  | "not_contacted"
  | "connection_sent"
  | "introduction_sent"
  | "follow_up_sent"
  | "meeting_set"
  | "do_not_contact";

export type ProjectContact = {
  id: string;
  company: string;
  company_id?: string | null;
  industry?: string | null;
  sector?: string | null;
  contact_name?: string | null;
  title?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
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

export type OutreachModel = "replace" | "bridge" | "build" | "augment" | "consolidate";

export const OUTREACH_MODEL_LABELS: Record<OutreachModel, string> = {
  replace: "Replace",
  bridge: "Bridge",
  build: "Build",
  augment: "Augment",
  consolidate: "Consolidate",
};

export const OUTREACH_MODEL_BADGE_CLASS: Record<OutreachModel, string> = {
  replace: "border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]",
  bridge: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
  build: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
  augment: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
  consolidate: "border-[#FBCFE8] bg-[#FDF2F8] text-[#BE185D]",
};

export type CompanySignal = {
  id: string;
  company: string;
  company_id?: string | null;
  role_title?: string | null;
  posted_date?: string | null;
  source_url?: string | null;
  notes?: string | null;
  outreach_model?: OutreachModel | null;
};

export type CompanyStage = "new_signal" | "meeting_scheduled" | "closed_won" | "closed_lost";

export type Company = {
  id: string;
  name: string;
  normalized_name: string;
  assigned_rep?: string | null;
  company_stage: CompanyStage;
  meeting_contact_id?: string | null;
  meeting_date?: string | null;
  closed_lost_reason?: string | null;
};

export type ContactMeetingBlock = {
  contact_id: string;
  company_id: string;
  company_stage: CompanyStage;
  meeting_contact_id?: string | null;
  is_blocked: boolean;
  meeting_contact_name?: string | null;
  meeting_contact_title?: string | null;
};

export const COMPANY_STAGE_LABELS: Record<CompanyStage, string> = {
  new_signal: "New Signal",
  meeting_scheduled: "Meeting Scheduled",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export type Meeting = {
  id: string;
  contact_id: string;
  company_id?: string | null;
  set_by?: string | null;
  meeting_date?: string | null;
  confirmed: boolean;
  notes?: string | null;
  created_at: string;
};

export type ClosedDeal = {
  id: string;
  company: string;
  company_id?: string | null;
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

// Supabase's API caps a single request at ~1,000 rows by default. With
// 1,000+ contacts already, and more added regularly, a plain fetch silently
// drops everything past that cutoff - which is exactly what made newly
// assigned contacts vanish. This pages through with the Range header until
// a request comes back with fewer rows than requested, meaning there's
// nothing left to fetch.
const PAGE_SIZE = 1000;
const fetchAllRows = async <T>(session: ProposalSession, path: string): Promise<T[]> => {
  if (!DB_URL) return [];
  const results: T[] = [];
  let offset = 0;
  while (true) {
    const response = await fetch(`${DB_URL}/rest/v1/${path}`, {
      headers: { ...authHeaders(session), Range: `${offset}-${offset + PAGE_SIZE - 1}` },
    });
    if (!response.ok) break;
    const page = (await response.json()) as T[];
    results.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return results;
};

export { getStoredProposalSession };

export const fetchProjectContacts = async (session: ProposalSession): Promise<ProjectContact[]> =>
  fetchAllRows<ProjectContact>(session, "project_contacts?select=*&order=company.asc");

export const fetchCompanies = async (session: ProposalSession): Promise<Company[]> =>
  fetchAllRows<Company>(session, "companies?select=*&order=name.asc");

export const fetchMeetingBlocks = async (session: ProposalSession): Promise<Record<string, ContactMeetingBlock>> => {
  const rows = await fetchAllRows<ContactMeetingBlock>(session, "contact_meeting_block?select=*");
  return Object.fromEntries(rows.map((row) => [row.contact_id, row]));
};

// Owner-only in the UI (not yet enforced at the database level - matches
// the trust model of the rest of the company-level controls for now).
export const updateCompanyStage = async (
  session: ProposalSession,
  companyId: string,
  updates: { company_stage: CompanyStage; closed_lost_reason?: string | null; meeting_contact_id?: string | null }
): Promise<Company | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/companies?id=eq.${companyId}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Company[];
  return rows[0] ?? null;
};

// Owners can reassign any company; a rep can't hand it off to themselves -
// that's still an owner call, same trust model as updateCompanyStage.
export const updateCompanyAssignedRep = async (
  session: ProposalSession,
  companyId: string,
  assignedRep: string | null
): Promise<Company | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/companies?id=eq.${companyId}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ assigned_rep: assignedRep }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Company[];
  return rows[0] ?? null;
};

// Company-level edit rights (stage changes, closed deal logging): owners,
// or the rep that company is currently assigned to. Matches the same
// UI-level trust model as the rest of the company controls - not enforced
// at the database level yet.
export const canManageCompany = (company: Company, currentTeamMember: TeamMember | null, isOwner: boolean): boolean => {
  if (isOwner) return true;
  if (!currentTeamMember) return false;
  return company.assigned_rep === currentTeamMember.id;
};

export const fetchContactProgress = async (session: ProposalSession): Promise<Record<string, ContactProgress>> => {
  const rows = await fetchAllRows<ContactProgress>(session, "contact_progress?select=*");
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

export const updateTeamMemberName = async (session: ProposalSession, teamMemberId: string, name: string): Promise<TeamMember | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/team_members?id=eq.${teamMemberId}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as TeamMember[];
  return rows[0] ?? null;
};

// Only actually works if the signed-in user is an owner - enforced by a
// database trigger, not just this function, so this can't be bypassed by
// calling the API directly.
export const updateTeamMemberRole = async (
  session: ProposalSession,
  teamMemberId: string,
  role: "owner" | "member"
): Promise<TeamMember | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/team_members?id=eq.${teamMemberId}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as TeamMember[];
  return rows[0] ?? null;
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

// Unlike fetchCompanySignals (which keeps only one signal per company for
// the warm-signal badge), this keeps every row - a company detail page
// should show all of a company's hiring signals, not just one.
export const fetchCompanySignalsList = async (session: ProposalSession): Promise<CompanySignal[]> =>
  fetchAllRows<CompanySignal>(session, "company_signals?select=*&order=posted_date.desc");

// Tags a single hiring signal with which outreach model it calls for
// (Replace/Bridge/Build/Augment/Consolidate). Owner or assigned-rep call,
// same trust model as the rest of the company-level controls.
export const updateSignalOutreachModel = async (
  session: ProposalSession,
  signalId: string,
  outreachModel: OutreachModel | null
): Promise<CompanySignal | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/company_signals?id=eq.${signalId}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ outreach_model: outreachModel }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as CompanySignal[];
  return rows[0] ?? null;
};

export const updateContactProgress = async (
  session: ProposalSession,
  contactId: string,
  updates: Partial<Pick<ContactProgress, "status" | "assigned_to">>,
  updatedByTeamMemberId?: string | null
): Promise<ContactProgress | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/contact_progress?contact_id=eq.${contactId}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ ...updates, updated_by: updatedByTeamMemberId ?? null }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as ContactProgress[];
  return rows[0] ?? null;
};

export const logContactActivity = async (
  session: ProposalSession,
  contactId: string,
  eventType: string,
  eventDetail?: string,
  actorTeamMemberId?: string | null
): Promise<void> => {
  if (!DB_URL) return;
  await fetch(`${DB_URL}/rest/v1/contact_activity`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({ contact_id: contactId, event_type: eventType, event_detail: eventDetail, actor: actorTeamMemberId ?? null }),
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
  notes: string,
  companyId?: string | null
): Promise<ClosedDeal | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/closed_deals`, {
    method: "POST",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ company, credited_to: creditedTo, contract_signed_date: contractSignedDate, notes, company_id: companyId ?? null }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as ClosedDeal[];
  return rows[0] ?? null;
};

// Ranks which "Target #" a contact was designated during ChatGPT's account
// research (Target 1 is the primary recommended contact, 2 and 3 are
// backups) - lower is more primary. Contacts without a parseable target
// number (e.g. self-serve additions) sort last on this axis alone.
const targetRank = (contact: ProjectContact): number => {
  const match = contact.target_type_raw?.match(/([123])/);
  return match ? Number(match[1]) : 99;
};

// Picks the one contact at a company that should surface by default,
// everyone else stays behind a "show more" toggle. ChatGPT's Target 1/2/3
// designation (target_type_raw) is the primary signal; ties or contacts
// without that field fall back to reachability tier and priority, same
// ranking already used for batch assignment.
export const getPrimaryContact = (contacts: ProjectContact[]): ProjectContact | null => {
  const candidates = contacts.filter((c) => !c.do_not_contact);
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => {
    const ra = targetRank(a);
    const rb = targetRank(b);
    if (ra !== rb) return ra - rb;
    const ta = TIER_ORDER[getContactTier(a)];
    const tb = TIER_ORDER[getContactTier(b)];
    if (ta !== tb) return ta - tb;
    const pa = PRIORITY_ORDER[a.priority ?? ""] ?? 6;
    const pb = PRIORITY_ORDER[b.priority ?? ""] ?? 6;
    if (pa !== pb) return pa - pb;
    return (a.contact_name ?? "").localeCompare(b.contact_name ?? "");
  })[0];
};

export type CompanyResearchSummary = {
  industry?: string | null;
  sector?: string | null;
  priority?: string | null;
  valueHypothesis?: string | null;
  outreachAngle?: string | null;
};

// The company-level research ChatGPT produced (industry, sector, why RevHub
// fits, the buying trigger) was denormalized onto every contact row at
// import time rather than living on the companies table - so any contact
// at the company carries it. Pulls it from whichever contact actually has
// values filled in, since self-serve-added contacts won't.
// The sourcing data stores "why now" as semicolon-separated fragments
// ("PE-backed distribution; branch network; pricing/margin leakage.") -
// readable enough in a spreadsheet cell, but hard to parse at a glance in
// the UI. This turns it into one comma-and-joined sentence instead.
export const formatWhyNow = (raw?: string | null): string | null => {
  if (!raw) return null;
  const fragments = raw
    .split(/[;\n]/)
    .map((f) => f.trim().replace(/\.$/, ""))
    .filter(Boolean);
  if (fragments.length === 0) return null;
  if (fragments.length === 1) return /[.!?]$/.test(fragments[0]) ? fragments[0] : `${fragments[0]}.`;

  const lowered = fragments.map((f, i) => (i === 0 ? f : f.charAt(0).toLowerCase() + f.slice(1)));
  const last = lowered[lowered.length - 1];
  const rest = lowered.slice(0, -1);
  return `${rest.join(", ")}, and ${last}.`;
};

// Presentational only - the outreach copy from the sheet often arrives as
// one flat block of text. This gives the greeting and sign-off their own
// lines so it reads like an actual message, without touching a single
// word of the content itself. The stored message in the database is
// never changed - this only affects what's shown in (and copied from)
// the editor.
export const formatMessageForDisplay = (raw?: string | null): string => {
  if (!raw) return "";
  let text = raw.trim();

  // Give the greeting its own line: "Hi Sarah," / "Hello -" / "Hey there,"
  text = text.replace(/^((?:Hi|Hello|Hey)\b[^,.\-–—\n]{0,60}[,.\-–—])\s+/i, "$1\n\n");

  // Give the sign-off its own paragraph, keeping a trailing name intact:
  // "...call next week? Best, Chad" -> "...call next week?\n\nBest, Chad"
  text = text.replace(
    /\s+((?:Best regards|Best wishes|Best|Regards|Warm regards|Sincerely|Thanks again|Thank you|Thanks|Cheers|Talk soon|Looking forward(?: to (?:it|hearing from you|connecting))?)[,.]?\s*[\w' -]{0,40})$/i,
    "\n\n$1"
  );

  return text;
};

export const getCompanyResearchSummary = (contacts: ProjectContact[]): CompanyResearchSummary => {
  const withData = contacts.find((c) => c.industry || c.sector || c.value_hypothesis || c.outreach_angle) ?? contacts[0];
  return {
    industry: withData?.industry,
    sector: withData?.sector,
    priority: withData?.priority,
    valueHypothesis: withData?.value_hypothesis,
    outreachAngle: formatWhyNow(withData?.outreach_angle),
  };
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
  not_contacted: "Not Contacted",
  connection_sent: "Connection Sent",
  introduction_sent: "Introduction Sent",
  follow_up_sent: "Follow-Up Sent",
  meeting_set: "Meeting Set",
  do_not_contact: "Do Not Contact",
};

export const getInitials = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
};

// A contact is only worth handing to a team member if there's a real way to
// reach them. An email beats a real LinkedIn profile; a bare search link
// (or nothing at all) means real research is still needed first.
export type ContactTier = "email" | "linkedin" | "research";

export const hasRealLinkedInProfile = (contact: ProjectContact) => Boolean(contact.linkedin_url?.includes("/in/"));

export const getContactTier = (contact: ProjectContact): ContactTier => {
  if (contact.email) return "email";
  if (hasRealLinkedInProfile(contact)) return "linkedin";
  return "research";
};

// Builds a ready-to-click LinkedIn people-search URL with the contact's name
// and company already filled in, so whoever gets this contact doesn't have
// to build the search themselves - they just click and the person should
// surface in the results.
export const buildLinkedInSearchUrl = (contactName?: string | null, company?: string | null) => {
  const query = [contactName, company].filter(Boolean).join(" ");
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
};

const TIER_ORDER: Record<ContactTier, number> = { email: 0, linkedin: 1, research: 2 };

// Pulls the next batch for a team member: up to 25 "good" contacts (email
// or a real LinkedIn profile, best signal first) plus up to 5 "needs
// research" contacts (no direct way to reach them yet). Only looks at
// contacts nobody's already assigned, so batches never overlap.
export const assignNextBatch = async (
  session: ProposalSession,
  teamMemberId: string,
  allContacts: ProjectContact[],
  allProgress: Record<string, ContactProgress>,
  meetingBlocks: Record<string, ContactMeetingBlock> = {}
): Promise<{ assignedGoodIds: string[]; assignedResearchIds: string[] }> => {
  const unassigned = allContacts.filter(
    (c) =>
      !c.needs_research &&
      !c.do_not_contact &&
      !allProgress[c.id]?.assigned_to &&
      !meetingBlocks[c.id]?.is_blocked
  );

  const good = unassigned
    .filter((c) => getContactTier(c) !== "research")
    .sort((a, b) => TIER_ORDER[getContactTier(a)] - TIER_ORDER[getContactTier(b)])
    .slice(0, 25);

  const research = unassigned.filter((c) => getContactTier(c) === "research").slice(0, 5);

  const allIds = [...good, ...research].map((c) => c.id);
  if (allIds.length && DB_URL) {
    await fetch(`${DB_URL}/rest/v1/contact_progress?contact_id=in.(${allIds.join(",")})`, {
      method: "PATCH",
      headers: authHeaders(session),
      body: JSON.stringify({ assigned_to: teamMemberId }),
    });
  }

  return { assignedGoodIds: good.map((c) => c.id), assignedResearchIds: research.map((c) => c.id) };
};

// Shared ranking used both to sort the contact queue and to rank companies
// for batch assignment - a warm signal always outranks priority tier, and
// within the same signal status this decides the tiebreak.
export const PRIORITY_ORDER: Record<string, number> = { A: 0, "A/B": 1, B: 2, C: 3, D: 4, needs_review: 5, "": 6 };

const chunkIds = (ids: string[], size = 50): string[][] => {
  const out: string[][] = [];
  for (let i = 0; i < ids.length; i += size) out.push(ids.slice(i, i + size));
  return out;
};

// Company-level batching: a rep now owns whole companies (up to 25 at a
// time) rather than a scattered list of individual contacts - every
// contact at an assigned company comes along with it, so nobody has to
// hunt for who else works there. Companies with a warm hiring signal are
// handed out first; within the same signal status, the best priority
// tier among that company's contacts breaks the tie.
export const assignNextCompanyBatch = async (
  session: ProposalSession,
  teamMemberId: string,
  allCompanies: Company[],
  allContacts: ProjectContact[],
  allProgress: Record<string, ContactProgress>,
  signalsByCompanyId: Record<string, CompanySignal[]>,
  batchSize = 25
): Promise<{ assignedCompanyIds: string[] }> => {
  const unassigned = allCompanies.filter((c) => !c.assigned_rep && c.company_stage === "new_signal");

  const bestPriorityForCompany = (company: Company): number => {
    let best = 6;
    for (const contact of allContacts) {
      if (contact.company_id !== company.id) continue;
      const p = PRIORITY_ORDER[contact.priority ?? ""] ?? 6;
      if (p < best) best = p;
    }
    return best;
  };

  const batch = unassigned
    .sort((a, b) => {
      const hasSignalA = (signalsByCompanyId[a.id]?.length ?? 0) > 0 ? 0 : 1;
      const hasSignalB = (signalsByCompanyId[b.id]?.length ?? 0) > 0 ? 0 : 1;
      if (hasSignalA !== hasSignalB) return hasSignalA - hasSignalB;
      const pa = bestPriorityForCompany(a);
      const pb = bestPriorityForCompany(b);
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name);
    })
    .slice(0, batchSize);

  const companyIds = batch.map((c) => c.id);

  if (companyIds.length && DB_URL) {
    await fetch(`${DB_URL}/rest/v1/companies?id=in.(${companyIds.join(",")})`, {
      method: "PATCH",
      headers: authHeaders(session),
      body: JSON.stringify({ assigned_rep: teamMemberId }),
    });

    // Hand every not-yet-assigned contact at these companies to the same
    // rep - owning the company means owning everyone in it. Contacts
    // someone else is already working stay put.
    const contactIdsToClaim = allContacts
      .filter((c) => c.company_id && companyIds.includes(c.company_id) && !c.do_not_contact && !allProgress[c.id]?.assigned_to)
      .map((c) => c.id);

    for (const idChunk of chunkIds(contactIdsToClaim)) {
      await fetch(`${DB_URL}/rest/v1/contact_progress?contact_id=in.(${idChunk.join(",")})`, {
        method: "PATCH",
        headers: authHeaders(session),
        body: JSON.stringify({ assigned_to: teamMemberId }),
      });
    }
  }

  return { assignedCompanyIds: companyIds };
};

// Lets a team member add a contact they found themselves. They're
// automatically credited as the assignee, so they get attribution if it
// turns into a meeting or closed deal later.
export const createSelfServeContact = async (
  session: ProposalSession,
  input: { company: string; contactName: string; email?: string; linkedinUrl?: string; assignedTo: string }
): Promise<ProjectContact | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/project_contacts`, {
    method: "POST",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({
      company: input.company,
      contact_name: input.contactName,
      email: input.email || null,
      linkedin_url: input.linkedinUrl || null,
      needs_research: false,
      do_not_contact: false,
      legacy_status_notes: "Added directly by team member",
    }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as ProjectContact[];
  const created = rows[0];
  if (!created) return null;

  // The DB trigger auto-creates a contact_progress row on insert; assign it now.
  await updateContactProgress(session, created.id, { assigned_to: input.assignedTo });
  return created;
};
