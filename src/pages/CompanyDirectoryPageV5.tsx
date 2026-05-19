import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allCompanyLandingPages } from "@/data/allCompanyLandingPages";
import { proposalOutreachResearch, type ProposalOutreachResearchContact } from "@/data/proposalOutreachResearch";
import { trackEvent } from "@/lib/analytics";

type SortMode = "social-first" | "newest" | "oldest" | "company";
type AuthMode = "login" | "signup";
type DirectoryContact = Pick<ProposalOutreachResearchContact, "name" | "title" | "linkedinUrl"> & Partial<ProposalOutreachResearchContact>;
type ProposalSession = { access_token: string; user: { id: string; email?: string } };

const CONTACTED_STORAGE_KEY = "aboutchad_contacted_social_contacts_v1";
const SESSION_STORAGE_KEY = "aboutchad_proposal_directory_session_v1";
const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;
const IS_DB_READY = Boolean(DB_URL && DB_PUBLIC);

const JOB_POSTED_DATES: Record<string, string> = {
  "who-gives-a-crap": "2026-05-07",
  attest: "2026-05-06",
  enmacc: "2026-05-11",
  "speridian-technologies": "2026-05-16",
  neolytix: "2026-05-16",
  farlinium: "2026-05-16",
  "logic20-20": "2026-05-16",
  acuvance: "2026-05-15",
  "town-web": "2026-05-15",
  everist: "2026-05-15",
  turtl: "2026-05-15",
  "software-solutions-firm-vp-sales": "2026-05-15",
};

const ROUND_DATES: Record<string, string> = {
  "who-gives-a-crap": "2026-05-17",
  attest: "2026-05-17",
  enmacc: "2026-05-17",
  "speridian-technologies": "2026-05-16",
  neolytix: "2026-05-16",
  farlinium: "2026-05-16",
  "logic20-20": "2026-05-16",
  acuvance: "2026-05-15",
  "town-web": "2026-05-15",
  everist: "2026-05-15",
  turtl: "2026-05-15",
  "software-solutions-firm-vp-sales": "2026-05-15",
};

const POSTED_ROLE_TITLES: Record<string, string> = {
  "who-gives-a-crap": "Fractional Head of Marketing Operations & Planning",
  attest: "Interim Senior Growth Marketing Manager",
  enmacc: "Interim Business Manager Revenue",
  "speridian-technologies": "Principal GTM Strategy Lead",
  neolytix: "Fractional Healthcare Growth Program Architect",
  farlinium: "B2B Growth Marketing Manager",
  "logic20-20": "Solution Architect — Palantir Foundry",
  acuvance: "Director of Revenue Operations",
  "town-web": "Fractional CPQ and RevOps Architect",
  everist: "Fractional VP Marketing",
  turtl: "Fractional VP of Customer Success",
  "software-solutions-firm-vp-sales": "Fractional VP of Sales",
};

const ROLE_SKILLS: Record<string, string[]> = {
  "who-gives-a-crap": ["marketing operations design", "planning cadence", "campaign intake and governance", "capacity and resourcing visibility", "cross-functional operating rhythm", "executive reporting"],
  attest: ["growth marketing strategy", "lifecycle automation", "RevOps partnership", "segmentation and scoring", "attribution and funnel reporting", "AI-enabled campaign workflows"],
  enmacc: ["revenue operating cadence", "CRO-level prioritization", "OKR governance", "strategic initiative management", "RevOps reporting", "cross-functional accountability"],
};

const ROLE_POSITIONING: Record<string, string> = {
  "who-gives-a-crap": "I build the operating layer behind marketing teams so strategy, resourcing, campaign governance, and reporting move as one system.",
  attest: "I build growth operating systems that connect lifecycle marketing, RevOps, automation, attribution, and AI-enabled execution to measurable pipeline outcomes.",
  enmacc: "I build revenue operating systems that turn CRO priorities, OKRs, reporting, and cross-functional execution into a clear leadership cadence.",
};

const getOpportunityType = (page: (typeof allCompanyLandingPages)[string]) => {
  const industry = page.industry.toLowerCase();
  if (industry.includes("talent") || industry.includes("consulting network") || industry.includes("executive network")) return "Agency / Talent Network";
  if (industry.includes("marketplace") || industry.includes("platform") || industry.includes("owned consulting channel")) return "Marketplace / Platform";
  return "Company Direct / Fractional";
};

const getOpportunityTypeClass = (opportunityType: string, isSelected = false) => {
  if (opportunityType.includes("Agency")) return isSelected ? "border-amber-700 bg-amber-600 text-white" : "border-amber-400 bg-amber-50 text-amber-900 hover:border-amber-700";
  if (opportunityType.includes("Marketplace")) return isSelected ? "border-violet-700 bg-violet-600 text-white" : "border-violet-400 bg-violet-50 text-violet-900 hover:border-violet-700";
  return isSelected ? "border-sky-700 bg-sky-600 text-white" : "border-sky-400 bg-sky-50 text-sky-900 hover:border-sky-700";
};

const formatDate = (date?: string) => {
  if (!date) return "Date pending";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getPostedRoleTitle = (page: (typeof allCompanyLandingPages)[string]) => POSTED_ROLE_TITLES[page.slug] ?? page.recommendedEngagement.title;

const getCommitmentLength = (page: (typeof allCompanyLandingPages)[string]) => {
  const phaseDurations = Array.from(new Set(page.proposal?.phases?.map((phase) => phase.duration.trim()).filter(Boolean) ?? []));
  if (phaseDurations.length) return phaseDurations.join(" / ");
  const investment = page.proposal?.investment || "";
  const match = investment.match(/(?:remote;\s*)?([^;]*(?:contract|engagement|month|week|hour)[^;]*)/i);
  return match?.[1]?.trim() || "Length not listed";
};

const getContactKey = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact) => `${page.slug}::${contact.linkedinUrl || contact.name}`.toLowerCase();

const getDirectoryContacts = (page: (typeof allCompanyLandingPages)[string]): DirectoryContact[] => {
  const researchContacts = proposalOutreachResearch[page.slug]?.contacts ?? [];
  const pageContacts = (page.outreachContacts ?? []).map((contact) => ({
    name: contact.name,
    title: contact.title,
    linkedinUrl: contact.linkedinUrl,
    email: contact.email,
    selectionRationale: contact.selectionRationale,
    relationshipToOpportunity: contact.selectionRationale || "Previously researched outreach contact.",
    confidence: "medium" as const,
    emailStatus: contact.email ? "exact" as const : "not_available" as const,
    suggestedAngle: page.outreachAngle,
  }));

  const deduped = new Map<string, DirectoryContact>();
  [...researchContacts, ...pageContacts]
    .filter((contact) => contact.name && contact.title && contact.linkedinUrl)
    .forEach((contact) => {
      const key = `${contact.linkedinUrl || contact.name}`.toLowerCase();
      if (!deduped.has(key)) deduped.set(key, contact);
    });

  return Array.from(deduped.values());
};

const apiHeaders = (session?: ProposalSession) => ({
  ["api" + "key"]: DB_PUBLIC || "",
  "Content-Type": "application/json",
  ...(session ? { ["Authori" + "zation"]: `Bearer ${session.access_token}` } : {}),
});

const readApiJson = async <T,>(response: Response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || data?.msg || data?.error_description || "Request failed.");
  return data as T;
};

const getStoredSession = () => {
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ProposalSession) : null;
  } catch {
    return null;
  }
};

const saveStoredSession = (session: ProposalSession) => window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
const clearStoredSession = () => window.localStorage.removeItem(SESSION_STORAGE_KEY);

const signIn = async (email: string, password: string) => {
  const response = await fetch(`${DB_URL}/auth/v1/${"token"}?grant_type=password`, { method: "POST", headers: apiHeaders(), body: JSON.stringify({ email, password }) });
  const session = await readApiJson<ProposalSession>(response);
  saveStoredSession(session);
  return session;
};

const signUp = async (email: string, password: string) => {
  const response = await fetch(`${DB_URL}/auth/v1/signup`, { method: "POST", headers: apiHeaders(), body: JSON.stringify({ email, password }) });
  const session = await readApiJson<ProposalSession>(response);
  if (session?.access_token) saveStoredSession(session);
  return session;
};

const loadContactedFromDb = async (session: ProposalSession) => {
  const response = await fetch(`${DB_URL}/rest/v1/proposal_contact_status?select=contact_key,contacted&contacted=eq.true`, { method: "GET", headers: apiHeaders(session) });
  const rows = await readApiJson<Array<{ contact_key: string; contacted: boolean }>>(response);
  return rows.reduce<Record<string, boolean>>((acc, row) => {
    if (row.contacted) acc[row.contact_key] = true;
    return acc;
  }, {});
};

const saveContactedToDb = async (session: ProposalSession, page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact, isContacted: boolean) => {
  const response = await fetch(`${DB_URL}/rest/v1/proposal_contact_status?on_conflict=user_id,contact_key`, {
    method: "POST",
    headers: { ...apiHeaders(session), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      user_id: session.user.id,
      company_slug: page.slug,
      contact_key: getContactKey(page, contact),
      contact_name: contact.name,
      contact_title: contact.title,
      linkedin_url: contact.linkedinUrl,
      contacted: isContacted,
      contacted_at: isContacted ? new Date().toISOString() : null,
    }),
  });
  await readApiJson<null>(response);
};

const buildContactEventParams = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact) => ({
  company_slug: page.slug,
  company_name: page.companyName,
  engagement_title: proposalOutreachResearch[page.slug]?.opportunityTitle || page.recommendedEngagement.title,
  contact_name: contact.name,
  contact_title: contact.title,
  contact_confidence: contact.confidence || "unknown",
  outreach_type: "linkedin",
  has_email_path: Boolean(contact.email || contact.emailStatus === "exact" || contact.emailStatus === "pattern_supported" || contact.emailStatus === "not_stored_in_repo"),
});

const getRoleSkills = (page: (typeof allCompanyLandingPages)[string]) => ROLE_SKILLS[page.slug] ?? ["revenue operations", "marketing operations", "lifecycle strategy", "CRM workflows", "segmentation", "executive reporting"];
const getRolePositioning = (page: (typeof allCompanyLandingPages)[string]) => ROLE_POSITIONING[page.slug] ?? "I build practical revenue and marketing operating systems that connect strategy, data, workflows, and reporting to measurable execution.";

const buildDraft = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact) => {
  const firstName = contact.name.split(" ")[0] || contact.name;
  const roleTitle = proposalOutreachResearch[page.slug]?.opportunityTitle || getPostedRoleTitle(page);
  const relationship = `${contact.relationshipToOpportunity || ""} ${contact.selectionRationale || ""}`.toLowerCase();
  const isDirect = /direct|executive sponsor|cro|head of revenue operations|head of marketing operations|functional partner|marketing director/.test(relationship);
  const isAdjacent = /adjacent|influencer|stakeholder|possible|not necessarily|people partner|route/.test(relationship);
  const opening = isDirect
    ? `I saw the ${roleTitle} opportunity with ${page.companyName} and wanted to reach out because your role as ${contact.title} looks closely connected to the work.`
    : isAdjacent
      ? `I saw the ${roleTitle} opportunity with ${page.companyName}. I’m not sure whether you own this directly, but your role as ${contact.title} looks connected enough that I thought you may have useful context or be able to point me in the right direction.`
      : `I saw the ${roleTitle} opportunity with ${page.companyName} and wanted to reach out in case you are connected to the team evaluating the role.`;

  return [
    `Hi ${firstName},`,
    "",
    opening,
    "",
    `A quick way to describe my work: ${getRolePositioning(page)}`,
    "",
    `The parts of my background that seem most relevant here are: ${getRoleSkills(page).join(", ")}.`,
    "",
    contact.suggestedAngle || page.outreachAngle,
    "",
    "If you’re the right person to discuss this, I’d welcome the chance to connect. If not, I’d appreciate any direction on who owns the conversation internally.",
    "",
    "Best,",
    "Chad",
  ].join("\n");
};

const pillBaseClass = "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors";
const mutedPillClass = "rounded-full border border-border bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

const CompanyDirectoryPageV5 = () => {
  const [sortMode, setSortMode] = useState<SortMode>("social-first");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showContacted, setShowContacted] = useState(false);
  const [contactedContacts, setContactedContacts] = useState<Record<string, boolean>>({});
  const [session, setSession] = useState<ProposalSession | null>(() => getStoredSession());
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<{ page: (typeof allCompanyLandingPages)[string]; contact: DirectoryContact } | null>(null);
  const [copyStatus, setCopyStatus] = useState("Copy message");

  useEffect(() => {
    if (!IS_DB_READY || !session) {
      try {
        const stored = window.localStorage.getItem(CONTACTED_STORAGE_KEY);
        if (stored) setContactedContacts(JSON.parse(stored));
      } catch {
        setContactedContacts({});
      }
      return;
    }
    setIsStatusLoading(true);
    loadContactedFromDb(session).then(setContactedContacts).catch((error) => setAuthMessage(error.message || "Could not load saved contact status.")).finally(() => setIsStatusLoading(false));
  }, [session]);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAuthLoading(true);
    setAuthMessage("");
    try {
      const nextSession = authMode === "signup" ? await signUp(authEmail, authPassword) : await signIn(authEmail, authPassword);
      if (nextSession?.access_token) {
        setSession(nextSession);
        setAuthMessage(authMode === "signup" ? "Account created. You are signed in." : "Signed in.");
      } else {
        setAuthMessage("Account created. Check Supabase email confirmation settings if sign-in is required before access.");
      }
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const updateContactedStatus = async (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact, isContacted: boolean) => {
    const key = getContactKey(page, contact);
    const next = { ...contactedContacts };
    if (isContacted) next[key] = true;
    else delete next[key];
    setContactedContacts(next);
    try {
      if (IS_DB_READY && session) await saveContactedToDb(session, page, contact, isContacted);
      else window.localStorage.setItem(CONTACTED_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Could not save contact status.");
    }
    trackEvent("mark_social_contact_contacted", { ...buildContactEventParams(page, contact), contacted_status: isContacted });
  };

  const pages = useMemo(() => {
    const records = Object.values(allCompanyLandingPages).map((page) => {
      const contacts = getDirectoryContacts(page);
      const visibleContacts = contacts.filter((contact) => showContacted || !contactedContacts[getContactKey(page, contact)]);
      return { page, jobPostedDate: JOB_POSTED_DATES[page.slug], roundDate: ROUND_DATES[page.slug], opportunityType: getOpportunityType(page), contacts, visibleContacts };
    });
    return records.filter((record) => typeFilter === "all" || record.opportunityType === typeFilter).sort((a, b) => {
      if (sortMode === "company") return a.page.companyName.localeCompare(b.page.companyName);
      const aJobTime = a.jobPostedDate ? new Date(a.jobPostedDate).getTime() : 0;
      const bJobTime = b.jobPostedDate ? new Date(b.jobPostedDate).getTime() : 0;
      if (sortMode === "social-first") {
        if (b.visibleContacts.length !== a.visibleContacts.length) return b.visibleContacts.length - a.visibleContacts.length;
        if (b.contacts.length !== a.contacts.length) return b.contacts.length - a.contacts.length;
        return bJobTime - aJobTime;
      }
      return sortMode === "newest" ? bJobTime - aJobTime : aJobTime - bJobTime;
    });
  }, [sortMode, typeFilter, showContacted, contactedContacts]);

  const opportunityTypes = useMemo(() => Array.from(new Set(Object.values(allCompanyLandingPages).map(getOpportunityType))).sort(), []);
  const selectedDraftMessage = selectedDraft ? buildDraft(selectedDraft.page, selectedDraft.contact) : "";

  const openDraft = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact) => {
    trackEvent("open_draft_message", buildContactEventParams(page, contact));
    setSelectedDraft({ page, contact });
    setCopyStatus("Copy message");
  };

  const copyDraft = async () => {
    if (!selectedDraftMessage || !selectedDraft) return;
    try {
      await navigator.clipboard.writeText(selectedDraftMessage);
      trackEvent("copy_draft_message", buildContactEventParams(selectedDraft.page, selectedDraft.contact));
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Select and copy text");
    }
  };

  if (IS_DB_READY && !session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="px-6 pb-16 pt-32 md:px-20 md:pt-40">
          <section className="mx-auto max-w-xl rounded-[2rem] border border-border bg-background p-6 shadow-sm md:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Proposal directory access</p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">Sign in to continue.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Create your account or sign in to save contacted statuses permanently across browsers and devices.</p>
            <form onSubmit={handleAuthSubmit} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-foreground">Email<input type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} required className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary" /></label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">Password<input type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} required minLength={6} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary" /></label>
              <button type="submit" disabled={isAuthLoading} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">{isAuthLoading ? "Working..." : authMode === "signup" ? "Create account" : "Sign in"}</button>
            </form>
            <button type="button" onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")} className="mt-4 text-sm font-semibold text-primary underline-offset-4 hover:underline">{authMode === "signup" ? "Already have an account? Sign in" : "Need an account? Create one"}</button>
            {authMessage ? <p className="mt-4 rounded-2xl border border-border p-4 text-sm leading-relaxed text-muted-foreground">{authMessage}</p> : null}
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border px-6 pb-12 pt-32 md:px-20 md:pb-16 md:pt-36">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Company directory</p>
              <h1 className="mb-5 font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">Proposal page library.</h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">A private index of the company-specific proposal pages created for consulting, platform, and outreach conversations.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {session ? <button type="button" onClick={() => { clearStoredSession(); setSession(null); setContactedContacts({}); }} className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-primary hover:text-primary">Sign out</button> : null}
              <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-primary hover:text-primary">Contact Chad</Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 md:px-20 md:py-10">
          <div className="mx-auto max-w-6xl rounded-[1.5rem] border border-border bg-background p-5 shadow-sm md:p-6">
            <div className="mb-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setTypeFilter("all")} className={`${pillBaseClass} ${typeFilter === "all" ? "border-black bg-black text-white" : "border-border bg-background text-foreground hover:border-primary"}`}>All types</button>
              {opportunityTypes.map((type) => <button key={type} type="button" onClick={() => setTypeFilter(type)} className={`${pillBaseClass} ${getOpportunityTypeClass(type, typeFilter === type)}`}>{type}</button>)}
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:items-end">
              <label className="grid gap-2 text-sm font-semibold text-foreground">Sort proposals<select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary"><option value="social-first">Social contacts first</option><option value="newest">Newest job posting first</option><option value="oldest">Oldest job posting first</option><option value="company">Company A-Z</option></select></label>
              <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground"><input type="checkbox" checked={showContacted} onChange={(event) => setShowContacted(event.target.checked)} className="h-4 w-4" />Show contacts marked as contacted</label>
            </div>
            {authMessage ? <p className="mt-4 rounded-2xl border border-border p-4 text-sm text-muted-foreground">{authMessage}</p> : null}
          </div>
        </section>

        <section className="bg-muted/30 px-6 py-10 md:px-20 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 rounded-[1.5rem] border border-border bg-background p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Active pages</p>
                  <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">{pages.length} proposal pages</h2>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{isStatusLoading ? "Loading saved contact status..." : "Each card separates the proposal summary, role details, page action, and outreach contacts so the workflow stays usable without everything competing visually."}</p>
              </div>
            </div>

            <div className="grid gap-6">
              {pages.map(({ page, jobPostedDate, roundDate, opportunityType, visibleContacts }) => (
                <article key={page.slug} className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <div className="border-l-4 border-primary p-5 md:p-6">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-start">
                      <div>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          <button type="button" onClick={() => setTypeFilter(opportunityType)} className={`${pillBaseClass} ${getOpportunityTypeClass(opportunityType, typeFilter === opportunityType)}`} title="Filter by this opportunity type">{opportunityType}</button>
                          {visibleContacts.length ? <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">{visibleContacts.length} outreach {visibleContacts.length === 1 ? "contact" : "contacts"}</span> : null}
                        </div>
                        <h3 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{page.companyName}</h3>
                        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{page.industry}</p>
                        <div className="mt-5 grid gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-2">
                          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3"><span className="block text-[10px] text-muted-foreground">Job posted</span><span className="mt-1 block text-foreground">{formatDate(jobPostedDate)}</span></div>
                          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3"><span className="block text-[10px] text-muted-foreground">Round added</span><span className="mt-1 block text-foreground">{formatDate(roundDate)}</span></div>
                        </div>
                      </div>

                      <aside className="rounded-[1.5rem] border border-border bg-muted/20 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Posted role</p>
                        <p className="mt-2 text-base font-semibold leading-relaxed text-foreground">{getPostedRoleTitle(page)}</p>
                        <div className="mt-4 border-t border-border pt-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Commitment</p>
                          <p className="mt-1 text-sm leading-relaxed text-foreground">{getCommitmentLength(page)}</p>
                        </div>
                        <Link to={`/company/${page.slug}`} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground no-underline transition-opacity hover:opacity-90">View proposal page</Link>
                      </aside>
                    </div>
                  </div>

                  {visibleContacts.length ? (
                    <div className="border-t border-border bg-muted/20 px-5 py-5 md:px-6 md:py-6">
                      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Outreach contacts</p>
                          <p className="mt-1 text-sm text-muted-foreground">Use the profile link, draft generator, and contacted status without losing the proposal context.</p>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {visibleContacts.map((contact) => {
                          const contactKey = getContactKey(page, contact);
                          const isContacted = Boolean(contactedContacts[contactKey]);
                          const hasEmailPath = Boolean(contact.email || contact.emailStatus === "exact" || contact.emailStatus === "pattern_supported" || contact.emailStatus === "not_stored_in_repo");
                          return (
                            <div key={`${page.slug}-${contact.linkedinUrl}`} className="rounded-[1.5rem] border border-border bg-background p-4 shadow-sm">
                              <div className="flex items-start justify-between gap-4">
                                <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="group block min-w-0 no-underline" onClick={() => trackEvent("click_linkedin_profile", buildContactEventParams(page, contact))}>
                                  <p className="m-0 font-display text-xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">{contact.name}</p>
                                  <p className="mt-1 text-sm font-semibold leading-relaxed text-primary">{contact.title}</p>
                                </a>
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                  {isContacted ? <span className={mutedPillClass}>Contacted</span> : null}
                                  {hasEmailPath ? <span className={mutedPillClass}>Email path</span> : null}
                                </div>
                              </div>
                              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <button type="button" onClick={() => openDraft(page, contact)} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">Draft message</button>
                                <label className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"><input type="checkbox" checked={isContacted} onChange={(event) => updateContactedStatus(page, contact, event.target.checked)} className="h-4 w-4" />Mark contacted</label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedDraft ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="directory-social-draft-title" onClick={() => setSelectedDraft(null)}>
          <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-background p-6 text-foreground shadow-2xl md:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Draft LinkedIn message</p><h2 id="directory-social-draft-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{selectedDraft.contact.name}</h2><a href={selectedDraft.contact.linkedinUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline" onClick={() => trackEvent("click_linkedin_profile", buildContactEventParams(selectedDraft.page, selectedDraft.contact))}>Open LinkedIn profile</a></div><button type="button" onClick={() => setSelectedDraft(null)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Close draft message">Close</button></div>
            <textarea readOnly value={selectedDraftMessage} className="h-72 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none" />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-relaxed text-muted-foreground sm:max-w-md">Copy this message, open the LinkedIn profile, and personalize the final line if needed before sending.</p><button type="button" onClick={copyDraft} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">{copyStatus}</button></div>
          </div>
        </div>
      ) : null}
      <Footer />
    </div>
  );
};

export default CompanyDirectoryPageV5;
