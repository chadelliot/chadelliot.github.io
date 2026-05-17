import { useMemo, useState } from "react";
import { proposalOutreachResearch, type ProposalOutreachResearchContact } from "@/data/proposalOutreachResearch";
import type { CompanyLandingPage } from "@/data/companyLandingPages";

type SocialContact = Pick<ProposalOutreachResearchContact, "name" | "title" | "linkedinUrl"> & Partial<ProposalOutreachResearchContact>;

const getContacts = (page: CompanyLandingPage): SocialContact[] => {
  const researchContacts = proposalOutreachResearch[page.slug]?.contacts ?? [];
  const pageContacts = (page.outreachContacts ?? []).map((contact) => ({
    name: contact.name,
    title: contact.title,
    linkedinUrl: contact.linkedinUrl,
    selectionRationale: contact.selectionRationale,
    relationshipToOpportunity: contact.selectionRationale || "Previously researched outreach contact.",
    confidence: "medium" as const,
    outreachTone: "Use a concise, professional note that references the role and asks whether they are the right contact or can point you to the right person.",
    suggestedAngle: page.outreachAngle,
  }));

  const deduped = new Map<string, SocialContact>();
  [...researchContacts, ...pageContacts]
    .filter((contact) => contact.name && contact.title && contact.linkedinUrl)
    .forEach((contact) => {
      const key = `${contact.linkedinUrl || contact.name}`.toLowerCase();
      if (!deduped.has(key)) deduped.set(key, contact);
    });

  return Array.from(deduped.values());
};

const buildDraft = (contact: SocialContact, page: CompanyLandingPage) => {
  const firstName = contact.name.split(" ")[0] || contact.name;
  const roleTitle = proposalOutreachResearch[page.slug]?.opportunityTitle || page.recommendedEngagement.title;
  const relationship = `${contact.relationshipToOpportunity || ""} ${contact.selectionRationale || ""}`.toLowerCase();
  const isDirect = /direct|executive sponsor|cro|head of revenue operations|head of marketing operations|functional partner/.test(relationship);
  const isAdjacent = /adjacent|influencer|stakeholder|possible|not necessarily/.test(relationship);

  const opening = isDirect
    ? `I saw the ${roleTitle} opportunity with ${page.companyName} and wanted to reach out directly given your role as ${contact.title}.`
    : isAdjacent
      ? `I saw the ${roleTitle} opportunity with ${page.companyName}. I’m not sure whether you own this conversation, but given your role as ${contact.title}, I thought you may have useful context or be able to point me in the right direction.`
      : `I saw the ${roleTitle} opportunity with ${page.companyName} and wanted to reach out in case you are connected to the team evaluating the role.`;

  return [
    `Hi ${firstName},`,
    "",
    opening,
    "",
    "By way of background, I’m Chad Parker. I build revenue, lifecycle, marketing operations, CRM/CDP, segmentation, and executive reporting systems that help teams turn GTM strategy into measurable execution.",
    "",
    contact.suggestedAngle || page.outreachAngle,
    "",
    "If you’re the right person to discuss this, I’d welcome the chance to connect. If not, I’d appreciate any direction on who owns the conversation internally.",
    "",
    "Best,",
    "Chad",
  ].join("\n");
};

const ProposalSocialOutreach = ({ page }: { page: CompanyLandingPage }) => {
  const contacts = useMemo(() => getContacts(page), [page]);
  const [selectedContact, setSelectedContact] = useState<SocialContact | null>(null);
  const [copyStatus, setCopyStatus] = useState("Copy message");
  const draft = selectedContact ? buildDraft(selectedContact, page) : "";

  if (!contacts.length) return null;

  const copyDraft = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Select and copy text");
    }
  };

  const openDraft = (contact: SocialContact) => {
    setSelectedContact(contact);
    setCopyStatus("Copy message");
  };

  return (
    <>
      <section className="px-6 md:px-20 py-16 md:py-20 bg-background border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[0.78fr_1.22fr] gap-8 md:gap-14 items-start mb-10">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Social outreach path</p>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
                Public contacts to approach on LinkedIn.
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed m-0">
              These are public profile paths for social outreach. Email outreach remains managed through HubSpot; this page gives you LinkedIn links and tailored draft messages for each contact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <article key={`${contact.linkedinUrl}-${contact.name}`} className="rounded-[1.5rem] border border-border bg-card p-5 md:p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="group no-underline">
                      <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {contact.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-primary">{contact.title}</p>
                    </a>
                    {contact.location ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{contact.location}</p> : null}
                  </div>
                  {contact.confidence ? (
                    <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {contact.confidence} confidence
                    </span>
                  ) : null}
                </div>
                {contact.relationshipToOpportunity ? <p className="mb-3 text-sm leading-relaxed text-foreground">{contact.relationshipToOpportunity}</p> : null}
                {contact.selectionRationale ? <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{contact.selectionRationale}</p> : null}
                <button type="button" onClick={() => openDraft(contact)} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">
                  Draft message
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedContact ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="social-draft-title" onClick={() => setSelectedContact(null)}>
          <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-background p-6 text-foreground shadow-2xl md:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-3">Draft LinkedIn message</p>
                <h2 id="social-draft-title" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                  {selectedContact.name}
                </h2>
                <a href={selectedContact.linkedinUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                  Open LinkedIn profile
                </a>
              </div>
              <button type="button" onClick={() => setSelectedContact(null)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Close draft message">
                Close
              </button>
            </div>

            <textarea readOnly value={draft} className="h-72 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none" />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-md">
                Copy this message, open the LinkedIn profile, and personalize the final line if needed before sending.
              </p>
              <button type="button" onClick={copyDraft} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">
                {copyStatus}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProposalSocialOutreach;
