import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allCompanyLandingPages } from "@/data/allCompanyLandingPages";
import { proposalOutreachResearch, type ProposalOutreachResearchContact } from "@/data/proposalOutreachResearch";
import { trackEvent } from "@/lib/analytics";

type SortMode = "social-first" | "newest" | "oldest" | "company";
type SocialContact = Pick<ProposalOutreachResearchContact, "name" | "title" | "linkedinUrl"> & Partial<ProposalOutreachResearchContact>;

const CONTACTED_STORAGE_KEY = "aboutchad_contacted_social_contacts_v1";

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

const getOpportunityType = (page: (typeof allCompanyLandingPages)[string]) => {
  const industry = page.industry.toLowerCase();
  if (industry.includes("talent") || industry.includes("consulting network") || industry.includes("executive network")) return "Agency / Talent Network";
  if (industry.includes("marketplace") || industry.includes("platform") || industry.includes("owned consulting channel")) return "Marketplace / Platform";
  return "Company Direct / Fractional";
};

const getOpportunityTypeClass = (opportunityType: string, isSelected = false) => {
  if (opportunityType.includes("Agency")) {
    return isSelected ? "border-amber-700 bg-amber-600 text-white" : "border-amber-400 bg-amber-50 text-amber-900 hover:border-amber-700";
  }
  if (opportunityType.includes("Marketplace")) {
    return isSelected ? "border-violet-700 bg-violet-600 text-white" : "border-violet-400 bg-violet-50 text-violet-900 hover:border-violet-700";
  }
  return isSelected ? "border-sky-700 bg-sky-600 text-white" : "border-sky-400 bg-sky-50 text-sky-900 hover:border-sky-700";
};

const formatDate = (date?: string) => {
  if (!date) return "Date pending";
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getPostedRoleTitle = (page: (typeof allCompanyLandingPages)[string]) => POSTED_ROLE_TITLES[page.slug] ?? page.recommendedEngagement.title;

const hasEmailManagedPath = (contact: SocialContact) => {
  if (contact.email) return true;
  return contact.emailStatus === "exact" || contact.emailStatus === "pattern_supported" || contact.emailStatus === "not_stored_in_repo";
};

const getContactKey = (page: (typeof allCompanyLandingPages)[string], contact: SocialContact) => `${page.slug}::${contact.linkedinUrl || contact.name}`.toLowerCase();

const getSocialOnlyContacts = (page: (typeof allCompanyLandingPages)[string]): SocialContact[] => {
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

  const deduped = new Map<string, SocialContact>();
  [...researchContacts, ...pageContacts]
    .filter((contact) => contact.name && contact.title && contact.linkedinUrl && !hasEmailManagedPath(contact))
    .forEach((contact) => {
      const key = `${contact.linkedinUrl || contact.name}`.toLowerCase();
      if (!deduped.has(key)) deduped.set(key, contact);
    });

  return Array.from(deduped.values());
};

const buildContactEventParams = (page: (typeof allCompanyLandingPages)[string], contact: SocialContact) => ({
  company_slug: page.slug,
  company_name: page.companyName,
  engagement_title: proposalOutreachResearch[page.slug]?.opportunityTitle || page.recommendedEngagement.title,
  contact_name: contact.name,
  contact_title: contact.title,
  contact_confidence: contact.confidence || "unknown",
  outreach_type: "linkedin",
  has_email_path: false,
});

const buildDraft = (page: (typeof allCompanyLandingPages)[string], contact: SocialContact) => {
  const firstName = contact.name.split(" ")[0] || contact.name;
  const roleTitle = proposalOutreachResearch[page.slug]?.opportunityTitle || getPostedRoleTitle(page);
  const relationship = `${contact.relationshipToOpportunity || ""} ${contact.selectionRationale || ""}`.toLowerCase();
  const isDirect = /direct|executive sponsor|cro|head of revenue operations|head of marketing operations|functional partner|marketing director/.test(relationship);
  const isAdjacent = /adjacent|influencer|stakeholder|possible|not necessarily|people partner|route/.test(relationship);

  const opening = isDirect
    ? `I saw the ${roleTitle} opportunity with ${page.companyName} and wanted to reach out directly given your role as ${contact.title}.`
    : isAdjacent
      ? `I saw the ${roleTitle} opportunity with ${page.companyName}. I’m not sure whether you own this conversation, but given your role as ${contact.title}, I thought you may have useful context or be able to point me in the right direction.`
      : `I saw the ${roleTitle} opportunity with ${page.companyName} and wanted to reach out in case you are connected to the team evaluating the role.`;

  return [
    `Hi ${firstName},`,
    "",
    opening,
    "",
    "By way of background, I’m Chad Parker. I build revenue, lifecycle, marketing operations, CRM/CDP, segmentation, and executive reporting systems that help teams turn GTM strategy into measurable execution.",
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

const CompanyDirectoryPageV5 = () => {
  const [sortMode, setSortMode] = useState<SortMode>("social-first");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showContacted, setShowContacted] = useState(false);
  const [contactedContacts, setContactedContacts] = useState<Record<string, boolean>>({});
  const [selectedDraft, setSelectedDraft] = useState<{ page: (typeof allCompanyLandingPages)[string]; contact: SocialContact } | null>(null);
  const [copyStatus, setCopyStatus] = useState("Copy message");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONTACTED_STORAGE_KEY);
      if (stored) setContactedContacts(JSON.parse(stored));
    } catch {
      setContactedContacts({});
    }
  }, []);

  const updateContactedStatus = (page: (typeof allCompanyLandingPages)[string], contact: SocialContact, isContacted: boolean) => {
    const key = getContactKey(page, contact);
    setContactedContacts((current) => {
      const next = { ...current };
      if (isContacted) next[key] = true;
      else delete next[key];

      try {
        window.localStorage.setItem(CONTACTED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage may be unavailable in private browsing contexts.
      }

      return next;
    });

    trackEvent("mark_social_contact_contacted", {
      ...buildContactEventParams(page, contact),
      contacted_status: isContacted,
    });
  };

  const pages = useMemo(() => {
    const records = Object.values(allCompanyLandingPages).map((page) => {
      const socialContacts = getSocialOnlyContacts(page);
      const visibleSocialContacts = socialContacts.filter((contact) => showContacted || !contactedContacts[getContactKey(page, contact)]);

      return {
        page,
        jobPostedDate: JOB_POSTED_DATES[page.slug],
        roundDate: ROUND_DATES[page.slug],
        opportunityType: getOpportunityType(page),
        socialContacts,
        visibleSocialContacts,
      };
    });

    return records
      .filter((record) => typeFilter === "all" || record.opportunityType === typeFilter)
      .sort((a, b) => {
        if (sortMode === "company") return a.page.companyName.localeCompare(b.page.companyName);

        const aJobTime = a.jobPostedDate ? new Date(a.jobPostedDate).getTime() : 0;
        const bJobTime = b.jobPostedDate ? new Date(b.jobPostedDate).getTime() : 0;

        if (sortMode === "social-first") {
          if (b.visibleSocialContacts.length !== a.visibleSocialContacts.length) return b.visibleSocialContacts.length - a.visibleSocialContacts.length;
          if (b.socialContacts.length !== a.socialContacts.length) return b.socialContacts.length - a.socialContacts.length;
          return bJobTime - aJobTime;
        }

        return sortMode === "newest" ? bJobTime - aJobTime : aJobTime - bJobTime;
      });
  }, [sortMode, typeFilter, showContacted, contactedContacts]);

  const opportunityTypes = useMemo(() => Array.from(new Set(Object.values(allCompanyLandingPages).map(getOpportunityType))).sort(), []);
  const selectedDraftMessage = selectedDraft ? buildDraft(selectedDraft.page, selectedDraft.contact) : "";

  const openDraft = (page: (typeof allCompanyLandingPages)[string], contact: SocialContact) => {
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
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-primary hover:text-primary">
              Contact Chad
            </Link>
          </div>
        </section>

        <section className="px-6 py-8 md:px-20 md:py-10">
          <div className="mx-auto max-w-6xl rounded-[1.5rem] border border-border bg-background p-5 shadow-sm md:p-6">
            <div className="mb-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setTypeFilter("all")} className={`${pillBaseClass} ${typeFilter === "all" ? "border-black bg-black text-white" : "border-border bg-background text-foreground hover:border-primary"}`}>
                All types
              </button>
              {opportunityTypes.map((type) => (
                <button key={type} type="button" onClick={() => setTypeFilter(type)} className={`${pillBaseClass} ${getOpportunityTypeClass(type, typeFilter === type)}`}>
                  {type}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:items-end">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Sort proposals
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary">
                  <option value="social-first">Social contacts first</option>
                  <option value="newest">Newest job posting first</option>
                  <option value="oldest">Oldest job posting first</option>
                  <option value="company">Company A-Z</option>
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground">
                <input type="checkbox" checked={showContacted} onChange={(event) => setShowContacted(event.target.checked)} className="h-4 w-4" />
                Show contacts marked as contacted
              </label>
            </div>
          </div>
        </section>

        <section className="px-6 pb-14 md:px-20 md:pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-2 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Active pages</p>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">{pages.length} proposal pages</h2>
              </div>
              <p className="text-sm text-muted-foreground">Social-only contacts appear below each matching proposal. Email-managed contacts remain private inside HubSpot.</p>
            </div>

            <div className="grid gap-4">
              {pages.map(({ page, jobPostedDate, roundDate, opportunityType, visibleSocialContacts }) => (
                <article key={page.slug} className="rounded-[1.5rem] border border-border bg-background p-5 transition-colors hover:border-primary md:p-6">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_auto] lg:items-center">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{page.companyName}</h3>
                        <button type="button" onClick={() => setTypeFilter(opportunityType)} className={`${pillBaseClass} ${getOpportunityTypeClass(opportunityType, typeFilter === opportunityType)}`}>{opportunityType}</button>
                        {visibleSocialContacts.length ? <span className={`${pillBaseClass} border-primary/50 bg-background text-primary`}>Social contacts</span> : null}
                      </div>
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{page.industry}</p>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        <span>Job posted: {formatDate(jobPostedDate)}</span>
                        <span>Round added: {formatDate(roundDate)}</span>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Posted role</p>
                      <p className="leading-relaxed text-foreground">{getPostedRoleTitle(page)}</p>
                    </div>

                    <Link to={`/company/${page.slug}`} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground no-underline transition-opacity hover:opacity-90">View page</Link>
                  </div>

                  {visibleSocialContacts.length ? (
                    <div className="mt-6 border-t border-border pt-5">
                      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Social-only contacts</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        {visibleSocialContacts.map((contact) => {
                          const contactKey = getContactKey(page, contact);
                          const isContacted = Boolean(contactedContacts[contactKey]);

                          return (
                            <div key={`${page.slug}-${contact.linkedinUrl}`} className="rounded-2xl border border-border bg-card p-4">
                              <div className="mb-4 flex items-start justify-between gap-3">
                                <a
                                  href={contact.linkedinUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group block no-underline"
                                  onClick={() => trackEvent("click_linkedin_profile", buildContactEventParams(page, contact))}
                                >
                                  <p className="m-0 font-display text-xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">{contact.name}</p>
                                  <p className="mt-1 text-sm font-semibold leading-relaxed text-primary">{contact.title}</p>
                                </a>
                                {isContacted ? <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Contacted</span> : null}
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <button type="button" onClick={() => openDraft(page, contact)} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">
                                  Draft message
                                </button>
                                <label className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                  <input type="checkbox" checked={isContacted} onChange={(event) => updateContactedStatus(page, contact, event.target.checked)} className="h-4 w-4" />
                                  Mark contacted
                                </label>
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
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Draft LinkedIn message</p>
                <h2 id="directory-social-draft-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{selectedDraft.contact.name}</h2>
                <a href={selectedDraft.contact.linkedinUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline" onClick={() => trackEvent("click_linkedin_profile", buildContactEventParams(selectedDraft.page, selectedDraft.contact))}>
                  Open LinkedIn profile
                </a>
              </div>
              <button type="button" onClick={() => setSelectedDraft(null)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Close draft message">
                Close
              </button>
            </div>
            <textarea readOnly value={selectedDraftMessage} className="h-72 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none" />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-md">Copy this message, open the LinkedIn profile, and personalize the final line if needed before sending.</p>
              <button type="button" onClick={copyDraft} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">
                {copyStatus}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
};

export default CompanyDirectoryPageV5;
