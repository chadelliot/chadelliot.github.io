const PROPOSAL_BASE_URL = "https://www.aboutchad.com/company";
let activeProposalSlug = "";

const ROLE_CONTEXT_BY_SLUG: Record<string, { role: string; company: string; value: string }> = {
  attest: { role: "Interim Senior Growth Marketing Manager", company: "Attest", value: "I build growth operating systems that connect lifecycle marketing + RevOps to measurable outcomes." },
  "who-gives-a-crap": { role: "Fractional Head of Marketing Operations & Planning", company: "Who Gives A Crap", value: "I build marketing operating systems that connect planning, execution + reporting to measurable outcomes." },
  enmacc: { role: "Revenue Business Manager", company: "enmacc", value: "I build revenue operating systems that connect CRO priorities, RevOps + execution to measurable outcomes." },
  revive: { role: "Fractional Go-To-Market Consultant", company: "Revive", value: "I build GTM operating systems that connect launch planning, enablement + AI workflows to measurable outcomes." },
  "sleep-doctor": { role: "GTM Product Marketing, B2B Physician Channel", company: "Sleep Doctor", value: "I build GTM operating systems that connect channel strategy, CRM workflows + pilot execution to measurable outcomes." },
  fueled: { role: "Senior Growth Strategist", company: "Fueled", value: "I build growth systems that connect SEO, AI search + analytics to measurable outcomes." },
  "momentum-healthcare-technology-consulting": { role: "Senior Healthcare Growth & Operations Consultant", company: "Momentum Healthcare and Technology Consulting", value: "I build growth operating systems that connect healthcare operations, technology + revenue execution to measurable outcomes." },
  turtl: { role: "Fractional VP of Customer Success", company: "Turtl", value: "I build customer operating systems that connect lifecycle visibility, retention + expansion to measurable outcomes." },
  acuvance: { role: "Director of Revenue Operations", company: "Acuvance", value: "I build revenue operating systems that connect CRM workflows, reporting + pipeline execution to measurable outcomes." },
  "town-web": { role: "Fractional CPQ and RevOps Architect", company: "Town Web", value: "I build RevOps systems that connect CPQ, CRM workflows + reporting to measurable outcomes." },
  farlinium: { role: "B2B Growth Marketing Manager", company: "Farlinium", value: "I build growth operating systems that connect demand generation, lifecycle + pipeline reporting to measurable outcomes." },
  "health-commerce": { role: "Digital Marketing Director", company: "Health & Commerce", value: "I build digital marketing systems that connect campaigns, CRM + reporting to measurable outcomes." },
  neolytix: { role: "Fractional Healthcare Growth Program Architect", company: "Neolytix", value: "I build healthcare growth systems that connect marketing, operations + reporting to measurable outcomes." },
  "maleda-tech": { role: "Staff Advanced Analyst, Marketing", company: "Maleda Tech", value: "I build lifecycle measurement systems that connect campaign experimentation + analytics to measurable outcomes." },
  brains: { role: "Senior Brand Strategist", company: "Brains", value: "I build strategy systems that connect positioning, messaging + growth execution to measurable outcomes." },
  "speridian-technologies": { role: "Principal GTM Strategy Lead", company: "Speridian Technologies", value: "I build GTM operating systems that connect strategy, workflows + revenue execution to measurable outcomes." },
  everist: { role: "Fractional VP Marketing", company: "Everist", value: "I build marketing operating systems that connect growth strategy, lifecycle + reporting to measurable outcomes." },
  "whole-womans-health": { role: "Fractional Marketing Director", company: "Whole Woman’s Health", value: "I build marketing systems that connect local search, patient acquisition + reporting to measurable outcomes." },
  "logic20-20": { role: "Solution Architect — Palantir Foundry", company: "Logic20/20", value: "I build operating systems that connect data, workflows + executive reporting to measurable outcomes." },
  "development-counsellors-international": { role: "Strategist", company: "Development Counsellors International", value: "I build strategy systems that connect research, positioning + measurement to measurable outcomes." },
  "software-solutions-firm-vp-sales": { role: "Fractional VP of Sales", company: "Software Solutions Firm", value: "I build revenue operating systems that connect sales strategy, workflows + reporting to measurable outcomes." },
};

const getArticleSlug = (element: Element | null) => {
  const article = element?.closest("article") as HTMLElement | null;
  const link = article?.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
  return link?.getAttribute("href")?.replace("/company/", "") || "";
};

const getProposalUrl = (slug: string) => `${PROPOSAL_BASE_URL}/${slug}`;

const getFirstNameFromModal = (modal: HTMLElement) => {
  const name = modal.querySelector("h2")?.textContent?.trim() || "there";
  return name.split(" ")[0] || name;
};

const buildShortLinkedInDraft = (modal: HTMLElement, slug: string) => {
  const context = ROLE_CONTEXT_BY_SLUG[slug];
  const firstName = getFirstNameFromModal(modal);
  const proposalUrl = getProposalUrl(slug);
  if (!context) {
    return `Hi ${firstName} — I saw the opportunity and wanted to introduce myself. I build growth and revenue operating systems tied to measurable outcomes. Would welcome the chance to connect.\n\nProposal page: ${proposalUrl}`;
  }
  return `Hi ${firstName} — I saw the ${context.role} opportunity with ${context.company}. ${context.value} Would welcome the chance to connect.\n\nProposal page: ${proposalUrl}`;
};

const isLinkedInDraftActive = (modal: HTMLElement) => {
  const activeTab = modal.querySelector(".proposal-draft-channel-button.is-active") as HTMLElement | null;
  const eyebrow = modal.querySelector(".proposal-extra-draft-modal__eyebrow, p:first-child") as HTMLElement | null;
  const textarea = modal.querySelector("textarea") as HTMLTextAreaElement | null;
  const activeLabel = `${activeTab?.textContent || ""} ${eyebrow?.textContent || ""} ${textarea?.dataset.currentChannel || ""}`.toLowerCase();
  return !activeLabel.includes("email") && (activeLabel.includes("linkedin") || !activeTab);
};

const updateOpenLinkedInDrafts = () => {
  if (!activeProposalSlug) return;
  const modals = Array.from(document.querySelectorAll("[role='dialog'], .proposal-extra-draft-modal")) as HTMLElement[];
  modals.forEach((modal) => {
    if (!isLinkedInDraftActive(modal)) return;
    const textarea = modal.querySelector("textarea") as HTMLTextAreaElement | null;
    if (!textarea) return;
    const updated = buildShortLinkedInDraft(modal, activeProposalSlug);
    if (updated === textarea.value) return;
    textarea.value = updated;
    textarea.dataset.currentDraft = updated;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const copyVisibleLinkedInDraft = async (button: HTMLElement, modal: HTMLElement) => {
  if (!isLinkedInDraftActive(modal)) return false;
  const textarea = modal.querySelector("textarea") as HTMLTextAreaElement | null;
  if (!textarea) return false;
  const updated = buildShortLinkedInDraft(modal, activeProposalSlug);
  textarea.value = updated;
  textarea.dataset.currentDraft = updated;
  await navigator.clipboard.writeText(updated);
  const originalText = button.textContent || "Copy message";
  button.textContent = "Copied";
  window.setTimeout(() => { button.textContent = originalText.includes("Copied") ? "Copy message" : originalText; }, 1200);
  return true;
};

const bootProposalDraftLinks = () => {
  if (window.location.pathname !== "/company") return;

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const draftButton = target?.closest("button") as HTMLButtonElement | null;
    if (draftButton && draftButton.textContent?.toLowerCase().includes("draft message")) {
      const slug = getArticleSlug(draftButton);
      if (slug) activeProposalSlug = slug;
      window.setTimeout(updateOpenLinkedInDrafts, 80);
      window.setTimeout(updateOpenLinkedInDrafts, 250);
      window.setTimeout(updateOpenLinkedInDrafts, 600);
      return;
    }

    const channelButton = target?.closest(".proposal-draft-channel-button") as HTMLButtonElement | null;
    if (channelButton) {
      window.setTimeout(updateOpenLinkedInDrafts, 60);
      window.setTimeout(updateOpenLinkedInDrafts, 180);
    }
  }, true);

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const copyButton = target?.closest("button") as HTMLElement | null;
    if (!copyButton) return;
    const label = copyButton.textContent?.toLowerCase() || "";
    const isCopy = label.includes("copy message") || copyButton.classList.contains("proposal-extra-draft-modal__copy");
    if (!isCopy) return;
    const modal = copyButton.closest("[role='dialog'], .proposal-extra-draft-modal") as HTMLElement | null;
    if (!modal) return;
    if (!isLinkedInDraftActive(modal)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    copyVisibleLinkedInDraft(copyButton, modal);
  }, true);

  const observer = new MutationObserver(() => window.setTimeout(updateOpenLinkedInDrafts, 50));
  observer.observe(document.body, { childList: true, subtree: true });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootProposalDraftLinks);
} else {
  bootProposalDraftLinks();
}
