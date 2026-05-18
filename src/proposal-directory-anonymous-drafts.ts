const ANON_PROPOSAL_BASE_URL = "https://www.aboutchad.com/company";

const ANON_ROLE_CONTEXT: Record<string, { role: string; company: string; value: string }> = {
  attest: { role: "Interim Senior Growth Marketing Manager", company: "Attest", value: "I build growth operating systems that connect lifecycle marketing + RevOps to measurable outcomes." },
  "who-gives-a-crap": { role: "Fractional Head of Marketing Operations & Planning", company: "Who Gives A Crap", value: "I build marketing operating systems that connect planning, execution + reporting to measurable outcomes." },
  enmacc: { role: "Revenue Business Manager", company: "enmacc", value: "I build revenue operating systems that connect CRO priorities, RevOps + execution to measurable outcomes." },
  revive: { role: "Fractional Go-To-Market Consultant", company: "Revive", value: "I build GTM operating systems that connect launch planning, enablement + AI workflows to measurable outcomes." },
  "sleep-doctor": { role: "GTM Product Marketing, B2B Physician Channel", company: "Sleep Doctor", value: "I build GTM operating systems that connect channel strategy, CRM workflows + pilot execution to measurable outcomes." },
  fueled: { role: "Senior Growth Strategist", company: "Fueled", value: "I build growth systems that connect SEO, AI search + analytics to measurable outcomes." },
  "momentum-healthcare-technology-consulting": { role: "Senior Healthcare Growth & Operations Consultant", company: "Momentum Healthcare and Technology Consulting", value: "I build growth operating systems that connect healthcare operations, technology + revenue execution to measurable outcomes." },
  turtl: { role: "Fractional VP of Customer Success", company: "Turtl", value: "I build customer operating systems that connect lifecycle visibility, retention + expansion to measurable outcomes." },
  acuvance: { role: "Director of Revenue Operations", company: "Acuvance", value: "I build revenue operating systems that connect CRM workflows, reporting + pipeline execution to measurable outcomes." },
  "town-web": { role: "Fractional CPQ and RevOps Architect", company: "Town Web", value: "I build RevOps systems that connect CPQ, CRM workflows + reporting to measurable outcomes." },
  farlinium: { role: "B2B Growth Marketing Manager", company: "Farlinium", value: "I build growth operating systems that connect demand generation, lifecycle + pipeline reporting to measurable outcomes." },
  "health-commerce": { role: "Digital Marketing Director", company: "Health & Commerce", value: "I build digital marketing systems that connect campaigns, CRM + reporting to measurable outcomes." },
  neolytix: { role: "Fractional Healthcare Growth Program Architect", company: "Neolytix", value: "I build healthcare growth systems that connect marketing, operations + reporting to measurable outcomes." },
  "maleda-tech": { role: "Staff Advanced Analyst, Marketing", company: "Maleda Tech", value: "I build lifecycle measurement systems that connect campaign experimentation + analytics to measurable outcomes." },
  brains: { role: "Senior Brand Strategist", company: "Brains", value: "I build strategy systems that connect positioning, messaging + growth execution to measurable outcomes." },
  "speridian-technologies": { role: "Principal GTM Strategy Lead", company: "Speridian Technologies", value: "I build GTM operating systems that connect strategy, workflows + revenue execution to measurable outcomes." },
  everist: { role: "Fractional VP Marketing", company: "Everist", value: "I build marketing operating systems that connect growth strategy, lifecycle + reporting to measurable outcomes." },
  "whole-womans-health": { role: "Fractional Marketing Director", company: "Whole Woman’s Health", value: "I build marketing systems that connect local search, patient acquisition + reporting to measurable outcomes." },
  "logic20-20": { role: "Solution Architect — Palantir Foundry", company: "Logic20/20", value: "I build operating systems that connect data, workflows + executive reporting to measurable outcomes." },
  "development-counsellors-international": { role: "Strategist", company: "Development Counsellors International", value: "I build strategy systems that connect research, positioning + measurement to measurable outcomes." },
  "software-solutions-firm-vp-sales": { role: "Fractional VP of Sales", company: "Software Solutions Firm", value: "I build revenue operating systems that connect sales strategy, workflows + reporting to measurable outcomes." },
};

const getAnonSlug = (article: HTMLElement) => {
  const link = article.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
  return link?.getAttribute("href")?.replace("/company/", "") || "";
};

const getAnonCompany = (article: HTMLElement) => article.querySelector("h3")?.textContent?.trim() || "the company";

const getAnonRole = (article: HTMLElement) => {
  const rolePanel = article.querySelector(":scope > div:first-child > div:nth-child(2)") as HTMLElement | null;
  const role = rolePanel?.querySelector("p:nth-child(2)")?.textContent?.trim();
  return role || "the opportunity";
};

const getAnonContext = (article: HTMLElement) => {
  const slug = getAnonSlug(article);
  return ANON_ROLE_CONTEXT[slug] || {
    role: getAnonRole(article),
    company: getAnonCompany(article),
    value: "I build growth and revenue operating systems tied to measurable outcomes.",
  };
};

const getAnonProposalUrl = (article: HTMLElement) => `${ANON_PROPOSAL_BASE_URL}/${getAnonSlug(article)}`;

const hasRealContacts = (article: HTMLElement) => {
  const contactSections = Array.from(article.querySelectorAll(":scope > div")) as HTMLElement[];
  return contactSections.some((section) => {
    if (!section.textContent?.includes("LinkedIn outreach contacts")) return false;
    return Boolean(section.querySelector("a[href*='linkedin.com'], .proposal-contact-card-enhanced:not(.proposal-anonymous-contact-card)"));
  });
};

const buildAnonLinkedInDraft = (article: HTMLElement) => {
  const context = getAnonContext(article);
  return `Hi — I saw the ${context.role} opportunity with ${context.company}. ${context.value} Would welcome the chance to connect.\n\nProposal page: ${getAnonProposalUrl(article)}`;
};

const buildAnonEmailDraft = (article: HTMLElement) => {
  const context = getAnonContext(article);
  return [
    `Subject: ${context.role} — quick introduction`,
    "",
    "Hi,",
    "",
    `I saw the ${context.role} opportunity with ${context.company} and wanted to introduce myself.`,
    "",
    context.value,
    "",
    `I put together a short proposal page here: ${getAnonProposalUrl(article)}`,
    "",
    "If you are the right person to discuss this, I’d welcome the chance to connect. If not, I’d appreciate any direction on who owns the conversation internally.",
    "",
    "Best,",
    "Chad",
  ].join("\n");
};

const openAnonDraftModal = (article: HTMLElement) => {
  document.querySelector(".proposal-extra-draft-modal")?.remove();
  let activeChannel: "linkedin" | "email" = "linkedin";
  const context = getAnonContext(article);
  const modal = document.createElement("div");
  modal.className = "proposal-extra-draft-modal proposal-anonymous-draft-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="proposal-extra-draft-modal__panel">
      <div class="proposal-extra-draft-modal__header">
        <div>
          <p class="proposal-extra-draft-modal__eyebrow">Draft LinkedIn message</p>
          <h2>Generic outreach draft</h2>
          <p class="proposal-anonymous-draft-context">${context.company} · ${context.role}</p>
        </div>
        <button type="button" class="proposal-extra-draft-modal__close" aria-label="Close draft message">Close</button>
      </div>
      <div class="proposal-draft-switcher" role="tablist" aria-label="Draft message channel">
        <button type="button" class="proposal-draft-channel-button is-active" data-channel="linkedin">LinkedIn</button>
        <button type="button" class="proposal-draft-channel-button" data-channel="email"><span aria-hidden="true">✉</span> Email</button>
      </div>
      <textarea readonly class="proposal-extra-draft-modal__textarea"></textarea>
      <div class="proposal-extra-draft-modal__actions">
        <p>Use this when you have not identified the contact yet. Find a leader, then personalize the greeting if needed.</p>
        <div class="proposal-extra-draft-modal__buttons"><button type="button" class="proposal-extra-draft-modal__copy">Copy message</button></div>
      </div>
    </div>
  `;

  const textarea = modal.querySelector("textarea") as HTMLTextAreaElement;
  const eyebrow = modal.querySelector(".proposal-extra-draft-modal__eyebrow") as HTMLElement;
  const buttons = Array.from(modal.querySelectorAll(".proposal-draft-channel-button")) as HTMLButtonElement[];
  const copy = modal.querySelector(".proposal-extra-draft-modal__copy") as HTMLButtonElement;

  const setDraft = (channel: "linkedin" | "email") => {
    activeChannel = channel;
    textarea.value = channel === "email" ? buildAnonEmailDraft(article) : buildAnonLinkedInDraft(article);
    eyebrow.textContent = channel === "email" ? "Draft email message" : "Draft LinkedIn message";
    buttons.forEach((button) => button.classList.toggle("is-active", button.dataset.channel === channel));
  };

  buttons.forEach((button) => button.addEventListener("click", () => setDraft(button.dataset.channel === "email" ? "email" : "linkedin")));
  copy.addEventListener("click", async () => {
    await navigator.clipboard.writeText(activeChannel === "email" ? buildAnonEmailDraft(article) : buildAnonLinkedInDraft(article));
    copy.textContent = "Copied";
    window.setTimeout(() => { copy.textContent = "Copy message"; }, 1200);
  });

  modal.querySelector(".proposal-extra-draft-modal__close")?.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (event) => { if (event.target === modal) modal.remove(); });

  document.body.appendChild(modal);
  setDraft("linkedin");
};

const ensureAnonSection = (article: HTMLElement) => {
  let section = Array.from(article.querySelectorAll(":scope > div")).find((div) => div.textContent?.includes("LinkedIn outreach contacts")) as HTMLElement | undefined;
  if (!section) {
    section = document.createElement("div");
    section.className = "proposal-extra-contact-section mt-6 border-t border-border pt-5";
    section.innerHTML = `<p class="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">LinkedIn outreach contacts</p><div class="grid gap-3 md:grid-cols-2"></div>`;
    article.appendChild(section);
  }
  return section;
};

const createAnonCard = (article: HTMLElement) => {
  const context = getAnonContext(article);
  const card = document.createElement("div");
  card.className = "rounded-2xl border border-border bg-card p-4 proposal-contact-card-enhanced proposal-anonymous-contact-card";
  card.innerHTML = `
    <div class="proposal-contact-card-grid">
      <div class="proposal-contact-detail-block">
        <p class="m-0 font-display text-xl font-extrabold tracking-tight text-foreground">No contact identified yet</p>
        <p class="mt-1 text-sm font-semibold leading-relaxed text-primary">Generic draft for likely hiring leader</p>
        <p class="proposal-anonymous-card-note">${context.role}</p>
      </div>
      <div class="proposal-contact-action-block"><button type="button" class="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">Draft message</button></div>
    </div>
  `;
  card.querySelector("button")?.addEventListener("click", () => openAnonDraftModal(article));
  return card;
};

const addAnonymousDraftCards = () => {
  if (window.location.pathname !== "/company") return;
  const articles = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")) as HTMLElement[];
  articles.forEach((article) => {
    if (article.querySelector(".proposal-anonymous-contact-card")) return;
    if (hasRealContacts(article)) return;
    const section = ensureAnonSection(article);
    const grid = section.querySelector(".grid") as HTMLElement | null;
    grid?.appendChild(createAnonCard(article));
  });
};

const bootAnonymousDraftCards = () => {
  window.setTimeout(addAnonymousDraftCards, 1800);
  window.setTimeout(addAnonymousDraftCards, 3400);
  window.setTimeout(addAnonymousDraftCards, 5600);
  window.setTimeout(addAnonymousDraftCards, 7600);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAnonymousDraftCards);
} else {
  bootAnonymousDraftCards();
}
