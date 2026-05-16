import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allCompanyLandingPages } from "@/data/allCompanyLandingPages";

type OutreachContact = {
  name: string;
  title: string;
  linkedinUrl: string;
  email?: string;
  selectionRationale?: string;
};

const getFirstName = (name: string) => name.split(" ")[0] || name;

const getProposalUrl = (slug: string) => {
  if (typeof window === "undefined") return `/company/${slug}`;
  return `${window.location.origin}/company/${slug}`;
};

const getDefaultContacts = (page: (typeof allCompanyLandingPages)[string]): OutreachContact[] => [
  {
    name: `${page.companyName} Hiring Team`,
    title: "Likely hiring manager / talent contact",
    linkedinUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${page.companyName} hiring manager recruiter talent acquisition growth revenue operations`)}`,
    selectionRationale: "A verified individual contact has not been added yet, so this action opens a targeted LinkedIn search for the most likely hiring, recruiter, growth, revenue, or operations stakeholder tied to this proposal.",
  },
];

const getOpportunityType = (page: (typeof allCompanyLandingPages)[string]) => {
  const industry = page.industry.toLowerCase();

  if (industry.includes("talent") || industry.includes("consulting network") || industry.includes("executive network")) {
    return "Agency / Talent Network";
  }

  if (industry.includes("marketplace") || industry.includes("platform") || industry.includes("owned consulting channel")) {
    return "Marketplace / Platform";
  }

  if (industry.includes("fractional") || industry.includes("1099") || industry.includes("contract")) {
    return "Company Direct / Fractional";
  }

  return "Company Direct / Fractional";
};

const buildEmailHref = (page: (typeof allCompanyLandingPages)[string], contact: OutreachContact) => {
  const proposalUrl = getProposalUrl(page.slug);
  const subject = encodeURIComponent(`Potential fit with ${page.companyName}`);
  const body = encodeURIComponent(
    [
      `Hi ${getFirstName(contact.name)},`,
      "",
      `I came across ${page.companyName} and wanted to share a concise proposal-style point of view on where I may be able to create value.`,
      "",
      `The proposal is tailored here: ${proposalUrl}`,
      "",
      "In short, my background is strongest where growth strategy, revenue operations, lifecycle marketing, customer data, and executive reporting need to operate as one system. I have built enterprise marketing infrastructure from the ground up, including funnel architecture, CDP activation, segmentation, attribution, and cross-functional growth operations.",
      "",
      "I would welcome the chance to discuss whether this maps to any current priorities on your team.",
      "",
      "Best,",
      "Chad Parker",
    ].join("\n"),
  );

  return `mailto:${contact.email ?? ""}?subject=${subject}&body=${body}`;
};

const CompanyDirectoryPageAll = () => {
  const pages = useMemo(
    () =>
      Object.values(allCompanyLandingPages).sort((a, b) =>
        a.companyName.localeCompare(b.companyName),
      ),
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border px-6 pb-12 pt-32 md:px-20 md:pb-16 md:pt-36">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Company directory</p>
              <h1 className="mb-5 font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
                Proposal page library.
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                A private index of the company-specific proposal pages created for consulting, platform, and outreach conversations.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-primary hover:text-primary"
            >
              Contact Chad
            </Link>
          </div>
        </section>

        <section className="px-6 py-14 md:px-20 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-2 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Active pages</p>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                  {pages.length} proposal pages
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">Sorted alphabetically by company name.</p>
            </div>

            <div className="grid gap-4">
              {pages.map((page) => {
                const savedContacts = ((page as typeof page & { outreachContacts?: OutreachContact[] }).outreachContacts ?? []).slice(0, 3);
                const outreachContacts = savedContacts.length ? savedContacts : getDefaultContacts(page);

                return (
                  <article key={page.slug} className="rounded-[1.5rem] border border-border bg-background p-5 transition-colors hover:border-primary md:p-6">
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_auto] lg:items-center">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                            {page.companyName}
                          </h3>
                          <span className="rounded-full bg-muted/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {getOpportunityType(page)}
                          </span>
                          {page.status ? (
                            <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                              {page.status}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{page.industry}</p>
                      </div>

                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Engagement</p>
                        <p className="leading-relaxed text-foreground">{page.recommendedEngagement.title}</p>
                      </div>

                      <Link
                        to={`/company/${page.slug}`}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground no-underline transition-opacity hover:opacity-90"
                      >
                        View page
                      </Link>
                    </div>

                    <div className="mt-6 border-t border-border pt-5">
                      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Potential hiring managers</p>
                          <p className="text-sm text-muted-foreground">LinkedIn lookup and pre-written email outreach tied to this proposal page.</p>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        {outreachContacts.map((contact) => (
                          <div key={`${page.slug}-${contact.name}`} className="rounded-2xl border border-border p-4">
                            <p className="font-display text-lg font-extrabold tracking-tight text-foreground">{contact.name}</p>
                            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{contact.title}</p>
                            {contact.selectionRationale ? (
                              <div className="mb-4 rounded-2xl bg-muted/40 p-3">
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Why selected</p>
                                <p className="m-0 text-sm leading-relaxed text-muted-foreground">{contact.selectionRationale}</p>
                              </div>
                            ) : null}
                            <div className="flex flex-col gap-2">
                              <a
                                href={contact.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-primary hover:text-primary"
                              >
                                LinkedIn
                              </a>
                              <a
                                href={buildEmailHref(page, contact)}
                                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground no-underline transition-opacity hover:opacity-90"
                              >
                                Draft email
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDirectoryPageAll;
