import React, { useMemo, useState } from "react";

const TABS = [
  { id: "overview", label: "Strategic Overview" },
  { id: "intelligence", label: "Marketing Intelligence" },
  { id: "segmentation", label: "Customer Segmentation" },
  { id: "activation", label: "Revenue Activation" },
];

function TabButton({ active, children, onClick }) {
  return (
    <button type="button" className={"tab-btn" + (active ? " active" : "")} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Approach() {
  const [active, setActive] = useState("overview");

  const content = useMemo(() => {
    switch (active) {
      case "intelligence":
        return (
          <>
            <h3>Marketing Intelligence</h3>
            <p>
              Connect buyer, account, channel, and transactional signals into a usable layer for decision-making. The goal
              is operational clarity — who to prioritize, what to say, and where to activate.
            </p>
            <div className="story-cards">
              <article className="story-card">
                <h4>Unified Signal Layer</h4>
                <p>Combine commercial, web, campaign, and CRM inputs into one consistent view.</p>
                <ul>
                  <li>Improves prioritization quality</li>
                  <li>Reduces fragmentation</li>
                  <li>Supports confident activation</li>
                </ul>
              </article>
              <article className="story-card">
                <h4>Decision Support</h4>
                <p>Translate raw inputs into actionable frameworks for lifecycle, demand, and performance.</p>
                <ul>
                  <li>Sharper planning</li>
                  <li>Better targeting choices</li>
                  <li>Alignment to commercial goals</li>
                </ul>
              </article>
            </div>
          </>
        );
      case "segmentation":
        return (
          <>
            <h3>Customer Segmentation</h3>
            <p>
              Turn a large customer base into clear, actionable groups for targeting, retention planning, and budget
              allocation.
            </p>
            <div className="story-cards">
              <article className="story-card">
                <h4>Lifecycle Prioritization</h4>
                <p>Use recency, frequency, and value-based logic to identify risk and opportunity.</p>
                <ul>
                  <li>Highlights growth opportunities</li>
                  <li>Surfaces churn risk earlier</li>
                  <li>Improves spend discipline</li>
                </ul>
              </article>
              <article className="story-card">
                <h4>Activation Readiness</h4>
                <p>Move from static categories to next-best-action logic.</p>
                <ul>
                  <li>More relevant messaging</li>
                  <li>Consistent targeting</li>
                  <li>Better measurement conditions</li>
                </ul>
              </article>
            </div>
          </>
        );
      case "activation":
        return (
          <>
            <h3>Revenue Activation</h3>
            <p>
              Where unified data becomes action — orchestration, experimentation, content operations, and workflow
              automation that turns insight into measurable outcomes.
            </p>
            <div className="story-cards">
              <article className="story-card">
                <h4>Real-Time Customer Activation</h4>
                <p>Trigger timely outreach from connected profiles and behavioral signals.</p>
                <ul>
                  <li>Better timing improves conversion</li>
                  <li>More personalized journeys</li>
                  <li>Stronger pipeline quality</li>
                </ul>
              </article>
              <article className="story-card">
                <h4>Performance Automation</h4>
                <p>Shift execution faster based on segment + channel performance signals.</p>
                <ul>
                  <li>Improves efficiency</li>
                  <li>Reduces manual work</li>
                  <li>Agile execution</li>
                </ul>
              </article>
              <article className="story-card">
                <h4>Content & Workflow Scale</h4>
                <p>Structured operations that make launches repeatable without drag.</p>
                <ul>
                  <li>Faster launch cycles</li>
                  <li>Higher repeatability</li>
                  <li>Briefs → execution</li>
                </ul>
              </article>
              <article className="story-card">
                <h4>Measured Business Outcomes</h4>
                <p>Activation exists to create measurable, scalable growth — not just send more messages.</p>
                <ul>
                  <li>Clearer attribution pathways</li>
                  <li>Stronger ROI visibility</li>
                  <li>Better commercial alignment</li>
                </ul>
              </article>
            </div>
          </>
        );
      case "overview":
      default:
        return (
          <>
            <h3>Strategic Overview</h3>
            <p>
              Build a scalable marketing operating system: intelligence → segmentation → activation pathways that produce
              better outcomes.
            </p>
            <div className="story-grid">
              <div className="story-copy">
                <h3>System thinking over isolated tactics.</h3>
                <p>
                  The model prioritizes reusable infrastructure over one-off campaigns. With the right foundation and
                  activation framework, each initiative becomes easier to measure, easier to scale, and more aligned to
                  commercial priorities.
                </p>
              </div>
              <aside className="story-side">
                <div className="mini-grid">
                  <div className="mini-cell"><strong>Signals</strong><span>Data Inputs</span></div>
                  <div className="mini-cell"><strong>Logic</strong><span>Segmentation</span></div>
                  <div className="mini-cell"><strong>Action</strong><span>Activation</span></div>
                  <div className="mini-cell"><strong>ROI</strong><span>Measured Outcomes</span></div>
                </div>
              </aside>
            </div>
          </>
        );
    }
  }, [active]);

  return (
    <div className="container">
      <div className="section-header">
        <span className="section-num">02</span>
        <h2 className="section-title">
          My <em>Approach</em>
        </h2>
        <div className="section-line" />
      </div>

      <div className="tab-note">
        <p>
          Use the tabs to move through a four-part growth story — strategic overview, marketing intelligence, customer
          segmentation, and revenue activation — showing how unified data becomes measurable business outcomes.
        </p>
      </div>

      <div className="tab-overview">
        <div className="tab-overview-main">
          <div className="card-kicker">Strategic Overview</div>
          <h3 className="summary-title">A unified growth system built to turn intelligence into activation.</h3>
          <p className="section-intro" style={{ margin: 0, maxWidth: "none" }}>
            Rather than treating campaigns, segmentation, and reporting as separate workstreams, the approach here connects
            customer data, decisioning, and activation into one operating model. Unified signals inform prioritization,
            segmentation shapes targeting, and activation turns those insights into measurable commercial outcomes.
          </p>
        </div>
        <aside className="tab-overview-side">
          <div className="metric-stack"><div className="value">4</div><div className="label">Story Components</div></div>
          <div className="metric-stack"><div className="value">1</div><div className="label">Connected Operating Model</div></div>
          <div className="metric-stack"><div className="value">Data → Revenue</div><div className="label">Primary Narrative</div></div>
        </aside>
      </div>

      <div className="tab-nav">
        {TABS.map((t) => (
          <TabButton key={t.id} active={active === t.id} onClick={() => setActive(t.id)}>
            {t.label}
          </TabButton>
        ))}
      </div>

      <div className="tab-panel">
        <div className="story-panel">{content}</div>
      </div>
    </div>
  );
}
