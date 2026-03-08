import { useState, useEffect, useRef, useCallback } from "react";
import { SectionHeader } from "./PillarsSection";

const tabs = [
  { id: "overview", label: "Strategic Overview" },
  { id: "intelligence", label: "Marketing Intelligence" },
  { id: "segmentation", label: "Customer Segmentation" },
  { id: "activation", label: "Revenue Activation" },
];

/* ── STORY OVERVIEW with scroll-triggered sequential animation ── */
const StoryOverview = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          setPhase(1);
          setTimeout(() => setPhase(2), 600);
          setTimeout(() => setPhase(3), 1500);
          setTimeout(() => setPhase(4), 2100);
          setTimeout(() => setPhase(5), 3000);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const arrow1Ref = useRef<SVGPathElement>(null);
  const arrow2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (phase >= 2 && arrow1Ref.current) {
      const p = arrow1Ref.current;
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      p.getBoundingClientRect();
      p.style.transition = "stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1)";
      p.style.strokeDashoffset = "0";
    }
  }, [phase]);

  useEffect(() => {
    if (phase >= 4 && arrow2Ref.current) {
      const p = arrow2Ref.current;
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      p.getBoundingClientRect();
      p.style.transition = "stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1)";
      p.style.strokeDashoffset = "0";
    }
  }, [phase]);

  const nodes = [
    {
      label: "BUILD.",
      sub: "Architect from zero.",
      detail: "[marketing funnel · tracking ecosystem\nMarTech stack · campaign framework]",
      chips: ["Funnel Tracking", "Campaign Framework", "Attribution"],
      btn: "2021 — Foundation",
      pos: { top: 30, left: "0", width: 280 },
      showAt: 1,
    },
    {
      label: "SCALE.",
      sub: "Turn data into revenue.",
      detail: "[30K leads/qtr · 10K qualified\n1,500 new customers per quarter]",
      chips: ["30K Leads/Qtr", "Segmentation", "Growth Lab"],
      btn: "2022–23 — Acceleration",
      pos: { top: 200, left: "38%", width: 300 },
      showAt: 3,
    },
    {
      label: "IMPACT.",
      sub: "$750M → $1.25B digital revenue.",
      detail: "[influencing $2.5B in branch sales\nMarketing automation system upgrade · CDP]",
      chips: ["$1.25B Digital Revenue", "$2.5B Influenced"],
      btn: "2024 — Transformation",
      pos: { top: 380, left: "68%", width: 320 },
      showAt: 5,
    },
  ];

  return (
    <div className="bg-card px-6 md:px-20 pt-[60px] relative" style={{
      backgroundImage: "linear-gradient(rgba(47,163,127,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(47,163,127,0.045) 1px, transparent 1px)",
      backgroundSize: "56px 56px",
    }}>
      {/* 12-Month Playbook badge — top right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2.5 px-4 py-3 rounded-lg border border-primary/30 bg-card shadow-sm"
        style={{ background: "linear-gradient(135deg, rgba(47,163,127,0.08), rgba(47,163,127,0.02))" }}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(160, 55%, 38%)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" strokeDasharray="3 2" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L5 9.5L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-[18px] md:text-[22px] font-extrabold text-foreground leading-none">12<span className="text-primary text-[13px] ml-0.5">mo</span></span>
          <span className="font-sans text-[8px] md:text-[9px] tracking-[0.14em] uppercase text-muted-foreground leading-tight">Repeatable Playbook</span>
        </div>
      </div>

      {/* Section intro */}
      <p className="max-w-[520px] font-sans text-[15px] md:text-[16px] leading-[1.85] text-muted-foreground mb-2">
        <span className="font-display font-semibold text-foreground text-[16px] md:text-[17px]">Refined through real-world execution,</span>{" "}
        this framework brings a repeatable approach to building scalable marketing engines.
      </p>

      {/* Mobile: stacked layout */}
      <div className="md:hidden flex flex-col gap-8 pt-[28px] pb-8">
        {nodes.map((node, i) => (
          <div key={i}>
            <div className="font-hand text-[36px] font-bold text-foreground leading-none mb-1.5 underline decoration-primary underline-offset-4">
              {node.label}
            </div>
            <div className="font-sans text-[13px] text-foreground mb-1.5">{node.sub}</div>
            <div className="font-mono text-[11px] text-muted-foreground italic leading-[1.5] whitespace-pre-line">{node.detail}</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {node.chips.map((c) => (
                <span key={c} className="text-[10px] tracking-[0.1em] text-primary px-2.5 py-1 rounded" style={{ background: "rgba(47,163,127,0.1)", border: "1px solid hsl(var(--primary-deep))" }}>{c}</span>
              ))}
            </div>
            <button className="mt-4 inline-flex items-center gap-2 text-[11px] font-sans tracking-[0.12em] uppercase text-primary border border-primary/50 px-[18px] py-[10px] rounded bg-primary/[0.06] hover:bg-primary/[0.14] hover:border-primary transition-all cursor-pointer">
              {node.btn}
            </button>
            {i < nodes.length - 1 && (
              <div className="flex justify-center mt-4">
                <svg width="24" height="40" viewBox="0 0 24 40">
                  <path d="M12 0 C12 20 12 20 12 32" stroke="hsl(160, 55%, 38%)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                  <polygon points="6,30 12,38 18,30" fill="hsl(160, 55%, 38%)" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: positioned layout with SVG arrows */}
      <div ref={canvasRef} className="relative w-full hidden md:block mt-[20px]" style={{ height: 680 }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid meet">
          {/* Arrow 1: right of D in BUILD → top of A in SCALE */}
          <path
            ref={arrow1Ref}
            d="M 240 5 C 280 -100 460 -80 500 135"
            fill="none"
            stroke="hsl(160, 55%, 38%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
          />
          <polygon
            points="492,128 508,138 496,146"
            fill="hsl(160, 55%, 38%)"
            style={{ opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.3s ease" }}
          />
          {/* Arrow 2: right of E in SCALE → top of P in IMPACT */}
          <path
            ref={arrow2Ref}
            d="M 700 235 C 740 120 850 140 890 370"
            fill="none"
            stroke="hsl(160, 55%, 38%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
          />
          <polygon
            points="882,362 898,374 886,382"
            fill="hsl(160, 55%, 38%)"
            style={{ opacity: phase >= 4 ? 1 : 0, transition: "opacity 0.3s ease" }}
          />
        </svg>

        {nodes.map((node, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: node.pos.top,
              left: node.pos.left,
              width: node.pos.width,
              opacity: phase >= node.showAt ? 1 : 0,
              transform: phase >= node.showAt ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <div className="font-hand text-[52px] font-bold text-foreground leading-none mb-1.5 underline decoration-primary underline-offset-4">
              {node.label}
            </div>
            <div className="font-sans text-[13px] text-foreground mb-1.5">{node.sub}</div>
            <div className="font-mono text-[11px] text-muted-foreground italic leading-[1.5] whitespace-pre-line">{node.detail}</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {node.chips.map((c) => (
                <span key={c} className="text-[10px] tracking-[0.1em] text-primary px-2.5 py-1 rounded" style={{ background: "rgba(47,163,127,0.1)", border: "1px solid hsl(var(--primary-deep))" }}>{c}</span>
              ))}
            </div>
            <button className="mt-4 inline-flex items-center gap-2 text-[11px] font-sans tracking-[0.12em] uppercase text-primary border border-primary/50 px-[18px] py-[10px] rounded bg-primary/[0.06] hover:bg-primary/[0.14] hover:border-primary transition-all cursor-pointer">
              {node.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── MARKETING INTELLIGENCE with curved bezier lines + pulse rings ── */
const IntelligenceTab = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);
  const hasTriggered = useRef(false);

  const sources = [
    { icon: "🗂️", label: "CRM System", id: "src-crm" },
    { icon: "🌐", label: "Web Signals", id: "src-web" },
    { icon: "🏪", label: "Store Level Data", id: "src-pos" },
    { icon: "📧", label: "Marketing Automation", id: "src-email" },
    { icon: "📱", label: "Mobile App", id: "src-mobile" },
    { icon: "🔗", label: "Partner APIs", id: "src-partner" },
  ];
  const outputs = [
    { label: "AI Segmentation", color: "hsl(var(--primary))", id: "out-seg" },
    { label: "Campaign Activation", color: "hsl(var(--accent))", id: "out-camp" },
    { label: "Loyalty Programs", color: "hsl(var(--primary))", id: "out-loy" },
    { label: "Revenue Attribution", color: "hsl(var(--primary))", id: "out-attr" },
    { label: "Next-Best-Action", color: "#f4a261", id: "out-nba" },
  ];

  const buildWires = useCallback(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const cRect = container.getBoundingClientRect();
    const cx = container.offsetWidth / 2;
    const cy = container.offsetHeight / 2;

    const elCenter = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 };
    };

    const vbW = 1200;
    const vbH = 520;
    const scaleX = vbW / container.offsetWidth;
    const scaleY = vbH / container.offsetHeight;
    const toVB = (pt: { x: number; y: number }) => ({ x: pt.x * scaleX, y: pt.y * scaleY });

    svg.innerHTML = "";

    sources.forEach((s, i) => {
      const sp = toVB(elCenter(s.id));
      const cp = toVB({ x: cx, y: cy });
      const mx = (sp.x + cp.x) / 2;
      const d = `M ${sp.x} ${sp.y} C ${mx} ${sp.y} ${mx} ${cp.y} ${cp.x} ${cp.y}`;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "hsl(160, 55%, 38%)");
      path.setAttribute("stroke-width", "1");
      path.setAttribute("stroke-dasharray", "4 6");
      path.setAttribute("opacity", "0");
      path.style.transition = `opacity 0.4s ease ${0.1 + i * 0.12}s`;
      path.classList.add("orch-input-path");
      svg.appendChild(path);
    });

    outputs.forEach((o, i) => {
      const op = toVB(elCenter(o.id));
      const cp = toVB({ x: cx, y: cy });
      const mx = (cp.x + op.x) / 2;
      const d = `M ${cp.x} ${cp.y} C ${mx} ${cp.y} ${mx} ${op.y} ${op.x} ${op.y}`;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "hsl(160, 55%, 38%)");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("opacity", "0");
      path.style.strokeDasharray = "400";
      path.style.strokeDashoffset = "400";
      path.style.transition = `stroke-dashoffset 0.8s ease ${0.8 + i * 0.15}s, opacity 0.1s ease ${0.8 + i * 0.15}s`;
      path.classList.add("orch-output-path");
      svg.appendChild(path);
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          requestAnimationFrame(() => {
            buildWires();
            setVisible(true);
            setTimeout(() => {
              document.querySelectorAll(".orch-input-path").forEach((p) => {
                (p as SVGElement).style.opacity = "0.6";
                (p as SVGElement).style.animation = "flowDash 2.5s linear infinite";
              });
            }, 700);
            setTimeout(() => {
              document.querySelectorAll(".orch-output-path").forEach((p) => {
                p.setAttribute("opacity", "0.7");
                (p as SVGElement).style.strokeDashoffset = "0";
              });
            }, 950);
          });
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [buildWires]);

  return (
    <div className="bg-card px-6 py-[60px] md:px-20">
      <h2 className="font-display font-extrabold leading-none tracking-[-0.025em] mb-4" style={{ fontSize: "clamp(28px, 4vw, 54px)" }}>
        Every signal tells a story — <em className="text-primary">if you're listening.</em>
      </h2>
      <p className="font-sans text-[14px] text-muted-foreground leading-[1.8] max-w-[600px] mb-8 md:mb-16">
        I designed and deployed the marketing intelligence infrastructure that connects every customer touchpoint into a centralized system — transforming fragmented signals into unified insights, and activating them across every channel in real time.
      </p>

      {/* Mobile: simplified stacked layout */}
      <div className="md:hidden flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-2">
          {sources.map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ border: "1px solid hsl(var(--border))", background: "rgba(47,163,127,0.05)" }}>
              <span className="text-[18px]">{s.icon}</span>
              <span className="font-sans text-[10px] tracking-[0.08em] uppercase text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <svg width="24" height="32"><path d="M12 0 L12 24" stroke="hsl(160,55%,38%)" strokeWidth="2" strokeDasharray="4 4" /><polygon points="6,22 12,30 18,22" fill="hsl(160,55%,38%)" /></svg>
        </div>
        <div className="flex flex-col items-center gap-1 p-6 mx-auto" style={{ border: "1px solid hsl(var(--primary))", background: "hsl(var(--card))", borderRadius: 4 }}>
          <div className="text-[28px]">⬡</div>
          <div className="font-display text-[11px] font-bold tracking-[0.1em] uppercase text-primary">Centralized</div>
          <div className="font-sans text-[9px] text-muted-foreground tracking-[0.08em]">Data · Intelligence</div>
        </div>
        <div className="flex justify-center">
          <svg width="24" height="32"><path d="M12 0 L12 24" stroke="hsl(160,55%,38%)" strokeWidth="2" strokeDasharray="4 4" /><polygon points="6,22 12,30 18,22" fill="hsl(160,55%,38%)" /></svg>
        </div>
        <div className="flex flex-col gap-2">
          {outputs.map((o, i) => (
            <div key={i} className="flex items-center gap-2.5 p-3" style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}>
              <div className="animate-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: o.color, flexShrink: 0 }} />
              <span className="font-sans text-[11px] tracking-[0.08em] text-foreground">{o.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: positioned layout with SVG wires */}
      <div ref={containerRef} className="relative w-full hidden md:block" style={{ height: 520 }}>
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid meet" />

        {/* Source nodes LEFT */}
        <div className="absolute left-[2%] top-0 bottom-0 flex flex-col justify-around" style={{ width: 100 }}>
          {sources.slice(0, 4).map((s, i) => (
            <div key={i} id={s.id} className="flex flex-col items-center gap-2" style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.85)",
              transition: `opacity 0.5s ease ${i * 0.13}s, transform 0.5s ease ${i * 0.13}s`,
            }}>
              <div
                className="flex items-center justify-center text-[22px] rounded-lg"
                style={{
                  width: 52, height: 52,
                  border: visible ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
                  background: visible ? "rgba(47,163,127,0.1)" : "hsl(var(--card))",
                  boxShadow: visible ? "0 0 20px rgba(47,163,127,0.25)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {s.icon}
              </div>
              <div className="font-sans text-[9px] tracking-[0.12em] uppercase text-muted-foreground text-center max-w-[70px] leading-[1.4]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Extra source nodes */}
        <div id={sources[4].id} className="absolute left-[22%] top-[4%] flex flex-col items-center gap-2" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.85)",
          transition: "opacity 0.5s ease 0.52s, transform 0.5s ease 0.52s",
        }}>
          <div className="flex items-center justify-center text-[22px] rounded-lg" style={{
            width: 52, height: 52,
            border: visible ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
            background: visible ? "rgba(47,163,127,0.1)" : "hsl(var(--card))",
            boxShadow: visible ? "0 0 20px rgba(47,163,127,0.25)" : "none",
            transition: "all 0.3s ease",
          }}>
            {sources[4].icon}
          </div>
          <div className="font-sans text-[9px] tracking-[0.12em] uppercase text-muted-foreground text-center max-w-[70px] leading-[1.4]">{sources[4].label}</div>
        </div>
        <div id={sources[5].id} className="absolute left-[22%] bottom-[4%] flex flex-col items-center gap-2" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.85)",
          transition: "opacity 0.5s ease 0.65s, transform 0.5s ease 0.65s",
        }}>
          <div className="flex items-center justify-center text-[22px] rounded-lg" style={{
            width: 52, height: 52,
            border: visible ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
            background: visible ? "rgba(47,163,127,0.1)" : "hsl(var(--card))",
            boxShadow: visible ? "0 0 20px rgba(47,163,127,0.25)" : "none",
            transition: "all 0.3s ease",
          }}>
            {sources[5].icon}
          </div>
          <div className="font-sans text-[9px] tracking-[0.12em] uppercase text-muted-foreground text-center max-w-[70px] leading-[1.4]">{sources[5].label}</div>
        </div>

        {/* Center CDP with pulse rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}>
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ width: 0, height: 0 }}>
              <div className="absolute" style={{ width: 160, height: 160, border: "1.5px solid rgba(47,163,127,0.3)", borderRadius: "50%", animation: "pulsering 2.5s ease-in-out infinite", transform: "translate(-50%,-50%)" }} />
              <div className="absolute" style={{ width: 200, height: 200, border: "1px solid rgba(47,163,127,0.2)", borderRadius: "50%", animation: "pulsering 2.5s ease-in-out infinite 0.8s", transform: "translate(-50%,-50%)" }} />
              <div className="absolute" style={{ width: 240, height: 240, border: "1px solid rgba(47,163,127,0.12)", borderRadius: "50%", animation: "pulsering 3s ease-in-out infinite 1.5s", transform: "translate(-50%,-50%)" }} />
            </div>
            <div
              className="flex flex-col items-center justify-center gap-1 relative cursor-pointer"
              style={{
                width: 130, height: 130,
                border: "1px solid hsl(var(--primary))",
                background: "hsl(var(--card))",
                borderRadius: 4,
              }}
            >
              <div className="absolute" style={{ inset: 6, border: "1px solid hsl(var(--primary-deep))", animation: "rotateBorder 8s linear infinite" }} />
              <div className="text-[28px]">⬡</div>
              <div className="font-display text-[11px] font-bold tracking-[0.1em] uppercase text-primary">Centralized</div>
              <div className="font-sans text-[9px] text-muted-foreground tracking-[0.08em]">Data · Intelligence</div>
            </div>
          </div>
        </div>

        {/* Output nodes RIGHT */}
        <div className="absolute right-[2%] top-0 bottom-0 flex flex-col justify-around" style={{ width: 180 }}>
          {outputs.map((o, i) => (
            <div key={i} id={o.id} className="flex items-start gap-2.5" style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(16px)",
              transition: `opacity 0.5s ease ${0.9 + i * 0.15}s, transform 0.5s ease ${0.9 + i * 0.15}s`,
            }}>
              <div className="flex items-center gap-2.5" style={{
                padding: "10px 16px",
                background: "hsl(var(--secondary))",
                border: "1px solid hsl(var(--border))",
                minWidth: 160,
              }}>
                <div className="animate-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: o.color, flexShrink: 0 }} />
                <span className="font-sans text-[11px] tracking-[0.08em] text-foreground">{o.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── SEGMENTATION ── */
const SegmentationTab = () => {
  const dims = [
    { letter: "R", name: "Recency", question: "How recently did they purchase?", metrics: ["Strong predictor of churn risk", "Near-term reorder likelihood", "Days since last transaction"] },
    { letter: "F", name: "Frequency", question: "How often do they purchase?", metrics: ["Indicates habitual purchasing", "Forecasts lifetime value", "Identifies \"sticky\" accounts"] },
    { letter: "M", name: "Monetary", question: "How much do they spend?", metrics: ["Total revenue & gross margin", "Average order value", "Annual wallet share"] },
  ];

  const segments = [
    { icon: "👑", name: "Top Performers", desc: "High recency, frequency, and spend. Your highest-value accounts — protect and grow.", score: 88, color: "#ffd700" },
    { icon: "🔁", name: "Core Accounts", desc: "Consistent purchasers with reliable frequency. Backbone of predictable revenue.", score: 74, color: "#5ae0a0" },
    { icon: "🚀", name: "Promising", desc: "Recent buyers with growing frequency. On the path to loyalty — invest now.", score: 61, color: "#4f8ef7" },
    { icon: "⚠️", name: "Needs Attention", desc: "Above-average historically but declining engagement signals emerging risk.", score: 46, color: "#f4a261" },
    { icon: "🔴", name: "At-Risk", desc: "Previously valuable but showing strong churn signals. Re-engagement urgency high.", score: 29, color: "#e05a5a" },
    { icon: "💤", name: "Churned", desc: "Fully lapsed. Targeted win-back or removal from active spend — protect budget efficiency.", score: 11, color: "#6b6b7a" },
  ];

  return (
    <div className="px-6 py-[60px] md:px-20 bg-card">
      <h2 className="font-display font-extrabold leading-none tracking-[-0.025em] mb-4" style={{ fontSize: "clamp(28px, 4vw, 54px)" }}>
        Know your customer — <em className="text-primary">before they leave.</em>
      </h2>
      <div className="max-w-[700px] mb-8 md:mb-16">
        <p className="font-sans text-[14px] text-muted-foreground leading-[1.8]">
          Precision marketing requires precision targeting. I designed the segmentation framework around three leading indicators of customer value and churn risk — moving the business from mass messaging to individualized, ROI-based activation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] mb-12" style={{ gap: "2px", background: "hsl(var(--border))" }}>
        <div className="flex flex-col" style={{ gap: "2px", background: "hsl(var(--border))" }}>
          {dims.map((d) => (
            <div key={d.letter} className="bg-card rounded" style={{ padding: "28px 24px", borderLeft: "3px solid hsl(var(--border))" }}>
              <div className="font-display text-[42px] font-extrabold leading-none mb-1.5" style={{ color: "hsl(var(--border))" }}>{d.letter}</div>
              <div className="font-display text-[14px] font-bold mb-1">{d.name}</div>
              <div className="font-sans text-[11px] text-muted-foreground tracking-[0.06em] mb-2.5">{d.question}</div>
              <div className="flex flex-col gap-1">
                {d.metrics.map((m, i) => (
                  <div key={i} className="font-sans text-[10px] text-muted-foreground flex items-center gap-2">
                    <span className="w-[14px] h-[1px] flex-shrink-0" style={{ background: "hsl(var(--primary-deep))" }} />
                    {m}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card flex flex-col">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground" style={{ padding: "24px 32px 16px", borderBottom: "1px solid hsl(var(--border))" }}>
            Customer Segments → Lifecycle Stages
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 flex-1" style={{ gap: "1px", background: "hsl(var(--border))" }}>
            {segments.map((s) => (
              <div key={s.name} className="bg-card hover:bg-secondary transition-colors cursor-pointer relative overflow-hidden group" style={{ padding: "24px 20px" }}>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] transform scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" style={{ background: s.color }} />
                <div className="text-[24px] mb-2.5">{s.icon}</div>
                <div className="font-display text-[13px] font-bold mb-1">{s.name}</div>
                <div className="font-sans text-[10px] text-muted-foreground leading-[1.5] mb-2.5">{s.desc}</div>
                <div className="h-1 bg-border mb-1.5">
                  <div className="h-full transition-all duration-1000" style={{ background: s.color, width: `${s.score}%` }} />
                </div>
                <div className="font-mono text-[9px] text-muted-foreground">Value Score: {s.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 bg-card"
        style={{ border: "1px solid hsl(var(--border))", borderTop: "2px solid hsl(var(--primary))", padding: "24px", borderRadius: "0 0 8px 8px" }}
      >
        <div>
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">Segmentation Inputs</div>
          <div className="flex flex-col gap-2">
            {["📊 Purchase recency, frequency, monetary value", "🎯 Behavioral engagement signals", "📈 Customer lifetime value modeling", "🏪 Customer loyalty & wallet share"].map((item, i) => (
              <div key={i} className="font-sans text-[11px] text-muted-foreground flex items-center gap-2.5">
                <span className="text-primary text-[16px]">{item.slice(0, 2)}</span>
                {item.slice(3)}
              </div>
            ))}
          </div>
        </div>
        <div className="font-display text-[32px] font-extrabold text-primary text-center">→</div>
        <div>
          <div className="font-display text-[18px] font-bold text-primary mb-1">Precision Activation</div>
          <div className="font-sans text-[10px] text-muted-foreground tracking-[0.08em] leading-[1.6]">
            Mass marketing → Precision marketing<br />
            Uniform spend → ROI-based allocation<br />
            Generic messaging → 1:1 personalization<br />
            Reactive campaigns → Predictive lifecycle
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── ACTIVATION ── */
const ActivationTab = () => {
  const layers = [
    { num: "01", title: "Omnichannel orchestration", subtitle: "Real-time customer activation", tag: "Always-on", desc: "A customer data layer, engagement automation, and routing logic trigger timely experiences across email, SMS, in-app, and sales motions.", bullets: ["Faster lead-to-sales conversion and pipeline velocity", "Shorter response times across the full lifecycle", "Improved new customer growth through precision triggers"] },
    { num: "02", title: "Revenue by segment & region", subtitle: "Territory-level opportunity analysis", tag: "Strategic", desc: "Assess revenue performance by customer segment and geographic region — identifying where sales opportunity or pricing strategy adjustments can unlock growth within each territory.", bullets: ["Pinpoint high-potential segments by region or territory", "Evaluate pricing impact on revenue within marketing strategy", "Align sales and marketing investment to geographic opportunity"] },
    { num: "03", title: "Budgeting intelligence", subtitle: "Performance automation", tag: "Adaptive", desc: "Campaign and cost signals feed directly into optimization tools so budget, placement, and creative decisions adapt automatically.", bullets: ["Higher return on ad spend at scale", "Lower cost per qualified lead", "Reduced manual overhead from media operations"] },
    { num: "04", title: "Content production", subtitle: "AI-assisted content generation", tag: "High-velocity", desc: "A single strategic asset becomes multiple campaign-ready formats — landing pages, nurture sequences, sales follow-up, social, and paid media.", bullets: ["Greater content velocity across channels and teams", "Lower production cost per asset", "Consistent brand voice at scale"] },
    { num: "05", title: "Experimentation layer", subtitle: "Adaptive testing", tag: "Continuous", desc: "The system continuously optimizes channel, message, timing, and audience combinations.", bullets: ["Higher conversion rates and win rates", "Better efficiency from existing traffic", "More testing capacity than static A/B workflows"] },
    { num: "06", title: "Engagement scoring", subtitle: "Signal-based prioritization", tag: "Predictive", desc: "Demo behavior, content depth, click patterns, and product interest signals sharpen qualification, scoring, and handoff decisions.", bullets: ["Higher quality pipeline with fewer wasted handoffs", "Better sales prioritization from behavioral data", "Improved conversion from engaged prospects"] },
  ];

  return (
    <div className="px-6 py-[60px] md:px-20 bg-card">
      <h2 className="font-display font-extrabold leading-none tracking-[-0.025em] mb-4" style={{ fontSize: "clamp(28px, 4vw, 54px)" }}>
        When data moves, <em className="text-primary">revenue follows.</em>
      </h2>
      <p className="font-sans text-[14px] text-muted-foreground leading-[1.8] max-w-[600px] mb-12">
        Intelligence and segmentation are only as valuable as the system that acts on them. This layer connects unified customer profiles, behavioral signals, and workflow automation into a repeatable engine.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
        {[
          { icon: "📈", title: "Increased Revenue", sub: "Top-line growth through precision activation", metric: "Revenue ↑" },
          { icon: "💰", title: "Gross Margin Lift", sub: "Higher margins from smarter spend allocation", metric: "Margin ↑" },
          { icon: "📊", title: "EBITDA Increase", sub: "Operational efficiency driving profitability", metric: "EBITDA ↑" },
          { icon: "⚖️", title: "Unit Economics", sub: "LTV:CAC ratio optimization at scale", metric: "LTV · CAC" },
        ].map((a) => (
          <div key={a.title} className="relative overflow-hidden group" style={{ border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "28px 20px", borderTop: "3px solid hsl(var(--primary))" }}>
            <div className="text-[24px] mb-2">{a.icon}</div>
            <div className="font-display text-[13px] font-bold mb-1">{a.title}</div>
            <div className="font-sans text-[10px] text-muted-foreground leading-[1.5] mb-3">{a.sub}</div>
            <span className="inline-block text-[9px] tracking-[0.12em] uppercase font-semibold text-primary px-2 py-0.5 rounded" style={{ background: "rgba(47,163,127,0.1)" }}>{a.metric}</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" style={{ background: "hsl(var(--primary))" }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))", borderRadius: 8, overflow: "hidden" }}>
        {layers.map((l) => (
          <div key={l.num} className="bg-card hover:bg-secondary transition-colors" style={{ padding: "28px 24px" }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-[0.15em] text-primary">{l.num} · {l.title}</span>
            </div>
            <div className="font-display text-[14px] font-bold mb-1">{l.subtitle}</div>
            <span className="inline-block text-[9px] tracking-[0.1em] uppercase text-primary px-2 py-0.5 rounded mb-3" style={{ background: "rgba(47,163,127,0.1)" }}>{l.tag}</span>
            <p className="font-sans text-[12px] text-muted-foreground leading-[1.7] mb-3">{l.desc}</p>
            <ul className="flex flex-col gap-1.5">
              {l.bullets.map((b, i) => (
                <li key={i} className="font-sans text-[11px] text-muted-foreground flex items-start gap-2">
                  <span className="text-primary flex-shrink-0 mt-[1px] text-[10px]">▸</span>{b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── MAIN QXO STORY SECTION ── */
const QxoStorySection = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <StoryOverview />;
      case "intelligence": return <IntelligenceTab />;
      case "segmentation": return <SegmentationTab />;
      case "activation": return <ActivationTab />;
      default: return <StoryOverview />;
    }
  };

  return (
    <div>
      {/* Strategy in Action header */}
      <div className="px-6 pt-[60px] md:px-20 md:pt-20 bg-background">
        <SectionHeader num="02" title="Building a Scalable Marketing" em="Infrastructure for Growth" />
        <p className="font-sans text-[14px] text-muted-foreground leading-[1.8] max-w-[700px] mb-8">
          I've developed a proven playbook for building scalable marketing infrastructure from scratch — establishing the data foundation, signal strategy, segmentation model, and activation engine required to drive growth. I know how to bring together the right people, platforms, and processes to make it operational within 12 to 24 months.
        </p>
      </div>

      {/* File-folder tab bar */}
      <div className="sticky top-14 md:top-16 z-40 bg-background px-4 md:px-20 overflow-x-auto">
        <div className="flex gap-0 items-end min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 md:px-6 py-3 text-[10px] md:text-[11px] font-sans tracking-[0.12em] uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "font-semibold z-10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{
                clipPath: "polygon(0 100%, 0 18%, 72% 18%, 80% 0, 100% 0, 100% 100%)",
                border: "1px solid hsl(var(--border))",
                borderBottom: activeTab === tab.id
                  ? "1px solid hsl(var(--card))"
                  : "1px solid hsl(var(--border))",
                borderRadius: "12px 12px 0 0",
                marginBottom: -1,
                padding: "15px 20px 13px",
                background: activeTab === tab.id
                  ? "hsl(var(--primary))"
                  : "hsl(var(--card))",
                color: activeTab === tab.id
                  ? "hsl(var(--primary-foreground))"
                  : "hsl(var(--muted))",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ borderBottom: "1px solid hsl(var(--border))" }} />
      </div>

      {renderTab()}
    </div>
  );
};

export default QxoStorySection;
