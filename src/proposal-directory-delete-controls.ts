const DELETED_PROPOSALS_KEY = "aboutchad_deleted_proposal_slugs_v1";

const readDeletedProposals = () => {
  try {
    const values = JSON.parse(window.localStorage.getItem(DELETED_PROPOSALS_KEY) || "[]");
    return Array.isArray(values) ? new Set(values.filter((value) => typeof value === "string")) : new Set<string>();
  } catch {
    return new Set<string>();
  }
};

const saveDeletedProposals = (slugs: Set<string>) => {
  window.localStorage.setItem(DELETED_PROPOSALS_KEY, JSON.stringify(Array.from(slugs)));
};

const getSlugFromArticle = (article: HTMLElement) => {
  const link = article.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
  return link?.getAttribute("href")?.replace("/company/", "") || "";
};

const getCompanyNameFromArticle = (article: HTMLElement) => article.querySelector("h3")?.textContent?.trim() || "this proposal";

const hideDeletedProposalCards = () => {
  if (window.location.pathname !== "/company") return;
  const deleted = readDeletedProposals();
  const articles = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")) as HTMLElement[];
  articles.forEach((article) => {
    const slug = getSlugFromArticle(article);
    if (slug && deleted.has(slug)) article.remove();
  });
};

const maybeBlockDeletedProposalPage = () => {
  const match = window.location.pathname.match(/^\/company\/([^/]+)$/);
  if (!match) return;
  const slug = match[1];
  if (!readDeletedProposals().has(slug)) return;

  const main = document.querySelector("main") as HTMLElement | null;
  if (!main) return;
  main.innerHTML = `
    <section class="proposal-deleted-page-notice">
      <p>Proposal removed</p>
      <h1>This proposal has been deleted from your active directory.</h1>
      <a href="/company">Return to proposal directory</a>
    </section>
  `;
};

const confirmDeleteProposal = (article: HTMLElement) => {
  const slug = getSlugFromArticle(article);
  if (!slug) return;
  const company = getCompanyNameFromArticle(article);
  const confirmed = window.confirm(`Delete ${company} from your proposal directory? This will hide the role and its proposal landing page from this browser.`);
  if (!confirmed) return;

  const deleted = readDeletedProposals();
  deleted.add(slug);
  saveDeletedProposals(deleted);
  article.remove();
};

const addDeleteButtons = () => {
  if (window.location.pathname !== "/company") return;
  hideDeletedProposalCards();

  const articles = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")) as HTMLElement[];
  articles.forEach((article) => {
    if (article.querySelector(".proposal-delete-button")) return;
    article.classList.add("proposal-directory-card-with-delete");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "proposal-delete-button";
    button.textContent = "Delete";
    button.setAttribute("aria-label", `Delete ${getCompanyNameFromArticle(article)} from proposal directory`);
    button.addEventListener("click", () => confirmDeleteProposal(article));
    article.appendChild(button);
  });
};

const bootProposalDeleteControls = () => {
  maybeBlockDeletedProposalPage();
  window.setTimeout(addDeleteButtons, 800);
  window.setTimeout(addDeleteButtons, 1800);
  window.setTimeout(addDeleteButtons, 3600);
  window.setTimeout(addDeleteButtons, 5600);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootProposalDeleteControls);
} else {
  bootProposalDeleteControls();
}
