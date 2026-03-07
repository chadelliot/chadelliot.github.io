import React from "react";

const ITEMS = [
  {
    year: "2024–Present",
    company: "Enterprise Distributor (Confidential)",
    role: "Director, Digital Marketing & Marketing Operations",
    bullets: [
      "Built lifecycle + segmentation activation across large-scale branch footprint",
      "Standardized marketing ops workflows, measurement, and experimentation",
      "Improved insight-to-activation speed through connected data strategy"
    ],
    metrics: [
      { label: "Digital Revenue Scaled", value: "$1.25B" },
      { label: "Offline Sales Influenced", value: "$2.5B" },
      { label: "Leads / Quarter", value: "30,000" },
    ]
  },
  {
    year: "2017–2024",
    company: "Building Products",
    role: "Marketing Operations & Growth",
    bullets: [
      "Scaled digital demand programs and improved lead quality",
      "Expanded analytics + attribution practices for better ROI visibility",
      "Partnered with sales ops and call center to improve conversion"
    ],
    metrics: [
      { label: "Team Size", value: "11" },
      { label: "Marketing Budget", value: "$7M" },
      { label: "New Customers / QTR", value: "1,500" },
    ]
  }
];

export default function Career() {
  return (
    <div className="container">
      <div className="section-header">
        <span className="section-num">03</span>
        <h2 className="section-title">
          Career <em>Timeline</em>
        </h2>
        <div className="section-line" />
      </div>

      <div className="timeline">
        {ITEMS.map((it, idx) => (
          <div key={idx} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-year">{it.year}</div>
            <div className="timeline-company">{it.company}</div>
            <div className="timeline-role">{it.role}</div>

            <div className="timeline-body">
              <div>
                <ul className="timeline-achievements">
                  {it.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="timeline-metrics">
                {idx === 0 && (
                  <a
                    className="timeline-featured-link"
                    href="https://tv.nyse.com/videos/qxo-inc-nyse-qxo-rings-the-opening-bell-1"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="timeline-featured-icon">▶</span>
                    <span className="timeline-featured-text">NYSE Ceremony</span>
                    <span className="timeline-featured-star">★</span>
                  </a>
                )}

                {it.metrics.map((m, i) => (
                  <div key={i} className="metric-row">
                    <span className="metric-label">{m.label}</span>
                    <strong className="metric-value">{m.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
