import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Send, CalendarClock, Trophy, XCircle, AlertTriangle } from "lucide-react";
import {
  COMPANY_STAGE_LABELS,
  OUTREACH_MODEL_LABELS,
  OUTREACH_MODEL_BADGE_CLASS,
  OUTREACH_MODEL_DESCRIPTIONS,
  getCompanyResearchSummary,
  getCompanyDomain,
  getClearbitLogoUrl,
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
const CompanyLogo = ({ domain }: { domain: string | null }) => {
  const [failed, setFailed] = useState(false);
  if (!domain || failed) return null;
  return <img src={getClearbitLogoUrl(domain)} alt="" onError={() => setFailed(true)} className="h-8 w-8 shrink-0 rounded-lg border border-[#EEEDE7] bg-white object-contain p-1" />;
};

const STAGE_ORDER: CompanyStage[] = ["new_signal", "opportunities_engaged", "meeting_scheduled", "closed_won", "closed_lost"];

// Same stage colors/icons as the "Company penetration" tiles on the main
// /projects dashboard (see STAGE_CHART_COLORS/STAGE_TINT_BG/STAGE_ICON in
// ProjectsPage.tsx) - reused deliberately rather than invented fresh, so
// this board reads as the same product instead of a second color language
// for the same five stages.
const STAGE_CHART_COLORS: Record<CompanyStage, string> = {
  new_signal: "#94A3B8",
  opportunities_engaged: "#1D4ED8",
  meeting_scheduled: "#2FA37F",
  closed_won: "#15803D",
  closed_lost: "#B91C1C",
};
const STAGE_TINT_BG: Record<CompanyStage, string> = {
  new_signal: "#94A3B822",
  opportunities_engaged: "#1D4ED822",
  meeting_scheduled: "#2FA37F22",
  closed_won: "#15803D22",
  closed_lost: "#B91C1C22",
};
const STAGE_ICON: Record<CompanyStage, typeof Zap> = {
  new_signal: Zap,
  opportunities_engaged: Send,
  meeting_scheduled: CalendarClock,
  closed_won: Trophy,
  closed_lost: XCircle,
};

// Chad's own complaint about the old column layout: with 300 opportunities,
// New Opportunity was an endless, alphabetical scroll with nothing to tell
// you where to look first, and everything past the first column needed a
// horizontal scroll to even see. This shows one page at a time (no
// drag-and-drop; he said that wasn't the actual problem) instead of
// rendering the whole filtered list up front.
const BOARD_PAGE_SIZE = 20;

// "Stalled" thresholds - deliberately computed from data that's already
// fetched (signal posted_date, meeting_date) rather than a new schema
// column, so this ships without anyone needing to run a migration first.
const STALE_NEW_OPPORTUNITY_DAYS = 30;
const STALE_MEETING_DAYS = 3;

type CompanyBoardProps = {
  companies: Company[];
  contacts: ProjectContact[];
  progress: Record<string, ContactProgress>;
  signalsByCompanyId: Record<string, CompanySignal[]>;
  teamMembers: TeamMember[];
};

const daysAgo = (dateStr?: string | null): number | null => {
  if (!dateStr) return null;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
};

const CompanyBoard = ({ companies, contacts, progress, signalsByCompanyId, teamMembers }: CompanyBoardProps) => {
  const [search, setSearch] = useState("");
  const [repFilter, setRepFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState<CompanyStage | "all">("all");
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

  // Per-company engagement, priority, and stalled-ness in one pass, so
  // filtering, sorting, and the row itself all read the same numbers
  // instead of recomputing three times.
  const companyInsights = useMemo(() => {
    const map: Record<string, { engaged: number; total: number; priority?: string | null; stalled: boolean }> = {};
    for (const company of companies) {
      const companyContacts = (contactsByCompanyId[company.id] ?? []).filter((c) => !c.do_not_contact);
      const engaged = companyContacts.filter((c) => (progress[c.id]?.status ?? "not_contacted") !== "not_contacted").length;
      const research = getCompanyResearchSummary(companyContacts);
      const companySignals = signalsByCompanyId[company.id] ?? [];
      const oldestSignalDays = companySignals.length ? Math.max(...companySignals.map((s) => daysAgo(s.posted_date) ?? 0)) : null;

      let stalled = false;
      if (company.company_stage === "new_signal") {
        // Nobody's touched a single contact here, and the signal that
        // brought it in is over a month old - this is the one quietly
        // going cold in a 300-deep list.
        stalled = engaged === 0 && (oldestSignalDays ?? 0) >= STALE_NEW_OPPORTUNITY_DAYS;
      } else if (company.company_stage === "meeting_scheduled") {
        const meetingAge = daysAgo(company.meeting_date);
        stalled = meetingAge !== null && meetingAge >= STALE_MEETING_DAYS;
      }

      map[company.id] = { engaged, total: companyContacts.length, priority: research.priority, stalled };
    }
    return map;
  }, [companies, contactsByCompanyId, progress, signalsByCompanyId]);

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
    return rows;
  }, [companies, stageFilter, search, repFilter, priorityFilter, companyInsights]);

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
  }, [search, repFilter, priorityFilter, stageFilter]);

  const visibleCompanies = sortedCompanies.slice(0, visibleCount);
  const remaining = sortedCompanies.length - visibleCompanies.length;
  const hasActiveFilter = stageFilter !== "all" || repFilter !== "all" || priorityFilter !== "all" || Boolean(search);

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {STAGE_ORDER.map((stage) => {
          const isActive = stageFilter === stage;
          const Icon = STAGE_ICON[stage];
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setStageFilter(isActive ? "all" : stage)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${isActive ? "border-primary bg-primary/5" : "border-[#EEEDE7] bg-white hover:border-primary/40"}`}
            >
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: STAGE_TINT_BG[stage] }}>
                <Icon size={16} style={{ color: STAGE_CHART_COLORS[stage] }} />
              </div>
              <p className={`text-2xl font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{stageCounts[stage]}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{COMPANY_STAGE_LABELS[stage]}</p>
            </button>
          );
        })}
      </div>

      {stalledCount > 0 ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-2.5 text-sm text-[#B91C1C]">
          <AlertTriangle size={15} className="shrink-0" />
          <span>
            <strong className="font-semibold">{stalledCount}</strong> {stalledCount === 1 ? "opportunity has" : "opportunities have"} gone quiet and could use a look.
          </span>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p className="mr-auto text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {stageFilter === "all" ? `All companies (${sortedCompanies.length})` : `${COMPANY_STAGE_LABELS[stageFilter]} (${sortedCompanies.length})`}
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies…"
          className="h-9 w-56 max-w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm outline-none focus:border-primary"
        />
        <select value={repFilter} onChange={(e) => setRepFilter(e.target.value)} className="h-9 rounded-lg border border-[#CBD5E1] bg-white px-2 text-sm font-semibold text-[#334155] outline-none focus:border-primary">
          <option value="all">All reps</option>
          {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="h-9 rounded-lg border border-[#CBD5E1] bg-white px-2 text-sm font-semibold text-[#334155] outline-none focus:border-primary">
          <option value="all">All priorities</option>
          <option value="A">A</option>
          <option value="A/B">A/B</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        {hasActiveFilter ? (
          <button
            type="button"
            onClick={() => { setSearch(""); setRepFilter("all"); setPriorityFilter("all"); setStageFilter("all"); }}
            className="text-xs font-semibold uppercase tracking-[0.08em] text-primary hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="grid gap-2">
        {visibleCompanies.map((company) => {
          const rep = company.assigned_rep ? repById[company.assigned_rep] : null;
          const insight = companyInsights[company.id];
          const companySignals = signalsByCompanyId[company.id] ?? [];
          const topSignal = companySignals[0];
          const engagedPct = insight && insight.total > 0 ? Math.round((insight.engaged / insight.total) * 100) : 0;
          return (
            <Link
              key={company.id}
              to={`/projects/company/${company.id}`}
              className="flex items-center gap-3 rounded-xl border border-[#EEEDE7] bg-white px-4 py-3 text-sm shadow-sm transition-shadow hover:shadow-md"
            >
              <CompanyLogo domain={getCompanyDomain(contactsByCompanyId[company.id] ?? [])} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold text-foreground">{company.name}</p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em]"
                    style={{ backgroundColor: STAGE_TINT_BG[company.company_stage], color: STAGE_CHART_COLORS[company.company_stage] }}
                  >
                    {COMPANY_STAGE_LABELS[company.company_stage]}
                  </span>
                  {insight?.stalled ? (
                    <span className="rounded-full bg-[#FEF2F2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#B91C1C]">Stalled</span>
                  ) : null}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  <span className="flex items-center gap-1.5 normal-case tracking-normal">
                    <span className="flex h-1.5 w-14 overflow-hidden rounded-full bg-[#E2E8F0]">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${engagedPct}%` }} />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{insight?.engaged ?? 0}/{insight?.total ?? 0} engaged</span>
                  </span>
                  {insight?.priority ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5">Priority {insight.priority}</span> : null}
                  {companySignals.length > 0 ? <span className="rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-1.5 py-0.5 text-[#92400E]">{companySignals.length} signal{companySignals.length === 1 ? "" : "s"}</span> : null}
                  {topSignal?.outreach_model ? (
                    <span title={OUTREACH_MODEL_DESCRIPTIONS[topSignal.outreach_model]} className={`cursor-help rounded-full border px-1.5 py-0.5 ${OUTREACH_MODEL_BADGE_CLASS[topSignal.outreach_model]}`}>{OUTREACH_MODEL_LABELS[topSignal.outreach_model]}</span>
                  ) : null}
                </div>
                {company.company_stage === "closed_lost" && company.closed_lost_reason ? (
                  <p className="mt-1 truncate text-[11px] text-[#B91C1C]">{company.closed_lost_reason}</p>
                ) : null}
              </div>
              <div className="shrink-0">
                {rep ? (
                  <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{rep.name}</span>
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">Unassigned</span>
                )}
              </div>
            </Link>
          );
        })}
        {sortedCompanies.length === 0 ? <p className="text-sm text-muted-foreground">No companies match these filters.</p> : null}
      </div>

      {remaining > 0 ? (
        <button
          type="button"
          onClick={() => setVisibleCount((v) => v + BOARD_PAGE_SIZE)}
          className="mt-3 w-full rounded-lg border border-[#CBD5E1] bg-white py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary"
        >
          Show {Math.min(BOARD_PAGE_SIZE, remaining)} more ({remaining} left)
        </button>
      ) : null}
    </div>
  );
};

export default CompanyBoard;
