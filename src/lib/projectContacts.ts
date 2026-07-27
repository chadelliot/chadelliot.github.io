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
  // Email outreach thread - separate from the LinkedIn connect/intro/
  // follow-up messages above. Populated from the email_* columns on the
  // RevHub-Marketing tab. email_assumption_notice is non-empty when the
  // email was inferred from a company-domain pattern rather than
  // confirmed, and gets surfaced as a warning before a rep sends to it.
  email_subject?: string | null;
  email_intro_message?: string | null;
  email_follow_up_1?: string | null;
  email_follow_up_2?: string | null;
  email_assumption_notice?: string | null;
};

export type ContactProgress = {
  contact_id: string;
  status: ContactStatus;
  assigned_to?: string | null;
  updated_at: string;
  updated_by?: string | null;
  // How far along the email thread this contact is: 0 = nothing sent yet,
  // 1 = intro sent, 2 = follow-up 1 sent, 3 = follow-up 2 sent. A plain
  // ordered number rather than named statuses, kept deliberately separate
  // from `status` above - see add_email_sequence_fields.sql for why.
  email_sequence_position?: number;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "member";
  title?: string | null;
  linkedin_url?: string | null;
  photo_url?: string | null;
  resume_url?: string | null;
  // The short sentence appended to outreach as signature-line
  // personalization - see EMAIL_SEQUENCE_STAGES / matchCredibilityLine
  // below for how this actually gets used.
  credibility_line?: string | null;
  // Free-text, comma-separated industries/keywords a rep associates with
  // their own background (e.g. "supply chain, logistics, manufacturing") -
  // used for context-aware matching against a contact's industry/sector.
  // Deliberately a plain string rather than a structured array - reps fill
  // this in themselves, and a comma-separated field is the lowest-friction
  // input for that.
  background_tags?: string | null;
  google_calendar_connected?: boolean;
  google_calendar_email?: string | null;
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

// What each model means and what a rep should actually do with it - shown
// next to the dropdown/badge wherever outreach_model appears (see
// OutreachModelHelp in CompanyDetailPage.tsx) since the label alone
// ("Augment"?) doesn't explain itself. See
// backfill_outreach_model_heuristic.sql for the keyword logic that presets
// this per signal.
export const OUTREACH_MODEL_DESCRIPTIONS: Record<OutreachModel, string> = {
  replace: "Someone in this role left or is leaving. Pitch continuity: fractional support that covers the gap immediately, or as an ongoing alternative to re-hiring full-time.",
  bridge: "They need interim coverage while a permanent search runs, or during a leave of absence. Pitch speed: ready-now support that doesn't wait on a full hiring process.",
  build: "This is a net-new function or first hire in this area. Pitch expertise-on-tap: senior-level experience without the cost and time of building an in-house team from scratch.",
  augment: "An existing team just needs more capacity. Pitch flexible bandwidth: extra hands on what's already stretched, without adding full-time headcount.",
  consolidate: "They're merging roles or cutting costs. Pitch efficiency: one experienced fractional hire covering what would otherwise take multiple full-time salaries.",
};

// Owner-only fields (Phase 1 lead-origin/opportunity-type classification).
// These are never present in the member-safe fetch - they only arrive via
// the owner-only RPC fetches below, which the database refuses to return
// data from unless the caller is an owner. See
// supabase/migrations/leadtype_phase1_foundation.sql.
export type LeadOrigin = "Active Hiring Signal" | "Direct Flexible-Work Opportunity";

export type OpportunityType =
  | "Fractional Opportunity"
  | "Contract Opportunity"
  | "Contract-to-Hire"
  | "Interim Opportunity"
  | "Temporary Assignment"
  | "Consulting Project"
  | "Full-Time Hiring Signal";

// The owner-facing filter/badge value: every OpportunityType, plus the
// "no active signal" fallback for companies sourced only from the Contacts
// tab.
export type OwnerLeadType = OpportunityType | "Cold Outreach";

// Dropdown order specified by the product spec - deliberately NOT the same
// order as the canonical-type buying-intent hierarchy used in
// recompute_company_lead_type() in the SQL migration.
export const OWNER_LEAD_TYPE_FILTER_ORDER: OwnerLeadType[] = [
  "Cold Outreach",
  "Fractional Opportunity",
  "Contract Opportunity",
  "Contract-to-Hire",
  "Interim Opportunity",
  "Temporary Assignment",
  "Consulting Project",
  "Full-Time Hiring Signal",
];

export const OWNER_LEAD_TYPE_BADGE_CLASS: Record<OwnerLeadType, string> = {
  "Cold Outreach": "border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]",
  "Fractional Opportunity": "border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]",
  "Contract Opportunity": "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
  "Contract-to-Hire": "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
  "Interim Opportunity": "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
  "Temporary Assignment": "border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C]",
  "Consulting Project": "border-[#FBCFE8] bg-[#FDF2F8] text-[#BE185D]",
  "Full-Time Hiring Signal": "border-[#CBD5E1] bg-[#F1F5F9] text-[#475569]",
};

// Same category-to-hue mapping as OWNER_LEAD_TYPE_BADGE_CLASS, as a single
// accent hex - used for the dot indicator on the company card header, which
// has a black background the light pill classes above aren't legible on.
export const OWNER_LEAD_TYPE_DOT_COLOR: Record<OwnerLeadType, string> = {
  "Cold Outreach": "#94A3B8",
  "Fractional Opportunity": "#A78BFA",
  "Contract Opportunity": "#60A5FA",
  "Contract-to-Hire": "#4ADE80",
  "Interim Opportunity": "#FBBF24",
  "Temporary Assignment": "#FB923C",
  "Consulting Project": "#F472B6",
  "Full-Time Hiring Signal": "#CBD5E1",
};

// Two-stop gradients for the company-card avatar chip, same hue family as
// the dot/badge colors above so a company's lead type reads consistently
// everywhere on an Owner's screen. There's no logo or contact-photo source
// today (no company website/domain field exists in the schema, and a
// LinkedIn photo isn't something this app can fetch client-side), so the
// avatar chip is initials-on-gradient - meaningful color standing in for a
// photo rather than decoration. Members don't have lead-type data at all,
// so their cards always use DEFAULT_AVATAR_GRADIENT.
export const OWNER_LEAD_TYPE_AVATAR_GRADIENT: Record<OwnerLeadType, [string, string]> = {
  "Cold Outreach": ["#94A3B8", "#64748B"],
  "Fractional Opportunity": ["#A78BFA", "#7C3AED"],
  "Contract Opportunity": ["#60A5FA", "#2563EB"],
  "Contract-to-Hire": ["#4ADE80", "#15803D"],
  "Interim Opportunity": ["#FBBF24", "#B45309"],
  "Temporary Assignment": ["#FB923C", "#C2410C"],
  "Consulting Project": ["#F472B6", "#BE185D"],
  "Full-Time Hiring Signal": ["#94A3B8", "#475569"],
};

export const DEFAULT_AVATAR_GRADIENT: [string, string] = ["#5DCAA5", "#0F6E56"];

// Owner-only fields fetched separately from the shared signal fetch (see
// fetchOwnerSignalFields). Merge onto a CompanySignal by id when rendering
// an Owner view.
export type OwnerSignalFields = {
  id: string;
  lead_origin?: LeadOrigin | null;
  opportunity_type?: OpportunityType | null;
  engagement_details?: string | null;
  raw_lead_origin?: string | null;
  raw_opportunity_type?: string | null;
};

// Owner-only fields fetched separately from the shared company fetch (see
// fetchOwnerCompanyLeadFields). Merge onto a Company by id when rendering
// an Owner view.
export type OwnerCompanyLeadFields = {
  id: string;
  canonical_lead_type?: OwnerLeadType | null;
  all_signal_types?: OpportunityType[] | null;
  primary_signal_id?: string | null;
  signal_count?: number;
  lead_type_needs_review?: boolean;
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
  // Owner-only - absent unless merged in via mergeOwnerSignalFields().
  lead_origin?: LeadOrigin | null;
  opportunity_type?: OpportunityType | null;
  engagement_details?: string | null;
  raw_lead_origin?: string | null;
  raw_opportunity_type?: string | null;
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
  // Owner-only - absent unless merged in via mergeOwnerCompanyLeadFields().
  canonical_lead_type?: OwnerLeadType | null;
  all_signal_types?: OpportunityType[] | null;
  primary_signal_id?: string | null;
  signal_count?: number;
  lead_type_needs_review?: boolean;
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
  new_signal: "New Opportunity",
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
  // Owner-only, captured once at meeting-creation time and never
  // recomputed later - see the attribution rules in the Phase 1 migration.
  // Not present on the member-safe fetch.
  meeting_lead_type_snapshot?: OwnerLeadType | null;
  meeting_lead_origin_snapshot?: LeadOrigin | "Cold Outreach" | null;
};

export type ClosedDeal = {
  id: string;
  company: string;
  company_id?: string | null;
  credited_to?: string | null;
  contract_signed_date?: string | null;
  notes?: string | null;
  created_at: string;
  // Owner-only, same snapshot rules as Meeting above.
  closed_won_lead_type_snapshot?: OwnerLeadType | null;
  closed_won_lead_origin_snapshot?: LeadOrigin | "Cold Outreach" | null;
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

// Explicit column list, not select=* - the Phase 1 migration revokes
// SELECT on the owner-only lead-type columns for everyone at the table
// level, so a select=* here would fail for Owners and Members alike. Owner
// views merge in fetchOwnerCompanyLeadFields() separately.
const COMPANY_SAFE_COLUMNS = "id,name,normalized_name,assigned_rep,company_stage,meeting_contact_id,meeting_date,closed_lost_reason";

export const fetchCompanies = async (session: ProposalSession): Promise<Company[]> =>
  fetchAllRows<Company>(session, `companies?select=${COMPANY_SAFE_COLUMNS}&order=name.asc`);

// Owner-only. Returns nothing (empty array) if the caller isn't an owner -
// enforced by the database via is_owner() inside the RPC, not by this
// function trusting the caller's claimed role.
export const fetchOwnerCompanyLeadFields = async (session: ProposalSession): Promise<Record<string, OwnerCompanyLeadFields>> => {
  if (!DB_URL) return {};
  const response = await fetch(`${DB_URL}/rest/v1/rpc/get_owner_company_lead_fields`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({}),
  });
  if (!response.ok) return {};
  const rows = (await response.json()) as OwnerCompanyLeadFields[];
  return Object.fromEntries(rows.map((row) => [row.id, row]));
};

// Open to all authenticated team members (see get_member_company_lead_fields
// in supabase/migrations/open_lead_fields_to_members.sql) - same shape as
// fetchOwnerCompanyLeadFields minus lead_type_needs_review, which stays
// Owner-only. Call this for every session; call fetchOwnerCompanyLeadFields
// as well for Owners to also pick up lead_type_needs_review.
export const fetchMemberCompanyLeadFields = async (session: ProposalSession): Promise<Record<string, OwnerCompanyLeadFields>> => {
  if (!DB_URL) return {};
  const response = await fetch(`${DB_URL}/rest/v1/rpc/get_member_company_lead_fields`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({}),
  });
  if (!response.ok) return {};
  const rows = (await response.json()) as OwnerCompanyLeadFields[];
  return Object.fromEntries(rows.map((row) => [row.id, row]));
};

// Merges owner-only lead-type fields onto the member-safe Company rows.
// Call only from an Owner code path - a Member calling this is harmless
// (the RPC returns nothing for them) but there's no reason to call it.
export const mergeOwnerCompanyLeadFields = (companies: Company[], ownerFields: Record<string, OwnerCompanyLeadFields>): Company[] =>
  companies.map((c) => {
    const extra = ownerFields[c.id];
    return extra ? { ...c, ...extra } : c;
  });

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

// Explicit column list rather than select=* - the google_refresh_token
// column is intentionally excluded from authenticated/anon's grant (see
// add_google_calendar_fields.sql) so it never reaches the browser. PostgREST
// throws a permission error for the *entire* select=* query if any column on
// the row isn't grantable to the requesting role, so select=* would fail
// outright here rather than just omitting that one column.
const TEAM_MEMBER_COLUMNS =
  "id,name,email,role,title,linkedin_url,photo_url,resume_url,credibility_line,background_tags,google_calendar_connected,google_calendar_email";

export const fetchTeamMembers = async (session: ProposalSession): Promise<TeamMember[]> => {
  if (!DB_URL) return [];
  const response = await fetch(`${DB_URL}/rest/v1/team_members?select=${TEAM_MEMBER_COLUMNS}&order=name.asc`, {
    headers: authHeaders(session),
  });
  if (!response.ok) return [];
  return (await response.json()) as TeamMember[];
};

export const updateTeamMemberName = async (session: ProposalSession, teamMemberId: string, name: string): Promise<TeamMember | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/team_members?id=eq.${teamMemberId}&select=${TEAM_MEMBER_COLUMNS}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as TeamMember[];
  return rows[0] ?? null;
};

// Self-service profile edit (name + title only). Email is deliberately not
// editable here - it's how findCurrentTeamMember matches this row to the
// signed-in Supabase Auth session, so changing it here without also
// changing the login credential would silently disconnect someone from
// their own account on next sign-in.
export const updateTeamMemberProfile = async (
  session: ProposalSession,
  teamMemberId: string,
  updates: {
    name?: string;
    title?: string | null;
    linkedin_url?: string | null;
    photo_url?: string | null;
    resume_url?: string | null;
    credibility_line?: string | null;
    background_tags?: string | null;
  }
): Promise<TeamMember | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/team_members?id=eq.${teamMemberId}&select=${TEAM_MEMBER_COLUMNS}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as TeamMember[];
  return rows[0] ?? null;
};

// Uploads a photo or resume to the matching Supabase Storage bucket (see
// add_rep_profile_enrichment.sql for the buckets + RLS policies), under a
// path scoped to this rep's own team_member id so the storage policies can
// verify ownership. Returns the URL to save onto the team_members row -
// public for avatars (bucket is public), or the storage path itself for
// resumes (bucket is private; fetchResumeSignedUrl below turns that into a
// short-lived signed link when someone actually wants to view it).
export const uploadTeamMemberFile = async (
  session: ProposalSession,
  teamMemberId: string,
  bucket: "avatars" | "resumes",
  file: File
): Promise<string | null> => {
  if (!DB_URL) return null;
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${teamMemberId}/${bucket === "avatars" ? "photo" : "resume"}.${ext}`;
  const response = await fetch(`${DB_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: DB_PUBLIC || "",
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });
  if (!response.ok) return null;
  if (bucket === "avatars") return `${DB_URL}/storage/v1/object/public/${bucket}/${path}`;
  return path;
};

// Resumes live in a private bucket (they're personal documents), so viewing
// one needs a short-lived signed URL rather than a permanent public link.
export const fetchResumeSignedUrl = async (session: ProposalSession, resumePath: string): Promise<string | null> => {
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/storage/v1/object/sign/resumes/${resumePath}`, {
    method: "POST",
    headers: { ...authHeaders(session) },
    body: JSON.stringify({ expiresIn: 300 }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { signedURL?: string };
  return data.signedURL ? `${DB_URL}/storage/v1${data.signedURL}` : null;
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
  const response = await fetch(`${DB_URL}/rest/v1/team_members?id=eq.${teamMemberId}&select=${TEAM_MEMBER_COLUMNS}`, {
    method: "PATCH",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as TeamMember[];
  return rows[0] ?? null;
};

// Explicit column list, not select=* - see COMPANY_SAFE_COLUMNS above for
// why. Owner views merge in fetchOwnerSignalFields() separately.
const COMPANY_SIGNAL_SAFE_COLUMNS = "id,company,company_id,role_title,posted_date,source_url,notes,outreach_model";

export const fetchCompanySignals = async (session: ProposalSession): Promise<Record<string, CompanySignal>> => {
  if (!DB_URL) return {};
  const response = await fetch(`${DB_URL}/rest/v1/company_signals?select=${COMPANY_SIGNAL_SAFE_COLUMNS}`, {
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
  fetchAllRows<CompanySignal>(session, `company_signals?select=${COMPANY_SIGNAL_SAFE_COLUMNS}&order=posted_date.desc`);

// Owner-only. Returns nothing if the caller isn't an owner - enforced by
// the database, not the client.
export const fetchOwnerSignalFields = async (session: ProposalSession): Promise<Record<string, OwnerSignalFields>> => {
  if (!DB_URL) return {};
  const response = await fetch(`${DB_URL}/rest/v1/rpc/get_owner_signal_fields`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({}),
  });
  if (!response.ok) return {};
  const rows = (await response.json()) as OwnerSignalFields[];
  return Object.fromEntries(rows.map((row) => [row.id, row]));
};

// Open to all authenticated team members (see get_member_signal_fields in
// supabase/migrations/open_lead_fields_to_members.sql) - same shape as
// fetchOwnerSignalFields, minus raw_lead_origin/raw_opportunity_type which
// stay Owner-only debugging fields nothing in the UI reads for Members.
export const fetchMemberSignalFields = async (session: ProposalSession): Promise<Record<string, OwnerSignalFields>> => {
  if (!DB_URL) return {};
  const response = await fetch(`${DB_URL}/rest/v1/rpc/get_member_signal_fields`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({}),
  });
  if (!response.ok) return {};
  const rows = (await response.json()) as OwnerSignalFields[];
  return Object.fromEntries(rows.map((row) => [row.id, row]));
};

export const mergeOwnerSignalFields = (signals: CompanySignal[], ownerFields: Record<string, OwnerSignalFields>): CompanySignal[] =>
  signals.map((s) => {
    const extra = ownerFields[s.id];
    return extra ? { ...s, ...extra } : s;
  });

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
  updates: Partial<Pick<ContactProgress, "status" | "assigned_to" | "email_sequence_position">>,
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

const MEETING_SAFE_COLUMNS = "id,contact_id,company_id,set_by,meeting_date,confirmed,notes,created_at";

export const fetchMeetings = async (session: ProposalSession): Promise<Meeting[]> => {
  if (!DB_URL) return [];
  const response = await fetch(`${DB_URL}/rest/v1/meetings?select=${MEETING_SAFE_COLUMNS}&order=meeting_date.desc`, {
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

const CLOSED_DEAL_SAFE_COLUMNS = "id,company,company_id,credited_to,contract_signed_date,notes,created_at";

export const fetchClosedDeals = async (session: ProposalSession): Promise<ClosedDeal[]> => {
  if (!DB_URL) return [];
  const response = await fetch(`${DB_URL}/rest/v1/closed_deals?select=${CLOSED_DEAL_SAFE_COLUMNS}&order=contract_signed_date.desc`, {
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

// Reopening a company (back to New Opportunity) is meant to wipe the slate
// clean, not just hide the meeting/closed-deal on the company page - the
// Team page's "Meetings set" / "Closed deals" lists and its per-rep tally
// columns all read straight from these two tables, so a stale row there
// would keep showing dates, notes, and counts for something that's no
// longer true. Deleting outright (rather than some "reverted" flag) matches
// how Chad described the expectation: gone from every place it showed up.
export const deleteMeetingForContact = async (session: ProposalSession, contactId: string): Promise<void> => {
  if (!DB_URL) return;
  await fetch(`${DB_URL}/rest/v1/meetings?contact_id=eq.${encodeURIComponent(contactId)}`, {
    method: "DELETE",
    headers: authHeaders(session),
  });
};

// Closed-deal rows are matched by company_id where present, but older rows
// (and possibly some from before company_id was tracked) only have the
// plain company name string - so both are covered here rather than risking
// a leftover row surviving whichever backfill state a given deal is in.
export const deleteClosedDealsForCompany = async (session: ProposalSession, companyId: string, companyName: string): Promise<void> => {
  if (!DB_URL) return;
  await fetch(`${DB_URL}/rest/v1/closed_deals?or=(company_id.eq.${encodeURIComponent(companyId)},company.eq.${encodeURIComponent(companyName)})`, {
    method: "DELETE",
    headers: authHeaders(session),
  });
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

  // The sheet sometimes uses em dashes ("Hey Sarah — noticed you're
  // hiring...") but Chad doesn't want them in outreach copy regardless of
  // what the source data has. An em dash surrounded by spaces is standing
  // in for a comma-like pause, so it becomes ", "; one butted against
  // words (word—word) reads as a break and becomes " - " instead. En
  // dashes get the same treatment for consistency.
  text = text.replace(/\s+[—–]\s+/g, ", ");
  text = text.replace(/([a-zA-Z0-9])[—–]([a-zA-Z0-9])/g, "$1 - $2");
  text = text.replace(/[—–]/g, "-");

  // Give the greeting its own line: "Hi Sarah," / "Hello -" / "Hey there,"
  text = text.replace(/^((?:Hi|Hello|Hey)\b[^,.\-\n]{0,60}[,.\-])\s+/i, "$1\n\n");

  // Give the sign-off its own paragraph, keeping a trailing name intact:
  // "...call next week? Best, Chad" -> "...call next week?\n\nBest, Chad"
  text = text.replace(
    /\s+((?:Best regards|Best wishes|Best|Regards|Warm regards|Sincerely|Thanks again|Thank you|Thanks|Cheers|Talk soon|Looking forward(?: to (?:it|hearing from you|connecting))?)[,.]?\s*[\w' -]{0,40})$/i,
    "\n\n$1"
  );

  return text;
};

// Context-aware matching, kept intentionally simple: a rep lists their own
// background as a handful of comma-separated tags ("supply chain,
// logistics, manufacturing") rather than filling in a separate line per
// industry - lower friction for the rep, at the cost of only being able to
// decide *whether* their one credibility line is relevant to a given
// contact, not picking between several. If the rep hasn't listed any tags
// at all, there's nothing to judge relevance against, so the line is
// treated as always-relevant (better to show a possibly-generic line than
// silently never use it).
export const getPersonalizationLine = (rep: TeamMember | null | undefined, contact: ProjectContact): string | null => {
  if (!rep?.credibility_line?.trim()) return null;
  const tags = (rep.background_tags ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tags.length === 0) return rep.credibility_line;
  const haystack = `${contact.industry ?? ""} ${contact.sector ?? ""}`.toLowerCase().trim();
  if (!haystack) return rep.credibility_line;
  const isRelevant = tags.some((tag) => haystack.includes(tag) || tag.includes(haystack));
  return isRelevant ? rep.credibility_line : null;
};

// Wraps formatMessageForDisplay with the rep's personalization line, slotted
// in as its own paragraph just before the sign-off (formatMessageForDisplay
// always gives the sign-off its own "\n\n"-separated paragraph, so the last
// blank-line boundary in the formatted text is reliably that seam) rather
// than tacked onto the very end, which would read strangely after "Best,
// Chad." Falls back to appending at the end if no sign-off was detected.
export const personalizeMessage = (raw: string | null | undefined, personalizationLine?: string | null): string => {
  const formatted = formatMessageForDisplay(raw);
  if (!personalizationLine || !formatted) return formatted;
  const lastBreak = formatted.lastIndexOf("\n\n");
  if (lastBreak === -1) return `${formatted}\n\n${personalizationLine}`;
  return `${formatted.slice(0, lastBreak)}\n\n${personalizationLine}${formatted.slice(lastBreak)}`;
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

// How far along the outreach pipeline each status is - used to decide
// whether a message-template button ("Connection note", "After accepted")
// still makes sense to show. do_not_contact is treated as past everything,
// since outreach has stopped for that contact regardless of how far they'd
// gotten. Purely derived from the current status, so reverting a contact
// to an earlier status automatically brings the relevant buttons back -
// there's no separate "has this been dismissed" flag to get out of sync.
// The 3 stages of the email thread, in order - position N means "this
// stage's message has been sent." Driving the UI off this list (rather
// than hardcoding 3 separate blocks) means adding a 4th stage later is a
// one-line change here plus a migration, not a rewrite.
export const EMAIL_SEQUENCE_STAGES: { position: 1 | 2 | 3; label: string; field: "email_intro_message" | "email_follow_up_1" | "email_follow_up_2" }[] = [
  { position: 1, label: "Intro", field: "email_intro_message" },
  { position: 2, label: "Follow-up 1", field: "email_follow_up_1" },
  { position: 3, label: "Follow-up 2", field: "email_follow_up_2" },
];

export const STATUS_ORDER: Record<ContactStatus, number> = {
  not_contacted: 0,
  connection_sent: 1,
  introduction_sent: 2,
  follow_up_sent: 3,
  meeting_set: 4,
  do_not_contact: 5,
};

// Generic mail providers that show up constantly in this data (personal
// emails on self-serve-added contacts, or people using a personal address
// for work) - never the company's own domain, so a logo lookup against one
// of these would return the provider's own logo instead of the company's.
const GENERIC_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com", "live.com", "msn.com", "proton.me", "protonmail.com",
]);

// No domain/website field exists on companies (see the comment above
// getCompanyResearchSummary) - but any contact's real email address already
// tells us the company's domain for free, which is all the Clearbit Logo
// API needs. Prefers a non-assumed email when one exists, since an assumed
// address is itself just a guess at the domain pattern - though in
// practice the domain portion is the same either way.
export const getCompanyDomain = (contacts: ProjectContact[]): string | null => {
  const withRealEmail = contacts.find((c) => c.email && !c.email_assumption_notice) ?? contacts.find((c) => c.email);
  const domain = withRealEmail?.email?.split("@")[1]?.toLowerCase().trim();
  if (!domain || GENERIC_EMAIL_DOMAINS.has(domain)) return null;
  return domain;
};

export const getClearbitLogoUrl = (domain: string): string => `https://logo.clearbit.com/${domain}`;

// Calls the rep-profile-ai Supabase Edge Function (see
// supabase/functions/rep-profile-ai/index.ts) - the only place in this app
// that talks to an LLM, and deliberately kept server-side since the API key
// it needs can't safely live in this static frontend's bundle. Both
// functions return null on any failure (network, missing key, bad
// response) rather than throwing, so callers can fall back to the
// non-AI behavior without a try/catch at every call site.
const callRepProfileAI = async (session: ProposalSession, body: Record<string, unknown>): Promise<Record<string, unknown> | null> => {
  if (!DB_URL) return null;
  try {
    const response = await fetch(`${DB_URL}/functions/v1/rep-profile-ai`, {
      method: "POST",
      headers: { ...authHeaders(session) },
      body: JSON.stringify(body),
    });
    if (!response.ok) return null;
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
};

// AI-drafted version of getPersonalizationLine - instead of deciding
// whether to reuse the rep's one saved sentence, this asks an LLM to write
// a new sentence tailored to this specific contact's role/industry. Always
// returned for review (never auto-inserted/auto-sent) - the caller shows it
// to the rep in the message editor the same way the static line is shown.
export const draftAIPersonalizationLine = async (
  session: ProposalSession,
  rep: TeamMember | null | undefined,
  contact: ProjectContact
): Promise<string | null> => {
  if (!rep?.credibility_line?.trim()) return null;
  const result = await callRepProfileAI(session, {
    action: "personalize",
    repBackground: rep.credibility_line,
    repTags: rep.background_tags ?? "",
    contact: { title: contact.title, industry: contact.industry, sector: contact.sector },
  });
  const line = result?.line;
  return typeof line === "string" && line.trim() ? line.trim() : null;
};

// Builds the Google authorization URL entirely client-side - the client ID
// isn't a secret (it's meant to be public; only the client SECRET needs to
// stay server-side, which is why the token exchange itself happens in the
// google-calendar Edge Function, not here). Requires VITE_GOOGLE_CLIENT_ID
// to be set at build time - see the Google Calendar setup instructions
// handed off alongside supabase/functions/google-calendar/index.ts.
export const buildGoogleAuthUrl = (teamMemberId: string): string | null => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  if (!clientId || !DB_URL) return null;
  const redirectUri = `${DB_URL}/functions/v1/google-calendar`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    // calendar.events (not just freebusy) so the same connection can also
    // create the booked event, not merely read availability.
    scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email",
    access_type: "offline",
    // Forces Google to re-issue a refresh token every time - without this,
    // reconnecting after a disconnect can silently fail to return one (see
    // the comment in the Edge Function's oauth_callback handler).
    prompt: "consent",
    state: teamMemberId,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const disconnectGoogleCalendar = async (session: ProposalSession, teamMemberId: string): Promise<boolean> => {
  if (!DB_URL) return false;
  const response = await fetch(`${DB_URL}/functions/v1/google-calendar`, {
    method: "POST",
    headers: { ...authHeaders(session) },
    body: JSON.stringify({ action: "disconnect", repId: teamMemberId }),
  });
  if (!response.ok) return false;
  const data = (await response.json()) as { success?: boolean };
  return Boolean(data.success);
};

// These two intentionally do NOT require a RevHub session - the person
// booking a slot is a cold-outreach contact with no RevHub account at all.
// The Edge Function itself is what's allowed to read/write the rep's
// Google refresh token (via the service role key), completely independent
// of whether the caller is signed in here.
export const fetchAvailableSlots = async (repId: string): Promise<{ repName?: string; slots: string[]; error?: string }> => {
  if (!DB_URL) return { slots: [], error: "Not configured." };
  const response = await fetch(`${DB_URL}/functions/v1/google-calendar`, {
    method: "POST",
    headers: { apikey: DB_PUBLIC || "", "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_available_slots", repId }),
  });
  const data = (await response.json()) as { repName?: string; slots?: string[]; error?: string };
  return { repName: data.repName, slots: data.slots ?? [], error: data.error };
};

export const bookSlot = async (
  repId: string,
  startIso: string,
  contactName: string,
  contactEmail: string,
  notes?: string
): Promise<{ success: boolean; eventLink?: string; error?: string }> => {
  if (!DB_URL) return { success: false, error: "Not configured." };
  const response = await fetch(`${DB_URL}/functions/v1/google-calendar`, {
    method: "POST",
    headers: { apikey: DB_PUBLIC || "", "Content-Type": "application/json" },
    body: JSON.stringify({ action: "book_slot", repId, startIso, contactName, contactEmail, notes }),
  });
  const data = (await response.json()) as { success?: boolean; eventLink?: string; error?: string };
  return { success: Boolean(data.success), eventLink: data.eventLink, error: data.error };
};

export type ParsedResumeFields = { credibility_line?: string; background_tags?: string; notable_wins?: string[] };

// Only PDFs are supported today - see the comment in the Edge Function for
// why (Claude's document support is PDF/image-based, not .doc/.docx).
export const parseResumeWithAI = async (session: ProposalSession, file: File): Promise<ParsedResumeFields | null> => {
  if (file.type !== "application/pdf") return null;
  const buffer = await file.arrayBuffer();
  const base64 = btoa(Array.from(new Uint8Array(buffer), (b) => String.fromCharCode(b)).join(""));
  const result = await callRepProfileAI(session, { action: "parse_resume", resumeBase64: base64, mimeType: "application/pdf" });
  if (!result || "error" in result) return null;
  return result as ParsedResumeFields;
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
// reach them AND something to actually send. "research" means we can't find
// them yet (no email, no real LinkedIn profile). "no_content" is a separate,
// easy-to-miss failure mode: we CAN find them, but nobody drafted a message
// for them (the sheet-to-DB sync brought the contact over without any
// linkedin_connect_message/intro_message/follow_up_message/email_* content).
// Without this tier, a contact like that silently rendered as a normal card
// with a status dropdown and zero action buttons - reachable, but a dead
// end nobody would notice.
export type ContactTier = "email" | "linkedin" | "no_content" | "research";

export const hasRealLinkedInProfile = (contact: ProjectContact) => Boolean(contact.linkedin_url?.includes("/in/"));

export const hasOutreachContent = (contact: ProjectContact) =>
  Boolean(
    contact.linkedin_connect_message ||
      contact.intro_message ||
      contact.follow_up_message ||
      contact.email_intro_message
  );

export const getContactTier = (contact: ProjectContact): ContactTier => {
  const reachable = Boolean(contact.email) || hasRealLinkedInProfile(contact);
  if (!reachable) return "research";
  if (!hasOutreachContent(contact)) return "no_content";
  return contact.email ? "email" : "linkedin";
};

// Builds a ready-to-click LinkedIn people-search URL with the contact's name
// and company already filled in, so whoever gets this contact doesn't have
// to build the search themselves - they just click and the person should
// surface in the results.
export const buildLinkedInSearchUrl = (contactName?: string | null, company?: string | null) => {
  const query = [contactName, company].filter(Boolean).join(" ");
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
};

const TIER_ORDER: Record<ContactTier, number> = { email: 0, linkedin: 1, no_content: 2, research: 3 };

// Pulls the next batch for a team member: up to 25 "good" contacts (email
// or a real LinkedIn profile, AND a drafted message to actually send - best
// signal first) plus up to 5 "needs research" contacts (no direct way to
// reach them, or reachable but with no drafted message yet - both need a
// human's attention rather than being routed as ordinary work). Only looks
// at contacts nobody's already assigned, so batches never overlap.
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
    .filter((c) => getContactTier(c) === "email" || getContactTier(c) === "linkedin")
    .sort((a, b) => TIER_ORDER[getContactTier(a)] - TIER_ORDER[getContactTier(b)])
    .slice(0, 25);

  const research = unassigned.filter((c) => getContactTier(c) === "research" || getContactTier(c) === "no_content").slice(0, 5);

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

// Company-level batching: a rep now owns whole companies (up to 25 at a
// time) rather than a scattered list of individual contacts - every
// contact at an assigned company comes along with it, so nobody has to
// hunt for who else works there.
//
// The actual ranking (has a signal, best priority tier, and - as of the
// evenly-distribute-by-category request - round-robin across lead type so
// one category can't monopolize a rep's batch) runs entirely inside the
// assign_next_company_batch() Postgres function, not here. That's not
// optional: canonical_lead_type is owner-only data, REVOKEd at the column
// level from every Member (see leadtype_phase1_foundation.sql) so a
// Member's own session is never allowed to read it over REST. Balancing
// by category server-side, inside a SECURITY DEFINER function that never
// returns the category itself, is the only way to get "spread evenly by
// category" without breaking that boundary. See
// supabase/migrations/assign_next_company_batch.sql.
export const assignNextCompanyBatch = async (
  session: ProposalSession,
  teamMemberId: string,
  _allCompanies: Company[],
  _allContacts: ProjectContact[],
  _allProgress: Record<string, ContactProgress>,
  _signalsByCompanyId: Record<string, CompanySignal[]>,
  batchSize = 25
): Promise<{ assignedCompanyIds: string[] }> => {
  if (!DB_URL) return { assignedCompanyIds: [] };
  const response = await fetch(`${DB_URL}/rest/v1/rpc/assign_next_company_batch`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({ p_rep_id: teamMemberId, p_batch_size: batchSize }),
  });
  if (!response.ok) return { assignedCompanyIds: [] };
  const rows = (await response.json()) as { company_id: string }[];
  const companyIds = rows.map((r) => r.company_id);

  return { assignedCompanyIds: companyIds };
};

// Looks up a company by name (case/whitespace-insensitive, matching the
// same convention as normalized_name elsewhere) against an already-fetched
// companies list, creating one if it doesn't exist yet. Without this, a
// self-serve-added contact would carry only a company name string and no
// company_id - exactly the bug that left 49 imported contacts invisible in
// the app on 2026-07-25 (see backfill_orphaned_marketing_companies.sql).
const findOrCreateCompanyId = async (
  session: ProposalSession,
  companyName: string,
  companies: Company[]
): Promise<string | null> => {
  const trimmed = companyName.trim();
  if (!trimmed) return null;
  const existing = companies.find((c) => c.name.trim().toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing.id;
  if (!DB_URL) return null;
  const response = await fetch(`${DB_URL}/rest/v1/companies`, {
    method: "POST",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({ name: trimmed, normalized_name: trimmed.toLowerCase() }),
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Company[];
  return rows[0]?.id ?? null;
};

// Lets a team member add a contact they found themselves. They're
// automatically credited as the assignee, so they get attribution if it
// turns into a meeting or closed deal later. `companies` should be the
// caller's already-fetched company list, used to resolve/create the
// company_id link so this contact is never orphaned from its company card.
export const createSelfServeContact = async (
  session: ProposalSession,
  input: {
    company: string;
    contactName: string;
    email?: string;
    linkedinUrl?: string;
    assignedTo: string;
    title?: string;
    industry?: string;
    priority?: string;
    valueHypothesis?: string;
    outreachAngle?: string;
  },
  companies: Company[]
): Promise<ProjectContact | null> => {
  if (!DB_URL) return null;
  const companyId = await findOrCreateCompanyId(session, input.company, companies);
  const response = await fetch(`${DB_URL}/rest/v1/project_contacts`, {
    method: "POST",
    headers: { ...authHeaders(session), Prefer: "return=representation" },
    body: JSON.stringify({
      company: input.company,
      company_id: companyId,
      contact_name: input.contactName,
      email: input.email || null,
      linkedin_url: input.linkedinUrl || null,
      title: input.title || null,
      industry: input.industry || null,
      priority: input.priority || null,
      value_hypothesis: input.valueHypothesis || null,
      outreach_angle: input.outreachAngle || null,
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
