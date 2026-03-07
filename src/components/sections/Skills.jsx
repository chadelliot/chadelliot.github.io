import React from "react";

export default function Skills() {
  return (
    <div className="container">
      <div className="section-header">
        <span className="section-num">04</span>
        <h2 className="section-title">
          Skills & <em>Credentials</em>
        </h2>
        <div className="section-line" />
      </div>

      <div className="expertise-grid">
        {[
          ["01", "Marketing Ops", "Systems, governance, workflow automation, measurement standards."],
          ["02", "Segmentation", "RFM, lifecycle stages, micro-segments, activation logic."],
          ["03", "Attribution", "Full-funnel reporting, performance visibility, ROI narratives."],
          ["04", "Lifecycle", "Onboarding, retention, winback, loyalty, next-best-action."],
          ["05", "Data Strategy", "Unifying signals across platforms into actionable intelligence."],
          ["06", "Activation", "Experimentation, orchestration, channel optimization."],
        ].map(([n, t, d]) => (
          <article key={n} className="expertise-card">
            <div className="expertise-num">{n}</div>
            <div className="expertise-name">{t}</div>
            <div className="expertise-desc">{d}</div>
          </article>
        ))}
      </div>

      <div style={{ height: 72 }} />

      <div className="edu-grid">
        <div className="edu-card">
          <div className="edu-school">Illinois Institute of Technology</div>
          <div className="edu-degree">M.S. — Information Technology & Management</div>
          <div className="edu-field">Chicago, IL</div>
          <div className="edu-years">Graduate</div>
        </div>
        <div className="edu-card">
          <div className="edu-school">Illinois Institute of Technology</div>
          <div className="edu-degree">B.S. — Business Administration</div>
          <div className="edu-field">Chicago, IL</div>
          <div className="edu-years">Undergraduate</div>
        </div>
      </div>

      <div className="certs-grid">
        {[
          "HubSpot (Marketing/CRM)",
          "Salesforce (CRM/Marketing)",
          "Google Analytics",
          "Adobe Analytics",
          "Experimentation & Testing",
        ].map((c) => (
          <div key={c} className="cert-card">
            <div className="cert-icon">✓</div>
            <div className="cert-name">{c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
