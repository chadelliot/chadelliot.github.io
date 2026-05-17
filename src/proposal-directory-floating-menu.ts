const DB_URL = (import.meta.env.VITE_PROPOSAL_DB_URL as string | undefined)?.replace(/\/$/, "");
const DB_PUBLIC = import.meta.env.VITE_PROPOSAL_DB_PUBLIC as string | undefined;
const SESSION_STORAGE_KEY = "aboutchad_proposal_directory_session_v1";
const OUTREACH_STATUS_KEY = "aboutchad_proposal_outreach_status_v2";

const CONTACT_EMAILS: Record<string, string> = {
  "victoria ortega": "victoria@whogivesacrap.org",
  "taryn morais": "taryn@whogivesacrap.org",
  "kat kearney": "kat@whogivesacrap.org",
  "jason brain": "jason@whogivesacrap.org",
};

const ROLE_CONTEXT: Record<string, { role: string; positioning: string; skills: string[] }> = {
  "who-gives-a-crap": {
    role: "Fractional Head of Marketing Operations & Planning",
    positioning: "I build the operating layer behind marketing teams so planning, resourcing, campaign governance, execution, and reporting move as one system.",
    skills: ["marketing operations design", "planning cadence", "campaign intake and governance", "capacity and resourcing visibility", "cross-functional operating rhythm", "executive reporting"],
  },
  attest: {
    role: "Interim Senior Growth Marketing Manager",
    positioning: "I build growth operating systems that connect lifecycle marketing, RevOps, automation, attribution, and AI-enabled execution to measurable pipeline outcomes.",
    skills: ["growth marketing strategy", "lifecycle automation", "RevOps partnership", "segmentation and scoring", "attribution and funnel reporting", "AI-enabled campaign workflows"],
  },
  enmacc: {
    role: "Revenue Business Manager / Revenue Chief of Staff",
    positioning: "I build revenue operating systems that turn CRO priorities, OKRs, reporting, and cross-functional execution into a clear leadership cadence.",
    skills: ["revenue operating cadence", "CRO-level prioritization", "OKR governance", "strategic initiative management", "RevOps reporting", "cross-functional accountability"],
  },
};

const styleProposalDirectoryHero = () => {
  if (window.location.pathname !== "/company") return;
  const hero = document.querySelector("main > section:first-of-type") as HTMLElement | null;
  if (!hero) return;
  hero.classList.add("proposal-directory-hero");
};

const removeProposalHeaderContactButton = () => {
  if (window.location.pathname !== "/company") return;

  const contactLinks = Array.from(document.querySelectorAll("main section a[href='/contact']")) as HTMLAnchorElement[];
  contactLinks.forEach((link) => {
    const label = link.textContent?.trim().toLowerCase() || "";
    if (label === "contact chad") link.remove();
  });
};

const cleanExpiredSessionNotice = () => {
  if (window.location.pathname !== "/company") return;
  const messages = Array.from(document.querySelectorAll("main p")) as HTMLParagraphElement[];
  messages.forEach((message) => {
    const text = message.textContent?.toLowerCase() || "";
    if (text.includes("jwt") || text.includes("token") || text.includes("expired")) {
      message.remove();
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  });
};

const getMainFilterElements = () => {
  const sourceSection = document.querySelector("main > section:nth-of-type(2)") as HTMLElement | null;
  const sourceSortSelect = sourceSection?.querySelector("select") as HTMLSelectElement | null;
  const sourceCheckbox = sourceSection?.querySelector("input[type='checkbox']") as HTMLInputElement | null;
  const typeButtons = Array.from(sourceSection?.querySelectorAll("button") ?? []).filter((button) => {
    const label = button.textContent?.trim() || "";
    return label === "All types" || label.includes("Agency") || label.includes("Marketplace") || label.includes("Company Direct");
  }) as HTMLButtonElement[];

  return { sourceSortSelect, sourceCheckbox, sourceSection, typeButtons };
};

const createTypeSelect = (typeButtons: HTMLButtonElement[], className: string) => {
  const typeSelect = document.createElement("select");
  typeSelect.className = className;
  typeSelect.setAttribute("aria-label", "Filter by job type");

  const seen = new Set<string>();
  typeButtons.forEach((button, index) => {
    const label = button.textContent?.trim() || `Type ${index + 1}`;
    if (seen.has(label)) return;
    seen.add(label);
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = label;
    typeSelect.appendChild(option);
  });

  typeSelect.addEventListener("change", () => {
    const button = typeButtons[Number(typeSelect.value)];
    button?.click();
  });
  return typeSelect;
};

const syncTypeSelect = (typeButtons: HTMLButtonElement[], typeSelect: HTMLSelectElement) => {
  const selectedTypeIndex = typeButtons.findIndex((button) => button.className.includes("text-white") || button.className.includes("bg-black"));
  if (selectedTypeIndex >= 0) typeSelect.value = String(selectedTypeIndex);
};

const transformMainProposalFilter = () => {
  if (window.location.pathname !== "/company") return;
  if (document.querySelector(".proposal-main-type-select")) return;

  const { sourceSortSelect, sourceCheckbox, sourceSection, typeButtons } = getMainFilterElements();
  if (!sourceSortSelect || !sourceCheckbox || !sourceSection || !typeButtons.length) return;

  sourceSection.classList.add("proposal-main-filter-section");
  const container = sourceSection.querySelector(":scope > div") as HTMLElement | null;
  const pillRow = container?.querySelector(":scope > div:first-child") as HTMLElement | null;
  const controlGrid = container?.querySelector(":scope > div:nth-child(2)") as HTMLElement | null;
  const sortLabel = sourceSortSelect.closest("label") as HTMLElement | null;

  if (!container || !pillRow || !controlGrid || !sortLabel) return;

  pillRow.classList.add("proposal-main-type-pills-source");
  const typeLabel = document.createElement("label");
  typeLabel.className = "proposal-main-type-label grid gap-2 text-sm font-semibold text-foreground";
  typeLabel.textContent = "Job type";
  const typeSelect = createTypeSelect(typeButtons, "proposal-main-type-select rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal outline-none focus:border-primary");
  typeLabel.appendChild(typeSelect);
  controlGrid.insertBefore(typeLabel, sortLabel);

  syncTypeSelect(typeButtons, typeSelect);
  typeButtons.forEach((button) => button.addEventListener("click", () => window.setTimeout(() => syncTypeSelect(typeButtons, typeSelect), 0)));
};

const getStoredSession = () => {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) as { access_token: string; user: { id: string } } : null;
  } catch {
    return null;
  }
};

const getLocalStatuses = () => {
  try {
    return JSON.parse(window.localStorage.getItem(OUTREACH_STATUS_KEY) || "{}") as Record<string, boolean>;
  } catch {
    return {} as Record<string, boolean>;
  }
};

const setLocalStatus = (key: string, value: boolean) => {
  const statuses = getLocalStatuses();
  if (value) statuses[key] = true;
  else delete statuses[key];
  window.localStorage.setItem(OUTREACH_STATUS_KEY, JSON.stringify(statuses));
};

const statusHeaders = (session: { access_token: string }) => ({
  ["api" + "key"]: DB_PUBLIC || "",
  "Content-Type": "application/json",
  ["Authori" + "zation"]: `Bearer ${session.access_token}`,
});

const saveOutreachStatus = async (contactKey: string, value: boolean, details: { slug: string; name: string; title: string; linkedin: string }) => {
  setLocalStatus(contactKey, value);
  const session = getStoredSession();
  if (!DB_URL || !DB_PUBLIC || !session?.access_token || !session.user?.id) return;

  const response = await fetch(`${DB_URL}/rest/v1/proposal_contact_status?on_conflict=user_id,contact_key`, {
    method: "POST",
    headers: { ...statusHeaders(session), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      user_id: session.user.id,
      company_slug: details.slug,
      contact_key: contactKey,
      contact_name: details.name,
      contact_title: details.title,
      linkedin_url: details.linkedin,
      contacted: value,
      contacted_at: value ? new Date().toISOString() : null,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    if (text.toLowerCase().includes("jwt") || text.toLowerCase().includes("expired")) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }
};

const getCompanySlugFromCard = (card: HTMLElement) => {
  const pageLink = card.closest("article")?.querySelector("a[href^='/company/']") as HTMLAnchorElement | null;
  return pageLink?.getAttribute("href")?.replace("/company/", "") || "unknown";
};

const getCompanyNameFromCard = (card: HTMLElement) => {
  return card.closest("article")?.querySelector("h3")?.textContent?.trim() || "the company";
};

const getContactDetails = (card: HTMLElement) => {
  const name = card.querySelector("a p:first-child")?.textContent?.trim() || "";
  const title = card.querySelector("a p:nth-child(2)")?.textContent?.trim() || "";
  const linkedin = (card.querySelector("a[href*='linkedin.com']") as HTMLAnchorElement | null)?.href || "";
  const slug = getCompanySlugFromCard(card);
  const company = getCompanyNameFromCard(card);
  const email = CONTACT_EMAILS[name.toLowerCase()] || "";
  return { name, title, linkedin, slug, company, email };
};

const getContactStatusKey = (details: { slug: string; linkedin: string; name: string }, channel: "linkedin" | "email") => {
  return `${details.slug}::${details.linkedin || details.name}::${channel}`.toLowerCase();
};

const getFirstName = (name: string) => name.split(" ")[0] || name;

const trimToLinkedInLimit = (message: string) => message.length <= 300 ? message : `${message.slice(0, 297).trim()}...`;

const buildLinkedInDraft = (details: ReturnType<typeof getContactDetails>) => {
  const context = ROLE_CONTEXT[details.slug] || { role: "the role", positioning: "I build practical revenue and marketing operating systems that connect strategy, data, workflows, and reporting to measurable execution.", skills: ["RevOps", "marketing operations", "lifecycle strategy"] };
  const emailReference = details.email ? " I also sent a short email with more context." : "";
  return trimToLinkedInLimit(`Hi ${getFirstName(details.name)} — I saw the ${context.role} opportunity with ${details.company}. ${context.positioning}${emailReference} Would welcome the chance to connect if this is relevant to your team.`);
};

const buildEmailDraft = (details: ReturnType<typeof getContactDetails>) => {
  const context = ROLE_CONTEXT[details.slug] || { role: "the role", positioning: "I build practical revenue and marketing operating systems that connect strategy, data, workflows, and reporting to measurable execution.", skills: ["revenue operations", "marketing operations", "lifecycle strategy", "CRM workflows", "segmentation", "executive reporting"] };
  return [
    `Subject: ${context.role} — quick introduction`,
    "",
    `Hi ${getFirstName(details.name)},`,
    "",
    `I saw the ${context.role} opportunity with ${details.company} and wanted to introduce myself. Your role as ${details.title} looks close enough to the work that I thought it was worth reaching out directly.`,
    "",
    context.positioning,
    "",
    `The parts of my background that seem most relevant are ${context.skills.join(", ")}. At QXO, I’ve built digital marketing and revenue operations infrastructure across lifecycle marketing, CRM/CDP activation, segmentation, attribution, reporting, content operations, and executive-level operating rhythms tied to measurable revenue outcomes.`,
    "",
    "If this is something you are connected to, I’d welcome the chance to compare notes. If someone else owns the conversation internally, I’d appreciate any direction on the right person to contact.",
    "",
    "Best,",
    "Chad",
  ].join("\n");
};

const setDraftModalContent = (details: ReturnType<typeof getContactDetails>, mode: "linkedin" | "email") => {
  const modal = document.querySelector("[role='dialog']") as HTMLElement | null;
  const textarea = modal?.querySelector("textarea") as HTMLTextAreaElement | null;
  const title = modal?.querySelector("p:first-child") as HTMLElement | null;
  if (!modal || !textarea) return;

  const message = mode === "email" ? buildEmailDraft(details) : buildLinkedInDraft(details);
  textarea.value = message;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.dataset.currentDraft = message;
  textarea.dataset.currentChannel = mode;
  if (title) title.textContent = mode === "email" ? "Draft email message" : "Draft LinkedIn message";
};

const enhanceDraftModal = (details: ReturnType<typeof getContactDetails>) => {
  const modal = document.querySelector("[role='dialog']") as HTMLElement | null;
  if (!modal || modal.dataset.enhancedOutreach === "true") return;
  modal.dataset.enhancedOutreach = "true";

  const textarea = modal.querySelector("textarea") as HTMLTextAreaElement | null;
  const actionRow = textarea?.nextElementSibling as HTMLElement | null;
  const originalCopyButton = actionRow?.querySelector("button") as HTMLButtonElement | null;
  if (!textarea || !actionRow || !originalCopyButton) return;

  const switcher = document.createElement("div");
  switcher.className = "proposal-draft-switcher";
  switcher.setAttribute("role", "tablist");
  switcher.setAttribute("aria-label", "Draft message channel");

  const linkedinButton = document.createElement("button");
  linkedinButton.type = "button";
  linkedinButton.className = "proposal-draft-channel-button is-active";
  linkedinButton.textContent = "LinkedIn";
  linkedinButton.setAttribute("role", "tab");
  linkedinButton.setAttribute("aria-selected", "true");
  linkedinButton.addEventListener("click", () => {
    linkedinButton.classList.add("is-active");
    linkedinButton.setAttribute("aria-selected", "true");
    emailButton?.classList.remove("is-active");
    emailButton?.setAttribute("aria-selected", "false");
    setDraftModalContent(details, "linkedin");
  });
  switcher.appendChild(linkedinButton);

  let emailButton: HTMLButtonElement | null = null;
  if (details.email) {
    emailButton = document.createElement("button");
    emailButton.type = "button";
    emailButton.className = "proposal-draft-channel-button";
    emailButton.innerHTML = "<span aria-hidden='true'>✉</span> Email";
    emailButton.setAttribute("role", "tab");
    emailButton.setAttribute("aria-selected", "false");
    emailButton.addEventListener("click", () => {
      emailButton?.classList.add("is-active");
      emailButton?.setAttribute("aria-selected", "true");
      linkedinButton.classList.remove("is-active");
      linkedinButton.setAttribute("aria-selected", "false");
      setDraftModalContent(details, "email");
    });
    switcher.appendChild(emailButton);
  }

  textarea.parentElement?.insertBefore(switcher, textarea);

  if (details.email) {
    const mailtoButton = document.createElement("a");
    mailtoButton.href = `mailto:${details.email}?subject=${encodeURIComponent(`${ROLE_CONTEXT[details.slug]?.role || "Opportunity"} — quick introduction`)}&body=${encodeURIComponent(buildEmailDraft(details).replace(/^Subject:.*\n\n/, ""))}`;
    mailtoButton.className = "proposal-email-open-button";
    mailtoButton.innerHTML = "<span aria-hidden='true'>✉</span> Open email";
    mailtoButton.setAttribute("aria-label", `Open email to ${details.name}`);
    actionRow.insertBefore(mailtoButton, actionRow.firstChild);
  }

  setDraftModalContent(details, "linkedin");

  originalCopyButton.addEventListener("click", (event) => {
    const currentTextarea = modal.querySelector("textarea") as HTMLTextAreaElement | null;
    const message = currentTextarea?.value || currentTextarea?.dataset.currentDraft || "";
    if (!message) return;
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(message).then(() => {
      originalCopyButton.textContent = "Copied";
      window.setTimeout(() => { originalCopyButton.textContent = "Copy message"; }, 1200);
    });
  }, true);
};

const enhanceContactCards = () => {
  if (window.location.pathname !== "/company") return;

  const articles = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article")) as HTMLElement[];
  articles.forEach((article) => {
    Array.from(article.querySelectorAll("span")).forEach((span) => {
      if (span.textContent?.trim().toLowerCase() === "linkedin contacts") span.remove();
    });

    Array.from(article.querySelectorAll("span")).forEach((span) => {
      const text = span.textContent || "";
      if (text.startsWith("Job posted:")) span.innerHTML = text.replace("Job posted:", "<strong>Job posted:</strong>");
      if (text.startsWith("Round added:")) span.innerHTML = text.replace("Round added:", "<strong>Round added:</strong>");
    });
  });

  const contactCards = Array.from(document.querySelectorAll("main > section:nth-of-type(3) article > div:nth-child(2) > div > div")) as HTMLElement[];
  contactCards.forEach((card) => {
    if (card.dataset.outreachEnhanced === "true") return;
    const details = getContactDetails(card);
    if (!details.name || !details.linkedin) return;
    card.dataset.outreachEnhanced = "true";
    card.classList.add("proposal-contact-card-enhanced");

    const header = card.querySelector(":scope > div:first-child") as HTMLElement | null;
    const actionRow = card.querySelector(":scope > div:last-child") as HTMLElement | null;
    const draftButton = actionRow?.querySelector("button") as HTMLButtonElement | null;
    const linkedInLabel = actionRow?.querySelector("label") as HTMLLabelElement | null;
    if (!header || !actionRow || !draftButton || !linkedInLabel) return;

    const detailsBlock = document.createElement("div");
    detailsBlock.className = "proposal-contact-detail-block";
    const nameLink = header.querySelector("a") as HTMLAnchorElement | null;
    if (nameLink) detailsBlock.appendChild(nameLink);

    const statusControls = document.createElement("div");
    statusControls.className = "proposal-contact-status-controls";

    const linkedInInput = linkedInLabel.querySelector("input") as HTMLInputElement | null;
    if (linkedInInput) {
      linkedInLabel.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = " LinkedIn Messaged";
      });
      const linkedInKey = getContactStatusKey(details, "linkedin");
      linkedInInput.checked = Boolean(getLocalStatuses()[linkedInKey] || linkedInInput.checked);
      linkedInInput.addEventListener("change", () => saveOutreachStatus(linkedInKey, linkedInInput.checked, { slug: details.slug, name: details.name, title: details.title, linkedin: details.linkedin }));
      statusControls.appendChild(linkedInLabel);
    }

    if (details.email) {
      const emailLabel = document.createElement("label");
      emailLabel.className = "inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground";
      const emailInput = document.createElement("input");
      emailInput.type = "checkbox";
      emailInput.className = "h-4 w-4";
      const emailKey = getContactStatusKey(details, "email");
      emailInput.checked = Boolean(getLocalStatuses()[emailKey]);
      emailInput.addEventListener("change", () => saveOutreachStatus(emailKey, emailInput.checked, { slug: details.slug, name: details.name, title: details.title, linkedin: details.linkedin }));
      emailLabel.appendChild(emailInput);
      emailLabel.appendChild(document.createTextNode(" Emailed"));
      statusControls.appendChild(emailLabel);
    }

    detailsBlock.appendChild(statusControls);
    const badges = header.querySelector(":scope > div") as HTMLElement | null;
    if (badges) detailsBlock.appendChild(badges);

    draftButton.textContent = "Draft message";
    draftButton.addEventListener("click", () => {
      window.setTimeout(() => enhanceDraftModal(details), 50);
      window.setTimeout(() => enhanceDraftModal(details), 200);
    });

    actionRow.innerHTML = "";
    actionRow.className = "proposal-contact-action-block";
    actionRow.appendChild(draftButton);
    header.innerHTML = "";
    header.className = "proposal-contact-card-grid";
    header.appendChild(detailsBlock);
    header.appendChild(actionRow);
  });
};

const bootProposalDirectoryEnhancements = () => {
  styleProposalDirectoryHero();
  removeProposalHeaderContactButton();
  cleanExpiredSessionNotice();
  transformMainProposalFilter();
  enhanceContactCards();
};

const bootFloatingProposalFilter = () => {
  window.setTimeout(bootProposalDirectoryEnhancements, 100);
  window.setTimeout(bootProposalDirectoryEnhancements, 500);
  window.setTimeout(bootProposalDirectoryEnhancements, 1200);
  window.setTimeout(bootProposalDirectoryEnhancements, 2200);
  window.setTimeout(bootProposalDirectoryEnhancements, 3600);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootFloatingProposalFilter);
} else {
  bootFloatingProposalFilter();
}
