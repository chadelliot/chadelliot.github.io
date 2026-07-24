import { FormEvent, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getStoredProposalSession,
  fetchProjectContacts,
  fetchContactProgress,
  fetchTeamMembers,
  fetchCompanySignals,
  updateContactProgress,
  logContactActivity,
  STATUS_LABELS,
  getInitials,
  type ProjectContact,
  type ContactProgress,
  type ContactStatus,
  type TeamMember,
  type CompanySignal,
} from "@/lib/projectContacts";

type ProposalSession = { access_token: string; user: { id: string; email?: string } };

const SESSION_STORAGE_KEY = "aboutchad_proposal_directory_session_v1";
const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;
const IS_DB_READY = Boolean(DB_URL && DB_PUBLIC);

const saveStoredSession = (session: ProposalSession) => window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
const clearStoredSession = () => window.localStorage.removeItem(SESSION_STORAGE_KEY);

const readApiJson = async <T,>(response: Response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || data?.msg || data?.error_description || "Authentication failed.");
  return data as T;
};

const signIn = async (email: string, password: string) => {
  const response = await fetch(`${DB_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: DB_PUBLIC || "", "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const session = await readApiJson<ProposalSession>(response);
  saveStoredSession(session);
  return session;
};

type FilterKey = "all" | "warm_signal" | "not_started" | "meeting_set" | "responded" | "needs_research";

const PRIORITY_ORDER: Record<string, number> = { A: 0, "A/B": 1, B: 2, C: 3, D: 4, needs_review: 5, "": 6 };

const STATUS_PILL_CLASS: Record<ContactStatus, string> = {
  not_started: "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
  connected: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
  messaged: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
  responded: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
  meeting_set: "border-primary/30 bg-primary/5 text-primary",
  closed: "border-[#E2E8F0] bg-[#F1F5F9] text-[#334155]",
  do_not_contact: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
};

const ProjectsPage = () => {
  const [session, setSession] = useState<ProposalSession | null>(() => getStoredProposalSession());
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [contacts, setContacts] = useState<ProjectContact[]>([]);
  const [progress, setProgress] = useState<Record<string, ContactProgress>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [signals, setSignals] = useState<Record<string, CompanySignal>>({});
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!session) return;
    setIsLoadingData(true);
    Promise.all([
      fetchProjectContacts(session),
      fetchContactProgress(session),
      fetchTeamMembers(session),
      fetchCompanySignals(session),
    ]).then(([contactRows, progressRows, teamRows, signalRows]) => {
      setContacts(contactRows);
      setProgress(progressRows);
      setTeamMembers(teamRows);
      setSignals(signalRows);
      setIsLoadingData(false);
    });
  }, [session]);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAuthLoading(true);
    setAuthMessage("");
    try {
      const nextSession = await signIn(authEmail, authPassword);
      if (nextSession?.access_token) setSession(nextSession);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    clearStoredSession();
    setSession(null);
  };

  const stats = useMemo(() => {
    const actionable = contacts.filter((c) => !c.needs_research && !c.do_not_contact);
    const notStarted = actionable.filter((c) => (progress[c.id]?.status ?? "not_started") === "not_started").length;
    const meetingsSet = actionable.filter((c) => progress[c.id]?.status === "meeting_set").length;
    const responded = actionable.filter((c) => progress[c.id]?.status === "responded").length;
    const needsResearch = contacts.filter((c) => c.needs_research).length;
    const warmSignal = actionable.filter((c) => signals[c.company]).length;
    return { notStarted, meetingsSet, responded, needsResearch, warmSignal };
  }, [contacts, progress, signals]);

  const filteredContacts = useMemo(() => {
    let rows = contacts.filter((c) => !c.do_not_contact);

    if (activeFilter === "warm_signal") rows = rows.filter((c) => !c.needs_research && signals[c.company]);
    if (activeFilter === "not_started") rows = rows.filter((c) => !c.needs_research && (progress[c.id]?.status ?? "not_started") === "not_started");
    if (activeFilter === "meeting_set") rows = rows.filter((c) => progress[c.id]?.status === "meeting_set");
    if (activeFilter === "responded") rows = rows.filter((c) => progress[c.id]?.status === "responded");
    if (activeFilter === "needs_research") rows = rows.filter((c) => c.needs_research);
    else if (activeFilter !== "all") rows = rows.filter((c) => !c.needs_research);

    if (priorityFilter !== "all") rows = rows.filter((c) => (c.priority || "") === priorityFilter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (c) =>
          c.company.toLowerCase().includes(q) ||
          (c.contact_name ?? "").toLowerCase().includes(q) ||
          (c.title ?? "").toLowerCase().includes(q)
      );
    }

    // A warm hiring signal outranks priority tier entirely - a B-priority
    // company with an active signal sorts above an A-priority company with
    // none. Within the same signal status, priority tier breaks the tie,
    // and the most recently posted signal sorts first among signal companies.
    return rows.sort((a, b) => {
      const signalA = signals[a.company];
      const signalB = signals[b.company];
      const hasSignalA = signalA ? 0 : 1;
      const hasSignalB = signalB ? 0 : 1;
      if (hasSignalA !== hasSignalB) return hasSignalA - hasSignalB;

      if (signalA && signalB) {
        const dateA = signalA.posted_date ?? "";
        const dateB = signalB.posted_date ?? "";
        if (dateA !== dateB) return dateA > dateB ? -1 : 1;
      }

      const pa = PRIORITY_ORDER[a.priority ?? ""] ?? 6;
      const pb = PRIORITY_ORDER[b.priority ?? ""] ?? 6;
      if (pa !== pb) return pa - pb;
      return a.company.localeCompare(b.company);
    });
  }, [contacts, progress, signals, activeFilter, priorityFilter, search]);

  const handleStatusChange = async (contact: ProjectContact, status: ContactStatus) => {
    if (!session) return;
    setProgress((current) => ({
      ...current,
      [contact.id]: { contact_id: contact.id, status, updated_at: new Date().toISOString(), assigned_to: current[contact.id]?.assigned_to ?? null },
    }));
    const saved = await updateContactProgress(session, contact.id, { status });
    if (saved) setProgress((current) => ({ ...current, [contact.id]: saved }));
    logContactActivity(session, contact.id, "status_changed", status);
  };

  const handleAssign = async (contact: ProjectContact, assignedTo: string) => {
    if (!session) return;
    const value = assignedTo || null;
    setProgress((current) => ({ ...current, [contact.id]: { ...current[contact.id], contact_id: contact.id, status: current[contact.id]?.status ?? "not_started", updated_at: new Date().toISOString(), assigned_to: value } }));
    const saved = await updateContactProgress(session, contact.id, { assigned_to: value });
    if (saved) setProgress((current) => ({ ...current, [contact.id]: saved }));
  };

  const handleCopy = async (contact: ProjectContact, field: "linkedin_connect_message" | "intro_message" | "follow_up_message", label: string) => {
    const text = contact[field];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopyFeedback((current) => ({ ...current, [`${contact.id}-${field}`]: "Copied" }));
    setTimeout(() => setCopyFeedback((current) => ({ ...current, [`${contact.id}-${field}`]: label })), 1500);
    if (session) logContactActivity(session, contact.id, "message_copied", field);
  };

  if (!IS_DB_READY) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="px-6 pb-20 pt-32 md:px-20 md:pt-40">
          <section className="mx-auto max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Login is not configured.</h1>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="px-6 pb-20 pt-32 md:px-20 md:pt-40">
          <section className="mx-auto max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">RevHub outreach</p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">Sign in to continue.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Access is by invitation only — contact Chad if you need an account.</p>
            <form onSubmit={handleAuthSubmit} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Email
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" autoComplete="email" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Password
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required minLength={6} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" autoComplete="current-password" />
              </label>
              <button type="submit" disabled={isAuthLoading} className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors disabled:opacity-50">Sign in</button>
            </form>
            {authMessage ? <p className="mt-4 rounded-2xl border border-border p-4 text-sm text-muted-foreground">{authMessage}</p> : null}
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const statTiles: { key: FilterKey; label: string; value: number }[] = [
    { key: "warm_signal", label: "Warm signal", value: stats.warmSignal },
    { key: "not_started", label: "Not started", value: stats.notStarted },
    { key: "responded", label: "Responded", value: stats.responded },
    { key: "meeting_set", label: "Meetings set", value: stats.meetingsSet },
    { key: "needs_research", label: "Need research", value: stats.needsResearch },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-6 pb-20 pt-28 md:px-16 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">RevHub outreach</p>
              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Your contact queue.</h1>
            </div>
            <button type="button" onClick={handleSignOut} className="h-fit rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] transition-colors hover:border-primary hover:text-primary">Sign out</button>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
            {statTiles.map((tile) => {
              const isWarm = tile.key === "warm_signal";
              const isActive = activeFilter === tile.key;
              const warmClass = isActive ? "border-[#B45309] bg-[#FFFBEB]" : "border-[#FDE68A] bg-[#FFFBEB] hover:border-[#B45309]";
              const normalClass = isActive ? "border-primary bg-primary/5" : "border-[#E2E8F0] bg-white hover:border-primary/50";
              return (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => setActiveFilter(activeFilter === tile.key ? "all" : tile.key)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${isWarm ? warmClass : normalClass}`}
                >
                  <p className={`font-mono text-3xl font-bold ${isWarm ? "text-[#B45309]" : "text-foreground"}`}>{tile.value}</p>
                  <p className={`mt-1 text-xs font-semibold uppercase tracking-[0.1em] ${isWarm ? "text-[#92400E]" : "text-muted-foreground"}`}>{tile.label}</p>
                </button>
              );
            })}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 py-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, name, or title"
              className="h-10 flex-1 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm outline-none focus:border-primary"
            />
            <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Priority
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-2 text-sm font-semibold text-[#334155] outline-none focus:border-primary">
                <option value="all">All</option>
                <option value="A">A</option>
                <option value="A/B">A/B</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </label>
            {activeFilter !== "all" ? (
              <button type="button" onClick={() => setActiveFilter("all")} className="text-xs font-semibold uppercase tracking-[0.08em] text-primary hover:underline">Clear filter</button>
            ) : null}
          </div>

          {isLoadingData ? (
            <p className="text-sm text-muted-foreground">Loading contacts…</p>
          ) : filteredContacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contacts match the current filters.</p>
          ) : (
            <div className="grid gap-3">
              {filteredContacts.slice(0, 50).map((contact) => {
                const contactProgress = progress[contact.id];
                const status = contact.needs_research ? null : contactProgress?.status ?? "not_started";
                const signal = signals[contact.company];
                return (
                  <article key={contact.id} className={`overflow-hidden border bg-white shadow-sm ${signal ? "border-[#FDE68A]" : "border-[#E2E8F0]"}`}>
                    <div className="grid gap-4 p-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-extrabold text-primary">
                        {contact.needs_research ? "?" : getInitials(contact.contact_name)}
                      </div>
                      <div className="min-w-0">
                        {contact.needs_research ? (
                          <>
                            <p className="font-display text-lg font-extrabold tracking-tight text-foreground">{contact.company}</p>
                            <p className="text-sm font-semibold text-muted-foreground">Contact research needed</p>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-center gap-2">
                              {contact.linkedin_url ? (
                                <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="font-display text-lg font-extrabold tracking-tight text-foreground no-underline hover:text-primary hover:underline">{contact.contact_name}</a>
                              ) : (
                                <p className="font-display text-lg font-extrabold tracking-tight text-foreground">{contact.contact_name}</p>
                              )}
                              {contact.priority ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{contact.priority}</span> : null}
                            </div>
                            <p className="text-sm font-semibold text-primary">{contact.title}</p>
                            <p className="text-sm text-muted-foreground">{contact.company}</p>
                            {signal ? (
                              <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-[11px] font-semibold text-[#92400E]">
                                Hiring{signal.role_title ? `: ${signal.role_title}` : ""}{signal.posted_date ? ` · posted ${new Date(signal.posted_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                              </p>
                            ) : null}
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        {status ? (
                          <>
                            <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${STATUS_PILL_CLASS[status]}`}>{STATUS_LABELS[status]}</span>
                            <select
                              value={status}
                              onChange={(e) => handleStatusChange(contact, e.target.value as ContactStatus)}
                              className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-xs font-semibold text-[#334155] outline-none focus:border-primary"
                            >
                              {(Object.keys(STATUS_LABELS) as ContactStatus[]).map((s) => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                              ))}
                            </select>
                          </>
                        ) : null}
                        {teamMembers.length ? (
                          <select
                            value={contactProgress?.assigned_to ?? ""}
                            onChange={(e) => handleAssign(contact, e.target.value)}
                            className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-xs font-semibold text-[#334155] outline-none focus:border-primary"
                          >
                            <option value="">Unassigned</option>
                            {teamMembers.map((member) => (
                              <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                          </select>
                        ) : null}
                      </div>
                    </div>

                    {!contact.needs_research && (contact.linkedin_connect_message || contact.intro_message || contact.follow_up_message) ? (
                      <div className="flex flex-wrap items-center gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 md:px-5">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Outreach:</span>
                        {contact.linkedin_connect_message ? (
                          <button type="button" onClick={() => handleCopy(contact, "linkedin_connect_message", "1. Connection note")} className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] transition-colors hover:border-primary hover:text-primary">
                            {copyFeedback[`${contact.id}-linkedin_connect_message`] ?? "1. Connection note"}
                          </button>
                        ) : null}
                        {contact.intro_message ? (
                          <button type="button" onClick={() => handleCopy(contact, "intro_message", "2. After accepted")} className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] transition-colors hover:border-primary hover:text-primary">
                            {copyFeedback[`${contact.id}-intro_message`] ?? "2. After accepted"}
                          </button>
                        ) : null}
                        {contact.follow_up_message ? (
                          <button type="button" onClick={() => handleCopy(contact, "follow_up_message", "3. If no response")} className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] transition-colors hover:border-primary hover:text-primary">
                            {copyFeedback[`${contact.id}-follow_up_message`] ?? "3. If no response"}
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
          {filteredContacts.length > 50 ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">Showing the first 50 of {filteredContacts.length} matching contacts — narrow your search or filters to see more precisely.</p>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
