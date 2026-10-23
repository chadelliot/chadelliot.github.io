// Pure derivation for the Outreach queue: turns contacts + progress +
// companies + signals into one ranked, filterable list of leads. No I/O and
// no React so the ranking rules can be unit tested.

import {
  getContactTier,
  PRIORITY_ORDER,
  STATUS_LABELS,
  type Company,
  type CompanySignal,
  type ContactMeetingBlock,
  type ContactProgress,
  type ContactStatus,
  type ProjectContact,
} from "./projectContacts";

// With no explicit follow-up date, a contacted lead with no status change
// for this many days is surfaced as "no reply yet".
export const REPLY_WAIT_DAYS = 4;

export type Urgency = "overdue" | "due_today" | "first_contact" | "stale" | "upcoming" | "waiting" | "needs_research" | "closed";

export const URGENCY_LABEL: Record<Urgency, string> = {
  overdue: "Overdue",
  due_today: "Due today",
  first_contact: "First contact",
  stale: "No reply yet",
  upcoming: "Scheduled",
  waiting: "Waiting",
  needs_research: "Needs research",
  closed: "Closed",
};

// Lower sorts first.
const URGENCY_RANK: Record<Urgency, number> = {
  overdue: 0, due_today: 1, first_contact: 2, stale: 3, upcoming: 4, waiting: 5, needs_research: 6, closed: 7,
};

export type QueueFilter = "action" | "overdue" | "due_today" | "first_contact" | "stale" | "upcoming" | "closed" | "all";
export type QueueSort = "priority" | "name" | "company" | "last_touch";

export type LeadRow = {
  contact: ProjectContact;
  company: Company | undefined;
  status: ContactStatus;
  emailPosition: number;
  contacted: boolean;
  // Relationship stage in words, e.g. "LinkedIn: connection sent" or "Email 2 of 3 sent".
  stageLabel: string;
  lastTouchAt: string | null;
  lastTouchIsLogged: boolean; // true = last_contacted_at, false = last status change
  followUpAt: string | null;
  nextAction: string | null;
  urgency: Urgency;
  // Days past the follow-up date (overdue), or days since last touch (stale/waiting).
  days: number;
  project: string | null;
  projectPostedDate: string | null;
};

export const toYmd = (d: Date): string => {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const addDaysYmd = (from: Date, days: number): string => {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
  return toYmd(d);
};

const ymdToLocalDate = (ymd: string): Date => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const daysBetween = (fromYmd: string, toYmdValue: string): number =>
  Math.round((ymdToLocalDate(toYmdValue).getTime() - ymdToLocalDate(fromYmd).getTime()) / 86400000);

export const daysSince = (iso: string | null | undefined, now: Date): number | null => {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((now.getTime() - t) / 86400000));
};

export const describeStage = (status: ContactStatus, emailPosition: number): string => {
  const parts: string[] = [];
  switch (status) {
    case "not_contacted": break;
    case "connection_sent": parts.push("LinkedIn: connection sent"); break;
    case "introduction_sent": parts.push("LinkedIn: intro sent"); break;
    case "follow_up_sent": parts.push("LinkedIn: follow-up sent"); break;
    case "meeting_set": parts.push("Meeting set"); break;
    case "do_not_contact": parts.push("Do not contact"); break;
  }
  if (emailPosition > 0 && status !== "do_not_contact") parts.push(`Email ${emailPosition} of 3 sent`);
  return parts.length ? parts.join(" · ") : STATUS_LABELS.not_contacted;
};

type BuildInput = {
  contacts: ProjectContact[];
  progress: Record<string, ContactProgress>;
  companies: Company[];
  signalsByCompanyId: Record<string, CompanySignal[]>;
  meetingBlocks: Record<string, ContactMeetingBlock>;
  // Restricts to these company ids (a rep's own book). Omit for everything.
  companyIds?: Set<string>;
  followUpSupported: boolean;
  now: Date;
};

export const buildLeadRows = ({ contacts, progress, companies, signalsByCompanyId, meetingBlocks, companyIds, followUpSupported, now }: BuildInput): LeadRow[] => {
  const companyById = new Map(companies.map((c) => [c.id, c]));
  const today = toYmd(now);
  const rows: LeadRow[] = [];

  for (const contact of contacts) {
    if (!contact.company_id) continue;
    if (companyIds && !companyIds.has(contact.company_id)) continue;
    const p = progress[contact.id];
    const status: ContactStatus = p?.status ?? "not_contacted";
    const emailPosition = p?.email_sequence_position ?? 0;
    const contacted = status !== "not_contacted" || emailPosition > 0;
    const company = companyById.get(contact.company_id);
    const signal = signalsByCompanyId[contact.company_id]?.[0];

    const lastLogged = followUpSupported ? p?.last_contacted_at ?? null : null;
    const lastTouchAt = lastLogged ?? (contacted ? p?.updated_at ?? null : null);
    const followUpAt = followUpSupported ? p?.follow_up_at ?? null : null;
    const sinceTouch = daysSince(lastTouchAt, now);

    let urgency: Urgency;
    let days = 0;
    if (contact.do_not_contact || status === "do_not_contact" || status === "meeting_set" || meetingBlocks[contact.id]?.is_blocked) {
      urgency = "closed";
    } else if (followUpAt) {
      const delta = daysBetween(followUpAt, today);
      days = delta;
      urgency = delta > 0 ? "overdue" : delta === 0 ? "due_today" : "upcoming";
    } else if (!contacted) {
      urgency = getContactTier(contact) === "research" ? "needs_research" : "first_contact";
    } else if (sinceTouch !== null && sinceTouch >= REPLY_WAIT_DAYS) {
      urgency = "stale";
      days = sinceTouch;
    } else {
      urgency = "waiting";
      days = sinceTouch ?? 0;
    }

    rows.push({
      contact,
      company,
      status,
      emailPosition,
      contacted,
      stageLabel: describeStage(status, emailPosition),
      lastTouchAt,
      lastTouchIsLogged: Boolean(lastLogged),
      followUpAt,
      nextAction: followUpSupported ? p?.next_action ?? null : null,
      urgency,
      days,
      project: signal?.role_title ?? null,
      projectPostedDate: signal?.posted_date ?? null,
    });
  }
  return rows;
};

export const countByUrgency = (rows: LeadRow[]): Record<Urgency, number> => {
  const counts: Record<Urgency, number> = { overdue: 0, due_today: 0, first_contact: 0, stale: 0, upcoming: 0, waiting: 0, needs_research: 0, closed: 0 };
  for (const r of rows) counts[r.urgency] += 1;
  return counts;
};

const ACTION_URGENCIES: Urgency[] = ["overdue", "due_today", "first_contact", "stale"];

export const matchesFilter = (row: LeadRow, filter: QueueFilter): boolean => {
  if (filter === "all") return true;
  if (filter === "action") return ACTION_URGENCIES.includes(row.urgency);
  return row.urgency === filter;
};

export const matchesSearch = (row: LeadRow, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [row.contact.contact_name, row.contact.company, row.contact.title, row.project, row.contact.email]
    .some((v) => (v ?? "").toLowerCase().includes(q));
};

export const sortRows = (rows: LeadRow[], sort: QueueSort): LeadRow[] => {
  const byName = (a: LeadRow, b: LeadRow) => (a.contact.contact_name ?? "").localeCompare(b.contact.contact_name ?? "");
  const copy = [...rows];
  if (sort === "name") return copy.sort(byName);
  if (sort === "company") return copy.sort((a, b) => a.contact.company.localeCompare(b.contact.company) || byName(a, b));
  if (sort === "last_touch") {
    return copy.sort((a, b) => (a.lastTouchAt ?? "").localeCompare(b.lastTouchAt ?? "") || byName(a, b));
  }
  return copy.sort((a, b) => {
    if (a.urgency !== b.urgency) return URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency];
    if (a.urgency === "overdue" || a.urgency === "stale") {
      if (a.days !== b.days) return b.days - a.days; // longest-waiting first
    }
    if (a.urgency === "upcoming" && a.followUpAt !== b.followUpAt) return (a.followUpAt ?? "").localeCompare(b.followUpAt ?? "");
    if (a.urgency === "first_contact") {
      // A fresh hiring signal beats priority tier, mirroring the existing assignments ranking.
      const sa = a.projectPostedDate ? 0 : 1;
      const sb = b.projectPostedDate ? 0 : 1;
      if (sa !== sb) return sa - sb;
      if (a.projectPostedDate && b.projectPostedDate && a.projectPostedDate !== b.projectPostedDate) return a.projectPostedDate > b.projectPostedDate ? -1 : 1;
      const pa = PRIORITY_ORDER[a.contact.priority ?? ""] ?? 6;
      const pb = PRIORITY_ORDER[b.contact.priority ?? ""] ?? 6;
      if (pa !== pb) return pa - pb;
    }
    return a.contact.company.localeCompare(b.contact.company) || byName(a, b);
  });
};

export const formatDueLabel = (row: LeadRow): string => {
  switch (row.urgency) {
    case "overdue": return `${row.days} day${row.days === 1 ? "" : "s"} overdue`;
    case "due_today": return "Today";
    case "upcoming": return formatShortDate(row.followUpAt);
    case "stale": return `Quiet for ${row.days} days`;
    case "waiting": return row.days === 0 ? "Touched today" : `Touched ${row.days}d ago`;
    case "first_contact": return "Not yet contacted";
    case "needs_research": return "No contact method";
    default: return "";
  }
};

export const formatShortDate = (ymd: string | null): string => {
  if (!ymd) return "";
  return ymdToLocalDate(ymd).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const formatAgo = (iso: string | null | undefined, now: Date = new Date()): string => {
  const d = daysSince(iso, now);
  if (d === null) return "Never";
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
};
