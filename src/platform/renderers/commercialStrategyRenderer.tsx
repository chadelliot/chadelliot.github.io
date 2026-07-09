import { useMemo, useState, type ReactNode } from "react";
import { CommercialStrategy, CommercialStrategySection } from "../models";

type SplitLine = { title: string; body?: string; foot?: string; extra?: string[] };

const styles = `
.commercial-page{--green:#4a9e7a;--green-pale:#edf6f1;--ink:#111;--body:#444;--muted:#888;--rule:#e8e8e8;--surface:#f7f7f7;height:100vh;overflow:hidden;background:#fff;color:var(--ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.commercial-page *{box-sizing:border-box}.cs-nav{position:fixed;top:0;left:0;right:0;height:56px;background:#fff;border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:50}.cs-logo{font-size:17px;font-weight:800;color:var(--ink);letter-spacing:-.3px;text-decoration:none}.cs-logo em{font-style:italic;color:var(--green)}.cs-links{display:flex;gap:28px;align-items:center}.cs-links a{font-size:10px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;text-decoration:none;color:var(--muted)}.cs-links a.active{color:var(--green)}.cs-progress{position:fixed;top:56px;left:220px;right:0;height:2px;background:var(--rule);z-index:45}.cs-progress-fill{height:100%;background:var(--green);transition:width .25s ease}.cs-shell{display:flex;height:100vh;padding-top:56px}.cs-rail{width:220px;flex-shrink:0;border-right:1px solid var(--rule);padding:20px 16px 28px;overflow-y:auto;background:#fff}.rail-group{margin-bottom:18px}.rail-group-title{font-size:10px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:var(--muted);margin:0 0 8px;padding:0 10px}.rail-item{width:100%;display:flex;align-items:flex-start;gap:10px;padding:8px 10px;border:0;border-radius:4px;background:transparent;cursor:pointer;text-align:left}.rail-item:hover{background:var(--surface)}.rail-item.active{background:var(--green-pale)}.rail-dot{width:8px;height:8px;border-radius:999px;border:2px solid var(--rule);background:#fff;flex-shrink:0;margin-top:4px}.rail-item.done .rail-dot{background:var(--green);border-color:var(--green);opacity:.42}.rail-item.active .rail-dot{background:var(--green);border-color:var(--green);opacity:1}.rail-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--muted);line-height:1.35}.rail-item.active .rail-label{color:var(--green)}.rail-connector{width:1px;height:10px;background:var(--rule);margin-left:23px}.cs-stage-area{flex:1;overflow-y:auto;padding:40px 48px 116px;background:#fff}.cs-stage{max-width:none;margin:0}.stage-eyebrow{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:var(--green);margin-bottom:12px}.stage-title{font-size:32px;font-weight:800;line-height:1.1;letter-spacing:-.5px;margin:0 0 8px;color:var(--ink);max-width:900px}.stage-title em{font-style:italic;color:var(--green)}.stage-body{font-size:14px;line-height:1.55;color:var(--body);max-width:760px;margin:0 0 24px}.stage-quote{font-size:13px;font-style:italic;color:var(--muted);border-left:3px solid var(--green);padding-left:16px;margin:0 0 22px;line-height:1.5;max-width:760px}.cs-footer{position:fixed;bottom:0;right:0;width:calc(100% - 220px);background:#fff;border-top:1px solid var(--rule);padding:16px 48px;display:flex;align-items:center;justify-content:space-between;z-index:45}.stage-counter{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--muted)}.btns{display:flex;gap:10px}.cs-btn{padding:9px 22px;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;border-radius:3px;border:1px solid var(--rule);background:#fff;color:var(--muted);cursor:pointer}.cs-btn:disabled{opacity:.3}.cs-btn.next{background:var(--green);border-color:var(--green);color:#fff}.section-eye,.card-eye,.kd-eye{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:8px}.kpi-dash,.stat-grid,.return-grid{display:grid;gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:24px}.kd-card,.stat,.rg-card{background:#fff;padding:16px 18px}.kd-val,.stat-value{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;margin-bottom:4px}.kd-delta,.tiny{font-size:10px;color:var(--muted)}.pos,.stat-value.green,.rg-layer{color:var(--green)}.warn{color:#b45309}.flat{color:var(--muted)}.two-col{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-bottom:20px}.three-col{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:24px}.insight-card,.card,.persona-card,.sm-card,.campaign,.signal-card{background:#fff;border:1px solid var(--rule);border-radius:4px}.insight-card{padding:18px 20px}.insight-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.insight-list li{font-size:12px;font-weight:700;line-height:1.35;display:flex;gap:9px}.insight-list li:before{content:"";width:6px;height:6px;border-radius:999px;background:var(--green);margin-top:6px;flex-shrink:0}.insight-list.blue li:before{background:#2d6bcd}.card{padding:20px}.card-title{font-size:14px;font-weight:800;margin-bottom:6px;color:var(--ink)}.card-body{font-size:12px;color:var(--body);line-height:1.55}.track{height:2px;background:var(--rule);border-radius:1px;margin:10px 0 4px}.track div{height:100%;background:var(--green)}.tag{display:inline-block;margin-top:10px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;padding:3px 8px;border-radius:2px;background:var(--green-pale);color:#2e7d52}.tag.blue{background:#eef3fc;color:#2d6bcd}.tag.amber{background:#fef3c7;color:#b45309}.hint{font-size:11px;color:var(--muted)}.tam-shell{border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:20px;position:relative;min-height:260px;background:#fff}.tam-cardset{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:20px}.tam-item{background:#fff;padding:16px 18px;min-height:116px}.tam-item strong{display:block;font-size:18px;line-height:1.2;margin-bottom:8px;color:var(--green)}.tam-item .section-eye{margin-bottom:6px}.tam-item .tiny{font-size:11px;line-height:1.5}.tam-legend{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tam-legend div{font-size:10px;color:var(--body);display:flex;align-items:center;gap:6px;padding:8px 10px;background:#fff;border:1px solid var(--rule);border-radius:3px}.tam-legend span{width:8px;height:8px;border-radius:999px}.audience-step{display:grid;grid-template-columns:auto minmax(80px,1fr);gap:12px;align-items:center;margin:6px 0 12px}.audience-step span{font-size:9px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:var(--muted)}.audience-step i{height:1px;background:var(--rule)}.tier-grid,.sales-board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden}.tier-card,.sales-col{background:#fff;padding:20px}.tier-num{font-size:28px;font-weight:800;color:var(--green)}.tier-label{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--muted)}.tier-seg{font-size:12px;font-weight:800;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--rule)}.tier-desc{font-size:11px;color:var(--body);line-height:1.55}.tier-card ul,.sales-list{list-style:none;margin:10px 0 0;padding:0}.tier-card li,.sales-list li{font-size:11px;color:var(--muted);padding:4px 0 4px 12px;position:relative}.tier-card li:before,.sales-list li:before{content:'›';position:absolute;left:0;color:var(--green);font-weight:800}.audience-explainer{font-size:12px;line-height:1.6;color:var(--body);max-width:760px;margin:18px 0}.persona-primary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-bottom:14px}.persona-card{overflow:hidden}.pc-photo{height:130px;background:linear-gradient(135deg,#e0ebe4,#c8dbd0);position:relative;display:flex;align-items:center;padding-left:90px}.pc-photo.blue{background:linear-gradient(135deg,#e4eaf0,#ccd6e0)}.pc-head{width:70px;height:70px;border-radius:999px;background:rgba(74,158,122,.6);position:absolute;left:90px;top:18px}.pc-lines{width:260px;height:56px;margin-left:95px;border-radius:3px;background:rgba(255,255,255,.38);position:relative}.pc-badge{position:absolute;bottom:10px;left:12px;background:var(--green);color:#fff;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;padding:3px 8px;border-radius:2px}.pc-body{padding:14px 16px 16px}.pc-role,.sm-role{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--green)}.pc-name{font-size:16px;font-weight:800}.pc-seg{font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px;padding-bottom:9px;border-bottom:1px solid var(--rule)}.pc-row{display:flex;gap:8px;margin:6px 0}.pc-key{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);min-width:52px}.pc-val{font-size:11px;color:var(--body);line-height:1.4}.persona-secondary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.sm-card{padding:14px 15px}.strip{height:4px;border-radius:2px;margin-bottom:10px}.sm-name{font-size:12px;font-weight:800;margin-bottom:6px}.funnel-layout{display:block;margin-bottom:20px}.funnel-list{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden}.funnel-row{min-height:74px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:#fff;padding:10px 8px;text-align:center}.funnel-row:last-child{background:var(--green-pale)}.funnel-num{font-size:19px;line-height:1;font-weight:800}.funnel-note{font-size:10px;color:var(--muted);font-weight:600}.funnel-row:nth-child(n+3) .funnel-note,.funnel-row:last-child .section-eye{color:var(--green);font-weight:800}.signals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.signal-card{overflow:hidden;margin-bottom:16px}.signal-header{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--rule)}.sig-icon{width:32px;height:32px;border-radius:999px;background:var(--green-pale);display:flex;align-items:center;justify-content:center}.sig-title{font-size:13px;font-weight:800}.sig-sub{font-size:11px;color:var(--muted)}.sig-body{background:var(--surface);padding:14px 18px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sig-step{font-size:10px;font-weight:700;color:var(--body);padding:4px 10px;background:#fff;border:1px solid var(--rule);border-radius:2px}.campaign{overflow:hidden}.campaign-head{background:#111;color:#fff;padding:12px 20px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.8px}.campaign-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--rule)}.campaign-cell{background:#fff;padding:16px}.campaign-perf{background:var(--surface);padding:12px 20px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sales-col{padding:0}.sales-head{padding:12px 16px;border-bottom:1px solid var(--rule);background:var(--surface)}.sales-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px}.sales-sub{font-size:10px;color:var(--muted)}.sales-list{padding:12px 16px}.align-grid{display:grid;grid-template-columns:1fr 180px 1fr;border:1px solid var(--rule);border-radius:4px;overflow:hidden}.align-side{background:#fff;padding:22px}.align-center{background:var(--green);padding:22px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;text-align:center}.align-item{font-size:11px;color:var(--body);padding:5px 0;border-bottom:1px solid var(--surface)}.system-flow{display:flex;flex-direction:column;gap:2px}.sys-row{display:flex;align-items:center;border:1px solid var(--rule);border-radius:3px;overflow:hidden}.sys-label{background:#111;color:#fff;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;padding:8px 14px;min-width:160px}.sys-item{font-size:10px;color:var(--body);padding:8px 14px;border-left:1px solid var(--rule)}.final-box{padding:20px;background:var(--green-pale);border:1px solid var(--green);border-radius:4px;margin-top:20px}.final-box-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--green);margin-bottom:8px}.final-box p{font-size:14px;line-height:1.65;font-weight:600;margin:0}@media(max-width:1000px){.cs-links,.cs-rail{display:none}.cs-progress{left:0}.cs-footer{width:100%;padding:14px 20px}.cs-stage-area{padding:32px 20px 110px}.two-col,.three-col,.persona-primary,.persona-secondary,.signals,.campaign-grid,.sales-board,.align-grid,.return-grid,.tier-grid,.stat-grid,.tam-cardset,.tam-legend{grid-template-columns:1fr}.funnel-list{grid-template-columns:repeat(2,1fr)}}
`;

const fallbackNavigation = [
  {
    group: "FOUNDATION",
    sections: [
      { key: "kpiFoundation", label: "01. KPI Foundation" },
      { key: "segmentation", label: "02. Segmentation" },
      { key: "totalAddressableMarket", label: "03. Total Addressable Market" },
      { key: "audienceArchitecture", label: "04. Audience Architecture" },
    ],
  },
      {
        group: "EXECUTION",
        sections: [
          { key: "prospectFunnel", label: "05. Prospect Funnel" },
          { key: "signalIntelligence", label: "06. Signal Intelligence" },
          { key: "commercialActivation", label: "07. Commercial Activation" },
        ],
      },
  {
    group: "MEASUREMENT & SYSTEM",
    sections: [
      { key: "salesMotion", label: "08. Sales Motion" },
      { key: "marketingSalesAlignment", label: "09. M+S Alignment" },
      { key: "returnToDashboard", label: "10. Return to Dashboard" },
    ],
  },
] as const;

const sectionTitles: Record<CommercialStrategySection["key"], string> = {
  kpiFoundation: "KPI Foundation",
  segmentation: "Segmentation",
  totalAddressableMarket: "Total Addressable Market",
  audienceArchitecture: "Audience Architecture",
  prospectFunnel: "Prospect Funnel",
  signalIntelligence: "Signal Intelligence",
  commercialActivation: "Commercial Activation",
  salesMotion: "Sales Motion",
  marketingSalesAlignment: "M+S Alignment",
  returnToDashboard: "Return to Dashboard",
};

const sectionEyebrows: Record<CommercialStrategySection["key"], string> = {
  kpiFoundation: "Chapter 01 — The Scoreboard",
  segmentation: "Chapter 02 — Segmentation",
  totalAddressableMarket: "Chapter 03 — Total Addressable Market",
  audienceArchitecture: "Chapter 04 — Audience Architecture",
  prospectFunnel: "Chapter 05 — Prospect Funnel",
  signalIntelligence: "Chapter 06 — Signal Intelligence",
  commercialActivation: "Chapter 07 — Commercial Activation",
  salesMotion: "Chapter 08 — Sales Motion",
  marketingSalesAlignment: "Chapter 09 — Marketing + Sales Alignment",
  returnToDashboard: "Chapter 10 — Performance Layer",
};

const sectionTitlesEmphasis: Record<CommercialStrategySection["key"], ReactNode> = {
  kpiFoundation: (
    <>
      Set the <em>business scoreboard.</em>
    </>
  ),
  segmentation: (
    <>
      Separate the market. <em>Find the growth.</em>
    </>
  ),
  totalAddressableMarket: (
    <>
      Size the <em>addressable opportunity.</em>
    </>
  ),
  audienceArchitecture: (
    <>
      Who makes the decision. <em>And what they need.</em>
    </>
  ),
  prospectFunnel: (
    <>
      Where do we win or <em>lose opportunity?</em>
    </>
  ),
  signalIntelligence: (
    <>
      React to the right signal <em>at the right time.</em>
    </>
  ),
  commercialActivation: (
    <>
      Where should we invest and <em>what return do we expect?</em>
    </>
  ),
  salesMotion: (
    <>
      How do we convert opportunity <em>into revenue?</em>
    </>
  ),
  marketingSalesAlignment: (
    <>
      How do teams operate as <em>one system?</em>
    </>
  ),
  returnToDashboard: (
    <>
      Did we create <em>enterprise value?</em>
    </>
  ),
};

const lastThree = <T,>(values: T[]): T[] => values.slice(-3);

function splitLine(value: string): SplitLine {
  const parts = value.split("|").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return { title: value };
  if (parts.length === 1) return { title: parts[0] };
  return { title: parts[0], body: parts[1], foot: parts[2], extra: parts.slice(3) };
}

function fixedStageLabel(sectionKey: CommercialStrategySection["key"]) {
  switch (sectionKey) {
    case "kpiFoundation":
      return "Scoreboard";
    case "segmentation":
      return "Audience";
    case "totalAddressableMarket":
      return "Opportunity";
    case "audienceArchitecture":
      return "Tiering";
    case "prospectFunnel":
      return "Pipeline";
    case "signalIntelligence":
      return "Signals";
    case "commercialActivation":
      return "Commercial Activation";
    case "salesMotion":
      return "Motion";
    case "marketingSalesAlignment":
      return "Swimlanes";
    case "returnToDashboard":
      return "Dashboard";
  }
}

function renderSection(section: CommercialStrategySection) {
  switch (section.key) {
    case "kpiFoundation":
      return (
        <>
          <div
            className="kpi-dash"
            style={{ gridTemplateColumns: `repeat(${Math.min(3, Math.max(1, section.content.length))}, minmax(0, 1fr))` }}
          >
            {section.content.map((item, index) => {
              const parsed = splitLine(item);
              const metric = section.metrics?.[index] ?? parsed.body ?? parsed.title;
              return (
                <div className="kd-card" key={item}>
                  <div className="kd-eye">{parsed.title}</div>
                  <div className="kd-val">{metric}</div>
                  <div className="kd-delta pos">{parsed.foot ?? section.notes?.[index] ?? section.summary}</div>
                </div>
              );
            })}
          </div>
          <div className="insight-card">
            <div className="section-eye">KPI context</div>
            <ul className="insight-list">
              {section.content.map((item) => (
                <li key={item}>{splitLine(item).title}</li>
              ))}
            </ul>
            {section.notes?.length ? (
              <p className="hint" style={{ marginTop: 14 }}>
                {section.notes.join(" ")}
              </p>
            ) : null}
          </div>
        </>
      );

    case "segmentation":
      return (
        <>
          <div className="two-col">
            <div className="insight-card">
              <div className="section-eye">Customer moves</div>
              <ul className="insight-list">
                {section.content.slice(0, 3).map((item) => (
                  <li key={item}>{splitLine(item).title}</li>
                ))}
              </ul>
            </div>
            <div className="insight-card">
              <div className="section-eye">What they need</div>
              <ul className="insight-list blue">
                {lastThree(section.content).map((item) => (
                  <li key={item}>{splitLine(item).body ?? splitLine(item).title}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="three-col" style={{ gridTemplateColumns: `repeat(3, minmax(0, 1fr))` }}>
            {section.content.map((item, index) => {
              const parsed = splitLine(item);
              return (
              <div className="card" key={item}>
                <div className="card-eye">Segment {index + 1}</div>
                <div className="card-title">{parsed.title}</div>
                <div className="card-body">{parsed.body ?? section.summary}</div>
                <span className={`tag ${index % 3 === 1 ? "blue" : index % 3 === 2 ? "amber" : ""}`}>
                  {parsed.foot ?? `Priority ${index + 1}`}
                </span>
              </div>
            )})}
          </div>
        </>
      );

    case "totalAddressableMarket":
      return (
        <>
          <div className="tam-cardset">
            {section.content.map((item) => {
              const parsed = splitLine(item);
              return (
                <div className="tam-item" key={item}>
                  <div className="section-eye">{parsed.title}</div>
                  <strong>{parsed.body ?? section.summary}</strong>
                  <div className="tiny">{parsed.foot ?? section.summary}</div>
                </div>
              );
            })}
          </div>
          <div className="tam-legend">
            {(section.notes?.length ? section.notes : [section.summary]).slice(0, 4).map((item) => (
              <div key={item}>
                <span style={{ background: "#4a9e7a" }} />
                {item}
              </div>
            ))}
          </div>
        </>
      );

    case "audienceArchitecture":
      return (
        <>
          <div className="audience-step">
            <span>Step 1 — Audience framing</span>
            <i />
          </div>
          <div className="tier-grid">
            {section.content.slice(0, 3).map((item, index) => (
              <div className="tier-card" key={item}>
                <div className="tier-num">0{index + 1}</div>
                <div className="tier-label">Audience layer</div>
                <div className="tier-seg">{splitLine(item).title}</div>
                <div className="tier-desc">{splitLine(item).body ?? section.summary}</div>
              </div>
            ))}
          </div>
          <div className="audience-step" style={{ marginTop: 22 }}>
            <i />
            <span>Step 2 — Persona needs</span>
            <i />
          </div>
          <div className="persona-secondary" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {section.content.slice(3).map((item) => (
              <div className="sm-card" key={item}>
                <div className="strip" style={{ background: "#4a9e7a", opacity: 0.45 }} />
                <div className="sm-role">Persona need</div>
                <div className="sm-name">{splitLine(item).title}</div>
                <div className="pc-row">
                  <div className="pc-key">Why</div>
                  <div className="pc-val">{splitLine(item).body ?? section.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      );

    case "prospectFunnel":
      return (
        <>
          <div className="funnel-layout">
            <div className="section-eye">Funnel stage breakdown</div>
            <div className="funnel-list">
              {section.content.map((item, index) => {
                const parsed = splitLine(item);
                const stageLabels = ["Reach", "Leads", "MQL", "SQL", "Opportunity", "Closed Won", "Revenue"];
                return (
                  <div className="funnel-row" key={item}>
                    <div>
                      <div className="section-eye" style={{ marginBottom: 1 }}>
                        {stageLabels[index] ?? `Stage ${index + 1}`}
                      </div>
                      <div className="funnel-num">{parsed.body ?? parsed.title}</div>
                    </div>
                    <div className="funnel-note">{parsed.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="three-col">
            {section.content.slice(0, 3).map((item, index) => (
              <div className="card" key={item}>
                <div className="card-eye">Motion {index + 1}</div>
                <div className="card-title">{splitLine(item).title}</div>
                <div className="card-body">{splitLine(item).body ?? section.summary}</div>
                <span className={`tag ${index === 0 ? "" : index === 1 ? "blue" : "amber"}`}>Funnel motion</span>
              </div>
            ))}
          </div>
        </>
      );

    case "signalIntelligence":
      return (
        <div className="signals">
          <div>
            <div className="section-eye">Customer Signals</div>
            {section.content.slice(0, 3).map((item, index) => {
              const parsed = splitLine(item);
              return (
                <div className="signal-card" key={item}>
                  <div className="signal-header">
                    <div className="sig-icon">{index + 1}</div>
                    <div>
                      <div className="sig-title">{parsed.title}</div>
                      <div className="sig-sub">{parsed.body ?? section.summary}</div>
                    </div>
                    <span className="tag">Customer</span>
                  </div>
                  <div className="sig-body">
                    <span className="sig-step">{parsed.foot?.split(";")[0] ?? "Monitor"}</span>
                    <span className="sig-step">{parsed.foot?.split(";")[1] ?? "Interpret"}</span>
                    <span className="sig-step">{parsed.foot?.split(";")[2] ?? "Activate"}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <div className="section-eye">Prospect Signals</div>
            {section.content.slice(3).map((item, index) => {
              const parsed = splitLine(item);
              return (
                <div className="signal-card" key={item}>
                  <div className="signal-header">
                    <div className="sig-icon">{index + 4}</div>
                    <div>
                      <div className="sig-title">{parsed.title}</div>
                      <div className="sig-sub">{parsed.body ?? section.summary}</div>
                    </div>
                    <span className="tag blue">Prospect</span>
                  </div>
                  <div className="sig-body">
                    <span className="sig-step">{parsed.foot?.split(";")[0] ?? "Monitor"}</span>
                    <span className="sig-step">{parsed.foot?.split(";")[1] ?? "Interpret"}</span>
                    <span className="sig-step">{parsed.foot?.split(";")[2] ?? "Activate"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "commercialActivation":
      return (
        <div className="campaign">
          <div className="campaign-head">{section.title}</div>
          <div className="campaign-perf">
            <span className="section-eye" style={{ marginBottom: 0 }}>
              {section.summary}
            </span>
          </div>
          <div className="campaign-grid">
            {section.content.map((item) => {
              const parsed = splitLine(item);
              return (
                <div className="campaign-cell" key={item}>
                  <div className="rg-layer">Channel</div>
                  <div className="card-title">{parsed.title}</div>
                  <div className="card-body">{parsed.body ?? section.summary}</div>
                  {parsed.foot ? <div className="card-body">{parsed.foot}</div> : null}
                  {parsed.extra?.map((line) => (
                    <div className="tiny" key={line}>
                      {line}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      );

    case "salesMotion":
      return (
        <div className="sales-board">
          {section.content.slice(0, 3).map((item, index) => {
            const parsed = splitLine(item);
            return (
              <div className="sales-col" key={item}>
                <div className="sales-head">
                  <div className="sales-title">{parsed.title}</div>
                  <div className="sales-sub">{section.summary}</div>
                </div>
                <ul className="sales-list">
                  <li>{parsed.body ?? "Prioritize the accounts most likely to move now."}</li>
                  <li>{section.notes?.[0] ?? "Use intelligence to shape the opening conversation."}</li>
                  <li>{section.notes?.[1] ?? "Define the handoff to proposal or workshop."}</li>
                </ul>
              </div>
            );
          })}
        </div>
      );

    case "marketingSalesAlignment":
      return (
        <div className="align-grid">
          <div className="align-side">
            <div className="section-eye">Marketing Outputs</div>
            {section.content.slice(0, 3).map((item) => (
              <div className="align-item" key={item}>
                {splitLine(item).title}
              </div>
            ))}
          </div>
          <div className="align-center">
            <div className="section-eye" style={{ color: "rgba(255,255,255,.7)" }}>
              Shared Intelligence Layer
            </div>
            {(section.metrics?.length ? section.metrics : [section.summary]).map((item) => (
              <strong key={item}>{item}</strong>
            ))}
          </div>
          <div className="align-side">
            <div className="section-eye">Sales Outputs</div>
            {section.content.slice(3, 6).map((item) => (
              <div className="align-item" key={item}>
                {splitLine(item).title}
              </div>
            ))}
          </div>
        </div>
      );

    case "returnToDashboard":
      return (
        <>
          <div
            className="return-grid"
            style={{ gridTemplateColumns: `repeat(${Math.min(4, Math.max(1, section.content.length))}, minmax(0, 1fr))` }}
          >
            {section.content.map((item, index) => (
              <div className="rg-card" key={item}>
                <div className="rg-layer">0{index + 1}</div>
                <div className="card-title">{splitLine(item).title}</div>
                <div className="tiny">{splitLine(item).body ?? section.summary}</div>
              </div>
            ))}
          </div>
          <div className="system-flow">
            {section.notes?.map((note, index) => (
              <div className="sys-row" key={note}>
                <div className="sys-label">Note {index + 1}</div>
                <div className="sys-item">{note}</div>
              </div>
            ))}
          </div>
          <div className="final-box">
            <div className="final-box-title">Return to dashboard</div>
            <p>{section.summary}</p>
          </div>
        </>
      );
  }
}

export function CommercialStrategyRenderer({ strategy }: { strategy: CommercialStrategy }) {
  const [current, setCurrent] = useState(0);
  const stages = useMemo(
    () => [
      strategy.sections.kpiFoundation,
      strategy.sections.segmentation,
      strategy.sections.totalAddressableMarket,
      strategy.sections.audienceArchitecture,
      strategy.sections.prospectFunnel,
      strategy.sections.signalIntelligence,
      strategy.sections.commercialActivation,
      strategy.sections.salesMotion,
      strategy.sections.marketingSalesAlignment,
      strategy.sections.returnToDashboard,
    ],
    [strategy],
  );
  const navigation = strategy.navigation.length ? strategy.navigation : [...fallbackNavigation];

  const stage = stages[current];
  const pct = ((current + 1) / stages.length) * 100;
  const goTo = (idx: number) => setCurrent(Math.max(0, Math.min(stages.length - 1, idx)));
  const nav = (dir: number) => (current === stages.length - 1 && dir > 0 ? setCurrent(0) : goTo(current + dir));

  return (
    <main className="commercial-page">
      <style>{styles}</style>
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
          {navigation.map((group) => (
            <div className="rail-group" key={group.group}>
              <div className="rail-group-title">{group.group}</div>
              {group.sections.map((navSection, index) => {
                const stageIndex = stages.findIndex((item) => item.key === navSection.key);
                const isCurrent = stageIndex === current;
                const done = stageIndex < current;
                return (
                  <div key={navSection.key}>
                    {index > 0 && <div className="rail-connector" />}
                    <button
                      onClick={() => goTo(stageIndex)}
                      className={`rail-item ${isCurrent ? "active" : ""} ${done ? "done" : ""}`}
                    >
                      <span className="rail-dot" />
                      <span className="rail-label">{navSection.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </aside>
        <section className="cs-stage-area">
          <div className="cs-stage">
            <div className="stage-eyebrow">{sectionEyebrows[stage.key]}</div>
            <h1 className="stage-title">{sectionTitlesEmphasis[stage.key]}</h1>
            <p className="stage-body">{stage.summary}</p>
            <div className="stage-quote">&quot;{stage.purpose}&quot;</div>
            {renderSection(stage)}
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
