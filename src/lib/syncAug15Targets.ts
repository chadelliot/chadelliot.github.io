import { getStoredProposalSession, refreshProposalSessionIfNeeded, type ProposalSession } from "./companyStatus";
import { fetchTeamMembers } from "./projectContacts";

const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;

const SYNC_MARKER = "aboutchad_revhub_aug15_sync_v1";
const RELOAD_MARKER = "aboutchad_revhub_aug15_sync_reloaded_v1";
const SOURCE_URL = "/data/revhub-targets-2026-08-15.json";

const QXO_REVIEW_COMPANIES = new Set([
  "MYR Group",
  "IES Holdings",
  "Centuri Holdings",
  "Sterling Infrastructure",
]);

type SourceAccount = Record<string, string>;
type SourceContact = Record<string, string>;
type SourcePayload = {
  batch: string;
  companies: string[];
  accounts: SourceAccount[];
  contacts: SourceContact[];
};

type DbCompany = {
  id: string;
  name: string;
  normalized_name?: string | null;
};

type DbContact = {
  id: string;
  company: string;
  company_id?: string | null;
  contact_name?: string | null;
  linkedin_url?: string | null;
  target_type_raw?: string | null;
  title?: string | null;
};

const canonical = (value = "") =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const normalizedLinkedIn = (value = "") =>
  value.trim().toLowerCase().replace(/[?#].*$/, "").replace(/\/+$/, "");

const authHeaders = (session: ProposalSession) => ({
  apikey: DB_PUBLIC || "",
  Authorization: `Bearer ${session.access_token}`,
  "Content-Type": "application/json",
});

const dbFetch = async <T>(session: ProposalSession, path: string, options: RequestInit = {}): Promise<T> => {
  if (!DB_URL) throw new Error("Projects database URL is not configured.");
  const response = await fetch(`${DB_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...authHeaders(session),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Projects sync failed (${response.status}): ${text}`);
  return (text ? JSON.parse(text) : null) as T;
};

const fetchAll = async <T>(session: ProposalSession, table: string, select: string): Promise<T[]> => {
  const results: T[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const page = await dbFetch<T[]>(
      session,
      `${table}?select=${encodeURIComponent(select)}&offset=${offset}&limit=${pageSize}`
    );
    results.push(...page);
    if (page.length < pageSize) return results;
  }
};

const loadSource = async (): Promise<SourcePayload> => {
  const response = await fetch(SOURCE_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load RevHub target source (${response.status}).`);
  const source = (await response.json()) as SourcePayload;
  if (source.batch !== "2026-08-15" || source.accounts?.length !== 50 || source.contacts?.length !== 150) {
    throw new Error("RevHub target source failed validation.");
  }
  return source;
};

const resolveOwnerSession = async (): Promise<ProposalSession | null> => {
  const stored = getStoredProposalSession();
  if (!stored) return null;
  const session = await refreshProposalSessionIfNeeded(stored);
  if (!session) return null;

  const members = await fetchTeamMembers(session);
  const email = session.user.email?.trim().toLowerCase();
  const member = members.find((candidate) => candidate.email?.trim().toLowerCase() === email);
  return member?.role === "owner" ? session : null;
};

const syncCompanies = async (
  session: ProposalSession,
  accounts: SourceAccount[]
): Promise<Map<string, DbCompany>> => {
  let companies = await fetchAll<DbCompany>(session, "companies", "id,name,normalized_name");
  const byKey = new Map<string, DbCompany>();
  for (const company of companies) {
    byKey.set(canonical(company.name), company);
    if (company.normalized_name) byKey.set(canonical(company.normalized_name), company);
  }

  for (const row of accounts) {
    const key = canonical(row.Company);
    let company = byKey.get(key);
    const sourceFields = {
      name: row.Company.trim(),
      industry: row["Industry Logged"]?.trim() || null,
      sector: row["Sector / Sub-Industry"]?.trim() || null,
      website: row["Source URL"]?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (!company) {
      const created = await dbFetch<DbCompany[]>(session, "companies?select=id,name,normalized_name", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          ...sourceFields,
          normalized_name: row.Company.trim().toLowerCase(),
        }),
      });
      company = created[0];
    } else {
      const updated = await dbFetch<DbCompany[]>(
        session,
        `companies?id=eq.${encodeURIComponent(company.id)}&select=id,name,normalized_name`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(sourceFields),
        }
      );
      company = updated[0] || company;
    }

    if (!company) throw new Error(`Could not persist ${row.Company}.`);
    byKey.set(key, company);
    byKey.set(canonical(company.name), company);
    if (company.normalized_name) byKey.set(canonical(company.normalized_name), company);
  }

  companies = await fetchAll<DbCompany>(session, "companies", "id,name,normalized_name");
  const verified = new Map<string, DbCompany>();
  for (const company of companies) {
    verified.set(canonical(company.name), company);
    if (company.normalized_name) verified.set(canonical(company.normalized_name), company);
  }
  return verified;
};

const syncContacts = async (
  session: ProposalSession,
  contactsSource: SourceContact[],
  companyByKey: Map<string, DbCompany>
) => {
  let contacts = await fetchAll<DbContact>(
    session,
    "project_contacts",
    "id,company,company_id,contact_name,linkedin_url,target_type_raw,title"
  );

  const byLinkedIn = new Map<string, DbContact>();
  const byCompanyName = new Map<string, DbContact>();
  for (const contact of contacts) {
    if (contact.linkedin_url) byLinkedIn.set(normalizedLinkedIn(contact.linkedin_url), contact);
    byCompanyName.set(`${canonical(contact.company)}::${canonical(contact.contact_name || "")}`, contact);
  }

  for (const row of contactsSource) {
    const company = companyByKey.get(canonical(row.Company));
    if (!company) throw new Error(`Could not resolve company for ${row.Company}.`);

    const linkedinKey = normalizedLinkedIn(row["LinkedIn URL / Search"] || "");
    const nameKey = `${canonical(row.Company)}::${canonical(row["Contact Name"] || "")}`;
    let contact = byLinkedIn.get(linkedinKey) || byCompanyName.get(nameKey);
    const qxoReview = QXO_REVIEW_COMPANIES.has(row.Company.trim());
    const legacyStatusNotes = [
      qxoReview ? "Needs Review for QXO adjacency before outreach." : "",
      row["Source / Validation"]?.trim(),
      row.Status?.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    const sourceFields = {
      company: row.Company.trim(),
      company_id: company.id,
      industry: row["Industry Logged"]?.trim() || null,
      sector: row["Sector / Sub-Industry"]?.trim() || null,
      contact_name: row["Contact Name"]?.trim() || null,
      title: row.Title?.trim() || null,
      linkedin_url: row["LinkedIn URL / Search"]?.trim() || null,
      priority: row.Priority?.trim() || null,
      target_type_raw: row["Target Slot"]?.trim() || null,
      outreach_angle: row["Outreach Angle"]?.trim() || null,
      value_hypothesis: row["Value Hypothesis"]?.trim() || null,
      stakeholder_selection_reason: row.Notes?.trim() || null,
      legacy_status_notes: legacyStatusNotes || null,
      linkedin_connect_message: row["LinkedIn Connect Message"]?.trim() || null,
      intro_message: row["Intro Message"]?.trim() || null,
      follow_up_message: row["Follow-up Message"]?.trim() || null,
    };

    if (!contact) {
      const created = await dbFetch<DbContact[]>(
        session,
        "project_contacts?select=id,company,company_id,contact_name,linkedin_url,target_type_raw,title",
        {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({ ...sourceFields, needs_research: qxoReview, do_not_contact: false }),
        }
      );
      contact = created[0];
    } else {
      const updated = await dbFetch<DbContact[]>(
        session,
        `project_contacts?id=eq.${encodeURIComponent(contact.id)}&select=id,company,company_id,contact_name,linkedin_url,target_type_raw,title`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(qxoReview ? { ...sourceFields, needs_research: true } : sourceFields),
        }
      );
      contact = updated[0] || contact;
    }

    if (!contact) throw new Error(`Could not persist ${row.Company}: ${row["Contact Name"]}.`);
    if (linkedinKey) byLinkedIn.set(linkedinKey, contact);
    byCompanyName.set(nameKey, contact);
  }

  contacts = await fetchAll<DbContact>(
    session,
    "project_contacts",
    "id,company,company_id,contact_name,linkedin_url,target_type_raw,title"
  );
  return contacts;
};

const verify = (source: SourcePayload, companyByKey: Map<string, DbCompany>, contacts: DbContact[]) => {
  const missingCompanies = source.companies.filter((name) => !companyByKey.has(canonical(name)));
  if (missingCompanies.length) throw new Error(`Missing synced companies: ${missingCompanies.join(", ")}`);

  let matched = 0;
  const missingContacts: string[] = [];
  for (const sourceContact of source.contacts) {
    const linkedinKey = normalizedLinkedIn(sourceContact["LinkedIn URL / Search"] || "");
    const match = contacts.find(
      (contact) =>
        (linkedinKey && normalizedLinkedIn(contact.linkedin_url || "") === linkedinKey) ||
        (canonical(contact.company) === canonical(sourceContact.Company) &&
          canonical(contact.contact_name || "") === canonical(sourceContact["Contact Name"] || ""))
    );
    if (match) matched++;
    else missingContacts.push(`${sourceContact.Company}: ${sourceContact["Contact Name"]}`);
  }

  if (matched !== 150) throw new Error(`Only ${matched}/150 RevHub contacts verified. ${missingContacts.join("; ")}`);
};

let running: Promise<void> | null = null;

export const syncAug15Targets = async (): Promise<void> => {
  if (typeof window === "undefined" || window.localStorage.getItem(SYNC_MARKER) === "done") return;
  if (running) return running;

  running = (async () => {
    try {
      const session = await resolveOwnerSession();
      if (!session) return;

      const source = await loadSource();
      const companies = await syncCompanies(session, source.accounts);
      const contacts = await syncContacts(session, source.contacts, companies);
      verify(source, companies, contacts);

      window.localStorage.setItem(SYNC_MARKER, "done");
      window.dispatchEvent(
        new CustomEvent("revhub-projects-synced", {
          detail: { companies: 50, contacts: 150, batch: "2026-08-15" },
        })
      );

      if (window.sessionStorage.getItem(RELOAD_MARKER) !== "done") {
        window.sessionStorage.setItem(RELOAD_MARKER, "done");
        window.location.reload();
      }
    } catch (error) {
      console.error("RevHub Aug 15 projects sync did not complete:", error);
    }
  })().finally(() => {
    running = null;
  });

  return running;
};
