import { FormEvent, ReactNode, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AUTH_KEY = "aboutchad_company_directory_authenticated_v2";
const DIRECTORY_PASSWORD = import.meta.env.VITE_COMPANY_DIRECTORY_PASSWORD as string | undefined;

const CompanyDirectoryGate = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(AUTH_KEY) === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!DIRECTORY_PASSWORD) {
      setError("Directory password is not configured yet.");
      return;
    }

    if (password === DIRECTORY_PASSWORD) {
      window.sessionStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      setError("");
      return;
    }

    setError("Incorrect password. Please try again.");
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-6 pb-20 pt-32 md:px-20 md:pt-40">
        <section className="mx-auto max-w-xl rounded-[2rem] border border-border bg-background p-7 shadow-sm md:p-9">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Proposal directory access</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">Sign in to continue.</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Enter the directory password to view the private proposal page library.</p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary" autoComplete="current-password" />
            </label>
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
            <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">Unlock directory</button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDirectoryGate;
export { AUTH_KEY };
