import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, Mail, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { bookSlot, fetchAvailableSlots } from "@/lib/projectContacts";

// This public team-member ID identifies Chad's already connected Audaption
// Google Calendar. It is not an OAuth credential or a secret.
const CHAD_REP_ID = "6bcb92db-2e21-4be9-8fd8-dceb085d4970";

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

const BookCallPage = () => {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");
  const [selected, setSelected] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookError, setBookError] = useState("");
  const [booked, setBooked] = useState(false);
  const [eventUrl, setEventUrl] = useState("");
  const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "your local time";

  const loadSlots = async () => {
    setLoading(true);
    setAvailabilityError("");
    try {
      const response = await fetchAvailableSlots(CHAD_REP_ID);
      if (response.error) setAvailabilityError(response.error);
      setSlots((response.slots || []).slice().sort());
    } catch {
      setAvailabilityError("Live availability is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSlots();
    // Load once when the public booking page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = useMemo(() => {
    const grouped = new Map<string, string[]>();
    slots.forEach((slot) => {
      const key = dayLabel(slot);
      grouped.set(key, [...(grouped.get(key) || []), slot]);
    });
    return Array.from(grouped.entries());
  }, [slots]);

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    setSaving(true);
    setBookError("");
    const details = [
      company.trim() ? "Company: " + company.trim() : "",
      topic.trim() ? "Discussion: " + topic.trim() : "",
      notes.trim() ? "Notes: " + notes.trim() : "",
      "Scheduled via AboutChad.com",
    ].filter(Boolean).join("\n");
    try {
      const result = await bookSlot(CHAD_REP_ID, selected, name.trim(), email.trim(), details);
      if (result.success) {
        setEventUrl(result.eventLink || "");
        setBooked(true);
      } else {
        setBookError(result.error || "That time is no longer available. Please choose another.");
      }
    } catch {
      setBookError("The reservation could not be completed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      <main className="mx-auto max-w-[1120px] px-6 py-12 md:px-12 md:py-20">
        <Link to="/contact" className="mb-10 inline-flex items-center gap-2 text-[12px] font-medium text-muted-foreground no-underline hover:text-primary">
          <ArrowLeft size={15} /> Contact
        </Link>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <section>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1.5">
              <CalendarDays size={14} className="text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Schedule a conversation</span>
            </div>
            <h1 className="font-display text-[42px] font-extrabold leading-[1.06] tracking-tight text-foreground md:text-[56px]">
              Let's <em className="not-italic text-primary">Talk</em>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-muted-foreground">
              Exploring a growth opportunity, a commercial challenge, or a potential partnership?
              Choose a time below and we'll talk through what's on your mind.
            </p>
            <div className="mt-9 space-y-4 border-t border-border pt-8 text-[13px] text-foreground">
              <div className="flex items-center gap-3"><Clock3 size={17} className="text-primary" /> 30-minute introductory conversation</div>
              <div className="flex items-center gap-3"><Video size={17} className="text-primary" /> Google Meet link included in the invitation</div>
              <div className="flex items-center gap-3"><CalendarDays size={17} className="text-primary" /> Times displayed in {browserZone}</div>
            </div>
            <p className="mt-9 text-[12px] leading-[1.8] text-muted-foreground">
              Prefer email? <a href="mailto:cparker@audaption.com" className="font-semibold text-primary">cparker@audaption.com</a>
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8" aria-label="Book a call">
            {booked ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center" role="status">
                <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 size={32} className="text-primary" /></span>
                <h2 className="font-display text-[27px] font-extrabold text-foreground">You're booked.</h2>
                <p className="mt-3 max-w-sm text-[14px] leading-7 text-muted-foreground">
                  A calendar invitation with the meeting details has been sent to {email}.
                </p>
                <p className="mt-4 text-[13px] font-semibold text-foreground">{dayLabel(selected)} at {timeLabel(selected)}</p>
                {eventUrl ? <a href={eventUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">View calendar event <ArrowRight size={15} /></a> : null}
                <Link to="/" className="mt-8 text-[12px] text-muted-foreground hover:text-primary">Return to About Chad</Link>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Introductory Conversation</p>
                    <h2 className="mt-2 font-display text-[23px] font-extrabold text-foreground">Find a time that works.</h2>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">30 min</span>
                </div>

                {loading ? <p className="py-12 text-center text-[13px] text-muted-foreground" role="status">Checking live availability…</p> : null}
                {availabilityError ? (
                  <div className="my-7 rounded-lg border border-border bg-background p-5 text-[13px] leading-7 text-muted-foreground" role="alert">
                    <p>{availabilityError}</p>
                    <button type="button" onClick={() => void loadSlots()} className="mt-3 font-semibold text-primary hover:underline">Try again</button>
                    <p className="mt-2">Or <a href="mailto:cparker@audaption.com" className="text-primary underline">send an email</a> to coordinate directly.</p>
                  </div>
                ) : null}

                {!loading && !availabilityError && !selected && days.length === 0 ? (
                  <div className="py-10 text-center text-[13px] leading-7 text-muted-foreground">
                    No open times are available right now. <a href="mailto:cparker@audaption.com" className="font-semibold text-primary">Email me instead</a>.
                  </div>
                ) : null}

                {!selected && !availabilityError ? (
                  <div className="mt-6 space-y-6">
                    {days.map(([day, times]) => (
                      <div key={day}>
                        <h3 className="mb-3 text-[12px] font-bold text-foreground">{day}</h3>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {times.map((iso) => (
                            <button key={iso} type="button" onClick={() => { setSelected(iso); setBookError(""); }}
                              className="rounded-md border border-border bg-background px-2 py-3 text-[12px] font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                              {timeLabel(iso)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {selected ? (
                  <form onSubmit={(event) => void handleConfirm(event)} className="mt-6 space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-primary/25 bg-primary/[0.05] px-4 py-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Selected time</p>
                        <p className="mt-1 text-[13px] font-bold text-foreground">{dayLabel(selected)} at {timeLabel(selected)}</p>
                      </div>
                      <button type="button" onClick={() => { setSelected(""); setBookError(""); void loadSlots(); }} className="text-[11px] font-semibold text-primary hover:underline">Change</button>
                    </div>
                    <label className="block text-[12px] font-semibold text-foreground">Your name *
                      <input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Full name" className="mt-2 block w-full rounded-md border border-border bg-background px-4 py-3 text-[14px] font-normal outline-none focus:border-primary" />
                    </label>
                    <label className="block text-[12px] font-semibold text-foreground">Your email *
                      <input required type="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@company.com" className="mt-2 block w-full rounded-md border border-border bg-background px-4 py-3 text-[14px] font-normal outline-none focus:border-primary" />
                    </label>
                    <label className="block text-[12px] font-semibold text-foreground">Company (optional)
                      <input maxLength={120} value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" placeholder="Company or organization" className="mt-2 block w-full rounded-md border border-border bg-background px-4 py-3 text-[14px] font-normal outline-none focus:border-primary" />
                    </label>
                    <label className="block text-[12px] font-semibold text-foreground">What would you like to discuss?
                      <select value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-2 block w-full rounded-md border border-border bg-background px-4 py-3 text-[14px] font-normal outline-none focus:border-primary">
                        <option value="">Select a topic (optional)</option>
                        <option value="GTM and growth strategy">GTM & growth strategy</option>
                        <option value="Commercial intelligence and data">Commercial intelligence & data</option>
                        <option value="Fractional leadership / advisory">Fractional leadership or advisory</option>
                        <option value="Partnership or other">Partnership or other</option>
                      </select>
                    </label>
                    <label className="block text-[12px] font-semibold text-foreground">Anything else? (optional)
                      <textarea maxLength={650} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="A little background is helpful." className="mt-2 block w-full resize-y rounded-md border border-border bg-background px-4 py-3 text-[14px] font-normal outline-none focus:border-primary" />
                    </label>
                    {bookError ? <p className="text-[12px] leading-6 text-red-700" role="alert">{bookError}</p> : null}
                    <button type="submit" disabled={saving || !name.trim() || !email.trim()}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                      {saving ? "Confirming…" : "Confirm Meeting"} <ArrowRight size={15} />
                    </button>
                    <p className="text-center text-[11px] leading-6 text-muted-foreground">
                      Your details are used to send the calendar invitation and prepare for our conversation.
                    </p>
                  </form>
                ) : null}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookCallPage;
