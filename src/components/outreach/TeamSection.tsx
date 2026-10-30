import type { FormEvent } from "react";
import { CalendarCheck, Trophy } from "lucide-react";
import { STATUS_LABELS, type ClosedDeal, type ContactStatus, type Meeting, type ProjectContact, type TeamMember } from "@/lib/projectContacts";

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rh-teal-bright/70 focus-visible:ring-offset-1";
const FIELD = `h-9 w-full rounded-lg border border-rh-line bg-white px-2.5 text-[13px] text-rh-ink hover:border-rh-line-strong ${FOCUS}`;
const CARD = "rounded-2xl border border-rh-line bg-white shadow-[0_1px_2px_rgba(21,23,28,0.03)]";
const STATUS_COLUMNS: ContactStatus[] = ["not_contacted", "connection_sent", "connection_accepted", "introduction_sent", "follow_up_sent", "meeting_set", "do_not_contact"];

type Props = {
  teamMembers: TeamMember[];
  teamMembersWithLogin: TeamMember[];
  statusCountsByMember: Record<string, Record<ContactStatus, number>>;
  meetings: Meeting[];
  closedDeals: ClosedDeal[];
  contacts: ProjectContact[];
  onChangeRole: (memberId: string, role: "owner" | "member") => void;
  deal: { company: string; creditedTo: string; date: string; notes: string };
  onDealChange: (patch: Partial<{ company: string; creditedTo: string; date: string; notes: string }>) => void;
  onSaveDeal: (event: FormEvent<HTMLFormElement>) => void;
};

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

const TeamSection = ({ teamMembers, teamMembersWithLogin, statusCountsByMember, meetings, closedDeals, contacts, onChangeRole, deal, onDealChange, onSaveDeal }: Props) => (
  <div className="space-y-6">
    {/* Roster + pipeline by person, one table */}
    <section aria-labelledby="team-h" className={`${CARD} overflow-hidden`}>
      <div className="border-b border-rh-line px-5 py-4">
        <h2 id="team-h" className="text-[15px] font-semibold text-rh-ink">Team</h2>
        <p className="mt-0.5 text-[13px] text-rh-muted">Roles and where each person’s contacts stand.</p>
      </div>
      {teamMembersWithLogin.length === 0 ? (
        <p className="px-6 py-14 text-center text-[13px] text-rh-muted">No team members yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-rh-line bg-rh-canvas/60 text-left text-xs font-medium text-rh-muted">
                <th scope="col" className="px-5 py-2.5">Person</th>
                <th scope="col" className="px-3 py-2.5">Role</th>
                {STATUS_COLUMNS.map((s) => <th key={s} scope="col" className="px-3 py-2.5 text-right">{STATUS_LABELS[s]}</th>)}
              </tr>
            </thead>
            <tbody>
              {teamMembersWithLogin.map((member) => {
                const c = statusCountsByMember[member.id];
                return (
                  <tr key={member.id} className="border-b border-rh-line last:border-0 hover:bg-rh-canvas/50">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rh-canvas text-xs font-semibold text-rh-body ring-1 ring-inset ring-rh-line" aria-hidden="true">{initials(member.name)}</span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-rh-ink">{member.name}</span>
                          <span className="block truncate text-xs text-rh-muted">{member.email}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <label className="sr-only" htmlFor={`role-${member.id}`}>Role for {member.name}</label>
                      <select id={`role-${member.id}`} value={member.role} onChange={(e) => onChangeRole(member.id, e.target.value as "owner" | "member")} className={`h-8 rounded-lg border border-rh-line bg-white px-2 text-[13px] text-rh-body hover:border-rh-line-strong ${FOCUS}`}>
                        <option value="member">Member</option>
                        <option value="owner">Owner</option>
                      </select>
                    </td>
                    {STATUS_COLUMNS.map((s) => {
                      const n = c?.[s] ?? 0;
                      return <td key={s} className={`px-3 py-3 text-right tabular-nums ${n ? "text-rh-ink" : "text-rh-faint"}`}>{n}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>

    <div className="grid gap-6 lg:grid-cols-2">
      <section aria-labelledby="meet-h" className={CARD}>
        <div className="flex items-center gap-2 border-b border-rh-line px-5 py-4">
          <CalendarCheck size={15} className="text-rh-muted" aria-hidden="true" />
          <h2 id="meet-h" className="text-[15px] font-semibold text-rh-ink">Meetings set <span className="font-normal text-rh-muted tabular-nums">{meetings.length}</span></h2>
        </div>
        {meetings.length === 0 ? <p className="px-5 py-10 text-center text-[13px] text-rh-muted">No meetings logged yet.</p> : (
          <ul>
            {meetings.map((m) => {
              const contact = contacts.find((c) => c.id === m.contact_id);
              const setter = teamMembers.find((t) => t.id === m.set_by);
              return (
                <li key={m.id} className="border-b border-rh-line px-5 py-3 last:border-0">
                  <p className="text-[13px] font-medium text-rh-ink">{contact?.company ?? "Unknown company"}{contact?.contact_name ? <span className="font-normal text-rh-muted"> · {contact.contact_name}</span> : null}</p>
                  <p className="text-xs text-rh-muted">{m.meeting_date} · set by {setter?.name ?? "unassigned"}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="deal-h" className={CARD}>
        <div className="flex items-center gap-2 border-b border-rh-line px-5 py-4">
          <Trophy size={15} className="text-rh-muted" aria-hidden="true" />
          <h2 id="deal-h" className="text-[15px] font-semibold text-rh-ink">Closed deals <span className="font-normal text-rh-muted tabular-nums">{closedDeals.length}</span></h2>
        </div>
        <form onSubmit={onSaveDeal} className="grid gap-3 border-b border-rh-line bg-rh-canvas/50 px-5 py-4 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-medium text-rh-body">Company
            <input type="text" value={deal.company} onChange={(e) => onDealChange({ company: e.target.value })} required className={FIELD} />
          </label>
          <label className="grid gap-1 text-xs font-medium text-rh-body">Credit to
            <select value={deal.creditedTo} onChange={(e) => onDealChange({ creditedTo: e.target.value })} className={FIELD}>
              <option value="">Unassigned</option>
              {teamMembersWithLogin.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-medium text-rh-body">Contract signed
            <input type="date" value={deal.date} onChange={(e) => onDealChange({ date: e.target.value })} required className={FIELD} />
          </label>
          <label className="grid gap-1 text-xs font-medium text-rh-body">Notes
            <input type="text" value={deal.notes} onChange={(e) => onDealChange({ notes: e.target.value })} className={FIELD} />
          </label>
          <button type="submit" className={`h-9 rounded-lg bg-rh-teal px-4 text-[13px] font-semibold text-white hover:bg-rh-teal-ink sm:col-span-2 ${FOCUS}`}>Log closed deal</button>
        </form>
        {closedDeals.length === 0 ? <p className="px-5 py-10 text-center text-[13px] text-rh-muted">No closed deals logged yet.</p> : (
          <ul>
            {closedDeals.map((d) => {
              const credited = teamMembers.find((t) => t.id === d.credited_to);
              return (
                <li key={d.id} className="border-b border-rh-line px-5 py-3 last:border-0">
                  <p className="text-[13px] font-medium text-rh-ink">{d.company}</p>
                  <p className="text-xs text-rh-muted">{d.contract_signed_date} · credited to {credited?.name ?? "unassigned"}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  </div>
);

export default TeamSection;
