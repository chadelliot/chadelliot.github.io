const PROPOSAL_BASE_URL = "https://www.aboutchad.com/company";
let activeProposalSlug = "";

const getArticleSlug = (element: Element | null) => {
  const article = element?.closest("article") as HTMLElement | null;
  const link = article?.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
  return link?.getAttribute("href")?.replace("/company/", "") || "";
};

const getProposalUrl = (slug: string) => `${PROPOSAL_BASE_URL}/${slug}`;

const isLinkedInDraftActive = (modal: HTMLElement) => {
  const activeTab = modal.querySelector(".proposal-draft-channel-button.is-active") as HTMLElement | null;
  const eyebrow = modal.querySelector(".proposal-extra-draft-modal__eyebrow, p:first-child") as HTMLElement | null;
  const textarea = modal.querySelector("textarea") as HTMLTextAreaElement | null;
  const activeLabel = `${activeTab?.textContent || ""} ${eyebrow?.textContent || ""} ${textarea?.dataset.currentChannel || ""}`.toLowerCase();
  return !activeLabel.includes("email") && (activeLabel.includes("linkedin") || !activeTab);
};

const appendProposalLink = (message: string, slug: string) => {
  if (!slug) return message;
  const proposalUrl = getProposalUrl(slug);
  if (message.includes(proposalUrl)) return message;

  const linkLine = `\n\nProposal page: ${proposalUrl}`;
  return `${message.trim()}${linkLine}`;
};

const updateOpenLinkedInDrafts = () => {
  if (!activeProposalSlug) return;
  const modals = Array.from(document.querySelectorAll("[role='dialog'], .proposal-extra-draft-modal")) as HTMLElement[];
  modals.forEach((modal) => {
    if (!isLinkedInDraftActive(modal)) return;
    const textarea = modal.querySelector("textarea") as HTMLTextAreaElement | null;
    if (!textarea) return;
    const updated = appendProposalLink(textarea.value, activeProposalSlug);
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
  const updated = appendProposalLink(textarea.value, activeProposalSlug);
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
