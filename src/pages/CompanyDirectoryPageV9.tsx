import CompanyDirectoryPageV8 from "./CompanyDirectoryPageV8";

const CompanyDirectoryPageV9 = () => (
  <>
    <style>{`
      .proposal-directory-page article > div:first-child {
        align-items: center !important;
      }

      .proposal-directory-page article > div:first-child > div:last-child {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        align-self: center !important;
        justify-content: flex-end !important;
        gap: 12px !important;
        min-width: max-content !important;
        padding: 8px 4px !important;
        background: #ffffff !important;
      }

      .proposal-directory-page article > div:first-child > div:last-child a,
      .proposal-directory-page article > div:first-child > div:last-child button {
        white-space: nowrap !important;
        flex: 0 0 auto !important;
      }

      .proposal-directory-page a[href*="linkedin.com/search/results/people"] {
        display: none !important;
      }

      @media (max-width: 767px) {
        .proposal-directory-page article > div:first-child > div:last-child {
          justify-content: flex-start !important;
          width: 100% !important;
          min-width: 0 !important;
        }
      }
    `}</style>
    <CompanyDirectoryPageV8 />
  </>
);

export default CompanyDirectoryPageV9;
