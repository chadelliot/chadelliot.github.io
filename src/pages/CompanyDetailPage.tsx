import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyInfoCard from "@/components/CompanyInfoCard";
import { useProposalSession } from "@/hooks/useProposalSession";
import {
  fetchProjectContacts,
  fetchContactProgress,
  fetchTeamMembers,
  fetchCompanies,
  fetchMeetings,
  fetchClosedDeals,
  fetchCompanySignalsList,
  updateCompanyStage,
  updateCompanyAssignedRep,
  updateSignalOutreachModel,
  createClosedDeal,
  findCurrentTeamMember,
  canManageCompany,
  getInitials,
  getPrimaryContact,
  getCompanyResearchSummary,
  getContactTier,
  buildLinkedInSearchUrl,
  STATUS_LABELS,
  OUTREACH_MODEL_LABELS,
  OUTREACH_MODEL_BADGE_CLASS,
  type ProjectContact,
  type ContactProgress,
  type ContactStatus,
  type TeamMember,
  type CompanySignal,
  type Meeting,
  type ClosedDeal,
  type Company,
  type CompanyStage,
  type OutreachModel,
} from "@/lib/projectContacts";

const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;
const IS_DB_READY = Boolean(DB_URL && DB_PUBLIC);

const STATUS_PILL_CLASS: Record<ContactStatus, string> = {
  not_contacted: "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
  connection_sent: "border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]",
  introduction_sent: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
  follow_up_sent: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
  meeting_set: "border-primary/30 bg-primary/5 text-primary",
  do_not_contact: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
};

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [session] = useProposalSession();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<ProjectContact[]>([]);
  const [progress, setProgress] = useState<Record<string, ContactProgress>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [signals, setSignals] = useState<CompanySignal[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [closedDeals, setClosedDeals] = useState<ClosedDeal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [showAllContacts, setShowAllContacts] = useState(false);
  const [showLogDeal, setShowLogDeal] = useState(false);
  const [dealCreditedTo, setDealCreditedTo] = useState("");
  const [dealDate, setDealDate] = useState("");
  const [dealNotes, setDealNotes] = useState("");

  useEffect(() => {
    if (!session) return;
    setIsLoadingData(true);
    Promise.all([
      fetchCompanies(session),
      fetchProjectContacts(session),
      fetchContactProgress(session),
      fetchTeamMembers(session),
      fetchCompanySignalsList(session),
      fetchMeetings(session),
      fetchClosedDeals(session),
    ]).then(([companyRows, contactRows, progressRows, teamRows, signalRows, meetingRows, dealRows]) => {
      setCompanies(companyRows);
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

  const company = useMemo(() => companies.find((c) => c.id === id) ?? null, [companies, id]);
  const canManage = company ? canManageCompany(company, currentTeamMember, isOwner) : false;

  const companyContacts = useMemo(() => contacts.filter((c) => c.company_id === id), [contacts, id]);
  const companySignals = useMemo(() => signals.filter((s) => s.company_id === id), [signals, id]);
  const companyMeeting = useMemo(
    () => (company?.meeting_contact_id ? meetings.find((m) => m.contact_id === company.meeting_contact_id) ?? null : null),
    [meetings, company]
  );
  const meetingContact = useMemo(
    () => (company?.meeting_contact_id ? companyContacts.find((c) => c.id === company.meeting_contact_id) ?? null : null),
    [companyContacts, company]
  );
  const meetingSetter = useMemo(
    () => (companyMeeting?.set_by ? teamMembers.find((t) => t.id === companyMeeting.set_by) ?? null : null),
    [teamMembers, companyMeeting]
  );
  const companyClosedDeal = useMemo(
    () => (id ? closedDeals.find((d) => d.company_id === id || d.company === company?.name) ?? null : null),
    [closedDeals, id, company]
  );
  const primaryContact = useMemo(() => getPrimaryContact(companyContacts), [companyContacts]);
  const otherContacts = useMemo(() => companyContacts.filter((c) => c.id !== primaryContact?.id), [companyContacts, primaryContact]);
  const companyResearch = useMemo(() => getCompanyResearchSummary(companyContacts), [companyContacts]);

  const handleSetStage = async (stage: CompanyStage, closedLostReason?: string) => {
    if (!session || !company) return;
    const updates: { company_stage: CompanyStage; closed_lost_reason?: string | null; meeting_contact_id?: string | null } = { company_stage: stage };
    if (stage === "closed_lost") updates.closed_lost_reason = closedLostReason || null;
    if (stage === "new_signal") updates.meeting_contact_id = null;
    const updated = await updateCompanyStage(session, company.id, updates);
    if (updated) setCompanies((current) => current.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleSetOutreachModel = async (signalId: string, model: OutreachModel | "") => {
    if (!session) return;
    const updated = await updateSignalOutreachModel(session, signalId, model || null);
    if (updated) setSignals((current) => current.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleReassignRep = async (repId: string) => {
    if (!session || !company) return;
    const updated = await updateCompanyAssignedRep(session, company.id, repId || null);
    if (updated) setCompanies((current) => current.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleSaveClosedDeal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !company || !dealDate) return;
    const saved = await createClosedDeal(session, company.name, dealCreditedTo || null, dealDate, dealNotes, company.id);
    if (saved) {
      setClosedDeals((current) => [saved, ...current]);
      setDealCreditedTo("");
      setDealDate("");
      setDealNotes("");
      setShowLogDeal(false);
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

  if (!session) return <Navigate to="/projects" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-6 pb-20 pt-28 md:px-16 md:pt-32">
        <div className="mx-auto max-w-4xl">
          <Link to="/projects" className="text-xs font-semibold uppercase tracking-[0.08em] text-primary hover:underline">← Back to RevHub</Link>

          {isLoadingData ? <p className="mt-6 text-sm text-muted-foreground">Loading company…</p> : null}

          {!isLoadingData && !company ? (
            <div className="mt-6">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Company not found.</h1>
              <p className="mt-2 text-sm text-muted-foreground">It may have been merged or removed. Head back to the board to find it.</p>
            </div>
          ) : null}

          {company ? (
            <>
              <div className="mb-4 mt-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">RevHub outreach · Company</p>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{company.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Assigned to:</span>
                    {canManage ? (
                      <select
                        value={company.assigned_rep ?? ""}
                        onChange={(e) => handleReassignRep(e.target.value)}
                        className="h-8 rounded-md border border-[#CBD5E1] bg-white px-2 text-xs font-semibold text-[#334155] outline-none focus:border-primary"
                      >
                        <option value="">Unassigned</option>
                        {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">
                        {teamMembers.find((m) => m.id === company.assigned_rep)?.name ?? "Unassigned"}
                      </span>
                    )}
                  </div>
                </div>

                {canManage ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {company.company_stage === "meeting_scheduled" ? (
                      <button type="button" onClick={() => handleSetStage("new_signal")} className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] hover:border-primary hover:text-primary">
                        Reopen outreach
                      </button>
                    ) : null}
                    {company.company_stage !== "closed_won" ? (
                      <button type="button" onClick={() => handleSetStage("closed_won")} className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] hover:border-primary hover:text-primary">
                        Mark Closed Won
                      </button>
                    ) : null}
                    {company.company_stage !== "closed_lost" ? (
                      <button
                        type="button"
                        onClick={() => {
                          const reason = window.prompt("Optional: why was this closed lost?") ?? "";
                          handleSetStage("closed_lost", reason);
                        }}
                        className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] hover:border-primary hover:text-primary"
                      >
                        Mark Closed Lost
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mb-6 overflow-hidden rounded-xl border border-[#E2E8F0]">
                <CompanyInfoCard company={company} research={companyResearch} signals={companySignals} contactCount={companyContacts.length} />
              </div>

              {company.company_stage === "closed_lost" && company.closed_lost_reason ? (
                <div className="mb-6 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                  <span className="font-semibold">Closed lost:</span> {company.closed_lost_reason}
                </div>
              ) : null}

              {companyMeeting ? (
                <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">Meeting scheduled</p>
                  <p className="mt-1 text-sm text-foreground">
                    {meetingContact?.contact_name ?? "Unknown contact"}{meetingContact?.title ? `, ${meetingContact.title}` : ""}
                    {companyMeeting.meeting_date ? ` · ${companyMeeting.meeting_date}` : ""}
                    {meetingSetter ? ` · set by ${meetingSetter.name}` : ""}
                  </p>
                  {companyMeeting.notes ? <p className="mt-1 text-sm text-muted-foreground">{companyMeeting.notes}</p> : null}
                </div>
              ) : null}

              {company.company_stage === "closed_won" ? (
                <div className="mb-6 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#15803D]">Closed deal</p>
                  {companyClosedDeal ? (
                    <p className="mt-1 text-sm text-foreground">
                      Signed {companyClosedDeal.contract_signed_date} · credited to {teamMembers.find((t) => t.id === companyClosedDeal.credited_to)?.name ?? "unassigned"}
                      {companyClosedDeal.notes ? ` — ${companyClosedDeal.notes}` : ""}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">No closed deal logged yet for this company.</p>
                      {canManage ? (
                        showLogDeal ? (
                          <form onSubmit={handleSaveClosedDeal} className="mt-3 grid gap-2 md:grid-cols-[1fr_1fr_2fr_auto] md:items-end">
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
                            <button type="submit" className="h-9 rounded-md bg-primary px-4 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground">Save</button>
                          </form>
                        ) : (
                          <button type="button" onClick={() => setShowLogDeal(true)} className="mt-2 rounded-full border border-primary bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground">
                            Log closed deal
                          </button>
                        )
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}

              {companySignals.length > 0 ? (
                <div className="mb-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Hiring signals ({companySignals.length})</p>
                  <div className="grid gap-2">
                    {companySignals.map((signal) => (
                      <div key={signal.id} className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-[#92400E]">{signal.role_title ?? "Open role"}</span>
                            {signal.posted_date ? <span className="ml-2 text-xs text-[#92400E]">posted {new Date(signal.posted_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span> : null}
                            {signal.source_url ? <a href={signal.source_url} target="_blank" rel="noreferrer" className="ml-2 text-xs font-semibold text-primary hover:underline">View posting</a> : null}
                          </div>
                          {canManage ? (
                            <select
                              value={signal.outreach_model ?? ""}
                              onChange={(e) => handleSetOutreachModel(signal.id, e.target.value as OutreachModel | "")}
                              className="h-8 rounded-md border border-[#FDE68A] bg-white px-2 text-xs font-semibold text-[#92400E] outline-none focus:border-primary"
                            >
                              <option value="">No model set</option>
                              {(Object.keys(OUTREACH_MODEL_LABELS) as OutreachModel[]).map((m) => <option key={m} value={m}>{OUTREACH_MODEL_LABELS[m]}</option>)}
                            </select>
                          ) : signal.outreach_model ? (
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${OUTREACH_MODEL_BADGE_CLASS[signal.outreach_model]}`}>{OUTREACH_MODEL_LABELS[signal.outreach_model]}</span>
                          ) : null}
                        </div>
                        {signal.notes ? <p className="mt-1 text-xs text-[#92400E]">{signal.notes}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Contacts ({companyContacts.length})</p>
                <div className="grid gap-2">
                  {primaryContact ? (
                    getContactTier(primaryContact) === "research" ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
                        <div>
                          <span className="text-sm font-semibold text-foreground">{primaryContact.contact_name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{primaryContact.title}</span>
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.06em] text-[#92400E]">Needs research</span>
                        </div>
                        <a href={buildLinkedInSearchUrl(primaryContact.contact_name, primaryContact.company)} target="_blank" rel="noreferrer" className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">Search LinkedIn</a>
                      </div>
                    ) : (
                      (() => {
                        const contactProgress = progress[primaryContact.id];
                        const status = contactProgress?.status ?? "not_contacted";
                        const isMeetingContact = company.meeting_contact_id === primaryContact.id;
                        return (
                          <div className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 ${isMeetingContact ? "border-primary/40" : "border-[#E2E8F0]"}`}>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-extrabold text-primary">{getInitials(primaryContact.contact_name)}</div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {primaryContact.contact_name}
                                  <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.06em] text-primary">Primary contact</span>
                                  {isMeetingContact ? <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.06em] text-primary">📅 Meeting contact</span> : null}
                                </p>
                                <p className="text-xs text-muted-foreground">{primaryContact.title}{primaryContact.email ? ` · ${primaryContact.email}` : ""}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${STATUS_PILL_CLASS[status]}`}>{STATUS_LABELS[status]}</span>
                              <span className="text-xs text-muted-foreground">{teamMembers.find((m) => m.id === contactProgress?.assigned_to)?.name ?? "Unassigned"}</span>
                            </div>
                          </div>
                        );
                      })()
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">No contacts linked to this company yet.</p>
                  )}

                  {otherContacts.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowAllContacts((v) => !v)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] hover:border-primary hover:text-primary"
                    >
                      {showAllContacts ? "Hide" : "Show"} {otherContacts.length} other contact{otherContacts.length === 1 ? "" : "s"} {showAllContacts ? "▲" : "▼"}
                    </button>
                  ) : null}

                  {showAllContacts
                    ? otherContacts.map((contact) => {
                        const contactProgress = progress[contact.id];
                        const status = contact.needs_research ? null : contactProgress?.status ?? "not_contacted";
                        const isMeetingContact = company.meeting_contact_id === contact.id;
                        return (
                          <div key={contact.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 ${isMeetingContact ? "border-primary/40" : "border-[#E2E8F0]"}`}>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-extrabold text-primary">{getInitials(contact.contact_name)}</div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {contact.contact_name}
                                  {isMeetingContact ? <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.06em] text-primary">📅 Meeting contact</span> : null}
                                </p>
                                <p className="text-xs text-muted-foreground">{contact.title}{contact.email ? ` · ${contact.email}` : ""}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {status ? <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${STATUS_PILL_CLASS[status]}`}>{STATUS_LABELS[status]}</span> : <span className="text-xs text-muted-foreground">Needs research</span>}
                              <span className="text-xs text-muted-foreground">{teamMembers.find((m) => m.id === contactProgress?.assigned_to)?.name ?? "Unassigned"}</span>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDetailPage;
