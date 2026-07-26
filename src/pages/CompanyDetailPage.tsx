import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Mail } from "lucide-react";
import CompanyInfoCard from "@/components/CompanyInfoCard";
import ProjectsSidebar from "@/components/ProjectsSidebar";
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
  updateContactProgress,
  logContactActivity,
  createClosedDeal,
  deleteMeetingForContact,
  deleteClosedDealsForCompany,
  findCurrentTeamMember,
  canManageCompany,
  getInitials,
  getPrimaryContact,
  getCompanyResearchSummary,
  getCompanyDomain,
  getContactTier,
  buildLinkedInSearchUrl,
  getPersonalizationLine,
  personalizeMessage,
  draftAIPersonalizationLine,
  STATUS_LABELS,
  STATUS_ORDER,
  EMAIL_SEQUENCE_STAGES,
  OUTREACH_MODEL_LABELS,
  OUTREACH_MODEL_BADGE_CLASS,
  OWNER_LEAD_TYPE_DOT_COLOR,
  fetchOwnerCompanyLeadFields,
  fetchOwnerSignalFields,
  formatWhyNow,
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
  type OwnerCompanyLeadFields,
  type OwnerSignalFields,
} from "@/lib/projectContacts";
import { clearStoredProposalSession } from "@/lib/companyStatus";

const STATUS_CHART_COLORS: Record<ContactStatus, string> = {
  not_contacted: "#94A3B8",
  connection_sent: "#6D28D9",
  introduction_sent: "#1D4ED8",
  follow_up_sent: "#B45309",
  meeting_set: "#2FA37F",
  do_not_contact: "#B91C1C",
};

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
  const navigate = useNavigate();
  const [session, setSession] = useProposalSession();

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

  // Outreach directly from the company page - same email popup / message
  // editor pattern as ProjectsPage's "My assignments" cards (see
  // renderAssignedContactArticle / emailPopupModal there), duplicated here
  // rather than shared since those live as closures over ProjectsPage's own
  // state. Chad asked for contacts on this page to be actionable rather than
  // just a read-only roster.
  const [copyFeedback, setCopyFeedback] = useState<Record<string, string>>({});
  const [emailPopupContact, setEmailPopupContact] = useState<ProjectContact | null>(null);
  const [messageEditor, setMessageEditor] = useState<{
    contact: ProjectContact;
    field: "linkedin_connect_message" | "intro_message" | "follow_up_message";
    label: string;
    text: string;
  } | null>(null);
  const [isDraftingAILine, setIsDraftingAILine] = useState(false);

  // Owner-only. Fetched separately from the member-safe companies/signals
  // fetches above - see the note in ProjectsPage.tsx next to the same
  // pattern.
  const [ownerCompanyFields, setOwnerCompanyFields] = useState<Record<string, OwnerCompanyLeadFields>>({});
  const [ownerSignalFields, setOwnerSignalFields] = useState<Record<string, OwnerSignalFields>>({});
  const [showOpportunityIntelligence, setShowOpportunityIntelligence] = useState(false);

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

  useEffect(() => {
    if (!session || !isOwner) return;
    Promise.all([fetchOwnerCompanyLeadFields(session), fetchOwnerSignalFields(session)]).then(([companyFields, signalFields]) => {
      setOwnerCompanyFields(companyFields);
      setOwnerSignalFields(signalFields);
    });
  }, [session, isOwner, companies.length, signals.length]);

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
    // Reopening (back to new_signal) clears out both closed-state fields,
    // regardless of which closed state it's reverting from, so the company
    // comes back clean rather than carrying a stale reason or meeting link.
    const priorMeetingContactId = company.meeting_contact_id;
    if (stage === "new_signal") {
      updates.meeting_contact_id = null;
      updates.closed_lost_reason = null;
    }
    const updated = await updateCompanyStage(session, company.id, updates);
    if (updated) setCompanies((current) => current.map((c) => (c.id === updated.id ? updated : c)));
    // "Reopen outreach" is meant to wipe the slate clean everywhere, not just
    // on this page - the Team page's meetings/closed-deals lists and its
    // per-rep tally columns all read straight from these tables, so a stale
    // row there would keep showing a date, note, or count for something
    // that's no longer true.
    if (stage === "new_signal" && updated) {
      if (priorMeetingContactId) {
        await deleteMeetingForContact(session, priorMeetingContactId);
        setMeetings((current) => current.filter((m) => m.contact_id !== priorMeetingContactId));
      }
      await deleteClosedDealsForCompany(session, company.id, company.name);
      setClosedDeals((current) => current.filter((d) => d.company_id !== company.id && d.company !== company.name));
    }
  };

  const handleSetOutreachModel = async (signalId: string, model: OutreachModel | "") => {
    if (!session) return;
    const updated = await updateSignalOutreachModel(session, signalId, model || null);
    if (updated) setSignals((current) => current.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSetEmailPosition = async (contact: ProjectContact, position: number) => {
    if (!session) return;
    setProgress((current) => ({
      ...current,
      [contact.id]: { ...current[contact.id], contact_id: contact.id, status: current[contact.id]?.status ?? "not_contacted", updated_at: new Date().toISOString(), email_sequence_position: position },
    }));
    const saved = await updateContactProgress(session, contact.id, { email_sequence_position: position }, currentTeamMember?.id);
    if (saved) setProgress((current) => ({ ...current, [contact.id]: saved }));
    logContactActivity(session, contact.id, "email_sequence_changed", String(position), currentTeamMember?.id);
  };

  const handleCopyEmailField = async (contact: ProjectContact, field: string, text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopyFeedback((current) => ({ ...current, [`${contact.id}-${field}`]: "Copied" }));
    setTimeout(() => setCopyFeedback((current) => ({ ...current, [`${contact.id}-${field}`]: label })), 1500);
    if (session) logContactActivity(session, contact.id, "email_message_copied", field, currentTeamMember?.id);
  };

  const handleSendEmail = (contact: ProjectContact, field: string, text: string) => {
    const subject = contact.email_subject ?? "";
    const mailto = `mailto:${encodeURIComponent(contact.email ?? "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = mailto;
    if (session) logContactActivity(session, contact.id, "email_send_clicked", field, currentTeamMember?.id);
  };

  const handleOpenMessage = (contact: ProjectContact, field: "linkedin_connect_message" | "intro_message" | "follow_up_message", label: string) => {
    const personalization = field === "intro_message" ? getPersonalizationLine(currentTeamMember, contact) : null;
    setMessageEditor({ contact, field, label, text: personalizeMessage(contact[field], personalization) });
  };

  const handleCopyFromEditor = async () => {
    if (!messageEditor) return;
    const { contact, field, label } = messageEditor;
    await navigator.clipboard.writeText(messageEditor.text);
    setCopyFeedback((current) => ({ ...current, [`${contact.id}-${field}`]: "Copied" }));
    setTimeout(() => setCopyFeedback((current) => ({ ...current, [`${contact.id}-${field}`]: label })), 1500);
    if (session) logContactActivity(session, contact.id, "message_copied", field, currentTeamMember?.id);
    setMessageEditor(null);
  };

  const handleDraftAILineForEditor = async () => {
    if (!session || !messageEditor) return;
    setIsDraftingAILine(true);
    const line = await draftAIPersonalizationLine(session, currentTeamMember, messageEditor.contact);
    if (line) {
      setMessageEditor((current) => {
        if (!current) return current;
        const lastBreak = current.text.lastIndexOf("\n\n");
        const text = lastBreak === -1 ? `${current.text}\n\n${line}` : `${current.text.slice(0, lastBreak)}\n\n${line}${current.text.slice(lastBreak)}`;
        return { ...current, text };
      });
    }
    setIsDraftingAILine(false);
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

  // Contact row with working outreach controls - mail icon (+ 3-dot email
  // sequence progress) opens the email popup, message-stage buttons open the
  // message editor. Mirrors ProjectsPage's renderAssignedContactArticle so a
  // rep never has to leave a company's page to actually reach out. `company`
  // is guaranteed non-null wherever this is called (inside the `company ?`
  // branch below).
  const renderOutreachContact = (contact: ProjectContact, isPrimary: boolean) => {
    const contactProgress = progress[contact.id];
    const status = contactProgress?.status ?? "not_contacted";
    const isMeetingContact = company?.meeting_contact_id === contact.id;
    const emailPosition = contactProgress?.email_sequence_position ?? 0;
    const statusRank = STATUS_ORDER[status];
    const showConnectionNote = statusRank < STATUS_ORDER.connection_sent;
    const showAfterAccepted = statusRank < STATUS_ORDER.follow_up_sent;
    const hasAnyButton =
      (contact.linkedin_connect_message && showConnectionNote) ||
      (contact.intro_message && showAfterAccepted) ||
      contact.follow_up_message;

    return (
      <div key={contact.id} className={`overflow-hidden rounded-lg border bg-white ${isMeetingContact ? "border-primary/40" : "border-[#E2E8F0]"}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${STATUS_CHART_COLORS[status]}, ${STATUS_CHART_COLORS[status]}CC)` }}
            >
              {getInitials(contact.contact_name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {contact.email ? (
                  <button
                    type="button"
                    onClick={() => setEmailPopupContact(contact)}
                    title="Email outreach"
                    className="flex items-center gap-1 rounded-full border border-[#CBD5E1] bg-white px-1.5 py-0.5 text-[#1D4ED8] hover:border-primary hover:text-primary"
                  >
                    <Mail size={12} />
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3].map((dot) => (
                        <span key={dot} className={`h-1.5 w-1.5 rounded-full ${emailPosition >= dot ? "bg-current" : "bg-[#E2E8F0]"}`} />
                      ))}
                    </span>
                  </button>
                ) : null}
                <p className="text-sm font-semibold text-foreground">
                  {contact.contact_name}
                  {isPrimary ? <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.06em] text-primary">Primary contact</span> : null}
                  {isMeetingContact ? <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.06em] text-primary">📅 Meeting contact</span> : null}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{contact.title}{contact.email ? ` · ${contact.email}` : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${STATUS_PILL_CLASS[status]}`}>{STATUS_LABELS[status]}</span>
            <span className="text-xs text-muted-foreground">{teamMembers.find((m) => m.id === contactProgress?.assigned_to)?.name ?? "Unassigned"}</span>
          </div>
        </div>
        {hasAnyButton ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-[#EEEDE7] bg-[#FAFAF8] px-3 py-2">
            {contact.linkedin_connect_message && showConnectionNote ? <button type="button" onClick={() => handleOpenMessage(contact, "linkedin_connect_message", "1. Connection note")} className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-linkedin_connect_message`] ?? "1. Connection note"}</button> : null}
            {contact.intro_message && showAfterAccepted ? <button type="button" onClick={() => handleOpenMessage(contact, "intro_message", "2. After accepted")} className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-intro_message`] ?? "2. After accepted"}</button> : null}
            {contact.follow_up_message ? <button type="button" onClick={() => handleOpenMessage(contact, "follow_up_message", "3. If no response")} className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-follow_up_message`] ?? "3. If no response"}</button> : null}
          </div>
        ) : null}
      </div>
    );
  };

  if (!IS_DB_READY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F5F2] px-6 py-16">
        <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Login is not configured.</h1>
        </section>
      </div>
    );
  }

  if (!session) return <Navigate to="/projects" replace />;

  const handleSignOut = () => {
    clearStoredProposalSession();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2]">
      <ProjectsSidebar
        isOwner={isOwner}
        activeSection="assignments"
        onSectionChange={() => navigate("/projects")}
        memberName={currentTeamMember?.name}
        onSignOut={handleSignOut}
        onAddContact={() => navigate("/projects")}
      />
      <main className="px-6 pb-20 pt-8 md:ml-56 md:px-10 md:pt-10">
        <div className="mx-auto w-full max-w-3xl">
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
                    {company.company_stage !== "new_signal" ? (
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

              <div className="mb-6 overflow-hidden rounded-2xl border border-[#EEEDE7] bg-white shadow-sm">
                <CompanyInfoCard
                  company={company}
                  research={companyResearch}
                  signals={companySignals}
                  contactCount={companyContacts.length}
                  engagedCount={companyContacts.filter((c) => (progress[c.id]?.status ?? "not_contacted") !== "not_contacted").length}
                  ownerLeadType={isOwner ? ownerCompanyFields[company.id]?.canonical_lead_type : undefined}
                  ownerSignalCount={isOwner ? ownerCompanyFields[company.id]?.signal_count : undefined}
                  emailContactCount={companyContacts.filter((c) => c.email).length}
                  logoDomain={getCompanyDomain(companyContacts)}
                />
              </div>

              {isOwner ? (
                <div className="mb-6 rounded-lg border border-[#E2E8F0] bg-white">
                  <button
                    type="button"
                    onClick={() => setShowOpportunityIntelligence((v) => !v)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Opportunity intelligence (owner only)</span>
                    <span className="text-xs font-semibold text-muted-foreground">{showOpportunityIntelligence ? "Hide ▲" : "Show ▼"}</span>
                  </button>
                  {showOpportunityIntelligence ? (
                    <div className="border-t border-[#E2E8F0] px-4 py-4">
                      {companyResearch.valueHypothesis || companyResearch.outreachAngle ? (
                        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/[0.04] p-4">
                          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Why this fits RevHub</p>
                          {companyResearch.valueHypothesis ? (
                            <p className="text-sm text-foreground"><span className="font-semibold text-primary">Why it fits: </span>{companyResearch.valueHypothesis}</p>
                          ) : null}
                          {companyResearch.outreachAngle ? (
                            <p className="mt-1 text-sm text-foreground"><span className="font-semibold text-primary">Why now: </span>{companyResearch.outreachAngle}</p>
                          ) : null}
                        </div>
                      ) : null}
                      {(() => {
                        const ownerFields = ownerCompanyFields[company.id];
                        const canonicalType = ownerFields?.canonical_lead_type;
                        const primarySignal = ownerFields?.primary_signal_id ? companySignals.find((s) => s.id === ownerFields.primary_signal_id) : null;
                        const primarySignalOwnerFields = primarySignal ? ownerSignalFields[primarySignal.id] : null;
                        const leadOrigin = canonicalType === "Cold Outreach" ? "Cold Outreach" : primarySignalOwnerFields?.lead_origin;
                        const otherTypes = (ownerFields?.all_signal_types ?? []).filter((t) => t !== canonicalType);
                        return (
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Canonical lead type</p>
                              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                {canonicalType ? <span className="h-2 w-2 rounded-full" style={{ backgroundColor: OWNER_LEAD_TYPE_DOT_COLOR[canonicalType] }} /> : null}
                                {canonicalType ?? "Not yet classified"}
                              </p>
                              {ownerFields?.lead_type_needs_review ? (
                                <p className="mt-1 text-xs text-[#B45309]">One or more signals here have no opportunity_type set - flagged for review.</p>
                              ) : null}
                            </div>
                            <div>
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Lead origin</p>
                              <p className="text-sm font-semibold text-foreground">{leadOrigin ?? "—"}</p>
                            </div>
                            {primarySignalOwnerFields?.engagement_details ? (
                              <div>
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Engagement details</p>
                                <p className="text-sm text-foreground">{primarySignalOwnerFields.engagement_details}</p>
                              </div>
                            ) : null}
                            <div>
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Related signals</p>
                              <p className="text-sm text-foreground">{ownerFields?.signal_count ?? 0} total</p>
                              {otherTypes.length > 0 ? (
                                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                                  {otherTypes.map((t) => <li key={t}>{t}</li>)}
                                </ul>
                              ) : null}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : null}
                </div>
              ) : null}

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
                <p className="mb-3 text-xs text-muted-foreground">Click the mail icon to work an email sequence, or a message-stage button to open, edit, and copy a LinkedIn message.</p>
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
                      renderOutreachContact(primaryContact, true)
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">No contacts linked to this company yet.</p>
                  )}

                  {otherContacts.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowAllContacts((v) => !v)}
                      style={{ backgroundColor: "#2c96731a" }}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] hover:border-primary hover:text-primary"
                    >
                      {showAllContacts ? "Hide" : "Show"} {otherContacts.length} other contact{otherContacts.length === 1 ? "" : "s"} {showAllContacts ? "▲" : "▼"}
                    </button>
                  ) : null}

                  {showAllContacts
                    ? otherContacts.map((contact) =>
                        contact.needs_research ? (
                          <div key={contact.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
                            <div>
                              <span className="text-sm font-semibold text-foreground">{contact.contact_name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{contact.title}</span>
                              <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.06em] text-[#92400E]">Needs research</span>
                            </div>
                            <a href={buildLinkedInSearchUrl(contact.contact_name, contact.company)} target="_blank" rel="noreferrer" className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary">Search LinkedIn</a>
                          </div>
                        ) : (
                          renderOutreachContact(contact, false)
                        )
                      )
                    : null}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>

      {emailPopupContact ? (() => {
        const contact = emailPopupContact;
        const contactProgress = progress[contact.id];
        const emailPosition = contactProgress?.email_sequence_position ?? 0;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-lg md:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Email outreach</p>
                  <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground">{contact.contact_name} · {contact.company}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{contact.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 pt-1">
                  {[1, 2, 3].map((dot) => (
                    <span key={dot} className={`h-2 w-2 rounded-full ${emailPosition >= dot ? "bg-primary" : "bg-[#E2E8F0]"}`} />
                  ))}
                </div>
              </div>

              {contact.email_assumption_notice ? (
                <div className="mt-4 rounded-lg border border-[#FBBF24]/40 bg-[#FFFBEB] p-3 text-xs text-[#92400E]">
                  <span className="font-semibold">Assumed email: </span>
                  {contact.email_assumption_notice}
                </div>
              ) : null}

              {currentTeamMember?.google_calendar_connected ? (
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/schedule/${currentTeamMember.id}`)}
                  className="mt-4 rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary"
                >
                  📅 Copy scheduling link
                </button>
              ) : null}

              {contact.email_subject ? (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#EEEDE7] bg-[#FAFAF8] px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Subject line</p>
                    <p className="truncate text-sm font-semibold text-foreground">{contact.email_subject}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmailField(contact, "email_subject", contact.email_subject ?? "", "Copy subject")}
                    className="shrink-0 rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary"
                  >
                    {copyFeedback[`${contact.id}-email_subject`] ?? "Copy subject"}
                  </button>
                </div>
              ) : null}

              <div className="mt-4 grid gap-3">
                {EMAIL_SEQUENCE_STAGES.map((stage) => {
                  const rawText = contact[stage.field];
                  if (!rawText) return null;
                  const personalization = stage.position === 1 ? getPersonalizationLine(currentTeamMember, contact) : null;
                  const text = personalizeMessage(rawText, personalization);
                  const isSent = emailPosition >= stage.position;
                  return (
                    <div key={stage.position} className={`rounded-lg border p-3.5 ${isSent ? "border-[#EEEDE7] bg-[#FAFAF8]" : "border-[#EEEDE7] bg-white"}`}>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">{stage.position}. {stage.label}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSendEmail(contact, stage.field, text)}
                            className="rounded-md border border-primary bg-primary px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-foreground hover:opacity-90"
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyEmailField(contact, stage.field, text, "Copy")}
                            className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary"
                          >
                            {copyFeedback[`${contact.id}-${stage.field}`] ?? "Copy"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetEmailPosition(contact, isSent ? stage.position - 1 : stage.position)}
                            className="rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#334155] hover:border-primary hover:text-primary"
                          >
                            {isSent ? "Undo (mark not sent)" : "Mark as sent"}
                          </button>
                        </div>
                      </div>
                      {isSent ? <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">✓ Marked sent</p> : null}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{text}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-end">
                <button type="button" onClick={() => setEmailPopupContact(null)} className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">Close</button>
              </div>
            </div>
          </div>
        );
      })() : null}

      {messageEditor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-lg md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{messageEditor.label}</p>
            <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground">{messageEditor.contact.contact_name} · {messageEditor.contact.company}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Feel free to edit this before copying — it's just a starting point.</p>

            {messageEditor.contact.value_hypothesis || messageEditor.contact.outreach_angle ? (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/[0.04] p-4">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Context for this message</p>
                {messageEditor.contact.value_hypothesis ? (
                  <p className="text-sm text-foreground"><span className="font-semibold text-primary">Why it fits: </span>{messageEditor.contact.value_hypothesis}</p>
                ) : null}
                {messageEditor.contact.outreach_angle ? (
                  <p className="mt-1 text-sm text-foreground"><span className="font-semibold text-primary">Why now: </span>{formatWhyNow(messageEditor.contact.outreach_angle)}</p>
                ) : null}
              </div>
            ) : null}

            <textarea
              value={messageEditor.text}
              onChange={(e) => setMessageEditor((current) => (current ? { ...current, text: e.target.value } : current))}
              rows={12}
              className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-primary"
            />
            {messageEditor.field === "linkedin_connect_message" ? (
              <p className={`mt-1 text-xs ${messageEditor.text.length > 300 ? "font-semibold text-[#B45309]" : "text-muted-foreground"}`}>
                {messageEditor.text.length}/300 characters {messageEditor.text.length > 300 ? "— over LinkedIn's connection note limit" : ""}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              {messageEditor.field === "intro_message" && currentTeamMember?.credibility_line ? (
                <button
                  type="button"
                  onClick={handleDraftAILineForEditor}
                  disabled={isDraftingAILine}
                  className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {isDraftingAILine ? "Drafting…" : "✨ AI-personalize"}
                </button>
              ) : null}
              {currentTeamMember?.google_calendar_connected ? (
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/schedule/${currentTeamMember.id}`)}
                  className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] hover:border-primary hover:text-primary"
                >
                  📅 Copy scheduling link
                </button>
              ) : null}
              <button type="button" onClick={() => setMessageEditor(null)} className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">Cancel</button>
              <button type="button" onClick={handleCopyFromEditor} className="rounded-full border border-primary bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground">Copy</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CompanyDetailPage;
