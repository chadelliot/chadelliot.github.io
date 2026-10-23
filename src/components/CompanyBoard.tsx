import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, Clock, Search, Undo2 } from "lucide-react";
import {
  COMPANY_STAGE_LABELS,
  STALE_NEW_OPPORTUNITY_DAYS,
  daysAgo,
  getCompanyDomain,
  getClearbitLogoUrl,
  computeCompanyInsights,
  type Company,
  type CompanyStage,
  type CompanySignal,
  type ProjectContact,
  type ContactProgress,
  type TeamMember,
} from "@/lib/projectContacts";
import { LEAD_TIER_ORDER, LEAD_TIER_SHORT, STALLED_EXPLAINER, type LeadTier } from "@/lib/outreachQueue";

// Logo, falling back to initials (also covers offline / blocked logo hosts).
const CompanyLogo = ({ domain, name }: { domain: string | null; name: string }) => {
  const [failed, setFailed] = useState(false);
  if (!domain || failed) {
    return <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-rh-body ring-1 ring-inset ring-rh-line-strong" aria-hidden="true">{name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}</span>;
  }
  return <img src={getClearbitLogoUrl(domain)} alt="" onError={() => setFailed(true)} className="h-9 w-9 shrink-0 rounded-lg border border-rh-line bg-white object-contain p-1" />;
};

const PAGE_SIZE = 25;
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70 focus-visible:ring-offset-1";
const SELECT = `h-9 min-w-0 rounded-lg border border-rh-line bg-white px-2.5 text-[13px] text-rh-body hover:border-rh-line-strong ${FOCUS}`;
const STAGE_DOT: Record<CompanyStage, string> = { new_signal: "bg-rh-faint", opportunities_engaged: "bg-rh-teal-bright", meeting_scheduled: "bg-[#5B8DEF]", closed_won: "bg-rh-teal", closed_lost: "bg-rh-red" };

type View = "needs" | "assigned" | "all";
type Sort = "time" | "newest" | "name";

type Props = {
  companies: Company[];
  contacts: ProjectContact[];
  progress: Record<string, ContactProgress>;
  signalsByCompanyId: Record<string, CompanySignal[]>;
  teamMembers: TeamMember[];
  teamMembersWithLogin: TeamMember[];
  // Owner-only lead type per company; absent if not loaded.
  tierByCompanyId?: Record<string, LeadTier>;
  // Resolves true when the assignment was actually saved.
  onAssign: (companyId: string, repId: string | null) => Promise<boolean>;
};

// How time-sensitive a company is: days until it counts as "stalled" (an
// untouched new opportunity goes cold STALE_NEW_OPPORTUNITY_DAYS after its role
// was posted). Negative = already stalled. null = no posting date to go by.
const stallClock = (company: Company, signals: CompanySignal[], engaged: number): { age: number; left: number } | null => {
  if (company.company_stage !== "new_signal" || engaged > 0) return null;
  const ages = signals.map((s) => daysAgo(s.posted_date)).filter((d): d is number => d !== null);
  if (ages.length === 0) return null;
  const newest = Math.min(...ages);
  return { age: newest, left: STALE_NEW_OPPORTUNITY_DAYS - Math.max(...ages) };
};

const LeadAssignment = ({ companies, contacts, progress, signalsByCompanyId, teamMembers, teamMembersWithLogin, tierByCompanyId, onAssign }: Props) => {
  const [view, setView] = useState<View>("needs");
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<LeadTier | "">("");
  const [repFilter, setRepFilter] = useState("all");
  const [sort, setSort] = useState<Sort>("time");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [undo, setUndo] = useState<{ companyId: string; name: string; to: string; previous: string | null } | null>(null);

  const contactsByCompanyId = useMemo(() => {
    const grouped: Record<string, ProjectContact[]> = {};
    for (const contact of contacts) {
      if (!contact.company_id) continue;
      (grouped[contact.company_id] ??= []).push(contact);
    }
    return grouped;
  }, [contacts]);
  const repById = useMemo(() => Object.fromEntries(teamMembers.map((m) => [m.id, m])), [teamMembers]);
  const insights = useMemo(() => computeCompanyInsights(companies, contactsByCompanyId, progress, signalsByCompanyId), [companies, contactsByCompanyId, progress, signalsByCompanyId]);

  // Open opportunities only: closed deals aren't something to assign.
  const open = useMemo(() => companies.filter((c) => c.company_stage !== "closed_won" && c.company_stage !== "closed_lost"), [companies]);
  const needsCount = open.filter((c) => !c.assigned_rep).length;
  const assignedCount = open.length - needsCount;

  const tierCounts = useMemo(() => {
    const c: Record<LeadTier, number> = { flexible: 0, fulltime: 0, cold: 0 };
    if (tierByCompanyId) for (const co of open) { const t = tierByCompanyId[co.id]; if (t) c[t] += 1; }
    return c;
  }, [open, tierByCompanyId]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = open
      .filter((c) => (view === "needs" ? !c.assigned_rep : view === "assigned" ? Boolean(c.assigned_rep) : true))
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .filter((c) => !tier || tierByCompanyId?.[c.id] === tier)
      .filter((c) => repFilter === "all" || (c.assigned_rep ?? "") === repFilter)
      .map((c) => ({ company: c, clock: stallClock(c, signalsByCompanyId[c.id] ?? [], insights[c.id]?.engaged ?? 0) }));
    const byName = (a: (typeof list)[number], b: (typeof list)[number]) => a.company.name.localeCompare(b.company.name);
    if (sort === "name") return list.sort(byName);
    if (sort === "newest") return list.sort((a, b) => (a.clock?.age ?? 9999) - (b.clock?.age ?? 9999) || byName(a, b));
    // Most time-sensitive first: closest to going cold (but not already cold),
    // then already-cold ones, then everything with no date to go by.
    const bucket = (r: (typeof list)[number]) => (r.clock ? (r.clock.left > 0 ? 0 : 1) : 2);
    return list.sort((a, b) => bucket(a) - bucket(b) || (bucket(a) === 0 ? (a.clock!.left - b.clock!.left) : bucket(a) === 1 ? (b.clock!.left - a.clock!.left) : 0) || byName(a, b));
  }, [open, view, search, tier, repFilter, sort, tierByCompanyId, signalsByCompanyId, insights]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [view, search, tier, repFilter, sort]);

  const assign = async (company: Company, repId: string) => {
    const previous = company.assigned_rep ?? null;
    setSaving((s) => ({ ...s, [company.id]: true }));
    setErrors((e) => { const n = { ...e }; delete n[company.id]; return n; });
    const ok = await onAssign(company.id, repId || null);
    setSaving((s) => ({ ...s, [company.id]: false }));
    if (!ok) { setErrors((e) => ({ ...e, [company.id]: "Couldn’t save. Nothing was changed." })); return; }
    setUndo({ companyId: company.id, name: company.name, to: repId ? repById[repId]?.name ?? "someone" : "no one", previous });
  };

  const tabs: { key: View; label: string; count: number }[] = [
    { key: "needs", label: "Needs assignment", count: needsCount },
    { key: "assigned", label: "Assigned", count: assignedCount },
    { key: "all", label: "All open", count: open.length },
  ];
  const visible = rows.slice(0, visibleCount);
  const remaining = rows.length - visible.length;
  const hasFilters = Boolean(search) || Boolean(tier) || repFilter !== "all";

  return (
    <div>
      {undo ? (
        <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rh-teal-bright/30 bg-rh-teal-soft px-4 py-2.5 text-[13px] text-rh-teal-ink">
          <span className="flex items-center gap-2"><Check size={15} aria-hidden="true" />{undo.name} assigned to {undo.to}.</span>
          <span className="flex items-center gap-3">
            <button type="button" onClick={async () => { const u = undo; setUndo(null); const c = companies.find((x) => x.id === u.companyId); if (c) { await onAssign(u.companyId, u.previous); } }} className={`inline-flex items-center gap-1 rounded font-semibold underline underline-offset-2 ${FOCUS}`}><Undo2 size={13} aria-hidden="true" />Undo</button>
            <button type="button" onClick={() => setUndo(null)} className={`rounded text-xs ${FOCUS}`}>Dismiss</button>
          </span>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-rh-line bg-white shadow-[0_1px_2px_rgba(21,23,28,0.03)]">
        <div role="group" aria-label="Assignment" className="flex flex-nowrap items-center gap-5 overflow-x-auto border-b border-rh-line px-5">
          {tabs.map((t) => (
            <button key={t.key} type="button" aria-pressed={view === t.key} onClick={() => { setView(t.key); if (t.key === "needs") setRepFilter("all"); }} className={`relative shrink-0 rounded-sm py-3.5 text-[13px] font-medium transition-colors ${FOCUS} ${view === t.key ? "text-rh-ink" : "text-rh-muted hover:text-rh-ink"}`}>
              {t.label}<span className={`ml-1.5 tabular-nums ${view === t.key ? "text-rh-teal" : "text-rh-faint"}`}>{t.count}</span>
              {view === t.key ? <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-rh-ink" aria-hidden="true" /> : null}
            </button>
          ))}
          {hasFilters ? <button type="button" onClick={() => { setSearch(""); setTier(""); setRepFilter("all"); }} className={`ml-auto shrink-0 rounded-sm py-3.5 text-[13px] font-medium text-rh-teal hover:underline ${FOCUS}`}>Reset</button> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-rh-line bg-rh-canvas/50 px-5 py-3">
          <div className="relative basis-full sm:min-w-[10rem] sm:flex-1 sm:basis-0">
            <label htmlFor="assign-search" className="sr-only">Search companies</label>
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rh-muted" aria-hidden="true" />
            <input id="assign-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies" className={`h-9 w-full rounded-lg border border-rh-line bg-white pl-9 pr-3 text-[13px] text-rh-ink placeholder:text-rh-muted hover:border-rh-line-strong ${FOCUS}`} />
          </div>
          {tierByCompanyId ? (
            <>
              <label htmlFor="assign-tier" className="sr-only">Project type</label>
              <select id="assign-tier" value={tier} onChange={(e) => setTier(e.target.value as LeadTier | "")} className={`${SELECT} flex-1 sm:max-w-[13rem] sm:flex-none`}>
                <option value="">All project types</option>
                {LEAD_TIER_ORDER.map((t) => <option key={t} value={t}>{LEAD_TIER_SHORT[t]} ({tierCounts[t]})</option>)}
              </select>
            </>
          ) : null}
          {view !== "needs" ? (
            <>
              <label htmlFor="assign-rep" className="sr-only">Assigned to</label>
              <select id="assign-rep" value={repFilter} onChange={(e) => setRepFilter(e.target.value)} className={`${SELECT} flex-1 sm:flex-none`}>
                <option value="all">All reps</option>
                {teamMembersWithLogin.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </>
          ) : null}
          <label htmlFor="assign-sort" className="sr-only">Sort</label>
          <select id="assign-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={`${SELECT} flex-1 sm:flex-none`}>
            <option value="time">Most time-sensitive</option>
            <option value="newest">Newest role</option>
            <option value="name">Company A–Z</option>
          </select>
        </div>

        <p className="flex items-start gap-2 border-b border-rh-line px-5 py-2.5 text-xs text-rh-muted"><Clock size={13} className="mt-0.5 shrink-0" aria-hidden="true" />{STALLED_EXPLAINER} Companies closest to going cold are listed first.</p>

        <ul>
          {visible.map(({ company, clock }) => {
            const rep = company.assigned_rep ? repById[company.assigned_rep] : null;
            const insight = insights[company.id];
            const signals = signalsByCompanyId[company.id] ?? [];
            const t = tierByCompanyId?.[company.id];
            const stalled = insight?.stalled;
            return (
              <li key={company.id} className="border-b border-rh-line last:border-0">
                <div className="grid items-center gap-x-4 gap-y-2 px-5 py-3.5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_11rem]">
                  <span className="flex min-w-0 items-center gap-3">
                    <CompanyLogo domain={getCompanyDomain(contactsByCompanyId[company.id] ?? [])} name={company.name} />
                    <span className="min-w-0">
                      <Link to={`/projects?view=assignments&company=${company.id}`} className={`block truncate rounded text-sm font-semibold text-rh-ink hover:text-rh-teal hover:underline ${FOCUS}`}>{company.name}</Link>
                      <span className="flex flex-wrap items-center gap-x-2 text-[13px] text-rh-muted">
                        <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${STAGE_DOT[company.company_stage]}`} aria-hidden="true" />{COMPANY_STAGE_LABELS[company.company_stage]}</span>
                        {t ? <span>· {LEAD_TIER_SHORT[t]}</span> : null}
                      </span>
                    </span>
                  </span>
                  <span className="min-w-0 text-[13px]">
                    {clock ? (
                      clock.left > 0 ? (
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${clock.left <= 10 ? "bg-rh-amber-soft text-rh-amber" : "bg-rh-canvas text-rh-body"}`}><Clock size={12} aria-hidden="true" />Goes cold in {clock.left} day{clock.left === 1 ? "" : "s"}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-rh-red-soft px-2 py-1 text-xs font-medium text-rh-red"><AlertTriangle size={12} aria-hidden="true" />Stalled · role posted {clock.age}d ago</span>
                      )
                    ) : stalled ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-rh-red-soft px-2 py-1 text-xs font-medium text-rh-red"><AlertTriangle size={12} aria-hidden="true" />Stalled</span>
                    ) : (
                      <span className="text-xs text-rh-muted">{insight?.engaged ?? 0} of {insight?.total ?? 0} contacted</span>
                    )}
                    <span className="mt-1 block truncate text-xs text-rh-muted">{signals[0]?.role_title ?? "No open role · cold"}{signals.length > 1 ? ` +${signals.length - 1}` : ""}</span>
                  </span>
                  <span className="min-w-0">
                    <label className="sr-only" htmlFor={`assign-${company.id}`}>Assign {company.name}</label>
                    <select
                      id={`assign-${company.id}`}
                      value={company.assigned_rep ?? ""}
                      disabled={saving[company.id]}
                      onChange={(e) => assign(company, e.target.value)}
                      className={`h-9 w-full rounded-lg border bg-white px-2.5 text-[13px] hover:border-rh-line-strong disabled:opacity-60 ${rep ? "border-rh-line text-rh-ink" : "border-rh-teal/50 text-rh-teal-ink"} ${FOCUS}`}
                    >
                      <option value="">{rep ? "Unassign" : "Assign to…"}</option>
                      {teamMembersWithLogin.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    {saving[company.id] ? <span className="mt-1 block text-xs text-rh-muted" aria-live="polite">Saving…</span> : null}
                    {errors[company.id] ? <span role="alert" className="mt-1 block text-xs text-rh-red">{errors[company.id]}</span> : null}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {rows.length === 0 ? (
          <p className="px-6 py-14 text-center text-[13px] text-rh-muted">{view === "needs" && !hasFilters ? "Every open company is assigned." : "No companies match these filters."}</p>
        ) : null}
        {remaining > 0 ? (
          <div className="border-t border-rh-line px-5 py-3 text-center">
            <button type="button" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium text-rh-teal hover:underline ${FOCUS}`}>Show {Math.min(PAGE_SIZE, remaining)} more · {remaining} remaining</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LeadAssignment;
