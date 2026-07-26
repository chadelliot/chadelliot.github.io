import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

// Small logo chip for a board card - tries Clearbit, falls back to nothing
// (no initials chip here; the company name text is already the primary
// label on these compact cards, so a failed logo just means no image
// rather than swapping to another element).
const CompanyLogo = ({ domain }: { domain: string | null }) => {
  const [failed, setFailed] = useState(false);
  if (!domain || failed) return null;
  return <img src={getClearbitLogoUrl(domain)} alt="" onError={() => setFailed(true)} className="h-5 w-5 shrink-0 rounded border border-[#EEEDE7] bg-white object-contain p-0.5" />;
};

const STAGE_ORDER: CompanyStage[] = ["new_signal", "meeting_scheduled", "closed_won", "closed_lost"];

const STAGE_COLUMN_CLASS: Record<CompanyStage, string> = {
  new_signal: "border-[#EEEDE7] bg-[#FAFAF8]",
  meeting_scheduled: "border-primary/30 bg-primary/5",
  closed_won: "border-[#BBF7D0] bg-[#F0FDF4]",
  closed_lost: "border-[#FECACA] bg-[#FEF2F2]",
};

const STAGE_HEADER_CLASS: Record<CompanyStage, string> = {
  new_signal: "text-[#334155]",
  meeting_scheduled: "text-primary",
  closed_won: "text-[#15803D]",
  closed_lost: "text-[#B91C1C]",
};

// Chad's own complaint about the old board: with 300 opportunities, the New
// Opportunity column was an endless, alphabetical scroll with nothing to
// tell you where to look first. Two fixes below address that directly -
// each column only renders a page at a time (no drag-and-drop; he said that
// wasn't the actual problem), and within a column, companies are sorted so
// the ones worth looking at surface first instead of A-Z noise.
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
  const [visibleCounts, setVisibleCounts] = useState<Record<CompanyStage, number>>({
    new_signal: BOARD_PAGE_SIZE,
    meeting_scheduled: BOARD_PAGE_SIZE,
    closed_won: BOARD_PAGE_SIZE,
    closed_lost: BOARD_PAGE_SIZE,
  });

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
  // filtering, sorting, and the card itself all read the same numbers
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
        // going cold in a 300-row column.
        stalled = engaged === 0 && (oldestSignalDays ?? 0) >= STALE_NEW_OPPORTUNITY_DAYS;
      } else if (company.company_stage === "meeting_scheduled") {
        const meetingAge = daysAgo(company.meeting_date);
        stalled = meetingAge !== null && meetingAge >= STALE_MEETING_DAYS;
      }

      map[company.id] = { engaged, total: companyContacts.length, priority: research.priority, stalled };
    }
    return map;
  }, [companies, contactsByCompanyId, progress, signalsByCompanyId]);

  const filteredCompanies = useMemo(() => {
    let rows = companies;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (repFilter !== "all") rows = rows.filter((c) => (c.assigned_rep ?? "") === repFilter);
    if (priorityFilter !== "all") rows = rows.filter((c) => (companyInsights[c.id]?.priority ?? "") === priorityFilter);
    return rows;
  }, [companies, search, repFilter, priorityFilter, companyInsights]);

  const companiesByStage = useMemo(() => {
    const grouped: Record<CompanyStage, Company[]> = { new_signal: [], meeting_scheduled: [], closed_won: [], closed_lost: [] };
    for (const company of filteredCompanies) grouped[company.company_stage]?.push(company);
    // Most-actionable-first within each column: an open hiring signal beats
    // none, a stalled company beats a fresh one (it needs eyes), and within
    // that, higher priority tier sorts first - alphabetical only breaks
    // remaining ties, instead of being the primary order.
    for (const stage of STAGE_ORDER) {
      grouped[stage].sort((a, b) => {
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
    }
    return grouped;
  }, [filteredCompanies, signalsByCompanyId, companyInsights]);

  // Resets each column back to one page whenever a filter changes - so
  // narrowing down to one rep or priority doesn't leave you scrolled deep
  // into a now-much-shorter list.
  useEffect(() => {
    setVisibleCounts({ new_signal: BOARD_PAGE_SIZE, meeting_scheduled: BOARD_PAGE_SIZE, closed_won: BOARD_PAGE_SIZE, closed_lost: BOARD_PAGE_SIZE });
  }, [search, repFilter, priorityFilter]);

  const showMore = (stage: CompanyStage) => setVisibleCounts((current) => ({ ...current, [stage]: current[stage] + BOARD_PAGE_SIZE }));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p className="mr-auto text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Company board</p>
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
        {repFilter !== "all" || priorityFilter !== "all" || search ? (
          <button type="button" onClick={() => { setSearch(""); setRepFilter("all"); setPriorityFilter("all"); }} className="text-xs font-semibold uppercase tracking-[0.08em] text-primary hover:underline">
            Clear
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {STAGE_ORDER.map((stage) => {
          const stageCompanies = companiesByStage[stage];
          const visible = Math.min(visibleCounts[stage], stageCompanies.length);
          const remaining = stageCompanies.length - visible;
          return (
            <div key={stage} className={`rounded-2xl border p-3 ${STAGE_COLUMN_CLASS[stage]}`}>
              <p className={`mb-3 text-[11px] font-bold uppercase tracking-[0.08em] ${STAGE_HEADER_CLASS[stage]}`}>
                {COMPANY_STAGE_LABELS[stage]} <span className="font-mono text-muted-foreground">({stageCompanies.length})</span>
              </p>
              {/* Fixed-height, independently scrolling column - a 300-deep
                  New Opportunity list no longer drags the whole page down
                  with it, and pairs with the "Show more" pagination below
                  instead of rendering all 300 cards up front. */}
              <div className="grid max-h-[70vh] gap-2 overflow-y-auto pr-1">
                {stageCompanies.slice(0, visible).map((company) => {
                  const rep = company.assigned_rep ? repById[company.assigned_rep] : null;
                  const insight = companyInsights[company.id];
                  const companySignals = signalsByCompanyId[company.id] ?? [];
                  const topSignal = companySignals[0];
                  return (
                    <Link
                      key={company.id}
                      to={`/projects/company/${company.id}`}
                      className="block rounded-xl border border-[#EEEDE7] bg-white px-3 py-2.5 text-sm shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <CompanyLogo domain={getCompanyDomain(contactsByCompanyId[company.id] ?? [])} />
                          <p className="truncate font-semibold text-foreground">{company.name}</p>
                        </span>
                        {insight?.stalled ? (
                          <span className="shrink-0 rounded-full bg-[#FEF2F2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#B91C1C]">Stalled</span>
                        ) : null}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                        <span>{insight?.engaged ?? 0} of {insight?.total ?? 0} engaged</span>
                        {insight?.priority ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5">Priority {insight.priority}</span> : null}
                        {companySignals.length > 0 ? <span className="rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-1.5 py-0.5 text-[#92400E]">{companySignals.length} signal{companySignals.length === 1 ? "" : "s"}</span> : null}
                        {topSignal?.outreach_model ? (
                          <span title={OUTREACH_MODEL_DESCRIPTIONS[topSignal.outreach_model]} className={`cursor-help rounded-full border px-1.5 py-0.5 ${OUTREACH_MODEL_BADGE_CLASS[topSignal.outreach_model]}`}>{OUTREACH_MODEL_LABELS[topSignal.outreach_model]}</span>
                        ) : null}
                        {rep ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5">{rep.name}</span> : <span className="text-muted-foreground/70">Unassigned</span>}
                      </div>
                      {company.company_stage === "closed_lost" && company.closed_lost_reason ? (
                        <p className="mt-1 truncate text-[11px] text-[#B91C1C]">{company.closed_lost_reason}</p>
                      ) : null}
                    </Link>
                  );
                })}
                {stageCompanies.length === 0 ? <p className="text-xs text-muted-foreground">No companies here.</p> : null}
              </div>
              {remaining > 0 ? (
                <button
                  type="button"
                  onClick={() => showMore(stage)}
                  className="mt-2 w-full rounded-lg border border-[#CBD5E1] bg-white py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary"
                >
                  Show {Math.min(BOARD_PAGE_SIZE, remaining)} more ({remaining} left)
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyBoard;
