import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Building2, Info, CheckCircle2, ChevronDown, ChevronRight, Inbox, Linkedin, Mail, Search, Users, X } from "lucide-react";
import type { ProposalSession } from "@/lib/companyStatus";
import { COMPANY_STAGE_LABELS, formatAnnualRevenue, type CompanySignal, type ProjectContact } from "@/lib/projectContacts";
import {
  LEAD_TIER_ORDER,
  LEAD_TIER_SHORT,
  STALLED_EXPLAINER,
  URGENCY_LABEL,
  countByUrgency,
  formatAgo,
  formatDueLabel,
  formatShortDate,
  groupByCompany,
  matchesCompanyFilter,
  matchesCompanySearch,
  matchesFilter,
  matchesSearch,
  sortGroups,
  sortRows,
  type CompanyFilter,
  type CompanyGroup,
  type CompanySort,
  type LeadRow,
  type LeadTier,
  type QueueFilter,
  type QueueSort,
} from "@/lib/outreachQueue";
import CompanyPanel from "./CompanyPanel";
import LeadPanel, { type OutcomeInput, type OutcomeResult } from "./LeadPanel";
import { UrgencyBadge, UrgencyChip } from "./UrgencyChip";
import PageHeader from "./PageHeader";

const LEAD_FILTERS: { key: QueueFilter; label: string }[] = [
  { key: "action", label: "Needs action" },
  { key: "overdue", label: "Overdue" },
  { key: "due_today", label: "Due today" },
  { key: "first_contact", label: "First contact" },
  { key: "stale", label: "No reply yet" },
  { key: "upcoming", label: "Scheduled" },
  { key: "closed", label: "Closed" },
  { key: "needs_research", label: "Verify profiles" },
  { key: "all", label: "All" },
];
const COMPANY_FILTERS: { key: CompanyFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "action", label: "Needs action" },
  { key: "new", label: "New opportunity" },
  { key: "engaged", label: "Engaged" },
  { key: "meeting", label: "Meeting scheduled" },
  { key: "stalled", label: "Stalled" },
  { key: "closed", label: "Closed" },
];
const LEAD_SORTS: { key: QueueSort; label: string }[] = [
  { key: "priority", label: "Most urgent" },
  { key: "last_touch", label: "Longest since contact" },
  { key: "company", label: "Company A–Z" },
  { key: "name", label: "Name A–Z" },
];
const COMPANY_SORTS: { key: CompanySort; label: string }[] = [
  { key: "priority", label: "Most urgent" },
  { key: "last_touch", label: "Longest since contact" },
  { key: "name", label: "Company A–Z" },
  { key: "contacts", label: "Most contacts" },
];

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70 focus-visible:ring-offset-1";
const SELECT = `h-9 min-w-0 rounded-lg border border-rh-line bg-white px-2.5 text-[13px] text-rh-body hover:border-rh-line-strong ${FOCUS_RING}`;
const PAGE_SIZE = 40;
const formatAddedDate = (value?: string | null) => value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not available";

const useIsDesktop = () => {
  const query = "(min-width: 1280px)";
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return matches;
};

const initials = (name?: string | null) => (name ?? "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

type Props = {
  // Today = what needs action now. Companies = every company (grouped, with a
  // flat Contacts toggle) so nobody gets contacted twice by accident.
  mode: "today" | "companies";
  rows: LeadRow[]; // already scoped to the viewer's book
  // companyId -> why it's stalled (empty for companies that aren't).
  stalledReasons: Record<string, string>;
  signalsByCompanyId: Record<string, CompanySignal[]>;
  repNameById: Record<string, string>;
  // Owner-only: companyId -> which of the three plays this is. Absent for members.
  tierByCompanyId?: Record<string, LeadTier>;
  isLoading: boolean;
  session: ProposalSession;
  followUpSupported: boolean;
  scopeToggle?: { value: "mine" | "all"; onChange: (v: "mine" | "all") => void };
  historyVersion: number;
  onOpenMessage: (contact: ProjectContact, field: "linkedin_connect_message" | "intro_message" | "follow_up_message", label: string) => void;
  onOpenEmail: (contact: ProjectContact) => void;
  onCopyLinkedInDraft: (contact: ProjectContact) => Promise<string | null>;
  onSaveOutcome: (contact: ProjectContact, input: OutcomeInput) => Promise<OutcomeResult>;
  canRequestMore: boolean;
  isRequestingBatch: boolean;
  onRequestMore: () => void;
};

const OutreachQueue = ({ mode, rows, stalledReasons, signalsByCompanyId, repNameById, tierByCompanyId, isLoading, session, followUpSupported, scopeToggle, historyVersion, onOpenMessage, onOpenEmail, onCopyLinkedInDraft, onSaveOutcome, canRequestMore, isRequestingBatch, onRequestMore }: Props) => {
  // Everything that defines "where I am" lives in the URL, so a reload, a trip
  // to the company page and Back, or a shared link lands in the same place.
  const [params, setParams] = useSearchParams();
  const grouped = mode === "companies" && params.get("g") !== "0";
  const defaultLeadFilter: QueueFilter = mode === "companies" ? "all" : "action";
  const leadFilter: QueueFilter = LEAD_FILTERS.some((f) => f.key === params.get("f")) ? (params.get("f") as QueueFilter) : defaultLeadFilter;
  const companyFilter: CompanyFilter = COMPANY_FILTERS.some((f) => f.key === params.get("f")) ? (params.get("f") as CompanyFilter) : "all";
  const leadSort: QueueSort = LEAD_SORTS.some((s) => s.key === params.get("sort")) ? (params.get("sort") as QueueSort) : "priority";
  const companySort: CompanySort = COMPANY_SORTS.some((s) => s.key === params.get("sort")) ? (params.get("sort") as CompanySort) : "priority";
  const query = params.get("q") ?? "";
  const project = params.get("project") ?? "";
  const leadId = params.get("lead");
  const companyId = params.get("company");
  const tierParam = params.get("tier");
  const tier: LeadTier | "" = LEAD_TIER_ORDER.includes(tierParam as LeadTier) ? (tierParam as LeadTier) : "";
  const stalledIds = useMemo(() => new Set(Object.keys(stalledReasons)), [stalledReasons]);
  const isDesktop = useIsDesktop();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [opened, setOpened] = useState<Set<string>>(new Set());

  const patchParams = useCallback((patch: Record<string, string | null>) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      return next;
    }, { replace: true });
    setLimit(PAGE_SIZE);
  }, [setParams]);

  const counts = useMemo(() => countByUrgency(rows), [rows]);
  const projects = useMemo(() => [...new Set(rows.map((r) => r.project).filter((p): p is string => Boolean(p)))].sort(), [rows]);
  const scopedRows = useMemo(
    () => rows.filter((r) => (!project || r.project === project) && (!tier || (r.company && tierByCompanyId?.[r.company.id] === tier))),
    [rows, project, tier, tierByCompanyId]
  );
  const tierCounts = useMemo(() => {
    const c: Record<LeadTier, Set<string>> = { flexible: new Set(), fulltime: new Set(), cold: new Set() };
    if (tierByCompanyId) for (const r of rows) { const t = r.company ? tierByCompanyId[r.company.id] : undefined; if (t) c[t].add(r.company!.id); }
    return { flexible: c.flexible.size, fulltime: c.fulltime.size, cold: c.cold.size };
  }, [rows, tierByCompanyId]);

  // ---- lead-level list (Today, or Companies → Contacts) ----
  const visibleLeads = useMemo(
    () => sortRows(scopedRows.filter((r) => matchesFilter(r, leadFilter) && matchesSearch(r, query)), leadSort),
    [scopedRows, leadFilter, query, leadSort]
  );

  // ---- company-level list (Companies → grouped) ----
  const allGroups = useMemo(() => groupByCompany(scopedRows, stalledIds), [scopedRows, stalledIds]);
  const visibleGroups = useMemo(
    () => sortGroups(allGroups.filter((g) => matchesCompanyFilter(g, companyFilter) && matchesCompanySearch(g, query)), companySort),
    [allGroups, companyFilter, query, companySort]
  );
  const stageCounts = useMemo(() => {
    const c = { new: 0, engaged: 0, meeting: 0, stalled: 0 };
    for (const g of allGroups) {
      if (g.company.company_stage === "new_signal") c.new += 1;
      if (g.company.company_stage === "opportunities_engaged") c.engaged += 1;
      if (g.company.company_stage === "meeting_scheduled") c.meeting += 1;
      if (g.stalled) c.stalled += 1;
    }
    return c;
  }, [allGroups]);

  const allById = useMemo(() => new Map(rows.map((r) => [r.contact.id, r])), [rows]);
  const selected = leadId ? allById.get(leadId) ?? null : null;
  const selectedCompanyId = selected?.company?.id ?? null;
  const selectedGroup = companyId ? allGroups.find((g) => g.company.id === companyId) ?? null : null;
  const isOpen = (id: string) => opened.has(id) || id === selectedCompanyId;
  const toggleOpen = (id: string) => setOpened((cur) => { const n = new Set(cur); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  // The ordered list j/k and "Next lead" walk through.
  const navRows = useMemo(
    () => (grouped ? visibleGroups.slice(0, limit).flatMap((g) => (isOpen(g.company.id) ? g.rows : [])) : visibleLeads),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grouped, visibleGroups, visibleLeads, limit, opened, selectedCompanyId]
  );
  const selectedIndex = selected ? navRows.findIndex((r) => r.contact.id === selected.contact.id) : -1;
  const lastIndexRef = useRef(0);
  if (selectedIndex >= 0) lastIndexRef.current = selectedIndex;
  const nextRow = selected ? (selectedIndex >= 0 ? navRows[selectedIndex + 1] : navRows[lastIndexRef.current]) ?? null : null;
  const siblings = useMemo(() => (selected ? rows.filter((r) => r.company?.id === selected.company?.id && r.contact.id !== selected.contact.id) : []), [rows, selected]);

  // Opening/closing a lead must not reset the visible page size, so these
  // touch only the `lead` param.
  const setParam = useCallback((patch: Record<string, string | null>) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      for (const [k, v] of Object.entries(patch)) { if (v) next.set(k, v); else next.delete(k); }
      return next;
    }, { replace: true });
  }, [setParams]);
  // In the grouped view, opening a lead remembers which company panel it came
  // from so the lead panel can offer a way back.
  const openLead = useCallback((id: string) => {
    const r = allById.get(id);
    setParam(grouped && r?.company ? { lead: id, company: r.company.id } : { lead: id });
  }, [allById, grouped, setParam]);
  const setLeadParam = useCallback((id: string | null) => setParam({ lead: id }), [setParam]);
  const closeLead = useCallback(() => {
    const id = leadId;
    setParam({ lead: null, company: null });
    if (id) window.setTimeout(() => document.getElementById(`lead-row-${id}`)?.focus(), 0);
  }, [leadId, setParam]);
  const openCompany = useCallback((id: string) => setParam({ company: id, lead: null }), [setParam]);
  const closeCompany = useCallback(() => setParam({ company: null }), [setParam]);

  const moveSelection = useCallback((delta: number) => {
    if (!navRows.length) return;
    const base = selectedIndex >= 0 ? selectedIndex : delta > 0 ? -1 : navRows.length;
    const next = Math.min(navRows.length - 1, Math.max(0, base + delta));
    const id = navRows[next].contact.id;
    openLead(id);
    document.getElementById(`lead-row-${id}`)?.scrollIntoView({ block: "nearest" });
  }, [navRows, selectedIndex, openLead]);

  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && (leadId || companyId) && !document.querySelector('[role="dialog"][data-state="open"], [data-radix-popper-content-wrapper]')) { e.preventDefault(); if (leadId) closeLead(); else closeCompany(); return; }
      if (typing) return;
      if (e.key === "/") { e.preventDefault(); searchRef.current?.focus(); }
      else if (e.key === "j") { e.preventDefault(); moveSelection(1); }
      else if (e.key === "k") { e.preventDefault(); moveSelection(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leadId, companyId, closeLead, closeCompany, moveSelection]);

  useEffect(() => {
    if (selected || selectedGroup) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [selected, selectedGroup]);

  const defaultFilterKey = grouped ? "all" : defaultLeadFilter;
  const activeFilterKey = grouped ? companyFilter : leadFilter;
  const hasActiveFilters = activeFilterKey !== defaultFilterKey || Boolean(query) || Boolean(project) || Boolean(tier);
  const resetAll = () => patchParams({ f: null, q: null, project: null, tier: null });
  const firstAction = useMemo(() => sortRows(rows.filter((r) => matchesFilter(r, "action")), "priority")[0] ?? null, [rows]);
  const nextScheduled = useMemo(() => sortRows(rows.filter((r) => r.urgency === "upcoming"), "priority")[0] ?? null, [rows]);
  const resultCount = grouped ? visibleGroups.length : visibleLeads.length;

  type Tile = { key: string; label: string; value: number; dot: string; title?: string };
  const tiles: Tile[] = grouped
    ? [
        { key: "new", label: COMPANY_STAGE_LABELS.new_signal, value: stageCounts.new, dot: "bg-rh-faint" },
        { key: "engaged", label: COMPANY_STAGE_LABELS.opportunities_engaged, value: stageCounts.engaged, dot: "bg-rh-teal-bright" },
        { key: "meeting", label: COMPANY_STAGE_LABELS.meeting_scheduled, value: stageCounts.meeting, dot: "bg-[#5B8DEF]" },
        { key: "stalled", label: "Stalled", value: stageCounts.stalled, dot: "bg-[#C99A2E]", title: STALLED_EXPLAINER },
      ]
    : [
        { key: "overdue", label: "Overdue", value: counts.overdue, dot: "bg-rh-red" },
        { key: "due_today", label: "Due today", value: counts.due_today, dot: "bg-[#C99A2E]" },
        { key: "first_contact", label: "First contact", value: counts.first_contact, dot: "bg-rh-teal-bright" },
        { key: "stale", label: "No reply yet", value: counts.stale, dot: "bg-rh-faint" },
      ];

  const leadFilterCount = (key: QueueFilter): number =>
    key === "all" ? scopedRows.length : key === "action" ? counts.overdue + counts.due_today + counts.first_contact + counts.stale : counts[key as keyof typeof counts] ?? 0;
  const companyFilterCount = (key: CompanyFilter): number => allGroups.filter((g) => matchesCompanyFilter(g, key)).length;
  const tabs = grouped ? COMPANY_FILTERS : LEAD_FILTERS;
  const tabCount = (key: string) => (grouped ? companyFilterCount(key as CompanyFilter) : leadFilterCount(key as QueueFilter));
  const sorts = grouped ? COMPANY_SORTS : LEAD_SORTS;
  const sortValue = grouped ? companySort : leadSort;

  const title = mode === "today" ? "Today" : "Companies";
  const subtitle = mode === "today"
    ? new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
    : `${allGroups.length} compan${allGroups.length === 1 ? "y" : "ies"} · ${scopedRows.length} contact${scopedRows.length === 1 ? "" : "s"}`;

  return (
    <div className="w-full min-w-0">
      <div className="min-w-0">
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={
            <>
              {scopeToggle ? (
                <div role="group" aria-label="Whose leads" className="inline-flex rounded-lg bg-[#EEEDE8] p-0.5">
                  {(["mine", "all"] as const).map((v) => (
                    <button key={v} type="button" aria-pressed={scopeToggle.value === v} onClick={() => scopeToggle.onChange(v)} className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${FOCUS_RING} ${scopeToggle.value === v ? "bg-white text-rh-ink shadow-sm" : "text-rh-muted hover:text-rh-ink"}`}>{v === "mine" ? "My companies" : "Everyone"}</button>
                  ))}
                </div>
              ) : null}
              {mode === "companies" && canRequestMore ? (
                <button type="button" onClick={onRequestMore} disabled={isRequestingBatch} className={`inline-flex h-10 items-center rounded-lg border border-rh-line bg-white px-4 text-[13px] font-medium text-rh-ink hover:border-rh-line-strong disabled:opacity-60 ${FOCUS_RING}`}>{isRequestingBatch ? "Requesting…" : "Request more companies"}</button>
              ) : null}
              {mode === "today" && firstAction ? (
                <button type="button" onClick={() => { patchParams({ f: "action" }); setLeadParam(firstAction.contact.id); }} className={`group inline-flex h-10 items-center gap-2 rounded-lg bg-rh-teal px-4 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(20,99,77,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors hover:bg-rh-teal-ink ${FOCUS_RING}`}>
                  Start with {firstAction.contact.contact_name}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              ) : null}
            </>
          }
        />

        {rows.some((r) => r.urgency === "needs_research") ? (
          <p role="note" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
            {rows.filter((r) => r.urgency === "needs_research").length} contacts need a current employer and role check before outreach. Company research may already be saved. These remain outside Needs action until verified.
          </p>
        ) : null}

        {/* Pulse: four numbers, one quiet card. They filter the list below. */}
        <div className="mb-6 hidden grid-cols-4 divide-x divide-rh-line overflow-hidden rounded-2xl border border-rh-line bg-white sm:grid">
          {tiles.map((t) => (
            <button key={t.key} type="button" title={t.title} aria-pressed={activeFilterKey === t.key} onClick={() => patchParams({ f: activeFilterKey === t.key ? null : t.key })} className={`px-5 py-4 text-left transition-colors hover:bg-rh-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rh-teal-bright/70 ${activeFilterKey === t.key ? "bg-rh-teal-soft/60" : ""}`}>
              <span className="flex items-center gap-1.5 text-[13px] text-rh-muted"><span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} aria-hidden="true" />{t.label}</span>
              <span className={`mt-1.5 block text-[26px] font-semibold leading-none tracking-tight tabular-nums ${t.value ? "text-rh-ink" : "text-rh-faint"}`}>{t.value}</span>
            </button>
          ))}
        </div>

        {/* One card: tabs, tools, rows */}
        <div className="overflow-hidden rounded-2xl border border-rh-line bg-white shadow-[0_1px_2px_rgba(21,23,28,0.03)]">
          <div role="group" aria-label="Filter" className="flex flex-nowrap items-center gap-4 overflow-x-auto border-b border-rh-line px-5">
            {tabs.map((f) => (
              <button key={f.key} type="button" aria-pressed={activeFilterKey === f.key} onClick={() => patchParams({ f: f.key === defaultFilterKey ? null : f.key })} className={`relative shrink-0 rounded-sm py-3.5 text-[13px] font-medium transition-colors ${FOCUS_RING} ${activeFilterKey === f.key ? "text-rh-ink" : "text-rh-muted hover:text-rh-ink"}`}>
                {f.label}<span className={`ml-1.5 tabular-nums ${activeFilterKey === f.key ? "text-rh-teal" : "text-rh-faint"}`}>{tabCount(f.key)}</span>
                {activeFilterKey === f.key ? <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-rh-ink" aria-hidden="true" /> : null}
              </button>
            ))}
            {hasActiveFilters ? (
              <button type="button" onClick={resetAll} className={`ml-auto inline-flex shrink-0 items-center gap-1 rounded-sm py-3.5 text-[13px] font-medium text-rh-teal hover:underline ${FOCUS_RING}`}><X size={13} aria-hidden="true" />Reset</button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-rh-line bg-rh-canvas/50 px-5 py-3">
            <div className="relative basis-full sm:min-w-[10rem] sm:flex-1 sm:basis-0">
              <label htmlFor="lead-search" className="sr-only">Search</label>
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rh-muted" aria-hidden="true" />
              <input ref={searchRef} id="lead-search" type="search" value={query} onChange={(e) => patchParams({ q: e.target.value })} placeholder="Search company, name or role" className={`h-9 w-full rounded-lg border border-rh-line bg-white pl-9 pr-8 text-[13px] text-rh-ink placeholder:text-rh-muted hover:border-rh-line-strong ${FOCUS_RING}`} />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-rh-line px-1 text-[10px] text-rh-muted sm:block">/</kbd>
            </div>
            {mode === "companies" ? (
              <div role="group" aria-label="Group by" className="inline-flex rounded-lg bg-[#EEEDE8] p-0.5">
                {([["company", "Companies", Building2], ["contacts", "Contacts", Users]] as const).map(([k, label, Icon]) => {
                  const on = (k === "company") === grouped;
                  return (
                    <button key={k} type="button" aria-pressed={on} onClick={() => patchParams({ g: k === "company" ? null : "0", f: null, sort: null })} className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium ${FOCUS_RING} ${on ? "bg-white text-rh-ink shadow-sm" : "text-rh-muted hover:text-rh-ink"}`}>
                      <Icon size={13} aria-hidden="true" />{label}
                    </button>
                  );
                })}
              </div>
            ) : null}
            {tierByCompanyId ? (
              <>
                <label htmlFor="lead-tier" className="sr-only">Project type</label>
                <select id="lead-tier" value={tier} onChange={(e) => patchParams({ tier: e.target.value })} className={`${SELECT} flex-1 sm:max-w-[13rem] sm:flex-none`}>
                  <option value="">All project types</option>
                  {LEAD_TIER_ORDER.map((t) => <option key={t} value={t}>{LEAD_TIER_SHORT[t]} ({tierCounts[t]})</option>)}
                </select>
              </>
            ) : projects.length > 0 ? (
              <>
                <label htmlFor="lead-project" className="sr-only">Filter by open role</label>
                <select id="lead-project" value={project} onChange={(e) => patchParams({ project: e.target.value })} className={`${SELECT} flex-1 sm:max-w-[11rem] sm:flex-none`}>
                  <option value="">All roles</option>
                  {projects.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </>
            ) : null}
            <label htmlFor="lead-sort" className="sr-only">Sort</label>
            <select id="lead-sort" value={sortValue} onChange={(e) => patchParams({ sort: e.target.value === "priority" ? null : e.target.value })} className={`${SELECT} flex-1 sm:flex-none`}>
              {sorts.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>

          {grouped && companyFilter === "stalled" ? (
            <p className="flex items-start gap-2 border-b border-rh-line bg-rh-amber-soft/60 px-5 py-2.5 text-xs text-rh-amber"><Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />{STALLED_EXPLAINER}</p>
          ) : null}

          {isLoading ? (
            <ul aria-busy="true" aria-label="Loading">
              {[0, 1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-center gap-4 border-b border-rh-line px-5 py-4 last:border-0">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-rh-line" />
                  <div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 animate-pulse rounded bg-rh-line" /><div className="h-3 w-1/2 animate-pulse rounded bg-rh-line" /></div>
                </li>
              ))}
            </ul>
          ) : resultCount === 0 ? (
            <EmptyState
              mode={mode}
              rowsTotal={rows.length}
              isDefaultAction={!grouped && leadFilter === "action" && !hasActiveFilters && mode === "today"}
              hasActiveFilters={hasActiveFilters}
              nextScheduled={nextScheduled}
              canRequestMore={canRequestMore}
              isRequestingBatch={isRequestingBatch}
              onRequestMore={onRequestMore}
              onReset={resetAll}
              onShowAll={() => patchParams({ f: "all" })}
              scopeHint={Boolean(scopeToggle) && scopeToggle?.value === "mine"}
              onShowEveryone={() => scopeToggle?.onChange("all")}
            />
          ) : grouped ? (
            <>
              <ul>
                {visibleGroups.slice(0, limit).map((g) => (
                  <CompanyGroupItem key={g.company.id} g={g} open={isOpen(g.company.id)} selected={companyId === g.company.id && !selected} stalledReason={stalledReasons[g.company.id] ?? null} onToggle={() => toggleOpen(g.company.id)} onSelect={() => openCompany(g.company.id)} selectedId={selected?.contact.id ?? null} onOpenLead={openLead} />
                ))}
              </ul>
              {visibleGroups.length > limit ? (
                <div className="border-t border-rh-line px-5 py-3 text-center">
                  <button type="button" onClick={() => setLimit((l) => l + PAGE_SIZE)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium text-rh-teal hover:underline ${FOCUS_RING}`}>Show {Math.min(PAGE_SIZE, visibleGroups.length - limit)} more · {visibleGroups.length - limit} remaining</button>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <ul>
                {visibleLeads.slice(0, limit).map((r) => (
                  <li key={r.contact.id} className="border-b border-rh-line last:border-0">
                    <LeadItem r={r} isSel={selected?.contact.id === r.contact.id} onOpen={openLead} />
                  </li>
                ))}
              </ul>
              {visibleLeads.length > limit ? (
                <div className="border-t border-rh-line px-5 py-3 text-center">
                  <button type="button" onClick={() => setLimit((l) => l + PAGE_SIZE)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium text-rh-teal hover:underline ${FOCUS_RING}`}>Show {Math.min(PAGE_SIZE, visibleLeads.length - limit)} more · {visibleLeads.length - limit} remaining</button>
                </div>
              ) : null}
            </>
          )}
        </div>
        <p className="mt-3 hidden text-xs text-rh-muted md:block">
          <kbd className="rounded border border-rh-line bg-white px-1">j</kbd> <kbd className="rounded border border-rh-line bg-white px-1">k</kbd> move · <kbd className="rounded border border-rh-line bg-white px-1">/</kbd> search · <kbd className="rounded border border-rh-line bg-white px-1">Esc</kbd> close
        </p>
        <p className="sr-only" aria-live="polite">{resultCount} {grouped ? "companies" : "leads"} shown</p>
      </div>

      {/* The list always owns the full width. The selected detail opens above it
          without resizing or shifting table columns. */}
      {(selected || selectedGroup) ? (
        <button type="button" aria-label="Close details" onClick={selected ? closeLead : closeCompany} className="fixed inset-0 z-[60] cursor-default bg-rh-ink/25" />
      ) : null}
      {selected ? (
        <div className={isDesktop ? "fixed inset-y-4 right-4 z-[61] w-[min(34rem,calc(100vw-2rem))]" : "fixed inset-0 z-[61]"}>
          <LeadPanel
            row={selected}
            siblings={siblings}
            tier={selected.company && tierByCompanyId ? tierByCompanyId[selected.company.id] ?? null : null}
            index={selectedIndex >= 0 ? selectedIndex : lastIndexRef.current}
            total={Math.max(navRows.length, 1)}
            nextRow={nextRow}
            isDesktop={isDesktop}
            session={session}
            followUpSupported={followUpSupported}
            backToCompany={selectedGroup && selected.company?.id === selectedGroup.company.id ? { name: selectedGroup.company.name, onBack: () => setLeadParam(null) } : null}
            onClose={closeLead}
            onPrev={selectedIndex > 0 ? () => moveSelection(-1) : null}
            onNext={selectedIndex >= 0 && selectedIndex < navRows.length - 1 ? () => moveSelection(1) : null}
            onGoToLead={(id) => { openLead(id); document.getElementById(`lead-row-${id}`)?.scrollIntoView({ block: "nearest" }); }}
            onOpenMessage={onOpenMessage}
            onOpenEmail={onOpenEmail}
            onCopyLinkedInDraft={onCopyLinkedInDraft}
            onSaveOutcome={onSaveOutcome}
            historyVersion={historyVersion}
          />
        </div>
      ) : selectedGroup ? (
        <div className={isDesktop ? "fixed inset-y-4 right-4 z-[61] w-[min(34rem,calc(100vw-2rem))]" : "fixed inset-0 z-[61]"}>
          <CompanyPanel
            group={selectedGroup}
            signals={signalsByCompanyId[selectedGroup.company.id] ?? []}
            tier={tierByCompanyId?.[selectedGroup.company.id] ?? null}
            repName={selectedGroup.company.assigned_rep ? repNameById[selectedGroup.company.assigned_rep] ?? null : null}
            stalledReason={stalledReasons[selectedGroup.company.id] ?? null}
            isDesktop={isDesktop}
            onClose={closeCompany}
            onOpenLead={openLead}
          />
        </div>
      ) : null}
    </div>
  );
};

// One contact row. Shared by Today, Companies → Contacts, and the nested rows
// under a company.
const LeadItem = ({ r, isSel, onOpen, nested = false }: { r: LeadRow; isSel: boolean; onOpen: (id: string) => void; nested?: boolean }) => {
  const c = r.contact;
  const hasLinkedIn = Boolean(c.linkedin_url && c.linkedin_url.includes("/in/"));
  // Only worth warning about when this person hasn't been contacted yet.
  const warn = !r.contacted && r.sibling && r.urgency !== "closed" ? r.sibling : null;
  return (
    <button
      id={`lead-row-${c.id}`}
      type="button"
      onClick={() => onOpen(c.id)}
      aria-current={isSel ? "true" : undefined}
      aria-label={`${c.contact_name}, ${c.company}. ${URGENCY_LABEL[r.urgency]}. ${r.stageLabel}.${warn ? ` ${warn.name} at this company was already contacted.` : ""}`}
      className={`group relative grid w-full gap-x-4 gap-y-2 py-3.5 pr-5 text-left transition-colors md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)_8.5rem_1rem] md:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rh-teal-bright/70 ${nested ? "pl-12" : "pl-5"} ${isSel ? "bg-rh-teal-soft/50" : "hover:bg-rh-canvas/70"}`}
    >
      {isSel ? <span className="absolute inset-y-0 left-0 w-0.5 bg-rh-teal" aria-hidden="true" /> : null}
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rh-canvas text-xs font-semibold text-rh-body ring-1 ring-inset ring-rh-line" aria-hidden="true">{initials(c.contact_name)}</span>
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-rh-ink">{c.contact_name}</span>
            <span className="flex shrink-0 items-center gap-1 text-rh-faint" aria-hidden="true">
              {hasLinkedIn ? <Linkedin size={12} /> : null}
              {c.email ? <Mail size={12} /> : null}
            </span>
          </span>
          <span className="block truncate text-[13px] text-rh-muted">{nested ? c.title : [c.title, c.company].filter(Boolean).join(" · ")}</span>
          {c.research_checked_on && c.research_business_model && c.research_personalization_angle ? <span className="block text-[11px] text-rh-teal">Company research on file</span> : null}
          {!nested && r.project ? <span className="block truncate text-xs text-rh-faint">{r.project}</span> : null}
          {warn ? (
            <span className="mt-0.5 flex items-center gap-1 truncate text-xs font-medium text-rh-amber"><Users size={11} aria-hidden="true" />{warn.name} already contacted{warn.lastTouchAt ? ` · ${formatAgo(warn.lastTouchAt).toLowerCase()}` : ""}</span>
          ) : null}
        </span>
      </span>
      <span className="min-w-0 pl-12 md:pl-0">
        <span className="line-clamp-2 text-[13px] text-rh-body">{r.stageLabel}</span>
        <span className="block truncate text-xs text-rh-muted">{r.lastTouchAt ? `${formatAgo(r.lastTouchAt)}${r.lastTouchIsLogged ? "" : " · stage change"}` : "No contact yet"}</span>
      </span>
      <span className="flex min-w-0 flex-col items-start gap-0.5 pl-12 md:pl-0">
        <UrgencyChip row={r} showDetail />
        {r.urgency === "overdue" || r.urgency === "upcoming" || r.urgency === "stale" ? (
          <span className="max-w-full truncate pl-0.5 text-xs text-rh-muted">{r.urgency === "upcoming" ? formatShortDate(r.followUpAt) : r.urgency === "stale" ? formatDueLabel(r) : r.nextAction ?? ""}</span>
        ) : null}
      </span>
      <ChevronRight size={16} className={`hidden text-rh-faint transition-opacity md:block ${isSel ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`} aria-hidden="true" />
    </button>
  );
};

const STAGE_DOT: Record<string, string> = {
  new_signal: "bg-rh-faint", opportunities_engaged: "bg-rh-teal-bright", meeting_scheduled: "bg-[#5B8DEF]", closed_won: "bg-rh-teal", closed_lost: "bg-rh-red",
};

// A company: one summary row. Clicking it opens the company panel; the chevron
// expands its contacts in place.
const CompanyGroupItem = ({ g, open, selected, stalledReason, onToggle, onSelect, selectedId, onOpenLead }: { g: CompanyGroup; open: boolean; selected: boolean; stalledReason: string | null; onToggle: () => void; onSelect: () => void; selectedId: string | null; onOpenLead: (id: string) => void }) => {
  const stage = g.company.company_stage;
  return (
    <li className="border-b border-rh-line last:border-0">
      <div className={`relative flex items-stretch transition-colors ${selected ? "bg-rh-teal-soft/50" : open ? "bg-rh-canvas/50 hover:bg-rh-canvas/70" : "hover:bg-rh-canvas/70"}`}>
        {selected ? <span className="absolute inset-y-0 left-0 w-0.5 bg-rh-teal" aria-hidden="true" /> : null}
        <button
          type="button"
          id={`company-row-${g.company.id}`}
          onClick={onSelect}
          aria-current={selected ? "true" : undefined}
          className="grid min-w-0 flex-1 gap-x-4 gap-y-2 py-3.5 pl-5 pr-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rh-teal-bright/70 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)_8.5rem]"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-rh-body ring-1 ring-inset ring-rh-line-strong" aria-hidden="true">{initials(g.company.name)}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-rh-ink">{g.company.name}</span>
              <span className="block truncate text-[13px] text-rh-muted">{g.rows.length} contact{g.rows.length === 1 ? "" : "s"}{g.project ? ` · ${g.project}` : ""}</span>
            </span>
          </span>
          <span className="min-w-0 pl-12 md:pl-0">
            <span className="flex items-center gap-1.5 text-[13px] text-rh-body"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STAGE_DOT[stage] ?? "bg-rh-faint"}`} aria-hidden="true" />{COMPANY_STAGE_LABELS[stage]}{g.stalled ? <span className="text-rh-amber" title={stalledReason ?? STALLED_EXPLAINER}> · stalled</span> : null}</span>
            <span className="block truncate text-xs text-rh-muted">{g.contacted} of {g.rows.length} contacted{g.lastTouchAt ? ` · last ${formatAgo(g.lastTouchAt).toLowerCase()}` : ""}</span>
          </span>
          <span className="flex min-w-0 flex-col items-start gap-0.5 pl-12 md:pl-0">
            <UrgencyBadge urgency={g.topUrgency} text={g.topUrgency === "overdue" ? `${g.topDays} day${g.topDays === 1 ? "" : "s"} overdue` : undefined} />
            {g.nextDue && g.topUrgency !== "overdue" ? <span className="pl-0.5 text-xs text-rh-muted">Next {formatShortDate(g.nextDue)}</span> : null}
          </span>
        </button>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-label={`${open ? "Hide" : "Show"} ${g.rows.length} contact${g.rows.length === 1 ? "" : "s"} at ${g.company.name}`} className="flex w-12 shrink-0 items-center justify-center text-rh-faint hover:text-rh-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rh-teal-bright/70">
          <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
      {open ? (
        <ul className="border-t border-rh-line bg-rh-canvas/40">
          {g.rows.map((r) => (
            <li key={r.contact.id} className="border-b border-rh-line/70 last:border-0">
              <LeadItem r={r} isSel={selectedId === r.contact.id} onOpen={onOpenLead} nested />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
};

type EmptyProps = {
  mode: "today" | "companies"; rowsTotal: number; isDefaultAction: boolean; hasActiveFilters: boolean; nextScheduled: LeadRow | null;
  canRequestMore: boolean; isRequestingBatch: boolean; onRequestMore: () => void; onReset: () => void; onShowAll: () => void;
  scopeHint: boolean; onShowEveryone: () => void;
};

const PRIMARY_SM = `inline-flex h-9 items-center rounded-lg bg-rh-teal px-4 text-[13px] font-semibold text-white hover:bg-rh-teal-ink disabled:opacity-60 ${FOCUS_RING}`;
const GHOST_SM = `inline-flex h-9 items-center rounded-lg border border-rh-line bg-white px-4 text-[13px] font-medium text-rh-ink hover:border-rh-line-strong ${FOCUS_RING}`;

const EmptyState = ({ mode, rowsTotal, isDefaultAction, hasActiveFilters, nextScheduled, canRequestMore, isRequestingBatch, onRequestMore, onReset, onShowAll, scopeHint, onShowEveryone }: EmptyProps) => {
  if (rowsTotal === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <Inbox size={24} className="mx-auto text-rh-faint" aria-hidden="true" />
        <p className="mt-3 text-[15px] font-semibold text-rh-ink">{scopeHint ? "No companies assigned to you" : "No leads yet"}</p>
        <p className="mx-auto mt-1 max-w-sm text-[13px] text-rh-muted">{scopeHint ? "You’re viewing only companies assigned to you. Switch to Everyone to see all of them." : "Companies assigned to you will show up here with their contacts."}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {scopeHint ? <button type="button" onClick={onShowEveryone} className={PRIMARY_SM}>Show everyone</button> : null}
          {canRequestMore ? <button type="button" onClick={onRequestMore} disabled={isRequestingBatch} className={PRIMARY_SM}>{isRequestingBatch ? "Requesting…" : "Request companies"}</button> : null}
        </div>
      </div>
    );
  }
  if (isDefaultAction) {
    return (
      <div className="px-6 py-16 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rh-teal-soft"><CheckCircle2 size={22} className="text-rh-teal" aria-hidden="true" /></span>
        <p className="mt-3 text-[15px] font-semibold text-rh-ink">You’re caught up</p>
        <p className="mx-auto mt-1 max-w-sm text-[13px] text-rh-muted">
          {nextScheduled ? `Next follow-up: ${nextScheduled.contact.contact_name}, ${formatShortDate(nextScheduled.followUpAt)}.` : "Nothing needs action right now."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {canRequestMore ? <button type="button" onClick={onRequestMore} disabled={isRequestingBatch} className={PRIMARY_SM}>{isRequestingBatch ? "Requesting…" : "Request more companies"}</button> : null}
          <button type="button" onClick={onShowAll} className={GHOST_SM}>View all leads</button>
        </div>
      </div>
    );
  }
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-[15px] font-semibold text-rh-ink">Nothing matches</p>
      <p className="mt-1 text-[13px] text-rh-muted">Try a different filter or search term.</p>
      {hasActiveFilters ? <button type="button" onClick={onReset} className={`${GHOST_SM} mt-4`}>Reset filters</button> : null}
    </div>
  );
};

export default OutreachQueue;
