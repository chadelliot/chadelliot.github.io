import type { ReactNode } from "react";

// Shared page header so every screen in the app opens the same way: a calm
// title, one line of context, and the primary action(s) on the right.
const PageHeader = ({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0">
      <h1 className="font-display text-[28px] font-semibold leading-none tracking-[-0.02em] text-rh-ink">{title}</h1>
      {subtitle ? <p className="mt-2 text-[13px] text-rh-muted">{subtitle}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
  </div>
);

export default PageHeader;
