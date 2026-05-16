import { type FormEvent, type KeyboardEvent, useEffect, useState } from "react";
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
    examples: [
      "Define clean lifecycle, source, segment, and revenue fields across CRM, marketing automation, and CDP systems.",
      "Create trusted funnel and attribution datasets that leadership can use for customer, prospect, and campaign decisions.",
    ],
  },
  {
    num: "02",
    title: "System Alignment",
    shortDescription: "Connected definitions, workflows & ownership",
    description: "We align lifecycle definitions, handoff points, stakeholder ownership, and operating rhythms across marketing, sales, RevOps, and leadership.",
    examples: [
      "Clarify lead, prospect, customer, nurture, sales handoff, and reactivation definitions across teams.",
      "Build an operating cadence between marketing, sales, analytics, technology, and finance stakeholders.",
    ],
  },
  {
    num: "03",
    title: "Customer Intelligence",
    shortDescription: "Signals that reveal behavior & opportunity",
    description: "We identify the customer, account, and engagement signals that reveal intent, fit, expansion potential, and buying behavior.",
    examples: [
      "Use account, buyer, engagement, website, loyalty, credit, event, and product-interest signals to improve prioritization.",
      "Develop signal logic for next-best-action, offer relevance, content targeting, or lifecycle triggers.",
    ],
  },
  {
    num: "04",
    title: "Segmentation & Prioritization",
    shortDescription: "Frameworks for where to focus first",
    description: "We build segmentation and scoring logic to surface priority accounts, high-value opportunities, and the areas where teams should focus first.",
    examples: [
      "Create RFM, lifecycle, value-prop affinity, business-priority, or content-relevance segments.",
      "Prioritize accounts by revenue potential, engagement, product fit, loyalty status, retention risk, or expansion opportunity.",
    ],
  },
  {
    num: "05",
    title: "GTM Activation",
    shortDescription: "Campaigns, workflows, routing & plays",
    description: "We translate insights into practical GTM motions, including workflows, sequences, routing logic, campaigns, and sales plays tied to defined signals.",
    examples: [
      "Launch lifecycle campaigns, sales plays, personalized landing pages, offer workflows, and branch or market-based follow-up paths.",
      "Use content frameworks to turn contractor problems, business priorities, and value propositions into targeted campaigns.",
    ],
  },
  {
    num: "06",
    title: "Measurement & Optimization",
    shortDescription: "Closed-loop reporting tied to revenue outcomes",
    description: "We establish the reporting foundation needed to understand funnel conversion, pipeline movement, campaign performance, and future optimization opportunities.",
    examples: [
      "Build executive reporting that connects activity to qualified prospects, customer conversion, revenue, EBITDA return, and retention.",
      "Use performance feedback to refine segments, offers, workflows, channel mix, and next-best-action logic.",
    ],
  },
];

const nodePositions = [
  { cx: 400, cy: 140, nameX: 400, nameY: 68, descX: 400, descY: 88, anchor: "middle" as const, descLines: ["Clean, trusted revenue data"] },
  { cx: 591, cy: 250, nameX: 660, nameY: 220, descX: 660, descY: 240, anchor: "start" as const, descLines: ["Connected definitions,", "workflows & ownership"] },
  { cx: 591, cy: 470, nameX: 660, nameY: 466, descX: 660, descY: 486, anchor: "start" as const, descLines: ["Signals that reveal", "behavior & opportunity"] },
  { cx: 400, cy: 580, nameX: 400, nameY: 650, descX: 400, descY: 670, anchor: "middle" as const, descLines: ["Frameworks for where to focus first"] },
  { cx: 209, cy: 470, nameX: 140, nameY: 466, descX: 140, descY: 486, anchor: "end" as const, descLines: ["Campaigns, workflows,", "routing & plays"] },
  { cx: 209, cy: 250, nameX: 140, nameY: 220, descX: 140, descY: 240, anchor: "end" as const, descLines: ["Closed-loop reporting", "tied to revenue outcomes"] },
];

const outcomeHeadlineFallbacks = [
  "Decision visibility",
  "Prioritized roadmap",
  "Stakeholder alignment",
  "Executive-ready package",
  "Measurement clarity",
  "Next-step confidence",
];

const buildOutcomeContent = (outcome: string, index: number) => ({
  headline: outcomeHeadlineFallbacks[index] || "Decision-ready output",
  description: outcome,
});

const getTimelineForCompletion = (phases?: { duration: string }[]) => {
  const explicitTimelines = phases
    ?.map((phase) => phase.duration.trim())
    .filter((duration) => duration && !/^phase\s+\d+$/i.test(duration));

  return explicitTimelines?.length
    ? explicitTimelines.join(" / ")
    : "Timeline to be confirmed during scoping.";
};

const getCommercialModel = (investment?: string) => {
  if (!investment) return null;

  const isAnnualSalary = /annual|salary|full-time/i.test(investment);
  if (isAnnualSalary) return null;

  return investment;
};

const CompanyLandingPage = () => {
  const { slug } = useParams();
  const page = slug ? companyLandingPages[slug] : undefined;
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const selectedLayer = selectedLayerIndex !== null ? loopLayers[selectedLayerIndex] : null;

  useEffect(() => {
    if (selectedLayerIndex === null) return;

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedLayerIndex(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedLayerIndex]);

  useEffect(() => {
    if (!isContactOpen) return;

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsContactOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isContactOpen]);

  const handleLayerKeyDown = (event: KeyboardEvent<SVGGElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedLayerIndex(index);
    }
  };

  const layerNodeClass = (index: number) => `layer-node ${selectedLayerIndex === index ? "is-active" : ""}`;

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
  const engagementBullets = page.recommendedEngagement.bullets;
  const shouldOpenContactDrawer = page.ctaLabel.toLowerCase().includes("discuss") && page.ctaLabel.toLowerCase().includes("fit");
  const phaseDetails = proposal?.phases.map((phase, index) => {
    const detailGroups = [
      engagementBullets.slice(0, 2),
      engagementBullets.slice(1, 3),
      engagementBullets.slice(2, 4),
    ];

    return {
      ...phase,
      details: detailGroups[index] || engagementBullets.slice(0, 2),
    };
  }) || [];
  const timelineForCompletion = getTimelineForCompletion(proposal?.phases);
  const commercialModel = getCommercialModel(proposal?.investment);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`${page.companyName} project fit`);
    const body = encodeURIComponent(
      [
        `Name: ${formData.get("name") || ""}`,
        `Email: ${formData.get("email") || ""}`,
        `Company: ${formData.get("company") || page.companyName}`,
        "",
        "Project context:",
        `${formData.get("message") || ""}`,
      ].join("\n"),
    );

    window.location.href = `mailto:cparker@audaption.com?subject=${subject}&body=${body}`;
  };

  const renderPrimaryCta = (variant: "hero" | "footer" = "hero") => {
    const className =
      variant === "footer"
        ? "inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-foreground no-underline transition-opacity hover:opacity-90"
        : "inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-primary-foreground no-underline transition-opacity hover:opacity-90";

    if (shouldOpenContactDrawer) {
      return (
        <button type="button" onClick={() => setIsContactOpen(true)} className={className}>
          {page.ctaLabel}
        </button>
      );
    }

    return (
      <a href={page.ctaHref} className={className}>
        {page.ctaLabel}
      </a>
    );
  };

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
                {renderPrimaryCta()}
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
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Timeline for completion</p>
                  <p className="text-foreground font-semibold leading-snug">{timelineForCompletion}</p>
                </div>
                <div className="pb-4 border-b border-border">
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Engagement</p>
                  <p className="text-foreground font-semibold leading-snug">{page.recommendedEngagement.title}</p>
                </div>
                {commercialModel && (
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Commercial model</p>
                    <p className="text-foreground font-semibold leading-snug">{commercialModel}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        <section id="opportunity" className="approach-section">
          <div className="wrap">
            <div className="section-head section-head-wide">
              <div className="eyebrow">Situation → Opportunity</div>
              <h2>Where I believe I can create leverage.</h2>
              <p>
                A concise read on the friction, the opportunity, and the closed-loop system I would use to turn that opportunity into measurable execution.
              </p>
            </div>

            <div className="opportunity-bridge">
              <div className="opportunity-brief-card">
                <span>What I see</span>
                <p>{proposal?.situation || page.fitSummary}</p>
              </div>
              <div className="opportunity-brief-card is-resolution">
                <span>How I’d resolve it</span>
                <p>{proposal?.opportunity || page.fitSummary}</p>
              </div>
            </div>

            <div
              className="approach-loop-intro"
              style={{ gridTemplateColumns: "minmax(0, 1fr)", marginBottom: "-6px" }}
            >
              <div>
                <span>Approach system</span>
                <p className="m-0 mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                  Six steps that account for the full picture: data, alignment, customer signals, prioritization, activation, and measurement — moving from diagnosis to revenue accountability.
                </p>
              </div>
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

                {loopLayers.map((layer, index) => {
                  const position = nodePositions[index];

                  return (
                    <g key={layer.num}>
                      <g className={layerNodeClass(index)} data-layer={index + 1} tabIndex={0} role="button" aria-pressed={selectedLayerIndex === index} aria-label={`Layer ${layer.num}: ${layer.title}`} onClick={() => setSelectedLayerIndex(index)} onKeyDown={(event) => handleLayerKeyDown(event, index)}>
                        <circle cx={position.cx} cy={position.cy} r="44" className="node-bg" />
                        <text x={position.cx} y={position.cy - 5} textAnchor="middle" className="node-tag">LAYER</text>
                        <text x={position.cx} y={position.cy + 20} textAnchor="middle" className="node-num">{layer.num}</text>
                      </g>
                      <text x={position.nameX} y={position.nameY} textAnchor={position.anchor} className="layer-name">{layer.title}</text>
                      {position.descLines.map((line, lineIndex) => (
                        <text key={line} x={position.descX} y={position.descY + lineIndex * 16} textAnchor={position.anchor} className="layer-desc">{line}</text>
                      ))}
                    </g>
                  );
                })}

                <circle r="6" fill="#5ed1ae" opacity="0.95">
                  <animateMotion dur="14s" repeatCount="indefinite">
                    <mpath href="#loop-path" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>

              <ul className="loop-fallback" role="list">
                {loopLayers.map((layer, index) => (
                  <li key={layer.num}>
                    <button type="button" onClick={() => setSelectedLayerIndex(index)}>
                      <span className="num">{layer.num}</span>
                      <span className="text">
                        <strong>{layer.title}</strong>
                        {layer.description}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {proposal?.phases?.length ? (
          <section className="px-6 md:px-20 py-16 md:py-20 bg-black text-white border-y border-black">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-4xl mb-10">
                <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Recommended proposal</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
                  {page.recommendedEngagement.title}
                </h2>
                <p className="text-white/65 leading-relaxed">{page.recommendedEngagement.description}</p>
              </div>

              <div className="border-y border-white/15">
                {phaseDetails.map((phase) => (
                  <div key={phase.title} className="py-7 md:py-9 border-b border-white/15 last:border-b-0">
                    <div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-10 items-start">
                      <div>
                        <p className="text-[12px] tracking-[0.16em] uppercase text-primary font-semibold mb-3">{phase.duration}</p>
                        <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white leading-tight">{phase.title}</h3>
                      </div>

                      <div>
                        <p className="text-white/72 leading-relaxed text-base md:text-lg mb-6">{phase.description}</p>
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                          {phase.details.map((detail, detailIndex) => (
                            <div key={detail} className="border-t border-white/15 pt-4">
                              <p className="text-[10px] tracking-[0.16em] uppercase text-white/35 font-semibold mb-2">
                                Focus {String(detailIndex + 1).padStart(2, "0")}
                              </p>
                              <p className="text-white/84 leading-relaxed m-0">{detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {proposal?.outcomes?.length ? (
          <section className="px-6 md:px-20 py-16 md:py-20 bg-background">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-8 md:gap-14 items-end mb-10">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Expected outcomes</p>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-0">
                    What the engagement should make clearer.
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed m-0">
                  The goal is to leave leadership with decision-ready visibility: where friction exists, what should be prioritized, and how the next phase of work should be measured.
                </p>
              </div>

              <div className="border border-border rounded-[2rem] overflow-hidden bg-background">
                <div className="grid md:grid-cols-2">
                  {proposal.outcomes.map((outcome, index) => {
                    const outcomeContent = buildOutcomeContent(outcome, index);

                    return (
                      <div key={outcome} className="p-6 md:p-7 border-b md:border-r border-border md:[&:nth-child(2n)]:border-r-0 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0">
                        <p className="text-[11px] tracking-[0.18em] uppercase text-primary font-semibold mb-4">
                          KPI / Result {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-foreground leading-snug mb-3">
                          {outcomeContent.headline}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed m-0">{outcomeContent.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-6 md:px-20 py-16 md:py-20 bg-black text-white border-y border-black">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-10 lg:gap-14 items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">QXO reference engagement</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
                  Proof from a complex revenue environment.
                </h2>
                <p className="text-white/62 leading-relaxed">
                  A concise reference for the kind of operating model, revenue infrastructure, and executive reporting discipline this engagement is designed to create.
                </p>
              </div>

              <div className="border-y border-white/15">
                {proofPoints.map((point, index) => (
                  <div key={point} className="grid md:grid-cols-[150px_minmax(0,1fr)] gap-5 md:gap-8 py-6 border-b border-white/15 last:border-b-0">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-primary font-semibold m-0">Reference {String(index + 1).padStart(2, "0")}</p>
                    <p className="text-white/80 leading-relaxed m-0">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] uppercase font-semibold opacity-80 mb-4">Next step</p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Let’s pressure-test the fit.
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-85 max-w-3xl mx-auto mb-8">
              {page.outreachAngle}
            </p>
            {renderPrimaryCta("footer")}
          </div>
        </section>
      </main>

      {selectedLayer ? (
        <div className="layer-modal" role="dialog" aria-modal="true" aria-labelledby="layer-modal-title" onClick={() => setSelectedLayerIndex(null)}>
          <div className="layer-modal-card" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="layer-modal-close" onClick={() => setSelectedLayerIndex(null)} aria-label="Close layer details">
              ×
            </button>
            <div className="layer-modal-kicker">Layer {selectedLayer.num}</div>
            <h3 id="layer-modal-title">{selectedLayer.title}</h3>
            <p className="layer-modal-summary">{selectedLayer.description}</p>
            <div className="layer-modal-examples">
              <p>Examples of what this can build</p>
              <ul>
                {selectedLayer.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {isContactOpen ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="contact-drawer-title" onClick={() => setIsContactOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-background text-foreground shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-6 border-b border-border p-6 md:p-8">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Contact Chad</p>
                  <h2 id="contact-drawer-title" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                    Discuss project fit.
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Share a little context and I’ll route the message into an email so we can continue the conversation directly.
                  </p>
                </div>
                <button type="button" onClick={() => setIsContactOpen(false)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Close contact form">
                  Close
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid gap-5">
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Name
                    <input name="name" required className="rounded-2xl border border-border bg-background px-4 py-3 text-base font-normal outline-none transition-colors focus:border-primary" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Email
                    <input name="email" type="email" required className="rounded-2xl border border-border bg-background px-4 py-3 text-base font-normal outline-none transition-colors focus:border-primary" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Company
                    <input name="company" defaultValue={page.companyName} className="rounded-2xl border border-border bg-background px-4 py-3 text-base font-normal outline-none transition-colors focus:border-primary" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Project context
                    <textarea name="message" rows={6} required placeholder="What are you trying to solve, assess, or build?" className="rounded-2xl border border-border bg-background px-4 py-3 text-base font-normal outline-none transition-colors focus:border-primary" />
                  </label>
                </div>

                <button type="submit" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-primary-foreground transition-opacity hover:opacity-90">
                  Open email draft
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
};

export default CompanyLandingPage;
