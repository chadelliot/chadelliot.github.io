import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allCompanyLandingPages } from "@/data/allCompanyLandingPages";
import { proposalOutreachResearch, type ProposalOutreachResearchContact } from "@/data/proposalOutreachResearch";
import { trackEvent } from "@/lib/analytics";

type SortMode = "social-first" | "newest" | "oldest" | "company";
type PageSize = 10 | 25 | 50 | 100;
type DirectoryContact = Partial<ProposalOutreachResearchContact> & {
  name: string;
  title: string;
  linkedinUrl?: string;
  email?: string;
};

const CONTACTED_STORAGE_KEY = "aboutchad_contacted_social_contacts_v1";
const ARCHIVED_ROLES_STORAGE_KEY = "aboutchad_archived_proposal_roles_v1";
const PAGE_SIZE_OPTIONS: PageSize[] = [10, 25, 50, 100];

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

const getStoredMap = (key: string) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
};

const saveStoredMap = (key: string, value: Record<string, boolean>) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const formatDate = (date?: string) => {
  if (!date) return "Date pending";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

const getPostedRoleTitle = (page: (typeof allCompanyLandingPages)[string]) => POSTED_ROLE_TITLES[page.slug] ?? page.recommendedEngagement.title;

const getCommitmentLength = (page: (typeof allCompanyLandingPages)[string]) => {
  const phaseDurations = Array.from(new Set(page.proposal?.phases?.map((phase) => phase.duration.trim()).filter(Boolean) ?? []));
  if (phaseDurations.length) return phaseDurations.join(" / ");
  const investment = page.proposal?.investment || "";
  const match = investment.match(/(?:remote;\s*)?([^;]*(?:contract|engagement|month|week|hour)[^;]*)/i);
  return match?.[1]?.trim() || "Length not listed";
};

const getContactKey = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact) => `${page.slug}::${contact.linkedinUrl || contact.email || contact.name}`.toLowerCase();

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
    .filter((contact) => contact.name && contact.title && (contact.linkedinUrl || contact.email))
    .forEach((contact) => {
      const key = `${contact.linkedinUrl || contact.email || contact.name}`.toLowerCase();
      if (!deduped.has(key)) deduped.set(key, contact);
    });

  return Array.from(deduped.values());
};

const getRoleSkills = (page: (typeof allCompanyLandingPages)[string]) => ROLE_SKILLS[page.slug] ?? ["revenue operations", "marketing operations", "lifecycle strategy", "CRM workflows", "segmentation", "executive reporting"];
const getRolePositioning = (page: (typeof allCompanyLandingPages)[string]) => ROLE_POSITIONING[page.slug] ?? "I build practical revenue and marketing operating systems that connect strategy, data, workflows, and reporting to measurable execution.";

const buildDraft = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact) => {
  const firstName = contact.name.split(" ")[0] || contact.name;
  const roleTitle = proposalOutreachResearch[page.slug]?.opportunityTitle || getPostedRoleTitle(page);
  return [
    `Hi ${firstName},`,
    "",
    `I saw the ${roleTitle} opportunity with ${page.companyName} and wanted to reach out in case you are connected to the team evaluating the role.`,
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

const buildEmailHref = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact) => {
  const subject = encodeURIComponent(`Potential fit with ${page.companyName}`);
  const body = encodeURIComponent(buildDraft(page, contact));
  return `mailto:${contact.email ?? ""}?subject=${subject}&body=${body}`;
};

const buildLinkedInSearchUrl = (page: (typeof allCompanyLandingPages)[string]) =>
  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${page.companyName} marketing revenue operations leader`)}`;

const buildContactEventParams = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact) => ({
  company_slug: page.slug,
  company_name: page.companyName,
  engagement_title: proposalOutreachResearch[page.slug]?.opportunityTitle || page.recommendedEngagement.title,
  contact_name: contact.name,
  contact_title: contact.title,
  contact_confidence: contact.confidence || "unknown",
  outreach_type: contact.linkedinUrl ? "linkedin" : "email",
  has_email_path: Boolean(contact.email || contact.emailStatus === "exact" || contact.emailStatus === "pattern_supported" || contact.emailStatus === "not_stored_in_repo"),
});

const inputClass = "h-[42px] rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-normal outline-none focus:border-primary";
const checkboxClass = "flex h-[42px] items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#334155]";

const CompanyDirectoryPageV6 = () => {
  const [sortMode, setSortMode] = useState<SortMode>("social-first");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showContacted, setShowContacted] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactedContacts, setContactedContacts] = useState<Record<string, boolean>>(() => getStoredMap(CONTACTED_STORAGE_KEY));
  const [archivedRoles, setArchivedRoles] = useState<Record<string, boolean>>(() => getStoredMap(ARCHIVED_ROLES_STORAGE_KEY));
  const [selectedDraft, setSelectedDraft] = useState<{ page: (typeof allCompanyLandingPages)[string]; contact: DirectoryContact } | null>(null);
  const [copyStatus, setCopyStatus] = useState("Copy message");

  useEffect(() => {
    setCurrentPage(1);
  }, [sortMode, typeFilter, showContacted, showArchived, pageSize]);

  const updateContactedStatus = (page: (typeof allCompanyLandingPages)[string], contact: DirectoryContact, isContacted: boolean) => {
    const key = getContactKey(page, contact);
    const next = { ...contactedContacts };
    if (isContacted) next[key] = true;
    else delete next[key];
    setContactedContacts(next);
    saveStoredMap(CONTACTED_STORAGE_KEY, next);
    trackEvent("mark_social_contact_contacted", { ...buildContactEventParams(page, contact), contacted_status: isContacted });
  };

  const updateArchivedStatus = (page: (typeof allCompanyLandingPages)[string], isArchived: boolean) => {
    const next = { ...archivedRoles };
    if (isArchived) next[page.slug] = true;
    else delete next[page.slug];
    setArchivedRoles(next);
    saveStoredMap(ARCHIVED_ROLES_STORAGE_KEY, next);
    trackEvent("mark_proposal_role_archived", {
      company_slug: page.slug,
      company_name: page.companyName,
      engagement_title: proposalOutreachResearch[page.slug]?.opportunityTitle || page.recommendedEngagement.title,
      archived_status: isArchived,
    });
  };

  const pages = useMemo(() => {
    const records = Object.values(allCompanyLandingPages).map((page) => {
      const contacts = getDirectoryContacts(page);
      const visibleContacts = contacts.filter((contact) => showContacted || !contactedContacts[getContactKey(page, contact)]);
      const isArchived = Boolean(archivedRoles[page.slug]);
      return { page, jobPostedDate: JOB_POSTED_DATES[page.slug], roundDate: ROUND_DATES[page.slug], opportunityType: getOpportunityType(page), contacts, visibleContacts, isArchived };
    });

    return records
      .filter((record) => typeFilter === "all" || record.opportunityType === typeFilter)
      .filter((record) => (showArchived ? record.isArchived : !record.isArchived))
      .sort((a, b) => {
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
  }, [sortMode, typeFilter, showContacted, showArchived, contactedContacts, archivedRoles]);

  const opportunityTypes = useMemo(() => Array.from(new Set(Object.values(allCompanyLandingPages).map(getOpportunityType))).sort(), []);
  const totalPages = Math.max(1, Math.ceil(pages.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = pages.length ? (activePage - 1) * pageSize + 1 : 0;
  const pageEnd = Math.min(activePage * pageSize, pages.length);
  const paginatedPages = pages.slice((activePage - 1) * pageSize, activePage * pageSize);
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
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-primary hover:text-primary">Contact Chad</Link>
          </div>
        </section>

        <section className="px-6 py-7 md:px-20 md:py-8">
          <div className="mx-auto max-w-6xl rounded-[1.25rem] border border-border bg-background p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.35fr_auto_auto] lg:items-end">
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Fit rank
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className={inputClass}>
                  <option value="social-first">Best fit first</option>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="company">Company A-Z</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Job type
                <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className={inputClass}>
                  <option value="all">All types</option>
                  {opportunityTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Sort proposals
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className={inputClass}>
                  <option value="social-first">Social contacts first</option>
                  <option value="newest">Newest job posting first</option>
                  <option value="oldest">Oldest job posting first</option>
                  <option value="company">Company A-Z</option>
                </select>
              </label>
              <label className={checkboxClass}><input type="checkbox" checked={showContacted} onChange={(event) => setShowContacted(event.target.checked)} className="h-4 w-4" />Show contacted</label>
              <label className={checkboxClass}><input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} className="h-4 w-4" />Show archived</label>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-6 py-8 md:px-20 md:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex flex-col gap-3 border-b border-[#E2E8F0] bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{showArchived ? "Archived pages" : "Active pages"}</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#0F172A] md:text-3xl">{pages.length} {showArchived ? "archived" : "active"} proposal page{pages.length === 1 ? "" : "s"}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <p className="text-sm leading-relaxed text-muted-foreground">{pages.length ? `Showing ${pageStart}-${pageEnd} of ${pages.length}` : "No roles match the current filters."}</p>
                <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  View
                  <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value) as PageSize)} className="h-9 rounded-lg border border-[#CBD5E1] bg-white px-2 text-sm font-semibold text-[#334155] outline-none focus:border-primary">
                    {PAGE_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className="grid gap-4">
              {paginatedPages.map(({ page, jobPostedDate, roundDate, opportunityType, visibleContacts, isArchived }) => (
                <article key={page.slug} className="overflow-hidden border border-[#E2E8F0] bg-white shadow-sm transition-colors hover:border-primary/60">
                  <div className="grid gap-4 border-b border-[#E2E8F0] px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:px-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-2xl font-extrabold tracking-tight text-[#0F172A]">{page.companyName}</h3>
                        <button type="button" onClick={() => setTypeFilter(opportunityType)} className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${getOpportunityTypeClass(opportunityType, typeFilter === opportunityType)}`}>{opportunityType}</button>
                        {isArchived ? <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">Archived</span> : null}
                        {visibleContacts.length ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">{visibleContacts.length} contact{visibleContacts.length === 1 ? "" : "s"}</span> : null}
                      </div>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{page.industry}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <a href={buildLinkedInSearchUrl(page)} target="_blank" rel="noreferrer" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary no-underline underline-offset-4 hover:underline">Find leaders</a>
                      <div className="flex items-center gap-2 px-1">
                        <Link to={`/company/${page.slug}`} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground no-underline transition-opacity hover:opacity-90">View page</Link>
                        <button type="button" onClick={() => updateArchivedStatus(page, !isArchived)} className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] transition-colors hover:border-primary hover:text-primary">{isArchived ? "Restore" : "Archive"}</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-0 border-b border-[#E2E8F0] bg-[#F8FAFC] md:grid-cols-4">
                    <div className="border-b border-[#E2E8F0] px-4 py-3 md:border-b-0 md:border-r md:px-5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Posted role</p><p className="mt-1 text-sm font-semibold leading-relaxed text-[#0F172A]">{getPostedRoleTitle(page)}</p></div>
                    <div className="border-b border-[#E2E8F0] px-4 py-3 md:border-b-0 md:border-r md:px-5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Commitment</p><p className="mt-1 text-sm leading-relaxed text-[#0F172A]">{getCommitmentLength(page)}</p></div>
                    <div className="border-b border-[#E2E8F0] px-4 py-3 md:border-b-0 md:border-r md:px-5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Job posted</p><p className="mt-1 text-sm leading-relaxed text-[#0F172A]">{formatDate(jobPostedDate)}</p></div>
                    <div className="px-4 py-3 md:px-5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Round added</p><p className="mt-1 text-sm leading-relaxed text-[#0F172A]">{formatDate(roundDate)}</p></div>
                  </div>

                  {visibleContacts.length ? (
                    <div className="px-4 py-4 md:px-5">
                      <div className="mb-3 flex items-center justify-between gap-3"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Outreach contacts</p><p className="hidden text-xs text-muted-foreground md:block">Available LinkedIn and email contacts are grouped together below.</p></div>
                      <div className="overflow-hidden border border-[#E2E8F0]">
                        {visibleContacts.map((contact, index) => {
                          const contactKey = getContactKey(page, contact);
                          const isContacted = Boolean(contactedContacts[contactKey]);
                          const hasEmailPath = Boolean(contact.email || contact.emailStatus === "exact" || contact.emailStatus === "pattern_supported" || contact.emailStatus === "not_stored_in_repo");
                          return (
                            <div key={`${page.slug}-${contactKey}`} className={`grid gap-3 bg-white px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${index === 0 ? "" : "border-t border-[#E2E8F0]"}`}>
                              <div className="min-w-0">
                                {contact.linkedinUrl ? (
                                  <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="group block no-underline" onClick={() => trackEvent("click_linkedin_profile", buildContactEventParams(page, contact))}><p className="m-0 font-display text-lg font-extrabold tracking-tight text-[#0F172A] transition-colors group-hover:text-primary">{contact.name}</p><p className="mt-0.5 text-sm font-semibold leading-relaxed text-primary">{contact.title}</p></a>
                                ) : (
                                  <div><p className="m-0 font-display text-lg font-extrabold tracking-tight text-[#0F172A]">{contact.name}</p><p className="mt-0.5 text-sm font-semibold leading-relaxed text-primary">{contact.title}</p></div>
                                )}
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {isContacted ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Contacted</span> : null}
                                  {contact.linkedinUrl ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">LinkedIn</span> : null}
                                  {hasEmailPath ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Email path</span> : null}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                <button type="button" onClick={() => openDraft(page, contact)} className="inline-flex items-center justify-center rounded-md bg-primary px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">Draft</button>
                                {contact.email ? <a href={buildEmailHref(page, contact)} className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#334155] no-underline transition-colors hover:border-primary hover:text-primary">Email</a> : null}
                                {contact.linkedinUrl ? <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#334155] no-underline transition-colors hover:border-primary hover:text-primary">LinkedIn</a> : null}
                                <label className="inline-flex items-center gap-2 border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"><input type="checkbox" checked={isContacted} onChange={(event) => updateContactedStatus(page, contact, event.target.checked)} className="h-4 w-4" />Mark contacted</label>
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

            {pages.length ? (
              <div className="mt-6 flex flex-col gap-3 border border-[#E2E8F0] bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">Showing {pageStart}-{pageEnd} of {pages.length}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" disabled={activePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="rounded-md border border-[#CBD5E1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setCurrentPage(pageNumber)} className={`rounded-md border px-3 py-2 text-xs font-semibold ${activePage === pageNumber ? "border-primary bg-primary text-primary-foreground" : "border-[#CBD5E1] bg-white text-[#334155] hover:border-primary hover:text-primary"}`}>{pageNumber}</button>)}
                  <button type="button" disabled={activePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="rounded-md border border-[#CBD5E1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      {selectedDraft ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="directory-social-draft-title" onClick={() => setSelectedDraft(null)}>
          <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-background p-6 text-foreground shadow-2xl md:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Draft message</p><h2 id="directory-social-draft-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{selectedDraft.contact.name}</h2>{selectedDraft.contact.linkedinUrl ? <a href={selectedDraft.contact.linkedinUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline" onClick={() => trackEvent("click_linkedin_profile", buildContactEventParams(selectedDraft.page, selectedDraft.contact))}>Open LinkedIn profile</a> : null}</div><button type="button" onClick={() => setSelectedDraft(null)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Close draft message">Close</button></div>
            <textarea readOnly value={selectedDraftMessage} className="h-72 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none" />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-relaxed text-muted-foreground sm:max-w-md">Copy this message and personalize the final line if needed before sending.</p><button type="button" onClick={copyDraft} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">{copyStatus}</button></div>
          </div>
        </div>
      ) : null}
      <Footer />
    </div>
  );
};

export default CompanyDirectoryPageV6;