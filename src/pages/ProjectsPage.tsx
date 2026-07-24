import { FormEvent, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProposalSession } from "@/hooks/useProposalSession";
import { signInToProposalDirectory, clearStoredProposalSession } from "@/lib/companyStatus";
import {
  fetchProjectContacts,
  fetchContactProgress,
  fetchTeamMembers,
  fetchCompanySignals,
  fetchMeetings,
  fetchClosedDeals,
  createMeeting,
  createClosedDeal,
  findCurrentTeamMember,
  updateTeamMemberName,
  updateTeamMemberRole,
  updateContactProgress,
  logContactActivity,
  getContactTier,
  buildLinkedInSearchUrl,
  assignNextBatch,
  createSelfServeContact,
  STATUS_LABELS,
  getInitials,
  type ProjectContact,
  type ContactProgress,
  type ContactStatus,
  type TeamMember,
  type CompanySignal,
  type Meeting,
  type ClosedDeal,
} from "@/lib/projectContacts";

const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;
const IS_DB_READY = Boolean(DB_URL && DB_PUBLIC);

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
  const [session, setSession] = useProposalSession();
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [contacts, setContacts] = useState<ProjectContact[]>([]);
  const [progress, setProgress] = useState<Record<string, ContactProgress>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [signals, setSignals] = useState<Record<string, CompanySignal>>({});
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [closedDeals, setClosedDeals] = useState<ClosedDeal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<Record<string, string>>({});
  const [meetingPrompt, setMeetingPrompt] = useState<ProjectContact | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [showAttribution, setShowAttribution] = useState(false);
  const [dealCompany, setDealCompany] = useState("");
  const [dealCreditedTo, setDealCreditedTo] = useState("");
  const [dealDate, setDealDate] = useState("");
  const [dealNotes, setDealNotes] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactCompany, setNewContactCompany] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactLinkedIn, setNewContactLinkedIn] = useState("");
  const [isRequestingBatch, setIsRequestingBatch] = useState(false);
  const [hasAutoRequestedFirstBatch, setHasAutoRequestedFirstBatch] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    if (!session) return;
    setIsLoadingData(true);
    Promise.all([
      fetchProjectContacts(session),
      fetchContactProgress(session),
      fetchTeamMembers(session),
      fetchCompanySignals(session),
      fetchMeetings(session),
      fetchClosedDeals(session),
    ]).then(([contactRows, progressRows, teamRows, signalRows, meetingRows, dealRows]) => {
      setContacts(contactRows);
      setProgress(progressRows);
      setTeamMembers(teamRows);
      setSignals(signalRows);
      setMeetings(meetingRows);
      setClosedDeals(dealRows);
      setIsLoadingData(false);
    });
  }, [session]);

  const currentTeamMember = useMemo(() => (session ? findCurrentTeamMember(session, teamMembers) : null), [session, teamMembers]);
  const isOwner = currentTeamMember?.role === "owner";

  const myAssignedContacts = useMemo(() => {
    if (!currentTeamMember) return [];
    return contacts.filter((c) => progress[c.id]?.assigned_to === currentTeamMember.id);
  }, [contacts, progress, currentTeamMember]);

  const myGoodContacts = useMemo(() => myAssignedContacts.filter((c) => getContactTier(c) !== "research"), [myAssignedContacts]);
  const myResearchContacts = useMemo(() => myAssignedContacts.filter((c) => getContactTier(c) === "research"), [myAssignedContacts]);

  const canRequestMoreContacts =
    myGoodContacts.length === 0 || myGoodContacts.every((c) => (progress[c.id]?.status ?? "not_started") !== "not_started");

  const handleRequestMoreContacts = async () => {
    if (!session || !currentTeamMember || isRequestingBatch) return;
    setIsRequestingBatch(true);
    const { assignedGoodIds, assignedResearchIds } = await assignNextBatch(session, currentTeamMember.id, contacts, progress);
    if (assignedGoodIds.length || assignedResearchIds.length) {
      const freshProgress = await fetchContactProgress(session);
      setProgress(freshProgress);
    }
    setIsRequestingBatch(false);
  };

  // First-time team members start with zero assigned contacts - give them
  // their first batch automatically rather than making them ask for it.
  useEffect(() => {
    if (!session || !currentTeamMember || isOwner || hasAutoRequestedFirstBatch || isLoadingData) return;
    if (myAssignedContacts.length === 0 && contacts.length > 0) {
      setHasAutoRequestedFirstBatch(true);
      handleRequestMoreContacts();
    }
  }, [session, currentTeamMember, isOwner, isLoadingData, myAssignedContacts.length, contacts.length, hasAutoRequestedFirstBatch]);

  const handleSaveName = async () => {
    if (!session || !currentTeamMember || !nameInput.trim()) return;
    const updated = await updateTeamMemberName(session, currentTeamMember.id, nameInput.trim());
    if (updated) setTeamMembers((current) => current.map((m) => (m.id === updated.id ? updated : m)));
    setIsEditingName(false);
  };

  const handleChangeRole = async (memberId: string, role: "owner" | "member") => {
    if (!session) return;
    const target = teamMembers.find((m) => m.id === memberId);
    const ownerCount = teamMembers.filter((m) => m.role === "owner").length;
    if (target?.role === "owner" && role === "member" && ownerCount <= 1) {
      window.alert("You can't remove the last owner — add another owner first.");
      return;
    }
    const updated = await updateTeamMemberRole(session, memberId, role);
    if (updated) setTeamMembers((current) => current.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleAddContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !currentTeamMember || !newContactCompany || !newContactName) return;
    const created = await createSelfServeContact(session, {
      company: newContactCompany,
      contactName: newContactName,
      email: newContactEmail,
      linkedinUrl: newContactLinkedIn,
      assignedTo: currentTeamMember.id,
    });
    if (created) {
      setContacts((current) => [...current, created]);
      setProgress((current) => ({
        ...current,
        [created.id]: { contact_id: created.id, status: "not_started", assigned_to: currentTeamMember.id, updated_at: new Date().toISOString() },
      }));
      setNewContactCompany("");
      setNewContactName("");
      setNewContactEmail("");
      setNewContactLinkedIn("");
      setShowAddContact(false);
    }
  };

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAuthLoading(true);
    setAuthMessage("");
    try {
      const nextSession = await signInToProposalDirectory(authEmail, authPassword);
      if (nextSession?.access_token) setSession(nextSession);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    clearStoredProposalSession();
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
    if (status === "meeting_set") {
      setMeetingPrompt(contact);
      setMeetingDate("");
      setMeetingNotes("");
    }
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

  const handleSaveMeeting = async () => {
    if (!session || !meetingPrompt || !meetingDate) return;
    const setBy = currentTeamMember?.id ?? null;
    const saved = await createMeeting(session, meetingPrompt.id, setBy, meetingDate, meetingNotes);
    if (saved) setMeetings((current) => [saved, ...current]);
    setMeetingPrompt(null);
  };

  const handleSaveClosedDeal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !dealCompany || !dealDate) return;
    const saved = await createClosedDeal(session, dealCompany, dealCreditedTo || null, dealDate, dealNotes);
    if (saved) {
      setClosedDeals((current) => [saved, ...current]);
      setDealCompany("");
      setDealCreditedTo("");
      setDealDate("");
      setDealNotes("");
    }
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

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="px-6 pb-20 pt-28 md:px-16 md:pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">RevHub outreach</p>
                <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Your assignments.</h1>
                {currentTeamMember ? (
                  isEditingName ? (
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={currentTeamMember.name}
                        onChange={(e) => setNameInput(e.target.value)}
                        autoFocus
                        className="h-8 rounded-md border border-[#CBD5E1] bg-white px-2 text-sm outline-none focus:border-primary"
                      />
                      <button type="button" onClick={handleSaveName} className="text-xs font-semibold uppercase tracking-[0.08em] text-primary hover:underline">Save</button>
                      <button type="button" onClick={() => setIsEditingName(false)} className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Signed in as {currentTeamMember.name}{" "}
                      <button type="button" onClick={() => { setNameInput(currentTeamMember.name); setIsEditingName(true); }} className="font-semibold text-primary hover:underline">
                        (not you? update name)
                      </button>
                    </p>
                  )
                ) : (
                  <p className="mt-1 text-sm text-[#B45309]">Your account isn't set up as a team member yet — contact Chad.</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowAddContact(true)} className="h-fit rounded-full border border-primary bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground">Add a contact</button>
                <button type="button" onClick={handleSignOut} className="h-fit rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">Sign out</button>
              </div>
            </div>

            {isLoadingData ? <p className="text-sm text-muted-foreground">Loading your assignments…</p> : null}

            {!isLoadingData && myGoodContacts.length === 0 && myResearchContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">{isRequestingBatch ? "Getting your first batch of contacts…" : "No contacts assigned yet."}</p>
            ) : null}

            <div className="grid gap-3">
              {myGoodContacts.map((contact) => {
                const contactProgress = progress[contact.id];
                const status = contactProgress?.status ?? "not_started";
                const tier = getContactTier(contact);
                return (
                  <article key={contact.id} className="overflow-hidden border border-[#E2E8F0] bg-white shadow-sm">
                    <div className="grid gap-4 p-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-extrabold text-primary">{getInitials(contact.contact_name)}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {tier === "email" ? <span title="Email on file">📧</span> : null}
                          {contact.linkedin_url && contact.linkedin_url.includes("/in/") ? (
                            <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="font-display text-lg font-extrabold tracking-tight text-foreground hover:text-primary hover:underline">{contact.contact_name}</a>
                          ) : (
                            <p className="font-display text-lg font-extrabold tracking-tight text-foreground">{contact.contact_name}</p>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-primary">{contact.title}</p>
                        <p className="text-sm text-muted-foreground">{contact.company}{contact.email ? ` · ${contact.email}` : ""}</p>
                      </div>
                      <select value={status} onChange={(e) => handleStatusChange(contact, e.target.value as ContactStatus)} className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-xs font-semibold text-[#334155] outline-none focus:border-primary">
                        {(Object.keys(STATUS_LABELS) as ContactStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </div>
                    {(contact.linkedin_connect_message || contact.intro_message || contact.follow_up_message) ? (
                      <div className="flex flex-wrap items-center gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 md:px-5">
                        {contact.linkedin_connect_message ? <button type="button" onClick={() => handleCopy(contact, "linkedin_connect_message", "1. Connection note")} className="rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-linkedin_connect_message`] ?? "1. Connection note"}</button> : null}
                        {contact.intro_message ? <button type="button" onClick={() => handleCopy(contact, "intro_message", "2. After accepted")} className="rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-intro_message`] ?? "2. After accepted"}</button> : null}
                        {contact.follow_up_message ? <button type="button" onClick={() => handleCopy(contact, "follow_up_message", "3. If no response")} className="rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-follow_up_message`] ?? "3. If no response"}</button> : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            {myGoodContacts.length > 0 ? (
              <div className="mt-4 flex justify-center">
                <button type="button" onClick={handleRequestMoreContacts} disabled={!canRequestMoreContacts || isRequestingBatch} className="rounded-full border border-primary bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground disabled:opacity-40">
                  {isRequestingBatch ? "Getting more…" : canRequestMoreContacts ? "Send me more contacts" : "Work through your current list first"}
                </button>
              </div>
            ) : null}

            {myResearchContacts.length > 0 ? (
              <div className="mt-10 border border-[#FDE68A] bg-[#FFFBEB] p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#92400E]">Additional research needed</p>
                <p className="mb-4 text-sm text-[#92400E]">These need a manual LinkedIn search — click through and confirm you've found the right person.</p>
                <div className="grid gap-2">
                  {myResearchContacts.map((contact) => (
                    <div key={contact.id} className="flex flex-wrap items-center justify-between gap-2 border border-[#FDE68A] bg-white px-3 py-2">
                      <div>
                        <span className="font-semibold text-foreground">{contact.contact_name}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{contact.title} · {contact.company}</span>
                      </div>
                      <a href={buildLinkedInSearchUrl(contact.contact_name, contact.company)} target="_blank" rel="noreferrer" className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">Search LinkedIn</a>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </main>
        <Footer />

        {showAddContact ? (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
            <div className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-background p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Add a contact</p>
              <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground">You'll be credited for this one.</h2>
              <form onSubmit={handleAddContact} className="mt-4 grid gap-3">
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">Company<input type="text" value={newContactCompany} onChange={(e) => setNewContactCompany(e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">Contact name<input type="text" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">Email (if known)<input type="email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">LinkedIn or social profile URL<input type="url" value={newContactLinkedIn} onChange={(e) => setNewContactLinkedIn(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddContact(false)} className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">Cancel</button>
                  <button type="submit" className="rounded-full border border-primary bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground">Save contact</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
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
            <div className="flex items-center gap-2">
              {isOwner ? (
                <button type="button" onClick={() => setShowAttribution((v) => !v)} className="h-fit rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] transition-colors hover:border-primary hover:text-primary">
                  {showAttribution ? "Hide attribution" : "Meetings & closed deals"}
                </button>
              ) : null}
              <button type="button" onClick={handleSignOut} className="h-fit rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] transition-colors hover:border-primary hover:text-primary">Sign out</button>
            </div>
          </div>

          {isOwner && showAttribution ? (
            <div className="mb-8 border border-[#E2E8F0] bg-white p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Attribution (owner only)</p>

              <div className="mb-6 border-b border-[#E2E8F0] pb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Team members</p>
                <div className="grid gap-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex flex-wrap items-center justify-between gap-2 border border-[#E2E8F0] px-3 py-2">
                      <div>
                        <span className="font-semibold text-foreground">{member.name}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{member.email}</span>
                      </div>
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value as "owner" | "member")}
                        className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-xs font-semibold text-[#334155] outline-none focus:border-primary"
                      >
                        <option value="member">Member</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>
                  ))}
                  {teamMembers.length === 0 ? <p className="text-sm text-muted-foreground">No team members yet.</p> : null}
                </div>
              </div>

              <form onSubmit={handleSaveClosedDeal} className="mb-6 grid gap-3 border-b border-[#E2E8F0] pb-6 md:grid-cols-[1fr_1fr_1fr_2fr_auto] md:items-end">
                <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
                  Company
                  <input type="text" value={dealCompany} onChange={(e) => setDealCompany(e.target.value)} required className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-sm outline-none focus:border-primary" />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
                  Credit to
                  <select value={dealCreditedTo} onChange={(e) => setDealCreditedTo(e.target.value)} className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-sm outline-none focus:border-primary">
                    <option value="">Unassigned</option>
                    {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
                  Contract signed
                  <input type="date" value={dealDate} onChange={(e) => setDealDate(e.target.value)} required className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-sm outline-none focus:border-primary" />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
                  Notes
                  <input type="text" value={dealNotes} onChange={(e) => setDealNotes(e.target.value)} className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-sm outline-none focus:border-primary" />
                </label>
                <button type="submit" className="h-9 rounded-md bg-primary px-4 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground">Log closed deal</button>
              </form>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Meetings set ({meetings.length})</p>
                  <div className="grid gap-2">
                    {meetings.map((m) => {
                      const contact = contacts.find((c) => c.id === m.contact_id);
                      const setter = teamMembers.find((t) => t.id === m.set_by);
                      return (
                        <div key={m.id} className="border border-[#E2E8F0] px-3 py-2 text-sm">
                          <span className="font-semibold text-foreground">{contact?.company ?? "Unknown company"}</span> — {contact?.contact_name ?? ""}
                          <span className="ml-2 text-xs text-muted-foreground">{m.meeting_date} · set by {setter?.name ?? "unassigned"}</span>
                        </div>
                      );
                    })}
                    {meetings.length === 0 ? <p className="text-sm text-muted-foreground">No meetings logged yet.</p> : null}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Closed deals ({closedDeals.length})</p>
                  <div className="grid gap-2">
                    {closedDeals.map((d) => {
                      const credited = teamMembers.find((t) => t.id === d.credited_to);
                      return (
                        <div key={d.id} className="border border-[#E2E8F0] px-3 py-2 text-sm">
                          <span className="font-semibold text-foreground">{d.company}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{d.contract_signed_date} · credited to {credited?.name ?? "unassigned"}</span>
                        </div>
                      );
                    })}
                    {closedDeals.length === 0 ? <p className="text-sm text-muted-foreground">No closed deals logged yet.</p> : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

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

      {meetingPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Log this meeting</p>
            <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground">{meetingPrompt.contact_name} · {meetingPrompt.company}</h2>
            <p className="mt-2 text-sm text-muted-foreground">This records who set the meeting, so it's easy to sort out attribution later.</p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                Meeting date
                <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                Notes (optional)
                <textarea value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)} rows={3} className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setMeetingPrompt(null)} className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">Skip</button>
              <button type="button" onClick={handleSaveMeeting} disabled={!meetingDate} className="rounded-full border border-primary bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground disabled:opacity-50">Save meeting</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProjectsPage;
