import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyDirectoryPageV8 from "./CompanyDirectoryPageV8";

type AuthMode = "login" | "signup";
type ProposalSession = { access_token: string; user: { id: string; email?: string } };

const SESSION_STORAGE_KEY = "aboutchad_proposal_directory_session_v1";
const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;
const IS_DB_READY = Boolean(DB_URL && DB_PUBLIC);

const JOB_POSTING_URLS_BY_ROLE_TITLE: Record<string, string> = {
  "Fractional Head of Marketing Operations & Planning": "https://www.gofractional.com/job/greenhouse-head-of-marketing-operations-planning-12-month-contract",
  "Interim Senior Growth Marketing Manager": "https://www.gofractional.com/job/welcometothejungle-interim-senior-growth-marketing-manager-attest",
  "Interim Business Manager Revenue": "https://www.gofractional.com/job/greenhouse-business-manager-revenue-one-year-fixed-term-contract-m-f-d",
};

const buildLinkedInSearchUrl = (companyName: string) =>
  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${companyName} marketing revenue operations leader`)}`;

const readApiJson = async <T,>(response: Response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || data?.msg || data?.error_description || "Authentication failed.");
  return data as T;
};

const getStoredSession = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ProposalSession) : null;
  } catch {
    return null;
  }
};

const saveStoredSession = (session: ProposalSession) => window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
const clearStoredSession = () => window.localStorage.removeItem(SESSION_STORAGE_KEY);

const signIn = async (email: string, password: string) => {
  const response = await fetch(`${DB_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: DB_PUBLIC || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const session = await readApiJson<ProposalSession>(response);
  saveStoredSession(session);
  return session;
};

const signUp = async (email: string, password: string) => {
  const response = await fetch(`${DB_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: DB_PUBLIC || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const session = await readApiJson<ProposalSession>(response);
  if (session?.access_token) saveStoredSession(session);
  return session;
};

const CompanyDirectoryPageV9 = () => {
  const [session, setSession] = useState<ProposalSession | null>(() => getStoredSession());
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fixDirectoryActions = () => {
      document.querySelectorAll<HTMLElement>(".proposal-directory-page article").forEach((article) => {
        const header = article.firstElementChild as HTMLElement | null;
        const companyName = article.querySelector("h3")?.textContent?.trim();
        const actionContainer = header?.lastElementChild as HTMLElement | null;

        if (!companyName || !actionContainer) return;

        actionContainer.classList.add("directory-card-actions");

        const allFindLeaderLinks = Array.from(
          article.querySelectorAll<HTMLAnchorElement>('a[href*="linkedin.com/search/results/people"]')
        );

        allFindLeaderLinks.forEach((link, index) => {
          if (index === 0) {
            link.classList.add("directory-find-leaders-link");
            link.dataset.directoryFindLeaders = "true";
            link.href = buildLinkedInSearchUrl(companyName);
            if (link.parentElement !== actionContainer) actionContainer.prepend(link);
          } else {
            link.remove();
          }
        });

        if (!actionContainer.querySelector('a[data-directory-find-leaders="true"]')) {
          const findLeadersLink = document.createElement("a");
          findLeadersLink.href = buildLinkedInSearchUrl(companyName);
          findLeadersLink.target = "_blank";
          findLeadersLink.rel = "noreferrer";
          findLeadersLink.textContent = "Find leaders";
          findLeadersLink.dataset.directoryFindLeaders = "true";
          findLeadersLink.className = "directory-find-leaders-link inline-flex items-center justify-center rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0F172A] no-underline transition-colors hover:border-primary hover:text-primary";
          actionContainer.prepend(findLeadersLink);
        }
      });
    };

    const getJobPostingUrlFromArticle = (article: HTMLElement) => {
      const postedRoleLabel = Array.from(article.querySelectorAll<HTMLElement>("p")).find(
        (element) => element.textContent?.trim().toLowerCase() === "posted role"
      );
      const roleElement = postedRoleLabel?.nextElementSibling as HTMLElement | null;
      const roleTitle = roleElement?.textContent?.trim() || "";
      return JOB_POSTING_URLS_BY_ROLE_TITLE[roleTitle];
    };

    const linkPostedRoles = () => {
      document.querySelectorAll<HTMLElement>(".proposal-directory-page article").forEach((article) => {
        const postedRoleLabel = Array.from(article.querySelectorAll<HTMLElement>("p")).find(
          (element) => element.textContent?.trim().toLowerCase() === "posted role"
        );
        const roleElement = postedRoleLabel?.nextElementSibling as HTMLElement | null;
        if (!roleElement || roleElement.tagName.toLowerCase() === "a") return;

        const roleTitle = roleElement.textContent?.trim() || "";
        const jobPostingUrl = JOB_POSTING_URLS_BY_ROLE_TITLE[roleTitle];
        if (!jobPostingUrl) return;

        const roleLink = document.createElement("a");
        roleLink.href = jobPostingUrl;
        roleLink.target = "_blank";
        roleLink.rel = "noreferrer";
        roleLink.textContent = roleTitle;
        roleLink.className = `${roleElement.className} directory-posted-role-link underline-offset-4 transition-colors hover:text-primary hover:underline`;
        roleElement.replaceWith(roleLink);
      });
    };

    const linkCompanyNames = () => {
      document.querySelectorAll<HTMLElement>(".proposal-directory-page article").forEach((article) => {
        const companyHeading = article.querySelector<HTMLHeadingElement>("h3");
        const companyName = companyHeading?.textContent?.trim() || "";
        const jobPostingUrl = getJobPostingUrlFromArticle(article);
        if (!companyHeading || !companyName || !jobPostingUrl) return;

        const existingLink = companyHeading.querySelector<HTMLAnchorElement>('a[data-directory-company-job-link="true"]');
        if (existingLink) {
          existingLink.href = jobPostingUrl;
          return;
        }

        companyHeading.textContent = "";
        const companyLink = document.createElement("a");
        companyLink.href = jobPostingUrl;
        companyLink.target = "_blank";
        companyLink.rel = "noreferrer";
        companyLink.textContent = companyName;
        companyLink.dataset.directoryCompanyJobLink = "true";
        companyLink.className = "directory-company-job-link no-underline transition-colors hover:text-primary hover:underline";
        companyHeading.appendChild(companyLink);
      });
    };

    const enhanceDirectory = () => {
      fixDirectoryActions();
      linkPostedRoles();
      linkCompanyNames();
    };

    enhanceDirectory();
    const observer = new MutationObserver(enhanceDirectory);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [session]);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const requestedAuthMode = (submitter?.dataset.authMode as AuthMode | undefined) ?? authMode;
    setAuthMode(requestedAuthMode);
    setIsAuthLoading(true);
    setAuthMessage("");

    try {
      const nextSession = requestedAuthMode === "signup" ? await signUp(authEmail, authPassword) : await signIn(authEmail, authPassword);
      if (nextSession?.access_token) {
        setSession(nextSession);
        setAuthMessage(requestedAuthMode === "signup" ? "Account created. You are signed in." : "Signed in.");
      } else {
        setAuthMessage("Account created. Check your email if confirmation is required before access.");
      }
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    clearStoredSession();
    setSession(null);
    setAuthEmail("");
    setAuthPassword("");
    setAuthMessage("");
  };

  if (!IS_DB_READY) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="px-6 pb-20 pt-32 md:px-20 md:pt-40">
          <section className="mx-auto max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Proposal directory access</p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">Login is not configured.</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">The Supabase proposal directory environment variables are missing from this build, so the private directory is locked until they are restored.</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="px-6 pb-20 pt-32 md:px-20 md:pt-40">
          <section className="mx-auto max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Proposal directory access</p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">{authMode === "signup" ? "Create your account." : "Sign in to continue."}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Create your account or sign in to view the private proposal page library and save contacted statuses.</p>
            <form onSubmit={handleAuthSubmit} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Email
                <input type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} required className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary" autoComplete="email" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Password
                <input type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} required minLength={6} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary" autoComplete={authMode === "signup" ? "new-password" : "current-password"} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="submit" data-auth-mode="signup" disabled={isAuthLoading} className={`rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-colors disabled:opacity-50 ${authMode === "signup" ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary hover:text-primary"}`}>Sign up</button>
                <button type="submit" data-auth-mode="login" disabled={isAuthLoading} className={`rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-colors disabled:opacity-50 ${authMode === "login" ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary hover:text-primary"}`}>Sign in</button>
              </div>
            </form>
            {authMessage ? <p className="mt-4 rounded-2xl border border-border p-4 text-sm leading-relaxed text-muted-foreground">{authMessage}</p> : null}
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <style>{`
        .proposal-directory-page article > div:first-child {
          align-items: center !important;
        }

        .proposal-directory-page .directory-card-actions {
          display: grid !important;
          grid-template-columns: max-content max-content !important;
          grid-auto-rows: max-content !important;
          align-items: center !important;
          align-self: center !important;
          justify-content: end !important;
          column-gap: 12px !important;
          row-gap: 10px !important;
          padding: 10px 4px !important;
          background: #ffffff !important;
          min-width: max-content !important;
        }

        .proposal-directory-page .directory-card-actions .directory-find-leaders-link {
          grid-column: 1 / -1 !important;
          justify-self: end !important;
          white-space: nowrap !important;
        }

        .proposal-directory-page .directory-card-actions > a:not(.directory-find-leaders-link),
        .proposal-directory-page .directory-card-actions > button {
          white-space: nowrap !important;
          width: auto !important;
          min-width: 112px !important;
          grid-row: 2 !important;
        }

        .proposal-directory-page .directory-posted-role-link,
        .proposal-directory-page .directory-company-job-link {
          display: inline-block !important;
          color: inherit !important;
          text-decoration: none;
        }

        .proposal-directory-page .directory-posted-role-link:hover,
        .proposal-directory-page .directory-company-job-link:hover {
          color: hsl(var(--primary)) !important;
          text-decoration: underline;
        }

        @media (max-width: 767px) {
          .proposal-directory-page .directory-card-actions {
            justify-content: start !important;
            min-width: 0 !important;
            width: 100% !important;
          }

          .proposal-directory-page .directory-card-actions .directory-find-leaders-link {
            justify-self: start !important;
          }
        }
      `}</style>
      <CompanyDirectoryPageV8 />
      <button type="button" onClick={handleSignOut} className="fixed bottom-5 right-5 z-[100] rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155] shadow-sm transition-colors hover:border-primary hover:text-primary">Sign out</button>
    </>
  );
};

export default CompanyDirectoryPageV9;
