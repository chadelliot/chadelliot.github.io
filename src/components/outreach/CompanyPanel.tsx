import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, CalendarClock, ExternalLink, History, Info, TriangleAlert, UserRound, Users, X } from "lucide-react";
import { COMPANY_STAGE_LABELS, OUTREACH_MODEL_LABELS, daysAgo, type CompanySignal } from "@/lib/projectContacts";
import { LEAD_TIER_LABEL, STALLED_EXPLAINER, formatAgo, formatShortDate, whyStatement, type CompanyGroup, type LeadTier } from "@/lib/outreachQueue";
import { UrgencyChip } from "./UrgencyChip";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70 focus-visible:ring-offset-1";
const ICON_BTN = `inline-flex h-8 w-8 items-center justify-center rounded-lg text-rh-muted transition-colors hover:bg-rh-canvas hover:text-rh-ink ${FOCUS_RING}`;
const STAGE_DOT: Record<string, string> = {
  new_signal: "bg-rh-faint", opportunities_engaged: "bg-rh-teal-bright", meeting_scheduled: "bg-[#5B8DEF]", closed_won: "bg-rh-teal", closed_lost: "bg-rh-red",
};

const SectionTitle = ({ id, Icon, children }: { id: string; Icon: typeof Users; children: React.ReactNode }) => (
  <h3 id={id} className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-rh-ink"><Icon size={14} className="text-rh-muted" aria-hidden="true" />{children}</h3>
);

type Props = {
  group: CompanyGroup;
  signals: CompanySignal[];
  tier: LeadTier | null;
  repName: string | null;
  stalledReason: string | null;
  isDesktop: boolean;
  onClose: () => void;
  onOpenLead: (contactId: string) => void;
};

// High-level company view: who has been contacted, where things stand, and
// what the opportunity is. Deliberately read-only: stage changes (close won /
// lost) and assignment live elsewhere so they can't be hit by accident.
const CompanyPanel = ({ group, signals, tier, repName, stalledReason, isDesktop, onClose, onOpenLead }: Props) => {
  const { company, rows } = group;
  const stage = company.company_stage;
  const top = rows.find((r) => r.urgency !== "closed") ?? rows[0];
  const why = rows.map((r) => whyStatement(r.contact)).find(Boolean) ?? null;

  return (
    <div
      role={isDesktop ? "complementary" : "dialog"}
      aria-modal={isDesktop ? undefined : true}
      aria-label={`Company details: ${company.name}`}
      className={isDesktop
        ? "flex h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-rh-line bg-white shadow-[0_1px_2px_rgba(21,23,28,0.04),0_12px_32px_rgba(21,23,28,0.06)]"
        : "fixed inset-0 z-[60] flex flex-col bg-white"}
    >
      <div className="flex items-start gap-3 px-5 pb-3 pt-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-rh-body ring-1 ring-inset ring-rh-line-strong" aria-hidden="true">
          {company.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
        </div>
        <div className="min-w-0 flex-1">
          <h2 tabIndex={-1} className="truncate font-display text-[17px] font-semibold leading-tight tracking-[-0.01em] text-rh-ink outline-none">{company.name}</h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[13px] text-rh-muted">
            <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${STAGE_DOT[stage]}`} aria-hidden="true" />{COMPANY_STAGE_LABELS[stage]}</span>
            {tier ? <span>· {LEAD_TIER_LABEL[tier]}</span> : null}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close company details" className={ICON_BTN}><X size={17} /></button>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-6">
        {stalledReason ? (
          <div role="note" className="rounded-xl bg-rh-amber-soft px-3.5 py-3 text-[13px] text-rh-amber">
            <p className="flex items-center gap-1.5 font-semibold"><TriangleAlert size={14} aria-hidden="true" />Stalled</p>
            <p className="mt-1">{stalledReason}</p>
            <p className="mt-1 flex items-start gap-1.5 text-xs opacity-90"><Info size={12} className="mt-0.5 shrink-0" aria-hidden="true" />{STALLED_EXPLAINER}</p>
          </div>
        ) : null}

        <dl aria-label="Summary" className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rh-line bg-rh-line text-[13px]">
          <div className="bg-white px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs text-rh-muted"><Users size={12} aria-hidden="true" />Contacted</dt>
            <dd className="mt-1 font-medium text-rh-ink">{group.contacted} of {rows.length}</dd>
          </div>
          <div className="bg-white px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs text-rh-muted"><UserRound size={12} aria-hidden="true" />Assigned to</dt>
            <dd className="mt-1 font-medium text-rh-ink">{repName ?? <span className="font-normal text-rh-muted">Unassigned</span>}</dd>
          </div>
          <div className="bg-white px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs text-rh-muted"><History size={12} aria-hidden="true" />Last contact</dt>
            <dd className="mt-1 font-medium text-rh-ink">{group.lastTouchAt ? formatAgo(group.lastTouchAt) : <span className="font-normal text-rh-muted">Never</span>}</dd>
          </div>
          <div className="bg-white px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs text-rh-muted"><CalendarClock size={12} aria-hidden="true" />Next follow-up</dt>
            <dd className="mt-1 font-medium text-rh-ink">{group.nextDue ? formatShortDate(group.nextDue) : <span className="font-normal text-rh-muted">None scheduled</span>}</dd>
          </div>
        </dl>

        {/* Who's been contacted */}
        <section aria-labelledby="who-h">
          <SectionTitle id="who-h" Icon={Users}>Contacts</SectionTitle>
          <ul className="divide-y divide-rh-line overflow-hidden rounded-xl border border-rh-line">
            {rows.map((r) => (
              <li key={r.contact.id}>
                <button type="button" onClick={() => onOpenLead(r.contact.id)} className={`group flex w-full items-center justify-between gap-3 bg-white px-3.5 py-3 text-left hover:bg-rh-canvas ${FOCUS_RING}`}>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-rh-ink">{r.contact.contact_name}</span>
                    <span className="block truncate text-xs text-rh-muted">{r.contact.title ?? "—"}</span>
                    <span className="block truncate text-xs text-rh-body">{r.stageLabel}{r.lastTouchAt ? ` · ${formatAgo(r.lastTouchAt).toLowerCase()}` : ""}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5"><UrgencyChip row={r} /><ArrowRight size={14} className="text-rh-faint opacity-0 group-hover:opacity-100" aria-hidden="true" /></span>
                </button>
              </li>
            ))}
          </ul>
          {top && top.urgency !== "closed" ? (
            <button type="button" onClick={() => onOpenLead(top.contact.id)} className={`mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-rh-teal px-4 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(20,99,77,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-rh-teal-ink ${FOCUS_RING}`}>
              Open {top.contact.contact_name}<ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : null}
        </section>

        {/* The opportunity */}
        <section aria-labelledby="role-h">
          <SectionTitle id="role-h" Icon={Briefcase}>Opportunity</SectionTitle>
          {signals.length === 0 ? (
            <p className="text-[13px] text-rh-muted">No open role on file. This is cold outreach.</p>
          ) : (
            <ul className="space-y-2">
              {signals.map((s) => {
                const age = daysAgo(s.posted_date);
                return (
                  <li key={s.id} className="rounded-xl border border-rh-line px-3.5 py-2.5 text-[13px]">
                    <p className="font-medium text-rh-ink">{s.role_title ?? "Open role"}</p>
                    <p className="text-xs text-rh-muted">
                      {s.posted_date ? `Posted ${formatShortDate(s.posted_date.slice(0, 10))}${age !== null ? ` · ${age} day${age === 1 ? "" : "s"} ago` : ""}` : "Posting date unknown"}
                      {s.outreach_model ? ` · ${OUTREACH_MODEL_LABELS[s.outreach_model]}` : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          {why ? <p className="mt-3 text-[13px] leading-relaxed text-rh-body"><span className="font-medium text-rh-ink">Why we’re reaching out. </span>{why}</p> : null}
          {stage === "closed_lost" && company.closed_lost_reason ? <p className="mt-3 text-[13px] text-rh-red">Closed lost: {company.closed_lost_reason}</p> : null}
        </section>

        <Link to={`/projects/company/${company.id}`} className={`inline-flex items-center gap-1.5 rounded-lg text-[13px] font-medium text-rh-teal hover:underline ${FOCUS_RING}`}>
          Open full company page<ExternalLink size={12} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyPanel;
