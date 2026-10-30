import { FileText, ExternalLink } from "lucide-react";
import type { ProjectContact } from "@/lib/projectContacts";

// Business research and employer verification are different workflows.
// Only primary/current role verification should release an outreach hold.
const evidenceLinks = (raw?: string | null): string[] =>
  (raw ?? "").split(";").map((url) => url.trim()).filter((url) => /^https:\/\//i.test(url)).slice(0, 8);

export const hasContactResearch = (contact: ProjectContact): boolean =>
  Boolean(contact.research_checked_on && contact.research_business_model && contact.research_personalization_angle);

export const ResearchBrief = ({ contact }: { contact: ProjectContact }) => {
  const researched = hasContactResearch(contact);
  const sources = evidenceLinks(contact.research_evidence_urls);
  const hiringSources = evidenceLinks(contact.research_hiring_roles_sources);
  const uncertain = /low|conflict|unverified/i.test(contact.research_confidence ?? "") || contact.company === "Employer unconfirmed";

  return (
    <section aria-labelledby="contact-research" className="rounded-xl border border-rh-line bg-white p-4 text-[13px] text-rh-body">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 id="contact-research" className="flex items-center gap-2 font-semibold text-rh-ink">
          <FileText size={15} className="text-rh-muted" aria-hidden="true" />Company research
        </h3>
        <span className="text-xs text-rh-muted">{researched ? "Research on file" : "Not yet researched"}</span>
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
