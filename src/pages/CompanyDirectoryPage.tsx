import { type FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { companyLandingPages } from "@/data/companyLandingPages";

const COMPANY_DIRECTORY_PASSWORD = "CP634841!";
const COMPANY_DIRECTORY_AUTH_KEY = "company-directory-authenticated";

const CompanyDirectoryPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(COMPANY_DIRECTORY_AUTH_KEY) === "true";
  });

  const pages = useMemo(
    () =>
      Object.values(companyLandingPages).sort((a, b) =>
        a.companyName.localeCompare(b.companyName),
      ),
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === COMPANY_DIRECTORY_PASSWORD) {
      window.sessionStorage.setItem(COMPANY_DIRECTORY_AUTH_KEY, "true");
      setIsAuthenticated(true);
      setError("");
      return;
    }

    setError("Incorrect password. Please try again.");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(COMPANY_DIRECTORY_AUTH_KEY);
    setIsAuthenticated(false);
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="px-6 md:px-20 pt-32 md:pt-36 pb-20">
          <section className="mx-auto max-w-xl rounded-[2rem] border border-border bg-background p-6 md:p-8 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Company directory</p>
            <h1 className="mb-4 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Proposal pages are protected.
            </h1>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              Enter the directory password to view links to the company-specific proposal pages created over time.
            </p>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-base font-normal outline-none transition-colors focus:border-primary"
                  autoComplete="current-password"
                />
              </label>
              {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Unlock directory
              </button>
            </form>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

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
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Lock directory
            </button>
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
              {pages.map((page) => (
                <article key={page.slug} className="rounded-[1.5rem] border border-border bg-background p-5 transition-colors hover:border-primary md:p-6">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto] lg:items-center">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                          {page.companyName}
                        </h3>
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

export default CompanyDirectoryPage;
