import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAvailableSlots, bookSlot } from "@/lib/projectContacts";

// Public page - no RevHub login involved at all. A contact clicks the
// scheduling link a rep pasted into an outreach email/message and lands
// here directly. Talks straight to the google-calendar Edge Function (see
// supabase/functions/google-calendar/index.ts), which is the only thing
// that ever touches the rep's actual Google credentials.
const SchedulePage = () => {
  const { repId } = useParams<{ repId: string }>();
  const [repName, setRepName] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookedLink, setBookedLink] = useState<string | null>(null);
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    if (!repId) return;
    (async () => {
      setIsLoading(true);
      const result = await fetchAvailableSlots(repId);
      if (result.error) setLoadError(result.error);
      setRepName(result.repName ?? null);
      setSlots(result.slots);
      setIsLoading(false);
    })();
  }, [repId]);

  const handleBook = async () => {
    if (!repId || !selectedSlot || !contactName.trim() || !contactEmail.trim()) return;
    setIsBooking(true);
    setBookError("");
    const result = await bookSlot(repId, selectedSlot, contactName.trim(), contactEmail.trim(), notes.trim() || undefined);
    if (result.success) {
      setBookedLink(result.eventLink ?? null);
    } else {
      setBookError(result.error || "Couldn't book that slot - try another.");
    }
    setIsBooking(false);
  };

  // Slots come back as plain ISO datetimes in UTC - grouping and labeling
  // them in the visitor's own browser timezone (via toLocaleString) is the
  // right default here since there's no other timezone context to go on
  // for an anonymous visitor.
  const groupedByDay = slots.reduce<Record<string, string[]>>((acc, iso) => {
    const day = new Date(iso).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    (acc[day] ??= []).push(iso);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F6F5F2] px-6 py-16">
      <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        {bookedLink ? (
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Booked</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">You're all set.</h1>
            <p className="mt-3 text-sm text-muted-foreground">A calendar invite is on its way to {contactEmail}.</p>
            <a href={bookedLink} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">View event →</a>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Grab time{repName ? ` with ${repName}` : ""}</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">Pick a time that works.</h1>

            {isLoading ? <p className="mt-6 text-sm text-muted-foreground">Loading availability…</p> : null}
            {loadError ? <p className="mt-6 text-sm text-[#B91C1C]">{loadError}</p> : null}

            {!isLoading && !loadError && slots.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">No open times in the next couple weeks - reach out directly instead.</p>
            ) : null}

            {!selectedSlot && Object.keys(groupedByDay).length > 0 ? (
              <div className="mt-6 grid gap-4">
                {Object.entries(groupedByDay).map(([day, daySlots]) => (
                  <div key={day}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{day}</p>
                    <div className="flex flex-wrap gap-2">
                      {daySlots.map((iso) => (
                        <button
                          key={iso}
                          type="button"
                          onClick={() => setSelectedSlot(iso)}
                          className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-semibold text-[#334155] hover:border-primary hover:text-primary"
                        >
                          {new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {selectedSlot ? (
              <div className="mt-6 grid gap-4">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Selected: </span>
                  {new Date(selectedSlot).toLocaleString(undefined, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  {" "}
                  <button type="button" onClick={() => setSelectedSlot(null)} className="text-xs font-semibold uppercase tracking-[0.08em] text-primary hover:underline">Change</button>
                </p>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                  Your name
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                  Your email
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                  Anything to add? (optional)
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                </label>
                {bookError ? <p className="text-sm text-[#B91C1C]">{bookError}</p> : null}
                <button
                  type="button"
                  onClick={handleBook}
                  disabled={isBooking || !contactName.trim() || !contactEmail.trim()}
                  className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground disabled:opacity-50"
                >
                  {isBooking ? "Booking…" : "Confirm"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
