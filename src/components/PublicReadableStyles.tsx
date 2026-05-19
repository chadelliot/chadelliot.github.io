const PublicReadableStyles = () => (
  <style>{`
    .public-readable :where(p, li):not([class*="tracking"]):not([class*="font-display"]):not([class*="font-mono"]) {
      font-size: clamp(15px, 0.95vw, 16px) !important;
      line-height: 1.78 !important;
    }

    .public-readable li:not([class*="tracking"]):not([class*="font-display"]):not([class*="font-mono"]) {
      line-height: 1.72 !important;
    }

    .public-readable #tab-bar-scroll button {
      font-size: clamp(12px, 0.85vw, 13px) !important;
      letter-spacing: 0.09em !important;
      line-height: 1.25 !important;
    }

    .public-readable #tab-segmentation,
    .public-readable #tab-activation {
      font-size: clamp(13px, 0.95vw, 14px) !important;
      letter-spacing: 0.075em !important;
      padding-top: 16px !important;
      padding-bottom: 14px !important;
    }

    .public-readable [class*="text-[10px]"]:not([class*="tracking"]):not([class*="font-mono"]):not(button):not(span),
    .public-readable [class*="text-[11px]"]:not([class*="tracking"]):not([class*="font-mono"]):not(button):not(span),
    .public-readable [class*="text-[12px]"]:not([class*="tracking"]):not([class*="font-mono"]):not(button):not(span) {
      font-size: 14px !important;
      line-height: 1.65 !important;
    }

    .public-readable ul li[class*="text-[11px]"],
    .public-readable ul li[class*="text-[12px]"] {
      font-size: 15px !important;
      line-height: 1.72 !important;
    }

    /* My Approach: Customer Segmentation card grid */
    .public-readable [class*="300px_1fr"] [class*="text-[10px]"],
    .public-readable [class*="300px_1fr"] [class*="text-[11px]"] {
      font-size: 13.5px !important;
      line-height: 1.6 !important;
      letter-spacing: 0.01em !important;
    }

    .public-readable [class*="300px_1fr"] .font-display[class*="text-[13px]"],
    .public-readable [class*="300px_1fr"] .font-display[class*="text-[14px]"] {
      font-size: 17px !important;
      line-height: 1.25 !important;
    }

    .public-readable [class*="300px_1fr"] [class*="text-[24px]"] {
      font-size: 30px !important;
    }

    .public-readable [class*="300px_1fr"] .font-mono[class*="text-[9px]"] {
      font-size: 11px !important;
      letter-spacing: 0.06em !important;
    }

    /* My Approach: Revenue Activation outcome cards */
    .public-readable [class*="md:grid-cols-4"] > div {
      padding: 34px 24px !important;
    }

    .public-readable [class*="md:grid-cols-4"] > div > .font-display {
      font-size: 17px !important;
      line-height: 1.25 !important;
    }

    .public-readable [class*="md:grid-cols-4"] > div > .font-sans {
      font-size: 14px !important;
      line-height: 1.6 !important;
    }

    .public-readable [class*="md:grid-cols-4"] > div > span {
      font-size: 11px !important;
      letter-spacing: 0.09em !important;
      padding: 4px 9px !important;
    }

    .public-readable [class*="md:grid-cols-4"] > div > [class*="text-[24px]"] {
      font-size: 30px !important;
    }

    @media (max-width: 640px) {
      .public-readable :where(p, li):not([class*="tracking"]):not([class*="font-display"]):not([class*="font-mono"]) {
        font-size: 15px !important;
        line-height: 1.75 !important;
      }

      .public-readable #tab-bar-scroll button,
      .public-readable #tab-segmentation,
      .public-readable #tab-activation {
        font-size: 12px !important;
        letter-spacing: 0.075em !important;
      }

      .public-readable [class*="300px_1fr"] [class*="text-[10px]"],
      .public-readable [class*="300px_1fr"] [class*="text-[11px]"] {
        font-size: 13px !important;
      }

      .public-readable [class*="md:grid-cols-4"] > div > .font-sans {
        font-size: 13.5px !important;
      }
    }
  `}</style>
);

export default PublicReadableStyles;
