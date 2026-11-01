import { FileText, ExternalLink } from "lucide-react";
import { formatAnnualRevenue, type Company, type ProjectContact } from "@/lib/projectContacts";

// Business research and employer verification are different workflows.
// Only primary/current role verification should release an outreach hold.
const evidenceLinks = (raw?: string | null): string[] =>
  (raw ?? "").split(";").map((url) => url.trim()).filter((url) => /^https:\/\//i.test(url)).slice(0, 8);

export const hasContactResearch = (contact: ProjectContact): boolean =>
  Boolean(contact.research_checked_on && contact.research_business_model && contact.research_personalization_angle);

export const ResearchBrief = ({ contact, company }: { contact: ProjectContact; company?: Company | null }) => {
  const researched = hasContactResearch(contact);
  const sources = evidenceLinks(contact.research_evidence_urls);
  const hiringSources = evidenceLinks(contact.research_hiring_roles_sources);
  const uncertain = /low|conflict|unverified/i.test(contact.research_confidence ?? "") || contact.company === "Employer unconfirmed";
  const verifiedProfile = contact.profile_validation_status === "current" && Boolean(contact.linkedin_url);
  const revenueSourced = Boolean(company?.annual_revenue_source_url && (company?.annual_revenue_usd != null || company?.annual_revenue_display));
  const sourceBackedTrigger = Boolean(contact.outreach_angle && (sources.length || hiringSources.length));
  const fitHypothesis = Boolean(contact.research_personalization_angle || contact.value_hypothesis);
  const evidenceCoverage = [revenueSourced, sourceBackedTrigger, verifiedProfile, fitHypothesis].filter(Boolean).length;
  const accountChecks = [
    { label: "Commercial capacity · 25%", ready: revenueSourced, value: revenueSourced ? "Revenue sourced; actual budget unconfirmed" : "Verify revenue and ability to fund a retainer" },
    { label: "Business pressure · 25%", ready: sourceBackedTrigger, value: sourceBackedTrigger ? "Potential trigger recorded; validate significance" : "Find a dated, sourced business signal" },
    { label: "Decision-maker access · 20%", ready: verifiedProfile, value: verifiedProfile ? "Profile verified; buying authority still to confirm" : "Confirm profile, role and buying influence" },
    { label: "Solution fit · 20%", ready: fitHypothesis, value: fitHypothesis ? "Role-relevant hypothesis recorded; not validated by buyer" : "Develop an outcome-specific hypothesis" },
    { label: "Warm path · 10%", ready: false, value: "Look for genuine shared context or engagement" },
  ];

  return (
    <section aria-labelledby="contact-research" className="rounded-xl border border-rh-line bg-white p-4 text-[13px] text-rh-body">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 id="contact-research" className="flex items-center gap-2 font-semibold text-rh-ink">
          <FileText size={15} className="text-rh-muted" aria-hidden="true" />Company research
        </h3>
        <span className="text-xs text-rh-muted">{researched ? "Research on file" : "Not yet researched"}</span>
      </div>

      <div className="mb-4 rounded-lg border border-rh-line bg-rh-canvas p-3" aria-label="Outreach intelligence readiness">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-rh-ink">Outreach intelligence brief</p>
          <span className="text-xs text-rh-muted">{evidenceCoverage} of 5 factors have some evidence</span>
        </div>
        <p className="mb-2 text-xs text-rh-muted">Evidence readiness, not a lead score or a prediction of purchase. Commercial conflicts and opt-outs remain hard stops.</p>
        <ul className="space-y-2">
          {accountChecks.map((check) => (
            <li key={check.label} className="flex items-start gap-2 text-xs leading-relaxed">
              <span aria-hidden="true" className={check.ready ? "text-rh-teal" : "text-rh-muted"}>{check.ready ? "✓" : "○"}</span>
              <span><strong className="text-rh-ink">{check.label}</strong><span className="text-rh-muted"> · {check.value}</span></span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-rh-line pt-3 text-xs leading-relaxed">
          <p><span className="font-semibold text-rh-ink">Company revenue:</span> {formatAnnualRevenue(company)}{company?.annual_revenue_basis ? " · " + company.annual_revenue_basis : ""}</p>
          {company?.annual_revenue_source_url && /^https:\/\//i.test(company.annual_revenue_source_url) ? (
            <a href={company.annual_revenue_source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-rh-teal hover:underline">Revenue evidence <ExternalLink size={11} aria-hidden="true" /></a>
          ) : null}
          {contact.outreach_angle ? <p className="mt-2"><strong className="text-rh-ink">Reason to reach out:</strong> {contact.outreach_angle}</p> : null}
          {contact.value_hypothesis ? <p className="mt-2"><strong className="text-rh-ink">Commercial hypothesis:</strong> {contact.value_hypothesis} <span className="text-rh-muted">(validate before claiming)</span></p> : null}
          <p className="mt-2 text-rh-muted">Invitation approach: use a short contextual note only when genuine shared context or a sourced trigger supports it; otherwise consider a blank invitation.</p>
          <p className="mt-2 font-medium text-rh-ink">Every invitation and message requires Chad's explicit review before sending.</p>
        </div>
      </div>

      {researched ? (
        <div className="space-y-3 leading-relaxed">
          <div>
            <p className="mb-0.5 text-xs font-medium text-rh-muted">How the business works</p>
            <p>{contact.research_business_model}</p>
          </div>
          {contact.research_personalization_angle ? (
            <div>
              <p className="mb-0.5 text-xs font-medium text-rh-muted">Why RevHub could be relevant</p>
              <p>{contact.research_personalization_angle}</p>
            </div>
          ) : null}
          {contact.research_discovery_question ? (
            <div>
              <p className="mb-0.5 text-xs font-medium text-rh-muted">Question worth asking</p>
              <p>{contact.research_discovery_question}</p>
            </div>
          ) : null}
          {uncertain ? (
            <p className="text-xs text-rh-muted">Some contact or company details still need confirmation before outreach.</p>
          ) : null}
          <details className="border-t border-rh-line pt-2">
            <summary className="cursor-pointer select-none text-xs font-medium text-rh-teal hover:underline">Sources and additional research</summary>
            <div className="mt-3 space-y-3 text-xs">
              {contact.research_fit_type ? <p><span className="font-medium">Opportunity type:</span> {contact.research_fit_type}</p> : null}
              {contact.research_checked_on ? <p><span className="font-medium">Researched:</span> {contact.research_checked_on}</p> : null}
              {contact.research_confidence ? <p><span className="font-medium">Confidence:</span> {contact.research_confidence}</p> : null}
              {sources.length ? (
                <div>
                  <p className="mb-1 font-medium">Sources</p>
                  <ul className="space-y-1">
                    {sources.map((url, index) => (
                      <li key={url}><a className="inline-flex items-center gap-1 break-all text-rh-teal hover:underline" href={url} target="_blank" rel="noopener noreferrer">Research source {index + 1}<ExternalLink size={11} aria-hidden="true" /></a></li>
                    ))}
                  </ul>
                </div>
              ) : <p>Research notes are on file; no public source URL is available for this record.</p>}
              {contact.research_suggested_followup ? (
                <div>
                  <p className="mb-1 font-medium">Suggested follow-up (draft, not sent)</p>
                  <p className="whitespace-pre-wrap rounded-lg bg-rh-canvas p-3 leading-relaxed">{contact.research_suggested_followup}</p>
                </div>
              ) : null}
            </div>
          </details>
        </div>
      ) : (
        <p className="text-rh-muted">We haven't saved a company research brief for this contact yet. Research the company, the person's role, and any actual job openings before drafting a follow-up.</p>
      )}

      {contact.research_hiring_roles_checked_on ? (
        <div className="mt-3 border-t border-rh-line pt-3">
          <p className="mb-1 text-xs font-medium text-rh-muted">Hiring research · {contact.research_hiring_roles_checked_on}</p>
          <p>{contact.research_hiring_roles_summary || "Open roles were checked, but no findings were recorded."}</p>
          {hiringSources.length ? <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">{hiringSources.map((url, i) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-rh-teal hover:underline">Job source {i + 1}</a>)}</div> : null}
        </div>
      ) : contact.linkedin_hiring_badge_visible ? (
        <p className="mt-3 border-t border-rh-line pt-2 text-xs text-rh-muted">The LinkedIn #Hiring badge was seen, but specific openings have not been verified.</p>
      ) : null}

      {researched ? (
        <p className="mt-3 text-xs text-rh-muted">Company research is separate from verifying this person's current employer and role.</p>
      ) : null}
    </section>
  );
};

export default ResearchBrief;
