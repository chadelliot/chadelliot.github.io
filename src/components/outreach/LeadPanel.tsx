import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Info, Linkedin, Loader2, Mail, X } from "lucide-react";
import {
  fetchContactActivity,
  formatWhyNow,
  getInitials,
  type ContactActivityEvent,
  type ProjectContact,
} from "@/lib/projectContacts";
import type { ProposalSession } from "@/lib/companyStatus";
import { addDaysYmd, formatAgo, formatShortDate, toYmd, type LeadRow } from "@/lib/outreachQueue";
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

type ActionOption = { value: OutcomeAction; label: string; hint: string; followUpDays: number | null; nextAction: string };

// What each choice writes to the existing data model:
//   linkedin_* -> contact_progress.status, email -> email_sequence_position,
//   replied/other_contact -> no stage change (just last-contacted + note),
//   meeting -> status meeting_set (opens the existing meeting prompt),
//   do_not_contact -> status do_not_contact.
const ACTIONS: ActionOption[] = [
  { value: "linkedin_connection", label: "Sent LinkedIn connection request", hint: "Stage → Connection sent", followUpDays: 3, nextAction: "Send intro message once they accept" },
  { value: "linkedin_message", label: "Sent LinkedIn message", hint: "Stage → next LinkedIn step", followUpDays: 4, nextAction: "Follow up if no reply" },
  { value: "email", label: "Sent email", hint: "Email progress +1 (max 3)", followUpDays: 4, nextAction: "Send next email in the sequence" },
  { value: "replied", label: "They replied", hint: "Stage unchanged", followUpDays: 2, nextAction: "Reply and propose a time" },
  { value: "other_contact", label: "Other contact (call, text, in person)", hint: "Stage unchanged", followUpDays: 3, nextAction: "Follow up" },
  { value: "meeting", label: "Meeting booked", hint: "Stage → Meeting set", followUpDays: null, nextAction: "" },
  { value: "do_not_contact", label: "Not interested / do not contact", hint: "Stage → Do not contact", followUpDays: null, nextAction: "" },
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

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1";
const BTN = `inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-[#D8D6CE] bg-white px-3 text-[13px] font-medium text-[#1F2933] transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`;
const BTN_PRIMARY = `inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`;

type Props = {
  row: LeadRow;
  index: number;
  total: number;
  nextRow: LeadRow | null;
  isDesktop: boolean;
  session: ProposalSession;
  followUpSupported: boolean;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
  onGoToLead: (contactId: string) => void;
  onOpenMessage: (contact: ProjectContact, field: "linkedin_connect_message" | "intro_message" | "follow_up_message", label: string) => void;
  onOpenEmail: (contact: ProjectContact) => void;
  onSaveOutcome: (contact: ProjectContact, input: OutcomeInput) => Promise<OutcomeResult>;
  // Bumped by the page after anything that changes this lead's history.
  historyVersion: number;
};

const LeadPanel = ({ row, index, total, nextRow, isDesktop, session, followUpSupported, onClose, onPrev, onNext, onGoToLead, onOpenMessage, onOpenEmail, onSaveOutcome, historyVersion }: Props) => {
  const { contact, company } = row;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const logRef = useRef<HTMLFormElement>(null);
  const [attempt, setAttempt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<ContactActivityEvent[] | null | "loading">("loading");
  const [savedLocal, setSavedLocal] = useState(0);

  // Reset per-lead UI when the selection changes.
  useEffect(() => {
    setAttempt(null);
    setCopied(false);
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

  return (
    <div
      role={isDesktop ? "complementary" : "dialog"}
      aria-modal={isDesktop ? undefined : true}
      aria-label={`Lead details: ${contact.contact_name ?? "contact"}`}
      className={isDesktop
        ? "flex h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-xl border border-[#E4E2DA] bg-white shadow-[0_1px_2px_rgba(20,21,26,0.04),0_8px_24px_rgba(20,21,26,0.06)]"
        : "fixed inset-0 z-[60] flex flex-col bg-white"}
    >
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-[#EEEDE7] px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary" aria-hidden="true">
          {getInitials(contact.contact_name ?? "")}
        </div>
        <div className="min-w-0 flex-1">
          <h2 ref={headingRef} tabIndex={-1} className="truncate font-display text-lg font-extrabold leading-tight tracking-tight text-foreground outline-none">
            {contact.contact_name}
          </h2>
          <p className="truncate text-[13px] text-[#52606D]">{[contact.title, contact.company].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="mr-1 hidden text-xs tabular-nums text-[#52606D] sm:inline" aria-live="polite">{index + 1} of {total}</span>
          <button type="button" onClick={onPrev ?? undefined} disabled={!onPrev} aria-label="Previous lead" className={`${BTN} h-9 w-9 px-0`}><ChevronLeft size={16} /></button>
          <button type="button" onClick={onNext ?? undefined} disabled={!onNext} aria-label="Next lead" className={`${BTN} h-9 w-9 px-0`}><ChevronRight size={16} /></button>
          <button type="button" onClick={onClose} aria-label="Close lead details" className={`${BTN} h-9 w-9 px-0`}><X size={16} /></button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {/* Where this lead stands */}
        <section aria-label="Status" className="rounded-lg border border-[#EEEDE7] bg-[#FAFAF8] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <UrgencyChip row={row} />
            <span className="text-[13px] font-medium text-foreground">{row.stageLabel}</span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52606D]">Last contact</dt>
              <dd className="mt-0.5 text-foreground">
                {row.lastTouchAt ? formatAgo(row.lastTouchAt) : "Never"}
                {row.lastTouchAt && !row.lastTouchIsLogged ? <span className="block text-[11px] text-[#52606D]">last stage change</span> : null}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52606D]">Next action</dt>
              <dd className="mt-0.5 text-foreground">
                {row.followUpAt ? <>{row.nextAction || "Follow up"} <span className="text-[#52606D]">· {formatShortDate(row.followUpAt)}</span></> : <span className="text-[#52606D]">{followUpSupported ? "None scheduled" : "Not tracked yet"}</span>}
              </dd>
            </div>
          </dl>
        </section>

        {/* Context */}
        <section aria-labelledby="ctx-h">
          <h3 id="ctx-h" className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#52606D]">Why this lead</h3>
          <div className="space-y-2 text-[13px] leading-relaxed text-foreground">
            <p>
              <span className="font-semibold">Company: </span>
              {company ? <Link to={`/projects/company/${company.id}`} className={`rounded text-primary underline-offset-2 hover:underline ${FOCUS_RING}`}>{company.name}</Link> : contact.company}
            </p>
            {row.project ? <p><span className="font-semibold">Open role / project: </span>{row.project}{row.projectPostedDate ? <span className="text-[#52606D]"> · posted {formatShortDate(row.projectPostedDate)}</span> : null}</p> : <p className="text-[#52606D]">No open role on file for this company.</p>}
            {contact.value_hypothesis ? <p><span className="font-semibold">Why it fits: </span>{contact.value_hypothesis}</p> : null}
            {contact.outreach_angle ? <p><span className="font-semibold">Why now: </span>{formatWhyNow(contact.outreach_angle)}</p> : null}
          </div>
        </section>

        {/* Contact methods */}
        <section aria-labelledby="contact-h">
          <h3 id="contact-h" className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#52606D]">Reach out</h3>
          <div className="flex flex-wrap gap-2">
            {contact.email ? (
              <>
                <button type="button" className={BTN} onClick={() => { markAttempt("email draft"); onOpenEmail(contact); }}><Mail size={14} />Email drafts</button>
                <button type="button" className={BTN} onClick={copyEmail} aria-live="polite">
                  {copied ? <><Check size={14} />Copied</> : <><Copy size={14} />Copy {contact.email}</>}
                </button>
              </>
            ) : null}
            {hasLinkedIn ? (
              <a href={contact.linkedin_url ?? "#"} target="_blank" rel="noreferrer" onClick={() => markAttempt("LinkedIn profile")} className={BTN}>
                <Linkedin size={14} />LinkedIn profile<ExternalLink size={12} aria-hidden="true" />
              </a>
            ) : null}
            {contact.linkedin_connect_message ? <button type="button" className={BTN} onClick={() => { markAttempt("connection note"); onOpenMessage(contact, "linkedin_connect_message", "1. Connection note"); }}>Connection note</button> : null}
            {contact.intro_message ? <button type="button" className={BTN} onClick={() => { markAttempt("intro message"); onOpenMessage(contact, "intro_message", "2. After accepted"); }}>Intro message</button> : null}
            {contact.follow_up_message ? <button type="button" className={BTN} onClick={() => { markAttempt("follow-up message"); onOpenMessage(contact, "follow_up_message", "3. If no response"); }}>Follow-up message</button> : null}
            {!contact.email && !hasLinkedIn ? <p className="text-[13px] text-[#52606D]">No email or LinkedIn profile on file for this lead.</p> : null}
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-xs text-[#52606D]">
            <Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
            Opening or copying a draft never marks this lead as contacted. Log it below once it has actually been sent.
          </p>
          {attempt ? (
            <div role="status" className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5 text-[13px] text-[#92400E]">
              <span>You opened the {attempt}. Did you send it?</span>
              <button type="button" className="rounded font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { logRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); logRef.current?.querySelector<HTMLElement>("input[type=radio]")?.focus(); }}>Log the outcome</button>
            </div>
          ) : null}
        </section>

        {/* Log outcome */}
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

        {/* History */}
        <section aria-labelledby="hist-h">
          <h3 id="hist-h" className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#52606D]">Activity</h3>
          {history === "loading" ? (
            <div className="space-y-2" aria-busy="true" aria-label="Loading activity">
              <div className="h-9 animate-pulse rounded-md bg-[#F1F0EC]" /><div className="h-9 animate-pulse rounded-md bg-[#F1F0EC]" />
            </div>
          ) : history === null ? (
            <p className="rounded-lg border border-dashed border-[#D8D6CE] p-3 text-[13px] text-[#52606D]">Activity history can’t be loaded for this account (the activity log may not be readable). New outcomes are still recorded.</p>
          ) : history.length === 0 ? (
            <p className="text-[13px] text-[#52606D]">Nothing recorded yet.</p>
          ) : (
            <ol className="space-y-0">
              {history.slice(0, 12).map((e, i) => {
                const d = describeEvent(e);
                return (
                  <li key={e.id ?? i} className="flex gap-3 border-l border-[#E4E2DA] pb-3 pl-4 text-[13px] last:pb-0">
                    <div className="-ml-[21px] mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: d.confirmed ? "#1F7F63" : "#B8B5A9" }} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-foreground">
                        <span className="font-medium">{d.title}</span>
                        <span className="ml-2 text-[11px] text-[#52606D]">{d.confirmed ? "Confirmed" : "Attempt, not confirmed"}</span>
                      </p>
                      {d.detail ? <p className="whitespace-pre-wrap break-words text-[#52606D]">{d.detail}</p> : null}
                      {e.created_at ? <p className="text-[11px] text-[#5F6B7A]">{formatAgo(e.created_at)}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ol>
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
      <section aria-label="Outcome saved" className="rounded-lg border border-[#A7DFC9] bg-[#F0FBF6] p-4">
        <p role="status" className="flex items-start gap-2 text-[13px] font-medium text-[#0F6E56]">
          <Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Saved{done.followUpAt ? `. Next follow-up ${formatShortDate(done.followUpAt)}.` : "."}
            {done.result.warning ? <span className="mt-1 block font-normal text-[#92400E]">{done.result.warning}</span> : null}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {done.nextId ? (
            <button ref={nextBtnRef} type="button" className={BTN_PRIMARY} onClick={() => onGoToLead(done.nextId!)}>Next lead<ArrowRight size={16} /></button>
          ) : (
            <p ref={undefined} className="text-[13px] text-[#0F6E56]">That was the last lead in this view.</p>
          )}
          <button type="button" className={BTN} onClick={() => { setDone(null); setAction(null); setNote(""); setTouchedFollowUp(false); setFollowUpAt(""); setNextAction(""); }}>Log another</button>
        </div>
      </section>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} aria-labelledby="log-h" noValidate>
      <h3 id="log-h" className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#52606D]">Log what happened</h3>
      <fieldset disabled={saving} className="min-w-0">
        <legend className="sr-only">What happened</legend>
        <div className="grid gap-1.5">
          {ACTIONS.map((o) => (
            <label key={o.value} className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-[13px] transition-colors focus-within:ring-2 focus-within:ring-primary ${action === o.value ? "border-primary bg-primary/[0.05]" : "border-[#E4E2DA] bg-white hover:border-[#B8B5A9]"}`}>
              <input type="radio" name="outcome" value={o.value} checked={action === o.value} onChange={() => choose(o.value)} className="mt-0.5 h-4 w-4 accent-[#1F7F63]" />
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{o.label}</span>
                <span className="block text-xs text-[#52606D]">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>

        {action ? (
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="outcome-note" className="mb-1 block text-xs font-semibold text-[#3E4C59]">Note <span className="font-normal text-[#52606D]">(optional)</span></label>
              <textarea id="outcome-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={500} className={`w-full rounded-md border border-[#D8D6CE] bg-white px-3 py-2 text-[13px] leading-relaxed ${FOCUS_RING}`} placeholder="What did they say? Anything to remember?" />
            </div>

            {showFollowUp ? (
              <div>
                <p className="mb-1.5 text-xs font-semibold text-[#3E4C59]" id="fu-label">Next follow-up</p>
                {!followUpSupported ? (
                  <p className="rounded-md border border-dashed border-[#D8D6CE] bg-[#FAFAF8] p-3 text-xs text-[#52606D]">
                    Follow-up dates can’t be saved yet. They need a one-time database update (<code>add_follow_up_fields.sql</code>). Your outcome and any stage change will still be recorded.
                  </p>
                ) : (
                  <div role="group" aria-labelledby="fu-label" className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {presets.map((p) => {
                        const value = addDaysYmd(new Date(), p.days);
                        return (
                          <button key={p.label} type="button" aria-pressed={followUpAt === value} onClick={() => { setFollowUpAt(value); setTouchedFollowUp(true); }} className={`${BTN} ${followUpAt === value ? "!border-primary !bg-primary/10 !text-primary" : ""}`}>{p.label}</button>
                        );
                      })}
                      <button type="button" aria-pressed={followUpAt === ""} onClick={() => { setFollowUpAt(""); setNextAction(""); setTouchedFollowUp(true); }} className={`${BTN} ${followUpAt === "" ? "!border-primary !bg-primary/10 !text-primary" : ""}`}>No follow-up</button>
                    </div>
                    {followUpAt !== "" ? (
                      <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                        <div>
                          <label htmlFor="fu-date" className="mb-1 block text-xs text-[#52606D]">Date</label>
                          <input id="fu-date" type="date" min={today} value={followUpAt} onChange={(e) => { setFollowUpAt(e.target.value); setTouchedFollowUp(true); }} aria-invalid={Boolean(pastDate)} aria-describedby={pastDate ? "fu-err" : undefined} className={`h-10 w-full rounded-md border bg-white px-2 text-[13px] ${pastDate ? "border-[#B91C1C]" : "border-[#D8D6CE]"} ${FOCUS_RING}`} />
                          {pastDate ? <p id="fu-err" className="mt-1 text-xs text-[#B91C1C]">Pick today or a later date.</p> : null}
                        </div>
                        <div>
                          <label htmlFor="fu-action" className="mb-1 block text-xs text-[#52606D]">What to do</label>
                          <input id="fu-action" type="text" value={nextAction} onChange={(e) => setNextAction(e.target.value)} maxLength={140} aria-invalid={tooLong} className={`h-10 w-full rounded-md border border-[#D8D6CE] bg-white px-3 text-[13px] ${FOCUS_RING}`} placeholder="e.g. Send follow-up email" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}

            {action === "do_not_contact" ? (
              <p className="flex items-start gap-2 rounded-md bg-[#FEF2F2] p-3 text-xs text-[#991B1B]"><AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />This removes {row.contact.contact_name} from the action queue. You can revert the stage later from the company page.</p>
            ) : null}
            {action === "meeting" ? (
              <p className="rounded-md bg-primary/[0.06] p-3 text-xs text-[#0F6E56]">Next you’ll be asked for the meeting date.</p>
            ) : null}

            {error ? (
              <div role="alert" className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] p-3 text-[13px] text-[#991B1B]">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{error}</span>
              </div>
            ) : null}

            <button type="submit" disabled={!canSubmit} className={`${BTN_PRIMARY} w-full`}>
              {saving ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />Saving…</> : selected?.value === "do_not_contact" ? "Mark do not contact" : "Save outcome"}
            </button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-[#52606D]">Choose what happened to record it and set the next step.</p>
        )}
      </fieldset>
    </form>
  );
};

export default LeadPanel;
