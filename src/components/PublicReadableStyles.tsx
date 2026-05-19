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

    /* My Approach: exact Customer Segmentation markup from the live grid */
    .public-readable .md\:grid-cols-\[300px_1fr\] .font-display.text-\[14px\],
    .public-readable .md\:grid-cols-\[300px_1fr\] .font-display.text-\[13px\] {
      font-size: 18px !important;
      line-height: 1.25 !important;
    }

    .public-readable .md\:grid-cols-\[300px_1fr\] .font-sans.text-\[11px\],
    .public-readable .md\:grid-cols-\[300px_1fr\] .font-sans.text-\[10px\] {
      font-size: 14.5px !important;
      line-height: 1.65 !important;
      letter-spacing: 0.01em !important;
    }

    .public-readable .md\:grid-cols-\[300px_1fr\] .font-mono.text-\[9px\] {
      font-size: 12px !important;
      line-height: 1.45 !important;
    }

    /* My Approach: exact Segmentation Inputs block */
    .public-readable .md\:grid-cols-\[1fr_auto_1fr\] > div:first-child > .font-mono.text-\[10px\] {
      font-size: 12px !important;
      letter-spacing: 0.12em !important;
      line-height: 1.35 !important;
    }

    .public-readable .md\:grid-cols-\[1fr_auto_1fr\] > div:first-child .font-sans.text-\[11px\] {
      font-size: 15px !important;
      line-height: 1.7 !important;
    }

    .public-readable .md\:grid-cols-\[1fr_auto_1fr\] > div:first-child .font-sans.text-\[11px\] span {
      font-size: 20px !important;
    }

    .public-readable .md\:grid-cols-\[1fr_auto_1fr\] > div:last-child > .font-sans.text-\[10px\] {
      font-size: 14.5px !important;
      line-height: 1.7 !important;
      letter-spacing: 0.03em !important;
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

    /* My Approach: exact Revenue Activation top-card markup */
    .public-readable .grid.grid-cols-2.md\:grid-cols-4.gap-3.md\:gap-4.mb-12 > div {
      padding: 36px 26px !important;
    }

    .public-readable .grid.grid-cols-2.md\:grid-cols-4.gap-3.md\:gap-4.mb-12 > div > div:first-child {
      font-size: 32px !important;
      line-height: 1 !important;
    }

    .public-readable .grid.grid-cols-2.md\:grid-cols-4.gap-3.md\:gap-4.mb-12 > div > .font-display.text-\[13px\] {
      font-size: 18px !important;
      line-height: 1.25 !important;
      margin-bottom: 8px !important;
    }

    .public-readable .grid.grid-cols-2.md\:grid-cols-4.gap-3.md\:gap-4.mb-12 > div > .font-sans.text-\[10px\] {
      font-size: 15px !important;
      line-height: 1.6 !important;
      margin-bottom: 14px !important;
    }

    .public-readable .grid.grid-cols-2.md\:grid-cols-4.gap-3.md\:gap-4.mb-12 > div > span.text-\[9px\] {
      font-size: 12px !important;
      letter-spacing: 0.09em !important;
      padding: 5px 10px !important;
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

      .public-readable .grid.grid-cols-2.md\:grid-cols-4.gap-3.md\:gap-4.mb-12 > div > .font-sans.text-\[10px\] {
        font-size: 14px !important;
      }

      .public-readable .md\:grid-cols-\[1fr_auto_1fr\] > div:first-child .font-sans.text-\[11px\] {
        font-size: 14px !important;
      }
    }
  `}</style>
);

export default PublicReadableStyles;
