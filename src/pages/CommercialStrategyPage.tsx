import { useMemo, useState } from "react";

const stages = [
  {
    nav: "KPI Foundation",
    eyebrow: "Chapter 01 — What defines success?",
    title: (
      <>
        Set the <em>business scoreboard.</em>
      </>
    ),
    body:
      "Before any market work starts, the executive team needs one view of success. That view should connect revenue growth, market share, gross margin, CAC payback, pipeline coverage, and decision speed.",
    quote:
      "The scoreboard should tell leaders where to invest, which segments to prioritize, what to stop doing, and whether the commercial system is creating enterprise value.",
  },
  {
    nav: "Segmentation",
    eyebrow: "Chapter 02 — Where should we compete?",
    title: (
      <>
        Separate the market. <em>Find the growth.</em>
      </>
    ),
    body:
      "The market should be split by buying pressure, not just by firmographics. Each segment needs a different growth objective, a different trigger, and a different commercial motion.",
    quote:
      "Segmentation should show which accounts deserve investment, which ones need education, and which ones are ready for executive-level attention.",
  },
  {
    nav: "Total Addressable Market",
    eyebrow: "Chapter 03 — Total Addressable Market",
    title: (
      <>
        Size the <em>addressable opportunity.</em>
      </>
    ),
    body:
      "Once the segments are clear, the next question is size. The TAM layer should show account counts, whitespace, and estimated value by category so leaders can compare market share against expansion potential.",
    quote:
      "The market view should make it obvious where the growth lives, how much value is reachable, and where the current model is underpenetrated.",
  },
  {
    nav: "Audience Architecture",
    eyebrow: "Chapter 04 — Audience Architecture",
    title: (
      <>
        Who makes the decision. <em>And what they need.</em>
      </>
    ),
    body:
      "Audience architecture should show account value, buying power, and message relevance. Tiering tells leadership where to focus. Personas tell the team how the decision gets made inside each account.",
    quote:
      "The model should separate strategic enterprise accounts from growth accounts and launch-stage accounts, then map the personas who influence margin, access, evidence, and adoption.",
  },
  {
    nav: "Prospect Funnel",
    eyebrow: "Chapter 05 — Prospect Funnel",
    title: (
      <>
        Where do we win or <em>lose opportunity?</em>
      </>
    ),
    body:
      "The funnel should show where reach becomes demand, where demand becomes opportunity, and where revenue is getting stuck. That lets leaders see conversion, drop-off, and pipeline coverage in one view.",
    quote: "The funnel should show where the business gains momentum and where it leaks it.",
  },
  {
    nav: "Signal Intelligence",
    eyebrow: "Chapter 06 — Signal Intelligence",
    title: (
      <>
        React to the right signal <em>at the right time.</em>
      </>
    ),
    body:
      "Signals should separate noise from action. The goal is to identify market, account, and stakeholder changes that justify a commercial response before the opportunity goes cold.",
    quote:
      "The strategy should tell teams what to react to, why it matters, and which account deserves attention first.",
  },
  {
    nav: "Commercial Activation",
    eyebrow: "Chapter 07 — Commercial Activation",
    title: (
      <>
        Where should we invest and <em>what return do we expect?</em>
      </>
    ),
    body:
      "Activation should show channel economics, not just campaign mechanics. If the KPI foundation is right, leaders can compare investment, pipeline, revenue, and ROI before budget gets deployed.",
    quote:
      "Commercial activation should make it obvious which channels deserve budget, which accounts deserve a direct motion, and what return the system can reasonably produce.",
  },
  {
    nav: "Sales Motion",
    eyebrow: "Chapter 08 — Sales Motion",
    title: (
      <>
        How do we convert opportunity <em>into revenue?</em>
      </>
    ),
    body:
      "Sales motion should reflect the same intelligence layer as the rest of the strategy. Account priority, talk track, proof point, and handoff all need to match the segment, the signal, and the activation channel.",
    quote: "Sales motions get stronger when the team sells from one commercial system instead of separate playbooks.",
  },
  {
    nav: "M+S Alignment",
    eyebrow: "Chapter 09 — Marketing + Sales Alignment",
    title: (
      <>
        How do teams operate as <em>one system?</em>
      </>
    ),
    body:
      "Marketing, sales, and customer success should work from the same signal view, the same account priorities, and the same revenue logic. That creates one operating system instead of separate swimlanes.",
    quote: "One system should govern market signals, commercial intelligence, activation, and revenue inspection.",
  },
  {
    nav: "Return to Dashboard",
    eyebrow: "Chapter 10 — Performance Layer",
    title: (
      <>
        Did we create <em>enterprise value?</em>
      </>
    ),
    body:
      "The final dashboard should tie directly back to Chapter 1 and show whether the system improved growth, margin, pipeline, conversion, and executive visibility. If the numbers move, the commercial system is working.",
    quote:
      "The dashboard is not the strategy by itself. It is the proof that the strategy created value across the commercial operating system.",
  },
];

const chapterGroups = [
  "FOUNDATION",
  "FOUNDATION",
  "FOUNDATION",
  "FOUNDATION",
  "EXECUTION",
  "EXECUTION",
  "EXECUTION",
  "MEASUREMENT & SYSTEM",
  "MEASUREMENT & SYSTEM",
  "MEASUREMENT & SYSTEM",
] as const;

function MobileChapterNav({ current, onSelect }: { current: number; onSelect: (idx: number) => void }) {
  const groupedStages = [
    { label: "FOUNDATION", indexes: [0, 1, 2, 3] },
    { label: "EXECUTION", indexes: [4, 5, 6] },
    { label: "MEASUREMENT & SYSTEM", indexes: [7, 8, 9] },
  ];

  return (
    <div className="mobile-chapter-bar" style={{ display: "none" }}>
      <div className="mobile-chapter-meta">
        <div className="mobile-chapter-group">{chapterGroups[current]}</div>
        <div className="mobile-chapter-title">
          {String(current + 1).padStart(2, "0")} · {stages[current].nav}
        </div>
      </div>

      <label className="mobile-chapter-picker">
        <span>Jump to chapter</span>
        <select value={current} onChange={(e) => onSelect(Number(e.target.value))} aria-label="Jump to chapter">
          {groupedStages.map((group) => (
            <optgroup label={group.label} key={group.label}>
              {group.indexes.map((idx) => (
                <option key={stages[idx].nav} value={idx}>
                  {String(idx + 1).padStart(2, "0")} {stages[idx].nav}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
    </div>
  );
}

const styles = `.commercial-page{--green:#4a9e7a;--green-pale:#edf6f1;--ink:#111;--body:#444;--muted:#888;--rule:#e8e8e8;--surface:#f7f7f7;--sig-g:#2e7d52;--sig-a:#b45309;height:100vh;overflow:hidden;background:#fff;color:var(--ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.commercial-page *{box-sizing:border-box}.cs-nav{position:fixed;top:0;left:0;right:0;height:56px;background:#fff;border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:50}.cs-logo{font-size:17px;font-weight:800;color:var(--ink);letter-spacing:-.3px;text-decoration:none}.cs-logo em{font-style:italic;color:var(--green)}.cs-links{display:flex;gap:28px;align-items:center}.cs-links a{font-size:10px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;text-decoration:none;color:var(--muted)}.cs-links a.active{color:var(--green)}.cs-progress{position:fixed;top:56px;left:220px;right:0;height:2px;background:var(--rule);z-index:45}.cs-progress-fill{height:100%;background:var(--green);transition:width .25s ease}.cs-shell{display:flex;height:100vh;padding-top:56px}.cs-rail{width:220px;flex-shrink:0;border-right:1px solid var(--rule);padding:28px 20px;overflow-y:auto;background:#fff}.rail-item{width:100%;display:flex;align-items:flex-start;gap:10px;padding:8px 10px;border:0;border-radius:4px;background:transparent;cursor:pointer;text-align:left}.rail-item:hover{background:var(--surface)}.rail-item.active{background:var(--green-pale)}.rail-dot{width:8px;height:8px;border-radius:999px;border:2px solid var(--rule);background:#fff;flex-shrink:0;margin-top:4px}.rail-item.done .rail-dot{background:var(--green);border-color:var(--green);opacity:.42}.rail-item.active .rail-dot{background:var(--green);border-color:var(--green);opacity:1}.rail-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--muted);line-height:1.35}.rail-item.active .rail-label{color:var(--green)}.rail-connector{width:1px;height:10px;background:var(--rule);margin-left:23px}.cs-stage-area{flex:1;overflow-y:auto;padding:40px 48px 116px;background:#fff}.cs-stage{max-width:none;margin:0}.stage-eyebrow{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:var(--green);margin-bottom:12px}.stage-title{font-size:32px;font-weight:800;line-height:1.1;letter-spacing:-.5px;margin:0 0 8px;color:var(--ink);max-width:900px}.stage-title em{font-style:italic;color:var(--green)}.stage-body{font-size:14px;line-height:1.7;color:var(--body);max-width:760px;margin:0 0 32px}.stage-quote{font-size:13px;font-style:italic;color:var(--muted);border-left:3px solid var(--green);padding-left:16px;margin:0 0 28px;line-height:1.65;max-width:760px}.cs-footer{position:fixed;bottom:0;right:0;width:calc(100% - 220px);background:#fff;border-top:1px solid var(--rule);padding:16px 48px;display:flex;align-items:center;justify-content:space-between;z-index:45}.stage-counter{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--muted)}.btns{display:flex;gap:10px}.cs-btn{padding:9px 22px;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;border-radius:3px;border:1px solid var(--rule);background:#fff;color:var(--muted);cursor:pointer}.cs-btn:disabled{opacity:.3}.cs-btn.next{background:var(--green);border-color:var(--green);color:#fff}.section-eye,.card-eye,.kd-eye{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:8px}.kpi-dash,.stat-grid,.return-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:24px}.kd-card,.stat,.rg-card{background:#fff;padding:16px 18px}.kd-val,.stat-value{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;margin-bottom:4px}.kd-delta,.tiny{font-size:10px;color:var(--muted)}.pos,.stat-value.green,.rg-layer{color:var(--green)}.warn{color:var(--sig-a)}.flat{color:var(--muted)}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}.three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}.insight-card,.card,.persona-card,.sm-card,.campaign,.signal-card{background:#fff;border:1px solid var(--rule);border-radius:4px}.insight-card{padding:18px 20px}.insight-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.insight-list li{font-size:12px;font-weight:700;line-height:1.35;display:flex;gap:9px}.insight-list li:before{content:"";width:6px;height:6px;border-radius:999px;background:var(--green);margin-top:6px;flex-shrink:0}.insight-list.blue li:before{background:#2d6bcd}.card{padding:20px}.card-title{font-size:14px;font-weight:800;margin-bottom:6px;color:var(--ink)}.card-body{font-size:12px;color:var(--body);line-height:1.55}.track{height:2px;background:var(--rule);border-radius:1px;margin:10px 0 4px}.track div{height:100%;background:var(--green)}.tag{display:inline-block;margin-top:10px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;padding:3px 8px;border-radius:2px;background:var(--green-pale);color:var(--sig-g)}.tag.blue{background:#eef3fc;color:#2d6bcd}.tag.amber{background:#fef3c7;color:var(--sig-a)}.hint{font-size:11px;color:var(--muted)}.tam-shell{border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:20px;position:relative;height:360px;background:#e8edf2}.tam-map{position:absolute;inset:0}.map-dot{position:absolute;border-radius:999px;box-shadow:0 1px 4px rgba(0,0,0,.25)}.tam-card{position:absolute;top:14px;right:14px;background:rgba(255,255,255,.97);border:1px solid var(--rule);padding:13px 16px;text-align:right;box-shadow:0 1px 5px rgba(0,0,0,.08)}.tam-card strong{font-size:26px;color:var(--green)}.tam-legend{position:absolute;bottom:12px;left:12px;background:rgba(255,255,255,.97);border:1px solid var(--rule);border-radius:3px;padding:10px 14px;display:flex;flex-direction:column;gap:5px}.tam-legend div{font-size:10px;color:var(--body);display:flex;align-items:center;gap:6px}.tam-legend span{width:8px;height:8px;border-radius:999px}.audience-step{display:grid;grid-template-columns:auto minmax(80px,1fr);gap:12px;align-items:center;margin:6px 0 12px}.audience-step span{font-size:9px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:var(--muted)}.audience-step i{height:1px;background:var(--rule)}.tier-grid,.sales-board{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden}.tier-card,.sales-col{background:#fff;padding:20px}.tier-num{font-size:28px;font-weight:800;color:var(--green)}.tier-label{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--muted)}.tier-seg{font-size:12px;font-weight:800;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--rule)}.tier-desc{font-size:11px;color:var(--body);line-height:1.55}.tier-card ul,.sales-list{list-style:none;margin:10px 0 0;padding:0}.tier-card li,.sales-list li{font-size:11px;color:var(--muted);padding:4px 0 4px 12px;position:relative}.tier-card li:before,.sales-list li:before{content:'›';position:absolute;left:0;color:var(--green);font-weight:800}.audience-explainer{font-size:12px;line-height:1.7;color:var(--body);max-width:760px;margin:18px 0}.persona-primary{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px}.persona-card{overflow:hidden}.pc-photo{height:130px;background:linear-gradient(135deg,#e0ebe4,#c8dbd0);position:relative;display:flex;align-items:center;padding-left:90px}.pc-photo.blue{background:linear-gradient(135deg,#e4eaf0,#ccd6e0)}.pc-head{width:70px;height:70px;border-radius:999px;background:rgba(74,158,122,.6);position:absolute;left:90px;top:18px}.pc-lines{width:260px;height:56px;margin-left:95px;border-radius:3px;background:rgba(255,255,255,.38);position:relative}.pc-badge{position:absolute;bottom:10px;left:12px;background:var(--green);color:#fff;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;padding:3px 8px;border-radius:2px}.pc-body{padding:14px 16px 16px}.pc-role,.sm-role{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--green)}.pc-name{font-size:16px;font-weight:800}.pc-seg{font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px;padding-bottom:9px;border-bottom:1px solid var(--rule)}.pc-row{display:flex;gap:8px;margin:6px 0}.pc-key{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);min-width:52px}.pc-val{font-size:11px;color:var(--body);line-height:1.4}.persona-secondary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.sm-card{padding:14px 15px}.strip{height:4px;border-radius:2px;margin-bottom:10px}.sm-name{font-size:12px;font-weight:800;margin-bottom:6px}.funnel-layout{display:block;margin-bottom:20px}.funnel-list{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden}.funnel-row{min-height:74px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:#fff;padding:10px 8px;text-align:center}.funnel-row:last-child{background:var(--green-pale)}.funnel-num{font-size:19px;line-height:1;font-weight:800}.funnel-note{font-size:10px;color:var(--muted);font-weight:600}.funnel-row:nth-child(n+3) .funnel-note,.funnel-row:last-child .section-eye{color:var(--green);font-weight:800}.signals{display:grid;grid-template-columns:1fr 1fr;gap:16px}.signal-card{overflow:hidden;margin-bottom:16px}.signal-header{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--rule)}.sig-icon{width:32px;height:32px;border-radius:999px;background:var(--green-pale);display:flex;align-items:center;justify-content:center}.sig-title{font-size:13px;font-weight:800}.sig-sub{font-size:11px;color:var(--muted)}.sig-body{background:var(--surface);padding:14px 18px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sig-step{font-size:10px;font-weight:700;color:var(--body);padding:4px 10px;background:#fff;border:1px solid var(--rule);border-radius:2px}.campaign{overflow:hidden}.campaign-head{background:#111;color:#fff;padding:12px 20px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.8px}.campaign-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule)}.campaign-cell{background:#fff;padding:16px}.campaign-perf{background:var(--surface);padding:12px 20px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sales-col{padding:0}.sales-head{padding:12px 16px;border-bottom:1px solid var(--rule);background:var(--surface)}.sales-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px}.sales-sub{font-size:10px;color:var(--muted)}.sales-list{padding:12px 16px}.align-grid{display:grid;grid-template-columns:1fr 180px 1fr;border:1px solid var(--rule);border-radius:4px;overflow:hidden}.align-side{background:#fff;padding:22px}.align-center{background:var(--green);padding:22px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;text-align:center}.align-item{font-size:11px;color:var(--body);padding:5px 0;border-bottom:1px solid var(--surface)}.system-flow{display:flex;flex-direction:column;gap:2px}.sys-row{display:flex;align-items:center;border:1px solid var(--rule);border-radius:3px;overflow:hidden}.sys-label{background:#111;color:#fff;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;padding:8px 14px;min-width:160px}.sys-item{font-size:10px;color:var(--body);padding:8px 14px;border-left:1px solid var(--rule)}.final-box{padding:20px;background:var(--green-pale);border:1px solid var(--green);border-radius:4px;margin-top:20px}.final-box-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--green);margin-bottom:8px}.final-box p{font-size:14px;line-height:1.65;font-weight:600;margin:0};`
const mobileStyles = `@media(max-width:767px){.mobile-chapter-bar{display:flex!important;position:sticky;top:0;z-index:30;flex-direction:column;gap:10px;padding:12px 0 14px;margin:0 0 16px;background:#fff;border-bottom:1px solid var(--rule)}.cs-links,.cs-rail{display:none}.cs-nav{padding:0 16px}.cs-progress{left:0}.cs-shell{padding-top:56px}.cs-stage-area{padding:16px 16px 180px;overflow-x:hidden}.cs-stage{min-width:0}.mobile-chapter-meta{display:flex;flex-direction:column;gap:3px}.mobile-chapter-group{font-size:9px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:var(--green)}.mobile-chapter-title{font-size:14px;font-weight:800;line-height:1.25;color:var(--ink)}.mobile-chapter-picker{display:flex;flex-direction:column;gap:6px}.mobile-chapter-picker span{font-size:9px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:var(--muted)}.mobile-chapter-picker select{width:100%;padding:12px 14px;border:1px solid var(--rule);border-radius:4px;background:#fff;color:var(--ink);font:inherit;font-size:13px;line-height:1.3}.stage-eyebrow{font-size:9px;margin-bottom:8px}.stage-title{font-size:24px;line-height:1.14;margin-bottom:8px;max-width:none}.stage-body{font-size:13px;line-height:1.58;margin:0 0 20px;max-width:none}.stage-quote{font-size:12px;line-height:1.55;padding-left:12px;margin:0 0 20px;max-width:none}.kpi-dash,.stat-grid,.return-grid,.two-col,.three-col,.persona-primary,.persona-secondary,.signals,.campaign-grid,.sales-board,.align-grid,.tier-grid{grid-template-columns:1fr;gap:12px}.kpi-dash,.stat-grid,.return-grid{background:transparent;border:none;overflow:visible}.kd-card,.stat,.rg-card,.card,.persona-card,.sm-card,.signal-card,.campaign,.sales-col{min-width:0}.kd-card,.stat,.rg-card,.card,.persona-card,.sm-card,.signal-card,.campaign,.sales-col,.align-side,.align-center{padding:14px}.kd-val,.stat-value{font-size:20px}.card-title{font-size:13px}.card-body{font-size:12px;line-height:1.5}.track{margin-top:8px}.tier-card{padding:16px}.tier-num{font-size:24px}.tier-desc,.tier-card li,.sales-list li,.align-item{font-size:12px;line-height:1.5}.audience-step{grid-template-columns:1fr;gap:6px;margin:6px 0 10px}.audience-step i{display:none}.audience-explainer{font-size:13px;line-height:1.55;margin:14px 0 16px;max-width:none}.pc-photo{height:108px;padding-left:76px}.pc-head{width:58px;height:58px;left:14px;top:16px}.pc-lines{width:170px;height:42px;margin-left:72px}.pc-body{padding:12px 14px 14px}.pc-name{font-size:15px}.pc-seg{font-size:9px;line-height:1.35}.pc-row{flex-direction:column;gap:2px}.pc-key{min-width:0;font-size:8px}.pc-val{font-size:12px;line-height:1.45}.funnel-list{grid-template-columns:1fr}.funnel-row{align-items:flex-start;justify-content:flex-start;text-align:left;padding:14px;min-height:0}.funnel-num{font-size:24px}.funnel-note{font-size:11px}.signals{gap:12px}.signal-header{align-items:flex-start;padding:14px}.sig-title{font-size:12px}.sig-sub{font-size:10px;line-height:1.4}.sig-body{padding:12px 14px}.sig-step{font-size:9px}.campaign-head{font-size:10px;padding:12px 14px}.campaign-grid{background:transparent;overflow:visible}.campaign-cell{border:1px solid var(--rule);border-radius:4px}.campaign-perf{padding:12px 14px}.sales-col{border:1px solid var(--rule);border-radius:4px;overflow:hidden}.sales-head,.sales-list{padding-left:14px;padding-right:14px}.align-grid{border:none;background:transparent}.align-side,.align-center{padding:16px}.system-flow{gap:8px}.sys-row{flex-direction:column;align-items:stretch}.sys-label{min-width:0;padding:8px 12px}.sys-item{border-left:none;border-top:1px solid var(--rule);padding:8px 12px}.tam-shell{display:flex;flex-direction:column;height:auto;border:none;overflow:visible;background:transparent;margin-bottom:18px}.tam-map{position:relative;inset:auto;width:100%;height:250px;border:1px solid var(--rule);border-radius:4px;overflow:hidden}.tam-card,.tam-legend{position:static}.tam-card{margin-top:12px;text-align:left}.tam-card strong{font-size:24px}.tam-legend{margin-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:12px 14px}.cs-footer{width:100%;padding:12px 16px;flex-direction:column;align-items:stretch;gap:10px}.stage-counter{text-align:center}.btns{display:grid;grid-template-columns:1fr;gap:8px;width:100%}.cs-btn{width:100%;padding:12px 14px;font-size:12px}}`;

function KpiDashboard() {
  const rows = [
    ["Revenue Growth", "14.3%", "▲ Above 12% target", "pos"],
    ["Market Share", "18.0%", "▲ Enterprise share holding", "pos"],
    ["Gross Margin", "54.0%", "▲ Mix protects margin", "pos"],
    ["Pipeline Coverage", "3.2×", "▲ $27.8M qualified pipeline", "pos"],
    ["CAC Payback", "11.8 months", "▲ Inside target window", "pos"],
    ["EBITDA Contribution", "9.6%", "▲ Commercial engine expanding", "pos"],
    ["LTV", "$23.1K", "▲ Expansion value remains high", "pos"],
    ["Expansion Revenue", "22.0%", "▲ Upsell and cross-sell mix", "pos"],
  ];

  return (
    <>
      <div className="kpi-dash">
        {rows.map(([a, b, c, d]) => (
          <div className="kd-card" key={a}>
            <div className="kd-eye">{a}</div>
            <div className="kd-val">{b}</div>
            <div className={`kd-delta ${d}`}>{c}</div>
          </div>
        ))}
      </div>
      <p className="hint">The scoreboard should show growth, margin, payback, and the quality of the opportunity mix.</p>
    </>
  );
}

function SegmentationCombined() {
  const cards = [
    [
      "Emerging Biotech",
      "Preparing first launch",
      "Launch confidence, payer evidence, and a fast path to market readiness.",
      "Buying trigger: first launch / filing",
      "86%",
      "Evidence + activation",
      "",
    ],
    [
      "Mid-Market Pharma",
      "Expanding indications",
      "Portfolio growth, indication prioritization, and cleaner opportunity sizing.",
      "Buying trigger: expansion or portfolio reset",
      "72%",
      "Prioritize + grow",
      "blue",
    ],
    [
      "Enterprise Pharma",
      "Optimizing mature portfolios",
      "Market share, margin, and executive reporting across complex buying committees.",
      "Buying trigger: growth slowdown / leadership change",
      "64%",
      "Protect + expand",
      "amber",
    ],
  ] as const;

  return (
    <>
      <div className="two-col">
        <div className="insight-card">
          <div className="section-eye">Why segments matter</div>
          <ul className="insight-list">
            {[
              "Different buying pressure in each account set",
              "Different intelligence needs by segment",
              "Different value levers by motion",
              "Different triggers for outreach or investment",
            ].map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="insight-card">
          <div className="section-eye">What each segment needs</div>
          <ul className="insight-list blue">
            {[
              "Business need, buying trigger, and intelligence need",
              "Likelihood to expand, launch, or renew",
              "Motion, proof point, and value lever",
              "What leaders should invest in next",
            ].map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="three-col">
        {cards.map(([eye, title, body, note, value, tag, color]) => (
          <div className="card" key={title}>
            <div className="card-eye">{eye}</div>
            <div className="card-title">{title}</div>
            <div className="card-body">{body}</div>
            <div className="track">
              <div style={{ width: value }} />
            </div>
            <div className="tiny">{note}</div>
            <span className={`tag ${color}`}>{tag}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Tam() {
  const dots = useMemo(
    () =>
      Array.from({ length: 86 }, (_, i) => ({
        left: 18 + ((i * 37) % 76),
        top: 8 + ((i * 61) % 84),
        size: i % 5 === 0 ? 10 : i % 3 === 0 ? 8 : 5,
        color: i % 7 === 0 ? "#e8a020" : i % 5 === 0 ? "#2a72d5" : i % 4 === 0 ? "#3baf9e" : "#9eaab8",
      })),
    []
  );

  return (
    <>
      <div className="tam-shell">
        <svg className="tam-map" viewBox="0 0 900 360" preserveAspectRatio="none">
          <rect width="900" height="360" fill="#5a6170" />
          <path
            d="M900 0v360H145c-7-20-17-42-27-55-12-15-24-18-18-31l15-27c5-12-8-23-20-19l-22 7c-17 5-27-21-15-34l20-19c11-11 3-27-10-36-20-16 0-51 31-45 21 3 37-7 44-21 8-17-26-36 5-61 22-18 48-10 64-19z"
            fill="#e4e0d8"
          />
          <path
            d="M160 62h740M150 138h750M140 180h760M135 258h765M148 328h752M210 8v352M370 8v352M520 8v352M680 8v352M830 8v352"
            stroke="#f5f2ec"
            strokeWidth="4"
          />
          <path
            d="M170 100h730M160 160h740M155 220h745M290 8v352M445 8v352M600 8v352M755 8v352"
            stroke="#eeeae2"
            strokeWidth="2"
          />
          <path
            d="M165 50q135 60 205 88 80 27 150 40 70 12 160 22 70 8 150 15"
            stroke="#f0ece4"
            strokeWidth="3"
            fill="none"
          />
          <text x="255" y="128" fontSize="10" fill="#9c9288">
            Northgate
          </text>
          <text x="390" y="128" fontSize="12" fill="#8a8078">
            Central District
          </text>
          <text x="555" y="128" fontSize="10" fill="#9c9288">
            Eastside
          </text>
          <text x="695" y="128" fontSize="10" fill="#9c9288">
            Hillcrest
          </text>
          <text x="840" y="128" fontSize="10" fill="#9c9288">
            Ridgeline
          </text>
          <text x="200" y="248" fontSize="10" fill="#9c9288">
            Bayside
          </text>
          <text x="380" y="248" fontSize="10" fill="#9c9288">
            Midtown
          </text>
          <text x="555" y="248" fontSize="10" fill="#9c9288">
            Southpark
          </text>
          <text x="700" y="248" fontSize="10" fill="#9c9288">
            Valleyview
          </text>
          <text x="840" y="248" fontSize="10" fill="#9c9288">
            Farpoint
          </text>
          <text x="25" y="210" fontSize="10" fill="#9aaabb" transform="rotate(-75,25,210)">
            COASTAL BAY
          </text>
        </svg>
        {dots.map((d, i) => (
          <span key={i} className="map-dot" style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, background: d.color }} />
        ))}
        <div className="tam-card">
          <strong>895</strong>
          <div className="section-eye" style={{ marginTop: 4 }}>
            Addressable accounts
          </div>
          <div className="tiny">161 active · 420 leads</div>
        </div>
        <div className="tam-legend">
          <div>
            <span style={{ background: "#2a72d5" }} />
            Active customer
          </div>
          <div>
            <span style={{ background: "#3baf9e" }} />
            Engaged / recent
          </div>
          <div>
            <span style={{ background: "#9eaab8" }} />
            Lead / prospect
          </div>
          <div>
            <span style={{ background: "#e8a020" }} />
            Lapsed
          </div>
        </div>
      </div>
      <div className="stat-grid">
        {[
          ["Total Market", "895", "Addressable accounts", false],
          ["Active Customers", "161", "18% account share", true],
          ["Warm Pipeline", "314", "Engaged + outreach", false],
          ["Whitespace", "420", "Unworked leads", false],
        ].map(([a, b, c, g]) => (
          <div className="stat" key={a as string}>
            <div className="section-eye">{a}</div>
            <div className={`stat-value ${g ? "green" : ""}`}>{b}</div>
            <div className="tiny">{c}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function Personas() {
  return (
    <>
      <div className="persona-primary">
        <PersonaCard
          blue={false}
          role="Executive Buyer"
          name="VP Commercial Strategy"
          seg="Tier 1 & 2 · Strategic enterprise and growth accounts"
          badge="T1 Accounts · Decision-Maker"
          rows={[
            ["Job to do", "Drive growth, margin, and market share"],
            ["Pain point", "Generic suppliers that do not speak to business outcomes"],
            ["Trigger", "Board pressure, competitor moves, expansion opportunity"],
            ["Message", "Business outcomes, ROI, strategic fit, payback"],
          ]}
        />
        <PersonaCard
          blue
          role="Functional Buyer"
          name="Head of Market Access"
          seg="Tier 2 & 3 · Access, evidence, and payer pressure"
          badge="T2 Accounts · Functional Buyer"
          rows={[
            ["Job to do", "Defend access and reduce payer friction"],
            ["Pain point", "Evidence gaps, slow insight cycles, weak storylines"],
            ["Trigger", "Formulary change, launch pressure, access barrier"],
            ["Message", "Evidence readiness, access support, faster decisions"],
          ]}
        />
      </div>
      <div className="section-eye">Additional Buyer Roles — Present Across All Tiers</div>
      <div className="persona-secondary">
        <SmallPersona
          strip="#f59e0b"
          role="Commercial Leader"
          name="Medical Affairs Lead"
          rows={[
            ["Job to do", "Keep evidence aligned to scientific and commercial needs"],
            ["Message", "Evidence readiness, publication planning, insight reuse"],
            ["Barrier", "Siloed research and unclear proof requirements"],
          ]}
        />
        <SmallPersona
          strip="#7c3aed"
          role="Analytics Leader"
          name="Commercial Analytics Director"
          rows={[
            ["Job to do", "Turn data into executive reporting and forecast guidance"],
            ["Message", "Dashboard adoption, faster cycle time, clearer signal response"],
            ["Barrier", "Fragmented metrics and slow synthesis"],
          ]}
        />
        <SmallPersona
          strip="#4a9e7a"
          role="Launch Leader"
          name="Launch Excellence Leader"
          rows={[
            ["Job to do", "Coordinate launch readiness across functions"],
            ["Message", "Signal monitoring, activation timing, workshop support"],
            ["Barrier", "Late alignment and unclear ownership"],
          ]}
        />
      </div>
    </>
  );
}

function AudienceArchitecture() {
  return (
    <>
      <Tiering />
      <Personas />
    </>
  );
}

function PersonaCard({
  blue,
  role,
  name,
  seg,
  badge,
  rows,
}: {
  blue?: boolean;
  role: string;
  name: string;
  seg: string;
  badge: string;
  rows: string[][];
}) {
  return (
    <div className="persona-card">
      <div className={`pc-photo ${blue ? "blue" : ""}`}>
        <div className="pc-head" />
        <div className="pc-lines" />
        <div className="pc-badge">{badge}</div>
      </div>
      <div className="pc-body">
        <div className="pc-role">{role}</div>
        <div className="pc-name">{name}</div>
        <div className="pc-seg">{seg}</div>
        {rows.map(([k, v]) => (
          <div className="pc-row" key={k}>
            <div className="pc-key">{k}</div>
            <div className="pc-val">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmallPersona({ strip, role, name, rows }: { strip: string; role: string; name: string; rows: string[][] }) {
  return (
    <div className="sm-card">
      <div className="strip" style={{ background: strip, opacity: 0.45 }} />
      <div className="sm-role">{role}</div>
      <div className="sm-name">{name}</div>
      {rows.map(([k, v]) => (
        <div className="pc-row" key={k}>
          <div className="pc-key">{k}</div>
          <div className="pc-val">{v}</div>
        </div>
      ))}
    </div>
  );
}

function Tiering() {
  const cards = [
    [
      "T1",
      "Strategic Enterprise",
      "$750K-$2M+",
      "Largest revenue contribution, broadest category footprint, deepest buying committee. These accounts define the ceiling and deserve the first executive view.",
      ["Drive margin and expansion", "Executive relationship management", "Strategic account plans", "Commercial reporting cadence", "Messaging led by outcomes and ROI"],
    ],
    [
      "T2",
      "Growth Pharma",
      "$250K-$750K",
      "Good fit, solid revenue base, underpenetrated category. The clearest path to revenue lift is indication expansion, portfolio growth, and cleaner prioritization.",
      ["Expand and develop", "Personalized cross-sell offers", "Signal-triggered outreach", "Lifecycle nurture sequences", "Messaging led by availability and value"],
    ],
    [
      "T3",
      "Emerging Biotech / Launch-Stage",
      "$100K-$250K",
      "Narrow category use or launch-stage urgency. The relationship exists but the full opportunity is unrealized. Education-first motions move these accounts into growth.",
      ["Launch and validate", "Re-engagement and win-back", "Category education", "Low-friction digital programs", "Messaging led by problem and need"],
    ],
  ] as const;

  return (
    <div className="tier-grid">
      {cards.map(([n, l, s, d, items]) => (
        <div className="tier-card" key={n}>
          <div className="tier-num">{n}</div>
          <div className="tier-label">{l}</div>
          <div className="tier-seg">{s}</div>
          <div className="tier-desc">{d}</div>
          <ul>
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Funnel() {
  const rows = [
    ["Reach", "2.4M", "Impressions"],
    ["Leads", "12,400", "Named accounts"],
    ["MQL", "3,840", "31% of leads"],
    ["SQL", "1,228", "32% conversion"],
    ["Opportunity", "614", "50% conversion"],
    ["Closed Won", "196", "31.9% win rate"],
    ["Revenue", "$84.2M", "TTM closed"],
  ];

  return (
    <>
      <div className="funnel-layout">
        <div>
          <div className="section-eye">Funnel Stage Breakdown</div>
          <div className="funnel-list">
            {rows.map(([a, b, c]) => (
              <div className="funnel-row" key={a}>
                <div>
                  <div className="section-eye" style={{ marginBottom: 1 }}>
                    {a}
                  </div>
                  <div className="funnel-num">{b}</div>
                </div>
                <div className="funnel-note">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="three-col">
        <div className="card">
          <div className="card-eye">Tier 1 Prospects</div>
          <div className="card-title">Enterprise accounts</div>
          <div className="card-body">Direct outreach, executive access, and account-based selling against the highest-value universe.</div>
          <span className="tag">Prioritize</span>
        </div>
        <div className="card">
          <div className="card-eye">High-Fit Accounts</div>
          <div className="card-title">Growth pharma</div>
          <div className="card-body">Signal-led nurture, account scoring, and targeted education for accounts with clear upside.</div>
          <span className="tag blue">Advance</span>
        </div>
        <div className="card">
          <div className="card-eye">Sales Accepted</div>
          <div className="card-title">Launch-stage opportunities</div>
          <div className="card-body">Warm accounts with a known trigger should move into workshops, proposal scoping, or executive review.</div>
          <span className="tag amber">Move forward</span>
        </div>
      </div>
    </>
  );
}

function Signals() {
  return (
    <div className="signals">
      {[
        [
          "Customer Signals",
          [
            ["🧪", "New Trial Launch", "First-brand or first-indication work is underway", "Act now", ["Monitor", "Interpret", "Activate"]],
            ["📈", "Indication Expansion", "A portfolio move opens a new segment", "Expand", ["Monitor", "Interpret", "Activate"]],
            ["🧭", "Market Access Pressure", "Formulary friction or payer pushback shows up", "Respond", ["Monitor", "Interpret", "Activate"]],
          ],
        ],
        [
          "Prospect Signals",
          [
            ["🔍", "Competitive Vendor Search", "Benchmarking or RFP activity suggests a review", "Engage", ["Monitor", "Interpret", "Activate"]],
            ["📩", "Dashboard Request", "Leadership wants clearer visibility into results", "Engage", ["Monitor", "Interpret", "Activate"]],
            ["🎤", "Workshop Attendance", "Attendance shows real buying intent", "Advance", ["Monitor", "Interpret", "Activate"]],
          ],
        ],
      ].map(([label, items]) => (
        <div key={label as string}>
          <div className="section-eye">{label}</div>
          {(items as any[]).map(([icon, title, sub, tag, steps]) => (
            <div className="signal-card" key={title}>
              <div className="signal-header">
                <div className="sig-icon">{icon}</div>
                <div>
                  <div className="sig-title">{title}</div>
                  <div className="sig-sub">{sub}</div>
                </div>
                <span className="tag">{tag}</span>
              </div>
              <div className="sig-body">{steps.map((s: string) => <span className="sig-step" key={s}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CommercialActivation() {
  return (
    <div className="campaign">
      <div className="campaign-head">Commercial Activation: Launch Readiness Intelligence</div>
      <div className="campaign-grid">
        {[
          ["LinkedIn thought leadership / account targeting", "$42K", "$220K pipeline", "$580K revenue"],
          ["Display retargeting", "$18K", "$140K pipeline", "$320K revenue"],
          ["Email nurture", "$12K", "$95K pipeline", "$210K revenue"],
          ["Executive workshop outreach / SDR-assisted account activation", "$30K", "$260K pipeline", "$640K revenue"],
        ].map(([a, b, c, d]) => (
          <div className="campaign-cell" key={a}>
            <div className="rg-layer">Channel</div>
            <div className="card-title">{a}</div>
            <div className="card-body">Investment: {b}</div>
            <div className="card-body">Pipeline: {c}</div>
            <div className="card-body">Revenue: {d}</div>
            <div className="card-body">ROI: {a === "Email nurture" ? "2.9×" : a === "Display retargeting" ? "3.6×" : a === "LinkedIn thought leadership / account targeting" ? "4.5×" : "5.2×"}</div>
          </div>
        ))}
      </div>
      <div className="campaign-perf">
        <span className="section-eye" style={{ marginBottom: 0 }}>
          Channel economics:
        </span>
        {["LinkedIn CAC payback 6.4 months", "Workshop-to-opportunity 28%", "Pipeline influenced $715K", "ROI weighted at 4.0×"].map((x) => (
          <span className="sig-step" key={x}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

function Sales() {
  const cols = [
    [
      "Priority Accounts",
      "Where to focus",
      ["Tier 1 enterprise and launch-stage accounts", "Executive sponsor mapped", "Pipeline coverage reviewed weekly", "Talk track: margin, growth, and risk"],
    ],
    [
      "Discovery Motion",
      "What to say first",
      ["Lead with the buying trigger", "Use signal context and segment fit", "Bring proof, not generic positioning", "Ask for the operating constraint"],
    ],
    [
      "Proposal Handoff",
      "How to advance",
      ["Translate discovery into a scoped workplan", "Tie deliverables to KPI lift", "Show the operating model and ROI", "Use clear next steps and timing"],
    ],
  ];

  return (
    <div className="sales-board">
      {cols.map(([title, sub, items]) => (
        <div className="sales-col" key={title as string}>
          <div className="sales-head">
            <div className="sales-title">{title}</div>
            <div className="sales-sub">{sub}</div>
          </div>
          <ul className="sales-list">
            {(items as string[]).map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Alignment() {
  return (
    <div className="align-grid">
      <div className="align-side">
        <div className="section-eye">Marketing Outputs</div>
        {["Segment-targeted activation", "Thought leadership", "Retargeting and nurture", "Signal-based outreach", "Workshop demand", "ROI measurement"].map((x) => (
          <div className="align-item" key={x}>
            {x}
          </div>
        ))}
      </div>
      <div className="align-center">
        <div className="section-eye" style={{ color: "rgba(255,255,255,.7)" }}>
          Commercial operating system
        </div>
        {["Market", "Signals", "Commercial Intelligence", "Marketing", "Sales", "Customer Success", "Revenue", "Executive Dashboard"].map((x) => (
          <strong key={x}>{x}</strong>
        ))}
      </div>
      <div className="align-side">
        <div className="section-eye">Sales Outputs</div>
        {["Account prioritization", "Stakeholder messaging", "Signal-based outreach", "Workshop conversion", "Proposal handoff", "Revenue expansion"].map((x) => (
          <div className="align-item" key={x}>
            {x}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReturnDashboard() {
  const data = [
    ["KPI Foundation", "Revenue Growth: 14.3%", "Growth, margin, and payback remain in view"],
    ["Segmentation + TAM", "Market Share: 18.0%", "161 active of 895 addressable accounts"],
    ["Audience Architecture", "Pipeline Coverage: 3.2×", "Tier 1 and Tier 2 spend is visible"],
    ["Prospect Funnel", "Qualified Pipeline: $27.8M", "614 active opportunities across the funnel"],
    ["Commercial Activation", "ROI: 4.0×", "$715K influenced across four channels"],
    ["Sales Motion", "Win Rate: 31.9%", "196 closed-won · improving with playbooks"],
    ["M+S Alignment", "Decision Adoption: 68%", "Shared intelligence is improving follow-through"],
    ["Full System", "Expansion Revenue: 22.0%", "Customers are expanding faster than churn"],
  ];

  return (
    <>
      <div className="return-grid">
        {data.map(([a, b, c]) => (
          <div className="rg-card" key={a}>
            <div className="rg-layer">{a}</div>
            <div className="card-title">{b}</div>
            <div className="tiny">{c}</div>
          </div>
        ))}
      </div>
      <div className="system-flow">
        {[
          ["Executive KPIs", ["Revenue growth", "Market share", "Gross margin", "CAC payback", "EBITDA contribution"]],
          ["Commercial Intelligence", ["Segmentation", "TAM + whitespace", "Audience architecture", "Signal monitoring"]],
          ["Activation Layer", ["Channel economics", "Commercial activation", "Pipeline creation", "Workshop demand", "ROI"]],
          ["Revenue Engine", ["Account prioritization", "Sales motion", "Customer success", "Expansion", "Closed-won revenue"]],
        ].map(([label, items]) => (
          <div className="sys-row" key={label as string}>
            <div className="sys-label">{label}</div>
            {(items as string[]).map((x) => (
              <div className="sys-item" key={x}>
                {x}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="final-box">
        <div className="final-box-title">The complete system</div>
        <p>This is how executive goals become market intelligence, market intelligence becomes commercial action, and commercial action becomes measurable growth, margin, and expansion.</p>
      </div>
    </>
  );
}

function StageContent({ current }: { current: number }) {
  if (current === 0) return <KpiDashboard />;
  if (current === 1) return <SegmentationCombined />;
  if (current === 2) return <Tam />;
  if (current === 3) return <AudienceArchitecture />;
  if (current === 4) return <Funnel />;
  if (current === 5) return <Signals />;
  if (current === 6) return <CommercialActivation />;
  if (current === 7) return <Sales />;
  if (current === 8) return <Alignment />;
  return <ReturnDashboard />;
}

export default function CommercialStrategyPage() {
  const [current, setCurrent] = useState(0);
  const stage = stages[current];
  const pct = ((current + 1) / stages.length) * 100;
  const goTo = (idx: number) => setCurrent(Math.max(0, Math.min(stages.length - 1, idx)));
  const nav = (dir: number) => (current === stages.length - 1 && dir > 0 ? setCurrent(0) : goTo(current + dir));

  return (
    <main className="commercial-page">
      <style>{styles}</style>
      <style>{mobileStyles}</style>
      <nav className="cs-nav">
        <a className="cs-logo" href="/">
          About <em>Chad</em>
        </a>
        <div className="cs-links">
          <a href="/">About</a>
          <a href="/approach">My Approach</a>
          <a href="/career">Career</a>
          <a href="/skills">Skills</a>
          <a className="active" href="/commercial-strategy">
            Work Samples
          </a>
          <a href="/contact">Contact</a>
        </div>
      </nav>
      <div className="cs-progress">
        <div className="cs-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="cs-shell">
        <aside className="cs-rail">
          {[
            { label: "FOUNDATION", indexes: [0, 1, 2, 3] },
            { label: "EXECUTION", indexes: [4, 5, 6] },
            { label: "MEASUREMENT & SYSTEM", indexes: [7, 8, 9] },
          ].map((group) => (
            <div key={group.label} style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "1.1px",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  margin: "0 0 8px",
                  padding: "0 10px",
                }}
              >
                {group.label}
              </div>
              {group.indexes.map((stageIndex, index) => {
                const s = stages[stageIndex];
                return (
                  <div key={s.nav}>
                    {index > 0 && <div className="rail-connector" />}
                    <button onClick={() => goTo(stageIndex)} className={`rail-item ${stageIndex === current ? "active" : ""} ${stageIndex < current ? "done" : ""}`}>
                      <span className="rail-dot" />
                      <span className="rail-label">{s.nav}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </aside>
        <section className="cs-stage-area">
          <div className="cs-stage">
            <MobileChapterNav current={current} onSelect={goTo} />
            <div className="stage-eyebrow">{stage.eyebrow}</div>
            <h1 className="stage-title">{stage.title}</h1>
            <p className="stage-body">{stage.body}</p>
            {stage.quote && <div className="stage-quote">&quot;{stage.quote}&quot;</div>}
            <StageContent current={current} />
          </div>
        </section>
      </div>
      <footer className="cs-footer">
        <div className="stage-counter">
          Chapter {current + 1} of {stages.length}
        </div>
        <div className="btns">
          <button className="cs-btn" onClick={() => nav(-1)} disabled={current === 0}>
            ← Back
          </button>
          <button className="cs-btn next" onClick={() => nav(1)}>
            {current === stages.length - 1 ? "↩ Start Over" : "Next →"}
          </button>
        </div>
      </footer>
    </main>
  );
}
