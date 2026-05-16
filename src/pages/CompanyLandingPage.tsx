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

const CompanyLandingPage = () => {
  const { slug } = useParams();
  const page = slug ? companyLandingPages[slug] : undefined;

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="px-6 md:px-20 pt-36 pb-20 border-b border-border">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold mb-4">{page.eyebrow}</p>
              <h1 className="font-display text-4xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mb-6">
                {page.headline}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
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

            <aside className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">Proposal Snapshot</p>
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Company</p>
                  <p className="text-foreground font-semibold">{page.companyName}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Category</p>
                  <p className="text-foreground font-semibold">{page.industry}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Recommended engagement</p>
                  <p className="text-foreground font-semibold">{page.recommendedEngagement.title}</p>
                </div>
                {proposal?.investment && (
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Commercial model</p>
                    <p className="text-foreground font-semibold">{proposal.investment}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-16 items-start">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Situation</p>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                Why this conversation may be worth having.
              </h2>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {proposal?.situation || page.fitSummary}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20 bg-muted/40 border-y border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-16 items-start">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Opportunity</p>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                Where I believe I can create leverage.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {proposal?.opportunity || page.fitSummary}
              </p>
            </div>
            <div className="grid gap-4">
              {page.likelyPriorities.map((priority) => (
                <div key={priority} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                  <p className="text-foreground font-medium leading-relaxed">{priority}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Recommended proposal</p>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                {page.recommendedEngagement.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{page.recommendedEngagement.description}</p>
            </div>
            <ul className="grid gap-4 list-none p-0 m-0">
              {page.recommendedEngagement.bullets.map((bullet) => (
                <li key={bullet} className="rounded-2xl bg-card border border-border p-5 text-foreground leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {proposal?.phases?.length ? (
          <section className="px-6 md:px-20 py-16 md:py-20 bg-muted/40 border-y border-border">
            <div className="max-w-6xl mx-auto">
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Execution plan</p>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-8">
                A phased path from diagnosis to usable operating system.
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
            <div className="max-w-6xl mx-auto grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-16 items-start">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Expected outcomes</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
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
      <Footer />
    </div>
  );
};

export default CompanyLandingPage;
