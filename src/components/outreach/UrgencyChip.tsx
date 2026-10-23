import { CalendarClock, CircleDashed, Clock, Lock, Search, Send, TriangleAlert } from "lucide-react";
import { URGENCY_LABEL, formatDueLabel, type LeadRow, type Urgency } from "@/lib/outreachQueue";

// Colour carries meaning but stays quiet: only the three "act now" states get
// a soft tint; everything else is plain muted text. Every state also has an
// icon and a word, so nothing depends on colour alone.
const STYLE: Record<Urgency, { cls: string; Icon: typeof Clock }> = {
  overdue: { cls: "bg-rh-red-soft text-rh-red", Icon: TriangleAlert },
  due_today: { cls: "bg-rh-amber-soft text-rh-amber", Icon: CalendarClock },
  first_contact: { cls: "bg-rh-teal-soft text-rh-teal-ink", Icon: Send },
  stale: { cls: "text-rh-amber", Icon: Clock },
  upcoming: { cls: "text-rh-muted", Icon: CalendarClock },
  waiting: { cls: "text-rh-muted", Icon: CircleDashed },
  needs_research: { cls: "text-rh-muted", Icon: Search },
  closed: { cls: "text-rh-muted", Icon: Lock },
};

export const UrgencyChip = ({ row, showDetail = false }: { row: LeadRow; showDetail?: boolean }) => (
  <UrgencyBadge urgency={row.urgency} text={row.urgency === "overdue" && showDetail ? formatDueLabel(row) : undefined} />
);

export const UrgencyBadge = ({ urgency, text: override }: { urgency: Urgency; text?: string }) => {
  const { cls, Icon } = STYLE[urgency];
  const tinted = cls.includes("bg-");
  const text = override ?? URGENCY_LABEL[urgency];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium ${tinted ? "rounded-md px-2 py-1" : ""} ${cls}`}>
      <Icon size={12} strokeWidth={2.25} aria-hidden="true" />
      {text}
    </span>
  );
};
