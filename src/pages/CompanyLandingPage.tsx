import { type KeyboardEvent, useEffect, useState } from "react";
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

const proposalWorkstreamDetails = [
  { title: "Foundation audit", details: ["Review CRM", "Marketing automation", "Analytics", "Attribution fields"] },
  { title: "Operating model", details: ["Lifecycle stages", "Handoff points", "Team ownership", "Decision cadence"] },
  { title: "Signal map", details: ["Buyer behavior", "Account intent", "Content signals", "Revenue triggers"] },
  { title: "Prioritization", details: ["Segment logic", "Scoring rules", "ICP fit", "Focus markets"] },
  { title: "Activation plays", details: ["Campaign flows", "Sales plays", "Landing pages", "Routing logic"] },
  { title: "Closed-loop reporting", details: ["Funnel movement", "Pipeline impact", "EBITDA return", "Optimization queue"] },
];

const proposalNodePositions = [
  { x: 70, y: 220 },
  { x: 330, y: 80 },
  { x: 330, y: 360 },
  { x: 590, y: 80 },
  { x: 590, y: 360 },
  { x: 850, y: 220 },
];

const proposalConnections = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 5],
];

const splitSvgLines = (text: string, maxChars = 24, maxLines = 2) => {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;

    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);

  if (lines.length <= maxLines) return lines;

  const trimmed = lines.slice(0, maxLines);
  trimmed[maxLines - 1] = `${trimmed[maxLines - 1].replace(/[.,;:]?$/, "")}…`;
  return trimmed;
};

const CompanyLandingPage = () => {
  const { slug } = useParams();
  const page = slug ? companyLandingPages[slug] : undefined;
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);
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
  const additionalProposalNodes = page.recommendedEngagement.bullets.slice(proposalWorkstreamDetails.length);

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

        <section className="px-6 md:px-20 py-16 md:py-20 bg-[#050505] text-white border-y border-black overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Recommended proposal</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5">
                {page.recommendedEngagement.title}
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">{page.recommendedEngagement.description}</p>
              <p className="text-sm text-white/55 leading-relaxed max-w-3xl mx-auto">
                The work is organized as connected workstreams instead of isolated tasks, so strategy, systems, activation, and measurement stay tied together from the beginning.
              </p>
            </div>

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 md:p-5 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(47, 163, 127, 0.42) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
              <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
              <svg viewBox="0 0 1120 650" xmlns="http://www.w3.org/2000/svg" className="relative z-10 hidden md:block w-full h-auto" aria-label="Connected proposal workstreams diagram">
                <defs>
                  <filter id="proposal-shadow-clean" x="-25%" y="-25%" width="150%" height="160%">
                    <feDropShadow dx="0" dy="18" stdDeviation="10" floodColor="#000000" floodOpacity="0.35" />
                  </filter>
                  <linearGradient id="proposal-node-clean" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#edf1ec" />
                  </linearGradient>
                  <linearGradient id="proposal-pill-clean" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#171717" />
                    <stop offset="100%" stopColor="#0c0c0c" />
                  </linearGradient>
                </defs>

                <path d="M42 78 C250 24 374 96 548 58 C730 18 868 82 1078 42" fill="none" stroke="rgba(47, 163, 127, 0.2)" strokeWidth="1.2" strokeDasharray="7 10" />
                <path d="M44 596 C262 538 378 612 548 574 C734 532 882 604 1078 548" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.2" strokeDasharray="7 10" />

                {proposalConnections.map(([fromIndex, toIndex], index) => {
                  const from = proposalNodePositions[fromIndex];
                  const to = proposalNodePositions[toIndex];
                  const fromX = from.x + 214;
                  const fromY = from.y + 56;
                  const toX = to.x - 18;
                  const toY = to.y + 56;
                  const elbowX = fromX + (toX - fromX) * 0.5;

                  return (
                    <path
                      key={`proposal-flow-${fromIndex}-${toIndex}`}
                      d={`M ${fromX} ${fromY} C ${elbowX} ${fromY}, ${elbowX} ${toY}, ${toX} ${toY}`}
                      fill="none"
                      stroke="rgba(47, 163, 127, 0.5)"
                      strokeWidth="1.8"
                      strokeDasharray="7 8"
                      strokeDashoffset="80"
                      strokeLinecap="round"
                      opacity="0"
                    >
                      <animate attributeName="opacity" from="0" to="1" dur="0.25s" begin={`${0.45 + index * 0.12}s`} fill="freeze" />
                      <animate attributeName="stroke-dashoffset" from="80" to="0" dur="0.7s" begin={`${0.45 + index * 0.12}s`} fill="freeze" />
                    </path>
                  );
                })}

                {proposalWorkstreamDetails.map((workstream, index) => {
                  const position = proposalNodePositions[index];
                  const begin = 0.08 + index * 0.16;
                  const titleLines = splitSvgLines(workstream.title, 22, 2);

                  return (
                    <g key={workstream.title} opacity="0" transform={`translate(${position.x} ${position.y})`} filter="url(#proposal-shadow-clean)">
                      <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin={`${begin}s`} fill="freeze" />
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        from={`${position.x - 26} ${position.y + 14}`}
                        to={`${position.x} ${position.y}`}
                        dur="0.55s"
                        begin={`${begin}s`}
                        fill="freeze"
                      />

                      <path d="M16 18 L178 0 L214 22 L214 102 L52 122 L16 100 Z" fill="#ded9d0" stroke="#b9b2a9" strokeWidth="1" />
                      <path d="M16 18 L178 0 L214 22 L52 40 Z" fill="url(#proposal-node-clean)" stroke="#c8c1b8" strokeWidth="1" />
                      <path d="M52 40 L214 22 L214 102 L52 122 Z" fill="#f7f4ef" stroke="#c8c1b8" strokeWidth="1" />
                      <path d="M16 18 L52 40 L52 122 L16 100 Z" fill="#d8d2c8" stroke="#c8c1b8" strokeWidth="1" />

                      <text x="70" y="58" fill="#2fa37f" fontFamily="DM Mono, monospace" fontSize="10" fontWeight="700" letterSpacing="2">
                        WS {String(index + 1).padStart(2, "0")}
                      </text>
                      <text x="70" y="82" fill="#111111" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="800">
                        {titleLines.map((line, lineIndex) => (
                          <tspan key={line} x="70" dy={lineIndex === 0 ? 0 : 18}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                      <circle cx="36" cy="40" r="10" fill="rgba(47, 163, 127, 0.14)" stroke="#2fa37f" strokeWidth="1" />
                      <circle cx="36" cy="40" r="3" fill="#2fa37f" />

                      {workstream.details.map((detail, detailIndex) => {
                        const pillX = detailIndex % 2 === 0 ? 18 : 118;
                        const pillY = 144 + Math.floor(detailIndex / 2) * 46;
                        const pillBegin = begin + 0.2 + detailIndex * 0.06;

                        return (
                          <g key={detail} opacity="0" transform={`translate(${pillX} ${pillY})`}>
                            <animate attributeName="opacity" from="0" to="1" dur="0.28s" begin={`${pillBegin}s`} fill="freeze" />
                            <animateTransform
                              attributeName="transform"
                              type="translate"
                              from={`${pillX} ${pillY + 10}`}
                              to={`${pillX} ${pillY}`}
                              dur="0.35s"
                              begin={`${pillBegin}s`}
                              fill="freeze"
                            />
                            <rect width="92" height="34" rx="12" fill="url(#proposal-pill-clean)" stroke="rgba(255,255,255,0.16)" />
                            <text x="46" y="21.5" textAnchor="middle" fill="rgba(255,255,255,0.78)" fontFamily="Inter, sans-serif" fontSize="9.5" fontWeight="650">
                              {detail}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              <div className="relative z-10 grid gap-4 md:hidden">
                {proposalWorkstreamDetails.map((workstream, index) => (
                  <div key={workstream.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-sm">
                    <p className="text-[10px] tracking-[0.16em] uppercase text-primary font-bold mb-2">Workstream {index + 1}</p>
                    <h3 className="text-white font-display text-xl font-extrabold mb-3">{workstream.title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {workstream.details.map((detail) => (
                        <span key={detail} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-white/75">
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {additionalProposalNodes.length ? (
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                {additionalProposalNodes.map((bullet, index) => (
                  <div key={bullet} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 text-white/75 leading-relaxed">
                    <p className="text-[10px] tracking-[0.16em] uppercase text-primary font-bold mb-2">Additional workstream {index + 7}</p>
                    {bullet}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {proposal?.phases?.length ? (
          <section className="px-6 md:px-20 py-16 md:py-20 bg-background border-y border-border">
            <div className="max-w-6xl mx-auto">
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
          </section>
        ) : null}

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

      <Footer />
    </div>
  );
};

export default CompanyLandingPage;
