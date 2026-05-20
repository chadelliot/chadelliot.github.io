import { useEffect } from "react";
import CompanyDirectoryPageV8 from "./CompanyDirectoryPageV8";

const buildLinkedInSearchUrl = (companyName: string) =>
  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${companyName} marketing revenue operations leader`)}`;

const CompanyDirectoryPageV9 = () => {
  useEffect(() => {
    const restoreFindLeadersLinks = () => {
      document.querySelectorAll<HTMLElement>(".proposal-directory-page article").forEach((article) => {
        const companyName = article.querySelector("h3")?.textContent?.trim();
        const actionContainer = article.querySelector<HTMLElement>("div:first-child > div:last-child");

        if (!companyName || !actionContainer) return;

        const existingFindLeaders = actionContainer.querySelector<HTMLAnchorElement>('a[data-directory-find-leaders="true"]');
        if (existingFindLeaders) return;

        const findLeadersLink = document.createElement("a");
        findLeadersLink.href = buildLinkedInSearchUrl(companyName);
        findLeadersLink.target = "_blank";
        findLeadersLink.rel = "noreferrer";
        findLeadersLink.textContent = "Find leaders";
        findLeadersLink.dataset.directoryFindLeaders = "true";
        findLeadersLink.className = "directory-find-leaders-link inline-flex items-center justify-center rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0F172A] no-underline transition-colors hover:border-primary hover:text-primary";

        actionContainer.prepend(findLeadersLink);
      });
    };

    restoreFindLeadersLinks();
    const observer = new MutationObserver(restoreFindLeadersLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .proposal-directory-page article > div:first-child {
          align-items: center !important;
        }

        .proposal-directory-page article > div:first-child > div:last-child {
          display: grid !important;
          grid-template-columns: max-content max-content !important;
          grid-auto-rows: max-content !important;
          align-items: center !important;
          align-self: center !important;
          justify-content: end !important;
          column-gap: 12px !important;
          row-gap: 10px !important;
          padding: 10px 4px !important;
          background: #ffffff !important;
          min-width: max-content !important;
        }

        .proposal-directory-page article > div:first-child > div:last-child .directory-find-leaders-link {
          grid-column: 1 / -1 !important;
          justify-self: end !important;
          white-space: nowrap !important;
        }

        .proposal-directory-page article > div:first-child > div:last-child a:not(.directory-find-leaders-link),
        .proposal-directory-page article > div:first-child > div:last-child button {
          white-space: nowrap !important;
          width: auto !important;
          min-width: 112px !important;
        }

        @media (max-width: 767px) {
          .proposal-directory-page article > div:first-child > div:last-child {
            justify-content: start !important;
            min-width: 0 !important;
            width: 100% !important;
          }

          .proposal-directory-page article > div:first-child > div:last-child .directory-find-leaders-link {
            justify-self: start !important;
          }
        }
      `}</style>
      <CompanyDirectoryPageV8 />
    </>
  );
};

export default CompanyDirectoryPageV9;
