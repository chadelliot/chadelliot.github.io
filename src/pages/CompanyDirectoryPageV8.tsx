import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allCompanyLandingPages } from "@/data/allCompanyLandingPages";
import { proposalOutreachResearch } from "@/data/proposalOutreachResearch";
import { trackEvent } from "@/lib/analytics";

type DraftChannel = "email" | "linkedin";
type PageSize = 10 | 25 | 50 | 100;
type SortMode = "social-first" | "newest" | "oldest" | "company" | "fit-highest" | "fit-lowest";
type CompanyPage = Record<string, any>;
type DirectoryContact = {
  name: string;
  title: string;
  linkedinUrl?: string;
  email?: string;
  relationshipToOpportunity?: string;
  selectionRationale?: string;
  suggestedAngle?: string;
  confidence?: string;
  emailStatus?: string;
  isDefaultContacted?: boolean;
};

type DirectoryMetadata = {
  roleTitle: string;
  jobPostedDate?: string;
  roundAddedDate: string;
  sourceUrl?: string;
  skills?: string[];
  positioning?: string;
};

const CONTACTED_STORAGE_KEY = "aboutchad_contacted_social_contacts_v1";
const ARCHIVED_ROLES_STORAGE_KEY = "aboutchad_archived_proposal_roles_v1";
const PAGE_SIZE_OPTIONS: PageSize[] = [10, 25, 50, 100];

const DIRECTORY_METADATA: Record<string, DirectoryMetadata> = {
  "who-gives-a-crap": { roleTitle: "Fractional Head of Marketing Operations & Planning", sourceUrl: "https://www.gofractional.com/job/greenhouse-head-of-marketing-operations-planning-12-month-contract", jobPostedDate: "2026-05-07", roundAddedDate: "2026-05-17", skills: ["marketing operations", "planning cadence", "campaign governance", "executive reporting"], positioning: "I build the operating layer behind marketing teams so strategy, resourcing, campaign governance, and reporting move as one system." },
  attest: { roleTitle: "Interim Senior Growth Marketing Manager", sourceUrl: "https://www.gofractional.com/job/welcometothejungle-interim-senior-growth-marketing-manager-attest", jobPostedDate: "2026-05-06", roundAddedDate: "2026-05-17", skills: ["growth marketing", "lifecycle automation", "RevOps partnership", "attribution"], positioning: "I build growth operating systems that connect lifecycle marketing, RevOps, automation, attribution, and AI-enabled execution to measurable outcomes." },
  enmacc: { roleTitle: "Interim Business Manager Revenue", sourceUrl: "https://www.gofractional.com/job/greenhouse-business-manager-revenue-one-year-fixed-term-contract-m-f-d", jobPostedDate: "2026-05-11", roundAddedDate: "2026-05-17", skills: ["revenue cadence", "OKR governance", "RevOps reporting", "cross-functional execution"], positioning: "I build revenue operating systems that turn CRO priorities, OKRs, reporting, and cross-functional execution into a clear leadership cadence." },
  "speridian-technologies": { roleTitle: "Principal GTM Strategy Lead", jobPostedDate: "2026-05-16", roundAddedDate: "2026-05-16" },
  neolytix: { roleTitle: "Fractional Healthcare Growth Program Architect", jobPostedDate: "2026-05-16", roundAddedDate: "2026-05-16" },
  farlinium: { roleTitle: "B2B Growth Marketing Manager", jobPostedDate: "2026-05-16", roundAddedDate: "2026-05-16" },
  "logic20-20": { roleTitle: "Solution Architect — Palantir Foundry", jobPostedDate: "2026-05-16", roundAddedDate: "2026-05-16" },
  acuvance: { roleTitle: "Director of Revenue Operations", jobPostedDate: "2026-05-15", roundAddedDate: "2026-05-15" },
  "town-web": { roleTitle: "Fractional CPQ and RevOps Architect", jobPostedDate: "2026-05-15", roundAddedDate: "2026-05-15" },
  everist: { roleTitle: "Fractional VP Marketing", jobPostedDate: "2026-05-15", roundAddedDate: "2026-05-15" },
  turtl: { roleTitle: "Fractional VP of Customer Success", jobPostedDate: "2026-05-15", roundAddedDate: "2026-05-15" },
  "software-solutions-firm-vp-sales": { roleTitle: "Fractional VP of Sales", jobPostedDate: "2026-05-15", roundAddedDate: "2026-05-15" },
  elixirr: { roleTitle: "Interim Global Head of Marketing", jobPostedDate: "2026-05-11", roundAddedDate: "2026-05-20", skills: ["global marketing", "B2B leadership", "budget ownership", "commercial alignment"], positioning: "I build marketing operating systems that connect global strategy, campaign execution, digital performance, budget decisions, and executive reporting to commercial outcomes." },
  "industrial-software-product-company": { roleTitle: "Chief Product Officer", jobPostedDate: "2026-05-19", roundAddedDate: "2026-05-20", skills: ["industrial transformation", "workflow automation", "AI-enabled operations", "GTM alignment"], positioning: "I translate complex industrial workflows into practical product, adoption, measurement, and GTM systems." },
  "random-golf-club": { roleTitle: "Marketing Lead", jobPostedDate: "2026-05-17", roundAddedDate: "2026-05-20", skills: ["CRM strategy", "lifecycle marketing", "paid media", "attribution"], positioning: "I build growth systems that connect CRM, lifecycle marketing, content, paid media, SEO, attribution, and reporting into repeatable engagement." },
  "cro-metrics": { roleTitle: "Copywriter — Conversion & Growth Copy", jobPostedDate: "2026-05-20", roundAddedDate: "2026-05-21", skills: ["conversion copy", "CRO experimentation", "landing pages", "AI writing workflows"], positioning: "I build conversion-focused content and campaign systems that connect experimentation, lifecycle strategy, paid media, and measurable growth outcomes." },

  "go-nimbly": { roleTitle: "RevOps Consulting / Marketing Systems Opportunity", roundAddedDate: "2026-06-02" },
  "digital-reach-agency": { roleTitle: "Contract RevOps Strategist", roundAddedDate: "2026-06-02" },
  evara: { roleTitle: "CRM / RevOps Consultant", roundAddedDate: "2026-06-02" },
  "process-pro-consulting": { roleTitle: "Senior HubSpot Consultant", roundAddedDate: "2026-06-02" },
  "24-mag": { roleTitle: "Revenue Operations & Sales Systems Consultant", roundAddedDate: "2026-06-02" },
  "slipstream-life-sciences": { roleTitle: "Salesforce Marketing Cloud Consultant", roundAddedDate: "2026-06-02" },
  e3n: { roleTitle: "Fractional Marketing & Communications Manager", roundAddedDate: "2026-06-02" },
  "rootshell-enterprise-technologies": { roleTitle: "Salesforce Marketing Cloud / Data Cloud Consultant", roundAddedDate: "2026-06-02" },

  "sleep-doctor-gtm-product-marketing": { roleTitle: "GTM / Product Marketing Opportunity", roundAddedDate: "2026-06-02" },
  "whole-womans-health-fractional-marketing-director": { roleTitle: "Fractional Marketing Director", roundAddedDate: "2026-06-02" },
  "shaw-scott-contract-solutions-engineer-consultant": { roleTitle: "Contract Solutions Engineer Consultant", roundAddedDate: "2026-06-02" },
  "strenox-cro-strategist": { roleTitle: "CRO Strategist", roundAddedDate: "2026-06-02" },
  "run-studios-internal-communications-content-strategist": { roleTitle: "Internal Communications Content Strategist", roundAddedDate: "2026-06-02" },
  "xen-ai-fractional-gtm-advisory": { roleTitle: "Fractional GTM Advisory", roundAddedDate: "2026-06-02" },
  "bay-fc-fractional-marketing-pr-operator": { roleTitle: "Fractional Marketing / PR Operator", sourceUrl: "https://www.gofractional.com/job/fractional-marketing-pr-operator-cmpokml4", jobPostedDate: "2026-05-26", roundAddedDate: "2026-06-02" },
  "rippling-senior-lifecycle-marketing-manager-contractor": { roleTitle: "Senior Lifecycle Marketing Manager Contractor", sourceUrl: "https://www.gofractional.com/job/rippling-senior-lifecycle-marketing-manager-contractor-part-time-rippling", roundAddedDate: "2026-06-02" },
  "classdojo-b2b-content-thought-leadership-strategist": { roleTitle: "B2B Content / Thought Leadership Strategist Contract", sourceUrl: "https://www.gofractional.com/job/ashbyhq-b2b-content-thought-leadership-strategist-contract-classdojo", jobPostedDate: "2026-05-22", roundAddedDate: "2026-06-02" },
};

const GENERIC_CONTACT_PATTERN = /^(contact|unknown|tbd|n\/a|na|hiring manager|recruiter|marketing contact|leadership contact|people contact|decision maker|senior leader)$/i;
const GENERIC_TITLE_PATTERN = /(leadership contact|people-path|hiring-path|routing contact|proposed contact|generic contact|company leader|senior company leader|likely useful routing|unknown|tbd|n\/a)/i;

const getStoredMap = (key: string) => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
};

const saveStoredMap = (key: string, value: Record<string, boolean>) => {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
};

const formatDate = (date?: string, missing = "Source date unavailable") => {
  if (!date) return missing;
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getMetadata = (page: CompanyPage) => DIRECTORY_METADATA[page.slug] ?? { roleTitle: page.recommendedEngagement?.title ?? "Role pending", roundAddedDate: "" };
const getPostedRoleTitle = (page: CompanyPage) => getMetadata(page).roleTitle;
const getRoleSkills = (page: CompanyPage) => getMetadata(page).skills ?? ["revenue operations", "marketing operations", "lifecycle strategy", "CRM workflows", "segmentation", "executive reporting"];
const getRolePositioning = (page: CompanyPage) => getMetadata(page).positioning ?? "I build practical revenue and marketing operating systems that connect strategy, data, workflows, and reporting to measurable execution.";

const getOpportunityType = (page: CompanyPage) => {
  const industry = String(page.industry || "").toLowerCase();
  if (industry.includes("talent") || industry.includes("consulting network") || industry.includes("executive network")) return "Agency / Talent Network";
  if (industry.includes("marketplace") || industry.includes("platform") || industry.includes("owned consulting channel")) return "Marketplace / Platform";
  return "Company Direct / Fractional";
};

const getOpportunityTypeClass = (opportunityType: string, isSelected = false) => {
  if (opportunityType.includes("Agency")) return isSelected ? "border-amber-700 bg-amber-600 text-white" : "border-amber-400 bg-amber-50 text-amber-900 hover:border-amber-700";
  if (opportunityType.includes("Marketplace")) return isSelected ? "border-violet-700 bg-violet-600 text-white" : "border-violet-400 bg-violet-50 text-violet-900 hover:border-violet-700";
  return isSelected ? "border-sky-700 bg-sky-600 text-white" : "border-sky-400 bg-sky-50 text-sky-900 hover:border-sky-700";
};

const getFitScore = (page: CompanyPage) => {
  const fitText = `${page.fitSummary || ""} ${page.headline || ""} ${page.subheadline || ""} ${page.outreachAngle || ""}`.toLowerCase();
  if (/not\s+a\s+fit|not\s+aligned|poor\s+fit/.test(fitText)) return 20;
  if (/very\s+strong\s+fit|excellent\s+fit/.test(fitText)) return 95;
  if (/strong\s+adjacent\s+fit|strong\s+fit|high\s+fit/.test(fitText)) return 86;
  if (/medium-strong\s+fit|medium\s+strong\s+fit/.test(fitText)) return 76;
  if (/medium\s+fit|moderate\s+fit/.test(fitText)) return 62;
  if (/lower-medium\s+fit|low-medium\s+fit/.test(fitText)) return 45;
  if (/lower\s+fit|low\s+fit/.test(fitText)) return 35;
  return 70;
};

const getFitLabel = (score: number) => {
  if (score >= 85) return "High fit";
  if (score >= 65) return "Medium fit";
  if (score >= 40) return "Low fit";
  return "Not a fit";
};

const getCommitmentLength = (page: CompanyPage) => {
  const phaseDurations = Array.from(new Set((page.proposal?.phases ?? []).map((phase: any) => String(phase.duration || "").trim()).filter(Boolean)));
  if (phaseDurations.length) return phaseDurations.join(" / ");
  const investment = page.proposal?.investment || "";
  const match = String(investment).match(/(?:remote;\s*)?([^;]*(?:contract|engagement|month|week|hour)[^;]*)/i);
  return match?.[1]?.trim() || "Length not listed";
};

const buildLeaderSearchUrl = (page: CompanyPage) => {
  const roleTitle = getPostedRoleTitle(page).toLowerCase();
  const seniority = roleTitle.includes("marketing") || roleTitle.includes("copywriter")
    ? "CMO OR chief marketing officer OR VP marketing OR marketing director OR growth strategist"
    : roleTitle.includes("product")
      ? "CEO OR founder OR chief product officer OR VP product OR product director"
      : "CEO OR founder OR chief revenue officer OR VP marketing OR VP revenue operations OR director marketing";
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${page.companyName} ${seniority}`)}`;
};

const sanitizeLinkedInUrl = (linkedinUrl?: string) => {
  if (!linkedinUrl) return undefined;
  if (/linkedin\.com\/search\//i.test(linkedinUrl)) return undefined;
  if (!/linkedin\.com\/(in|company)\//i.test(linkedinUrl)) return undefined;
  return linkedinUrl;
};

const sanitizeContact = (contact: DirectoryContact): DirectoryContact | null => {
  const name = contact.name?.trim();
  const title = contact.title?.trim();
  const linkedinUrl = sanitizeLinkedInUrl(contact.linkedinUrl);
  const email = contact.email?.trim();
  if (!name || !title) return null;
  if (GENERIC_CONTACT_PATTERN.test(name) || GENERIC_TITLE_PATTERN.test(title)) return null;
  if (!linkedinUrl && !email) return null;
  return { ...contact, name, title, linkedinUrl, email };
};

const getContactKey = (page: CompanyPage, contact: DirectoryContact) => `${page.slug}::${contact.linkedinUrl || contact.email || contact.name}`.toLowerCase();

const getDirectoryContacts = (page: CompanyPage): DirectoryContact[] => {
  const researchContacts = (proposalOutreachResearch as Record<string, any>)[page.slug]?.contacts ?? [];
  const pageContacts = (page.outreachContacts ?? []).map((contact: any) => ({
    name: contact.name,
    title: contact.title,
    linkedinUrl: contact.linkedinUrl,
    email: contact.email,
    selectionRationale: contact.selectionRationale,
    relationshipToOpportunity: contact.selectionRationale || "Previously researched outreach contact.",
    confidence: "medium",
    emailStatus: contact.email ? "exact" : "not_available",
    suggestedAngle: page.outreachAngle,
  }));

  const deduped = new Map<string, DirectoryContact>();
  [...researchContacts, ...pageContacts]
    .map((contact) => sanitizeContact(contact as DirectoryContact))
    .filter((contact): contact is DirectoryContact => Boolean(contact))
    .forEach((contact) => {
      const key = `${contact.linkedinUrl || contact.email || contact.name}`.toLowerCase();
      if (!deduped.has(key)) deduped.set(key, contact);
    });
  return Array.from(deduped.values());
};

const getProposalUrl = (page: CompanyPage, channel: DraftChannel) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://aboutchad.com";
  const url = new URL(`/company/${page.slug}`, origin);
  if (channel === "email") {
    url.searchParams.set("utm_medium", "email");
    url.searchParams.set("utm_campaign", String(page.companyName || page.slug).replace(/\s+/g, ""));
  }
  return url.toString();
};

const buildEmailDraft = (page: CompanyPage, contact: DirectoryContact) => {
  const firstName = contact.name.split(" ")[0] || contact.name;
  const roleTitle = (proposalOutreachResearch as Record<string, any>)[page.slug]?.opportunityTitle || getPostedRoleTitle(page);
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
    `Here is the proposal page I put together: ${getProposalUrl(page, "email")}`,
    "",
    "If you’re the right person to discuss this, I’d welcome the chance to connect. If not, I’d appreciate any direction on who owns the conversation internally.",
    "",
    "Best,",
    "Chad",
  ].join("\n");
};

const buildLinkedInDraft = (page: CompanyPage, contact: DirectoryContact) => {
  const firstName = contact.name.split(" ")[0] || contact.name;
  const roleTitle = (proposalOutreachResearch as Record<string, any>)[page.slug]?.opportunityTitle || getPostedRoleTitle(page);
  return [`Hi ${firstName}, I saw the ${roleTitle} opportunity with ${page.companyName} and put together a quick proposal page outlining how I could help:`, "", getProposalUrl(page, "linkedin"), "", "Would welcome the chance to connect if you’re involved in the conversation or know who owns it internally."].join("\n");
};

const buildDraft = (page: CompanyPage, contact: DirectoryContact, channel: DraftChannel) => channel === "email" ? buildEmailDraft(page, contact) : buildLinkedInDraft(page, contact);
const buildEmailHref = (page: CompanyPage, contact: DirectoryContact) => `mailto:${contact.email ?? ""}?subject=${encodeURIComponent(`Potential fit with ${page.companyName}`)}&body=${encodeURIComponent(buildEmailDraft(page, contact))}`;

const buildContactEventParams = (page: CompanyPage, contact: DirectoryContact, channel?: DraftChannel) => ({
  company_slug: page.slug,
  company_name: page.companyName,
  engagement_title: (proposalOutreachResearch as Record<string, any>)[page.slug]?.opportunityTitle || page.recommendedEngagement?.title,
  contact_name: contact.name,
  contact_title: contact.title,
  contact_confidence: contact.confidence || "unknown",
  outreach_type: channel || (contact.linkedinUrl ? "linkedin" : "email"),
  has_email_path: Boolean(contact.email || contact.emailStatus === "exact" || contact.emailStatus === "pattern_supported" || contact.emailStatus === "not_stored_in_repo"),
});

const inputClass = "h-[42px] rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-normal outline-none focus:border-primary";
const checkboxClass = "flex h-[42px] items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#334155]";

const CompanyDirectoryPageV8 = () => {
  const [sortMode, setSortMode] = useState<SortMode>("social-first");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showContacted, setShowContacted] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactedContacts, setContactedContacts] = useState<Record<string, boolean>>(() => getStoredMap(CONTACTED_STORAGE_KEY));
  const [archivedRoles, setArchivedRoles] = useState<Record<string, boolean>>(() => getStoredMap(ARCHIVED_ROLES_STORAGE_KEY));
  const [expandedContactCompanies, setExpandedContactCompanies] = useState<Record<string, boolean>>({});
  const [selectedDraft, setSelectedDraft] = useState<{ page: CompanyPage; contact: DirectoryContact } | null>(null);
  const [draftChannel, setDraftChannel] = useState<DraftChannel>("email");
  const [copyStatus, setCopyStatus] = useState("Copy message");

  const records = useMemo(() => {
    const rows = Object.values(allCompanyLandingPages as Record<string, CompanyPage>).map((page) => {
      const metadata = getMetadata(page);
      const contacts = getDirectoryContacts(page);
      const visibleContacts = contacts.filter((contact) => showContacted || !(contact.isDefaultContacted || contactedContacts[getContactKey(page, contact)]));
      const isArchived = Boolean(archivedRoles[page.slug]);
      const fitScore = getFitScore(page);
      const jobPostedDate = metadata.jobPostedDate;
      const jobTime = jobPostedDate ? new Date(jobPostedDate).getTime() : 0;
      return { page, metadata, contacts, visibleContacts, isArchived, fitScore, fitLabel: getFitLabel(fitScore), jobPostedDate, jobTime, roundDate: metadata.roundAddedDate, opportunityType: getOpportunityType(page) };
    });

    return rows
      .filter((record) => typeFilter === "all" || record.opportunityType === typeFilter)
      .filter((record) => showArchived ? record.isArchived : !record.isArchived)
      .sort((a, b) => {
        if (sortMode === "social-first") {
          const aHasContacts = a.visibleContacts.length > 0 || a.contacts.length > 0;
          const bHasContacts = b.visibleContacts.length > 0 || b.contacts.length > 0;
          if (Number(bHasContacts) !== Number(aHasContacts)) return Number(bHasContacts) - Number(aHasContacts);
          if (b.visibleContacts.length !== a.visibleContacts.length) return b.visibleContacts.length - a.visibleContacts.length;
          if (b.contacts.length !== a.contacts.length) return b.contacts.length - a.contacts.length;
          return b.jobTime - a.jobTime;
        }
        if (sortMode === "newest") return b.jobTime - a.jobTime;
        if (sortMode === "oldest") return a.jobTime - b.jobTime;
        if (sortMode === "company") return String(a.page.companyName).localeCompare(String(b.page.companyName));
        if (sortMode === "fit-lowest") return a.fitScore - b.fitScore || b.jobTime - a.jobTime;
        return b.fitScore - a.fitScore || b.jobTime - a.jobTime;
      });
  }, [sortMode, typeFilter, showContacted, showArchived, contactedContacts, archivedRoles]);

  const opportunityTypes = useMemo(() => Array.from(new Set(Object.values(allCompanyLandingPages as Record<string, CompanyPage>).map(getOpportunityType))).sort(), []);
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = records.length ? (activePage - 1) * pageSize + 1 : 0;
  const pageEnd = Math.min(activePage * pageSize, records.length);
  const paginatedPages = records.slice((activePage - 1) * pageSize, activePage * pageSize);
  const selectedDraftMessage = selectedDraft ? buildDraft(selectedDraft.page, selectedDraft.contact, draftChannel) : "";

  const updateContactedStatus = (page: CompanyPage, contact: DirectoryContact, isContacted: boolean) => {
    const key = getContactKey(page, contact);
    const next = { ...contactedContacts };
    if (isContacted) next[key] = true;
    else delete next[key];
    setContactedContacts(next);
    saveStoredMap(CONTACTED_STORAGE_KEY, next);
    trackEvent("mark_social_contact_contacted", { ...buildContactEventParams(page, contact), contacted_status: isContacted });
  };

  const updateArchivedStatus = (page: CompanyPage, isArchived: boolean) => {
    const next = { ...archivedRoles };
    if (isArchived) next[page.slug] = true;
    else delete next[page.slug];
    setArchivedRoles(next);
    saveStoredMap(ARCHIVED_ROLES_STORAGE_KEY, next);
    trackEvent("mark_proposal_role_archived", { company_slug: page.slug, company_name: page.companyName, archived_status: isArchived });
  };

  const openDraft = (page: CompanyPage, contact: DirectoryContact, channel: DraftChannel = "email") => {
    trackEvent("open_draft_message", buildContactEventParams(page, contact, channel));
    setSelectedDraft({ page, contact });
    setDraftChannel(channel);
    setCopyStatus("Copy message");
  };

  const copyDraft = async () => {
    if (!selectedDraftMessage || !selectedDraft) return;
    try {
      await navigator.clipboard.writeText(selectedDraftMessage);
      trackEvent("copy_draft_message", buildContactEventParams(selectedDraft.page, selectedDraft.contact, draftChannel));
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Select and copy text");
    }
  };

  return (
    <div className="proposal-directory-page min-h-screen bg-background">
      <style>{`.proposal-directory-page > nav { position: absolute !important; } .proposal-extra-contact-section { display: none !important; }`}</style>
      <Navbar />
      <main>
        <section className="border-b border-border px-6 pb-12 pt-32 md:px-20 md:pb-16 md:pt-36">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Company directory</p>
              <h1 className="mb-5 font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">Proposal page library.</h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">A private index of company-specific proposal pages, outreach contacts, and draft messaging.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-primary hover:text-primary">Contact Chad</Link>
          </div>
        </section>

        <section className="sticky top-0 z-[90] border-b border-[#E2E8F0] bg-white px-6 py-3 shadow-sm md:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-3 lg:grid-cols-[1fr_1.35fr_auto_auto] lg:items-end">
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Job type<select value={typeFilter} onChange={(event) => { setTypeFilter(event.target.value); setCurrentPage(1); }} className={inputClass}><option value="all">All types</option>{opportunityTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Sort proposals<select value={sortMode} onChange={(event) => { setSortMode(event.target.value as SortMode); setCurrentPage(1); }} className={inputClass}><option value="social-first">Social contacts first</option><option value="newest">Newest job posting first</option><option value="oldest">Oldest job posting first</option><option value="company">Company A-Z</option><option value="fit-highest">Highest fit first</option><option value="fit-lowest">Lowest fit first</option></select></label>
              <label className={checkboxClass}><input type="checkbox" checked={showContacted} onChange={(event) => { setShowContacted(event.target.checked); setCurrentPage(1); }} className="h-4 w-4" />Show contacted</label>
              <label className={checkboxClass}><input type="checkbox" checked={showArchived} onChange={(event) => { setShowArchived(event.target.checked); setCurrentPage(1); }} className="h-4 w-4" />Show archived</label>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-6 pb-8 pt-4 md:px-20 md:pb-10 md:pt-5">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 flex flex-col gap-3 border-b border-[#E2E8F0] bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{showArchived ? "Archived pages" : "Active pages"}</p><h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#0F172A] md:text-3xl">{records.length} {showArchived ? "archived" : "active"} proposal page{records.length === 1 ? "" : "s"}</h2></div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end"><p className="text-sm leading-relaxed text-muted-foreground">{records.length ? `Showing ${pageStart}-${pageEnd} of ${records.length}` : "No roles match the current filters."}</p><label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">View<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value) as PageSize); setCurrentPage(1); }} className="h-9 rounded-lg border border-[#CBD5E1] bg-white px-2 text-sm font-semibold text-[#334155] outline-none focus:border-primary">{PAGE_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label></div>
            </div>

            <div className="grid gap-4">
              {paginatedPages.map(({ page, metadata, jobPostedDate, roundDate, opportunityType, visibleContacts, isArchived, fitScore, fitLabel }) => {
                const isExpanded = Boolean(expandedContactCompanies[page.slug]);
                const displayedContacts = isExpanded ? visibleContacts : visibleContacts.slice(0, 2);
                const hasMoreContacts = visibleContacts.length > 2;
                return (
                  <article key={page.slug} className="overflow-hidden border border-[#E2E8F0] bg-white shadow-sm transition-colors hover:border-primary/60">
                    <div className="grid gap-4 border-b border-[#E2E8F0] bg-white px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-2xl font-extrabold tracking-tight text-[#0F172A]">{metadata.sourceUrl ? <a href={metadata.sourceUrl} target="_blank" rel="noreferrer" className="no-underline transition-colors hover:text-primary hover:underline">{page.companyName}</a> : page.companyName}</h3><button type="button" onClick={() => setTypeFilter(opportunityType)} className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${getOpportunityTypeClass(opportunityType, typeFilter === opportunityType)}`}>{opportunityType}</button>{isArchived ? <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">Archived</span> : null}{visibleContacts.length ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">{visibleContacts.length} contact{visibleContacts.length === 1 ? "" : "s"}</span> : null}</div>
                        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{page.industry}</p>
                        <div className="mt-3 max-w-md"><div className="mb-1 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"><span>{fitLabel}</span><span>{fitScore}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]"><div className="h-full rounded-full bg-primary" style={{ width: `${fitScore}%` }} /></div></div>
                      </div>
                      <div className="flex flex-row flex-wrap items-center justify-start gap-3 bg-white px-1 py-1 md:justify-end"><a href={buildLeaderSearchUrl(page)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] no-underline transition-colors hover:border-primary hover:text-primary">Find leaders</a><Link to={`/company/${page.slug}`} className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground no-underline transition-opacity hover:opacity-90">View page</Link><button type="button" onClick={() => updateArchivedStatus(page, !isArchived)} className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] transition-colors hover:border-primary hover:text-primary">{isArchived ? "Restore" : "Archive"}</button></div>
                    </div>

                    <div className="grid gap-0 border-b border-[#E2E8F0] bg-[#F8FAFC] md:grid-cols-4">
                      <div className="border-b border-[#E2E8F0] px-4 py-3 md:border-b-0 md:border-r md:px-5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Posted role</p><p className="mt-1 text-sm font-semibold leading-relaxed text-[#0F172A]">{metadata.sourceUrl ? <a href={metadata.sourceUrl} target="_blank" rel="noreferrer" className="text-inherit underline-offset-4 hover:text-primary hover:underline">{getPostedRoleTitle(page)}</a> : getPostedRoleTitle(page)}</p></div>
                      <div className="border-b border-[#E2E8F0] px-4 py-3 md:border-b-0 md:border-r md:px-5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Commitment</p><p className="mt-1 text-sm leading-relaxed text-[#0F172A]">{getCommitmentLength(page)}</p></div>
                      <div className="border-b border-[#E2E8F0] px-4 py-3 md:border-b-0 md:border-r md:px-5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Job posted</p><p className="mt-1 text-sm leading-relaxed text-[#0F172A]">{formatDate(jobPostedDate)}</p></div>
                      <div className="px-4 py-3 md:px-5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Round added</p><p className="mt-1 text-sm leading-relaxed text-[#0F172A]">{formatDate(roundDate, "Round date pending")}</p></div>
                    </div>

                    {visibleContacts.length ? (
                      <div className="px-4 py-4 md:px-5"><div className="mb-3 flex items-center justify-between gap-3"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Outreach contacts</p>{hasMoreContacts ? <button type="button" onClick={() => setExpandedContactCompanies((current) => ({ ...current, [page.slug]: !isExpanded }))} className="rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#334155] transition-colors hover:border-primary hover:text-primary">{isExpanded ? "Show fewer" : `View all ${visibleContacts.length}`}</button> : null}</div><div className="overflow-hidden border border-[#E2E8F0]">{displayedContacts.map((contact, index) => { const contactKey = getContactKey(page, contact); const isContacted = Boolean(contactedContacts[contactKey] || contact.isDefaultContacted); const hasEmailPath = Boolean(contact.email || contact.emailStatus === "exact" || contact.emailStatus === "pattern_supported" || contact.emailStatus === "not_stored_in_repo"); return <div key={`${page.slug}-${contactKey}`} className={`grid gap-3 bg-white px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${index === 0 ? "" : "border-t border-[#E2E8F0]"}`}><div className="min-w-0">{contact.linkedinUrl ? <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="group block no-underline" onClick={() => trackEvent("click_linkedin_profile", buildContactEventParams(page, contact, "linkedin"))}><p className="m-0 font-display text-lg font-extrabold tracking-tight text-[#0F172A] transition-colors group-hover:text-primary">{contact.name}</p><p className="mt-0.5 text-sm font-semibold leading-relaxed text-primary">{contact.title}</p></a> : <div><p className="m-0 font-display text-lg font-extrabold tracking-tight text-[#0F172A]">{contact.name}</p><p className="mt-0.5 text-sm font-semibold leading-relaxed text-primary">{contact.title}</p></div>}<div className="mt-2 flex flex-wrap gap-2">{isContacted ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Contacted</span> : null}{contact.linkedinUrl ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">LinkedIn</span> : null}{hasEmailPath ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Email path</span> : null}</div></div><div className="flex flex-wrap items-center gap-2 md:justify-end"><button type="button" onClick={() => openDraft(page, contact, "email")} className="inline-flex items-center justify-center rounded-md bg-primary px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">Draft</button>{contact.email ? <a href={buildEmailHref(page, contact)} className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#334155] no-underline transition-colors hover:border-primary hover:text-primary">Email</a> : null}{contact.linkedinUrl ? <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#334155] no-underline transition-colors hover:border-primary hover:text-primary">LinkedIn</a> : null}<label className="inline-flex items-center gap-2 border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"><input type="checkbox" checked={isContacted} onChange={(event) => updateContactedStatus(page, contact, event.target.checked)} className="h-4 w-4" />Mark contacted</label></div></div>; })}</div></div>
                    ) : (
                      <div className="px-4 py-4 md:px-5"><div className="border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-4"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Suggested outreach search</p><p className="mt-2 text-sm leading-relaxed text-[#334155]">No saved named contacts yet. Use the leader search to look for senior people above or adjacent to the posted role.</p><a href={buildLeaderSearchUrl(page)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#334155] no-underline transition-colors hover:border-primary hover:text-primary">Search senior leaders</a></div></div>
                    )}
                  </article>
                );
              })}
            </div>

            {records.length ? <div className="mt-6 flex flex-col gap-3 border border-[#E2E8F0] bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between"><p className="text-sm text-muted-foreground">Showing {pageStart}-{pageEnd} of {records.length}</p><div className="flex flex-wrap items-center gap-2"><button type="button" disabled={activePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="rounded-md border border-[#CBD5E1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setCurrentPage(pageNumber)} className={`rounded-md border px-3 py-2 text-xs font-semibold ${activePage === pageNumber ? "border-primary bg-primary text-primary-foreground" : "border-[#CBD5E1] bg-white text-[#334155] hover:border-primary hover:text-primary"}`}>{pageNumber}</button>)}<button type="button" disabled={activePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="rounded-md border border-[#CBD5E1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div> : null}
          </div>
        </section>
      </main>

      {selectedDraft ? <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="directory-social-draft-title" onClick={() => setSelectedDraft(null)}><div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-background p-6 text-foreground shadow-2xl md:p-8" onClick={(event) => event.stopPropagation()}><div className="mb-6 flex items-start justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Draft message</p><h2 id="directory-social-draft-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{selectedDraft.contact.name}</h2>{selectedDraft.contact.linkedinUrl ? <a href={selectedDraft.contact.linkedinUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline" onClick={() => trackEvent("click_linkedin_profile", buildContactEventParams(selectedDraft.page, selectedDraft.contact, "linkedin"))}>Open LinkedIn profile</a> : null}</div><button type="button" onClick={() => setSelectedDraft(null)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Close draft message">Close</button></div><div className="mb-4 flex flex-wrap gap-2"><button type="button" onClick={() => { setDraftChannel("email"); setCopyStatus("Copy message"); }} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${draftChannel === "email" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary"}`}>Email</button><button type="button" onClick={() => { setDraftChannel("linkedin"); setCopyStatus("Copy message"); }} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${draftChannel === "linkedin" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary"}`}>LinkedIn</button></div><textarea readOnly value={selectedDraftMessage} className="h-72 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none" /><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-relaxed text-muted-foreground sm:max-w-md">Copy this message and personalize the final line if needed before sending.</p><button type="button" onClick={copyDraft} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">{copyStatus}</button></div></div></div> : null}
      <Footer />
    </div>
  );
};

export default CompanyDirectoryPageV8;
