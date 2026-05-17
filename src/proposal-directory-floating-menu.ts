const createFloatingProposalFilter = () => {
  if (!window.location.pathname.startsWith("/company")) return;
  if (window.location.pathname !== "/company") return;
  if (document.querySelector(".proposal-floating-filter")) return;

  const sourceSelect = document.querySelector("main section select") as HTMLSelectElement | null;
  const sourceCheckbox = document.querySelector("main section input[type='checkbox']") as HTMLInputElement | null;
  const sourceSection = sourceSelect?.closest("section") as HTMLElement | null;

  if (!sourceSelect || !sourceCheckbox || !sourceSection) return;

  const wrapper = document.createElement("div");
  wrapper.className = "proposal-floating-filter";
  wrapper.setAttribute("aria-hidden", "true");

  const inner = document.createElement("div");
  inner.className = "proposal-floating-filter__inner";

  const label = document.createElement("div");
  label.className = "proposal-floating-filter__label";
  label.textContent = "Filter proposals";

  const select = sourceSelect.cloneNode(true) as HTMLSelectElement;
  select.value = sourceSelect.value;
  select.addEventListener("change", () => {
    sourceSelect.value = select.value;
    sourceSelect.dispatchEvent(new Event("change", { bubbles: true }));
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
  inner.appendChild(select);
  inner.appendChild(checkboxLabel);
  wrapper.appendChild(inner);
  document.body.appendChild(wrapper);

  const syncFromSource = () => {
    select.value = sourceSelect.value;
    checkbox.checked = sourceCheckbox.checked;
  };

  sourceSelect.addEventListener("change", syncFromSource);
  sourceCheckbox.addEventListener("change", syncFromSource);

  const onScroll = () => {
    const rect = sourceSection.getBoundingClientRect();
    const shouldShow = rect.bottom < 0;
    wrapper.classList.toggle("is-visible", shouldShow);
    wrapper.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
};

const bootFloatingProposalFilter = () => {
  window.setTimeout(createFloatingProposalFilter, 800);
  window.setTimeout(createFloatingProposalFilter, 1800);
  window.setTimeout(createFloatingProposalFilter, 3200);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootFloatingProposalFilter);
} else {
  bootFloatingProposalFilter();
}
