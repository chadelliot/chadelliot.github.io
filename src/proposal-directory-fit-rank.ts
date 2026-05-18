type FitRank = {
  label: string;
  score: number;
  rationale: string;
};

const FIT_RANKS: Record<string, FitRank> = {
  "revive": { label: "Very strong fit", score: 98, rationale: "GTM operating model, launch playbooks, AI workflows, and cross-functional enablement align directly to Chad’s revenue systems background." },
  "sleep-doctor": { label: "Very strong fit", score: 96, rationale: "Physician-channel GTM, CRM workflow design, pilot launch, messaging, and KPI structure are highly aligned." },
  "who-gives-a-crap": { label: "Very strong fit", score: 95, rationale: "Marketing operations, planning cadence, campaign governance, and cross-functional operating rhythm are directly aligned." },
  "attest": { label: "Very strong fit", score: 94, rationale: "Growth marketing, lifecycle automation, attribution, AI workflows, and RevOps partnership match strongly." },
  "enmacc": { label: "Very strong fit", score: 92, rationale: "Revenue operating cadence, CRO support, OKRs, RevOps, and executive reporting are strong matches." },
  "fueled": { label: "Strong fit", score: 89, rationale: "SEO/AEO, AI search, analytics, measurement, and content visibility fit Chad’s QXO strategy work." },
  "momentum-healthcare-technology-consulting": { label: "Strong fit", score: 87, rationale: "Healthcare growth systems, operations, technology alignment, and commercial enablement are aligned with a systems operator story." },
  "turtl": { label: "Strong fit", score: 86, rationale: "Customer success, lifecycle visibility, RevOps reporting, and retention/expansion operating cadence are relevant." },
  "acuvance": { label: "Strong fit", score: 84, rationale: "Director of Revenue Operations aligns to CRM process, reporting, lifecycle, and revenue operating system design." },
  "town-web": { label: "Strong fit", score: 82, rationale: "CPQ and RevOps architecture aligns with process design, CRM workflows, reporting, and operational system building." },
  "farlinium": { label: "Strong fit", score: 81, rationale: "B2B growth marketing, demand generation, sales alignment, and pipeline reporting are aligned." },
  "health-commerce": { label: "Medium-strong fit", score: 76, rationale: "Digital marketing leadership, campaign measurement, CRM/automation, and healthcare client strategy are aligned, though medtech agency specialization is less central." },
  "neolytix": { label: "Medium-strong fit", score: 75, rationale: "Healthcare growth operations, marketing, process excellence, and reporting are aligned with some category learning required." },
  "maleda-tech": { label: "Medium fit", score: 70, rationale: "Lifecycle measurement and experimentation fit, but the role is more SQL-heavy IC analytics than strategic systems leadership." },
  "brains": { label: "Medium fit", score: 66, rationale: "Brand strategy and messaging are relevant, but the role is more pure brand strategy than revenue/marketing operations." },
  "speridian-technologies": { label: "Medium fit", score: 65, rationale: "GTM strategy and product/program leadership are adjacent, but less directly marketing-ops focused." },
  "everist": { label: "Medium fit", score: 64, rationale: "Fractional VP marketing is relevant, though consumer/DTC brand leadership is less direct than GTM systems work." },
  "whole-womans-health": { label: "Medium fit", score: 63, rationale: "Local search, patient acquisition, and reporting align, but reproductive healthcare category experience would require ramp-up." },
  "logic20-20": { label: "Lower-medium fit", score: 58, rationale: "Solution architecture and transformation are relevant, but the Palantir Foundry focus is less directly aligned." },
  "development-counsellors-international": { label: "Lower-medium fit", score: 52, rationale: "Strategy, research, and KPI work fit broadly, but destination marketing specialization is not central to Chad’s strongest positioning." },
  "software-solutions-firm-vp-sales": { label: "Lower fit", score: 48, rationale: "Sales leadership is adjacent to RevOps, but less directly aligned to marketing/revenue systems architecture." }
};

const getSlugFromArticle = (article: HTMLElement) => {
  const link = article.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
  return link?.getAttribute("href")?.replace("/company/", "") || "";
};

const addFitRankBadges = () => {
  if (window.location.pathname !== "/company") return;

  const articles = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")) as HTMLElement[];
  articles.forEach((article) => {
    const slug = getSlugFromArticle(article);
    const rank = FIT_RANKS[slug];
    if (!rank) return;

    article.dataset.fitScore = String(rank.score);

    if (article.dataset.fitRankEnhanced === "true") return;
    article.dataset.fitRankEnhanced = "true";

    const companyBlock = article.querySelector(":scope > div:first-child > div:first-child") as HTMLElement | null;
    if (!companyBlock) return;

    const badge = document.createElement("div");
    badge.className = `proposal-fit-rank proposal-fit-rank--${rank.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    badge.innerHTML = `<span class="proposal-fit-rank__label">${rank.label}</span><span class="proposal-fit-rank__score">${rank.score}/100</span><span class="proposal-fit-rank__rationale">${rank.rationale}</span>`;
    companyBlock.appendChild(badge);
  });
};

const getProposalGrid = () => document.querySelector("main > section:nth-of-type(3) .grid.gap-4") as HTMLElement | null;

const sortByFitRank = (direction: "high" | "low") => {
  addFitRankBadges();
  const grid = getProposalGrid();
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(":scope > article")) as HTMLElement[];
  cards
    .sort((a, b) => {
      const aScore = Number(a.dataset.fitScore || 0);
      const bScore = Number(b.dataset.fitScore || 0);
      return direction === "low" ? aScore - bScore : bScore - aScore;
    })
    .forEach((card) => grid.appendChild(card));
};

const removeFitRankFromMainSort = () => {
  const sortSelects = Array.from(document.querySelectorAll("main > section:nth-of-type(2) select")) as HTMLSelectElement[];
  sortSelects.forEach((select) => {
    Array.from(select.options).forEach((option) => {
      if (option.value === "fit-rank" || option.textContent?.toLowerCase().includes("fit rank")) option.remove();
    });
  });
};

const addFitRankSortControl = () => {
  if (window.location.pathname !== "/company") return;
  const existing = document.querySelector(".proposal-fit-rank-sort-select") as HTMLSelectElement | null;
  if (existing) {
    if (existing.value !== "high") existing.value = "high";
    return;
  }

  const controlGrid = document.querySelector(".proposal-main-filter-section > div > div:nth-child(2)") as HTMLElement | null;
  if (!controlGrid) return;

  const label = document.createElement("label");
  label.className = "proposal-fit-rank-sort-label grid gap-2 text-sm font-semibold text-foreground";
  label.textContent = "Fit rank";

  const select = document.createElement("select");
  select.className = "proposal-fit-rank-sort-select rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary";
  select.setAttribute("aria-label", "Sort by fit rank");
  select.innerHTML = `<option value="high">Highest first</option><option value="low">Lowest first</option><option value="none">No fit-rank sort</option>`;
  select.value = "high";
  select.addEventListener("change", () => {
    if (select.value === "high" || select.value === "low") sortByFitRank(select.value);
  });

  label.appendChild(select);
  controlGrid.insertBefore(label, controlGrid.firstChild);
};

const bootFitRank = () => {
  window.setTimeout(() => { addFitRankBadges(); sortByFitRank("high"); }, 300);
  window.setTimeout(removeFitRankFromMainSort, 400);
  window.setTimeout(addFitRankSortControl, 500);
  window.setTimeout(() => { addFitRankBadges(); sortByFitRank("high"); }, 1000);
  window.setTimeout(removeFitRankFromMainSort, 1100);
  window.setTimeout(addFitRankSortControl, 1200);
  window.setTimeout(() => { addFitRankBadges(); sortByFitRank("high"); }, 2200);
  window.setTimeout(removeFitRankFromMainSort, 2300);
  window.setTimeout(addFitRankSortControl, 2400);
  window.setTimeout(() => { addFitRankBadges(); sortByFitRank("high"); }, 4000);
  window.setTimeout(removeFitRankFromMainSort, 4100);
  window.setTimeout(addFitRankSortControl, 4200);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootFitRank);
} else {
  bootFitRank();
}
