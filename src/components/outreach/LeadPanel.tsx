import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Ban, Briefcase, CalendarCheck, CalendarClock, Check, ChevronDown, ChevronLeft, ChevronRight, Copy, ExternalLink, FileText, History, Info, Linkedin, Loader2, Mail, MessageSquare, PenLine, Phone, Reply, Send, TriangleAlert, UserPlus, Users, X, type LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  fetchContactActivity,
  formatWhyNow,
  getInitials,
  type ContactActivityEvent,
  type ProjectContact,
} from "@/lib/projectContacts";
import type { ProposalSession } from "@/lib/companyStatus";
import { LEAD_TIER_LABEL, addDaysYmd, formatAgo, formatShortDate, suggestedLinkedInDraft, toYmd, whyStatement, type LeadRow, type LeadTier } from "@/lib/outreachQueue";
import { UrgencyChip } from "./UrgencyChip";

export type OutcomeAction =
  | "linkedin_connection"
  | "linkedin_message"
  | "email"
  | "replied"
  | "other_contact"
  | "meeting"
  | "do_not_contact";

export type OutcomeInput = {
  action: OutcomeAction;
  note: string;
  followUpAt: string | null;
  nextAction: string;
};

export type OutcomeResult = { ok: boolean; error?: string; warning?: string; followUpSaved?: boolean };

type ActionOption = { value: OutcomeAction; label: string; short: string; Icon: LucideIcon; hint: string; followUpDays: number | null; nextAction: string };

// What each choice writes to the existing data model:
//   linkedin_* -> contact_progress.status, email -> email_sequence_position,
//   replied/other_contact -> no stage change (just last-contacted + note),
//   meeting -> status meeting_set (opens the existing meeting prompt),
//   do_not_contact -> status do_not_contact.
const ACTIONS: ActionOption[] = [
  { value: "linkedin_connection", label: "Sent LinkedIn connection request", short: "Connection request", Icon: UserPlus, hint: "Stage → Connection sent", followUpDays: 3, nextAction: "Send intro message once they accept" },
  { value: "linkedin_message", label: "Sent LinkedIn message", short: "LinkedIn message", Icon: MessageSquare, hint: "Stage → next LinkedIn step", followUpDays: 4, nextAction: "Follow up if no reply" },
  { value: "email", label: "Sent email", short: "Email", Icon: Mail, hint: "Email progress +1 (max 3)", followUpDays: 4, nextAction: "Send next email in the sequence" },
  { value: "replied", label: "They replied", short: "They replied", Icon: Reply, hint: "Stage unchanged", followUpDays: 2, nextAction: "Reply and propose a time" },
  { value: "other_contact", label: "Other contact (call, text, in person)", short: "Call or other", Icon: Phone, hint: "Stage unchanged", followUpDays: 3, nextAction: "Follow up" },
  { value: "meeting", label: "Meeting booked", short: "Meeting booked", Icon: CalendarCheck, hint: "Stage → Meeting set", followUpDays: null, nextAction: "" },
  { value: "do_not_contact", label: "Not interested / do not contact", short: "Do not contact", Icon: Ban, hint: "Stage → Do not contact", followUpDays: null, nextAction: "" },
];

const EVENT_LABELS: Record<string, { label: string; confirmed: boolean }> = {
  outcome_logged: { label: "Outcome logged", confirmed: true },
  status_changed: { label: "Stage changed", confirmed: true },
  email_sequence_changed: { label: "Email progress changed", confirmed: true },
  email_send_clicked: { label: "Opened email draft", confirmed: false },
  email_message_copied: { label: "Copied email text", confirmed: false },
  message_copied: { label: "Copied LinkedIn message", confirmed: false },
};

const describeEvent = (e: ContactActivityEvent): { title: string; detail: string; confirmed: boolean } => {
  const meta = EVENT_LABELS[e.event_type] ?? { label: e.event_type.replace(/_/g, " "), confirmed: false };
  let detail = e.event_detail ?? "";
  if (e.event_type === "outcome_logged") {
    try {
      const parsed = JSON.parse(detail) as { action?: string; note?: string };
      const option = ACTIONS.find((a) => a.value === parsed.action);
      return { title: option?.label ?? meta.label, detail: parsed.note ?? "", confirmed: true };
    } catch { /* fall through to raw detail */ }
  }
  if (e.event_type === "status_changed") detail = detail.replace(/_/g, " ");
  return { title: meta.label, detail, confirmed: meta.confirmed };
};

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70 focus-visible:ring-offset-1";
const BTN = `inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-rh-line bg-white px-3 text-[13px] font-medium text-rh-ink transition-colors hover:border-rh-line-strong hover:bg-rh-canvas disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`;
const ICON_BTN = `inline-flex h-8 w-8 items-center justify-center rounded-lg text-rh-muted transition-colors hover:bg-rh-canvas hover:text-rh-ink disabled:cursor-not-allowed disabled:opacity-30 ${FOCUS_RING}`;
const BTN_PRIMARY = `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-rh-teal px-4 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(20,99,77,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors hover:bg-rh-teal-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${FOCUS_RING}`;
const SECTION_H = "mb-3 flex items-center gap-2 text-[13px] font-semibold text-rh-ink";

const SectionTitle = ({ id, Icon, children }: { id: string; Icon: LucideIcon; children: React.ReactNode }) => (
  <h3 id={id} className={SECTION_H}><Icon size={14} className="text-rh-muted" aria-hidden="true" />{children}</h3>
);

type Props = {
  row: LeadRow;
  siblings: LeadRow[];
  tier: LeadTier | null;
  index: number;
  total: number;
  nextRow: LeadRow | null;
  isDesktop: boolean;
  session: ProposalSession;
  followUpSupported: boolean;
  // When the lead was opened from a company panel, a way back to it.
  backToCompany: { name: string; onBack: () => void } | null;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
  onGoToLead: (contactId: string) => void;
  onOpenMessage: (contact: ProjectContact, field: "linkedin_connect_message" | "intro_message" | "follow_up_message", label: string) => void;
  onOpenEmail: (contact: ProjectContact) => void;
  // Copies the right LinkedIn draft for this stage to the clipboard; resolves
  // with its name ("connection note") or null if there was nothing to copy.
  onCopyLinkedInDraft: (contact: ProjectContact) => Promise<string | null>;
  onSaveOutcome: (contact: ProjectContact, input: OutcomeInput) => Promise<OutcomeResult>;
  // Bumped by the page after anything that changes this lead's history.
  historyVersion: number;
};

const ACTIVITY_PREVIEW = 2;

const LeadPanel = ({ row, siblings, tier, index, total, nextRow, isDesktop, session, followUpSupported, backToCompany, onClose, onPrev, onNext, onGoToLead, onOpenMessage, onOpenEmail, onCopyLinkedInDraft, onSaveOutcome, historyVersion }: Props) => {
  const { contact, company } = row;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const logRef = useRef<HTMLFormElement>(null);
  const [attempt, setAttempt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkedInNote, setLinkedInNote] = useState<string | null>(null);
  const [history, setHistory] = useState<ContactActivityEvent[] | null | "loading">("loading");
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [savedLocal, setSavedLocal] = useState(0);

  // Reset per-lead UI when the selection changes.
  useEffect(() => {
    setAttempt(null);
    setCopied(false);
    setLinkedInNote(null);
    setShowAllActivity(false);
    headingRef.current?.focus({ preventScroll: true });
  }, [contact.id]);

  useEffect(() => {
    let cancelled = false;
    setHistory("loading");
    fetchContactActivity(session, contact.id).then((events) => {
      if (!cancelled) setHistory(events);
    });
    return () => { cancelled = true; };
  }, [session, contact.id, historyVersion, savedLocal]);

  const markAttempt = (what: string) => setAttempt(what);

  const copyEmail = async () => {
    if (!contact.email) return;
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked: the address is still visible to select */ }
  };

  const hasLinkedIn = Boolean(contact.linkedin_url && contact.linkedin_url.includes("/in/"));
  const draft = suggestedLinkedInDraft(row.status, contact);
  const why = whyStatement(contact);

  // Copy first, then open LinkedIn: the note is already on the clipboard when
  // the profile loads, ready to paste into "Add a note".
  const copyAndOpenLinkedIn = async () => {
    const url = contact.linkedin_url;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    const label = await onCopyLinkedInDraft(contact);
    setLinkedInNote(label);
    markAttempt(label ?? "LinkedIn profile");
  };

  return (
    <div
      role={isDesktop ? "complementary" : "dialog"}
      aria-modal={isDesktop ? undefined : true}
      aria-label={`Lead details: ${contact.contact_name ?? "contact"}`}
      className={isDesktop
        ? "flex h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-rh-line bg-white shadow-[0_1px_2px_rgba(21,23,28,0.04),0_12px_32px_rgba(21,23,28,0.06)]"
        : "fixed inset-0 z-[60] flex flex-col bg-white"}
    >
      {backToCompany ? (
        <button type="button" onClick={backToCompany.onBack} className={`flex items-center gap-1.5 px-5 pt-4 text-left text-[13px] font-medium text-rh-teal hover:underline ${FOCUS_RING}`}>
          <ArrowLeft size={14} aria-hidden="true" />{backToCompany.name}
        </button>
      ) : null}

      {/* Header */}
      <div className={`flex items-center gap-3 px-5 pb-3 ${backToCompany ? "pt-3" : "pt-5"}`}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rh-teal-soft text-sm font-semibold text-rh-teal-ink" aria-hidden="true">
          {getInitials(contact.contact_name ?? "")}
        </div>
        <div className="min-w-0 flex-1">
          <h2 ref={headingRef} tabIndex={-1} className="truncate font-display text-[17px] font-semibold leading-tight tracking-[-0.01em] text-rh-ink outline-none">
            {contact.contact_name}
          </h2>
          <p className="truncate text-[13px] text-rh-muted">{[contact.title, contact.company].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="flex shrink-0 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" aria-label="Why we're reaching out" title="Why we're reaching out" className={ICON_BTN}><Info size={17} /></button>
            </PopoverTrigger>
            <PopoverContent align="end" className="z-[70] w-80 rounded-xl border-rh-line bg-white p-4 text-[13px] leading-relaxed text-rh-body shadow-lg">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-rh-ink"><Briefcase size={13} className="text-rh-muted" aria-hidden="true" />Why we’re reaching out</p>
              <p>{why ?? "No research on file for this lead yet."}</p>
              <div className="mt-3 space-y-1 border-t border-rh-line pt-3 text-xs text-rh-muted">
                {tier ? <p>Type: <span className="text-rh-body">{LEAD_TIER_LABEL[tier]}</span></p> : null}
                {row.project ? <p>Role: <span className="text-rh-body">{row.project}{row.projectPostedDate ? `, posted ${formatShortDate(row.projectPostedDate)}` : ""}</span></p> : <p>No open role on file.</p>}
                {company ? (
                  <Link to={`/projects/company/${company.id}`} className="inline-flex items-center gap-1 font-medium text-rh-teal hover:underline">Open {company.name}<ExternalLink size={11} aria-hidden="true" /></Link>
                ) : null}
              </div>
            </PopoverContent>
          </Popover>
          <span className="mx-1 hidden text-xs tabular-nums text-rh-muted sm:inline" aria-live="polite">{index + 1} / {total}</span>
          <button type="button" onClick={onPrev ?? undefined} disabled={!onPrev} aria-label="Previous lead" className={ICON_BTN}><ChevronLeft size={17} /></button>
          <button type="button" onClick={onNext ?? undefined} disabled={!onNext} aria-label="Next lead" className={ICON_BTN}><ChevronRight size={17} /></button>
          <button type="button" onClick={onClose} aria-label="Close lead details" className={ICON_BTN}><X size={17} /></button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <UrgencyChip row={row} showDetail />
          <span className="text-[13px] text-rh-body">{row.stageLabel}</span>
        </div>

        {/* Reach out comes first: it's what you're here to do. */}
        <section aria-labelledby="contact-h">
          <SectionTitle id="contact-h" Icon={Send}>Reach out</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {hasLinkedIn ? (
              <button type="button" onClick={copyAndOpenLinkedIn} className={`${BTN} border-rh-teal/40 bg-rh-teal-soft/50 text-rh-teal-ink hover:border-rh-teal hover:bg-rh-teal-soft`}>
                <Linkedin size={14} />{draft ? `Copy ${draft.label} & open LinkedIn` : "Open LinkedIn profile"}<ExternalLink size={11} className="opacity-60" aria-hidden="true" />
              </button>
            ) : null}
            {contact.email ? (
              <>
                <button type="button" className={BTN} onClick={() => { markAttempt("email draft"); onOpenEmail(contact); }}><Mail size={14} className="text-rh-muted" />Email drafts</button>
                <button type="button" className={BTN} onClick={copyEmail} aria-live="polite" title={contact.email}>
                  {copied ? <><Check size={14} className="text-rh-teal" />Copied</> : <><Copy size={14} className="text-rh-muted" />Copy email</>}
                </button>
              </>
            ) : null}
            {!contact.email && !hasLinkedIn ? <p className="text-[13px] text-rh-muted">No email or LinkedIn profile on file for this lead.</p> : null}
          </div>
          {linkedInNote !== null || (attempt && attempt !== "email draft") ? (
            <p role="status" className="mt-2.5 flex items-start gap-1.5 text-[13px] text-rh-teal-ink">
              <Check size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              {linkedInNote ? `Copied your ${linkedInNote}. Paste it into LinkedIn’s “Add a note” box.` : "Opened LinkedIn. No draft message is on file for this lead."}
            </p>
          ) : null}
          {contact.linkedin_connect_message || contact.intro_message || contact.follow_up_message ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
              <span className="flex items-center gap-1.5 text-rh-muted"><FileText size={13} aria-hidden="true" />Edit drafts</span>
              {contact.linkedin_connect_message ? <button type="button" className={`rounded font-medium text-rh-teal hover:underline ${FOCUS_RING}`} onClick={() => { markAttempt("connection note"); onOpenMessage(contact, "linkedin_connect_message", "1. Connection note"); }}>Connection note</button> : null}
              {contact.intro_message ? <button type="button" className={`rounded font-medium text-rh-teal hover:underline ${FOCUS_RING}`} onClick={() => { markAttempt("intro message"); onOpenMessage(contact, "intro_message", "2. After accepted"); }}>Intro</button> : null}
              {contact.follow_up_message ? <button type="button" className={`rounded font-medium text-rh-teal hover:underline ${FOCUS_RING}`} onClick={() => { markAttempt("follow-up message"); onOpenMessage(contact, "follow_up_message", "3. If no response"); }}>Follow-up</button> : null}
            </div>
          ) : null}
          <p className="mt-3 flex items-start gap-1.5 text-xs text-rh-muted">
            <Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
            Opening or copying never marks a lead as contacted. Log it below once it’s sent.
          </p>
          {attempt ? (
            <div role="status" className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-rh-amber-soft px-3.5 py-2.5 text-[13px] text-rh-amber">
              <span>You opened the {attempt}. Did you send it?</span>
              <button type="button" className="rounded font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright" onClick={() => { logRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); logRef.current?.querySelector<HTMLElement>("input[type=radio]")?.focus(); }}>Log it</button>
            </div>
          ) : null}
        </section>

        <OutcomeForm
          key={contact.id}
          formRef={logRef}
          row={row}
          nextRow={nextRow}
          followUpSupported={followUpSupported}
          onSaveOutcome={async (input) => {
            const result = await onSaveOutcome(contact, input);
            if (result.ok) { setAttempt(null); setSavedLocal((v) => v + 1); }
            return result;
          }}
          onGoToLead={onGoToLead}
        />

        {/* Already working this company? Say so before anyone reaches out twice. */}
        {siblings.length > 0 ? (
          <section aria-labelledby="co-h">
            {row.sibling && !row.contacted ? (
              <div role="note" className="mb-3 flex items-start gap-2 rounded-xl bg-rh-amber-soft px-3.5 py-2.5 text-[13px] text-rh-amber">
                <Users size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span><span className="font-semibold">{row.sibling.name}</span> at {contact.company} is already in progress ({row.sibling.stageLabel}{row.sibling.lastTouchAt ? `, ${formatAgo(row.sibling.lastTouchAt).toLowerCase()}` : ""}). Check before reaching out to {contact.contact_name?.split(" ")[0] ?? "this person"}.</span>
              </div>
            ) : null}
            <SectionTitle id="co-h" Icon={Users}>Others at {contact.company}</SectionTitle>
            <ul className="divide-y divide-rh-line overflow-hidden rounded-xl border border-rh-line">
              {siblings.map((o) => (
                <li key={o.contact.id}>
                  <button type="button" onClick={() => onGoToLead(o.contact.id)} className={`flex w-full items-center justify-between gap-3 bg-white px-3.5 py-2.5 text-left text-[13px] hover:bg-rh-canvas ${FOCUS_RING}`}>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-rh-ink">{o.contact.contact_name}</span>
                      <span className="block truncate text-xs text-rh-muted">{o.stageLabel}</span>
                    </span>
                    <UrgencyChip row={o} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Where this lead stands */}
        <dl aria-label="Status" className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rh-line bg-rh-line text-[13px]">
          <div className="bg-white px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs text-rh-muted"><History size={12} aria-hidden="true" />Last contact</dt>
            <dd className="mt-1 font-medium text-rh-ink">
              {row.lastTouchAt ? formatAgo(row.lastTouchAt) : "Never"}
              {row.lastTouchAt && !row.lastTouchIsLogged ? <span className="block text-xs font-normal text-rh-muted">last stage change</span> : null}
            </dd>
          </div>
          <div className="bg-white px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs text-rh-muted"><CalendarClock size={12} aria-hidden="true" />Next action</dt>
            <dd className="mt-1 font-medium text-rh-ink">
              {row.followUpAt ? <>{row.nextAction || "Follow up"}<span className="block text-xs font-normal text-rh-muted">{formatShortDate(row.followUpAt)}</span></> : <span className="font-normal text-rh-muted">{followUpSupported ? "None scheduled" : "Not tracked yet"}</span>}
            </dd>
          </div>
        </dl>

        {/* History: the latest two, the rest on demand */}
        <section aria-labelledby="hist-h">
          <SectionTitle id="hist-h" Icon={History}>Activity</SectionTitle>
          {history === "loading" ? (
            <div className="space-y-2" aria-busy="true" aria-label="Loading activity">
              <div className="h-9 animate-pulse rounded-lg bg-rh-line" /><div className="h-9 animate-pulse rounded-lg bg-rh-line" />
            </div>
          ) : history === null ? (
            <p className="rounded-xl border border-dashed border-rh-line-strong p-3 text-[13px] text-rh-muted">Activity history can’t be loaded for this account (the activity log may not be readable). New outcomes are still recorded.</p>
          ) : history.length === 0 ? (
            <p className="text-[13px] text-rh-muted">Nothing recorded yet.</p>
          ) : (
            <>
              <ol>
                {history.slice(0, showAllActivity ? 30 : ACTIVITY_PREVIEW).map((e, i) => {
                  const d = describeEvent(e);
                  return (
                    <li key={e.id ?? i} className="relative flex gap-3 pb-4 pl-5 text-[13px] last:pb-0 before:absolute before:left-[3px] before:top-3 before:h-full before:w-px before:bg-rh-line last:before:hidden">
                      <span className={`absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full ${d.confirmed ? "bg-rh-teal" : "border border-rh-faint bg-white"}`} aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-rh-ink">
                          <span className="font-medium">{d.title}</span>
                          <span className="ml-2 text-xs text-rh-muted">{d.confirmed ? "" : "attempt, not confirmed"}</span>
                        </p>
                        {d.detail ? <p className="whitespace-pre-wrap break-words text-rh-muted">{d.detail}</p> : null}
                        {e.created_at ? <p className="text-xs text-rh-faint">{formatAgo(e.created_at)}</p> : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {history.length > ACTIVITY_PREVIEW ? (
                <button type="button" onClick={() => setShowAllActivity((v) => !v)} aria-expanded={showAllActivity} className={`mt-3 inline-flex items-center gap-1 rounded text-[13px] font-medium text-rh-teal hover:underline ${FOCUS_RING}`}>
                  {showAllActivity ? "Show less" : `Show ${history.length - ACTIVITY_PREVIEW} more`}
                  <ChevronDown size={13} className={showAllActivity ? "rotate-180" : ""} aria-hidden="true" />
                </button>
              ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

type FormProps = {
  row: LeadRow;
  nextRow: LeadRow | null;
  formRef: React.RefObject<HTMLFormElement>;
  followUpSupported: boolean;
  onSaveOutcome: (input: OutcomeInput) => Promise<OutcomeResult>;
  onGoToLead: (contactId: string) => void;
};

const OutcomeForm = ({ row, nextRow, formRef, followUpSupported, onSaveOutcome, onGoToLead }: FormProps) => {
  const [action, setAction] = useState<OutcomeAction | null>(null);
  const [note, setNote] = useState("");
  const [followUpAt, setFollowUpAt] = useState<string>("");
  const [nextAction, setNextAction] = useState("");
  const [touchedFollowUp, setTouchedFollowUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ result: OutcomeResult; followUpAt: string | null; nextId: string | null } | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const today = useMemo(() => toYmd(new Date()), []);

  const selected = ACTIONS.find((a) => a.value === action) ?? null;

  const choose = (value: OutcomeAction) => {
    setAction(value);
    setError(null);
    const option = ACTIONS.find((a) => a.value === value)!;
    // Suggest a follow-up unless the person already picked their own.
    if (!touchedFollowUp) {
      setFollowUpAt(option.followUpDays ? addDaysYmd(new Date(), option.followUpDays) : "");
      setNextAction(option.nextAction);
    }
  };

  useEffect(() => {
    if (done) nextBtnRef.current?.focus();
  }, [done]);

  const pastDate = followUpAt && followUpAt < today;
  const tooLong = nextAction.length > 120;
  const canSubmit = Boolean(action) && !saving && !pastDate && !tooLong;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!action || !canSubmit) return;
    setSaving(true);
    setError(null);
    const nextId = nextRow && nextRow.contact.id !== row.contact.id ? nextRow.contact.id : null;
    const result = await onSaveOutcome({ action, note: note.trim(), followUpAt: followUpSupported && followUpAt ? followUpAt : null, nextAction: nextAction.trim() });
    setSaving(false);
    if (result.ok) setDone({ result, followUpAt: followUpSupported && followUpAt ? followUpAt : null, nextId });
    else setError(result.error ?? "Couldn’t save. Nothing was changed. Try again.");
  };

  const presets: { label: string; days: number }[] = [
    { label: "Tomorrow", days: 1 }, { label: "3 days", days: 3 }, { label: "1 week", days: 7 }, { label: "2 weeks", days: 14 },
  ];
  const showFollowUp = action && action !== "do_not_contact" && action !== "meeting";

  if (done) {
    return (
      <section aria-label="Outcome saved" className="rounded-2xl border border-rh-teal-bright/30 bg-rh-teal-soft p-4">
        <p role="status" className="flex items-start gap-2 text-[13px] font-medium text-rh-teal-ink">
          <Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Saved{done.followUpAt ? `. Next follow-up ${formatShortDate(done.followUpAt)}.` : "."}
            {done.result.warning ? <span className="mt-1 block font-normal text-rh-amber">{done.result.warning}</span> : null}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {done.nextId ? (
            <button ref={nextBtnRef} type="button" className={`${BTN_PRIMARY} h-10`} onClick={() => onGoToLead(done.nextId!)}>Next lead<ArrowRight size={16} /></button>
          ) : (
            <p className="text-[13px] text-rh-teal-ink">That was the last lead in this view.</p>
          )}
          <button type="button" className={BTN} onClick={() => { setDone(null); setAction(null); setNote(""); setTouchedFollowUp(false); setFollowUpAt(""); setNextAction(""); }}>Log another</button>
        </div>
      </section>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} aria-labelledby="log-h" noValidate className="rounded-2xl border border-rh-line-strong bg-rh-canvas/60 p-4">
      <SectionTitle id="log-h" Icon={PenLine}>Log what happened</SectionTitle>
      <fieldset disabled={saving} className="min-w-0">
        <legend className="sr-only">What happened</legend>
        <div className="grid grid-cols-2 gap-2">
          {ACTIONS.map((o, i) => (
            <label key={o.value} title={o.label} className={`relative cursor-pointer ${i === ACTIONS.length - 1 ? "col-span-2" : ""}`}>
              <input type="radio" name="outcome" value={o.value} checked={action === o.value} onChange={() => choose(o.value)} className="peer sr-only" />
              <span className="flex min-h-[44px] items-center gap-2 rounded-xl border border-rh-line bg-white px-3 py-2 text-[13px] font-medium text-rh-body transition-colors hover:border-rh-line-strong peer-checked:border-rh-teal peer-checked:bg-rh-teal-soft peer-checked:text-rh-teal-ink peer-checked:[&>svg]:text-rh-teal peer-focus-visible:ring-2 peer-focus-visible:ring-rh-teal-bright/70">
                <o.Icon size={15} className="shrink-0 text-rh-muted" aria-hidden="true" />
                {o.short}
              </span>
            </label>
          ))}
        </div>

        {selected ? <p className="mt-2 text-xs text-rh-muted" aria-live="polite">{selected.label}. {selected.hint}.</p> : null}

        {action ? (
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="outcome-note" className="mb-1.5 block text-xs font-medium text-rh-body">Note <span className="font-normal text-rh-muted">(optional)</span></label>
              <textarea id="outcome-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={500} className={`w-full rounded-xl border border-rh-line bg-white px-3 py-2.5 text-[13px] leading-relaxed text-rh-ink placeholder:text-rh-muted hover:border-rh-line-strong ${FOCUS_RING}`} placeholder="What did they say? Anything to remember?" />
            </div>

            {showFollowUp ? (
              <div>
                <p className="mb-1.5 text-xs font-medium text-rh-body" id="fu-label">Next follow-up</p>
                {!followUpSupported ? (
                  <p className="rounded-xl border border-dashed border-rh-line-strong bg-white p-3 text-xs text-rh-muted">
                    Follow-up dates can’t be saved yet. They need a one-time database update (<code>add_follow_up_fields.sql</code>). Your outcome and any stage change will still be recorded.
                  </p>
                ) : (
                  <div role="group" aria-labelledby="fu-label" className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {presets.map((p) => {
                        const value = addDaysYmd(new Date(), p.days);
                        return (
                          <button key={p.label} type="button" aria-pressed={followUpAt === value} onClick={() => { setFollowUpAt(value); setTouchedFollowUp(true); }} className={`${BTN} h-8 px-2.5 ${followUpAt === value ? "!border-rh-teal !bg-rh-teal-soft !text-rh-teal-ink" : ""}`}>{p.label}</button>
                        );
                      })}
                      <button type="button" aria-pressed={followUpAt === ""} onClick={() => { setFollowUpAt(""); setNextAction(""); setTouchedFollowUp(true); }} className={`${BTN} h-8 px-2.5 ${followUpAt === "" ? "!border-rh-teal !bg-rh-teal-soft !text-rh-teal-ink" : ""}`}>None</button>
                    </div>
                    {followUpAt !== "" ? (
                      <div className="grid gap-3 sm:grid-cols-[9.5rem_1fr]">
                        <div>
                          <label htmlFor="fu-date" className="mb-1 block text-xs text-rh-muted">Date</label>
                          <input id="fu-date" type="date" min={today} value={followUpAt} onChange={(e) => { setFollowUpAt(e.target.value); setTouchedFollowUp(true); }} aria-invalid={Boolean(pastDate)} aria-describedby={pastDate ? "fu-err" : undefined} className={`h-10 w-full rounded-lg border bg-white px-2 text-[13px] text-rh-ink ${pastDate ? "border-rh-red" : "border-rh-line"} ${FOCUS_RING}`} />
                          {pastDate ? <p id="fu-err" className="mt-1 text-xs text-rh-red">Pick today or a later date.</p> : null}
                        </div>
                        <div>
                          <label htmlFor="fu-action" className="mb-1 block text-xs text-rh-muted">What to do</label>
                          <input id="fu-action" type="text" value={nextAction} onChange={(e) => setNextAction(e.target.value)} maxLength={140} aria-invalid={tooLong} className={`h-10 w-full rounded-lg border border-rh-line bg-white px-3 text-[13px] text-rh-ink placeholder:text-rh-muted ${FOCUS_RING}`} placeholder="e.g. Send follow-up email" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}

            {action === "do_not_contact" ? (
              <p className="flex items-start gap-2 rounded-xl bg-rh-red-soft p-3 text-xs text-rh-red"><TriangleAlert size={14} className="mt-0.5 shrink-0" aria-hidden="true" />This removes {row.contact.contact_name} from the action queue. You can revert the stage later from the company page.</p>
            ) : null}
            {action === "meeting" ? (
              <p className="rounded-xl bg-rh-teal-soft p-3 text-xs text-rh-teal-ink">Next you’ll be asked for the meeting date.</p>
            ) : null}

            {error ? (
              <div role="alert" className="flex items-start gap-2 rounded-xl bg-rh-red-soft p-3 text-[13px] text-rh-red">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{error}</span>
              </div>
            ) : null}

            <button type="submit" disabled={!canSubmit} className={`${BTN_PRIMARY} w-full`}>
              {saving ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />Saving…</> : selected?.value === "do_not_contact" ? "Mark do not contact" : "Save outcome"}
            </button>
          </div>
        ) : (
          <p className="mt-3 text-xs text-rh-muted">Choose what happened to record it and set the next step.</p>
        )}
      </fieldset>
    </form>
  );
};

export default LeadPanel;
