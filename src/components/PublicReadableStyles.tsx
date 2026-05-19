const PublicReadableStyles = () => (
  <style>{`
    .public-readable :where(p, li):not([class*="tracking"]):not([class*="font-display"]):not([class*="font-mono"]) {
      font-size: clamp(15px, 0.95vw, 16px) !important;
      line-height: 1.78 !important;
    }

    .public-readable li:not([class*="tracking"]):not([class*="font-display"]):not([class*="font-mono"]) {
      line-height: 1.72 !important;
    }

    @media (max-width: 640px) {
      .public-readable :where(p, li):not([class*="tracking"]):not([class*="font-display"]):not([class*="font-mono"]) {
        font-size: 15px !important;
        line-height: 1.75 !important;
      }
    }
  `}</style>
);

export default PublicReadableStyles;
