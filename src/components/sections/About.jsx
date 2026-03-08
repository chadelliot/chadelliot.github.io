import React from "react";

export default function About() {
  return (
    <>
      <div className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow-greeting">
            Hello, I’m <em>Chad</em>
          </div>
          <h1 className="hero-name">
            Growth systems,
            <br />
            marketing intelligence,
            <br />
            and <em>activation</em>.
          </h1>
          <div className="hero-title">
            Digital Marketing & Marketing Operations Leader • Advisor • Entrepreneur
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">15+</div>
              <div className="hero-stat-label">Years Experience</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">$250K</div>
              <div className="hero-stat-label">Ecommerce Revenue</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">600+</div>
              <div className="hero-stat-label">Locations Supported</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">ROI</div>
              <div className="hero-stat-label">Systems First</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-grid-bg" />
          <div className="hero-orb" />
          <div className="hero-photo-wrap">
            <div className="hero-photo-frame">
              <div className="hero-photo-placeholder" aria-hidden="true" />
            </div>
            <div className="hero-photo-tag">
              <span className="tag-dot" />
              <span className="tag-text">AboutChad.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-item">
            MARKETING OPS <span>•</span> SEGMENTATION <span>•</span> LIFECYCLE <span>•</span> ATTRIBUTION <span>•</span> ACTIVATION <span>•</span>
          </div>
          <div className="marquee-item">
            MARKETING OPS <span>•</span> SEGMENTATION <span>•</span> LIFECYCLE <span>•</span> ATTRIBUTION <span>•</span> ACTIVATION <span>•</span>
          </div>
        </div>
      </div>

      <section className="pillars-section">
        <div className="section-header">
          <span className="section-num">01</span>
          <h2 className="section-title">
            Three <em>Pillars</em>
          </h2>
          <div className="section-line" />
        </div>

        <div className="pillars-intro">
          <p>
            My career spans enterprise growth leadership, advisory work for national retail brands, and entrepreneurship—united by a focus on segmentation, marketing intelligence, lifecycle strategy, and building systems that turn insight into measurable revenue growth.
          </p>
        </div>

        <div className="pillars-grid">
          <article className="pillar-card">
            <div className="pillar-kicker">Enterprise Growth</div>
            <div className="pillar-title">Operator</div>
            <div className="pillar-org">Marketing leadership</div>
            <div className="pillar-copy">
              Build growth infrastructure that scales: lifecycle programs, segmentation, measurement, and activation.
            </div>
            <ul className="pillar-points">
              <li>Lifecycle & demand systems</li>
              <li>Measurement & attribution clarity</li>
              <li>Cross-functional execution</li>
            </ul>
            <div className="pillar-footer">
              <div>
                <div className="pillar-metric">600+</div>
                <div className="pillar-metric-label">Locations Supported</div>
              </div>
              <a className="pillar-link" href="#approach" onClick={(e)=>e.preventDefault()}>
                Explore →
              </a>
            </div>
          </article>

          <article className="pillar-card">
            <div className="pillar-kicker">Advisory</div>
            <div className="pillar-title">Strategist</div>
            <div className="pillar-org">National retail brands</div>
            <div className="pillar-copy">
              Consult on segmentation, CLV frameworks, and marketing operations systems to drive measurable lift.
            </div>
            <ul className="pillar-points">
              <li>Segmentation & CLV modeling</li>
              <li>Ops + lifecycle frameworks</li>
              <li>Data-to-activation playbooks</li>
            </ul>
            <div className="pillar-footer">
              <div>
                <div className="pillar-metric">2</div>
                <div className="pillar-metric-label">National Retail Advisory Clients</div>
              </div>
              <a className="pillar-link" href="#career" onClick={(e)=>e.preventDefault()}>
                Career →
              </a>
            </div>
          </article>

          <article className="pillar-card">
            <div className="pillar-kicker">Entrepreneurship</div>
            <div className="pillar-title">Builder</div>
            <div className="pillar-org">Hidden Gems</div>
            <div className="pillar-copy">
              Multi-platform ecommerce retailer and creator of The Blueprint course.
            </div>
            <ul className="pillar-points">
              <li>Amazon + Walmart retail ops</li>
              <li>Course + community building</li>
              <li>Systems that run autonomously</li>
            </ul>
            <div className="pillar-footer">
              <div>
                <div className="pillar-metric">$250K</div>
                <div className="pillar-metric-label">Annual Revenue</div>
              </div>
              <a className="pillar-link" href="https://hiddengemsmd.com/courses/blueprint/" target="_blank" rel="noreferrer">
                Course →
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
