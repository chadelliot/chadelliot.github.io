const CONTACT_SECTION_LABEL = "LinkedIn outreach contacts";

const titleRank = (title: string) => {
  const normalized = title.toLowerCase();
  if (/chief|\bcxo\b|\bceo\b|\bcro\b|\bcmo\b|founder|co-founder|president/.test(normalized)) return 100;
  if (/executive vice president|\bevp\b/.test(normalized)) return 95;
  if (/senior vice president|\bsvp\b/.test(normalized)) return 92;
  if (/vice president|\bvp\b/.test(normalized)) return 90;
  if (/head of|global head|department head/.test(normalized)) return 86;
  if (/senior director|sr\. director|sr director/.test(normalized)) return 82;
  if (/director/.test(normalized)) return 78;
  if (/principal|practice lead|lead strategist/.test(normalized)) return 74;
  if (/senior manager|sr\. manager|sr manager/.test(normalized)) return 68;
  if (/manager/.test(normalized)) return 62;
  if (/senior/.test(normalized)) return 56;
  if (/specialist|analyst|coordinator|associate/.test(normalized)) return 45;
  return 50;
};

const getCompanyName = (article: HTMLElement) => article.querySelector("h3")?.textContent?.trim() || "Company";

const getPostedRole = (article: HTMLElement) => {
  const rolePanel = article.querySelector(":scope > div:first-child > div:nth-child(2)") as HTMLElement | null;
  const role = rolePanel?.querySelector("p:nth-child(2)")?.textContent?.trim();
  return role || "marketing leadership";
};

const getContactTitle = (card: HTMLElement) => {
  return card.querySelector(".proposal-contact-detail-block a p:nth-child(2)")?.textContent?.trim()
    || card.querySelector("a p:nth-child(2)")?.textContent?.trim()
    || "";
};

const addLinkedInSearchButton = (article: HTMLElement) => {
  if (article.querySelector(".proposal-linkedin-search-button")) return;
  const company = getCompanyName(article);
  const role = getPostedRole(article);
  const query = encodeURIComponent(`site:linkedin.com/in ${company} ${role} marketing growth revenue operations`);
  const button = document.createElement("a");
  button.className = "proposal-linkedin-search-button";
  button.href = `https://www.google.com/search?q=${query}`;
  button.target = "_blank";
  button.rel = "noreferrer";
  button.textContent = "Search LinkedIn";
  button.setAttribute("aria-label", `Search LinkedIn for contacts at ${company}`);
  article.appendChild(button);
};

const getContactGrids = (article: HTMLElement) => {
  const grids: HTMLElement[] = [];

  const directSections = Array.from(article.querySelectorAll(":scope > div")) as HTMLElement[];
  directSections.forEach((section) => {
    if (!section.textContent?.includes(CONTACT_SECTION_LABEL)) return;
    const grid = section.querySelector(".grid") as HTMLElement | null;
    if (grid) grids.push(grid);
  });

  const extraGrid = article.querySelector(".proposal-extra-contact-section .grid") as HTMLElement | null;
  if (extraGrid && !grids.includes(extraGrid)) grids.push(extraGrid);

  return grids;
};

const sortAndLimitContactGrid = (grid: HTMLElement) => {
  if (grid.dataset.contactControlsReady === "true") return;
  const cards = Array.from(grid.children).filter((child) => child instanceof HTMLElement) as HTMLElement[];
  if (!cards.length) return;

  cards
    .sort((a, b) => titleRank(getContactTitle(b)) - titleRank(getContactTitle(a)))
    .forEach((card) => grid.appendChild(card));

  const sortedCards = Array.from(grid.children).filter((child) => child instanceof HTMLElement) as HTMLElement[];
  const shouldLimit = sortedCards.length > 2;
  sortedCards.forEach((card, index) => {
    card.classList.toggle("proposal-contact-hidden-by-limit", shouldLimit && index >= 2);
  });

  if (shouldLimit && !grid.nextElementSibling?.classList.contains("proposal-view-all-contacts-button")) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "proposal-view-all-contacts-button";
    toggle.textContent = `View all contacts (${sortedCards.length})`;
    toggle.addEventListener("click", () => {
      const expanded = grid.dataset.contactsExpanded === "true";
      grid.dataset.contactsExpanded = expanded ? "false" : "true";
      sortedCards.forEach((card, index) => {
        card.classList.toggle("proposal-contact-hidden-by-limit", expanded && index >= 2);
      });
      toggle.textContent = expanded ? `View all contacts (${sortedCards.length})` : "View fewer contacts";
    });
    grid.insertAdjacentElement("afterend", toggle);
  }

  grid.dataset.contactControlsReady = "true";
};

const addContactControls = () => {
  if (window.location.pathname !== "/company") return;
  const articles = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")) as HTMLElement[];
  articles.forEach((article) => {
    article.classList.add("proposal-directory-card-with-tools");
    addLinkedInSearchButton(article);
    getContactGrids(article).forEach(sortAndLimitContactGrid);
  });
};

const addLinkedInClickFallback = () => {
  document.addEventListener("click", (event) => {
    const link = (event.target as HTMLElement | null)?.closest(".proposal-contact-detail-block a[href*='linkedin.com']") as HTMLAnchorElement | null;
    if (!link) return;
    event.stopPropagation();
    window.open(link.href, "_blank", "noopener,noreferrer");
  }, true);
};

const bootContactControls = () => {
  addLinkedInClickFallback();
  window.setTimeout(addContactControls, 900);
  window.setTimeout(addContactControls, 1800);
  window.setTimeout(addContactControls, 3400);
  window.setTimeout(addContactControls, 5400);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootContactControls);
} else {
  bootContactControls();
}
