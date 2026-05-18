type ExtraProposalContact = {
  slug: string;
  company: string;
  name: string;
  title: string;
  linkedinUrl: string;
  email?: string;
};

const EXTRA_PROPOSAL_CONTACTS: ExtraProposalContact[] = [
  { slug: "sleep-doctor", company: "Sleep Doctor", name: "David Amato", title: "Business Development", linkedinUrl: "https://www.linkedin.com/in/david-amato-1861852/" },
  { slug: "sleep-doctor", company: "Sleep Doctor", name: "Reyna Haile", title: "Paid Social Growth Marketing Manager", linkedinUrl: "https://www.linkedin.com/in/reynahaile/" },
  { slug: "sleep-doctor", company: "Sleep Doctor", name: "Evelia McNeil", title: "Growth Marketing Manager", linkedinUrl: "https://www.linkedin.com/in/evie-mcneil-/" },
  { slug: "fueled", company: "Fueled", name: "Thomas King", title: "VP Client Strategy", linkedinUrl: "https://www.linkedin.com/in/thomas-king-475a837/" },
  { slug: "fueled", company: "Fueled", name: "Brian Bourn", title: "Vice President of Client Strategy", linkedinUrl: "https://www.linkedin.com/in/brian-bourn/" },
  { slug: "fueled", company: "Fueled", name: "Patrick Ahl", title: "Principal Growth Strategist", linkedinUrl: "https://www.linkedin.com/in/patrick-ahl-7a553370/" },
  { slug: "fueled", company: "Fueled", name: "Amir Levi-Krone", title: "Senior Digital Growth Strategist", linkedinUrl: "https://www.linkedin.com/in/amirkrone/" },
  { slug: "fueled", company: "Fueled", name: "Rich Flaherty", title: "Senior Digital Growth Strategist", linkedinUrl: "https://www.linkedin.com/in/richflaherty/" },
  { slug: "fueled", company: "Fueled", name: "Andy Killworth", title: "Senior Digital Growth Strategist", linkedinUrl: "https://www.linkedin.com/in/andy-killworth-%f0%9f%8c%b1-8044a2173/" },
  { slug: "fueled", company: "Fueled", name: "Matt Bullock, MBA", title: "Director of Client Strategy", linkedinUrl: "https://www.linkedin.com/in/matthewtbullock/" },
  { slug: "fueled", company: "Fueled", name: "Shenandoah Sherwell", title: "Senior Audience Growth Strategist", linkedinUrl: "https://www.linkedin.com/in/shenandoah-sherwell-37b670b6/" },
];

const EXTRA_STATUS_KEY = "aboutchad_proposal_extra_contact_status_v1";

const getExtraStatuses = () => {
  try {
    return JSON.parse(window.localStorage.getItem(EXTRA_STATUS_KEY) || "{}") as Record<string, { linkedin?: boolean; email?: boolean }>;
  } catch {
    return {} as Record<string, { linkedin?: boolean; email?: boolean }>;
  }
};

const saveExtraStatus = (key: string, channel: "linkedin" | "email", checked: boolean) => {
  const statuses = getExtraStatuses();
  statuses[key] = { ...(statuses[key] || {}), [channel]: checked };
  if (!statuses[key].linkedin && !statuses[key].email) delete statuses[key];
  window.localStorage.setItem(EXTRA_STATUS_KEY, JSON.stringify(statuses));
};

const getContactKey = (contact: ExtraProposalContact, channel: "linkedin" | "email") => `${contact.slug}::${contact.linkedinUrl || contact.name}::${channel}`.toLowerCase();

const getFirstName = (name: string) => name.split(" ")[0] || name;

const getRoleContext = (slug: string) => {
  if (slug === "sleep-doctor") {
    return {
      role: "GTM Product Marketing, B2B Physician Channel",
      positioning: "I build GTM operating systems that connect channel strategy, CRM workflows, messaging, pilot governance, and KPI reporting into measurable execution.",
      skills: "GTM architecture, sales and marketing alignment, CRM workflow design, channel strategy, lifecycle measurement, and pilot launch governance",
    };
  }

  if (slug === "fueled") {
    return {
      role: "Senior Growth Strategist",
      positioning: "I connect SEO, AEO, AI search, content architecture, analytics, and executive reporting into growth systems that teams can measure and act on.",
      skills: "SEO/AEO strategy, AI search readiness, content architecture, analytics, attribution, experimentation, and executive reporting",
    };
  }

  return {
    role: "the opportunity",
    positioning: "I build practical revenue and marketing operating systems that connect strategy, data, workflows, and reporting to measurable execution.",
    skills: "revenue operations, marketing operations, lifecycle strategy, CRM workflows, segmentation, and executive reporting",
  };
};

const trimLinkedIn = (message: string) => message.length <= 300 ? message : `${message.slice(0, 297).trim()}...`;

const buildLinkedInDraft = (contact: ExtraProposalContact) => {
  const context = getRoleContext(contact.slug);
  const emailLine = contact.email ? " I also sent a short email with more context." : "";
  return trimLinkedIn(`Hi ${getFirstName(contact.name)} — I saw the ${context.role} opportunity with ${contact.company}. ${context.positioning}${emailLine} Would welcome the chance to connect if relevant to your team.`);
};

const buildEmailDraft = (contact: ExtraProposalContact) => {
  const context = getRoleContext(contact.slug);
  return [
    `Subject: ${context.role} — quick introduction`,
    "",
    `Hi ${getFirstName(contact.name)},`,
    "",
    `I saw the ${context.role} opportunity with ${contact.company} and wanted to introduce myself. Your role as ${contact.title} looks close enough to the work that I thought it was worth reaching out directly.`,
    "",
    context.positioning,
    "",
    `The parts of my background that seem most relevant are ${context.skills}.`,
    "",
    "If this is something you are connected to, I’d welcome the chance to compare notes. If someone else owns the conversation internally, I’d appreciate any direction on the right person to contact.",
    "",
    "Best,",
    "Chad",
  ].join("\n");
};

const openExtraDraftModal = (contact: ExtraProposalContact) => {
  const existing = document.querySelector(".proposal-extra-draft-modal");
  existing?.remove();

  let activeChannel: "linkedin" | "email" = "linkedin";
  const modal = document.createElement("div");
  modal.className = "proposal-extra-draft-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="proposal-extra-draft-modal__panel">
      <div class="proposal-extra-draft-modal__header">
        <div>
          <p class="proposal-extra-draft-modal__eyebrow">Draft LinkedIn message</p>
          <h2>${contact.name}</h2>
          <a href="${contact.linkedinUrl}" target="_blank" rel="noreferrer">Open LinkedIn profile</a>
        </div>
        <button type="button" class="proposal-extra-draft-modal__close" aria-label="Close draft message">Close</button>
      </div>
      <div class="proposal-draft-switcher" role="tablist" aria-label="Draft message channel"></div>
      <textarea readonly class="proposal-extra-draft-modal__textarea"></textarea>
      <div class="proposal-extra-draft-modal__actions">
        <p>Copy this message, open the profile, and personalize the final line if needed before sending.</p>
        <div class="proposal-extra-draft-modal__buttons"></div>
      </div>
    </div>
  `;

  const textarea = modal.querySelector("textarea") as HTMLTextAreaElement;
  const eyebrow = modal.querySelector(".proposal-extra-draft-modal__eyebrow") as HTMLElement;
  const switcher = modal.querySelector(".proposal-draft-switcher") as HTMLElement;
  const buttons = modal.querySelector(".proposal-extra-draft-modal__buttons") as HTMLElement;

  const setDraft = (channel: "linkedin" | "email") => {
    activeChannel = channel;
    textarea.value = channel === "email" ? buildEmailDraft(contact) : buildLinkedInDraft(contact);
    eyebrow.textContent = channel === "email" ? "Draft email message" : "Draft LinkedIn message";
    switcher.querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", button.getAttribute("data-channel") === channel));
  };

  const linkedInTab = document.createElement("button");
  linkedInTab.type = "button";
  linkedInTab.className = "proposal-draft-channel-button is-active";
  linkedInTab.textContent = "LinkedIn";
  linkedInTab.setAttribute("data-channel", "linkedin");
  linkedInTab.addEventListener("click", () => setDraft("linkedin"));
  switcher.appendChild(linkedInTab);

  if (contact.email) {
    const emailTab = document.createElement("button");
    emailTab.type = "button";
    emailTab.className = "proposal-draft-channel-button";
    emailTab.innerHTML = "<span aria-hidden='true'>✉</span> Email";
    emailTab.setAttribute("data-channel", "email");
    emailTab.addEventListener("click", () => setDraft("email"));
    switcher.appendChild(emailTab);

    const openEmail = document.createElement("a");
    openEmail.className = "proposal-email-open-button";
    openEmail.href = `mailto:${contact.email}?subject=${encodeURIComponent(`${getRoleContext(contact.slug).role} — quick introduction`)}&body=${encodeURIComponent(buildEmailDraft(contact).replace(/^Subject:.*\n\n/, ""))}`;
    openEmail.innerHTML = "<span aria-hidden='true'>✉</span> Open email";
    buttons.appendChild(openEmail);
  }

  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "proposal-extra-draft-modal__copy";
  copy.textContent = "Copy message";
  copy.addEventListener("click", async () => {
    await navigator.clipboard.writeText(activeChannel === "email" ? buildEmailDraft(contact) : buildLinkedInDraft(contact));
    copy.textContent = "Copied";
    window.setTimeout(() => { copy.textContent = "Copy message"; }, 1200);
  });
  buttons.appendChild(copy);

  modal.querySelector(".proposal-extra-draft-modal__close")?.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
  setDraft("linkedin");
};

const getArticleForSlug = (slug: string) => {
  return Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")).find((article) => {
    const link = article.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
    return link?.getAttribute("href") === `/company/${slug}`;
  }) as HTMLElement | undefined;
};

const contactAlreadyExists = (article: HTMLElement, contact: ExtraProposalContact) => {
  const haystack = article.textContent?.toLowerCase() || "";
  const hasName = haystack.includes(contact.name.toLowerCase());
  const hasLinkedIn = Boolean(article.querySelector(`a[href='${contact.linkedinUrl}']`));
  return hasName || hasLinkedIn;
};

const ensureContactSection = (article: HTMLElement) => {
  let section = article.querySelector(".proposal-extra-contact-section") as HTMLElement | null;
  if (section) return section;

  const existingSection = Array.from(article.querySelectorAll(":scope > div")).find((div) => div.textContent?.includes("LinkedIn outreach contacts")) as HTMLElement | undefined;
  if (existingSection) {
    existingSection.classList.add("proposal-extra-contact-section");
    return existingSection;
  }

  section = document.createElement("div");
  section.className = "proposal-extra-contact-section mt-6 border-t border-border pt-5";
  section.innerHTML = `<p class="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">LinkedIn outreach contacts</p><div class="grid gap-3 md:grid-cols-2"></div>`;
  article.appendChild(section);
  return section;
};

const createContactCard = (contact: ExtraProposalContact) => {
  const card = document.createElement("div");
  card.className = "rounded-2xl border border-border bg-card p-4 proposal-contact-card-enhanced";
  const linkedInKey = getContactKey(contact, "linkedin");
  const emailKey = getContactKey(contact, "email");
  const statuses = getExtraStatuses();
  card.innerHTML = `
    <div class="proposal-contact-card-grid">
      <div class="proposal-contact-detail-block">
        <a href="${contact.linkedinUrl}" target="_blank" rel="noreferrer" class="group block no-underline">
          <p class="m-0 font-display text-xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">${contact.name}</p>
          <p class="mt-1 text-sm font-semibold leading-relaxed text-primary">${contact.title}</p>
        </a>
        <div class="proposal-contact-status-controls">
          <label><input type="checkbox" data-channel="linkedin" ${statuses[linkedInKey]?.linkedin ? "checked" : ""}/> LinkedIn Messaged</label>
          ${contact.email ? `<label><input type="checkbox" data-channel="email" ${statuses[emailKey]?.email ? "checked" : ""}/> Emailed</label>` : ""}
        </div>
      </div>
      <div class="proposal-contact-action-block"><button type="button" class="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-opacity hover:opacity-90">Draft message</button></div>
    </div>
  `;

  card.querySelector("button")?.addEventListener("click", () => openExtraDraftModal(contact));
  card.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", () => {
      const checkbox = input as HTMLInputElement;
      const channel = checkbox.dataset.channel as "linkedin" | "email";
      saveExtraStatus(channel === "email" ? emailKey : linkedInKey, channel, checkbox.checked);
    });
  });
  return card;
};

const addExtraProposalContacts = () => {
  if (window.location.pathname !== "/company") return;

  EXTRA_PROPOSAL_CONTACTS.forEach((contact) => {
    const article = getArticleForSlug(contact.slug);
    if (!article || contactAlreadyExists(article, contact)) return;
    const section = ensureContactSection(article);
    const grid = section.querySelector(".grid") as HTMLElement | null;
    grid?.appendChild(createContactCard(contact));
  });
};

const bootExtraProposalContacts = () => {
  window.setTimeout(addExtraProposalContacts, 700);
  window.setTimeout(addExtraProposalContacts, 1600);
  window.setTimeout(addExtraProposalContacts, 3200);
  window.setTimeout(addExtraProposalContacts, 5000);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootExtraProposalContacts);
} else {
  bootExtraProposalContacts();
}
