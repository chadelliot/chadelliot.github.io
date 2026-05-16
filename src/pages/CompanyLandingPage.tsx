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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="px-6 md:px-20 pt-36 pb-20 border-b border-border">
          <div className="max-w-6xl mx-auto">
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
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-16 items-start">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Why this may matter</p>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                A targeted revenue systems point of view for {page.companyName}.
              </h2>
              <p className="text-muted-foreground leading-relaxed">{page.fitSummary}</p>
            </div>
            <div className="grid gap-4">
              {page.likelyPriorities.map((priority) => (
                <div key={priority} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-foreground font-medium leading-relaxed">{priority}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20 bg-muted/40 border-y border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Recommended engagement</p>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                {page.recommendedEngagement.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{page.recommendedEngagement.description}</p>
            </div>
            <ul className="grid gap-4 list-none p-0 m-0">
              {page.recommendedEngagement.bullets.map((bullet) => (
                <li key={bullet} className="rounded-2xl bg-background border border-border p-5 text-foreground leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Relevant proof</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-8">
              Built for complex, cross-functional revenue environments.
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {proofPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <p className="text-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] uppercase font-semibold opacity-80 mb-4">Outreach angle</p>
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
