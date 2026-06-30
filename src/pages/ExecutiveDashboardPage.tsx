import { useState } from "react";

type TabKey = "ceo" | "cmo" | "cso" | "cgo";

const tabs: { key: TabKey; label: string }[] = [
  { key: "ceo", label: "CEO Overview" },
  { key: "cmo", label: "CMO" },
  { key: "cso", label: "CSO" },
  { key: "cgo", label: "CGO" },
];

const summaries: Record<TabKey, [string, string, string, string][]> = {
  ceo: [
    ["Revenue (TTM)", "$84.2M", "▲ 14.3% year over year", "pos"],
    ["Gross Margin", "42.1%", "▲ 1.8 pts vs. prior year", "pos"],
    ["Operating Cash Flow", "$11.4M", "▼ 4.2% below plan", "warn"],
    ["Funded Debt / EBITDA", "3.1×", "Above 2.5× covenant", "crit"],
    ["KPIs On Track", "8 / 12", "2 watch · 2 critical", "flat"],
  ],
  cmo: [
    ["Marketing Sourced Revenue", "$31.2M", "▲ 37% of total closed-won", "pos"],
    ["LTV : CAC Ratio", "4.8×", "▲ Above 4.0× threshold", "pos"],
    ["Net Revenue Retention", "108%", "▲ Expanding customer base", "pos"],
    ["CMO KPIs On Track", "7 / 10", "2 watch · 1 critical", "flat"],
  ],
  cso: [
    ["Total Bookings (TTM)", "$91.4M", "▲ 11.2% vs. prior year", "pos"],
    ["Quota Attainment", "94%", "▼ Below 100% target", "warn"],
    ["Win Rate", "31.9%", "▼ Down 3 pts YoY", "warn"],
    ["CSO KPIs On Track", "5 / 8", "2 watch · 1 critical", "flat"],
  ],
  cgo: [
    ["Blended Growth Rate", "14.3%", "▲ New + Expansion combined", "pos"],
    ["NRR (Net Rev. Retention)", "108%", "▲ Expanding beyond churn", "pos"],
    ["Payback Period", "11 mos", "▼ Above 9-month target", "crit"],
    ["CGO KPIs On Track", "6 / 9", "2 watch · 1 critical", "flat"],
  ],
};

const marketRows = [
  ["Active customers", "161"],
  ["Recent customers", "66"],
  ["Engaged", "58"],
  ["Recent outreach", "86"],
  ["Dormant / lapsed", "104"],
  ["Leads (unworked)", "420"],
  ["Total addressable", "895"],
];

const kpis: Record<TabKey, { title: string; label: string; items: [string, string, string, string, string, string, string][] }[]> = {
  ceo: [
    { title: "Profitability", label: "KPIs 1–4", items: [["Gross Margin", "42.1", "%", "Target 40.0%", "On Track", "pos", "84"], ["Operating Margin", "11.4", "%", "Target 13.0%", "Watch", "warn", "66"], ["Revenue Growth Rate", "14.3", "%", "Target 12.0%", "Exceeding", "pos", "95"], ["Return on Invested Capital", "9.2", "%", "Target 10.0%", "Watch", "warn", "72"]] },
    { title: "Cash & Working Capital", label: "KPIs 5–8", items: [["Cash Conversion Cycle", "38", "days", "Target < 45 days", "On Track", "pos", "78"], ["Working Capital % of Revenue", "18.7", "%", "Target < 20%", "On Track", "pos", "60"], ["Operating CF to Sales", "13.6", "%", "Target 12.0%", "On Track", "pos", "85"], ["Free Cash Flow Margin", "8.4", "%", "Target 10.0%", "On Track", "pos", "64"]] },
    { title: "Debt & Coverage", label: "KPIs 9–12", items: [["Current Ratio", "1.74", "×", "Target ≥ 1.5×", "On Track", "pos", "87"], ["Funded Debt-to-EBITDA", "3.1", "×", "Target ≤ 2.5×", "Critical", "crit", "100"], ["Debt Service Coverage", "1.42", "×", "Target ≥ 1.75×", "Critical", "crit", "52"], ["EBITDA to Operating CF", "0.88", "×", "Target ≥ 0.85×", "On Track", "pos", "88"]] },
  ],
  cmo: [
    { title: "Pipeline & Revenue Influence", label: "KPIs 1–3", items: [["Marketing Sourced Revenue", "37", "%", "Target 35%", "Exceeding", "pos", "92"], ["Pipeline Coverage Ratio", "3.2", "×", "Target ≥ 3.0×", "On Track", "pos", "80"], ["MQL → SQL Conversion", "32", "%", "Target 38%", "Watch", "warn", "64"]] },
    { title: "Retention & Expansion", label: "KPIs 4–6", items: [["Customer Lifetime Value", "$23.1K", "", "Target $20K", "Exceeding", "pos", "88"], ["Net Revenue Retention", "108", "%", "Target ≥ 105%", "On Track", "pos", "90"], ["Return on Marketing Investment", "5.0", "×", "Target ≥ 4.5×", "On Track", "pos", "83"]] },
  ],
  cso: [
    { title: "Pipeline Health", label: "KPIs 1–4", items: [["Pipeline Coverage Ratio", "3.2", "×", "Target ≥ 3.0×", "On Track", "pos", "80"], ["Win Rate", "31.9", "%", "Target 38%", "Watch", "warn", "58"], ["Sales Cycle Length", "74", "days", "Target < 60 days", "Watch", "warn", "74"], ["SQL-to-Close Rate", "16", "%", "Target 20%", "Watch", "warn", "64"]] },
    { title: "Revenue & Retention", label: "KPIs 5–8", items: [["Revenue per Sales Rep", "$3.8M", "", "Target $4.0M", "On Track", "pos", "84"], ["Account Retention Rate", "88", "%", "Target 90%", "On Track", "pos", "88"], ["Expansion Revenue %", "22", "%", "Target 25%", "On Track", "pos", "73"], ["Forecast Accuracy", "91", "%", "Target ≥ 90%", "On Track", "pos", "91"]] },
  ],
  cgo: [
    { title: "Acquisition Efficiency", label: "KPIs 1–3", items: [["Blended CAC", "$4,820", "", "Target < $5,500", "On Track", "pos", "74"], ["CAC Payback Period", "11", "mos", "Target < 9 months", "Critical", "crit", "69"], ["Growth Efficiency Index", "0.71", "", "Target ≥ 0.75", "Watch", "warn", "71"]] },
    { title: "Retention & Lifetime Value", label: "KPIs 4–6", items: [["Gross Revenue Churn", "6.2", "%", "Target < 5%", "Watch", "warn", "62"], ["LTV : CAC Ratio", "4.8", "×", "Target ≥ 4.0×", "Exceeding", "pos", "96"], ["Customer Lifetime Value", "$23.1K", "", "Target $20K", "Exceeding", "pos", "88"]] },
    { title: "Channel & Market", label: "KPIs 7–9", items: [["Digital Channel Mix", "44", "%", "Target 50%", "On Track", "pos", "80"], ["Account Share of Wallet", "31", "%", "Target 40%", "Watch", "warn", "62"], ["Revenue Market Share", "6.2", "%", "Target 8.0%", "On Track", "pos", "62"]] },
  ],
};

const callouts: Record<Exclude<TabKey, "ceo">, [string, string, string, string][]> = {
  cmo: [["LTV : CAC Ratio", "4.8×", "$23.1K lifetime value against $4.8K blended acquisition cost", "Strong unit economics · Target ≥ 4.0×"], ["Customer Acquisition Cost", "$4,820", "Digital $3,140 · Field $7,280 · Blended across all channels", "Below $5,500 target"], ["CAC Payback Period", "11 mos", "Months to recover acquisition cost at current avg. contract value", "Above 9-month target"]],
  cso: [["Quota Attainment", "94%", "Team-level attainment against $97.2M annual quota", "Approaching but below 100% target"], ["Reps at Quota", "58%", "14 of 24 quota-carrying reps at or above individual target", "Below 65% benchmark"], ["Average Deal Size", "$466K", "196 deals closed at an average contract value of $466K", "Up 8.2% vs. prior year"]],
  cgo: [["Net Revenue Retention", "108%", "Existing customer base expanding faster than churn rate of 6.2%", "Compounding base · Target ≥ 105%"], ["New Logo Growth Rate", "18%", "Net new logos acquired year over year across all channels", "Above 15% target"], ["Expansion Revenue Rate", "22%", "Revenue from existing account expansion as a share of total revenue", "Below 25% target — upsell motion underperforming"]],
};

const tone = (state: string) => state === "pos" ? "text-[#2e7d52]" : state === "warn" ? "text-[#b45309]" : state === "crit" ? "text-[#b91c1c]" : "text-[#888]";
const dot = (state: string) => state === "pos" ? "bg-[#2e7d52]" : state === "warn" ? "bg-[#b45309]" : "bg-[#b91c1c]";

function SectionHeader({ title, label }: { title: string; label: string }) {
  return <div className="mb-3 flex items-baseline justify-between"><h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">{title}</h2><span className="text-[10px] font-bold uppercase tracking-wide text-[#ddd]">{label}</span></div>;
}

function KpiGrid({ items }: { items: [string, string, string, string, string, string, string][] }) {
  return <div className="mb-8 grid overflow-hidden rounded border border-[#e8e8e8] md:grid-cols-2 lg:grid-cols-4">{items.map(([name, value, unit, target, status, state, progress], idx) => <div key={name} className="flex min-h-[165px] flex-col border-b border-r border-[#e8e8e8] bg-white p-4 last:border-r-0"><div className="mb-3 flex items-start justify-between gap-3"><div className="text-[11px] font-semibold leading-snug text-[#111]">{name}</div><div className="text-[9px] font-bold text-[#ddd]">{String(idx + 1).padStart(2, "0")}</div></div><div className="mb-3 flex items-baseline gap-1"><span className="text-3xl font-extrabold leading-none tracking-[-0.03em] text-[#111]">{value}</span>{unit && <span className="text-sm text-[#888]">{unit}</span>}</div><div className="mb-3 h-0.5 overflow-hidden rounded bg-[#e8e8e8]"><div className={`h-full ${state === "crit" ? "bg-[#b91c1c]" : "bg-[#c8d0d8]"}`} style={{ width: `${progress}%` }} /></div><div className="mt-auto flex items-center justify-between border-t border-[#f7f7f7] pt-3 text-[10px] text-[#888]"><span>{target}</span><span className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.05em] ${tone(state)}`}><span className={`h-1.5 w-1.5 rounded-full ${dot(state)}`} />{status}</span></div></div>)}</div>;
}

export default function ExecutiveDashboardPage() {
  const [active, setActive] = useState<TabKey>("ceo");

  return <main className="min-h-screen bg-white font-sans text-[#111]"><div className="mx-auto max-w-[1300px] px-6 py-10 lg:px-10"><header className="mb-8 flex flex-col gap-5 border-b border-[#e8e8e8] pb-7 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-4xl font-extrabold leading-none tracking-[-0.03em] lg:text-[38px]">Executive <em className="italic text-[#4a9e7a]">Dashboard</em></h1><p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#888]">C-Suite Performance Framework · Apparel Retail</p></div><div className="text-left text-[11px] leading-relaxed text-[#888] lg:text-right"><strong className="block font-bold uppercase tracking-[0.08em] text-[#444]">FY 2025 · Q4 YTD</strong>As of December 31, 2025<br />Illustrative · For presentation use</div></header><div className="mb-9 flex overflow-x-auto border-b border-[#e8e8e8]">{tabs.map(tab => <button key={tab.key} onClick={() => setActive(tab.key)} className={`mb-[-1px] whitespace-nowrap rounded-t px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${active === tab.key ? "border border-[#4a9e7a] bg-[#4a9e7a] text-white" : "text-[#888] hover:text-[#444]"}`}>{tab.label}</button>)}</div><div className={`mb-11 grid overflow-hidden rounded border border-[#e8e8e8] ${summaries[active].length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>{summaries[active].map(([label, value, delta, state]) => <div key={label} className="border-b border-r border-[#e8e8e8] bg-white p-5 last:border-r-0 lg:border-b-0"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">{label}</div><div className="mb-2 text-3xl font-extrabold leading-none tracking-[-0.03em]">{value}</div><div className={`text-[11px] ${tone(state)}`}>{delta}</div></div>)}</div>{active === "ceo" && <><SectionHeader title="Market Share" label="TAM · Account & Revenue Basis" /><div className="mb-10 grid overflow-hidden rounded border border-[#e8e8e8] lg:grid-cols-3"><div className="border-b border-r border-[#e8e8e8] bg-white p-5 lg:border-b-0"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">Account-Based Market Share</div><div className="mb-2 text-[46px] font-extrabold leading-none tracking-[-0.05em] text-[#4a9e7a]">18.0%</div><p className="mb-4 text-[11px] leading-relaxed text-[#888]">161 active customers out of 895 addressable accounts</p><div className="h-1.5 rounded bg-[#e8e8e8]"><div className="h-full rounded bg-[#4a9e7a]" style={{ width: "18%" }} /></div></div><div className="border-b border-r border-[#e8e8e8] bg-white p-5 lg:border-b-0"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">Revenue-Based Market Share</div><div className="mb-2 text-[46px] font-extrabold leading-none tracking-[-0.05em] text-[#4a9e7a]">6.2%</div><p className="mb-4 text-[11px] leading-relaxed text-[#888]">$84.2M against an estimated $1.36B TAM</p><div className="h-1.5 rounded bg-[#e8e8e8]"><div className="h-full rounded bg-[#4a9e7a]" style={{ width: "6.2%" }} /></div></div><div className="bg-white p-5"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">Account Pipeline Breakdown</div>{marketRows.map(([k, v]) => <div key={k} className="flex justify-between border-b border-[#f7f7f7] py-1.5 text-[11px] last:border-b-0 last:border-t last:font-bold"><span className="uppercase tracking-wide text-[#888]">{k}</span><span className="font-bold">{v}</span></div>)}</div></div></>}{active !== "ceo" && <><SectionHeader title={active === "cmo" ? "Unit Economics" : active === "cso" ? "Sales Team Performance" : "Growth Engine Health"} label="Core Executive Metrics" /><div className="mb-10 grid overflow-hidden rounded border border-[#e8e8e8] lg:grid-cols-3">{callouts[active].map(([label, value, sub, delta], idx) => <div key={label} className="border-b border-r border-[#e8e8e8] bg-white p-5 last:border-r-0 lg:border-b-0"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#888]">{label}</div><div className={`mb-2 text-[46px] font-extrabold leading-none tracking-[-0.05em] ${idx === 0 ? "text-[#4a9e7a]" : "text-[#111]"}`}>{value}</div><p className="mb-2 text-[11px] leading-relaxed text-[#888]">{sub}</p><div className="text-[11px] font-medium text-[#2e7d52]">{delta}</div></div>)}</div>{active === "cmo" && <><SectionHeader title="Demand Funnel" label="TTM · All Channels" /><div className="mb-8 grid overflow-hidden rounded border border-[#e8e8e8] md:grid-cols-5">{[["Impressions", "2.4M", "Total reach"], ["MQLs", "3,840", "Conv. 0.16%"], ["SQLs", "1,228", "MQL→SQL 32%"], ["Opportunities", "614", "SQL→Opp 50%"], ["Closed Won", "196", "Win rate 31.9%"]].map(([stage, num, conv]) => <div key={stage} className="border-b border-r border-[#e8e8e8] bg-white p-4 text-center last:border-r-0 md:border-b-0"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#888]">{stage}</div><div className="mb-1 text-2xl font-extrabold">{num}</div><div className="text-[10px] text-[#888]">{conv}</div></div>)}</div></>}</>}{kpis[active].map(section => <section key={section.title}><SectionHeader title={section.title} label={section.label} /><KpiGrid items={section.items} /></section>)}<footer className="mt-2 flex flex-col gap-3 border-t border-[#e8e8e8] pt-5 text-[10px] font-medium text-[#888] lg:flex-row lg:items-center lg:justify-between"><span>Apparel Retail · Executive Operations · As of December 31, 2025</span><span className="flex gap-4 uppercase tracking-wide"><span>● On Track</span><span>● Watch</span><span>● Critical</span></span><span>Illustrative · For presentation use</span></footer></div></main>;
}
