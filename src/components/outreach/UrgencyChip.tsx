import { AlertTriangle, CalendarClock, CircleDot, Clock, Lock, Search, Send } from "lucide-react";
import { URGENCY_LABEL, formatDueLabel, type LeadRow, type Urgency } from "@/lib/outreachQueue";

// Status colours carry meaning only; every one is paired with an icon and
// text so nothing depends on colour alone.
const STYLE: Record<Urgency, { cls: string; Icon: typeof Clock }> = {
  overdue: { cls: "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]", Icon: AlertTriangle },
  due_today: { cls: "border-[#FCD34D] bg-[#FFFBEB] text-[#92400E]", Icon: CalendarClock },
  first_contact: { cls: "border-[#A7DFC9] bg-[#F0FBF6] text-[#0F6E56]", Icon: Send },
  stale: { cls: "border-[#E5D3A8] bg-[#FBF7EC] text-[#7A5A12]", Icon: Clock },
  upcoming: { cls: "border-[#D8D6CE] bg-white text-[#3E4C59]", Icon: CalendarClock },
  waiting: { cls: "border-[#D8D6CE] bg-white text-[#3E4C59]", Icon: CircleDot },
  needs_research: { cls: "border-[#D8D6CE] bg-[#F5F4F0] text-[#3E4C59]", Icon: Search },
  closed: { cls: "border-[#E4E2DA] bg-[#F5F4F0] text-[#52606D]", Icon: Lock },
};

export const UrgencyChip = ({ row, showDetail = false }: { row: LeadRow; showDetail?: boolean }) => {
  const { cls, Icon } = STYLE[row.urgency];
  const detail = showDetail ? formatDueLabel(row) : "";
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      <Icon size={12} aria-hidden="true" />
      {row.urgency === "overdue" && showDetail ? detail : URGENCY_LABEL[row.urgency]}
    </span>
  );
};
