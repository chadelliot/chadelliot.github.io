const JOB_SOURCE_URLS: Record<string, string> = {
  "revive": "https://to.indeed.com/aa9xfl27v8cn",
  "momentum-healthcare-technology-consulting": "https://to.indeed.com/aa2jgn97xlkw",
  "brains": "https://to.indeed.com/aa62vcgz8gxw",
  "health-commerce": "https://to.indeed.com/aafwhlv6fcmh",
  "whole-womans-health": "https://to.indeed.com/aakvv6q98jl4",
  "fueled": "https://to.indeed.com/aapzkgjfsms4",
  "sleep-doctor": "https://to.indeed.com/aapvm8fjc4zv",
  "maleda-tech": "https://to.indeed.com/aahkjntcbrxb",
  "development-counsellors-international": "https://to.indeed.com/aaww6yfy2f6d"
};

const getProposalSlugFromArticle = (article: HTMLElement) => {
  const link = article.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
  return link?.getAttribute("href")?.replace("/company/", "") || "";
};

const linkDirectoryRoleTitles = () => {
  if (window.location.pathname !== "/company") return;

  const articles = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")) as HTMLElement[];
  articles.forEach((article) => {
    if (article.dataset.jobSourceLinked === "true") return;

    const slug = getProposalSlugFromArticle(article);
    const sourceUrl = JOB_SOURCE_URLS[slug];
    if (!sourceUrl) return;

    const rolePanel = article.querySelector(":scope > div:first-child > div:nth-child(2)") as HTMLElement | null;
    const roleText = rolePanel?.querySelector("p:nth-child(2)") as HTMLElement | null;
    if (!rolePanel || !roleText || roleText.querySelector("a")) return;

    const roleLabel = roleText.textContent?.trim() || "View original job listing";
    const link = document.createElement("a");
    link.href = sourceUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = "proposal-role-source-link";
    link.textContent = roleLabel;
    link.setAttribute("aria-label", `Open original job listing for ${roleLabel}`);

    roleText.textContent = "";
    roleText.appendChild(link);
    article.dataset.jobSourceLinked = "true";
  });
};

const bootDirectoryJobLinks = () => {
  window.setTimeout(linkDirectoryRoleTitles, 600);
  window.setTimeout(linkDirectoryRoleTitles, 1400);
  window.setTimeout(linkDirectoryRoleTitles, 2800);
  window.setTimeout(linkDirectoryRoleTitles, 5200);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootDirectoryJobLinks);
} else {
  bootDirectoryJobLinks();
}
