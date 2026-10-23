import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronRight, Search } from "lucide-react";
import {
  COMPANY_STAGE_LABELS,
  OUTREACH_MODEL_LABELS,
  OUTREACH_MODEL_DESCRIPTIONS,
  getCompanyDomain,
  getClearbitLogoUrl,
  computeCompanyInsights,
  PRIORITY_ORDER,
  type Company,
  type CompanyStage,
  type CompanySignal,
  type ProjectContact,
  type ContactProgress,
  type TeamMember,
} from "@/lib/projectContacts";

// Small logo chip for a board row - tries Clearbit, falls back to nothing
// (no initials chip here; the company name text is already the primary
// label on these rows, so a failed logo just means no image rather than
// swapping to another element).
const CompanyLogo = ({ domain, name }: { domain: string | null; name: string }) => {
  const [failed, setFailed] = useState(false);
  if (!domain || failed) {
    return <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-rh-body ring-1 ring-inset ring-rh-line-strong" aria-hidden="true">{name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}</span>;
  }
  return <img src={getClearbitLogoUrl(domain)} alt="" onError={() => setFailed(true)} className="h-9 w-9 shrink-0 rounded-lg border border-rh-line bg-white object-contain p-1" />;
};

const STAGE_ORDER: CompanyStage[] = ["new_signal", "opportunities_engaged", "meeting_scheduled", "closed_won", "closed_lost"];

// Chad's own complaint about the old column layout: with 300 opportunities,
// New Opportunity was an endless, alphabetical scroll with nothing to tell
// you where to look first, and everything past the first column needed a
// horizontal scroll to even see. This shows one page at a time (no
// drag-and-drop; he said that wasn't the actual problem) instead of
// rendering the whole filtered list up front.
const BOARD_PAGE_SIZE = 20;

type CompanyBoardProps = {
  companies: Company[];
  contacts: ProjectContact[];
  progress: Record<string, ContactProgress>;
  signalsByCompanyId: Record<string, CompanySignal[]>;
  teamMembers: TeamMember[];
  // Same rows as teamMembers, filtered to only those with a live login -
  // used for the rep-filter dropdown's options so a departed member never
  // appears as something to filter by. teamMembers itself stays the full
  // list, since repById still needs to resolve a name for any existing
  // assignment (including, in principle, a historical one).
  teamMembersWithLogin: TeamMember[];
};

const CompanyBoard = ({ companies, contacts, progress, signalsByCompanyId, teamMembers, teamMembersWithLogin }: CompanyBoardProps) => {
  const [search, setSearch] = useState("");
  const [repFilter, setRepFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState<CompanyStage | "all">("all");
  const [stalledOnly, setStalledOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(BOARD_PAGE_SIZE);

  const contactsByCompanyId = useMemo(() => {
    const grouped: Record<string, ProjectContact[]> = {};
    for (const contact of contacts) {
      if (!contact.company_id) continue;
      (grouped[contact.company_id] ??= []).push(contact);
    }
    return grouped;
  }, [contacts]);

  const repById = useMemo(() => Object.fromEntries(teamMembers.map((m) => [m.id, m])), [teamMembers]);

  // Per-company engagement, priority, and stalled-ness in one pass - shared
  // with the /projects dashboards via computeCompanyInsights so "stalled"
  // means exactly the same thing everywhere it's tracked.
  const companyInsights = useMemo(
    () => computeCompanyInsights(companies, contactsByCompanyId, progress, signalsByCompanyId),
    [companies, contactsByCompanyId, progress, signalsByCompanyId]
  );

  // Stage counts for the KPI tiles - deliberately independent of the other
  // filters, so clicking "New Opportunity" always reflects the true total
  // rather than a number already narrowed by an active rep/priority filter.
  const stageCounts = useMemo(() => {
    const counts: Record<CompanyStage, number> = { new_signal: 0, opportunities_engaged: 0, meeting_scheduled: 0, closed_won: 0, closed_lost: 0 };
    for (const c of companies) counts[c.company_stage] = (counts[c.company_stage] ?? 0) + 1;
    return counts;
  }, [companies]);

  const stalledCount = useMemo(() => companies.filter((c) => companyInsights[c.id]?.stalled).length, [companies, companyInsights]);

  const filteredCompanies = useMemo(() => {
    let rows = companies;
    if (stageFilter !== "all") rows = rows.filter((c) => c.company_stage === stageFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (repFilter !== "all") rows = rows.filter((c) => (c.assigned_rep ?? "") === repFilter);
    if (priorityFilter !== "all") rows = rows.filter((c) => (companyInsights[c.id]?.priority ?? "") === priorityFilter);
    if (stalledOnly) rows = rows.filter((c) => companyInsights[c.id]?.stalled);
    return rows;
  }, [companies, stageFilter, search, repFilter, priorityFilter, stalledOnly, companyInsights]);

  // Most-actionable-first: an open (non-closed) stage beats a closed one
  // when viewing everything together - closed_won/closed_lost are
  // reference material, not a to-do list. Within that, an open hiring
  // signal beats none, a stalled company beats a fresh one (it needs eyes),
  // and higher priority tier sorts next - alphabetical only breaks
  // remaining ties instead of being the primary order.
  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => {
      const openA = a.company_stage === "closed_won" || a.company_stage === "closed_lost" ? 1 : 0;
      const openB = b.company_stage === "closed_won" || b.company_stage === "closed_lost" ? 1 : 0;
      if (openA !== openB) return openA - openB;
      const sigA = signalsByCompanyId[a.id]?.length ? 0 : 1;
      const sigB = signalsByCompanyId[b.id]?.length ? 0 : 1;
      if (sigA !== sigB) return sigA - sigB;
      const stalledA = companyInsights[a.id]?.stalled ? 0 : 1;
      const stalledB = companyInsights[b.id]?.stalled ? 0 : 1;
      if (stalledA !== stalledB) return stalledA - stalledB;
      const pa = PRIORITY_ORDER[companyInsights[a.id]?.priority ?? ""] ?? 6;
      const pb = PRIORITY_ORDER[companyInsights[b.id]?.priority ?? ""] ?? 6;
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name);
    });
  }, [filteredCompanies, signalsByCompanyId, companyInsights]);

  // Resets back to one page whenever a filter changes - so narrowing down
  // to one rep, priority, or stage doesn't leave you scrolled deep into a
  // now-much-shorter list.
  useEffect(() => {
    setVisibleCount(BOARD_PAGE_SIZE);
  }, [search, repFilter, priorityFilter, stageFilter, stalledOnly]);

  const visibleCompanies = sortedCompanies.slice(0, visibleCount);
  const remaining = sortedCompanies.length - visibleCompanies.length;
  const hasActiveFilter = stageFilter !== "all" || repFilter !== "all" || priorityFilter !== "all" || stalledOnly || Boolean(search);

  const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70 focus-visible:ring-offset-1";
  const SELECT = `h-9 min-w-0 rounded-lg border border-rh-line bg-white px-2.5 text-[13px] text-rh-body hover:border-rh-line-strong ${FOCUS}`;
  const STAGE_DOT: Record<CompanyStage, string> = { new_signal: "bg-rh-faint", opportunities_engaged: "bg-rh-teal-bright", meeting_scheduled: "bg-[#5B8DEF]", closed_won: "bg-rh-teal", closed_lost: "bg-rh-red" };
  const tabs: { key: string; label: string; count: number; active: boolean; onClick: () => void }[] = [
    { key: "all", label: "All", count: companies.length, active: stageFilter === "all" && !stalledOnly, onClick: () => { setStageFilter("all"); setStalledOnly(false); } },
    ...STAGE_ORDER.slice(0, 3).map((stage) => ({ key: stage, label: COMPANY_STAGE_LABELS[stage], count: stageCounts[stage], active: stageFilter === stage && !stalledOnly, onClick: () => { setStalledOnly(false); setStageFilter(stage); } })),
    { key: "stalled", label: "Stalled", count: stalledCount, active: stalledOnly, onClick: () => { setStageFilter("all"); setStalledOnly(true); } },
    ...STAGE_ORDER.slice(3).map((stage) => ({ key: stage, label: COMPANY_STAGE_LABELS[stage], count: stageCounts[stage], active: stageFilter === stage && !stalledOnly, onClick: () => { setStalledOnly(false); setStageFilter(stage); } })),
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-rh-line bg-white shadow-[0_1px_2px_rgba(21,23,28,0.03)]">
      <div role="group" aria-label="Filter companies" className="flex flex-nowrap items-center gap-4 overflow-x-auto border-b border-rh-line px-5">
        {tabs.map((t) => (
          <button key={t.key} type="button" aria-pressed={t.active} onClick={t.onClick} className={`relative shrink-0 rounded-sm py-3.5 text-[13px] font-medium transition-colors ${FOCUS} ${t.active ? "text-rh-ink" : "text-rh-muted hover:text-rh-ink"}`}>
            {t.label}<span className={`ml-1.5 tabular-nums ${t.active ? "text-rh-teal" : "text-rh-faint"}`}>{t.count}</span>
            {t.active ? <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-rh-ink" aria-hidden="true" /> : null}
          </button>
        ))}
        {hasActiveFilter ? (
          <button type="button" onClick={() => { setSearch(""); setRepFilter("all"); setPriorityFilter("all"); setStageFilter("all"); setStalledOnly(false); }} className={`ml-auto shrink-0 rounded-sm py-3.5 text-[13px] font-medium text-rh-teal hover:underline ${FOCUS}`}>Reset</button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-rh-line bg-rh-canvas/50 px-5 py-3">
        <div className="relative basis-full sm:min-w-[10rem] sm:flex-1 sm:basis-0">
          <label htmlFor="board-search" className="sr-only">Search companies</label>
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rh-muted" aria-hidden="true" />
          <input id="board-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies" className={`h-9 w-full rounded-lg border border-rh-line bg-white pl-9 pr-3 text-[13px] text-rh-ink placeholder:text-rh-muted hover:border-rh-line-strong ${FOCUS}`} />
        </div>
        <label htmlFor="board-rep" className="sr-only">Rep</label>
        <select id="board-rep" value={repFilter} onChange={(e) => setRepFilter(e.target.value)} className={`${SELECT} flex-1 sm:flex-none`}>
          <option value="all">All reps</option>
          {teamMembersWithLogin.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <label htmlFor="board-priority" className="sr-only">Priority</label>
        <select id="board-priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={`${SELECT} flex-1 sm:flex-none`}>
          <option value="all">All priorities</option>
          <option value="A">Priority A</option>
          <option value="A/B">Priority A/B</option>
          <option value="B">Priority B</option>
          <option value="C">Priority C</option>
        </select>
      </div>

      <ul>
        {visibleCompanies.map((company) => {
          const rep = company.assigned_rep ? repById[company.assigned_rep] : null;
          const insight = companyInsights[company.id];
          const companySignals = signalsByCompanyId[company.id] ?? [];
          const topSignal = companySignals[0];
          const engagedPct = insight && insight.total > 0 ? Math.round((insight.engaged / insight.total) * 100) : 0;
          return (
            <li key={company.id} className="border-b border-rh-line last:border-0">
              <Link to={`/projects/company/${company.id}`} className={`group grid items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors hover:bg-rh-canvas/70 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_9rem_1rem] ${FOCUS}`}>
                <span className="flex min-w-0 items-center gap-3">
                  <CompanyLogo domain={getCompanyDomain(contactsByCompanyId[company.id] ?? [])} name={company.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-rh-ink">{company.name}</span>
                    <span className="flex flex-wrap items-center gap-x-2 text-[13px] text-rh-muted">
                      <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${STAGE_DOT[company.company_stage]}`} aria-hidden="true" />{COMPANY_STAGE_LABELS[company.company_stage]}</span>
                      {insight?.stalled ? <span className="inline-flex items-center gap-1 text-rh-amber"><AlertTriangle size={11} aria-hidden="true" />Stalled</span> : null}
                    </span>
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[13px] text-rh-body">
                    <span className="flex h-1 w-14 overflow-hidden rounded-full bg-rh-line" aria-hidden="true"><span className="block h-full rounded-full bg-rh-teal-bright" style={{ width: `${engagedPct}%` }} /></span>
                    {insight?.engaged ?? 0} of {insight?.total ?? 0} engaged
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-rh-muted">
                    {insight?.priority ? <span>Priority {insight.priority}</span> : null}
                    {companySignals.length > 0 ? <span>{companySignals.length} open role{companySignals.length === 1 ? "" : "s"}</span> : null}
                    {topSignal?.outreach_model ? <span title={OUTREACH_MODEL_DESCRIPTIONS[topSignal.outreach_model]} className="cursor-help">{OUTREACH_MODEL_LABELS[topSignal.outreach_model]}</span> : null}
                  </span>
                  {company.company_stage === "closed_lost" && company.closed_lost_reason ? <span className="mt-0.5 block truncate text-xs text-rh-red">{company.closed_lost_reason}</span> : null}
                </span>
                <span className="flex items-center gap-2 text-[13px]">
                  {rep ? (
                    <>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rh-canvas text-[10px] font-semibold text-rh-body ring-1 ring-inset ring-rh-line" aria-hidden="true">{rep.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}</span>
                      <span className="truncate text-rh-body">{rep.name}</span>
                    </>
                  ) : (
                    <span className="text-rh-muted">Unassigned</span>
                  )}
                </span>
                <ChevronRight size={16} className="hidden text-rh-faint opacity-0 transition-opacity group-hover:opacity-100 md:block" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
      {sortedCompanies.length === 0 ? <p className="px-6 py-14 text-center text-[13px] text-rh-muted">No companies match these filters.</p> : null}

      {remaining > 0 ? (
        <div className="border-t border-rh-line px-5 py-3 text-center">
          <button type="button" onClick={() => setVisibleCount((v) => v + BOARD_PAGE_SIZE)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium text-rh-teal hover:underline ${FOCUS}`}>
            Show {Math.min(BOARD_PAGE_SIZE, remaining)} more · {remaining} remaining
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default CompanyBoard;
