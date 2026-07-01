import { useMemo, useState } from "react";

const green = "#4a9e7a";

const chapters = [
  {
    eyebrow: "Chapter 01 — The Scoreboard",
    nav: "KPI Foundation",
    title: <>We start with the <em className="italic text-[#4a9e7a]">executive outcomes.</em></>,
    body: "Before a single campaign is built, a segment is defined, or a dashboard is configured, we align on what the business is actually trying to accomplish. The KPI framework becomes the operating system for every marketing, sales, and customer motion that follows.",
  },
  {
    eyebrow: "Chapter 02 — The Growth Question",
    nav: "Growth Objective",
    title: <>What are we growing? <em className="italic text-[#4a9e7a]">And for whom?</em></>,
    body: "Once the KPI framework is clear, we define the growth objective and the audience behind it. Strategy becomes sharper when the business outcome and audience focus are answered together.",
  },
  {
    eyebrow: "Chapter 03 — Segmentation",
    nav: "Segmentation",
    title: <>Turn a broad market into <em className="italic text-[#4a9e7a]">actionable groups.</em></>,
    body: "Segmentation is the first intelligence layer underneath the dashboard. It tells us who we are speaking to, what they care about, how they buy, and where the largest opportunities exist.",
  },
  {
    eyebrow: "Chapter 04 — Total Addressable Market",
    nav: "TAM",
    title: <>Map the full <em className="italic text-[#4a9e7a]">market opportunity.</em></>,
    body: "Once segments are defined, we map the Total Addressable Market for each one so the executive team can see share, whitespace, pipeline potential, and reachable accounts.",
  },
  {
    eyebrow: "Chapter 05 — Personas",
    nav: "Personas",
    title: <>Build personas from <em className="italic text-[#4a9e7a]">real opportunity,</em> not assumptions.</>,
    body: "Personas are built from actual customer segments and market opportunity, not templates. Each one represents a real buyer role with a specific message, motion, and conversion barrier.",
  },
  {
    eyebrow: "Chapter 06 — Customer Value Tiering",
    nav: "Customer Tiering",
    title: <>Every customer has a <em className="italic text-[#4a9e7a]">next move.</em></>,
    body: "For current customers, the goal is not only retention. We use value, purchase behavior, product fit, and growth potential to determine who can move up and how to activate them.",
  },
  {
    eyebrow: "Chapter 07 — Prospect Funnel",
    nav: "Prospect Funnel",
    title: <>Turn market opportunity into <em className="italic text-[#4a9e7a]">qualified pipeline.</em></>,
    body: "For prospects, the goal is to convert TAM into pipeline. Segmentation, fit, intent, and engagement signals prioritize who marketing should target and who sales should pursue.",
  },
  {
    eyebrow: "Chapter 08 — Signal Intelligence",
    nav: "Signals",
    title: <>Act on the right signal <em className="italic text-[#4a9e7a]">at the right moment.</em></>,
    body: "Signals tell us when to act. Instead of treating every customer or prospect the same, we monitor market, account, and contact-level activity to understand when there is a real reason to engage.",
  },
  {
    eyebrow: "Chapter 09 — Campaign Activation",
    nav: "Campaign Activation",
    title: <>From signal to <em className="italic text-[#4a9e7a]">coordinated action.</em></>,
    body: "Once a signal is detected, the system turns insight into action. Marketing builds the message, advertising amplifies it, and sales receives a clear motion: who to contact, why now, and what to say.",
  },
  {
    eyebrow: "Chapter 10 — Sales Motion",
    nav: "Sales Motion",
    title: <>Sales execution built on the <em className="italic text-[#4a9e7a]">same intelligence.</em></>,
    body: "The same segmentation, TAM, tiering, and signals that power marketing should also power account assignment, territory coverage, seller prioritization, and talk tracks.",
  },
  {
    eyebrow: "Chapter 11 — Marketing + Sales Alignment",
    nav: "Alignment",
    title: <>One system. <em className="italic text-[#4a9e7a]">Two engines.</em></>,
    body: "Marketing and sales operate from the same KPI framework, customer intelligence, market opportunity model, and performance feedback loop.",
  },
  {
    eyebrow: "Chapter 12 — Performance Layer",
    nav: "Dashboard Return",
    title: <>Back to the dashboard. <em className="italic text-[#4a9e7a]">Now it means something.</em></>,
    body: "Every KPI now has a system behind it: a segment it belongs to, a tier it represents, a signal that activated it, and a campaign or sales motion that drove it.",
  },
];

const kpis = [
  ["Revenue Growth", "14.3%", "Above 12% target", "pos"],
  ["Market Share", "18.0%", "Account-based share", "pos"],
  ["Customer Acquisition", "196", "New customers TTM", "pos"],
  ["Net Revenue Retention", "108%", "Expanding base", "pos"],
  ["Pipeline Contribution", "$27.8M", "3.2× coverage ratio", "flat"],
  ["Sales Conversion", "31.9%", "Below 38% target", "warn"],
  ["Customer LTV", "$23.1K", "Exceeds $20K goal", "pos"],
  ["Marketing ROI", "5.0×", "Above 4.5× target", "pos"],
];

const segmentCards = [
  ["Segment A", "High-Value Existing Customers", "Top-tier accounts by revenue and category breadth. Strong relationship depth and repurchase behavior.", "Expand & Retain"],
  ["Segment B", "Mid-Tier Growth Customers", "Strong fit, moderate purchase frequency. Significant potential to expand category penetration.", "Move Tier 3 → Tier 2"],
  ["Segment C", "High-Fit Prospects", "Not yet customers. Strong fit by industry, size, and buying profile. Highest new revenue potential.", "Acquire"],
];

const tiers = [
  ["T1", "Highest-Value Customers", "Protect and grow strategic accounts through executive relationship management, account plans, loyalty, retention campaigns, and proactive cross-sell."],
  ["T2", "Growth Customers", "Expand category penetration with personalized offers, seller-assisted growth plays, lifecycle nurture, reorder reminders, and usage signals."],
  ["T3", "Underdeveloped Customers", "Re-engage and educate lower-frequency customers with category introduction, nurture, and win-back motions that move them up."],
];

const signalRows = [
  ["Declining Purchase Frequency", "Customer spend down 30%+ vs. prior quarter", "Alert seller → re-engagement offer → track recovery", "At Risk"],
  ["Cross-Sell Opportunity", "High-value customer buying in only one category", "Personalized offer → seller play → measure lift", "Expand"],
  ["Public Funding Received", "Target accounts awarded public contracts this quarter", "Accounts matched → campaign launched → sales alerted", "Act Now"],
  ["Intent Signal Detected", "Prospect actively searching category keywords", "Retargeting on → sales priority up → conversion tracked", "Engage"],
];

const performance = [
  ["Segmentation + TAM", "Market Share: 18.0%", "161 active of 895 addressable accounts"],
  ["Customer Tiering", "Revenue Growth: 14.3%", "Tier 1 expansion + new acquisition"],
  ["Prospect Funnel", "Pipeline: $27.8M", "3.2× coverage · 614 opportunities"],
  ["Campaign Activation", "Marketing ROI: 5.0×", "$31.2M sourced on $6.2M spend"],
  ["Sales Motion", "Win Rate: 31.9%", "196 closed-won · improving with playbooks"],
  ["Signal Intelligence", "MQL→SQL: 32%", "Signal-triggered lift vs. broadcast average"],
  ["Personas + Tiering", "LTV: $23.1K", "Expansion motions moving T2→T1"],
  ["Full System", "NRR: 108%", "Customers expanding faster than churn"],
];

function KpiDashboard() {
  return (
    <div className="grid overflow-hidden rounded border border-[#e8e8e8] md:grid-cols-2 xl:grid-cols-4">
      {kpis.map(([label, value, delta, state]) => (
        <div key={label} className="border-b border-r border-[#e8e8e8] bg-white p-5 last:border-r-0">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">{label}</div>
          <div className="mb-2 text-3xl font-extrabold tracking-[-0.04em] text-[#111]">{value}</div>
          <div className={state === "pos" ? "text-[11px] text-[#2e7d52]" : state === "warn" ? "text-[11px] text-[#b45309]" : "text-[11px] text-[#888]"}>{delta}</div>
        </div>
      ))}
    </div>
  );
}

function TamMap() {
  const dots = useMemo(() => Array.from({ length: 86 }, (_, i) => ({
    left: 18 + ((i * 37) % 74),
    top: 12 + ((i * 61) % 76),
    size: i % 5 === 0 ? 10 : i % 3 === 0 ? 8 : 6,
    color: i % 7 === 0 ? "#e8a020" : i % 5 === 0 ? "#2a72d5" : i % 4 === 0 ? "#3baf9e" : "#9eaab8",
  })), []);

  return (
    <div className="relative mb-5 h-[350px] overflow-hidden rounded border border-[#e8e8e8] bg-[#e8edf2]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 360" preserveAspectRatio="none">
        <rect width="900" height="360" fill="#5a6170" />
        <path d="M900 0v360H140c-20-45-30-79-15-118 13-36-55-37-55-78 0-25 29-29 40-54 12-27-22-44 6-69 24-22 56-9 77-41z" fill="#e4e0d8" />
        <path d="M160 62h740M150 138h750M140 180h760M135 258h765M148 328h752M210 8v352M370 8v352M520 8v352M680 8v352M830 8v352" stroke="#f5f2ec" strokeWidth="4" />
        <path d="M170 100h730M160 160h740M155 220h745M290 8v352M445 8v352M600 8v352M755 8v352" stroke="#eeeae2" strokeWidth="2" />
        <path d="M165 50q135 60 205 88 80 27 150 40 70 12 160 22 70 8 150 15" stroke="#f0ece4" strokeWidth="3" fill="none" />
        <text x="390" y="128" fontFamily="Inter" fontSize="14" fill="#8a8078">Central District</text>
        <text x="200" y="248" fontFamily="Inter" fontSize="12" fill="#9c9288">Bayside</text>
        <text x="555" y="248" fontFamily="Inter" fontSize="12" fill="#9c9288">Southpark</text>
      </svg>
      {dots.map((dot, index) => (
        <span key={index} className="absolute rounded-full shadow-sm" style={{ left: `${dot.left}%`, top: `${dot.top}%`, width: dot.size, height: dot.size, backgroundColor: dot.color }} />
      ))}
      <div className="absolute right-4 top-4 rounded border border-[#e8e8e8] bg-white/95 p-4 text-right shadow-sm">
        <div className="text-3xl font-extrabold leading-none text-[#4a9e7a]">895</div>
        <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">Addressable accounts</div>
        <div className="mt-2 text-[10px] text-[#888]">161 active · 420 leads</div>
      </div>
      <div className="absolute bottom-4 left-4 rounded border border-[#e8e8e8] bg-white/95 p-3 text-[10px] text-[#444] shadow-sm">
        <div className="mb-1 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#2a72d5]" /> Active customer</div>
        <div className="mb-1 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#3baf9e]" /> Engaged / recent</div>
        <div className="mb-1 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#9eaab8]" /> Lead / prospect</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#e8a020]" /> Lapsed</div>
      </div>
    </div>
  );
}

function ChapterContent({ current }: { current: number }) {
  if (current === 0) return <KpiDashboard />;
  if (current === 1) return <div className="grid gap-4 md:grid-cols-2"><ListCard title="Business Outcome" items={["Revenue growth", "Market share expansion", "New customer acquisition", "Customer retention & expansion", "Profitability improvement"]} /><ListCard title="Audience Focus" items={["Customer segments by value", "High-fit prospect segments", "Industries & verticals", "Territories & geographies", "Accounts & buying contacts"]} /></div>;
  if (current === 2) return <div className="grid gap-4 lg:grid-cols-3">{segmentCards.map(([eye, title, body, tag]) => <Card key={title} eye={eye} title={title} body={body} tag={tag} />)}</div>;
  if (current === 3) return <><TamMap /><div className="grid overflow-hidden rounded border border-[#e8e8e8] md:grid-cols-4">{[["Total Market", "895", "Addressable accounts"], ["Active Customers", "161", "18% account share"], ["Warm Pipeline", "314", "Engaged + outreach"], ["Whitespace", "420", "Unworked leads"]].map(([a,b,c]) => <div key={a} className="border-b border-r border-[#e8e8e8] bg-white p-4"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">{a}</div><div className="mt-2 text-3xl font-extrabold text-[#111]">{b}</div><div className="text-[10px] text-[#888]">{c}</div></div>)}</div></>;
  if (current === 4) return <div className="grid gap-4 lg:grid-cols-2"><Persona title="Executive Buyer" role="Decision-Maker" segment="High-Value Existing Customers" priority="Revenue growth, competitive position, operational efficiency" message="Business outcomes, ROI, strategic fit with growth agenda" /><Persona title="Category / Ops Manager" role="Operational Buyer" segment="Mid-Tier Growth Customers" priority="Supplier reliability, ease of ordering, product availability" message="Availability, service levels, category depth and breadth" /></div>;
  if (current === 5) return <div className="grid gap-0 overflow-hidden rounded border border-[#e8e8e8] lg:grid-cols-3">{tiers.map(([num, title, body]) => <div key={num} className="border-b border-r border-[#e8e8e8] bg-white p-6"><div className="text-4xl font-extrabold text-[#4a9e7a]">{num}</div><div className="mt-2 text-sm font-bold text-[#111]">{title}</div><p className="mt-3 text-xs leading-relaxed text-[#555]">{body}</p></div>)}</div>;
  if (current === 6) return <Funnel />;
  if (current === 7) return <div className="grid gap-4 lg:grid-cols-2">{signalRows.map(([title, sub, flow, tag]) => <Card key={title} eye={tag} title={title} body={`${sub}. ${flow}.`} tag={tag} />)}</div>;
  if (current === 8) return <Campaign />;
  if (current === 9) return <div className="grid gap-0 overflow-hidden rounded border border-[#e8e8e8] lg:grid-cols-3"><ListCard title="Tier 1 Accounts" items={["Assigned to senior sellers", "Weekly executive touchpoints", "Strategic account plans", "Talk track: value expansion", "KPI: NRR, LTV growth"]} /><ListCard title="Tier 2 Accounts" items={["Mid-market sellers assigned", "Signal-triggered outreach", "Category expansion playbooks", "Talk track: offers", "KPI: revenue per account"]} /><ListCard title="Tier 1 Prospects" items={["AE-assigned priority", "Multi-contact account plays", "Campaign context in CRM", "Talk track: urgency and fit", "KPI: win rate and revenue"]} /></div>;
  if (current === 10) return <Alignment />;
  return <><div className="grid gap-0 overflow-hidden rounded border border-[#e8e8e8] md:grid-cols-2 xl:grid-cols-4">{performance.map(([layer, kpi, source]) => <div key={layer} className="border-b border-r border-[#e8e8e8] bg-white p-4"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#4a9e7a]">{layer}</div><div className="mt-2 text-sm font-bold text-[#111]">{kpi}</div><div className="mt-1 text-[10px] text-[#888]">{source}</div></div>)}</div><div className="mt-5 rounded border border-[#4a9e7a] bg-[#edf6f1] p-5"><div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#4a9e7a]">The complete system</div><p className="mt-2 text-sm font-medium leading-relaxed text-[#111]">This is how we move from executive goals to market intelligence, from market intelligence to marketing and sales action, and from action back to measurable business performance.</p></div></>;
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return <div className="border-b border-r border-[#e8e8e8] bg-white p-5"><div className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">{title}</div><div className="space-y-2">{items.map(item => <div key={item} className="flex items-start gap-2 border-b border-[#f7f7f7] pb-2 text-xs text-[#444]"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#4a9e7a]" />{item}</div>)}</div></div>;
}

function Card({ eye, title, body, tag }: { eye: string; title: string; body: string; tag: string }) {
  return <div className="rounded border border-[#e8e8e8] bg-white p-5 shadow-sm"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">{eye}</div><div className="mt-2 text-sm font-bold text-[#111]">{title}</div><p className="mt-2 text-xs leading-relaxed text-[#555]">{body}</p><span className="mt-4 inline-block rounded bg-[#edf6f1] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#2e7d52]">{tag}</span></div>;
}

function Persona({ title, role, segment, priority, message }: { title: string; role: string; segment: string; priority: string; message: string }) {
  return <div className="overflow-hidden rounded border border-[#e8e8e8] bg-white"><div className="flex h-32 items-center justify-center bg-gradient-to-br from-[#e0ebe4] to-[#c8dbd0]"><div className="h-16 w-16 rounded-full bg-[#4a9e7a]/60" /><div className="ml-8 h-16 w-44 rounded bg-white/35" /></div><div className="p-5"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#4a9e7a]">{role}</div><div className="mt-1 text-lg font-extrabold text-[#111]">{title}</div><div className="mt-1 border-b border-[#e8e8e8] pb-3 text-[10px] font-semibold uppercase tracking-wide text-[#888]">{segment}</div><div className="mt-4 space-y-3 text-xs leading-relaxed text-[#444]"><p><strong className="text-[#111]">Priority:</strong> {priority}</p><p><strong className="text-[#111]">Message:</strong> {message}</p></div></div></div>;
}

function Funnel() {
  const rows = [["Market Reach", "2.4M"], ["Leads", "12,400"], ["MQL", "3,840"], ["SQL", "1,228"], ["Opportunity", "614"], ["Closed Won", "196"], ["Revenue", "$84.2M"]];
  return <div className="grid gap-5 lg:grid-cols-2"><div className="overflow-hidden rounded border border-[#e8e8e8]">{rows.map(([a,b], i) => <div key={a} className={i === rows.length - 1 ? "flex items-center justify-between bg-[#edf6f1] p-4" : "flex items-center justify-between border-b border-[#e8e8e8] bg-white p-4"}><div><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">{a}</div><div className="mt-1 text-xl font-extrabold text-[#111]">{b}</div></div><div className="text-[10px] font-semibold text-[#2e7d52]">{i === 0 ? "Total reach" : i === rows.length - 1 ? "TTM closed" : "Conversion tracked"}</div></div>)}</div><svg viewBox="0 0 280 360" className="w-full rounded border border-[#e8e8e8] bg-white p-4"><polygon points="10,0 270,0 250,52 30,52" fill="#e8f0ea"/><polygon points="30,56 250,56 234,106 46,106" fill="#dde9e3"/><polygon points="46,110 234,110 218,158 62,158" fill="#cfdfc8"/><polygon points="62,162 218,162 202,210 78,210" fill="#b8d4b0"/><polygon points="78,214 202,214 186,262 94,262" fill="#8ec49e"/><polygon points="94,266 186,266 172,314 108,314" fill="#5aac78"/><polygon points="108,318 172,318 156,360 124,360" fill="#4a9e7a"/><text x="140" y="30" textAnchor="middle" fontSize="14" fontWeight="800">2.4M</text><text x="140" y="88" textAnchor="middle" fontSize="14" fontWeight="800">12,400</text><text x="140" y="142" textAnchor="middle" fontSize="14" fontWeight="800">3,840</text><text x="140" y="194" textAnchor="middle" fontSize="14" fontWeight="800">1,228</text><text x="140" y="246" textAnchor="middle" fontSize="14" fontWeight="800">614</text><text x="140" y="298" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">196</text><text x="140" y="344" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">$84.2M</text></svg></div>;
}

function Campaign() {
  return <div className="overflow-hidden rounded border border-[#e8e8e8]"><div className="bg-[#111] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white">Campaign: Public Funding Recipients — Q4 Outreach</div><div className="grid gap-0 lg:grid-cols-4">{[["01 Audience", "14 funded accounts", "Matched to TAM · Tier 1 & 2 prospects"], ["02 Message", "Your funding. Your move.", "Segment-specific page · urgency-led offer"], ["03 Channels", "Email + LinkedIn + Display", "Retargeting active · sales email sequence"], ["04 Sales Handoff", "CRM tasks created", "Sellers assigned · talk track delivered"]].map(([a,b,c]) => <div key={a} className="border-b border-r border-[#e8e8e8] bg-white p-5"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#4a9e7a]">{a}</div><div className="mt-2 text-sm font-bold text-[#111]">{b}</div><p className="mt-1 text-xs leading-relaxed text-[#888]">{c}</p></div>)}</div><div className="flex flex-wrap gap-2 bg-[#f7f7f7] p-4 text-[10px]"><span className="font-bold uppercase tracking-wide text-[#888]">Performance:</span><span className="rounded border bg-white px-2 py-1">Open rate 34%</span><span className="rounded border bg-white px-2 py-1">3 SQLs in week 1</span><span className="rounded border bg-white px-2 py-1">$280K pipeline created</span><span className="rounded border bg-white px-2 py-1">1 closed in 28 days</span></div></div>;
}

function Alignment() {
  return <div className="grid overflow-hidden rounded border border-[#e8e8e8] lg:grid-cols-[1fr_190px_1fr]"><ListCard title="Marketing Outputs" items={["Segment-targeted campaigns", "Demand generation & content", "Paid media & retargeting", "MQL creation & scoring", "Signal-triggered activation", "Campaign ROI measurement"]} /><div className="flex flex-col items-center justify-center gap-3 bg-[#4a9e7a] p-6 text-center text-white"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/70">Shared Intelligence Layer</div>{["KPI Framework", "Segmentation", "TAM + Personas", "Tiering", "Signals"].map(item => <div key={item} className="text-xs font-bold">{item}</div>)}</div><ListCard title="Sales Outputs" items={["Account & territory assignment", "Tier-based prioritization", "Persona-matched talk tracks", "Signal-driven outreach", "Opportunity creation", "Closed-won revenue"]} /></div>;
}

export default function CommercialStrategyPage() {
  const [current, setCurrent] = useState(0);
  const chapter = chapters[current];
  const pct = ((current + 1) / chapters.length) * 100;

  const go = (dir: number) => {
    if (current === chapters.length - 1 && dir > 0) return setCurrent(0);
    setCurrent((value) => Math.max(0, Math.min(chapters.length - 1, value + dir)));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-[#111]">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#e8e8e8] bg-white px-8">
        <a href="/" className="text-[17px] font-extrabold tracking-[-0.02em] text-[#111]">About <em className="italic text-[#4a9e7a]">Chad</em></a>
        <div className="hidden gap-7 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#888] md:flex">
          <a href="/">About</a><a href="/approach">My Approach</a><a href="/career">Career</a><a href="/skills">Skills</a><a href="/contact">Contact</a>
        </div>
      </header>
      <div className="fixed left-0 right-0 top-14 z-40 h-0.5 bg-[#e8e8e8]"><div className="h-full bg-[#4a9e7a] transition-all" style={{ width: `${pct}%` }} /></div>
      <div className="flex min-h-screen pt-14">
        <aside className="hidden w-[220px] shrink-0 overflow-y-auto border-r border-[#e8e8e8] p-5 lg:block">
          {chapters.map((item, idx) => (
            <button key={item.nav} onClick={() => setCurrent(idx)} className={`mb-1 flex w-full items-start gap-3 rounded px-3 py-2 text-left transition ${idx === current ? "bg-[#edf6f1]" : "hover:bg-[#f7f7f7]"}`}>
              <span className={`mt-1 h-2 w-2 rounded-full border ${idx <= current ? "border-[#4a9e7a] bg-[#4a9e7a]" : "border-[#e8e8e8] bg-white"}`} />
              <span className={`text-[10px] font-semibold uppercase leading-snug tracking-[0.07em] ${idx === current ? "text-[#4a9e7a]" : "text-[#888]"}`}>{item.nav}</span>
            </button>
          ))}
        </aside>
        <section className="flex-1 overflow-y-auto px-6 pb-28 pt-10 lg:px-12">
          <div className="mx-auto max-w-[1120px]">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4a9e7a]">{chapter.eyebrow}</div>
            <h1 className="mb-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#111] lg:text-5xl">{chapter.title}</h1>
            <p className="mb-6 max-w-2xl text-sm leading-7 text-[#444]">{chapter.body}</p>
            <div className="mb-8 max-w-2xl border-l-4 border-[#4a9e7a] pl-4 text-sm italic leading-7 text-[#777]">Before we build the strategy, we define the scoreboard. Every segment, campaign, sales motion, and customer action is measured against executive outcomes.</div>
            <ChapterContent current={current} />
          </div>
        </section>
      </div>
      <footer className="fixed bottom-0 right-0 z-40 flex w-full items-center justify-between border-t border-[#e8e8e8] bg-white px-6 py-4 lg:w-[calc(100%-220px)] lg:px-12">
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#888]">Chapter {current + 1} of {chapters.length}</div>
        <div className="flex gap-2"><button onClick={() => go(-1)} disabled={current === 0} className="rounded border border-[#e8e8e8] px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-[#888] disabled:opacity-30">← Back</button><button onClick={() => go(1)} className="rounded border border-[#4a9e7a] bg-[#4a9e7a] px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-white">{current === chapters.length - 1 ? "↩ Start Over" : "Next →"}</button></div>
      </footer>
    </main>
  );
}
