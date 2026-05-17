import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allCompanyLandingPages } from "@/data/allCompanyLandingPages";

type SortMode = "newest" | "oldest" | "company";

const POSTED_DATES: Record<string, string> = {
  "who-gives-a-crap": "2026-05-16",
  attest: "2026-05-16",
  enmacc: "2026-05-16",
  "speridian-technologies": "2026-05-16",
  neolytix: "2026-05-16",
  farlinium: "2026-05-16",
  "logic20-20": "2026-05-16",
  acuvance: "2026-05-15",
  "town-web": "2026-05-15",
  everist: "2026-05-15",
  turtl: "2026-05-15",
  "software-solutions-firm-vp-sales": "2026-05-15",
};

const POSTED_ROLE_TITLES: Record<string, string> = {
  "who-gives-a-crap": "Fractional Head of Marketing Operations & Planning",
  attest: "Interim Senior Growth Marketing Manager",
  enmacc: "Interim Business Manager Revenue",
  "speridian-technologies": "Principal GTM Strategy Lead",
  neolytix: "Fractional Healthcare Growth Program Architect",
  farlinium: "B2B Growth Marketing Manager",
  "logic20-20": "Solution Architect — Palantir Foundry",
  acuvance: "Director of Revenue Operations",
  "town-web": "Fractional CPQ and RevOps Architect",
  everist: "Fractional VP Marketing",
  turtl: "Fractional VP of Customer Success",
  "software-solutions-firm-vp-sales": "Fractional VP of Sales",
};

const getOpportunityType = (page: (typeof allCompanyLandingPages)[string]) => {
  const industry = page.industry.toLowerCase();

  if (industry.includes("talent") || industry.includes("consulting network") || industry.includes("executive network")) return "Agency / Talent Network";
  if (industry.includes("marketplace") || industry.includes("platform") || industry.includes("owned consulting channel")) return "Marketplace / Platform";
  return "Company Direct / Fractional";
};

const getOpportunityTypeClass = (opportunityType: string, isSelected = false) => {
  if (opportunityType.includes("Agency")) {
    return isSelected
      ? "border-amber-700 bg-amber-600 text-white"
      : "border-amber-400 bg-amber-50 text-amber-900 hover:border-amber-700";
  }

  if (opportunityType.includes("Marketplace")) {
    return isSelected
      ? "border-violet-700 bg-violet-600 text-white"
      : "border-violet-400 bg-violet-50 text-violet-900 hover:border-violet-700";
  }

  return isSelected
    ? "border-sky-700 bg-sky-600 text-white"
    : "border-sky-400 bg-sky-50 text-sky-900 hover:border-sky-700";
};

const formatPostedDate = (date?: string) => {
  if (!date) return "Date pending";
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getPostedRoleTitle = (page: (typeof allCompanyLandingPages)[string]) => POSTED_ROLE_TITLES[page.slug] ?? page.recommendedEngagement.title;

const pillBaseClass = "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors";

const CompanyDirectoryPageV5 = () => {
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [typeFilter, setTypeFilter] = useState("all");

  const pages = useMemo(() => {
    const records = Object.values(allCompanyLandingPages).map((page) => ({
      page,
      postedDate: POSTED_DATES[page.slug],
      opportunityType: getOpportunityType(page),
    }));

    return records
      .filter((record) => typeFilter === "all" || record.opportunityType === typeFilter)
      .sort((a, b) => {
        if (sortMode === "company") return a.page.companyName.localeCompare(b.page.companyName);

        const aTime = a.postedDate ? new Date(a.postedDate).getTime() : 0;
        const bTime = b.postedDate ? new Date(b.postedDate).getTime() : 0;
        return sortMode === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [sortMode, typeFilter]);

  const opportunityTypes = useMemo(() => {
    const types = new Set(Object.values(allCompanyLandingPages).map(getOpportunityType));
    return Array.from(types).sort();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border px-6 pb-12 pt-32 md:px-20 md:pb-16 md:pt-36">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Company directory</p>
              <h1 className="mb-5 font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">Proposal page library.</h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">A private index of the company-specific proposal pages created for consulting, platform, and outreach conversations.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-primary hover:text-primary">
              Contact Chad
            </Link>
          </div>
        </section>

        <section className="px-6 py-8 md:px-20 md:py-10">
          <div className="mx-auto max-w-6xl rounded-[1.5rem] border border-border bg-background p-5 shadow-sm md:p-6">
            <div className="mb-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setTypeFilter("all")} className={`${pillBaseClass} ${typeFilter === "all" ? "border-black bg-black text-white" : "border-border bg-background text-foreground hover:border-primary"}`}>
                All types
              </button>
              {opportunityTypes.map((type) => (
                <button key={type} type="button" onClick={() => setTypeFilter(type)} className={`${pillBaseClass} ${getOpportunityTypeClass(type, typeFilter === type)}`}>
                  {type}
                </button>
              ))}
            </div>

            <label className="grid gap-2 text-sm font-semibold text-foreground md:max-w-md">
              Sort proposals
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary">
                <option value="newest">Newest posted first</option>
                <option value="oldest">Oldest posted first</option>
                <option value="company">Company A-Z</option>
              </select>
            </label>
          </div>
        </section>

        <section className="px-6 pb-14 md:px-20 md:pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-2 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Active pages</p>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">{pages.length} proposal pages</h2>
              </div>
              <p className="text-sm text-muted-foreground">Email-managed contact details remain private inside HubSpot.</p>
            </div>

            <div className="grid gap-4">
              {pages.map(({ page, postedDate, opportunityType }) => (
                <article key={page.slug} className="rounded-[1.5rem] border border-border bg-background p-5 transition-colors hover:border-primary md:p-6">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_auto] lg:items-center">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{page.companyName}</h3>
                        <button type="button" onClick={() => setTypeFilter(opportunityType)} className={`${pillBaseClass} ${getOpportunityTypeClass(opportunityType, typeFilter === opportunityType)}`}>{opportunityType}</button>
                      </div>
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{page.industry}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Posted: {formatPostedDate(postedDate)}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Posted role</p>
                      <p className="leading-relaxed text-foreground">{getPostedRoleTitle(page)}</p>
                    </div>

                    <Link to={`/company/${page.slug}`} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground no-underline transition-opacity hover:opacity-90">View page</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDirectoryPageV5;
