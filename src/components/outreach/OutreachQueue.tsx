import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronRight, Search, X } from "lucide-react";
import type { ProposalSession } from "@/lib/companyStatus";
import type { ProjectContact } from "@/lib/projectContacts";
import {
  URGENCY_LABEL,
  countByUrgency,
  formatAgo,
  formatDueLabel,
  formatShortDate,
  matchesFilter,
  matchesSearch,
  sortRows,
  type LeadRow,
  type QueueFilter,
  type QueueSort,
} from "@/lib/outreachQueue";
import LeadPanel, { type OutcomeInput, type OutcomeResult } from "./LeadPanel";
import { UrgencyChip } from "./UrgencyChip";

const FILTERS: { key: QueueFilter; label: string }[] = [
  { key: "action", label: "Needs action" },
  { key: "overdue", label: "Overdue" },
  { key: "due_today", label: "Due today" },
  { key: "first_contact", label: "First contact" },
  { key: "stale", label: "No reply yet" },
  { key: "upcoming", label: "Scheduled" },
  { key: "closed", label: "Closed" },
  { key: "all", label: "All" },
];
const SORTS: { key: QueueSort; label: string }[] = [
  { key: "priority", label: "Most urgent" },
  { key: "last_touch", label: "Longest since contact" },
  { key: "company", label: "Company A–Z" },
  { key: "name", label: "Name A–Z" },
];
const isFilter = (v: string | null): v is QueueFilter => FILTERS.some((f) => f.key === v);
const isSort = (v: string | null): v is QueueSort => SORTS.some((s) => s.key === v);

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1";

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

type Props = {
  rows: LeadRow[]; // already scoped to the viewer's book
  isLoading: boolean;
  session: ProposalSession;
  followUpSupported: boolean;
  scopeToggle?: { value: "mine" | "all"; onChange: (v: "mine" | "all") => void };
  historyVersion: number;
  onOpenMessage: (contact: ProjectContact, field: "linkedin_connect_message" | "intro_message" | "follow_up_message", label: string) => void;
  onOpenEmail: (contact: ProjectContact) => void;
  onSaveOutcome: (contact: ProjectContact, input: OutcomeInput) => Promise<OutcomeResult>;
  canRequestMore: boolean;
  isRequestingBatch: boolean;
  onRequestMore: () => void;
};

const OutreachQueue = ({ rows, isLoading, session, followUpSupported, scopeToggle, historyVersion, onOpenMessage, onOpenEmail, onSaveOutcome, canRequestMore, isRequestingBatch, onRequestMore }: Props) => {
  // Filters, sort, search and the open lead all live in the URL, so a
  // reload, a trip to the company page and Back, or a shared link lands on
  // the same list, in the same place.
  const [params, setParams] = useSearchParams();
  const filter: QueueFilter = isFilter(params.get("f")) ? (params.get("f") as QueueFilter) : "action";
  const sort: QueueSort = isSort(params.get("sort")) ? (params.get("sort") as QueueSort) : "priority";
  const query = params.get("q") ?? "";
  const project = params.get("project") ?? "";
  const leadId = params.get("lead");
  const isDesktop = useIsDesktop();

  const patchParams = useCallback((patch: Record<string, string | null>) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      return next;
    }, { replace: true });
  }, [setParams]);

  const counts = useMemo(() => countByUrgency(rows), [rows]);
  const projects = useMemo(() => [...new Set(rows.map((r) => r.project).filter((p): p is string => Boolean(p)))].sort(), [rows]);

  const visible = useMemo(
    () => sortRows(rows.filter((r) => matchesFilter(r, filter) && matchesSearch(r, query) && (!project || r.project === project)), sort),
    [rows, filter, query, project, sort]
  );

  // Row order is frozen while the panel is open on a lead whose own save
  // would move it out of the filter; the panel keeps pointing at the lead
  // via `allById`, and "Next lead" uses the order from before the save.
  const allById = useMemo(() => new Map(rows.map((r) => [r.contact.id, r])), [rows]);
  const selected = leadId ? allById.get(leadId) ?? null : null;
  const selectedIndex = selected ? visible.findIndex((r) => r.contact.id === selected.contact.id) : -1;
  const lastIndexRef = useRef(0);
  if (selectedIndex >= 0) lastIndexRef.current = selectedIndex;
  const nextRow = selected ? (selectedIndex >= 0 ? visible[selectedIndex + 1] : visible[lastIndexRef.current]) ?? null : null;

  const openLead = useCallback((id: string) => patchParams({ lead: id }), [patchParams]);
  const closeLead = useCallback(() => {
    const id = leadId;
    patchParams({ lead: null });
    if (id) window.setTimeout(() => document.getElementById(`lead-row-${id}`)?.focus(), 0);
  }, [leadId, patchParams]);

  const moveSelection = useCallback((delta: number) => {
    if (!visible.length) return;
    const base = selectedIndex >= 0 ? selectedIndex : delta > 0 ? -1 : visible.length;
    const next = Math.min(visible.length - 1, Math.max(0, base + delta));
    const id = visible[next].contact.id;
    openLead(id);
    document.getElementById(`lead-row-${id}`)?.scrollIntoView({ block: "nearest" });
  }, [visible, selectedIndex, openLead]);

  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && leadId && !document.querySelector(".fixed.inset-0.z-50, [role=dialog][data-state=open]")) { closeLead(); return; }
      if (typing) return;
      if (e.key === "/") { e.preventDefault(); searchRef.current?.focus(); }
      else if (e.key === "j") { e.preventDefault(); moveSelection(1); }
      else if (e.key === "k") { e.preventDefault(); moveSelection(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leadId, closeLead, moveSelection]);

  // Lock page scroll behind the full-screen panel on small screens.
  useEffect(() => {
    if (selected && !isDesktop) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [selected, isDesktop]);

  const hasActiveFilters = filter !== "action" || Boolean(query) || Boolean(project);
  const firstAction = useMemo(() => sortRows(rows.filter((r) => matchesFilter(r, "action")), "priority")[0] ?? null, [rows]);
  const nextScheduled = useMemo(() => sortRows(rows.filter((r) => r.urgency === "upcoming"), "priority")[0] ?? null, [rows]);

  const tiles: { key: QueueFilter; label: string; value: number; tone: string }[] = [
    { key: "overdue", label: "Overdue", value: counts.overdue, tone: "text-[#991B1B]" },
    { key: "due_today", label: "Due today", value: counts.due_today, tone: "text-[#92400E]" },
    { key: "first_contact", label: "First contact", value: counts.first_contact, tone: "text-[#0F6E56]" },
    { key: "stale", label: "No reply yet", value: counts.stale, tone: "text-[#7A5A12]" },
  ];

  const filterCount = (key: QueueFilter): number =>
    key === "all" ? rows.length : key === "action" ? counts.overdue + counts.due_today + counts.first_contact + counts.stale : counts[key as keyof typeof counts] ?? 0;

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start xl:gap-5">
      <div className="min-w-0">
        {/* Header + next action */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Today</h1>
            <p className="mt-0.5 text-sm text-[#52606D]">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {scopeToggle ? (
              <div role="group" aria-label="Whose leads" className="inline-flex rounded-md border border-[#D8D6CE] bg-white p-0.5">
                {(["mine", "all"] as const).map((v) => (
                  <button key={v} type="button" aria-pressed={scopeToggle.value === v} onClick={() => scopeToggle.onChange(v)} className={`rounded px-3 py-1.5 text-[13px] font-medium ${FOCUS_RING} ${scopeToggle.value === v ? "bg-primary text-primary-foreground" : "text-[#3E4C59] hover:bg-[#F5F4F0]"}`}>{v === "mine" ? "My leads" : "Everyone"}</button>
                ))}
              </div>
            ) : null}
            {firstAction ? (
              <button type="button" onClick={() => { patchParams({ f: "action", lead: firstAction.contact.id }); }} className={`inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 ${FOCUS_RING}`}>
                Start with {firstAction.contact.contact_name}<ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Summary tiles double as filters. Secondary to the list below. */}
        <div className="mb-5 hidden grid-cols-4 gap-2.5 sm:grid">
          {tiles.map((t) => (
            <button key={t.key} type="button" aria-pressed={filter === t.key} onClick={() => patchParams({ f: filter === t.key ? null : t.key })} className={`rounded-lg border bg-white px-4 py-3 text-left transition-colors hover:border-primary/50 ${FOCUS_RING} ${filter === t.key ? "border-primary ring-1 ring-primary" : "border-[#E4E2DA]"}`}>
              <span className={`block text-2xl font-semibold tabular-nums ${t.value ? t.tone : "text-[#66727F]"}`}>{t.value}</span>
              <span className="text-[13px] text-[#52606D]">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative basis-full sm:min-w-[10rem] sm:flex-1 sm:basis-0">
              <label htmlFor="lead-search" className="sr-only">Search leads</label>
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A]" aria-hidden="true" />
              <input ref={searchRef} id="lead-search" type="search" value={query} onChange={(e) => patchParams({ q: e.target.value })} placeholder="Search name, company, role…  ( / )" className={`h-10 w-full rounded-md border border-[#D8D6CE] bg-white pl-9 pr-3 text-sm ${FOCUS_RING}`} />
            </div>
            {projects.length > 0 ? (
              <>
                <label htmlFor="lead-project" className="sr-only">Filter by open role</label>
                <select id="lead-project" value={project} onChange={(e) => patchParams({ project: e.target.value })} className={`h-10 min-w-0 flex-1 rounded-md sm:max-w-[11rem] sm:flex-none border border-[#D8D6CE] bg-white px-2.5 text-sm ${FOCUS_RING}`}>
                  <option value="">All projects</option>
                  {projects.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </>
            ) : null}
            <label htmlFor="lead-sort" className="sr-only">Sort</label>
            <select id="lead-sort" value={sort} onChange={(e) => patchParams({ sort: e.target.value === "priority" ? null : e.target.value })} className={`h-10 min-w-0 flex-1 rounded-md border border-[#D8D6CE] bg-white px-2.5 text-sm sm:flex-none ${FOCUS_RING}`}>
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div role="group" aria-label="Filter leads" className="-mx-4 flex flex-nowrap gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {FILTERS.map((f) => (
              <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => patchParams({ f: f.key === "action" ? null : f.key })} className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium ${FOCUS_RING} ${filter === f.key ? "border-primary bg-primary text-primary-foreground" : "border-[#D8D6CE] bg-white text-[#3E4C59] hover:border-primary/60"}`}>
                {f.label}<span className={`tabular-nums ${filter === f.key ? "text-primary-foreground/80" : "text-[#5F6B7A]"}`}>{filterCount(f.key)}</span>
              </button>
            ))}
            {hasActiveFilters ? (
              <button type="button" onClick={() => patchParams({ f: null, q: null, project: null })} className={`inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-[13px] font-medium text-primary hover:underline ${FOCUS_RING}`}><X size={13} aria-hidden="true" />Reset</button>
            ) : null}
          </div>
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-xl border border-[#E4E2DA] bg-white shadow-[0_1px_2px_rgba(20,21,26,0.04)]">
          <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_8.5rem_1.5rem] gap-4 border-b border-[#EEEDE7] bg-[#FAFAF8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52606D] md:grid" aria-hidden="true">
            <span>Lead · project</span><span>Stage · last contact</span><span>Next</span><span />
          </div>

          {isLoading ? (
            <ul aria-busy="true" aria-label="Loading leads">
              {[0, 1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-center gap-4 border-b border-[#F1F0EC] px-4 py-4 last:border-0">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-[#F1F0EC]" />
                  <div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 animate-pulse rounded bg-[#F1F0EC]" /><div className="h-3 w-1/2 animate-pulse rounded bg-[#F1F0EC]" /></div>
                </li>
              ))}
            </ul>
          ) : visible.length === 0 ? (
            <EmptyState
              rowsTotal={rows.length}
              filter={filter}
              hasActiveFilters={hasActiveFilters}
              nextScheduled={nextScheduled}
              canRequestMore={canRequestMore}
              isRequestingBatch={isRequestingBatch}
              onRequestMore={onRequestMore}
              onReset={() => patchParams({ f: null, q: null, project: null })}
              onShowAll={() => patchParams({ f: "all" })}
            />
          ) : (
            <ul>
              {visible.map((r) => {
                const isSel = selected?.contact.id === r.contact.id;
                const c = r.contact;
                return (
                  <li key={c.id} className={`border-b border-[#F1F0EC] last:border-0 ${isSel ? "bg-primary/[0.06]" : "hover:bg-[#FAFAF8]"}`}>
                    <button
                      id={`lead-row-${c.id}`}
                      type="button"
                      onClick={() => openLead(c.id)}
                      aria-current={isSel ? "true" : undefined}
                      aria-label={`${c.contact_name}, ${c.company}. ${URGENCY_LABEL[r.urgency]}. ${r.stageLabel}.`}
                      className={`grid w-full gap-x-4 gap-y-1.5 px-4 py-3 text-left md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_8.5rem_1.5rem] md:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${isSel ? "shadow-[inset_3px_0_0_hsl(var(--primary))]" : ""}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">{c.contact_name}</span>
                        <span className="line-clamp-2 text-[13px] text-[#52606D]">{[c.title, c.company].filter(Boolean).join(" · ")}</span>
                        <span className="mt-0.5 block truncate text-xs text-[#3E4C59]">{r.project ? `Role: ${r.project}` : <span className="text-[#66727F]">No open role</span>}</span>
                      </span>
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-[13px] text-[#3E4C59]">{r.stageLabel}</span>
                        <span className="block truncate text-xs text-[#5F6B7A]">{r.lastTouchAt ? `${formatAgo(r.lastTouchAt)}${r.lastTouchIsLogged ? "" : " (stage change)"}` : "No contact yet"}</span>
                      </span>
                      <span className="flex min-w-0 flex-col items-start gap-1">
                        <UrgencyChip row={r} showDetail />
                        {r.urgency === "overdue" || r.urgency === "upcoming" || r.urgency === "stale" ? (
                          <span className="max-w-full truncate text-xs text-[#52606D]">{r.urgency === "upcoming" ? formatShortDate(r.followUpAt) : r.urgency === "stale" ? formatDueLabel(r) : r.nextAction ?? ""}</span>
                        ) : null}
                      </span>
                      <ChevronRight size={16} className="hidden text-[#66727F] md:block" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <p className="mt-3 hidden text-xs text-[#5F6B7A] md:block">
          Keyboard: <kbd className="rounded border border-[#D8D6CE] bg-white px-1">j</kbd> / <kbd className="rounded border border-[#D8D6CE] bg-white px-1">k</kbd> next / previous lead · <kbd className="rounded border border-[#D8D6CE] bg-white px-1">/</kbd> search · <kbd className="rounded border border-[#D8D6CE] bg-white px-1">Esc</kbd> close panel
        </p>
        <p className="sr-only" aria-live="polite">{visible.length} lead{visible.length === 1 ? "" : "s"} shown</p>
      </div>

      {/* Detail panel: docked on wide screens, full-screen dialog on narrow ones. */}
      {selected ? (
        <div className={isDesktop ? "sticky top-4 hidden xl:block" : undefined}>
          <LeadPanel
            row={selected}
            index={selectedIndex >= 0 ? selectedIndex : lastIndexRef.current}
            total={Math.max(visible.length, 1)}
            nextRow={nextRow}
            isDesktop={isDesktop}
            session={session}
            followUpSupported={followUpSupported}
            onClose={closeLead}
            onPrev={selectedIndex > 0 ? () => moveSelection(-1) : null}
            onNext={selectedIndex >= 0 && selectedIndex < visible.length - 1 ? () => moveSelection(1) : null}
            onGoToLead={(id) => { openLead(id); document.getElementById(`lead-row-${id}`)?.scrollIntoView({ block: "nearest" }); }}
            onOpenMessage={onOpenMessage}
            onOpenEmail={onOpenEmail}
            onSaveOutcome={onSaveOutcome}
            historyVersion={historyVersion}
          />
        </div>
      ) : isDesktop ? (
        <aside className="sticky top-4 hidden h-48 items-center justify-center rounded-xl border border-dashed border-[#D8D6CE] p-6 text-center text-sm text-[#5F6B7A] xl:flex">
          Select a lead to see its context, reach out, and log what happened.
        </aside>
      ) : null}
    </div>
  );
};

type EmptyProps = {
  rowsTotal: number; filter: QueueFilter; hasActiveFilters: boolean; nextScheduled: LeadRow | null;
  canRequestMore: boolean; isRequestingBatch: boolean; onRequestMore: () => void; onReset: () => void; onShowAll: () => void;
};

const EmptyState = ({ rowsTotal, filter, hasActiveFilters, nextScheduled, canRequestMore, isRequestingBatch, onRequestMore, onReset, onShowAll }: EmptyProps) => {
  if (rowsTotal === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <p className="font-display text-lg font-extrabold text-foreground">No leads assigned yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-[#52606D]">Companies assigned to you will show up here with their contacts.</p>
        {canRequestMore ? <button type="button" onClick={onRequestMore} disabled={isRequestingBatch} className={`mt-4 inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60 ${FOCUS_RING}`}>{isRequestingBatch ? "Requesting…" : "Request companies"}</button> : null}
      </div>
    );
  }
  if (filter === "action" && !hasActiveFilters) {
    return (
      <div className="px-6 py-14 text-center">
        <CheckCircle2 size={28} className="mx-auto text-primary" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-extrabold text-foreground">You’re caught up</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-[#52606D]">
          {nextScheduled ? `Next follow-up: ${nextScheduled.contact.contact_name}, ${formatShortDate(nextScheduled.followUpAt)}.` : "Nothing needs action right now."}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {canRequestMore ? <button type="button" onClick={onRequestMore} disabled={isRequestingBatch} className={`inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60 ${FOCUS_RING}`}>{isRequestingBatch ? "Requesting…" : "Request more companies"}</button> : null}
          <button type="button" onClick={onShowAll} className={`inline-flex min-h-10 items-center rounded-md border border-[#D8D6CE] bg-white px-4 text-sm font-medium text-[#1F2933] hover:border-primary ${FOCUS_RING}`}>View all leads</button>
        </div>
      </div>
    );
  }
  return (
    <div className="px-6 py-12 text-center">
      <p className="font-display text-base font-extrabold text-foreground">No leads match</p>
      <p className="mt-1 text-sm text-[#52606D]">Try a different filter or search term.</p>
      {hasActiveFilters ? <button type="button" onClick={onReset} className={`mt-3 inline-flex min-h-9 items-center rounded-md border border-[#D8D6CE] bg-white px-3 text-sm font-medium hover:border-primary ${FOCUS_RING}`}>Reset filters</button> : null}
    </div>
  );
};

export default OutreachQueue;
