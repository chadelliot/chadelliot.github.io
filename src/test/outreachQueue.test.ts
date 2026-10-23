import { describe, expect, it } from "vitest";
import { buildLeadRows, countByUrgency, sortRows, daysBetween } from "@/lib/outreachQueue";
import type { Company, ProjectContact, ContactProgress } from "@/lib/projectContacts";

const now = new Date(2026, 9, 23, 10, 0, 0); // local Oct 23 2026
const company: Company = { id: "c1", name: "Acme", normalized_name: "acme", company_stage: "new_signal" };
const mk = (id: string, extra: Partial<ProjectContact> = {}): ProjectContact => ({
  id, company: "Acme", company_id: "c1", contact_name: id, email: `${id}@acme.test`, needs_research: false, do_not_contact: false, ...extra,
});
const iso = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();
const build = (contacts: ProjectContact[], progress: Record<string, Partial<ContactProgress>>, followUpSupported = true) =>
  buildLeadRows({
    contacts,
    progress: Object.fromEntries(Object.entries(progress).map(([k, v]) => [k, { contact_id: k, status: "not_contacted", updated_at: iso(1), ...v } as ContactProgress])),
    companies: [company], signalsByCompanyId: {}, meetingBlocks: {}, followUpSupported, now,
  });

describe("outreach queue", () => {
  it("classifies urgency from follow-up date, status and age", () => {
    const rows = build(
      [mk("a"), mk("b"), mk("c"), mk("d"), mk("e"), mk("f")],
      {
        a: {}, // never contacted
        b: { status: "introduction_sent", follow_up_at: "2026-10-21" }, // 2 days overdue
        c: { status: "connection_sent", follow_up_at: "2026-10-23" },
        d: { status: "connection_sent", updated_at: iso(9) }, // no follow-up, quiet
        e: { status: "connection_sent", updated_at: iso(1) },
        f: { status: "do_not_contact" },
      }
    );
    const u = Object.fromEntries(rows.map((r) => [r.contact.id, r.urgency]));
    expect(u).toEqual({ a: "first_contact", b: "overdue", c: "due_today", d: "stale", e: "waiting", f: "closed" });
    expect(rows.find((r) => r.contact.id === "b")!.days).toBe(2);
  });

  it("treats a sent email as contacted even when status is still not_contacted", () => {
    const [row] = build([mk("a")], { a: { email_sequence_position: 1 } });
    expect(row.contacted).toBe(true);
    expect(row.urgency).not.toBe("first_contact");
    expect(row.stageLabel).toBe("Email 1 of 3 sent");
  });

  it("ignores follow-up fields when the migration is not present", () => {
    const [row] = build([mk("a")], { a: { status: "connection_sent", follow_up_at: "2026-10-01", updated_at: iso(1) } }, false);
    expect(row.followUpAt).toBeNull();
    expect(row.urgency).toBe("waiting");
  });

  it("sorts overdue (most overdue first) ahead of first contact", () => {
    const rows = sortRows(
      build([mk("a"), mk("b"), mk("c")], {
        a: {},
        b: { status: "connection_sent", follow_up_at: "2026-10-22" },
        c: { status: "connection_sent", follow_up_at: "2026-10-15" },
      }),
      "priority"
    );
    expect(rows.map((r) => r.contact.id)).toEqual(["c", "b", "a"]);
    expect(countByUrgency(rows).overdue).toBe(2);
  });

  it("counts calendar days across month ends", () => {
    expect(daysBetween("2026-10-30", "2026-11-02")).toBe(3);
  });
});
