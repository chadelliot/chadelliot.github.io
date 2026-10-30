import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { UserPlus, Zap, Send, CalendarClock, Trophy, XCircle, BarChart3, Info, Mail, UserMinus, UserCheck, Camera, Linkedin, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CompanyBoard from "@/components/CompanyBoard";
import CompanyInfoCard from "@/components/CompanyInfoCard";
import OutreachQueue from "@/components/outreach/OutreachQueue";
import PageHeader from "@/components/outreach/PageHeader";
import TeamSection from "@/components/outreach/TeamSection";
import type { OutcomeInput, OutcomeResult } from "@/components/outreach/LeadPanel";
import { buildLeadRows, leadTierOf, suggestedLinkedInDraft, addDaysYmd, type LeadTier } from "@/lib/outreachQueue";
import ProjectsSidebar, { type ProjectsSection } from "@/components/ProjectsSidebar";
import { useProposalSession } from "@/hooks/useProposalSession";
import { signInToProposalDirectory, clearStoredProposalSession, hydrateSessionFromUrlFragment, setOwnPassword } from "@/lib/companyStatus";
import {
  fetchProjectContacts,
  fetchContactProgress,
  fetchTeamMembers,
  fetchTeamMembersWithLogin,
  fetchMeetings,
  fetchClosedDeals,
  fetchCompanies,
  updateCompanyAssignedRep,
  fetchMeetingBlocks,
  fetchCompanySignalsList,
  createMeeting,
  deleteMeetingForContact,
  createClosedDeal,
  findCurrentTeamMember,
  updateTeamMemberName,
  updateTeamMemberProfile,
  updateTeamMemberRole,
  updateContactProgress,
  logContactActivity,
  recordContactActivity,
  probeFollowUpSupport,
  getContactTier,
  isContactProfileCurrent,
  buildLinkedInSearchUrl,
  assignNextCompanyBatch,
  advanceCompanyToEngaged,
  createSelfServeContact,
  STATUS_LABELS,
  STATUS_ORDER,
  EMAIL_SEQUENCE_STAGES,
  COMPANY_STAGE_LABELS,
  OUTREACH_MODEL_LABELS,
  OUTREACH_MODEL_BADGE_CLASS,
  getPersonalizationLine,
  draftAIPersonalizationLine,
  parseResumeWithAI,
  buildGoogleAuthUrl,
  disconnectGoogleCalendar,
  getCompanyDomain,
  personalizeMessage,
  uploadTeamMemberFile,
  fetchResumeSignedUrl,
  PRIORITY_ORDER,
  getPrimaryContact,
  getCompanyResearchSummary,
  computeCompanyInsights,
  formatWhyNow,
  getInitials,
  daysAgo,
  fetchOwnerCompanyLeadFields,
  OWNER_LEAD_TYPE_FILTER_ORDER,
  OWNER_LEAD_TYPE_BADGE_CLASS,
  type ProjectContact,
  type ContactProgress,
  type ContactStatus,
  type TeamMember,
  type CompanySignal,
  type Meeting,
  type ClosedDeal,
  type Company,
  type CompanyStage,
  type ContactMeetingBlock,
  type OwnerLeadType,
  type OwnerCompanyLeadFields,
} from "@/lib/projectContacts";

const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;
const IS_DB_READY = Boolean(DB_URL && DB_PUBLIC);

type FilterKey = "all" | "warm_signal" | "not_contacted" | "engaged" | "connection_sent" | "connection_accepted" | "introduction_sent" | "follow_up_sent" | "meeting_set" | "needs_research";

const STATUS_PILL_CLASS: Record<ContactStatus, string> = {
  not_contacted: "bg-rh-canvas text-rh-muted",
  connection_sent: "bg-rh-teal-soft text-rh-teal-ink",
  connection_accepted: "bg-emerald-50 text-emerald-700",
  introduction_sent: "bg-rh-teal-soft text-rh-teal-ink",
  follow_up_sent: "bg-rh-amber-soft text-rh-amber",
  meeting_set: "bg-[#EAF0FD] text-[#2F55B0]",
  do_not_contact: "bg-rh-red-soft text-rh-red",
};

const STAGE_CHART_COLORS: Record<CompanyStage, string> = {
  new_signal: "#94A3B8",
  opportunities_engaged: "#1D4ED8",
  meeting_scheduled: "#2FA37F",
  closed_won: "#15803D",
  closed_lost: "#B91C1C",
};

// Light background tint for the icon chip on each KPI tile - same hue as
// STAGE_CHART_COLORS, just at low opacity so the icon color still does the
// work of carrying meaning.
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

const STATUS_CHART_COLORS: Record<ContactStatus, string> = {
  not_contacted: "#94A3B8",
  connection_sent: "#6D28D9",
  connection_accepted: "#059669",
  introduction_sent: "#1D4ED8",
  follow_up_sent: "#B45309",
  meeting_set: "#2FA37F",
  do_not_contact: "#B91C1C",
};

// Reveals company cards 6 at a time, loading more automatically as the
// sentinel div at the bottom of the list scrolls into view - "scroll to
// see more" rather than a click-to-load button. Resets to the first 6
// whenever the underlying count changes (a filter change, a fresh batch of
// assignments), which is the right default even though it also means a
// data refresh with an unchanged filter set will reset scroll position -
// an acceptable tradeoff for the simplicity here.
const INFINITE_SCROLL_BATCH = 6;
const useInfiniteReveal = (totalCount: number) => {
  const [visibleCount, setVisibleCount] = useState(INFINITE_SCROLL_BATCH);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(INFINITE_SCROLL_BATCH);
  }, [totalCount]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((v) => Math.min(v + INFINITE_SCROLL_BATCH, totalCount));
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [totalCount]);

  return { visibleCount, sentinelRef };
};

// A small self-contained popover (owns its own open/close state) rather
// than a single shared "which company's popup is open" flag on the page -
// there can be dozens of these rendered in one card grid, and this keeps
// each one independent without threading an id through render props.
const CompanyWhyPopover = ({ valueHypothesis, outreachAngle }: { valueHypothesis?: string | null; outreachAngle?: string | null }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        aria-label="Why we're targeting this company"
        className="flex h-6 w-6 items-center justify-center rounded-full text-primary hover:bg-primary/10"
      >
        <Info size={15} />
      </button>
      {open ? (
        <div className="absolute right-0 top-8 z-20 w-72 rounded-lg border border-rh-line bg-white p-3 text-left shadow-lg">
          <p className="mb-1.5 text-xs font-medium text-primary">Why we're reaching out</p>
          {valueHypothesis ? <p className="text-xs leading-relaxed text-foreground"><span className="font-semibold">Why it fits: </span>{valueHypothesis}</p> : null}
          {outreachAngle ? <p className="mt-1.5 text-xs leading-relaxed text-foreground"><span className="font-semibold">Why now: </span>{outreachAngle}</p> : null}
          {!valueHypothesis && !outreachAngle ? (
            <p className="text-xs text-muted-foreground">No research on file yet for this company.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const ProjectsPage = () => {
  const [session, setSession] = useProposalSession();
  const [mustSetPassword, setMustSetPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordSetMessage, setPasswordSetMessage] = useState("");
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  useEffect(() => {
    hydrateSessionFromUrlFragment().then((result) => {
      if (!result) return;
      setSession(result.session);
      if (result.needsPassword) setMustSetPassword(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    if (newPasswordInput.length < 6) {
      setPasswordSetMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPasswordInput !== newPasswordConfirm) {
      setPasswordSetMessage("Passwords don't match.");
      return;
    }
    setIsSettingPassword(true);
    const ok = await setOwnPassword(session, newPasswordInput);
    setIsSettingPassword(false);
    if (ok) {
      setMustSetPassword(false);
      setNewPasswordInput("");
      setNewPasswordConfirm("");
      setPasswordSetMessage("");
    } else {
      setPasswordSetMessage("Something went wrong setting your password. Try again.");
    }
  };

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [contacts, setContacts] = useState<ProjectContact[]>([]);
  const [progress, setProgress] = useState<Record<string, ContactProgress>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  // Same rows as teamMembers, filtered to only those with a live login -
  // only for what the Team page displays, so a deleted account disappears
  // from the roster without breaking name lookups (assigned_rep,
  // credited_to) elsewhere, which intentionally keep resolving departed
  // members' names for historical attribution.
  const [teamMembersWithLogin, setTeamMembersWithLogin] = useState<TeamMember[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [closedDeals, setClosedDeals] = useState<ClosedDeal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [meetingBlocks, setMeetingBlocks] = useState<Record<string, ContactMeetingBlock>>({});
  const [signalList, setSignalList] = useState<CompanySignal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<Record<string, string>>({});
  const [meetingPrompt, setMeetingPrompt] = useState<ProjectContact | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  // The section lives in the URL (?view=) so Back from a company page, a
  // reload or a shared link lands on the same screen. The queue is the
  // default landing view.
  const [urlParams, setUrlParams] = useSearchParams();
  const [activeSection, setActiveSectionState] = useState<ProjectsSection>(() => {
    const v = urlParams.get("view");
    return v === "assignments" || v === "classic" || v === "board" || v === "team" || v === "profile" ? v : "queue";
  });
  const setActiveSection = (section: ProjectsSection) => {
    setActiveSectionState(section);
    setUrlParams(section === "queue" ? {} : { view: section }, { replace: false });
  };
  const [followUpSupported, setFollowUpSupported] = useState(false);
  const [queueScopeChoice, setQueueScopeChoice] = useState<"mine" | "all" | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [dealCompany, setDealCompany] = useState("");
  const [dealCreditedTo, setDealCreditedTo] = useState("");
  const [dealDate, setDealDate] = useState("");
  const [dealNotes, setDealNotes] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactCompany, setNewContactCompany] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactLinkedIn, setNewContactLinkedIn] = useState("");
  const [newContactTitle, setNewContactTitle] = useState("");
  const [newContactIndustry, setNewContactIndustry] = useState("");
  const [newContactPriority, setNewContactPriority] = useState("");
  const [newContactValueHypothesis, setNewContactValueHypothesis] = useState("");
  const [newContactOutreachAngle, setNewContactOutreachAngle] = useState("");
  const [profileTitleInput, setProfileTitleInput] = useState("");
  const [profileNameInput, setProfileNameInput] = useState("");
  const [profileLinkedInInput, setProfileLinkedInInput] = useState("");
  const [profileCredibilityInput, setProfileCredibilityInput] = useState("");
  const [profileBackgroundTagsInput, setProfileBackgroundTagsInput] = useState("");
  const [profileSaveMessage, setProfileSaveMessage] = useState("");
  const [isDraftingAILine, setIsDraftingAILine] = useState(false);
  const [calendarStatusMessage, setCalendarStatusMessage] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeFileForAI, setResumeFileForAI] = useState<File | null>(null);
  const [isParsingResumeAI, setIsParsingResumeAI] = useState(false);
  const [resumeAIMessage, setResumeAIMessage] = useState("");
  const [isRequestingBatch, setIsRequestingBatch] = useState(false);
  const [hasAutoRequestedFirstBatch, setHasAutoRequestedFirstBatch] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [messageEditor, setMessageEditor] = useState<{
    contact: ProjectContact;
    field: "linkedin_connect_message" | "intro_message" | "follow_up_message";
    label: string;
    text: string;
  } | null>(null);
  const [emailPopupContact, setEmailPopupContact] = useState<ProjectContact | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const toggleCompanyExpanded = (companyId: string) => setExpandedCompanies((current) => ({ ...current, [companyId]: !current[companyId] }));
  const [showCharts, setShowCharts] = useState(false);
  const [companyStageFilter, setCompanyStageFilter] = useState<CompanyStage | "all">("all");
  // Cuts across stages (a company can be stalled in new_signal or
  // meeting_scheduled - see computeCompanyInsights), so it's a separate
  // toggle rather than one more CompanyStage value.
  const [stalledOnlyFilter, setStalledOnlyFilter] = useState(false);
  // Owner-only. Not fetched, rendered, or read by anything on the Member
  // render path below - the data itself never reaches a Member's session
  // (see fetchOwnerCompanyLeadFields), this is just the UI half of that.
  const [leadTypeFilter, setLeadTypeFilter] = useState<OwnerLeadType | "all">(
    () => (sessionStorage.getItem("revhub_lead_type_filter") as OwnerLeadType | "all") || "all"
  );
  useEffect(() => {
    sessionStorage.setItem("revhub_lead_type_filter", leadTypeFilter);
  }, [leadTypeFilter]);
  const [ownerCompanyFields, setOwnerCompanyFields] = useState<Record<string, OwnerCompanyLeadFields>>({});

  useEffect(() => {
    if (!session) return;
    setIsLoadingData(true);
    Promise.all([
      fetchProjectContacts(session),
      fetchContactProgress(session),
      fetchTeamMembers(session),
      fetchTeamMembersWithLogin(session),
      fetchMeetings(session),
      fetchClosedDeals(session),
      fetchCompanies(session),
      fetchMeetingBlocks(session),
      fetchCompanySignalsList(session),
    ]).then(([contactRows, progressRows, teamRows, teamRowsWithLogin, meetingRows, dealRows, companyRows, blockRows, signalListRows]) => {
      setContacts(contactRows);
      setProgress(progressRows);
      setTeamMembers(teamRows);
      setTeamMembersWithLogin(teamRowsWithLogin);
      setMeetings(meetingRows);
      setClosedDeals(dealRows);
      setCompanies(companyRows);
      setMeetingBlocks(blockRows);
      setSignalList(signalListRows);
      setIsLoadingData(false);
    });
  }, [session]);

  useEffect(() => {
    if (!session) return;
    probeFollowUpSupport(session).then(setFollowUpSupported);
  }, [session]);

  const currentTeamMember = useMemo(() => (session ? findCurrentTeamMember(session, teamMembers) : null), [session, teamMembers]);
  const isOwner = currentTeamMember?.role === "owner";

  useEffect(() => {
    if (!currentTeamMember) return;
    setProfileNameInput(currentTeamMember.name);
    setProfileTitleInput(currentTeamMember.title ?? "");
    setProfileLinkedInInput(currentTeamMember.linkedin_url ?? "");
    setProfileCredibilityInput(currentTeamMember.credibility_line ?? "");
    setProfileBackgroundTagsInput(currentTeamMember.background_tags ?? "");
  }, [currentTeamMember]);

  // Google redirects back here after the OAuth consent screen (see the
  // google-calendar Edge Function's oauth_callback handler) with a
  // ?calendar= query param rather than anything requiring a fetch - this
  // just surfaces that as a message and cleans the URL so refreshing the
  // page doesn't re-show it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const calendarResult = params.get("calendar");
    if (calendarResult === "connected") {
      setCalendarStatusMessage("Google Calendar connected.");
      setActiveSection("profile");
    } else if (calendarResult === "error") {
      setCalendarStatusMessage("Couldn't connect Google Calendar - try again.");
      setActiveSection("profile");
    }
    if (calendarResult) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  // Owner-only lead-type data, fetched separately from the member-safe
  // companies fetch and never merged into `companies` itself - so a
  // refresh of `companies` elsewhere (after a stage change, a reassignment)
  // can't accidentally carry stale owner fields, and a Member's companies
  // array never has this data sitting in it even transiently.
  useEffect(() => {
    if (!session || !isOwner) return;
    fetchOwnerCompanyLeadFields(session).then(setOwnerCompanyFields);
  }, [session, isOwner, companies.length]);

  // Signals grouped by company_id - a company can carry more than one open
  // role, and both the assignment ranking and the board cards need to see
  // the whole cluster, not just one.
  const signalsByCompanyId = useMemo(() => {
    const grouped: Record<string, CompanySignal[]> = {};
    for (const signal of signalList) {
      if (!signal.company_id) continue;
      (grouped[signal.company_id] ??= []).push(signal);
    }
    return grouped;
  }, [signalList]);

  // Same clustering, keyed by company name instead - the main contact
  // queue below only has the contact's company name to go on, not every
  // contact has company_id backfilled on legacy rows.
  const signalsByCompany = useMemo(() => {
    const grouped: Record<string, CompanySignal[]> = {};
    for (const signal of signalList) {
      (grouped[signal.company] ??= []).push(signal);
    }
    return grouped;
  }, [signalList]);

  const contactsByCompanyId = useMemo(() => {
    const grouped: Record<string, ProjectContact[]> = {};
    for (const contact of contacts) {
      if (!contact.company_id) continue;
      (grouped[contact.company_id] ??= []).push(contact);
    }
    return grouped;
  }, [contacts]);

  // Shared with CompanyBoard via computeCompanyInsights so "stalled" means
  // the same thing on both dashboards. companyInsightsAll covers every
  // company (what the owner tile needs); the member tile filters this same
  // map down to myAssignedCompanies rather than recomputing it.
  const companyInsightsAll = useMemo(
    () => computeCompanyInsights(companies, contactsByCompanyId, progress, signalsByCompanyId),
    [companies, contactsByCompanyId, progress, signalsByCompanyId]
  );
  const stalledCountAll = useMemo(() => companies.filter((c) => companyInsightsAll[c.id]?.stalled).length, [companies, companyInsightsAll]);

  // A rep owns whole companies now, not a scattered list of individual
  // contacts - assigning a company hands them every contact at it. Sorted
  // so active (new_signal) companies surface above ones that already moved
  // to a meeting or closed.
  const STAGE_SORT_ORDER: Record<CompanyStage, number> = { new_signal: 0, opportunities_engaged: 1, meeting_scheduled: 2, closed_won: 3, closed_lost: 4 };
  const myAssignedCompanies = useMemo(() => {
    if (!currentTeamMember) return [];
    return companies
      .filter((c) => c.assigned_rep === currentTeamMember.id)
      .sort((a, b) => STAGE_SORT_ORDER[a.company_stage] - STAGE_SORT_ORDER[b.company_stage] || a.name.localeCompare(b.name));
  }, [companies, currentTeamMember]);

  const stalledCountMine = useMemo(
    () => myAssignedCompanies.filter((c) => companyInsightsAll[c.id]?.stalled).length,
    [myAssignedCompanies, companyInsightsAll]
  );

  // An owner who has no companies assigned would otherwise see an empty
  // queue, so default them to everyone until they choose.
  const queueScope: "mine" | "all" = queueScopeChoice ?? (isOwner && myAssignedCompanies.length === 0 ? "all" : "mine");
  const setQueueScope = setQueueScopeChoice;

  // One flat, ranked list of leads for the Today queue. Members always see
  // their own book; an owner can widen it to everyone's.
  const queueRows = useMemo(
    () =>
      buildLeadRows({
        contacts,
        progress,
        companies,
        signalsByCompanyId,
        meetingBlocks,
        companyIds: isOwner && queueScope === "all" ? undefined : new Set(myAssignedCompanies.map((c) => c.id)),
        followUpSupported,
        now: new Date(),
      }),
    [contacts, progress, companies, signalsByCompanyId, meetingBlocks, isOwner, queueScope, myAssignedCompanies, followUpSupported]
  );

  // Overdue + due-today for the signed-in rep's own book, whatever scope the
  // owner has picked in the queue; drives the badge on the Today nav item.
  const todayBadge = useMemo(() => {
    const own = buildLeadRows({
      contacts, progress, companies, signalsByCompanyId, meetingBlocks,
      companyIds: new Set(myAssignedCompanies.map((c) => c.id)),
      followUpSupported, now: new Date(),
    });
    return own.filter((r) => r.urgency === "overdue" || r.urgency === "due_today").length;
  }, [contacts, progress, companies, signalsByCompanyId, meetingBlocks, myAssignedCompanies, followUpSupported]);

  // A company only has to be "touched," not fully worked, before a rep can
  // ask for more - once at least one contact there has been reached out to
  // (any status past not_contacted) or marked do_not_contact, that's
  // enough. Still-untouched companies (every contact sitting at
  // not_contacted, stage still new_signal) are what actually blocks a
  // fresh batch.
  const isCompanyUntouched = (company: Company): boolean => {
    if (company.company_stage !== "new_signal") return false;
    const companyAllContacts = contacts.filter((c) => c.company_id === company.id);
    if (companyAllContacts.length === 0) return false;
    return companyAllContacts.every((c) => !c.do_not_contact && (progress[c.id]?.status ?? "not_contacted") === "not_contacted");
  };

  const canRequestMoreCompanies = useMemo(
    () => myAssignedCompanies.length === 0 || myAssignedCompanies.every((c) => !isCompanyUntouched(c)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [myAssignedCompanies, contacts, progress]
  );

  const handleRequestMoreCompanies = async () => {
    if (!session || !currentTeamMember || isRequestingBatch) return;
    setIsRequestingBatch(true);
    const { assignedCompanyIds } = await assignNextCompanyBatch(session, currentTeamMember.id, companies, contacts, progress, signalsByCompanyId);
    if (assignedCompanyIds.length) {
      const [freshCompanies, freshProgress] = await Promise.all([fetchCompanies(session), fetchContactProgress(session)]);
      setCompanies(freshCompanies);
      setProgress(freshProgress);
    }
    setIsRequestingBatch(false);
  };

  // First-time team members start with zero assigned companies - give them
  // their first batch automatically rather than making them ask for it.
  useEffect(() => {
    if (!session || !currentTeamMember || isOwner || hasAutoRequestedFirstBatch || isLoadingData) return;
    if (myAssignedCompanies.length === 0 && companies.length > 0) {
      setHasAutoRequestedFirstBatch(true);
      handleRequestMoreCompanies();
    }
  }, [session, currentTeamMember, isOwner, isLoadingData, myAssignedCompanies.length, companies.length, hasAutoRequestedFirstBatch]);

  const handleSaveName = async () => {
    if (!session || !currentTeamMember || !nameInput.trim()) return;
    const updated = await updateTeamMemberName(session, currentTeamMember.id, nameInput.trim());
    if (updated) setTeamMembers((current) => current.map((m) => (m.id === updated.id ? updated : m)));
    setIsEditingName(false);
  };

  const handleChangeRole = async (memberId: string, role: "owner" | "member") => {
    if (!session) return;
    // Counted from teamMembersWithLogin, not teamMembers - a departed
    // member's old "owner" role shouldn't count toward this safeguard,
    // since they can't log in to act as one anymore.
    const target = teamMembersWithLogin.find((m) => m.id === memberId);
    const ownerCount = teamMembersWithLogin.filter((m) => m.role === "owner").length;
    if (target?.role === "owner" && role === "member" && ownerCount <= 1) {
      window.alert("You can't remove the last owner — add another owner first.");
      return;
    }
    const updated = await updateTeamMemberRole(session, memberId, role);
    if (updated) {
      setTeamMembers((current) => current.map((m) => (m.id === updated.id ? updated : m)));
      setTeamMembersWithLogin((current) => current.map((m) => (m.id === updated.id ? updated : m)));
    }
  };

  const handleAddContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !currentTeamMember || !newContactCompany || !newContactName) return;
    const created = await createSelfServeContact(
      session,
      {
        company: newContactCompany,
        contactName: newContactName,
        email: newContactEmail,
        linkedinUrl: newContactLinkedIn,
        assignedTo: currentTeamMember.id,
        title: newContactTitle,
        industry: newContactIndustry,
        priority: newContactPriority,
        valueHypothesis: newContactValueHypothesis,
        outreachAngle: newContactOutreachAngle,
      },
      companies
    );
    if (created) {
      setContacts((current) => [...current, created]);
      setProgress((current) => ({
        ...current,
        [created.id]: { contact_id: created.id, status: "not_contacted", assigned_to: currentTeamMember.id, updated_at: new Date().toISOString() },
      }));
      // The contact may have just created a brand-new company row (see
      // findOrCreateCompanyId) - refetch so it shows up as a card right
      // away instead of only appearing after the next full page load.
      if (created.company_id && !companies.some((c) => c.id === created.company_id)) {
        setCompanies(await fetchCompanies(session));
      }
      setNewContactCompany("");
      setNewContactName("");
      setNewContactEmail("");
      setNewContactLinkedIn("");
      setNewContactTitle("");
      setNewContactIndustry("");
      setNewContactPriority("");
      setNewContactValueHypothesis("");
      setNewContactOutreachAngle("");
      setShowAddContact(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!session || !currentTeamMember) return;
    const updated = await updateTeamMemberProfile(session, currentTeamMember.id, {
      name: profileNameInput.trim() || currentTeamMember.name,
      title: profileTitleInput.trim() || null,
      linkedin_url: profileLinkedInInput.trim() || null,
      credibility_line: profileCredibilityInput.trim() || null,
      background_tags: profileBackgroundTagsInput.trim() || null,
    });
    if (updated) {
      setTeamMembers((current) => current.map((m) => (m.id === updated.id ? updated : m)));
      setProfileSaveMessage("Saved.");
      setTimeout(() => setProfileSaveMessage(""), 2000);
    }
  };

  const handleUploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !session || !currentTeamMember) return;
    setIsUploadingPhoto(true);
    const photoUrl = await uploadTeamMemberFile(session, currentTeamMember.id, "avatars", file);
    if (photoUrl) {
      const updated = await updateTeamMemberProfile(session, currentTeamMember.id, { photo_url: photoUrl });
      if (updated) setTeamMembers((current) => current.map((m) => (m.id === updated.id ? updated : m)));
    }
    setIsUploadingPhoto(false);
  };

  const handleUploadResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !session || !currentTeamMember) return;
    setIsUploadingResume(true);
    const resumePath = await uploadTeamMemberFile(session, currentTeamMember.id, "resumes", file);
    if (resumePath) {
      const updated = await updateTeamMemberProfile(session, currentTeamMember.id, { resume_url: resumePath });
      if (updated) setTeamMembers((current) => current.map((m) => (m.id === updated.id ? updated : m)));
      // Kept in memory (not re-downloaded from storage) so "Parse with AI"
      // below can read it immediately without an extra round trip.
      setResumeFileForAI(file);
    }
    setIsUploadingResume(false);
  };

  // Fills the Signature line / Background tags inputs from the resume for
  // the rep to review - never saved automatically. The rep still has to
  // read it over and click Save themselves, same as if they'd typed it in.
  const handleParseResumeAI = async () => {
    if (!session || !resumeFileForAI) return;
    setIsParsingResumeAI(true);
    setResumeAIMessage("");
    const parsed = await parseResumeWithAI(session, resumeFileForAI);
    if (parsed) {
      if (parsed.credibility_line) setProfileCredibilityInput(parsed.credibility_line);
      if (parsed.background_tags) setProfileBackgroundTagsInput(parsed.background_tags);
      setResumeAIMessage("Filled in below - review, then click Save.");
    } else {
      setResumeAIMessage("Couldn't read that resume (PDF only for now) - fill the fields in by hand instead.");
    }
    setIsParsingResumeAI(false);
  };

  const handleDisconnectCalendar = async () => {
    if (!session || !currentTeamMember) return;
    const success = await disconnectGoogleCalendar(session, currentTeamMember.id);
    if (success) {
      setTeamMembers((current) => current.map((m) => (m.id === currentTeamMember.id ? { ...m, google_calendar_connected: false, google_calendar_email: null } : m)));
      setCalendarStatusMessage("Google Calendar disconnected.");
    }
  };

  // Resumes live in a private bucket, so "viewing" one means asking for a
  // fresh short-lived signed link each time rather than storing a permanent
  // URL anywhere in the UI.
  const handleViewResume = async () => {
    if (!session || !currentTeamMember?.resume_url) return;
    const url = await fetchResumeSignedUrl(session, currentTeamMember.resume_url);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  // Shared between the Member and Owner render branches - editing your own
  // profile. Email is shown read-only: it's how findCurrentTeamMember
  // matches this row to the signed-in session, so it isn't safe to edit
  // from here (see the comment on updateTeamMemberProfile).
  //
  // Resume upload is deliberately just storage + a link for a human (you)
  // to read, not an auto-fill - actually parsing a resume into structured
  // background fields needs an LLM call, which can't safely run in this
  // static frontend (no place to hold an API key). See
  // supabase/functions/rep-profile-ai for the Edge Function that adds that
  // once you've got a key ready to wire in.
  const renderProfileSection = () => (
    <div className="mx-auto w-full max-w-5xl pb-28">
      {/* Hero header - full-width banner, oversized avatar with a hover-to-
          change overlay, name/title edited inline right in the header
          rather than buried in a plain form field further down. */}
      <div className="overflow-hidden rounded-2xl border border-rh-line bg-white shadow-sm">
                <div className="px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="group relative shrink-0">
                {currentTeamMember?.photo_url ? (
                  <img
                    src={currentTeamMember.photo_url}
                    alt={currentTeamMember.name}
                    className="h-20 w-20 rounded-full object-cover ring-1 ring-rh-line sm:h-20 sm:w-20"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rh-teal-soft font-display text-xl font-semibold text-rh-teal-ink ring-1 ring-rh-line">
                    {getInitials(currentTeamMember?.name ?? "")}
                  </div>
                )}
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/0 opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100">
                  {isUploadingPhoto ? (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-white">Uploading…</span>
                  ) : (
                    <Camera size={20} className="text-white" />
                  )}
                  <input type="file" accept="image/*" onChange={handleUploadPhoto} disabled={isUploadingPhoto} className="hidden" />
                </label>
              </div>
              <div className="min-w-0 pb-1 sm:pb-2">
                <input
                  type="text"
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  placeholder="Your name"
                  className="w-full min-w-0 border-none bg-transparent p-0 font-display text-2xl font-semibold tracking-tight text-rh-ink outline-none focus:outline-none"
                />
                <input
                  type="text"
                  value={profileTitleInput}
                  onChange={(e) => setProfileTitleInput(e.target.value)}
                  placeholder="Add a title, e.g. Account Executive"
                  className="mt-0.5 w-full min-w-0 border-none bg-transparent p-0 text-sm font-semibold text-primary outline-none focus:outline-none"
                />
                <p className="mt-0.5 text-xs text-muted-foreground">{currentTeamMember?.email}</p>
              </div>
            </div>

            {/* At-a-glance status badges - what's connected/on file, without
                having to scan the whole form below. */}
            <div className="flex flex-wrap items-center gap-2 pb-1 sm:pb-2">
              {profileLinkedInInput ? (
                <a
                  href={profileLinkedInInput}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-[13px] font-medium text-[#1D4ED8] hover:border-primary"
                >
                  <Linkedin size={12} /> LinkedIn
                </a>
              ) : null}
              {currentTeamMember?.resume_url ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDD6FE] bg-[#F5F3FF] px-3 py-1.5 text-[13px] font-medium text-[#6D28D9]">
                  <FileText size={12} /> Resume on file
                </span>
              ) : null}
              {currentTeamMember?.google_calendar_connected ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1.5 text-[13px] font-medium text-[#15803D]">
                  <CheckCircle2 size={12} /> Calendar connected
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Detail cards - responsive grid: single column on mobile, two
          columns on larger screens, personalization spanning the full
          width since it's the highest-value section to get right. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-rh-line bg-white p-6 shadow-sm lg:col-span-2">
          <p className="mb-1 text-xs font-medium text-primary">Outreach personalization</p>
          <h3 className="mb-5 font-display text-[15px] font-semibold tracking-tight text-rh-ink">How your outreach represents you</h3>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-1.5 text-[13px] font-medium text-rh-ink">
              LinkedIn profile URL
              <input type="url" value={profileLinkedInInput} onChange={(e) => setProfileLinkedInInput(e.target.value)} placeholder="https://linkedin.com/in/you" className="rounded-lg border border-rh-line bg-white px-3 py-2 text-[13px] text-rh-ink hover:border-rh-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70" />
            </label>
            <label className="grid gap-1.5 text-[13px] font-medium text-rh-ink">
              Background tags
              <input
                type="text"
                value={profileBackgroundTagsInput}
                onChange={(e) => setProfileBackgroundTagsInput(e.target.value)}
                placeholder="e.g. supply chain, logistics, manufacturing"
                className="rounded-lg border border-rh-line bg-white px-3 py-2 text-[13px] text-rh-ink hover:border-rh-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70"
              />
              <span className="text-xs font-normal normal-case tracking-normal text-muted-foreground">
                Comma-separated industries/keywords. Your signature line only gets added when a contact's industry matches one of these - leave blank to always include it.
              </span>
            </label>
            <label className="grid gap-1.5 text-[13px] font-medium text-rh-ink md:col-span-2">
              Signature line
              <textarea
                value={profileCredibilityInput}
                onChange={(e) => setProfileCredibilityInput(e.target.value)}
                rows={2}
                placeholder="e.g. I spent 6 years in supply chain ops before this, so I've seen this exact hiring crunch firsthand."
                className="rounded-lg border border-rh-line bg-white px-3 py-2 text-[13px] text-rh-ink hover:border-rh-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70"
              />
              <span className="text-xs font-normal normal-case tracking-normal text-muted-foreground">
                One sentence about your own background - gets woven into your intro messages to add credibility.
              </span>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-rh-line bg-white p-6 shadow-sm">
          <p className="mb-1 text-xs font-medium text-primary">Resume</p>
          <h3 className="mb-4 font-display text-[15px] font-semibold tracking-tight text-rh-ink">Background details</h3>
          <div className="flex flex-wrap items-center gap-3">
            <label className="rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink hover:border-primary hover:text-primary">
              <span className="cursor-pointer">{isUploadingResume ? "Uploading…" : currentTeamMember?.resume_url ? "Replace resume" : "Upload resume"}</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleUploadResume} disabled={isUploadingResume} className="hidden" />
            </label>
            {currentTeamMember?.resume_url ? (
              <button type="button" onClick={handleViewResume} className="text-[13px] font-medium text-rh-body hover:text-primary hover:underline">View current</button>
            ) : null}
          </div>
          {resumeFileForAI ? (
            <button type="button" onClick={handleParseResumeAI} disabled={isParsingResumeAI} className="mt-3 text-[13px] font-medium text-primary hover:underline disabled:opacity-50">
              {isParsingResumeAI ? "Reading resume…" : "✨ Fill in signature line + tags from this resume"}
            </button>
          ) : null}
          {resumeAIMessage ? <p className="mt-2 text-xs font-semibold text-primary">{resumeAIMessage}</p> : null}
          <p className="mt-3 text-xs text-muted-foreground">
            PDF or Word. Stored privately - only you and Owners can view it. PDF resumes can be auto-read (button appears after upload) to suggest your signature line and tags above - review before saving.
          </p>
        </div>

        <div className="rounded-2xl border border-rh-line bg-white p-6 shadow-sm">
          <p className="mb-1 text-xs font-medium text-primary">Google Calendar</p>
          <h3 className="mb-4 font-display text-[15px] font-semibold tracking-tight text-rh-ink">Let contacts grab time</h3>
          {currentTeamMember?.google_calendar_connected ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3DE] px-2.5 py-1 text-[13px] font-medium text-[#3B6D11]">
                <CheckCircle2 size={12} /> Connected{currentTeamMember.google_calendar_email ? ` · ${currentTeamMember.google_calendar_email}` : ""}
              </span>
              <button type="button" onClick={handleDisconnectCalendar} className="text-[13px] font-medium text-rh-body hover:text-primary hover:underline">Disconnect</button>
            </div>
          ) : buildGoogleAuthUrl(currentTeamMember?.id ?? "") ? (
            <a
              href={buildGoogleAuthUrl(currentTeamMember?.id ?? "") ?? "#"}
              className="inline-block rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink hover:border-primary hover:text-primary"
            >
              Connect Google Calendar
            </a>
          ) : (
            <p className="text-xs text-muted-foreground">Google Calendar isn't set up yet - ask Chad.</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {currentTeamMember?.google_calendar_connected ? (
              <>Your scheduling link: <span className="font-semibold text-foreground">{window.location.origin}/schedule/{currentTeamMember.id}</span> - drop it into an outreach message so contacts can book real open time on your calendar.</>
            ) : (
              "Connect once, then contacts can grab time directly off your real availability instead of a manual back-and-forth."
            )}
          </p>
          {calendarStatusMessage ? <p className="mt-2 text-xs font-semibold text-primary">{calendarStatusMessage}</p> : null}
        </div>
      </div>

      {/* Save bar - sticky to the bottom of the viewport so it's always
          reachable regardless of how tall the cards above get, rather than
          a plain inline button that could end up far below the fold. */}
      <div className="sticky bottom-4 left-0 right-0 z-10 mt-6 flex items-center justify-end gap-3 rounded-2xl border border-rh-line bg-white/95 px-5 py-3 shadow-lg backdrop-blur">
        {profileSaveMessage ? <span className="text-xs font-semibold text-primary">{profileSaveMessage}</span> : null}
        <button type="button" onClick={handleSaveProfile} className="rounded-lg bg-rh-teal px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-rh-teal-ink">Save changes</button>
      </div>
    </div>
  );

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

  const statusCountsByMember = useMemo(() => {
    const counts: Record<string, Record<ContactStatus, number>> = {};
    for (const member of teamMembers) {
      counts[member.id] = { not_contacted: 0, connection_sent: 0, connection_accepted: 0, introduction_sent: 0, follow_up_sent: 0, meeting_set: 0, do_not_contact: 0 };
    }
    for (const contact of contacts) {
      const p = progress[contact.id];
      if (!p?.assigned_to || !counts[p.assigned_to]) continue;
      counts[p.assigned_to][p.status] = (counts[p.assigned_to][p.status] ?? 0) + 1;
    }
    return counts;
  }, [contacts, progress, teamMembers]);

  // Company-level penetration - how far the whole book has moved through
  // the funnel, independent of any one contact's status. This is what the
  // owner dashboard leads with now.
  const companyStageCounts = useMemo(() => {
    const counts: Record<CompanyStage, number> = { new_signal: 0, opportunities_engaged: 0, meeting_scheduled: 0, closed_won: 0, closed_lost: 0 };
    for (const company of companies) counts[company.company_stage] = (counts[company.company_stage] ?? 0) + 1;
    return counts;
  }, [companies]);

  const companyStagePieData = useMemo(
    () =>
      (Object.keys(COMPANY_STAGE_LABELS) as CompanyStage[])
        .map((stage) => ({ name: COMPANY_STAGE_LABELS[stage], value: companyStageCounts[stage], color: STAGE_CHART_COLORS[stage] }))
        .filter((row) => row.value > 0),
    [companyStageCounts]
  );

  // Companies by stage, per rep - a penetration leaderboard rather than
  // just an activity leaderboard.
  const companiesByRepStage = useMemo(
    () =>
      teamMembers.map((member) => {
        const repCompanies = companies.filter((c) => c.assigned_rep === member.id);
        const row: Record<string, number | string> = { name: member.name };
        for (const stage of Object.keys(COMPANY_STAGE_LABELS) as CompanyStage[]) {
          row[stage] = repCompanies.filter((c) => c.company_stage === stage).length;
        }
        return row;
      }),
    [teamMembers, companies]
  );

  const acceptedAwaitingIntroCount = useMemo(
    () => contacts.filter((c) => !c.do_not_contact && progress[c.id]?.status === "connection_accepted").length,
    [contacts, progress]
  );
  const myAcceptedAwaitingIntroCount = useMemo(() => {
    const assigned = new Set(myAssignedCompanies.map((c) => c.id));
    return contacts.filter((c) => !c.do_not_contact && c.company_id && assigned.has(c.company_id) && progress[c.id]?.status === "connection_accepted").length;
  }, [contacts, progress, myAssignedCompanies]);

  const contactStatusPieData = useMemo(() => {
    const counts: Record<ContactStatus, number> = { not_contacted: 0, connection_sent: 0, connection_accepted: 0, introduction_sent: 0, follow_up_sent: 0, meeting_set: 0, do_not_contact: 0 };
    for (const contact of contacts) {
      const status = progress[contact.id]?.status ?? "not_contacted";
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return (Object.keys(STATUS_LABELS) as ContactStatus[])
      .map((status) => ({ name: STATUS_LABELS[status], value: counts[status], color: STATUS_CHART_COLORS[status] }))
      .filter((row) => row.value > 0);
  }, [contacts, progress]);

  const filteredContacts = useMemo(() => {
    let rows = contacts.filter((c) => !c.do_not_contact);

    if (activeFilter === "warm_signal") rows = rows.filter((c) => !c.needs_research && signalsByCompany[c.company]?.length);
    if (activeFilter === "not_contacted") rows = rows.filter((c) => !c.needs_research && (progress[c.id]?.status ?? "not_contacted") === "not_contacted");
    // "Engaged" is any status past the starting line - matches how
    // myContactEngagement/engagedCount elsewhere define "engaged" (anything
    // other than not_contacted), not a specific status value.
    if (activeFilter === "engaged") rows = rows.filter((c) => !c.needs_research && (progress[c.id]?.status ?? "not_contacted") !== "not_contacted");
    if (activeFilter === "connection_sent") rows = rows.filter((c) => progress[c.id]?.status === "connection_sent");
    if (activeFilter === "connection_accepted") rows = rows.filter((c) => progress[c.id]?.status === "connection_accepted");
    if (activeFilter === "meeting_set") rows = rows.filter((c) => progress[c.id]?.status === "meeting_set");
    if (activeFilter === "introduction_sent") rows = rows.filter((c) => progress[c.id]?.status === "introduction_sent");
    if (activeFilter === "follow_up_sent") rows = rows.filter((c) => progress[c.id]?.status === "follow_up_sent");
    // Needs-research contacts (and the companies whose only visible contact
    // is one of them) stay out of the default view - they clutter the
    // queue with people nobody can act on yet. They only surface when
    // that's specifically what's being filtered for.
    if (activeFilter === "needs_research") rows = rows.filter((c) => c.needs_research);
    else rows = rows.filter((c) => !c.needs_research);

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
      const signalsA = signalsByCompany[a.company];
      const signalsB = signalsByCompany[b.company];
      const hasSignalA = signalsA?.length ? 0 : 1;
      const hasSignalB = signalsB?.length ? 0 : 1;
      if (hasSignalA !== hasSignalB) return hasSignalA - hasSignalB;

      if (signalsA?.length && signalsB?.length) {
        // signalList is fetched ordered by posted_date desc, so index 0
        // in each group is already that company's most recent signal.
        const dateA = signalsA[0].posted_date ?? "";
        const dateB = signalsB[0].posted_date ?? "";
        if (dateA !== dateB) return dateA > dateB ? -1 : 1;
      }

      const pa = PRIORITY_ORDER[a.priority ?? ""] ?? 6;
      const pb = PRIORITY_ORDER[b.priority ?? ""] ?? 6;
      if (pa !== pb) return pa - pb;
      return a.company.localeCompare(b.company);
    });
  }, [contacts, progress, signalsByCompany, activeFilter, priorityFilter, search]);

  // Member-scoped version of the same search/status/priority filters the
  // owner view uses (filteredContacts, above, is already computed across
  // every contact) - restricted here to only the companies this rep is
  // assigned, so a Member gets the same filtering power without ever
  // touching Lead Type (that control - and the data behind it - stays
  // owner-only, rendered only in the owner branch further down).
  const myFilteredCompanyGroups = useMemo(() => {
    // companyStageFilter mirrors the owner view's clickable stage tiles
    // (see ownerCompanyGroups) - lets the "Meetings scheduled"/"Closed
    // won"/"Closed lost" KPI tiles below double as filters too.
    const stageScoped = myAssignedCompanies
      .filter((c) => companyStageFilter === "all" || c.company_stage === companyStageFilter)
      .filter((c) => !stalledOnlyFilter || companyInsightsAll[c.id]?.stalled);
    const myCompanyIds = new Set(stageScoped.map((c) => c.id));
    const byCompanyId: Record<string, ProjectContact[]> = {};
    for (const contact of filteredContacts) {
      if (!contact.company_id || !myCompanyIds.has(contact.company_id)) continue;
      (byCompanyId[contact.company_id] ??= []).push(contact);
    }
    return stageScoped
      .filter((c) => byCompanyId[c.id]?.length)
      .map((company) => ({ company, matchingContacts: byCompanyId[company.id] }));
  }, [myAssignedCompanies, filteredContacts, companyStageFilter, stalledOnlyFilter, companyInsightsAll]);

  const { visibleCount: memberVisibleCount, sentinelRef: memberSentinelRef } = useInfiniteReveal(myFilteredCompanyGroups.length);

  // Top-of-page KPI row for a Member's own book - company-level "total
  // opportunities" plus the three funnel stages (unfiltered by the
  // search/status/priority bar, same as the owner's stage tiles, so these
  // always reflect the rep's whole book at a glance) alongside contact-level
  // engagement, which the company-stage counts alone don't surface.
  const myCompanyStageCounts = useMemo(() => {
    const counts: Record<CompanyStage, number> = { new_signal: 0, opportunities_engaged: 0, meeting_scheduled: 0, closed_won: 0, closed_lost: 0 };
    for (const company of myAssignedCompanies) counts[company.company_stage] = (counts[company.company_stage] ?? 0) + 1;
    return counts;
  }, [myAssignedCompanies]);

  const myContactEngagement = useMemo(() => {
    const myCompanyIds = new Set(myAssignedCompanies.map((c) => c.id));
    let engaged = 0;
    let notEngaged = 0;
    for (const contact of contacts) {
      if (!contact.company_id || !myCompanyIds.has(contact.company_id) || contact.do_not_contact) continue;
      const status = progress[contact.id]?.status ?? "not_contacted";
      if (status === "not_contacted") notEngaged += 1;
      else engaged += 1;
    }
    return { engaged, notEngaged };
  }, [myAssignedCompanies, contacts, progress]);

  // Owner view, grouped by company instead of a flat contact list - same
  // shape as a rep's "My assignments," but across every company with a
  // contact matching the current search/status/priority filters (not just
  // ones assigned to the signed-in owner).
  const ownerCompanyGroups = useMemo(() => {
    const byCompanyId: Record<string, ProjectContact[]> = {};
    for (const contact of filteredContacts) {
      if (!contact.company_id) continue;
      (byCompanyId[contact.company_id] ??= []).push(contact);
    }
    return companies
      .filter((c) => byCompanyId[c.id]?.length)
      .filter((c) => companyStageFilter === "all" || c.company_stage === companyStageFilter)
      .filter((c) => leadTypeFilter === "all" || ownerCompanyFields[c.id]?.canonical_lead_type === leadTypeFilter)
      .filter((c) => !stalledOnlyFilter || companyInsightsAll[c.id]?.stalled)
      .sort((a, b) => {
        const sa = signalsByCompanyId[a.id]?.length ? 0 : 1;
        const sb = signalsByCompanyId[b.id]?.length ? 0 : 1;
        if (sa !== sb) return sa - sb;
        return STAGE_SORT_ORDER[a.company_stage] - STAGE_SORT_ORDER[b.company_stage] || a.name.localeCompare(b.name);
      })
      .map((company) => ({ company, matchingContacts: byCompanyId[company.id] }));
  }, [companies, filteredContacts, signalsByCompanyId, companyStageFilter, leadTypeFilter, stalledOnlyFilter, companyInsightsAll, ownerCompanyFields]);

  const { visibleCount: ownerVisibleCount, sentinelRef: ownerSentinelRef } = useInfiniteReveal(ownerCompanyGroups.length);

  // Only these three count as "genuinely reached out" for auto-advancing a
  // company to Opportunities Engaged - not_contacted and do_not_contact
  // obviously don't (do_not_contact caused the backfill bug fixed in
  // fix_opportunities_engaged_backfill.sql), and meeting_set is deliberately
  // excluded too: it's handled entirely by the handle_meeting_set() DB
  // trigger, which moves the company straight to meeting_scheduled. Running
  // our own advance here as well would race against that trigger using a
  // stale client-side company_stage and could clobber meeting_scheduled
  // back down to opportunities_engaged.
  const ENGAGED_STATUS_VALUES: ContactStatus[] = ["connection_sent", "connection_accepted", "introduction_sent", "follow_up_sent"];

  const handleStatusChange = async (contact: ProjectContact, status: ContactStatus) => {
    if (!session) return;
    const previousStatus = progress[contact.id]?.status ?? "not_contacted";
    // Acceptance is inbound, not proof that an introduction was sent.
    const patch: Parameters<typeof updateContactProgress>[2] = { status };
    if (status === "connection_accepted" && followUpSupported) {
      patch.follow_up_at = addDaysYmd(new Date(), 1);
      patch.next_action = "Send introduction after connection acceptance";
    }
    const saved = await updateContactProgress(session, contact.id, patch, currentTeamMember?.id);
    if (!saved) return;
    setProgress((current) => ({ ...current, [contact.id]: saved }));
    logContactActivity(session, contact.id, "status_changed", status, currentTeamMember?.id);
    if (status === "connection_accepted" && previousStatus !== "connection_accepted") {
      logContactActivity(session, contact.id, "connection_accepted", "Acceptance confirmed manually", currentTeamMember?.id);
    }
    if (ENGAGED_STATUS_VALUES.includes(status)) handleAdvanceEngagement(contact.company_id);
    if (status === "meeting_set") {
      setMeetingPrompt(contact);
      setMeetingDate("");
      setMeetingNotes("");
    }
    // Reverting a contact away from meeting_set has to delete the meetings
    // row itself, not just let the DB trigger flip the company's stage back -
    // otherwise the Team page's "Meetings set" list and per-rep tallies keep
    // showing a meeting that's no longer true forever (this row is never
    // touched by anything else). See deleteMeetingForContact's own comment;
    // CompanyDetailPage's "Reopen" flow already does this, this path didn't.
    if (previousStatus === "meeting_set" && status !== "meeting_set") {
      await deleteMeetingForContact(session, contact.id);
    }
    // Setting a contact to meeting_set (or reverting one away from it) can
    // flip the company's stage server-side via the handle_meeting_set DB
    // trigger (see supabase/migrations/revert_meeting_status.sql) - refetch
    // everything meeting-related so the stage stat tiles, meeting blocks, and
    // "Meetings set" list never go stale after a revert.
    if (status === "meeting_set" || previousStatus === "meeting_set") {
      const [freshCompanies, freshBlocks, freshMeetings] = await Promise.all([
        fetchCompanies(session),
        fetchMeetingBlocks(session),
        fetchMeetings(session),
      ]);
      setCompanies(freshCompanies);
      setMeetingBlocks(freshBlocks);
      setMeetings(freshMeetings);
    }
  };

  // Logs a confirmed outreach outcome from the lead panel. Unlike the
  // optimistic handlers above this waits for the database: the panel only
  // shows "Saved" once the write has actually succeeded, and keeps the form
  // (with an error) when it hasn't.
  const handleSaveOutcome = async (contact: ProjectContact, input: OutcomeInput): Promise<OutcomeResult> => {
    if (input.action !== "do_not_contact" && contact.do_not_contact) return { ok: false, error: "Contact is marked Do Not Contact." };
    if (input.action !== "do_not_contact" && input.action !== "linkedin_accepted" && (contact.needs_research || !isContactProfileCurrent(contact))) return { ok: false, error: "Employer and role verification is required before outreach." };
    if (!session) return { ok: false, error: "You’re signed out. Sign in again to save." };
    const current = progress[contact.id];
    const status: ContactStatus = current?.status ?? "not_contacted";
    const rank = STATUS_ORDER[status];
    const updates: Parameters<typeof updateContactProgress>[2] = {};
    let newStatus: ContactStatus | null = null;
    let channel: "linkedin" | "email" | "phone" | "other" = "other";
    let newEmailPosition: number | null = null;

    switch (input.action) {
      case "linkedin_connection": channel = "linkedin"; if (rank < STATUS_ORDER.connection_sent) newStatus = "connection_sent"; break;
      case "linkedin_accepted": channel = "linkedin"; if (rank < STATUS_ORDER.connection_accepted) newStatus = "connection_accepted"; break;
      case "linkedin_message":
        channel = "linkedin";
        if (rank < STATUS_ORDER.introduction_sent) newStatus = "introduction_sent";
        else if (rank === STATUS_ORDER.introduction_sent) newStatus = "follow_up_sent";
        break;
      case "email": channel = "email"; newEmailPosition = Math.min(3, (current?.email_sequence_position ?? 0) + 1); break;
      case "replied": channel = current?.last_channel ?? "other"; break;
      case "other_contact": channel = "other"; break;
      case "meeting": newStatus = "meeting_set"; channel = current?.last_channel ?? "other"; break;
      case "do_not_contact": newStatus = "do_not_contact"; channel = current?.last_channel ?? "other"; break;
    }
    if (newStatus) updates.status = newStatus;
    if (newEmailPosition !== null) updates.email_sequence_position = newEmailPosition;
    if (followUpSupported) {
      const closing = input.action === "meeting" || input.action === "do_not_contact";
      // An accepted invitation is an inbound signal, not an outbound touch.
      if (input.action !== "linkedin_accepted") {
        updates.last_contacted_at = new Date().toISOString();
        updates.last_channel = channel;
      }
      updates.follow_up_at = closing ? null : input.followUpAt;
      updates.next_action = closing || !input.followUpAt ? null : input.nextAction || null;
    }

    if (Object.keys(updates).length > 0) {
      const saved = await updateContactProgress(session, contact.id, updates, currentTeamMember?.id);
      if (!saved) return { ok: false, error: "Couldn’t save to the database, so nothing was changed. Check your connection and try again." };
      setProgress((c) => ({ ...c, [contact.id]: saved }));
    }

    let warning: string | undefined;
    const recorded = await recordContactActivity(session, contact.id, "outcome_logged", JSON.stringify({ action: input.action, note: input.note, followUpAt: input.followUpAt }), currentTeamMember?.id);
    if (!recorded && (input.note || Object.keys(updates).length === 0)) warning = "Saved, but the note couldn’t be added to the activity log.";
    if (newStatus) logContactActivity(session, contact.id, "status_changed", newStatus, currentTeamMember?.id);
    if (newStatus === "connection_accepted") logContactActivity(session, contact.id, "connection_accepted", "Acceptance confirmed manually", currentTeamMember?.id);
    if (newEmailPosition !== null) logContactActivity(session, contact.id, "email_sequence_changed", String(newEmailPosition), currentTeamMember?.id);

    if (newStatus && ENGAGED_STATUS_VALUES.includes(newStatus)) handleAdvanceEngagement(contact.company_id);
    if (newStatus === "meeting_set") {
      setMeetingPrompt(contact);
      setMeetingDate("");
      setMeetingNotes("");
      const [freshCompanies, freshBlocks, freshMeetings] = await Promise.all([fetchCompanies(session), fetchMeetingBlocks(session), fetchMeetings(session)]);
      setCompanies(freshCompanies);
      setMeetingBlocks(freshBlocks);
      setMeetings(freshMeetings);
    }
    setHistoryVersion((v) => v + 1);
    return { ok: true, warning };
  };

  const handleAssign = async (contact: ProjectContact, assignedTo: string) => {
    if (!session) return;
    const value = assignedTo || null;
    setProgress((current) => ({ ...current, [contact.id]: { ...current[contact.id], contact_id: contact.id, status: current[contact.id]?.status ?? "not_contacted", updated_at: new Date().toISOString(), assigned_to: value } }));
    const saved = await updateContactProgress(session, contact.id, { assigned_to: value }, currentTeamMember?.id);
    if (saved) setProgress((current) => ({ ...current, [contact.id]: saved }));
  };

  // Moves email_sequence_position to an exact value (not just "advance by
  // one") so both "mark as sent" and "undo" are the same call with
  // different targets - keeps this reversible the same way status changes
  // are, without a separate revert code path.
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

  // Called from handleStatusChange when a contact's status is manually set
  // to something that counts as genuine outreach - auto-advances the
  // company out of New Opportunity into Opportunities Engaged (a no-op via
  // advanceCompanyToEngaged once it's already left New Opportunity).
  // Deliberately NOT triggered by copying/sending a message: Chad wants to
  // set status himself before a company gets reclassified, not have
  // copying text to the clipboard imply he actually reached out. Contacts
  // aren't linked to a full Company object, just company_id, so look it up
  // from the companies already in state.
  const handleAdvanceEngagement = async (companyId?: string | null) => {
    if (!session || !companyId) return;
    const company = companies.find((c) => c.id === companyId);
    const updated = await advanceCompanyToEngaged(session, company);
    if (updated) setCompanies((current) => current.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleCopyEmailField = async (contact: ProjectContact, field: string, text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopyFeedback((current) => ({ ...current, [`${contact.id}-${field}`]: "Copied" }));
    setTimeout(() => setCopyFeedback((current) => ({ ...current, [`${contact.id}-${field}`]: label })), 1500);
    if (session) logContactActivity(session, contact.id, "email_message_copied", field, currentTeamMember?.id);
  };

  const handleCopySchedulingLink = async (contactId: string) => {
    if (!currentTeamMember) return;
    await navigator.clipboard.writeText(`${window.location.origin}/schedule/${currentTeamMember.id}`);
    setCopyFeedback((current) => ({ ...current, [`${contactId}-schedule_link`]: "Copied" }));
    setTimeout(() => setCopyFeedback((current) => ({ ...current, [`${contactId}-schedule_link`]: "📅 Copy scheduling link" })), 1500);
  };

  // Opens the rep's own default mail client (or whatever handles mailto:
  // links, e.g. Gmail if they've set that as their browser's default) with
  // To/Subject/Body pre-filled - this is as close to "send from the popup"
  // as a browser app can get without a connected mail-sending backend.
  // Deliberately does NOT auto-mark the stage as sent: opening the compose
  // window isn't the same as actually hitting send, so the rep still
  // confirms via the separate Mark sent button once the email is actually
  // out the door.
  const handleSendEmail = (contact: ProjectContact, field: string, text: string) => {
    const subject = contact.email_subject ?? "";
    const mailto = `mailto:${encodeURIComponent(contact.email ?? "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = mailto;
    if (session) logContactActivity(session, contact.id, "email_send_clicked", field, currentTeamMember?.id);
  };

  const handleOpenMessage = (contact: ProjectContact, field: "linkedin_connect_message" | "intro_message" | "follow_up_message", label: string) => {
    // Signature-line personalization only applies to the intro message -
    // the connection note is too short (300-char LinkedIn cap, already
    // enforced below) to spare a sentence on the rep's own background, and
    // the follow-up is a reminder nudge, not the place to (re-)introduce
    // credibility.
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

  // Replaces whatever personalization sentence is currently in the editor
  // (the static credibility_line match, or nothing) with a freshly
  // AI-drafted one tailored to this contact - inserted the same way
  // personalizeMessage does (its own paragraph, just before the sign-off),
  // and left fully editable afterward since this is a draft to review, not
  // something that goes out unreviewed.
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

  // Shared row renderers for the "My assignments" company groups - a full
  // article for a reachable contact, a lighter search-needed row for one
  // still needing manual research.
  const renderAssignedContactArticle = (contact: ProjectContact) => {
    const contactProgress = progress[contact.id];
    const status = contactProgress?.status ?? "not_contacted";
    const meetingBlock = meetingBlocks[contact.id];
    const isBlocked = Boolean(meetingBlock?.is_blocked);
    return (
      <article key={contact.id} className={`overflow-hidden border-t bg-white ${isBlocked ? "border-primary/40" : "border-rh-line"}`}>
        <div className="grid gap-4 p-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:p-5">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${STATUS_CHART_COLORS[status]}, ${STATUS_CHART_COLORS[status]}CC)` }}
          >
            {getInitials(contact.contact_name)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {contact.email ? (() => {
                const emailPosition = contactProgress?.email_sequence_position ?? 0;
                return (
                  <button
                    type="button"
                    onClick={() => setEmailPopupContact(contact)}
                    title="Email outreach"
                    className="flex items-center gap-1 rounded-full border border-rh-line-strong bg-white px-1.5 py-0.5 text-[#1D4ED8] hover:border-primary hover:text-primary"
                  >
                    <Mail size={12} />
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3].map((dot) => (
                        <span key={dot} className={`h-1.5 w-1.5 rounded-full ${emailPosition >= dot ? "bg-current" : "bg-[#E2E8F0]"}`} />
                      ))}
                    </span>
                  </button>
                );
              })() : null}
              {contact.linkedin_url && contact.linkedin_url.includes("/in/") ? (
                <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="font-display text-lg font-semibold tracking-tight text-foreground hover:text-primary hover:underline">{contact.contact_name}</a>
              ) : (
                <p className="font-display text-lg font-semibold tracking-tight text-foreground">{contact.contact_name}</p>
              )}
            </div>
            <p className="text-sm font-semibold text-primary">{contact.title}</p>
            {contact.email ? <p className="text-sm text-muted-foreground">{contact.email}</p> : null}
          </div>
          {isBlocked ? (
            <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[13px] font-medium text-primary">
              📅 Meeting scheduled with {meetingBlock?.meeting_contact_name}{meetingBlock?.meeting_contact_title ? `, ${meetingBlock.meeting_contact_title}` : ""}
            </span>
          ) : (
            <select value={status} onChange={(e) => handleStatusChange(contact, e.target.value as ContactStatus)} className="h-9 rounded-lg border border-rh-line bg-white px-2 text-xs font-semibold text-rh-body outline-none focus:border-primary">
              {(Object.keys(STATUS_LABELS) as ContactStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          )}
        </div>
        {(() => {
          // Once a contact has moved past a stage, the button for that
          // stage's message stops being useful - you already sent it.
          // Purely derived from the current status (not a separate
          // dismissed flag), so reverting status earlier than the
          // threshold brings the button straight back.
          const statusRank = STATUS_ORDER[status];
          const showConnectionNote = statusRank < STATUS_ORDER.connection_sent;
          const showAfterAccepted = status === "connection_accepted";
          const showFollowUp = status === "introduction_sent";
          const hasAnyButton =
            (contact.linkedin_connect_message && showConnectionNote) ||
            (contact.intro_message && showAfterAccepted) ||
            (contact.follow_up_message && showFollowUp);
          if (isBlocked || !hasAnyButton) return null;
          return (
            <div className="flex flex-wrap items-center gap-2 border-t border-rh-line bg-rh-canvas px-4 py-3 md:px-5">
              {contact.linkedin_connect_message && showConnectionNote ? <button type="button" onClick={() => handleOpenMessage(contact, "linkedin_connect_message", "1. Connection note")} className="rounded-lg border border-rh-line bg-white px-3.5 py-2 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-linkedin_connect_message`] ?? "1. Connection note"}</button> : null}
              {contact.intro_message && showAfterAccepted ? <button type="button" onClick={() => handleOpenMessage(contact, "intro_message", "2. After accepted")} className="rounded-lg border border-rh-line bg-white px-3.5 py-2 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-intro_message`] ?? "2. After accepted"}</button> : null}
              {contact.follow_up_message && showFollowUp ? <button type="button" onClick={() => handleOpenMessage(contact, "follow_up_message", "3. If no response")} className="rounded-lg border border-rh-line bg-white px-3.5 py-2 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary">{copyFeedback[`${contact.id}-follow_up_message`] ?? "3. If no response"}</button> : null}
            </div>
          );
        })()}
      </article>
    );
  };

  const renderAssignedResearchRow = (contact: ProjectContact) => (
    <div key={contact.id} className="flex flex-wrap items-center justify-between gap-2 border border-[#FDE68A] bg-white px-3 py-2">
      <div>
        <span className="font-semibold text-foreground">{contact.contact_name}</span>
        <span className="ml-2 text-sm text-muted-foreground">{contact.title}</span>
      </div>
      <a href={buildLinkedInSearchUrl(contact.contact_name, contact.company)} target="_blank" rel="noreferrer" className="rounded-lg border border-rh-line bg-white px-3 py-1.5 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary">Search LinkedIn</a>
    </div>
  );

  // A contact we CAN reach (real email or LinkedIn profile) but nobody ever
  // drafted a message for - previously these silently rendered as a normal
  // card with a status dropdown and no buttons, which is how Taran Sodhi /
  // Christina Dotchin (and ~69 others) went unnoticed. Surfacing this
  // explicitly is the fix: it can't disappear into a blank card again.
  const renderAssignedNoContentRow = (contact: ProjectContact) => (
    <div key={contact.id} className="flex flex-wrap items-center justify-between gap-2 border border-[#FDE68A] bg-white px-3 py-2">
      <div>
        <span className="font-semibold text-foreground">{contact.contact_name}</span>
        <span className="ml-2 text-sm text-muted-foreground">{contact.title}</span>
        <span className="ml-2 text-xs font-medium text-[#92400E]">No message drafted</span>
      </div>
      {contact.linkedin_url ? (
        <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="rounded-lg border border-rh-line bg-white px-3 py-1.5 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary">View LinkedIn</a>
      ) : null}
    </div>
  );

  // Shared by both the rep "My assignments" view and the owner view -
  // company card first, one primary contact, everyone else behind a
  // dropdown. companyContacts is whatever set of contacts should be
  // considered "at this company" for the given viewer (a rep's full
  // roster there, or an owner's filtered/searched subset).
  const renderCompanyCard = (company: Company, companyContacts: ProjectContact[]) => {
    const primary = getPrimaryContact(companyContacts);
    const others = companyContacts.filter((c) => c.id !== primary?.id);
    const othersGood = others.filter((c) => getContactTier(c) === "email" || getContactTier(c) === "linkedin");
    const othersNoContent = others.filter((c) => getContactTier(c) === "no_content");
    const othersResearch = others.filter((c) => getContactTier(c) === "research");
    const isExpanded = Boolean(expandedCompanies[company.id]);
    const research = getCompanyResearchSummary(companyContacts);

    return (
      <div key={company.id} className="overflow-hidden rounded-2xl border border-rh-line bg-white shadow-sm transition-shadow hover:shadow-md">
        <CompanyInfoCard
          company={company}
          research={research}
          signals={signalsByCompanyId[company.id] ?? []}
          contactCount={companyContacts.length}
          engagedCount={companyContacts.filter((c) => (progress[c.id]?.status ?? "not_contacted") !== "not_contacted").length}
          ownerLeadType={isOwner ? ownerCompanyFields[company.id]?.canonical_lead_type : undefined}
          ownerSignalCount={isOwner ? ownerCompanyFields[company.id]?.signal_count : undefined}
          emailContactCount={companyContacts.filter((c) => c.email).length}
          logoDomain={getCompanyDomain(companyContacts)}
        />
        <div className="flex items-center justify-between border-b border-rh-line bg-rh-canvas px-4 py-2">
          <Link to={`/projects/company/${company.id}`} className="text-[13px] font-medium text-primary hover:underline">View full company page →</Link>
          <CompanyWhyPopover valueHypothesis={research.valueHypothesis} outreachAngle={research.outreachAngle} />
        </div>

        <div className="grid gap-3 p-4">
          {primary ? (
            getContactTier(primary) === "research" ? (
              renderAssignedResearchRow(primary)
            ) : getContactTier(primary) === "no_content" ? (
              renderAssignedNoContentRow(primary)
            ) : (
              renderAssignedContactArticle(primary)
            )
          ) : (
            <p className="text-sm text-muted-foreground">No contacts linked to this company yet.</p>
          )}

          {others.length > 0 ? (
            <button
              type="button"
              onClick={() => toggleCompanyExpanded(company.id)}
              style={{ backgroundColor: "#2c96731a" }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-rh-line px-3 py-2 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary"
            >
              {isExpanded ? "Hide" : "Show"} {others.length} other contact{others.length === 1 ? "" : "s"} {isExpanded ? "▲" : "▼"}
            </button>
          ) : null}

          {isExpanded ? (
            <>
              {othersGood.map((contact) => renderAssignedContactArticle(contact))}

              {othersNoContent.length > 0 ? (
                <div className="border border-[#FDE68A] bg-[#FFFBEB] p-4">
                  <p className="mb-1 text-xs font-medium text-[#92400E]">Missing message content</p>
                  <p className="mb-3 text-sm text-[#92400E]">Reachable, but no LinkedIn or email draft is on file — flag these for a drafting pass.</p>
                  <div className="grid gap-2">
                    {othersNoContent.map((contact) => renderAssignedNoContentRow(contact))}
                  </div>
                </div>
              ) : null}

              {othersResearch.length > 0 ? (
                <div className="border border-[#FDE68A] bg-[#FFFBEB] p-4">
                  <p className="mb-1 text-xs font-medium text-[#92400E]">Additional research needed</p>
                  <p className="mb-3 text-sm text-[#92400E]">These need a manual LinkedIn search — click through and confirm you've found the right person.</p>
                  <div className="grid gap-2">
                    {othersResearch.map((contact) => renderAssignedResearchRow(contact))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    );
  };

  // Same slideout treatment as the site's "Contact Chad" panel - a
  // vertical tab fixed to the right edge that opens into a polished form.
  // Submitting writes straight to the RevHub queue and auto-assigns the
  // new contact to whoever's signed in (see handleAddContact).
  const addContactSlideout = (
    <Sheet open={showAddContact} onOpenChange={setShowAddContact}>

      <SheetContent side="right" className="w-full sm:w-[440px] p-0 border-l border-border bg-background overflow-y-auto z-[201]">
        <div className="px-6 md:px-8 py-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/[0.06] mb-4">
              <UserPlus size={13} className="text-primary" />
              <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-primary font-medium">RevHub outreach</span>
            </div>
            <h2 className="font-display text-[28px] font-semibold text-foreground leading-[1.1] mb-2">
              You'll Be <em className="text-primary not-italic">Credited</em>
            </h2>
            <p className="font-sans text-[13px] text-muted-foreground leading-[1.7]">
              Found a contact we're missing? Add them here — it saves straight to the queue and gets assigned to you.
            </p>
          </div>

          <form onSubmit={handleAddContact} className="space-y-4">
            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                Company <span className="text-primary">*</span>
              </label>
              <input type="text" value={newContactCompany} onChange={(e) => setNewContactCompany(e.target.value)} required maxLength={150} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="Company name" />
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                Contact name <span className="text-primary">*</span>
              </label>
              <input type="text" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} required maxLength={150} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="Full name" />
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Email (if known)</label>
              <input type="email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} maxLength={255} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="name@company.com" />
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">LinkedIn or social profile URL</label>
              <input type="url" value={newContactLinkedIn} onChange={(e) => setNewContactLinkedIn(e.target.value)} maxLength={300} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="https://linkedin.com/in/..." />
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Job title</label>
              <input type="text" value={newContactTitle} onChange={(e) => setNewContactTitle(e.target.value)} maxLength={150} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="e.g. VP Revenue Operations" />
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Industry</label>
              <input type="text" value={newContactIndustry} onChange={(e) => setNewContactIndustry(e.target.value)} maxLength={150} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="e.g. B2B Distribution" />
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Priority tier</label>
              <select value={newContactPriority} onChange={(e) => setNewContactPriority(e.target.value)} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors">
                <option value="">Not sure</option>
                <option value="A">A</option>
                <option value="A/B">A/B</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Why it fits</label>
              <textarea value={newContactValueHypothesis} onChange={(e) => setNewContactValueHypothesis(e.target.value)} rows={2} maxLength={600} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="Why RevHub is a fit for this company/role" />
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Why now</label>
              <textarea value={newContactOutreachAngle} onChange={(e) => setNewContactOutreachAngle(e.target.value)} rows={2} maxLength={600} className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="The buying trigger - why reach out right now" />
            </div>

            <button type="submit" className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-md bg-primary text-primary-foreground font-sans text-[12px] tracking-[0.1em] uppercase font-medium hover:opacity-90 transition-opacity cursor-pointer border-none">
              Save contact
              <UserPlus size={14} />
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Shared between the Member and Owner render branches (mirrors
  // addContactSlideout above) so the popup only needs to be built once.
  const emailPopupModal = emailPopupContact ? (() => {
    const contact = emailPopupContact;
    const contactProgress = progress[contact.id];
    const emailPosition = contactProgress?.email_sequence_position ?? 0;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setEmailPopupContact(null)}>
        <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-lg md:p-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-primary">Email outreach</p>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">{contact.contact_name} · {contact.company}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{contact.email}</p>
            </div>
            {/* At-a-glance progress: one filled dot per stage sent, purely
                derived from email_sequence_position so an undo instantly
                un-fills the dot again. */}
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
              onClick={() => handleCopySchedulingLink(contact.id)}
              className="mt-4 rounded-lg border border-rh-line bg-white px-3 py-1.5 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary"
            >
              {copyFeedback[`${contact.id}-schedule_link`] ?? "📅 Copy scheduling link"}
            </button>
          ) : null}

          {contact.email_subject ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-rh-line bg-rh-canvas px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Subject line</p>
                <p className="truncate text-sm font-semibold text-foreground">{contact.email_subject}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyEmailField(contact, "email_subject", contact.email_subject ?? "", "Copy subject")}
                className="shrink-0 rounded-lg border border-rh-line bg-white px-3 py-1.5 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary"
              >
                {copyFeedback[`${contact.id}-email_subject`] ?? "Copy subject"}
              </button>
            </div>
          ) : null}

          {!EMAIL_SEQUENCE_STAGES.some((stage) => contact[stage.field]) ? (
            <div className="mt-4 rounded-lg border border-dashed border-rh-line-strong bg-rh-canvas p-4 text-sm text-muted-foreground">
              No draft email content is on file for this contact yet (no intro or follow-up messages were generated for them). Add them manually via the message editor, or flag this contact for a research/drafting pass.
            </div>
          ) : null}

          <div className="mt-4 grid gap-3">
            {EMAIL_SEQUENCE_STAGES.map((stage) => {
              const rawText = contact[stage.field];
              if (!rawText) return null;
              // Same reasoning as the LinkedIn intro message - the opening
              // email is where a rep's own credibility line actually earns
              // its place; the follow-ups already reference back to it, so
              // repeating it there would feel redundant rather than
              // personal.
              const personalization = stage.position === 1 ? getPersonalizationLine(currentTeamMember, contact) : null;
              const text = personalizeMessage(rawText, personalization);
              const isSent = emailPosition >= stage.position;
              return (
                <div key={stage.position} className={`rounded-lg border p-3.5 ${isSent ? "border-rh-line bg-rh-canvas" : "border-rh-line bg-white"}`}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium text-primary">{stage.position}. {stage.label}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendEmail(contact, stage.field, text)}
                        className="rounded-lg bg-rh-teal px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-rh-teal-ink hover:opacity-90"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyEmailField(contact, stage.field, text, "Copy")}
                        className="rounded-lg border border-rh-line bg-white px-3 py-1.5 text-[13px] font-medium text-rh-body hover:border-primary hover:text-primary"
                      >
                        {copyFeedback[`${contact.id}-${stage.field}`] ?? "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetEmailPosition(contact, isSent ? stage.position - 1 : stage.position)}
                        className={`rounded-md px-3 py-1.5 text-[13px] font-medium ${isSent ? "border border-rh-line-strong bg-white text-rh-body hover:border-primary hover:text-primary" : "border border-rh-line-strong bg-white text-rh-body hover:border-primary hover:text-primary"}`}
                      >
                        {isSent ? "Undo (mark not sent)" : "Mark as sent"}
                      </button>
                    </div>
                  </div>
                  {isSent ? <p className="mb-2 text-[13px] font-medium text-primary">✓ Marked sent</p> : null}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end">
            <button type="button" onClick={() => setEmailPopupContact(null)} className="rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink">Close</button>
          </div>
        </div>
      </div>
    );
  })() : null;

  // Why each stalled company is stalled, in words (same rules as
  // computeCompanyInsights).
  const stalledReasons = useMemo(() => {
    const out: Record<string, string> = {};
    for (const c of companies) {
      if (!companyInsightsAll[c.id]?.stalled) continue;
      if (c.company_stage === "meeting_scheduled") {
        const age = daysAgo(c.meeting_date);
        out[c.id] = `A meeting was set ${age ?? "several"} days ago and nothing has been logged since.`;
      } else {
        const oldest = Math.max(...(signalsByCompanyId[c.id] ?? []).map((s) => daysAgo(s.posted_date) ?? 0), 0);
        out[c.id] = `Nobody here has been contacted, and the role was posted ${oldest} days ago.`;
      }
    }
    return out;
  }, [companies, companyInsightsAll, signalsByCompanyId]);

  // Assigns (or unassigns) a whole company. Waits for the database and reports
  // whether it really saved, so the UI never shows a hand-off that didn't happen.
  const handleAssignCompany = async (companyId: string, repId: string | null): Promise<boolean> => {
    if (!session) return false;
    const updated = await updateCompanyAssignedRep(session, companyId, repId);
    if (!updated) return false;
    setCompanies((current) => current.map((c) => (c.id === updated.id ? { ...c, assigned_rep: updated.assigned_rep ?? null } : c)));
    return true;
  };

  const repNameById = useMemo(() => Object.fromEntries(teamMembers.map((m) => [m.id, m.name])), [teamMembers]);

  // Owner-only: which of the three plays each company is (cold / full-time
  // role / fractional-or-flexible role). Members never receive lead-type data.
  const tierByCompanyId = useMemo(() => {
    if (!isOwner) return undefined;
    const out: Record<string, LeadTier> = {};
    for (const [id, f] of Object.entries(ownerCompanyFields)) {
      const t = leadTierOf(f.canonical_lead_type);
      if (t) out[id] = t;
    }
    return out;
  }, [isOwner, ownerCompanyFields]);

  // Copies the LinkedIn draft that fits this lead's stage, personalized the same
  // way as the message editor. Never changes status; the rep logs it separately.
  const handleCopyLinkedInDraft = async (contact: ProjectContact): Promise<string | null> => {
    if (contact.do_not_contact || contact.needs_research || !isContactProfileCurrent(contact)) return null;
    const status = progress[contact.id]?.status ?? "not_contacted";
    const pick = suggestedLinkedInDraft(status, contact);
    if (!pick) return null;
    const personalization = pick.field === "intro_message" ? getPersonalizationLine(currentTeamMember, contact) : null;
    const text = personalizeMessage(contact[pick.field], personalization);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return null;
    }
    if (session) logContactActivity(session, contact.id, "message_copied", pick.field, currentTeamMember?.id);
    return pick.label;
  };

  const renderQueue = (mode: "today" | "companies") => session ? (
    <OutreachQueue
      mode={mode}
      key={mode}
      stalledReasons={stalledReasons}
      signalsByCompanyId={signalsByCompanyId}
      repNameById={repNameById}
      tierByCompanyId={tierByCompanyId}
      onCopyLinkedInDraft={handleCopyLinkedInDraft}
      rows={queueRows}
      isLoading={isLoadingData}
      session={session}
      followUpSupported={followUpSupported}
      scopeToggle={isOwner ? { value: queueScope, onChange: setQueueScope } : undefined}
      historyVersion={historyVersion}
      onOpenMessage={handleOpenMessage}
      onOpenEmail={setEmailPopupContact}
      onSaveOutcome={handleSaveOutcome}
      canRequestMore={!isOwner && canRequestMoreCompanies}
      isRequestingBatch={isRequestingBatch}
      onRequestMore={handleRequestMoreCompanies}
    />
  ) : null;

  if (!IS_DB_READY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
        <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Login is not configured.</h1>
        </section>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
        <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
          <p className="mb-3 text-xs font-medium text-primary">RevHub outreach</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">Sign in to continue.</h1>
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
      </div>
    );
  }

  if (mustSetPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
        <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
            <p className="mb-3 text-xs font-medium text-primary">Welcome to RevHub outreach</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">Set your password.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">One last step — choose a password so you can sign back in normally next time.</p>
            <form onSubmit={handleSetPassword} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                New password
                <input type="password" value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} required minLength={6} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" autoComplete="new-password" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Confirm password
                <input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} required minLength={6} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" autoComplete="new-password" />
              </label>
              <button type="submit" disabled={isSettingPassword} className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors disabled:opacity-50">
                {isSettingPassword ? "Saving…" : "Save password"}
              </button>
            </form>
            {passwordSetMessage ? <p className="mt-4 rounded-2xl border border-border p-4 text-sm text-muted-foreground">{passwordSetMessage}</p> : null}
        </section>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-rh-canvas">
        <div>
          <ProjectsSidebar
            isOwner={false}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            memberName={currentTeamMember?.name}
            onSignOut={handleSignOut}
            onAddContact={() => setShowAddContact(true)}
            todayBadge={todayBadge}
          />
          <main className="min-w-0 px-6 pb-20 pt-8 md:ml-56 md:px-10 md:pt-10">
          <div className="w-full">
            {activeSection === "queue" ? (
              renderQueue("today")
            ) : activeSection === "assignments" ? (
              renderQueue("companies")
            ) : activeSection === "profile" ? (
              <>
                <PageHeader title="Profile" subtitle="How you appear in outreach" />
                {renderProfileSection()}
              </>
            ) : (
            <>
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-primary">RevHub outreach</p>
                <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Companies.</h1>
                {currentTeamMember ? (
                  isEditingName ? (
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={currentTeamMember.name}
                        onChange={(e) => setNameInput(e.target.value)}
                        autoFocus
                        className="h-8 rounded-lg border border-rh-line bg-white px-2 text-sm outline-none focus:border-primary"
                      />
                      <button type="button" onClick={handleSaveName} className="text-[13px] font-medium text-primary hover:underline">Save</button>
                      <button type="button" onClick={() => setIsEditingName(false)} className="text-[13px] font-medium text-muted-foreground hover:underline">Cancel</button>
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
            </div>

            {/* Same six numbers regardless of the search/status/priority
                filters below - this is "how is my whole book doing," not
                "how many rows match my current filter." Each tile is also a
                filter shortcut: the four stage tiles set companyStageFilter,
                the two contact tiles set activeFilter (status), and clicking
                an already-active tile clears it back to "all." */}
            <div className="mb-2 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-8">
              <button
                type="button"
                onClick={() => setCompanyStageFilter("all")}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${companyStageFilter === "all" ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: STAGE_TINT_BG.new_signal }}>
                  <Zap size={16} style={{ color: STAGE_CHART_COLORS.new_signal }} />
                </div>
                <p className={`text-2xl font-semibold ${companyStageFilter === "all" ? "text-primary" : "text-foreground"}`}>{myAssignedCompanies.length}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Total opportunities</p>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter(activeFilter === "not_contacted" ? "all" : "not_contacted")}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${activeFilter === "not_contacted" ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#94A3B822]">
                  <UserMinus size={16} className="text-[#64748B]" />
                </div>
                <p className={`text-2xl font-semibold ${activeFilter === "not_contacted" ? "text-primary" : "text-foreground"}`}>{myContactEngagement.notEngaged}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Contacts not engaged</p>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter(activeFilter === "engaged" ? "all" : "engaged")}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${activeFilter === "engaged" ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#2FA37F22]">
                  <UserCheck size={16} className="text-primary" />
                </div>
                <p className={`text-2xl font-semibold ${activeFilter === "engaged" ? "text-primary" : "text-foreground"}`}>{myContactEngagement.engaged}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Contacts engaged</p>
              </button>
              <button
                type="button"
                onClick={() => setCompanyStageFilter(companyStageFilter === "opportunities_engaged" ? "all" : "opportunities_engaged")}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${companyStageFilter === "opportunities_engaged" ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: STAGE_TINT_BG.opportunities_engaged }}>
                  <Send size={16} style={{ color: STAGE_CHART_COLORS.opportunities_engaged }} />
                </div>
                <p className={`text-2xl font-semibold ${companyStageFilter === "opportunities_engaged" ? "text-primary" : "text-foreground"}`}>{myCompanyStageCounts.opportunities_engaged}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Opportunities engaged</p>
              </button>
              <button
                type="button"
                onClick={() => setCompanyStageFilter(companyStageFilter === "meeting_scheduled" ? "all" : "meeting_scheduled")}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${companyStageFilter === "meeting_scheduled" ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: STAGE_TINT_BG.meeting_scheduled }}>
                  <CalendarClock size={16} style={{ color: STAGE_CHART_COLORS.meeting_scheduled }} />
                </div>
                <p className={`text-2xl font-semibold ${companyStageFilter === "meeting_scheduled" ? "text-primary" : "text-foreground"}`}>{myCompanyStageCounts.meeting_scheduled}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Meetings scheduled</p>
              </button>
              <button
                type="button"
                onClick={() => setStalledOnlyFilter((v) => !v)}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${stalledOnlyFilter ? "border-[#B91C1C] bg-[#FEF2F2]" : "border-rh-line bg-white hover:border-[#B91C1C]/40"}`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#B91C1C22]">
                  <AlertTriangle size={16} className="text-[#B91C1C]" />
                </div>
                <p className={`text-2xl font-semibold ${stalledOnlyFilter ? "text-[#B91C1C]" : "text-foreground"}`}>{stalledCountMine}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Stalled</p>
              </button>
              <button
                type="button"
                onClick={() => setCompanyStageFilter(companyStageFilter === "closed_won" ? "all" : "closed_won")}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${companyStageFilter === "closed_won" ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: STAGE_TINT_BG.closed_won }}>
                  <Trophy size={16} style={{ color: STAGE_CHART_COLORS.closed_won }} />
                </div>
                <p className={`text-2xl font-semibold ${companyStageFilter === "closed_won" ? "text-primary" : "text-foreground"}`}>{myCompanyStageCounts.closed_won}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Closed won</p>
              </button>
              <button
                type="button"
                onClick={() => setCompanyStageFilter(companyStageFilter === "closed_lost" ? "all" : "closed_lost")}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${companyStageFilter === "closed_lost" ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: STAGE_TINT_BG.closed_lost }}>
                  <XCircle size={16} style={{ color: STAGE_CHART_COLORS.closed_lost }} />
                </div>
                <p className={`text-2xl font-semibold ${companyStageFilter === "closed_lost" ? "text-primary" : "text-foreground"}`}>{myCompanyStageCounts.closed_lost}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Closed lost</p>
              </button>
            </div>
            {companyStageFilter !== "all" || stalledOnlyFilter ? (
              <div className="mb-8 flex justify-end">
                <button type="button" onClick={() => { setCompanyStageFilter("all"); setStalledOnlyFilter(false); }} className="text-[13px] font-medium text-primary hover:underline">Clear stage filter</button>
              </div>
            ) : (
              <div className="mb-6" />
            )}

            <button type="button" onClick={() => setActiveFilter(activeFilter === "connection_accepted" ? "all" : "connection_accepted")}
              className={`mb-3 rounded-lg border px-4 py-2 text-sm font-medium ${activeFilter === "connection_accepted" ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-rh-line bg-white text-rh-body"}`}>
              Connection accepted · awaiting introduction: <strong>{myAcceptedAwaitingIntroCount}</strong>
            </button>

            {/* Same search/status/priority controls the owner gets - Lead
                Type deliberately isn't here (owner-only data, see
                fetchOwnerCompanyLeadFields). */}
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-rh-line bg-white px-4 py-3 shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, name, or title"
                className="h-10 flex-1 rounded-lg border border-rh-line-strong bg-white px-3 text-sm outline-none focus:border-primary"
              />
              <label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                Status
                <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value as FilterKey)} className="h-10 rounded-lg border border-rh-line-strong bg-white px-2 text-sm font-semibold text-rh-body outline-none focus:border-primary">
                  <option value="all">All</option>
                  <option value="warm_signal">Warm signal</option>
                  <option value="not_contacted">Not Contacted</option>
                  <option value="engaged">Engaged</option>
                  <option value="connection_sent">Connection Sent</option>
                   <option value="connection_accepted">Connection Accepted · Intro Pending</option>
                  <option value="introduction_sent">Introduction Sent</option>
                  <option value="follow_up_sent">Follow-Up Sent</option>
                  <option value="meeting_set">Meetings set</option>
                  <option value="needs_research">Need research</option>
                </select>
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                Priority
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="h-10 rounded-lg border border-rh-line-strong bg-white px-2 text-sm font-semibold text-rh-body outline-none focus:border-primary">
                  <option value="all">All</option>
                  <option value="A">A</option>
                  <option value="A/B">A/B</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </label>
              {activeFilter !== "all" || priorityFilter !== "all" || companyStageFilter !== "all" ? (
                <button
                  type="button"
                  onClick={() => { setActiveFilter("all"); setPriorityFilter("all"); setCompanyStageFilter("all"); }}
                  className="text-[13px] font-medium text-primary hover:underline"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            {isLoadingData ? <p className="text-sm text-muted-foreground">Loading your assignments…</p> : null}

            {!isLoadingData && myAssignedCompanies.length === 0 ? (
              <p className="text-sm text-muted-foreground">{isRequestingBatch ? "Getting your first batch of companies…" : "No companies assigned yet."}</p>
            ) : null}

            {!isLoadingData && myAssignedCompanies.length > 0 && myFilteredCompanyGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contacts match the current filters.</p>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              {myFilteredCompanyGroups.slice(0, memberVisibleCount).map(({ company, matchingContacts }) => renderCompanyCard(company, matchingContacts))}
            </div>
            {memberVisibleCount < myFilteredCompanyGroups.length ? <div ref={memberSentinelRef} className="h-1" /> : null}

            {myAssignedCompanies.length > 0 ? (
              <div className="mt-6 flex justify-center">
                <button type="button" onClick={handleRequestMoreCompanies} disabled={!canRequestMoreCompanies || isRequestingBatch} className="rounded-lg bg-rh-teal px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-rh-teal-ink disabled:opacity-40">
                  {isRequestingBatch ? "Getting more…" : canRequestMoreCompanies ? "Send me more companies" : "Work through your current list first"}
                </button>
              </div>
            ) : null}
            </>
            )}
          </div>
          </main>
        </div>

        {addContactSlideout}

        {meetingPrompt ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
              <p className="text-xs font-medium text-primary">Log this meeting</p>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">{meetingPrompt.contact_name} · {meetingPrompt.company}</h2>
              <p className="mt-2 text-sm text-muted-foreground">This records who set the meeting, so it's easy to sort out attribution later.</p>
              <div className="mt-4 grid gap-3">
                <label className="grid gap-1.5 text-[13px] font-medium text-rh-ink">
                  Meeting date
                  <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} required className="rounded-lg border border-rh-line bg-white px-3 py-2 text-[13px] text-rh-ink hover:border-rh-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70" />
                </label>
                <label className="grid gap-1.5 text-[13px] font-medium text-rh-ink">
                  Notes (optional)
                  <textarea value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)} rows={3} className="rounded-lg border border-rh-line bg-white px-3 py-2 text-[13px] text-rh-ink hover:border-rh-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70" />
                </label>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setMeetingPrompt(null)} className="rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink">Skip</button>
                <button type="button" onClick={handleSaveMeeting} disabled={!meetingDate} className="rounded-lg bg-rh-teal px-4 py-2 text-[13px] font-semibold text-white hover:bg-rh-teal-ink disabled:opacity-50">Save meeting</button>
              </div>
            </div>
          </div>
        ) : null}

        {emailPopupModal}

        {messageEditor ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-lg md:p-8">
              <p className="text-xs font-medium text-primary">{messageEditor.label}</p>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">{messageEditor.contact.contact_name} · {messageEditor.contact.company}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Feel free to edit this before copying — it's just a starting point.</p>

              {messageEditor.contact.value_hypothesis || messageEditor.contact.outreach_angle ? (
                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/[0.04] p-4">
                  <p className="mb-1.5 text-xs font-medium text-primary">Context for this message</p>
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
                    className="rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink hover:border-primary hover:text-primary disabled:opacity-50"
                  >
                    {isDraftingAILine ? "Drafting…" : "✨ AI-personalize"}
                  </button>
                ) : null}
                {currentTeamMember?.google_calendar_connected ? (
                  <button
                    type="button"
                    onClick={() => handleCopySchedulingLink(messageEditor.contact.id)}
                    className="rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink hover:border-primary hover:text-primary"
                  >
                    {copyFeedback[`${messageEditor.contact.id}-schedule_link`] ?? "📅 Copy scheduling link"}
                  </button>
                ) : null}
                <button type="button" onClick={() => setMessageEditor(null)} className="rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink">Cancel</button>
                <button type="button" onClick={handleCopyFromEditor} className="rounded-lg bg-rh-teal px-4 py-2 text-[13px] font-semibold text-white hover:bg-rh-teal-ink">Copy</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rh-canvas">
      <div>
        <ProjectsSidebar
          isOwner={isOwner}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          memberName={currentTeamMember?.name}
          onSignOut={handleSignOut}
          onAddContact={() => setShowAddContact(true)}
          todayBadge={todayBadge}
        />
        <main className="min-w-0 px-6 pb-20 pt-8 md:ml-56 md:px-10 md:pt-10">
          <div className="w-full">
            {activeSection === "queue" ? renderQueue("today") : null}
            {activeSection === "assignments" ? renderQueue("companies") : null}
            {activeSection !== "queue" && activeSection !== "assignments" ? (
              <PageHeader
                title={activeSection === "board" ? "Lead assignment" : activeSection === "team" ? "Team" : activeSection === "profile" ? "Profile" : "Classic company view"}
                subtitle={activeSection === "board" ? "Hand companies to reps. The ones closest to going cold come first." : activeSection === "team" ? "Roles, pipeline by person, meetings and closed deals" : activeSection === "profile" ? "How you appear in outreach" : "The previous layout, kept for reference"}
              />
            ) : null}

          {activeSection === "profile" ? renderProfileSection() : null}

          {activeSection === "board" ? (
            <CompanyBoard companies={companies} contacts={contacts} progress={progress} signalsByCompanyId={signalsByCompanyId} teamMembers={teamMembers} teamMembersWithLogin={teamMembersWithLogin} tierByCompanyId={tierByCompanyId} onAssign={handleAssignCompany} />
          ) : null}

          {activeSection === "team" ? (
            <TeamSection
              teamMembers={teamMembers}
              teamMembersWithLogin={teamMembersWithLogin}
              statusCountsByMember={statusCountsByMember}
              meetings={meetings}
              closedDeals={closedDeals}
              contacts={contacts}
              onChangeRole={handleChangeRole}
              deal={{ company: dealCompany, creditedTo: dealCreditedTo, date: dealDate, notes: dealNotes }}
              onDealChange={(patch) => {
                if (patch.company !== undefined) setDealCompany(patch.company);
                if (patch.creditedTo !== undefined) setDealCreditedTo(patch.creditedTo);
                if (patch.date !== undefined) setDealDate(patch.date);
                if (patch.notes !== undefined) setDealNotes(patch.notes);
              }}
              onSaveDeal={handleSaveClosedDeal}
            />
          ) : null}

          {activeSection === "classic" ? (
          <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-primary">Company penetration</p>
            {companyStageFilter !== "all" || stalledOnlyFilter ? (
              <button type="button" onClick={() => { setCompanyStageFilter("all"); setStalledOnlyFilter(false); }} className="text-[13px] font-medium text-primary hover:underline">Clear stage filter</button>
            ) : null}
          </div>
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-7">
            {(Object.keys(COMPANY_STAGE_LABELS) as CompanyStage[]).slice(0, 3).map((stage) => {
              const isActive = companyStageFilter === stage;
              const Icon = STAGE_ICON[stage];
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setCompanyStageFilter(isActive ? "all" : stage)}
                  className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${isActive ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
                >
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: STAGE_TINT_BG[stage] }}>
                    <Icon size={16} style={{ color: STAGE_CHART_COLORS[stage] }} />
                  </div>
                  <p className={`text-2xl font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{companyStageCounts[stage]}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{COMPANY_STAGE_LABELS[stage]}</p>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setStalledOnlyFilter((v) => !v)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${stalledOnlyFilter ? "border-[#B91C1C] bg-[#FEF2F2]" : "border-rh-line bg-white hover:border-[#B91C1C]/40"}`}
            >
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#B91C1C22]">
                <AlertTriangle size={16} className="text-[#B91C1C]" />
              </div>
              <p className={`text-2xl font-semibold ${stalledOnlyFilter ? "text-[#B91C1C]" : "text-foreground"}`}>{stalledCountAll}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Stalled</p>
            </button>
            {(Object.keys(COMPANY_STAGE_LABELS) as CompanyStage[]).slice(3).map((stage) => {
              const isActive = companyStageFilter === stage;
              const Icon = STAGE_ICON[stage];
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setCompanyStageFilter(isActive ? "all" : stage)}
                  className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${isActive ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
                >
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: STAGE_TINT_BG[stage] }}>
                    <Icon size={16} style={{ color: STAGE_CHART_COLORS[stage] }} />
                  </div>
                  <p className={`text-2xl font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{companyStageCounts[stage]}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{COMPANY_STAGE_LABELS[stage]}</p>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setShowCharts((v) => !v)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${showCharts ? "border-primary bg-primary/5" : "border-rh-line bg-white hover:border-primary/40"}`}
            >
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 size={16} className="text-primary" />
              </div>
              <p className={`text-2xl font-semibold ${showCharts ? "text-primary" : "text-foreground"}`}>{showCharts ? "▲" : "▼"}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{showCharts ? "Hide charts" : "Show charts"}</p>
            </button>
          </div>

          {showCharts ? (
          <>
          <div className="mb-8 grid gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-rh-line bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Companies by stage</p>
              {companyStagePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={companyStagePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${entry.name}: ${entry.value}`}>
                      {companyStagePieData.map((row) => <Cell key={row.name} fill={row.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">No companies yet.</p>
              )}
            </div>

            <div className="rounded-2xl border border-rh-line bg-white p-4 shadow-sm lg:col-span-2">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Companies by stage, per rep</p>
              {companiesByRepStage.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={companiesByRepStage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend formatter={(value) => COMPANY_STAGE_LABELS[value as CompanyStage] ?? value} />
                    {(Object.keys(COMPANY_STAGE_LABELS) as CompanyStage[]).map((stage) => (
                      <Bar key={stage} dataKey={stage} stackId="stage" fill={STAGE_CHART_COLORS[stage]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">No team members yet.</p>
              )}
            </div>

            <div className="rounded-2xl border border-rh-line bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Contacts by status</p>
              {contactStatusPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={contactStatusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${entry.name}: ${entry.value}`}>
                      {contactStatusPieData.map((row) => <Cell key={row.name} fill={row.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">No contacts yet.</p>
              )}
            </div>
          </div>
          </>
          ) : null}

          <button type="button" onClick={() => setActiveFilter(activeFilter === "connection_accepted" ? "all" : "connection_accepted")}
            className={`mb-3 rounded-lg border px-4 py-2 text-sm font-medium ${activeFilter === "connection_accepted" ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-rh-line bg-white text-rh-body"}`}>
            Connection accepted · awaiting introduction: <strong>{acceptedAwaitingIntroCount}</strong>
          </button>
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-rh-line bg-white px-4 py-3 shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, name, or title"
              className="h-10 flex-1 rounded-lg border border-rh-line-strong bg-white px-3 text-sm outline-none focus:border-primary"
            />
            <label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              Status
              <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value as FilterKey)} className="h-10 rounded-lg border border-rh-line-strong bg-white px-2 text-sm font-semibold text-rh-body outline-none focus:border-primary">
                <option value="all">All</option>
                <option value="warm_signal">Warm signal</option>
                <option value="not_contacted">Not Contacted</option>
                <option value="engaged">Engaged</option>
                <option value="connection_sent">Connection Sent</option>
                   <option value="connection_accepted">Connection Accepted · Intro Pending</option>
                <option value="introduction_sent">Introduction Sent</option>
                <option value="follow_up_sent">Follow-Up Sent</option>
                <option value="meeting_set">Meetings set</option>
                <option value="needs_research">Need research</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              Priority
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="h-10 rounded-lg border border-rh-line-strong bg-white px-2 text-sm font-semibold text-rh-body outline-none focus:border-primary">
                <option value="all">All</option>
                <option value="A">A</option>
                <option value="A/B">A/B</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </label>
            {/* Owner-only: the data behind this never reaches a Member's
                session in the first place (see fetchOwnerCompanyLeadFields),
                so there's no separate "hide for members" check needed here -
                this whole search/filter bar only renders on the owner
                return branch above. */}
            <label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              Lead type
              <select
                value={leadTypeFilter}
                onChange={(e) => setLeadTypeFilter(e.target.value as OwnerLeadType | "all")}
                className="h-10 rounded-lg border border-rh-line-strong bg-white px-2 text-sm font-semibold text-rh-body outline-none focus:border-primary"
              >
                <option value="all">All Lead Types</option>
                {OWNER_LEAD_TYPE_FILTER_ORDER.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            {activeFilter !== "all" || priorityFilter !== "all" || leadTypeFilter !== "all" ? (
              <button
                type="button"
                onClick={() => { setActiveFilter("all"); setPriorityFilter("all"); setLeadTypeFilter("all"); }}
                className="text-[13px] font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {isLoadingData ? (
            <p className="text-sm text-muted-foreground">Loading contacts…</p>
          ) : ownerCompanyGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contacts match the current filters.</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              {ownerCompanyGroups.slice(0, ownerVisibleCount).map(({ company, matchingContacts }) => renderCompanyCard(company, matchingContacts))}
            </div>
          )}
          {ownerVisibleCount < ownerCompanyGroups.length ? <div ref={ownerSentinelRef} className="h-1" /> : null}
          {ownerCompanyGroups.length > 0 ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Showing {Math.min(ownerVisibleCount, ownerCompanyGroups.length)} of {ownerCompanyGroups.length} companies{ownerVisibleCount < ownerCompanyGroups.length ? " — scroll for more" : ""}
            </p>
          ) : null}
          </>
          ) : null}
          </div>
        </main>
      </div>

      {meetingPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
            <p className="text-xs font-medium text-primary">Log this meeting</p>
            <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">{meetingPrompt.contact_name} · {meetingPrompt.company}</h2>
            <p className="mt-2 text-sm text-muted-foreground">This records who set the meeting, so it's easy to sort out attribution later.</p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1.5 text-[13px] font-medium text-rh-ink">
                Meeting date
                <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} required className="rounded-lg border border-rh-line bg-white px-3 py-2 text-[13px] text-rh-ink hover:border-rh-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70" />
              </label>
              <label className="grid gap-1.5 text-[13px] font-medium text-rh-ink">
                Notes (optional)
                <textarea value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)} rows={3} className="rounded-lg border border-rh-line bg-white px-3 py-2 text-[13px] text-rh-ink hover:border-rh-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70" />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setMeetingPrompt(null)} className="rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink">Skip</button>
              <button type="button" onClick={handleSaveMeeting} disabled={!meetingDate} className="rounded-lg bg-rh-teal px-4 py-2 text-[13px] font-semibold text-white hover:bg-rh-teal-ink disabled:opacity-50">Save meeting</button>
            </div>
          </div>
        </div>
      ) : null}

      {addContactSlideout}

      {emailPopupModal}

      {messageEditor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-lg">
            <p className="text-xs font-medium text-primary">{messageEditor.label}</p>
            <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">{messageEditor.contact.contact_name} · {messageEditor.contact.company}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Feel free to edit this before copying — it's just a starting point.</p>
            <textarea
              value={messageEditor.text}
              onChange={(e) => setMessageEditor((current) => (current ? { ...current, text: e.target.value } : current))}
              rows={6}
              className="mt-4 w-full rounded-lg border border-rh-line bg-white px-3 py-2 text-[13px] text-rh-ink hover:border-rh-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70"
            />
            {messageEditor.field === "linkedin_connect_message" ? (
              <p className={`mt-1 text-xs ${messageEditor.text.length > 300 ? "font-semibold text-[#B45309]" : "text-muted-foreground"}`}>
                {messageEditor.text.length}/300 characters {messageEditor.text.length > 300 ? "— over LinkedIn's connection note limit" : ""}
              </p>
            ) : null}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setMessageEditor(null)} className="rounded-lg border border-rh-line bg-white px-4 py-2 text-[13px] font-medium text-rh-ink">Cancel</button>
              <button type="button" onClick={handleCopyFromEditor} className="rounded-lg bg-rh-teal px-4 py-2 text-[13px] font-semibold text-white hover:bg-rh-teal-ink">Copy</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProjectsPage;
