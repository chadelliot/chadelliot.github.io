const sourceHost = "https://to." + "indeed.com/";

const ORIGINAL_JOB_LISTING_PATHS: Record<string, string> = {
  revive: "aa9xfl27v8cn",
  "momentum-healthcare-technology-consulting": "aa2jgn97xlkw",
  brains: "aa62vcgz8gxw",
  "health-commerce": "aafwhlv6fcmh",
  "whole-womans-health": "aakvv6q98jl4",
  fueled: "aapzkgjfsms4",
  "sleep-doctor": "aapvm8fjc4zv",
  "maleda-tech": "aahkjntcbrxb",
  "development-counsellors-international": "aaww6yfy2f6d",
};

const getOriginalListingUrl = (slug: string) => {
  const path = ORIGINAL_JOB_LISTING_PATHS[slug];
  return path ? `${sourceHost}${path}` : "";
};

const getSlugFromArticle = (article: HTMLElement) => {
  const pageLink = article.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
  return pageLink?.getAttribute("href")?.replace("/company/", "") || "";
};

const linkRoleTitlesToOriginalListings = () => {
  if (window.location.pathname !== "/company") return;

  const articles = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")) as HTMLElement[];
  articles.forEach((article) => {
    if (article.dataset.originalRoleLinkReady === "true") return;
    const listingUrl = getOriginalListingUrl(getSlugFromArticle(article));
    if (!listingUrl) return;

    const rolePanel = article.querySelector(":scope > div:first-child > div:nth-child(2)") as HTMLElement | null;
    const roleText = rolePanel?.querySelector("p:nth-child(2)") as HTMLParagraphElement | null;
    if (!roleText || roleText.querySelector("a")) return;

    const label = roleText.textContent?.trim() || "Original job listing";
    const link = document.createElement("a");
    link.href = listingUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = "proposal-original-role-link";
    link.textContent = label;
    link.setAttribute("aria-label", `Open original job listing for ${label}`);

    roleText.textContent = "";
    roleText.appendChild(link);
    article.dataset.originalRoleLinkReady = "true";
  });
};

const bootRoleLinks = () => {
  window.setTimeout(linkRoleTitlesToOriginalListings, 500);
  window.setTimeout(linkRoleTitlesToOriginalListings, 1400);
  window.setTimeout(linkRoleTitlesToOriginalListings, 3000);
  window.setTimeout(linkRoleTitlesToOriginalListings, 5200);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootRoleLinks);
} else {
  bootRoleLinks();
}
