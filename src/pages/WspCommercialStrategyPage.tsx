import { useState } from "react";

const stages = [
  {
    nav: "Growth Thesis",
    eyebrow: "WSP Commercial Strategy",
    title: <>Growth starts <em>before the RFP.</em></>,
    body: "For WSP, the commercial opportunity is not simply producing stronger proposals. It is building a pursuit-led growth system that connects market intelligence, client priorities, funding signals, capture planning, proposal excellence, and executive reporting across Transportation and Advisory markets.",
    quote: "The win is rarely created at proposal time. It is shaped earlier through market selection, client strategy, relationship mapping, and disciplined pursuit investment."
  },
  {
    nav: "Market Intelligence",
    eyebrow: "Layer 01 — Market Intelligence",
    title: <>See the market <em>before it becomes a pursuit.</em></>,
    body: "A strategic growth team needs visibility into where public investment, client priorities, competitive movement, and WSP's right-to-win overlap. This layer organizes the market so leaders can decide where to compete, where to nurture, and where to step back.",
    quote: "The goal is not to chase every opportunity. The goal is to identify the few that deserve disproportionate pursuit energy."
  },
  {
    nav: "Client Architecture",
    eyebrow: "Layer 02 — Client + Stakeholder Architecture",
    title: <>Know who decides. <em>And what they value.</em></>,
    body: "Infrastructure growth depends on many stakeholders: agency executives, program leaders, procurement teams, technical evaluators, community voices, and funding authorities. The strategy must translate technical capability into value that each stakeholder can recognize.",
    quote: "Client strategy is not one message. It is a layered story that changes based on the person, the pressure, and the decision they influence."
  },
  {
    nav: "Go / No-Go",
    eyebrow: "Layer 03 — Pursuit Prioritization",
    title: <>Turn opportunity volume into <em>pursuit discipline.</em></>,
    body: "The Go/No-Go process should operate as a commercial decision system. It should weigh relationship strength, technical fit, funding readiness, competitive position, strategic value, pursuit capacity, and revenue potential before the team commits resources.",
    quote: "The fastest way to improve win rate is to stop investing the same level of effort into every pursuit."
  },
  {
    nav: "Win Strategy",
    eyebrow: "Layer 04 — Win Theme Development",
    title: <>Convert technical depth into <em>client-centered value.</em></>,
    body: "WSP's technical strength only becomes commercially useful when it is framed against the client's pressure: delivery risk, funding deadlines, modernization, resilience, public trust, safety, budget stewardship, and community impact.",
    quote: "A strong win theme is not a slogan. It is the clearest connection between the client's pressure and WSP's advantage."
  },
  {
    nav: "Proposal Command",
    eyebrow: "Layer 05 — Proposal + Interview Command Center",
    title: <>Make the pursuit experience <em>feel coordinated.</em></>,
    body: "From capture plan to shortlist interview, the team needs one operating rhythm: compliance, storyline, technical proof, visual strategy, review cycles, presenter coaching, Q&A readiness, and post-pursuit learning.",
    quote: "Proposal excellence is not document production. It is the visible output of a disciplined growth process."
  },
  {
    nav: "KPI Layer",
    eyebrow: "Layer 06 — Executive KPI Visibility",
    title: <>Measure what improves <em>future wins.</em></>,
    body: "A closed-loop pursuit system turns every opportunity into intelligence. Wins, losses, shortlist rates, debriefs, competitor themes, and content gaps should feed back into market strategy and executive decision-making.",
    quote: "The dashboard should not just report activity. It should explain which markets, clients, messages, and pursuit motions are creating commercial advantage."
  },
  {
    nav: "Operating System",
    eyebrow: "The Full Growth System",
    title: <>One system for <em>pursuit-led growth.</em></>,
    body: "The full strategy connects WSP's market ambition to a repeatable operating model: market signals, client priorities, opportunity scoring, pursuit strategy, win themes, proposal and interview execution, then debrief intelligence back into the system.",
    quote: "This is the shift from marketing support to strategic growth leadership."
  }
];

const styles = `
.wsp-page{--green:#4a9e7a;--green-pale:#edf6f1;--ink:#111;--body:#444;--muted:#858585;--rule:#e7e7e7;--surface:#f7f7f7;--blue:#2d6bcd;--amber:#b45309;height:100vh;overflow:hidden;background:#fff;color:var(--ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wsp-page *{box-sizing:border-box}.wsp-nav{position:fixed;top:0;left:0;right:0;height:56px;background:#fff;border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:50}.wsp-logo{font-size:17px;font-weight:800;color:var(--ink);letter-spacing:-.3px;text-decoration:none}.wsp-logo em{font-style:italic;color:var(--green)}.wsp-links{display:flex;gap:28px;align-items:center}.wsp-links a{font-size:10px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;text-decoration:none;color:var(--muted)}.wsp-links a.active{color:var(--green)}.wsp-progress{position:fixed;top:56px;left:220px;right:0;height:2px;background:var(--rule);z-index:45}.wsp-progress-fill{height:100%;background:var(--green);transition:width .25s ease}.wsp-shell{display:flex;height:100vh;padding-top:56px}.wsp-rail{width:220px;flex-shrink:0;border-right:1px solid var(--rule);padding:28px 20px;overflow-y:auto;background:#fff}.rail-item{width:100%;display:flex;align-items:flex-start;gap:10px;padding:8px 10px;border:0;border-radius:4px;background:transparent;cursor:pointer;text-align:left}.rail-item:hover{background:var(--surface)}.rail-item.active{background:var(--green-pale)}.rail-dot{width:8px;height:8px;border-radius:999px;border:2px solid var(--rule);background:#fff;flex-shrink:0;margin-top:4px}.rail-item.done .rail-dot{background:var(--green);border-color:var(--green);opacity:.42}.rail-item.active .rail-dot{background:var(--green);border-color:var(--green);opacity:1}.rail-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--muted);line-height:1.35}.rail-item.active .rail-label{color:var(--green)}.rail-connector{width:1px;height:10px;background:var(--rule);margin-left:23px}.wsp-stage-area{flex:1;overflow-y:auto;padding:40px 48px 116px;background:#fff}.wsp-stage{max-width:none;margin:0}.stage-eyebrow{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:var(--green);margin-bottom:12px}.stage-title{font-size:32px;font-weight:800;line-height:1.1;letter-spacing:-.5px;margin:0 0 8px;color:var(--ink);max-width:950px}.stage-title em{font-style:italic;color:var(--green)}.stage-body{font-size:14px;line-height:1.7;color:var(--body);max-width:850px;margin:0 0 28px}.stage-quote{font-size:13px;font-style:italic;color:var(--muted);border-left:3px solid var(--green);padding-left:16px;margin:0 0 28px;line-height:1.65;max-width:850px}.wsp-footer{position:fixed;bottom:0;right:0;width:calc(100% - 220px);background:#fff;border-top:1px solid var(--rule);padding:16px 48px;display:flex;align-items:center;justify-content:space-between;z-index:45}.stage-counter{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--muted)}.btns{display:flex;gap:10px}.wsp-btn{padding:9px 22px;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;border-radius:3px;border:1px solid var(--rule);background:#fff;color:var(--muted);cursor:pointer}.wsp-btn:disabled{opacity:.3}.wsp-btn.next{background:var(--green);border-color:var(--green);color:#fff}.section-eye,.card-eye,.kd-eye{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:8px}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px}.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:22px}.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:22px}.card,.metric,.panel,.flow-card{background:#fff;border:1px solid var(--rule);border-radius:4px;padding:18px 20px}.metric{border:0;border-radius:0}.card-title{font-size:14px;font-weight:800;margin-bottom:6px;color:var(--ink)}.card-body{font-size:12px;color:var(--body);line-height:1.55}.metric-val{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;margin-bottom:4px}.metric-sub{font-size:10px;color:var(--muted);line-height:1.35}.tag{display:inline-block;margin-top:10px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;padding:3px 8px;border-radius:2px;background:var(--green-pale);color:#2e7d52}.tag.blue{background:#eef3fc;color:var(--blue)}.tag.amber{background:#fef3c7;color:var(--amber)}.tag.dark{background:#111;color:#fff}.hint{font-size:11px;color:var(--muted);line-height:1.5}.insight-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px}.insight-list li{font-size:12px;font-weight:700;line-height:1.35;display:flex;gap:9px}.insight-list li:before{content:"";width:6px;height:6px;border-radius:999px;background:var(--green);margin-top:6px;flex-shrink:0}.flow{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:22px}.flow-step{background:#fff;min-height:92px;padding:12px;display:flex;flex-direction:column;justify-content:center;text-align:center}.flow-step:last-child{background:var(--green-pale)}.flow-num{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--green);margin-bottom:5px}.flow-name{font-size:12px;font-weight:800;line-height:1.25}.flow-desc{font-size:10px;color:var(--muted);line-height:1.35;margin-top:5px}.score-table{border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:18px}.score-row{display:grid;grid-template-columns:220px 1fr 120px;gap:1px;background:var(--rule)}.score-row>div{background:#fff;padding:12px 14px;font-size:11px;line-height:1.4}.score-row.head>div{background:#111;color:#fff;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.8px}.score-row strong{font-size:12px}.bar{height:3px;background:var(--rule);margin-top:10px}.bar div{height:100%;background:var(--green)}.persona-card{background:#fff;border:1px solid var(--rule);border-radius:4px;overflow:hidden}.persona-head{height:82px;background:linear-gradient(135deg,#e0ebe4,#c8dbd0);display:flex;align-items:flex-end;padding:12px 16px}.persona-head.blue{background:linear-gradient(135deg,#e4eaf0,#ccd6e0)}.persona-head.amber{background:linear-gradient(135deg,#f5ead6,#ead3a8)}.persona-body{padding:15px 16px}.persona-role{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--green);margin-bottom:4px}.persona-name{font-size:15px;font-weight:800}.persona-row{display:flex;gap:10px;margin:7px 0}.persona-key{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);min-width:54px}.persona-val{font-size:11px;color:var(--body);line-height:1.4}.command{border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:22px}.command-head{background:#111;color:#fff;padding:12px 18px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.8px}.command-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule)}.command-cell{background:#fff;padding:16px}.system-flow{display:flex;flex-direction:column;gap:2px;margin-bottom:20px}.sys-row{display:flex;align-items:center;border:1px solid var(--rule);border-radius:3px;overflow:hidden}.sys-label{background:#111;color:#fff;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;padding:8px 14px;min-width:180px}.sys-item{font-size:10px;color:var(--body);padding:8px 14px;border-left:1px solid var(--rule)}.final-box{padding:20px;background:var(--green-pale);border:1px solid var(--green);border-radius:4px;margin-top:20px}.final-box-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--green);margin-bottom:8px}.final-box p{font-size:14px;line-height:1.65;font-weight:600;margin:0}@media(max-width:1000px){.wsp-links,.wsp-rail{display:none}.wsp-progress{left:0}.wsp-footer{width:100%;padding:14px 20px}.wsp-stage-area{padding:32px 20px 110px}.grid-2,.grid-3,.grid-4,.flow,.command-grid{grid-template-columns:1fr}.score-row{grid-template-columns:1fr}.sys-row{align-items:stretch;flex-direction:column}.sys-item{border-left:0;border-top:1px solid var(--rule)}}
`;

function GrowthThesis() {
  const metrics = [
    ["Market Share", "Win more must-win pursuits by focusing resources where WSP has the highest right to win."],
    ["Pipeline Quality", "Prioritize pursuit value, readiness, funding strength, and strategic fit before proposal investment."],
    ["Win Rate", "Improve shortlist, interview, and closed-win performance through stronger capture discipline."],
    ["Learning Loop", "Turn debriefs, competitor themes, and client feedback into reusable intelligence."]
  ];
  return <>
    <div className="flow">
      {[["01","Market Signals","Funding, capital plans, procurement calendars"],["02","Client Priorities","Agency goals, pain points, decision drivers"],["03","Opportunity Scoring","Right-to-win, value, readiness, capacity"],["04","Pursuit Strategy","Capture plan, team, differentiators"],["05","Win Themes","Client pressure + WSP advantage"],["06","Proposal / Interview","Story, proof, visuals, coaching"],["07","Debrief Loop","Learn, improve, reuse intelligence"]].map(([num,name,desc])=><div className="flow-step" key={name}><div className="flow-num">{num}</div><div className="flow-name">{name}</div><div className="flow-desc">{desc}</div></div>)}
    </div>
    <div className="grid-4">{metrics.map(([label,body])=><div className="metric" key={label}><div className="kd-eye">Executive Outcome</div><div className="metric-val">{label}</div><div className="metric-sub">{body}</div></div>)}</div>
    <div className="grid-2">
      <div className="card"><div className="card-eye">Business Assumption</div><div className="card-title">Pursuit-led revenue model</div><div className="card-body">WSP's Mid-Atlantic growth motion is likely driven by long-cycle, relationship-based infrastructure pursuits across state DOTs, transit agencies, local governments, advisory buyers, and public-sector capital programs.</div><span className="tag">Infrastructure Growth</span></div>
      <div className="card"><div className="card-eye">Role Translation</div><div className="card-title">Strategic Growth, not marketing support</div><div className="card-body">The AVP Senior Marketing Manager role should be positioned as the connective tissue between business development, technical leaders, client strategy, proposal execution, and executive reporting.</div><span className="tag blue">Strategic Growth Team</span></div>
    </div>
  </>;
}

function MarketIntelligence() {
  const cards = [
    ["Funding Signals", "IIJA programs, state capital plans, grant cycles, budget approvals, and reauthorization changes that create timing-based opportunity."],
    ["Agency Priorities", "Safety, mobility, modernization, resiliency, equity, environmental impact, asset management, and delivery speed."],
    ["Competitive Position", "Incumbency, partner history, local office strength, prior performance, relationship depth, and differentiated proof."],
    ["WSP Right-to-Win", "Where WSP's technical depth, Advisory capability, local experience, and project record create a clear advantage."]
  ];
  return <>
    <div className="grid-2"><div className="card"><div className="section-eye">Signals to Monitor</div><ul className="insight-list">{["State DOT capital improvement plans","Transit modernization and mobility programs","Federal funding awards and grant deadlines","Local agency procurement calendars","Competitor wins, losses, incumbency, and teaming patterns"].map(x=><li key={x}>{x}</li>)}</ul></div><div className="card"><div className="section-eye">Commercial Questions</div><ul className="insight-list">{["Which clients are entering a buying window?","Where does WSP have strongest relationship coverage?","Which opportunities are funded and politically viable?","Which pursuits build future market share beyond the first award?","Where should leadership invest capture resources early?"].map(x=><li key={x}>{x}</li>)}</ul></div></div>
    <div className="grid-4">{cards.map(([title,body])=><div className="metric" key={title}><div className="kd-eye">Market Layer</div><div className="metric-val">{title}</div><div className="metric-sub">{body}</div></div>)}</div>
  </>;
}

function ClientArchitecture() {
  const personas = [
    { cls:"", role:"Agency Executive", name:"Secretary / Commissioner / Executive Sponsor", rows:[["Pressure","Deliver capital programs while balancing safety, cost, public trust, and political visibility"],["Message","Strategic confidence, reduced delivery risk, measurable public value"]] },
    { cls:"blue", role:"Program Leader", name:"Transportation / Advisory Program Owner", rows:[["Pressure","Move from planning to execution with technical certainty and stakeholder alignment"],["Message","WSP brings integrated technical and advisory depth from strategy through delivery"]] },
    { cls:"amber", role:"Procurement + Evaluator", name:"Selection Committee / Technical Reviewer", rows:[["Pressure","Choose a partner that is compliant, credible, differentiated, and easy to defend"],["Message","Clear proof, relevant experience, strong team, low-risk execution plan"]] }
  ];
  return <>
    <div className="grid-3">{personas.map(p=><div className="persona-card" key={p.name}><div className={`persona-head ${p.cls}`}><span className="tag dark">Stakeholder</span></div><div className="persona-body"><div className="persona-role">{p.role}</div><div className="persona-name">{p.name}</div>{p.rows.map(([k,v])=><div className="persona-row" key={k}><div className="persona-key">{k}</div><div className="persona-val">{v}</div></div>)}</div></div>)}</div>
    <div className="grid-2"><div className="card"><div className="card-eye">Audience Architecture</div><div className="card-title">Public-sector decision ecosystem</div><div className="card-body">A WSP pursuit story should account for executive sponsors, technical owners, procurement teams, community stakeholders, funding authorities, elected officials, and teaming partners. Each group values a different version of risk reduction.</div></div><div className="card"><div className="card-eye">Message System</div><div className="card-title">One pursuit, multiple value stories</div><div className="card-body">The core message stays consistent, but the emphasis changes: executive outcomes for sponsors, delivery confidence for program owners, compliance and proof for evaluators, and community impact for public audiences.</div></div></div>
  </>;
}

function PursuitPrioritization() {
  const rows = [
    ["Client Relationship", "Do we know the decision-makers, influencers, and evaluation history?", "High"],
    ["Technical Fit", "Do we have the right experience, team, proof points, and differentiators?", "High"],
    ["Funding Readiness", "Is the project funded, politically viable, and likely to move?", "Medium"],
    ["Competitive Position", "Are we advantaged, neutral, or chasing from behind?", "High"],
    ["Strategic Value", "Does this grow future share, open a market, or deepen a priority client?", "High"],
    ["Pursuit Capacity", "Can the team deliver a winning response without weakening higher-priority pursuits?", "Medium"]
  ];
  return <>
    <div className="score-table"><div className="score-row head"><div>Dimension</div><div>Question</div><div>Weight</div></div>{rows.map(([a,b,c],i)=><div className="score-row" key={a}><div><strong>{a}</strong><div className="bar"><div style={{width:`${88-(i*6)}%`}} /></div></div><div>{b}</div><div><span className={`tag ${c==="Medium"?"amber":""}`}>{c}</span></div></div>)}</div>
    <div className="grid-3"><div className="card"><div className="card-eye">Must-Win</div><div className="card-title">High value · High fit</div><div className="card-body">Executive sponsor, early capture, proposal command center, interview coaching, and leadership visibility.</div><span className="tag">Full Investment</span></div><div className="card"><div className="card-eye">Selective Bid</div><div className="card-title">Viable but constrained</div><div className="card-body">Tight scope, focused differentiators, clear owner, and defined resource ceiling.</div><span className="tag blue">Controlled Investment</span></div><div className="card"><div className="card-eye">Nurture / No-Go</div><div className="card-title">Weak timing or weak advantage</div><div className="card-body">Decline the pursuit or shift to pre-positioning for the next cycle.</div><span className="tag amber">Protect Capacity</span></div></div>
  </>;
}

function WinStrategy() {
  return <>
    <div className="command"><div className="command-head">Win Theme Formula</div><div className="command-grid">{[["Client Pressure","Funding deadlines, delivery risk, modernization expectations, public accountability"],["WSP Advantage","National technical depth, local Mid-Atlantic experience, Advisory capability, integrated teams"],["Proof of Delivery","Relevant projects, team credentials, lessons learned, measurable outcomes"],["Risk Reduction","Clear plan, stakeholder alignment, transparent delivery, confidence from strategy to execution"]].map(([a,b])=><div className="command-cell" key={a}><div className="card-eye">{a}</div><div className="card-body">{b}</div></div>)}</div></div>
    <div className="final-box"><div className="final-box-title">Example Positioning</div><p>For transportation agencies under pressure to deliver funded infrastructure programs with speed, transparency, and community impact, WSP brings the technical, advisory, and local delivery depth to move from planning to execution with confidence.</p></div>
    <div className="grid-3" style={{marginTop:16}}>{["Move from qualifications to client relevance","Tie technical strengths to the agency's public mandate","Use local proof to make national scale feel personal"].map((x,i)=><div className="card" key={x}><div className="card-eye">Principle 0{i+1}</div><div className="card-title">{x}</div><div className="card-body">The pursuit story should make it easy for evaluators to understand why WSP is the safest, strongest, and most strategic choice.</div></div>)}</div>
  </>;
}

function ProposalCommand() {
  const cells = [
    ["Capture Plan", "Client context, decision map, relationship plan, likely competitors, differentiators, risk areas"],
    ["Storyline", "Core narrative, win themes, evidence hierarchy, executive summary, visual message"],
    ["Quality Control", "Compliance matrix, Red Team reviews, technical edits, proof alignment, final polish"],
    ["Interview Prep", "Presenter coaching, Q&A readiness, room strategy, stakeholder-specific talking points"]
  ];
  return <>
    <div className="command"><div className="command-head">Proposal Command Center</div><div className="command-grid">{cells.map(([a,b])=><div className="command-cell" key={a}><div className="card-eye">{a}</div><div className="card-title">{a}</div><div className="card-body">{b}</div></div>)}</div></div>
    <div className="flow">{[["01","Kickoff","Decision drivers + roles"],["02","Compliance","What must be true"],["03","Story","Why WSP wins"],["04","Proof","Relevant evidence"],["05","Review","Red Team + refinements"],["06","Interview","Coach + prepare"],["07","Debrief","Capture learning"]].map(([n,a,b])=><div className="flow-step" key={a}><div className="flow-num">{n}</div><div className="flow-name">{a}</div><div className="flow-desc">{b}</div></div>)}</div>
  </>;
}

function KpiLayer() {
  const data = [
    ["Market Share", "Wins by state, agency, market, service line, and strategic account"],
    ["Pipeline Quality", "Must-win value, qualified pursuit value, stage movement, and resource load"],
    ["Win Performance", "Shortlist rate, win rate, interview-to-win rate, and debrief trends"],
    ["Client Expansion", "Repeat work, cross-sell into Advisory, and priority account growth"],
    ["Pursuit Efficiency", "Go/No-Go accuracy, proposal volume, capacity strain, and cycle time"],
    ["Learning Loop", "Competitor themes, evaluator feedback, content gaps, and proof-point needs"]
  ];
  return <>
    <div className="grid-3">{data.map(([a,b])=><div className="card" key={a}><div className="card-eye">KPI</div><div className="card-title">{a}</div><div className="card-body">{b}</div></div>)}</div>
    <div className="system-flow">{[["Executive KPIs",["Market share","Qualified pipeline","Win rate","Client expansion","Profitability"]],["Pursuit Intelligence",["Go/No-Go scoring","Debriefs","Competitor themes","Client feedback","Content gaps"]],["Growth Actions",["Market prioritization","Capture planning","Win theme refinement","Proposal coaching","Account strategy"]]].map(([label,items])=><div className="sys-row" key={label as string}><div className="sys-label">{label}</div>{(items as string[]).map(x=><div className="sys-item" key={x}>{x}</div>)}</div>)}</div>
  </>;
}

function OperatingSystem() {
  return <>
    <div className="grid-2"><div className="card"><div className="section-eye">Why Chad</div><ul className="insight-list">{["Built commercial systems that connect segmentation, KPI visibility, marketing activation, and sales execution","Translates executive goals into operating rhythms, dashboards, campaigns, and team workflows","Comfortable working across technical, sales, marketing, analytics, and leadership audiences","Brings revenue intelligence discipline to a pursuit-led professional services environment"].map(x=><li key={x}>{x}</li>)}</ul></div><div className="card"><div className="section-eye">WSP Fit</div><ul className="insight-list">{["Strategic growth mindset beyond proposal production","Market and client segmentation for Mid-Atlantic Transportation and Advisory priorities","Pursuit scoring that protects capacity and improves win probability","Closed-loop reporting that helps leaders understand what is working and why"].map(x=><li key={x}>{x}</li>)}</ul></div></div>
    <div className="final-box"><div className="final-box-title">Commercial Strategy Summary</div><p>For WSP, I would build a pursuit-led growth system that helps the Strategic Growth Team choose better opportunities, shape stronger client narratives, coordinate proposal and interview execution, and turn every pursuit into intelligence that improves the next one.</p></div>
  </>;
}

function StageContent({ current }: { current: number }) {
  if (current === 0) return <GrowthThesis />;
  if (current === 1) return <MarketIntelligence />;
  if (current === 2) return <ClientArchitecture />;
  if (current === 3) return <PursuitPrioritization />;
  if (current === 4) return <WinStrategy />;
  if (current === 5) return <ProposalCommand />;
  if (current === 6) return <KpiLayer />;
  return <OperatingSystem />;
}

export default function WspCommercialStrategyPage() {
  const [current, setCurrent] = useState(0);
  const stage = stages[current];
  const pct = ((current + 1) / stages.length) * 100;
  const goTo = (idx: number) => setCurrent(Math.max(0, Math.min(stages.length - 1, idx)));
  const nav = (dir: number) => current === stages.length - 1 && dir > 0 ? setCurrent(0) : goTo(current + dir);

  return <main className="wsp-page"><style>{styles}</style><nav className="wsp-nav"><a className="wsp-logo" href="/">About <em>Chad</em></a><div className="wsp-links"><a href="/">About</a><a href="/approach">My Approach</a><a href="/career">Career</a><a href="/skills">Skills</a><a className="active" href="/wsp">WSP Strategy</a><a href="/contact">Contact</a></div></nav><div className="wsp-progress"><div className="wsp-progress-fill" style={{ width: `${pct}%` }} /></div><div className="wsp-shell"><aside className="wsp-rail">{stages.map((s, i) => <div key={s.nav}>{i > 0 && <div className="rail-connector" />}<button onClick={() => goTo(i)} className={`rail-item ${i === current ? "active" : ""} ${i < current ? "done" : ""}`}><span className="rail-dot" /><span className="rail-label">{s.nav}</span></button></div>)}</aside><section className="wsp-stage-area"><div className="wsp-stage"><div className="stage-eyebrow">{stage.eyebrow}</div><h1 className="stage-title">{stage.title}</h1><p className="stage-body">{stage.body}</p>{stage.quote && <div className="stage-quote">&quot;{stage.quote}&quot;</div>}<StageContent current={current} /></div></section></div><footer className="wsp-footer"><div className="stage-counter">Chapter {current + 1} of {stages.length}</div><div className="btns"><button className="wsp-btn" onClick={() => nav(-1)} disabled={current === 0}>← Back</button><button className="wsp-btn next" onClick={() => nav(1)}>{current === stages.length - 1 ? "↩ Start Over" : "Next →"}</button></div></footer></main>;
}
