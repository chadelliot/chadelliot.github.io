import { type KeyboardEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { companyLandingPages } from "@/data/companyLandingPages";

const fallbackProofPoints = [
  "Built enterprise marketing infrastructure from zero, including funnel architecture, CDP activation, segmentation, attribution, and cross-functional growth operations.",
  "Scaled digital revenue impact to $1.25B and influenced $2.5B in branch sales through measurable marketing and revenue systems.",
  "Created a full-funnel engine generating roughly 30K leads, 10K qualified prospects, and 1,500 customers per quarter.",
  "Delivered measurable incremental return: $1.82 EBITDA for every $1 spent.",
];

const loopLayers = [
  {
    num: "01",
    title: "Data Foundation",
    shortDescription: "Clean, trusted revenue data",
    description: "We assess CRM structure, field usage, source-of-truth logic, data hygiene, and the quality of the information powering funnel, pipeline, and customer reporting.",
  },
  {
    num: "02",
    title: "System Alignment",
    shortDescription: "Connected definitions, workflows & ownership",
    description: "We align lifecycle definitions, handoff points, stakeholder ownership, and operating rhythms across marketing, sales, RevOps, and leadership.",
  },
  {
    num: "03",
    title: "Customer Intelligence",
    shortDescription: "Signals that reveal behavior & opportunity",
    description: "We identify the customer, account, and engagement signals that reveal intent, fit, expansion potential, and buying behavior.",
  },
  {
    num: "04",
    title: "Segmentation & Prioritization",
    shortDescription: "Frameworks for where to focus first",
    description: "We build segmentation and scoring logic to surface priority accounts, high-value opportunities, and the areas where teams should focus first.",
  },
  {
    num: "05",
    title: "GTM Activation",
    shortDescription: "Campaigns, workflows, routing & plays",
    description: "We translate insights into practical GTM motions, including workflows, sequences, routing logic, campaigns, and sales plays tied to defined signals.",
  },
  {
    num: "06",
    title: "Measurement & Optimization",
    shortDescription: "Closed-loop reporting tied to revenue outcomes",
    description: "We establish the reporting foundation needed to understand funnel conversion, pipeline movement, campaign performance, and future optimization opportunities.",
  },
];

const CompanyLandingPage = () => {
  const { slug } = useParams();
  const page = slug ? companyLandingPages[slug] : undefined;
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const activeLoopLayer = loopLayers[activeLayerIndex];

  const handleLayerKeyDown = (event: KeyboardEvent<SVGGElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveLayerIndex(index);
    }
  };

  const layerNodeClass = (index: number) => `layer-node ${activeLayerIndex === index ? "is-active" : ""}`;

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="px-6 md:px-20 pt-36 pb-24 max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">Company page</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            This company page is not published yet.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            The outreach page you are looking for may still be in draft. Return to the main site or contact Chad directly.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-primary-foreground no-underline transition-opacity hover:opacity-90"
          >
            Contact Chad
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const proofPoints = page.proofPoints?.length ? page.proofPoints : fallbackProofPoints;
  const proposal = page.proposal;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="px-6 md:px-20 pt-32 md:pt-36 pb-16 md:pb-20 border-b border-border">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-8 lg:gap-12 items-start">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold mb-4">{page.eyebrow}</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mb-6 leading-[0.98]">
                {page.headline}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
                {page.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={page.ctaHref}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-primary-foreground no-underline transition-opacity hover:opacity-90"
                >
                  {page.ctaLabel}
                </a>
                <Link
                  to="/career"
                  className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-foreground no-underline transition-colors hover:border-primary hover:text-primary"
                >
                  View background
                </Link>
              </div>
            </div>

            <aside className="rounded-3xl border border-border bg-card p-5 md:p-6 shadow-sm lg:sticky lg:top-28">
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-5">Proposal Snapshot</p>
              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Company</p>
                  <p className="text-foreground font-semibold leading-snug">{page.companyName}</p>
                </div>
                <div className="pb-4 border-b border-border">
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Category</p>
                  <p className="text-foreground font-semibold leading-snug">{page.industry}</p>
                </div>
                <div className="pb-4 border-b border-border">
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Engagement</p>
                  <p className="text-foreground font-semibold leading-snug">{page.recommendedEngagement.title}</p>
                </div>
                {proposal?.investment && (
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Commercial model</p>
                    <p className="text-foreground font-semibold leading-snug">{proposal.investment}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        <section className="px-6 md:px-20 py-14 md:py-18">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-14 items-start">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Situation</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                Why this conversation may be worth having.
              </h2>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                {proposal?.situation || page.fitSummary}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-14 md:py-18 bg-muted/40 border-y border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-8 md:gap-14 items-start">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Opportunity</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                Where I believe I can create leverage.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {proposal?.opportunity || page.fitSummary}
              </p>
            </div>
            <div className="grid gap-4">
              {page.likelyPriorities.map((priority) => (
                <div key={priority} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                  <p className="text-foreground font-medium leading-relaxed">{priority}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="approach-section">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Our approach</div>
              <h2>
                Six Layers.
                <small>One Closed-Loop Revenue Intelligence Stack.</small>
              </h2>
              <p>
                I build revenue systems as a connected operating model — one that links data,
                customer intelligence, go-to-market execution, and measurement into a closed loop.
                These six layers form the architecture behind that model.
              </p>
            </div>

            <div className="loop-wrap">
              <svg viewBox="0 0 800 720" xmlns="http://www.w3.org/2000/svg" className="closed-loop" aria-label="Closed-loop revenue intelligence stack with six connected layers">
                <defs>
                  <path id="loop-path" d="M 400,140 A 220,220 0 1 1 399.99,140" fill="none" />
                  <linearGradient id="loop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1f8a5e" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#5ed1ae" stopOpacity="0.55" />
                  </linearGradient>
                </defs>

                <circle cx="400" cy="360" r="246" fill="none" stroke="#e3e6e1" strokeWidth="1" strokeDasharray="2 8" opacity="0.5" />
                <circle cx="400" cy="360" r="220" fill="none" stroke="#e3e6e1" strokeWidth="2" />
                <circle cx="400" cy="360" r="220" fill="none" stroke="url(#loop-grad)" strokeWidth="2.5" strokeDasharray="4 26" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" from="0" to="-1382" dur="40s" repeatCount="indefinite" />
                </circle>
                <circle cx="400" cy="360" r="194" fill="none" stroke="#e3e6e1" strokeWidth="1" opacity="0.35" />

                <text x="400" y="346" textAnchor="middle" className="loop-eyebrow">CLOSED-LOOP</text>
                <text x="400" y="380" textAnchor="middle" className="loop-title">Revenue</text>
                <text x="400" y="410" textAnchor="middle" className="loop-title">Intelligence</text>

                <g className={layerNodeClass(0)} data-layer="1" tabIndex={0} role="button" aria-pressed={activeLayerIndex === 0} aria-label="Layer 01: Data Foundation" onClick={() => setActiveLayerIndex(0)} onKeyDown={(event) => handleLayerKeyDown(event, 0)}>
                  <circle cx="400" cy="140" r="44" className="node-bg" />
                  <text x="400" y="135" textAnchor="middle" className="node-tag">LAYER</text>
                  <text x="400" y="160" textAnchor="middle" className="node-num">01</text>
                </g>
                <text x="400" y="68" textAnchor="middle" className="layer-name">Data Foundation</text>
                <text x="400" y="88" textAnchor="middle" className="layer-desc">Clean, trusted revenue data</text>

                <g className={layerNodeClass(1)} data-layer="2" tabIndex={0} role="button" aria-pressed={activeLayerIndex === 1} aria-label="Layer 02: System Alignment" onClick={() => setActiveLayerIndex(1)} onKeyDown={(event) => handleLayerKeyDown(event, 1)}>
                  <circle cx="591" cy="250" r="44" className="node-bg" />
                  <text x="591" y="245" textAnchor="middle" className="node-tag">LAYER</text>
                  <text x="591" y="270" textAnchor="middle" className="node-num">02</text>
                </g>
                <text x="660" y="220" textAnchor="start" className="layer-name">System Alignment</text>
                <text x="660" y="240" textAnchor="start" className="layer-desc">Connected definitions,</text>
                <text x="660" y="256" textAnchor="start" className="layer-desc">workflows &amp; ownership</text>

                <g className={layerNodeClass(2)} data-layer="3" tabIndex={0} role="button" aria-pressed={activeLayerIndex === 2} aria-label="Layer 03: Customer Intelligence" onClick={() => setActiveLayerIndex(2)} onKeyDown={(event) => handleLayerKeyDown(event, 2)}>
                  <circle cx="591" cy="470" r="44" className="node-bg" />
                  <text x="591" y="465" textAnchor="middle" className="node-tag">LAYER</text>
                  <text x="591" y="490" textAnchor="middle" className="node-num">03</text>
                </g>
                <text x="660" y="466" textAnchor="start" className="layer-name">Customer Intelligence</text>
                <text x="660" y="486" textAnchor="start" className="layer-desc">Signals that reveal</text>
                <text x="660" y="502" textAnchor="start" className="layer-desc">behavior &amp; opportunity</text>

                <g className={layerNodeClass(3)} data-layer="4" tabIndex={0} role="button" aria-pressed={activeLayerIndex === 3} aria-label="Layer 04: Segmentation and Prioritization" onClick={() => setActiveLayerIndex(3)} onKeyDown={(event) => handleLayerKeyDown(event, 3)}>
                  <circle cx="400" cy="580" r="44" className="node-bg" />
                  <text x="400" y="575" textAnchor="middle" className="node-tag">LAYER</text>
                  <text x="400" y="600" textAnchor="middle" className="node-num">04</text>
                </g>
                <text x="400" y="650" textAnchor="middle" className="layer-name">Segmentation &amp; Prioritization</text>
                <text x="400" y="670" textAnchor="middle" className="layer-desc">Frameworks for where to focus first</text>

                <g className={layerNodeClass(4)} data-layer="5" tabIndex={0} role="button" aria-pressed={activeLayerIndex === 4} aria-label="Layer 05: GTM Activation" onClick={() => setActiveLayerIndex(4)} onKeyDown={(event) => handleLayerKeyDown(event, 4)}>
                  <circle cx="209" cy="470" r="44" className="node-bg" />
                  <text x="209" y="465" textAnchor="middle" className="node-tag">LAYER</text>
                  <text x="209" y="490" textAnchor="middle" className="node-num">05</text>
                </g>
                <text x="140" y="466" textAnchor="end" className="layer-name">GTM Activation</text>
                <text x="140" y="486" textAnchor="end" className="layer-desc">Campaigns, workflows,</text>
                <text x="140" y="502" textAnchor="end" className="layer-desc">routing &amp; plays</text>

                <g className={layerNodeClass(5)} data-layer="6" tabIndex={0} role="button" aria-pressed={activeLayerIndex === 5} aria-label="Layer 06: Measurement and Optimization" onClick={() => setActiveLayerIndex(5)} onKeyDown={(event) => handleLayerKeyDown(event, 5)}>
                  <circle cx="209" cy="250" r="44" className="node-bg" />
                  <text x="209" y="245" textAnchor="middle" className="node-tag">LAYER</text>
                  <text x="209" y="270" textAnchor="middle" className="node-num">06</text>
                </g>
                <text x="140" y="220" textAnchor="end" className="layer-name">Measurement &amp; Optimization</text>
                <text x="140" y="240" textAnchor="end" className="layer-desc">Closed-loop reporting</text>
                <text x="140" y="256" textAnchor="end" className="layer-desc">tied to revenue outcomes</text>

                <circle r="6" fill="#5ed1ae" opacity="0.95">
                  <animateMotion dur="14s" repeatCount="indefinite">
                    <mpath href="#loop-path" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>

              <div className="loop-detail" aria-live="polite">
                <div className="loop-detail-card">
                  <span className="num">{activeLoopLayer.num}</span>
                  <div className="text">
                    <p className="detail-eyebrow">Selected layer</p>
                    <strong>{activeLoopLayer.title}</strong>
                    <p>{activeLoopLayer.description}</p>
                  </div>
                </div>

                <div className="loop-mobile-controls" aria-label="Select revenue intelligence layer">
                  {loopLayers.map((layer, index) => (
                    <button
                      key={layer.num}
                      type="button"
                      className={activeLayerIndex === index ? "is-active" : ""}
                      onClick={() => setActiveLayerIndex(index)}
                      aria-pressed={activeLayerIndex === index}
                    >
                      {layer.num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20 bg-muted/40 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-14 items-start mb-10">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Recommended proposal</p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                  {page.recommendedEngagement.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{page.recommendedEngagement.description}</p>
              </div>
              <ul className="grid gap-4 list-none p-0 m-0">
                {page.recommendedEngagement.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-2xl bg-background border border-border p-5 text-foreground leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {proposal?.phases?.length ? (
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Engagement structure</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-8">
                  How the engagement would work.
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {proposal.phases.map((phase, index) => (
                    <div key={phase.title} className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-5">
                        {index + 1}
                      </div>
                      <p className="text-[11px] tracking-[0.16em] uppercase text-primary font-semibold mb-2">{phase.duration}</p>
                      <h3 className="font-display text-2xl font-extrabold text-foreground mb-3">{phase.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {proposal?.outcomes?.length ? (
          <section className="px-6 md:px-20 py-16 md:py-20">
            <div className="max-w-6xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-8 md:gap-14 items-start">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Expected outcomes</p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                  What the engagement should make clearer.
                </h2>
              </div>
              <div className="grid gap-4">
                {proposal.outcomes.map((outcome) => (
                  <div key={outcome} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-foreground font-medium leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-6 md:px-20 py-16 md:py-20 bg-muted/40 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Relevant proof</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-8">
              Built for complex, cross-functional revenue environments.
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {proofPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                  <p className="text-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] uppercase font-semibold opacity-80 mb-4">Next step</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              {page.outreachAngle}
            </h2>
            <a
              href={page.ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-foreground no-underline transition-opacity hover:opacity-90"
            >
              {page.ctaLabel}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyLandingPage;
