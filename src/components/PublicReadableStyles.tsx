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

    .public-readable [class*="text-[10px]"]:not([class*="tracking"]):not(button):not(svg),
    .public-readable [class*="text-[11px]"]:not([class*="tracking"]):not(button):not(svg),
    .public-readable [class*="text-[12px]"]:not([class*="tracking"]):not(button):not(svg) {
      font-size: 14px !important;
      line-height: 1.65 !important;
    }

    .public-readable ul li[class*="text-[11px]"]:not([class*="tracking"]),
    .public-readable ul li[class*="text-[12px]"]:not([class*="tracking"]) {
      font-size: 15px !important;
      line-height: 1.72 !important;
    }

    .public-readable [class*="md:grid-cols-4"] > div {
      padding: 36px 26px !important;
    }

    .public-readable [class*="md:grid-cols-4"] > div > .font-display {
      font-size: 18px !important;
      line-height: 1.25 !important;
    }

    .public-readable [class*="md:grid-cols-4"] > div > .font-sans {
      font-size: 15px !important;
      line-height: 1.6 !important;
    }

    .public-readable [class*="300px_1fr"] .font-display {
      font-size: 18px !important;
      line-height: 1.25 !important;
    }

    .public-readable [class*="300px_1fr"] .font-sans:not([class*="tracking"]) {
      font-size: 14.5px !important;
      line-height: 1.65 !important;
    }

    .public-readable [class*="300px_1fr"] [class*="grid-cols-3"] > div > div:nth-child(2) {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 34px !important;
      height: 34px !important;
      margin-bottom: 14px !important;
      border: 1px solid hsl(var(--border)) !important;
      border-radius: 8px !important;
      background: hsl(var(--secondary)) !important;
      color: transparent !important;
      font-size: 0 !important;
    }

    .public-readable [class*="300px_1fr"] [class*="grid-cols-3"] > div > div:nth-child(2)::before {
      color: hsl(var(--muted-foreground)) !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 18px !important;
      font-weight: 800 !important;
      line-height: 1 !important;
    }

    .public-readable [class*="300px_1fr"] [class*="grid-cols-3"] > div:nth-child(1) > div:nth-child(2)::before { content: 'A'; }
    .public-readable [class*="300px_1fr"] [class*="grid-cols-3"] > div:nth-child(2) > div:nth-child(2)::before { content: '▱'; font-size: 22px !important; }
    .public-readable [class*="300px_1fr"] [class*="grid-cols-3"] > div:nth-child(3) > div:nth-child(2)::before { content: '↗'; font-size: 20px !important; }
    .public-readable [class*="300px_1fr"] [class*="grid-cols-3"] > div:nth-child(4) > div:nth-child(2)::before { content: '!'; font-size: 20px !important; }
    .public-readable [class*="300px_1fr"] [class*="grid-cols-3"] > div:nth-child(5) > div:nth-child(2)::before { content: '△'; font-size: 20px !important; }
    .public-readable [class*="300px_1fr"] [class*="grid-cols-3"] > div:nth-child(6) > div:nth-child(2)::before { content: '×'; font-size: 22px !important; }

    .public-readable [class*="1fr_auto_1fr"] > div:first-child .flex.flex-col > div > span {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 24px !important;
      height: 24px !important;
      border: 1px solid hsl(var(--border)) !important;
      border-radius: 6px !important;
      background: hsl(var(--secondary)) !important;
      color: transparent !important;
      font-size: 0 !important;
      flex-shrink: 0 !important;
    }

    .public-readable [class*="1fr_auto_1fr"] > div:first-child .flex.flex-col > div > span::before {
      color: hsl(var(--primary)) !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      font-weight: 800 !important;
      line-height: 1 !important;
    }

    .public-readable [class*="1fr_auto_1fr"] > div:first-child .flex.flex-col > div:nth-child(1) > span::before { content: '▥'; }
    .public-readable [class*="1fr_auto_1fr"] > div:first-child .flex.flex-col > div:nth-child(2) > span::before { content: '◌'; }
    .public-readable [class*="1fr_auto_1fr"] > div:first-child .flex.flex-col > div:nth-child(3) > span::before { content: '↗'; }
    .public-readable [class*="1fr_auto_1fr"] > div:first-child .flex.flex-col > div:nth-child(4) > span::before { content: '▣'; }

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
    }
  `}</style>
);

export default PublicReadableStyles;
