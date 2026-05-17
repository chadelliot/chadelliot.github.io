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

const getMainFilterElements = () => {
  const sourceSortSelect = document.querySelector("main section select") as HTMLSelectElement | null;
  const sourceCheckbox = document.querySelector("main section input[type='checkbox']") as HTMLInputElement | null;
  const sourceSection = sourceSortSelect?.closest("section") as HTMLElement | null;
  const typeButtons = Array.from(document.querySelectorAll("main section button")).filter((button) => {
    const label = button.textContent?.trim() || "";
    return label === "All types" || label.includes("Agency") || label.includes("Marketplace") || label.includes("Company Direct");
  }) as HTMLButtonElement[];

  return { sourceSortSelect, sourceCheckbox, sourceSection, typeButtons };
};

const createTypeSelect = (typeButtons: HTMLButtonElement[], className: string) => {
  const typeSelect = document.createElement("select");
  typeSelect.className = className;
  typeSelect.setAttribute("aria-label", "Filter by job type");
  typeButtons.forEach((button, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = button.textContent?.trim() || `Type ${index + 1}`;
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

const createFloatingProposalFilter = () => {
  if (!window.location.pathname.startsWith("/company")) return;
  if (window.location.pathname !== "/company") return;
  if (document.querySelector(".proposal-floating-filter")) return;

  styleProposalDirectoryHero();
  removeProposalHeaderContactButton();
  transformMainProposalFilter();

  const { sourceSortSelect, sourceCheckbox, sourceSection, typeButtons } = getMainFilterElements();
  if (!sourceSortSelect || !sourceCheckbox || !sourceSection || !typeButtons.length) return;

  const wrapper = document.createElement("div");
  wrapper.className = "proposal-floating-filter";
  wrapper.setAttribute("aria-hidden", "true");

  const inner = document.createElement("div");
  inner.className = "proposal-floating-filter__inner";

  const label = document.createElement("div");
  label.className = "proposal-floating-filter__label";
  label.textContent = "Filter proposals";

  const typeSelect = createTypeSelect(typeButtons, "");

  const sortSelect = sourceSortSelect.cloneNode(true) as HTMLSelectElement;
  sortSelect.setAttribute("aria-label", "Sort proposals");
  sortSelect.value = sourceSortSelect.value;
  sortSelect.addEventListener("change", () => {
    sourceSortSelect.value = sortSelect.value;
    sourceSortSelect.dispatchEvent(new Event("change", { bubbles: true }));
  });

  const checkboxLabel = document.createElement("label");
  checkboxLabel.className = "proposal-floating-filter__toggle";
  const checkbox = sourceCheckbox.cloneNode(true) as HTMLInputElement;
  checkbox.checked = sourceCheckbox.checked;
  checkbox.addEventListener("change", () => {
    sourceCheckbox.checked = checkbox.checked;
    sourceCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
  });
  const checkboxText = document.createElement("span");
  checkboxText.textContent = "Show contacted";
  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(checkboxText);

  inner.appendChild(label);
  inner.appendChild(typeSelect);
  inner.appendChild(sortSelect);
  inner.appendChild(checkboxLabel);
  wrapper.appendChild(inner);
  document.body.appendChild(wrapper);

  const syncFromSource = () => {
    sortSelect.value = sourceSortSelect.value;
    checkbox.checked = sourceCheckbox.checked;
    syncTypeSelect(typeButtons, typeSelect);
  };

  sourceSortSelect.addEventListener("change", syncFromSource);
  sourceCheckbox.addEventListener("change", syncFromSource);
  typeButtons.forEach((button) => button.addEventListener("click", () => window.setTimeout(syncFromSource, 0)));

  const onScroll = () => {
    const rect = sourceSection.getBoundingClientRect();
    const shouldShow = rect.bottom < 0;
    wrapper.classList.toggle("is-visible", shouldShow);
    wrapper.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  };

  syncFromSource();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
};

const bootFloatingProposalFilter = () => {
  window.setTimeout(styleProposalDirectoryHero, 100);
  window.setTimeout(styleProposalDirectoryHero, 600);
  window.setTimeout(removeProposalHeaderContactButton, 250);
  window.setTimeout(removeProposalHeaderContactButton, 800);
  window.setTimeout(removeProposalHeaderContactButton, 1800);
  window.setTimeout(transformMainProposalFilter, 500);
  window.setTimeout(transformMainProposalFilter, 1200);
  window.setTimeout(createFloatingProposalFilter, 800);
  window.setTimeout(createFloatingProposalFilter, 1800);
  window.setTimeout(createFloatingProposalFilter, 3200);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootFloatingProposalFilter);
} else {
  bootFloatingProposalFilter();
}
