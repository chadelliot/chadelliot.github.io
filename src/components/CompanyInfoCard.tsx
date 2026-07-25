import {
  COMPANY_STAGE_LABELS,
  OUTREACH_MODEL_LABELS,
  OUTREACH_MODEL_BADGE_CLASS,
  type Company,
  type CompanyResearchSummary,
  type CompanySignal,
} from "@/lib/projectContacts";

const STAGE_BADGE_CLASS: Record<Company["company_stage"], string> = {
  new_signal: "border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]",
  meeting_scheduled: "border-primary/30 bg-primary/5 text-primary",
  closed_won: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
  closed_lost: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
};

type CompanyInfoCardProps = {
  company: Company;
  research: CompanyResearchSummary;
  signals: CompanySignal[];
  contactCount: number;
  // Contacts with any status update beyond "not contacted" (including
  // do-not-contact) - lets the header show real engagement, not just a
  // headcount.
  engagedCount?: number;
};

// The company-level facts pulled from ChatGPT's account research - shown
// first, before any individual contact, so a rep orients on the company
// before working a person.
const CompanyInfoCard = ({ company, research, signals, contactCount, engagedCount = 0 }: CompanyInfoCardProps) => {
  const topSignal = signals[0];

  return (
    <div className="border-b border-[#E2E8F0] bg-black px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-display text-lg font-extrabold tracking-tight text-white">{company.name}</p>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${STAGE_BADGE_CLASS[company.company_stage]}`}>
          {COMPANY_STAGE_LABELS[company.company_stage]}
        </span>
        {research.priority ? <span className="rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Priority {research.priority}</span> : null}
        {signals.length > 0 ? <span className="rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#92400E]">{signals.length} open role{signals.length === 1 ? "" : "s"}</span> : null}
        {topSignal?.outreach_model ? (
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${OUTREACH_MODEL_BADGE_CLASS[topSignal.outreach_model]}`}>{OUTREACH_MODEL_LABELS[topSignal.outreach_model]}</span>
        ) : null}
        <span className="ml-auto text-xs text-white/60">
          {engagedCount > 0 ? `${engagedCount} of ${contactCount} contacts engaged` : `${contactCount} contact${contactCount === 1 ? "" : "s"}`}
        </span>
      </div>

      {research.industry || research.sector ? (
        <p className="mt-1.5 text-sm text-white/60">
          {[research.industry, research.sector].filter(Boolean).join(" · ")}
        </p>
      ) : null}
    </div>
  );
};

export default CompanyInfoCard;
