import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronRight, Inbox, Linkedin, Mail, Search, X } from "lucide-react";
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

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70 focus-visible:ring-offset-1";
const SELECT = `h-9 min-w-0 rounded-lg border border-rh-line bg-white px-2.5 text-[13px] text-rh-body hover:border-rh-line-strong ${FOCUS_RING}`;

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

  const tiles: { key: QueueFilter; label: string; value: number; dot: string; tone: string }[] = [
    { key: "overdue", label: "Overdue", value: counts.overdue, dot: "bg-rh-red", tone: "text-rh-red" },
    { key: "due_today", label: "Due today", value: counts.due_today, dot: "bg-[#C99A2E]", tone: "text-rh-amber" },
    { key: "first_contact", label: "First contact", value: counts.first_contact, dot: "bg-rh-teal-bright", tone: "text-rh-teal-ink" },
    { key: "stale", label: "No reply yet", value: counts.stale, dot: "bg-rh-faint", tone: "text-rh-body" },
  ];

  const filterCount = (key: QueueFilter): number =>
    key === "all" ? rows.length : key === "action" ? counts.overdue + counts.due_today + counts.first_contact + counts.stale : counts[key as keyof typeof counts] ?? 0;

  const initials = (name?: string | null) => (name ?? "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_27rem] xl:items-start xl:gap-6">
      <div className="min-w-0">
        {/* Header: the one primary action lives top-right */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[28px] font-semibold leading-none tracking-[-0.02em] text-rh-ink">Today</h1>
            <p className="mt-2 text-[13px] text-rh-muted">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {scopeToggle ? (
              <div role="group" aria-label="Whose leads" className="inline-flex rounded-lg bg-[#EEEDE8] p-0.5">
                {(["mine", "all"] as const).map((v) => (
                  <button key={v} type="button" aria-pressed={scopeToggle.value === v} onClick={() => scopeToggle.onChange(v)} className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${FOCUS_RING} ${scopeToggle.value === v ? "bg-white text-rh-ink shadow-sm" : "text-rh-muted hover:text-rh-ink"}`}>{v === "mine" ? "My leads" : "Everyone"}</button>
                ))}
              </div>
            ) : null}
            {firstAction ? (
              <button type="button" onClick={() => { patchParams({ f: "action", lead: firstAction.contact.id }); }} className={`group inline-flex h-10 items-center gap-2 rounded-lg bg-rh-teal px-4 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(20,99,77,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors hover:bg-rh-teal-ink ${FOCUS_RING}`}>
                Start with {firstAction.contact.contact_name}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Pulse: four numbers, one quiet card. They filter the list below. */}
        <div className="mb-6 hidden grid-cols-4 divide-x divide-rh-line overflow-hidden rounded-2xl border border-rh-line bg-white sm:grid">
          {tiles.map((t) => (
            <button key={t.key} type="button" aria-pressed={filter === t.key} onClick={() => patchParams({ f: filter === t.key ? null : t.key })} className={`px-5 py-4 text-left transition-colors hover:bg-rh-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rh-teal-bright/70 ${filter === t.key ? "bg-rh-teal-soft/60" : ""}`}>
              <span className="flex items-center gap-1.5 text-[13px] text-rh-muted"><span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} aria-hidden="true" />{t.label}</span>
              <span className={`mt-1.5 block text-[26px] font-semibold leading-none tracking-tight tabular-nums ${t.value ? "text-rh-ink" : "text-rh-faint"}`}>{t.value}</span>
            </button>
          ))}
        </div>

        {/* One card: tabs, tools, rows */}
        <div className="overflow-hidden rounded-2xl border border-rh-line bg-white shadow-[0_1px_2px_rgba(21,23,28,0.03)]">
          <div role="group" aria-label="Filter leads" className="flex flex-nowrap items-center gap-4 overflow-x-auto border-b border-rh-line px-5">
            {FILTERS.map((f) => (
              <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => patchParams({ f: f.key === "action" ? null : f.key })} className={`relative shrink-0 py-3.5 text-[13px] font-medium transition-colors ${FOCUS_RING} rounded-sm ${filter === f.key ? "text-rh-ink" : "text-rh-muted hover:text-rh-ink"}`}>
                {f.label}<span className={`ml-1.5 tabular-nums ${filter === f.key ? "text-rh-teal" : "text-rh-faint"}`}>{filterCount(f.key)}</span>
                {filter === f.key ? <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-rh-ink" aria-hidden="true" /> : null}
              </button>
            ))}
            {hasActiveFilters ? (
              <button type="button" onClick={() => patchParams({ f: null, q: null, project: null })} className={`ml-auto inline-flex shrink-0 items-center gap-1 py-3.5 text-[13px] font-medium text-rh-teal hover:underline ${FOCUS_RING} rounded-sm`}><X size={13} aria-hidden="true" />Reset</button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-rh-line bg-rh-canvas/50 px-5 py-3">
            <div className="relative basis-full sm:min-w-[10rem] sm:flex-1 sm:basis-0">
              <label htmlFor="lead-search" className="sr-only">Search leads</label>
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rh-muted" aria-hidden="true" />
              <input ref={searchRef} id="lead-search" type="search" value={query} onChange={(e) => patchParams({ q: e.target.value })} placeholder="Search name, company or role" className={`h-9 w-full rounded-lg border border-rh-line bg-white pl-9 pr-8 text-[13px] text-rh-ink placeholder:text-rh-muted hover:border-rh-line-strong ${FOCUS_RING}`} />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-rh-line px-1 text-[10px] text-rh-muted sm:block">/</kbd>
            </div>
            {projects.length > 0 ? (
              <>
                <label htmlFor="lead-project" className="sr-only">Filter by open role</label>
                <select id="lead-project" value={project} onChange={(e) => patchParams({ project: e.target.value })} className={`${SELECT} flex-1 sm:max-w-[11rem] sm:flex-none`}>
                  <option value="">All projects</option>
                  {projects.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </>
            ) : null}
            <label htmlFor="lead-sort" className="sr-only">Sort</label>
            <select id="lead-sort" value={sort} onChange={(e) => patchParams({ sort: e.target.value === "priority" ? null : e.target.value })} className={`${SELECT} flex-1 sm:flex-none`}>
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>

          {isLoading ? (
            <ul aria-busy="true" aria-label="Loading leads">
              {[0, 1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-center gap-4 border-b border-rh-line px-5 py-4 last:border-0">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-rh-line" />
                  <div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 animate-pulse rounded bg-rh-line" /><div className="h-3 w-1/2 animate-pulse rounded bg-rh-line" /></div>
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
                const hasLinkedIn = Boolean(c.linkedin_url && c.linkedin_url.includes("/in/"));
                return (
                  <li key={c.id} className="border-b border-rh-line last:border-0">
                    <button
                      id={`lead-row-${c.id}`}
                      type="button"
                      onClick={() => openLead(c.id)}
                      aria-current={isSel ? "true" : undefined}
                      aria-label={`${c.contact_name}, ${c.company}. ${URGENCY_LABEL[r.urgency]}. ${r.stageLabel}.`}
                      className={`group relative grid w-full gap-x-4 gap-y-2 px-5 py-3.5 text-left transition-colors md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)_8.5rem_1rem] md:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rh-teal-bright/70 ${isSel ? "bg-rh-teal-soft/50" : "hover:bg-rh-canvas/70"}`}
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
                          <span className="block truncate text-[13px] text-rh-muted">{[c.title, c.company].filter(Boolean).join(" · ")}</span>
                          {r.project ? <span className="block truncate text-xs text-rh-faint">{r.project}</span> : null}
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
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <p className="mt-3 hidden text-xs text-rh-muted md:block">
          <kbd className="rounded border border-rh-line bg-white px-1">j</kbd> <kbd className="rounded border border-rh-line bg-white px-1">k</kbd> move · <kbd className="rounded border border-rh-line bg-white px-1">/</kbd> search · <kbd className="rounded border border-rh-line bg-white px-1">Esc</kbd> close
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
        <aside className="sticky top-4 hidden h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rh-line-strong p-6 text-center text-[13px] text-rh-muted xl:flex">
          <Inbox size={20} className="text-rh-faint" aria-hidden="true" />
          Select a lead to see context, reach out,<br />and log what happened.
        </aside>
      ) : null}
    </div>
  );
};

type EmptyProps = {
  rowsTotal: number; filter: QueueFilter; hasActiveFilters: boolean; nextScheduled: LeadRow | null;
  canRequestMore: boolean; isRequestingBatch: boolean; onRequestMore: () => void; onReset: () => void; onShowAll: () => void;
};

const PRIMARY_SM = `inline-flex h-9 items-center rounded-lg bg-rh-teal px-4 text-[13px] font-semibold text-white hover:bg-rh-teal-ink disabled:opacity-60 ${FOCUS_RING}`;
const GHOST_SM = `inline-flex h-9 items-center rounded-lg border border-rh-line bg-white px-4 text-[13px] font-medium text-rh-ink hover:border-rh-line-strong ${FOCUS_RING}`;

const EmptyState = ({ rowsTotal, filter, hasActiveFilters, nextScheduled, canRequestMore, isRequestingBatch, onRequestMore, onReset, onShowAll }: EmptyProps) => {
  if (rowsTotal === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <Inbox size={24} className="mx-auto text-rh-faint" aria-hidden="true" />
        <p className="mt-3 text-[15px] font-semibold text-rh-ink">No leads assigned yet</p>
        <p className="mx-auto mt-1 max-w-sm text-[13px] text-rh-muted">Companies assigned to you will show up here with their contacts.</p>
        {canRequestMore ? <button type="button" onClick={onRequestMore} disabled={isRequestingBatch} className={`${PRIMARY_SM} mt-5`}>{isRequestingBatch ? "Requesting…" : "Request companies"}</button> : null}
      </div>
    );
  }
  if (filter === "action" && !hasActiveFilters) {
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
      <p className="text-[15px] font-semibold text-rh-ink">No leads match</p>
      <p className="mt-1 text-[13px] text-rh-muted">Try a different filter or search term.</p>
      {hasActiveFilters ? <button type="button" onClick={onReset} className={`${GHOST_SM} mt-4`}>Reset filters</button> : null}
    </div>
  );
};

export default OutreachQueue;
