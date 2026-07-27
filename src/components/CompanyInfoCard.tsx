import { useState } from "react";
import { Building2, Zap, Mail } from "lucide-react";
import {
  COMPANY_STAGE_LABELS,
  OUTREACH_MODEL_LABELS,
  OUTREACH_MODEL_BADGE_CLASS,
  OWNER_LEAD_TYPE_DOT_COLOR,
  OWNER_LEAD_TYPE_AVATAR_GRADIENT,
  DEFAULT_AVATAR_GRADIENT,
  getInitials,
  getClearbitLogoUrl,
  type Company,
  type CompanyResearchSummary,
  type CompanySignal,
  type OwnerLeadType,
} from "@/lib/projectContacts";

const STAGE_PILL_CLASS: Record<Company["company_stage"], string> = {
  new_signal: "bg-[#F1F0EC] text-[#5F5E5A]",
  opportunities_engaged: "bg-[#EFF6FF] text-[#1D4ED8]",
  meeting_scheduled: "bg-primary/10 text-primary",
  closed_won: "bg-[#EAF3DE] text-[#3B6D11]",
  closed_lost: "bg-[#FCEBEB] text-[#A32D2D]",
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
  // Owner-only. Undefined for Members - the caller only passes this on the
  // owner render path, and the underlying data never reaches a Member's
  // session in the first place (see fetchOwnerCompanyLeadFields), so this
  // is a belt-and-suspenders check, not the actual security boundary.
  ownerLeadType?: OwnerLeadType | null;
  ownerSignalCount?: number;
  // How many of this company's contacts have a known email address - shown
  // as a mail icon + count next to the company name instead of the old
  // unconditional "New Signal" pill, which just meant "hasn't been
  // contacted yet" and wasn't actually telling anyone anything useful at a
  // glance.
  emailContactCount?: number;
  // Derived from a contact's email domain (see getCompanyDomain) - not
  // guaranteed to exist or to resolve to an actual Clearbit logo, so this is
  // always a progressive enhancement over the initials chip, never a
  // replacement that could leave the avatar blank.
  logoDomain?: string | null;
};

// The company-level facts pulled from ChatGPT's account research - shown
// first, before any individual contact, so a rep orients on the company
// before working a person. No company logo or contact photo source exists
// today, so the avatar chip is initials-on-gradient rather than a photo -
// the gradient itself carries meaning (lead type) for Owners instead of
// being purely decorative.
const CompanyInfoCard = ({ company, research, signals, contactCount, engagedCount = 0, ownerLeadType, ownerSignalCount, emailContactCount = 0, logoDomain }: CompanyInfoCardProps) => {
  const topSignal = signals[0];
  const [gradientFrom, gradientTo] = ownerLeadType ? OWNER_LEAD_TYPE_AVATAR_GRADIENT[ownerLeadType] : DEFAULT_AVATAR_GRADIENT;
  // Clearbit doesn't have a logo for every domain (small/private companies
  // especially), and there's no way to know in advance - so this tries the
  // image and silently falls back to the initials-on-gradient chip the
  // instant it 404s, rather than showing a broken-image icon.
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(logoDomain) && !logoFailed;
  // "New Signal" just meant "hasn't been contacted yet," which every card
  // in this default view already is - not useful information next to the
  // name. A mail icon + count of contacts with a known email is a more
  // actionable at-a-glance signal, so it takes that slot instead. The
  // other stages (Meeting Scheduled, Closed Won, Closed Lost) are real
  // milestones worth flagging, so they still render as before.
  const showStagePill = company.company_stage !== "new_signal";

  return (
    <div className="border-b border-[#EEEDE7] bg-white px-4 py-4">
      <div className="flex items-start gap-3">
        {showLogo ? (
          <img
            src={getClearbitLogoUrl(logoDomain as string)}
            alt=""
            onError={() => setLogoFailed(true)}
            className="h-11 w-11 shrink-0 rounded-xl border border-[#EEEDE7] bg-white object-contain p-1.5"
          />
        ) : (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
          >
            {getInitials(company.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="font-display text-base font-semibold tracking-tight text-foreground">{company.name}</p>
            {showStagePill ? (
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${STAGE_PILL_CLASS[company.company_stage]}`}>
                {COMPANY_STAGE_LABELS[company.company_stage]}
              </span>
            ) : emailContactCount > 0 ? (
              <span title={`${emailContactCount} contact${emailContactCount === 1 ? "" : "s"} with an email on file`} className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-semibold text-[#1D4ED8]">
                <Mail size={10} />
                {emailContactCount}
              </span>
            ) : null}
          </div>

          {research.industry || research.sector ? (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 size={12} className="shrink-0" />
              {[research.industry, research.sector].filter(Boolean).join(" · ")}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {research.priority ? <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5F5E5A]">Priority {research.priority}</span> : null}
            {ownerLeadType ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F0EC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5F5E5A]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: OWNER_LEAD_TYPE_DOT_COLOR[ownerLeadType] }} />
                {ownerLeadType}
                {ownerSignalCount && ownerSignalCount > 1 ? ` · ${ownerSignalCount} signals` : ""}
              </span>
            ) : null}
            {signals.length > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FAEEDA] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#854F0B]">
                <Zap size={10} />
                {signals.length} open role{signals.length === 1 ? "" : "s"}
              </span>
            ) : null}
            {topSignal?.outreach_model ? (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${OUTREACH_MODEL_BADGE_CLASS[topSignal.outreach_model]}`}>{OUTREACH_MODEL_LABELS[topSignal.outreach_model]}</span>
            ) : null}
          </div>
        </div>

        <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
          {engagedCount > 0 ? `${engagedCount} of ${contactCount} engaged` : `${contactCount} contact${contactCount === 1 ? "" : "s"}`}
        </span>
      </div>
    </div>
  );
};

export default CompanyInfoCard;
