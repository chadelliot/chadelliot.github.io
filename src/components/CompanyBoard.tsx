import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  COMPANY_STAGE_LABELS,
  OUTREACH_MODEL_LABELS,
  OUTREACH_MODEL_BADGE_CLASS,
  type Company,
  type CompanyStage,
  type CompanySignal,
  type ProjectContact,
  type TeamMember,
} from "@/lib/projectContacts";
import { STAGE_ACCENT_COLOR } from "@/components/CompanyInfoCard";

const STAGE_ORDER: CompanyStage[] = ["new_signal", "meeting_scheduled", "closed_won", "closed_lost"];

const STAGE_COLUMN_CLASS: Record<CompanyStage, string> = {
  new_signal: "border-[#E2E8F0] bg-[#F8FAFC]",
  meeting_scheduled: "border-primary/30 bg-primary/5",
  closed_won: "border-[#BBF7D0] bg-[#F0FDF4]",
  closed_lost: "border-[#FECACA] bg-[#FEF2F2]",
};

const STAGE_HEADER_CLASS: Record<CompanyStage, string> = {
  new_signal: "text-[#334155]",
  meeting_scheduled: "text-primary",
  closed_won: "text-[#15803D]",
  closed_lost: "text-[#B91C1C]",
};

type CompanyBoardProps = {
  companies: Company[];
  contacts: ProjectContact[];
  signalsByCompanyId: Record<string, CompanySignal[]>;
  teamMembers: TeamMember[];
};

const CompanyBoard = ({ companies, contacts, signalsByCompanyId, teamMembers }: CompanyBoardProps) => {
  const [search, setSearch] = useState("");

  const contactCountsByCompanyId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const contact of contacts) {
      if (!contact.company_id) continue;
      counts[contact.company_id] = (counts[contact.company_id] ?? 0) + 1;
    }
    return counts;
  }, [contacts]);

  const repById = useMemo(() => Object.fromEntries(teamMembers.map((m) => [m.id, m])), [teamMembers]);

  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.trim().toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, search]);

  const companiesByStage = useMemo(() => {
    const grouped: Record<CompanyStage, Company[]> = { new_signal: [], meeting_scheduled: [], closed_won: [], closed_lost: [] };
    for (const company of filteredCompanies) {
      grouped[company.company_stage]?.push(company);
    }
    return grouped;
  }, [filteredCompanies]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Company board</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies…"
          className="h-9 w-64 max-w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {STAGE_ORDER.map((stage) => {
          const stageCompanies = companiesByStage[stage];
          return (
            <div key={stage} className={`rounded-xl border p-3 ${STAGE_COLUMN_CLASS[stage]}`}>
              <p className={`mb-3 text-[11px] font-bold uppercase tracking-[0.08em] ${STAGE_HEADER_CLASS[stage]}`}>
                {COMPANY_STAGE_LABELS[stage]} <span className="font-mono text-muted-foreground">({stageCompanies.length})</span>
              </p>
              <div className="grid gap-2">
                {stageCompanies.map((company) => {
                  const rep = company.assigned_rep ? repById[company.assigned_rep] : null;
                  const contactCount = contactCountsByCompanyId[company.id] ?? 0;
                  const companySignals = signalsByCompanyId[company.id] ?? [];
                  const topSignal = companySignals[0];
                  return (
                    <Link
                      key={company.id}
                      to={`/projects/company/${company.id}`}
                      className="block rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm shadow-sm transition-colors hover:border-primary hover:shadow-md"
                      style={{ borderLeft: `3px solid ${STAGE_ACCENT_COLOR[stage]}` }}
                    >
                      <p className="font-semibold text-foreground">{company.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                        <span>{contactCount} contact{contactCount === 1 ? "" : "s"}</span>
                        {companySignals.length > 0 ? <span className="rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-1.5 py-0.5 text-[#92400E]">{companySignals.length} signal{companySignals.length === 1 ? "" : "s"}</span> : null}
                        {topSignal?.outreach_model ? (
                          <span className={`rounded-full border px-1.5 py-0.5 ${OUTREACH_MODEL_BADGE_CLASS[topSignal.outreach_model]}`}>{OUTREACH_MODEL_LABELS[topSignal.outreach_model]}</span>
                        ) : null}
                        {rep ? <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5">{rep.name}</span> : <span className="text-muted-foreground/70">Unassigned</span>}
                      </div>
                      {company.company_stage === "closed_lost" && company.closed_lost_reason ? (
                        <p className="mt-1 truncate text-[11px] text-[#B91C1C]">{company.closed_lost_reason}</p>
                      ) : null}
                    </Link>
                  );
                })}
                {stageCompanies.length === 0 ? <p className="text-xs text-muted-foreground">No companies here.</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyBoard;
