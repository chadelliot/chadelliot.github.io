const getMonthCount = (source: string) => {
  const rangeMatch = source.match(/(\d+)\s*(?:-|–|—|to)\s*(\d+)\s*-?\s*months?/i);
  if (rangeMatch) return Number(rangeMatch[2]);

  const hyphenatedMonthMatch = source.match(/(\d+)\s*-\s*months?/i);
  if (hyphenatedMonthMatch) return Number(hyphenatedMonthMatch[1]);

  const monthMatch = source.match(/(\d+)\s*months?/i);
  if (monthMatch) return Number(monthMatch[1]);

  const weekRangeMatch = source.match(/(\d+)\s*(?:-|–|—|to)\s*(\d+)\s*-?\s*weeks?/i);
  if (weekRangeMatch) return Math.max(1, Math.ceil(Number(weekRangeMatch[2]) / 4));

  return null;
};

const getPhaseLabels = (source: string, count: number) => {
  const months = getMonthCount(source);

  if (months && months >= 12) return ["Weeks 1–4", "Months 2–4", "Months 5–12"].slice(0, count);
  if (months && months >= 6) return ["Weeks 1–3", "Months 2–3", "Months 4–6"].slice(0, count);
  if (months && months >= 4) return ["Weeks 1–2", "Weeks 3–8", "Weeks 9–16"].slice(0, count);
  if (months && months >= 3) return ["Weeks 1–2", "Weeks 3–6", "Weeks 7–12"].slice(0, count);

  if (/weekly|week-to-week|part-time|hours\/week|hrs\/week|contract|fractional|project-based/i.test(source)) {
    return ["Week 1", "Weeks 2–3", "Ongoing cadence"].slice(0, count);
  }

  return [];
};

const normalizeProposalPhaseTimelines = () => {
  if (!window.location.pathname.startsWith("/company/") || window.location.pathname === "/company") return;

  const proposalSection = Array.from(document.querySelectorAll("main > section")).find((section) =>
    section.textContent?.includes("Recommended proposal"),
  ) as HTMLElement | undefined;

  if (!proposalSection || proposalSection.dataset.timelineNormalized === "true") return;

  const durationCandidates = Array.from(proposalSection.querySelectorAll("p")).filter((paragraph) => {
    const text = paragraph.textContent?.trim() || "";
    return /(\d+)\s*-?\s*(month|week)s?|engagement|ongoing cadence|contract/i.test(text)
      && paragraph.className.includes("text-primary");
  }) as HTMLParagraphElement[];

  if (durationCandidates.length < 2) return;

  const source = `${document.body.textContent || ""}`;
  const labels = getPhaseLabels(source, durationCandidates.length);
  if (!labels.length) return;

  durationCandidates.forEach((paragraph, index) => {
    if (labels[index]) paragraph.textContent = labels[index];
  });

  proposalSection.dataset.timelineNormalized = "true";
};

const bootProposalPhaseTimelines = () => {
  window.setTimeout(normalizeProposalPhaseTimelines, 250);
  window.setTimeout(normalizeProposalPhaseTimelines, 900);
  window.setTimeout(normalizeProposalPhaseTimelines, 1800);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootProposalPhaseTimelines);
} else {
  bootProposalPhaseTimelines();
}
