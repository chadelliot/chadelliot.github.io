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
      window.localStorage.removeItem("aboutchad_proposal_directory_session_v1");
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

const bootProposalDirectoryEnhancements = () => {
  styleProposalDirectoryHero();
  removeProposalHeaderContactButton();
  cleanExpiredSessionNotice();
  transformMainProposalFilter();
};

const bootFloatingProposalFilter = () => {
  window.setTimeout(bootProposalDirectoryEnhancements, 100);
  window.setTimeout(bootProposalDirectoryEnhancements, 500);
  window.setTimeout(bootProposalDirectoryEnhancements, 1200);
  window.setTimeout(bootProposalDirectoryEnhancements, 2200);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootFloatingProposalFilter);
} else {
  bootFloatingProposalFilter();
}
