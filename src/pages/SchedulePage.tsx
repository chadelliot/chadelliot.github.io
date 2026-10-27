import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAvailableSlots, bookSlot } from "@/lib/projectContacts";
import { getBrowserTimeZone, HOST_TIME_ZONE, meetingClock, meetingDay, meetingDateTime, TIME_ZONE_OPTIONS, timeZoneLabel } from "@/lib/bookingTimeZones";

// Public RevHub scheduling route. Uses the same secured Calendar backend and
// explicit time zone conversion as the About Chad /book page.
const SchedulePage = () => {
  const { repId } = useParams<{ repId: string }>();
  const [repName, setRepName] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [visitorZone, setVisitorZone] = useState(getBrowserTimeZone);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookedLink, setBookedLink] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [meetStatus, setMeetStatus] = useState<"ready" | "pending" | "failed">("pending");
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    if (!repId) return;
    let canceled = false;
    (async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const result = await fetchAvailableSlots(repId);
        if (canceled) return;
        if (result.error) setLoadError(result.error);
        setRepName(result.repName || "");
        setSlots(result.slots || []);
      } catch {
        if (!canceled) setLoadError("Calendar availability could not be loaded.");
      } finally {
        if (!canceled) setIsLoading(false);
      }
    })();
    return () => { canceled = true; };
  }, [repId]);

  const handleBook = async () => {
    if (!repId || !selectedSlot || !contactName.trim() || !contactEmail.trim()) return;
    setIsBooking(true);
    setBookError("");
    try {
      const details = [notes.trim(), "Attendee time zone: " + visitorZone,
        "Attendee time: " + meetingDateTime(selectedSlot, visitorZone),
        "Host time: " + meetingDateTime(selectedSlot, HOST_TIME_ZONE)].filter(Boolean).join("\n");
      const result = await bookSlot(repId, selectedSlot, contactName.trim(), contactEmail.trim(), details);
      if (result.success) {
        setBooked(true);
        setBookedLink(result.eventLink || "");
        setMeetLink(result.meetLink || "");
        setMeetStatus(result.meetStatus || "pending");
      } else {
        setBookError(result.error || "That time may have been taken. Please select another.");
      }
    } catch {
      setBookError("Booking could not be completed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const grouped = slots.reduce<Record<string, string[]>>((acc, iso) => {
    const day = meetingDay(iso, HOST_TIME_ZONE);
    (acc[day] ??= []).push(iso);
    return acc;
  }, {});
  const options = TIME_ZONE_OPTIONS.some((z) => z.value === visitorZone) ? TIME_ZONE_OPTIONS :
    [{ value: visitorZone, label: "Detected: " + timeZoneLabel(visitorZone) }, ...TIME_ZONE_OPTIONS];

  return (
    <div className="min-h-screen bg-[#F6F5F2] px-6 py-16">
      <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8">
        {booked ? (
          <div className="text-center" role="status">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Booked</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">You're all set.</h1>
            <p className="mt-3 text-sm text-muted-foreground">Google Calendar will send an invitation to {contactEmail}.</p>
            {selectedSlot && <div className="mt-4 space-y-1 text-[13px]">
              <p className="font-bold"><strong>Booked Eastern Time:</strong> {meetingDateTime(selectedSlot, HOST_TIME_ZONE)}</p>
              {visitorZone !== HOST_TIME_ZONE && <p><strong>Local equivalent ({timeZoneLabel(visitorZone)}):</strong> {meetingDateTime(selectedSlot, visitorZone)}</p>}
            </div>}
            {meetStatus === "ready" && meetLink ? (
              <a href={meetLink} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground no-underline">Join Google Meet</a>
            ) : meetStatus === "failed" ? (
              <p className="mt-4 text-sm text-red-700">The calendar event was created, but Google Meet generation failed. Contact the host to coordinate video access.</p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Google Meet is preparing the link. Check the calendar event shortly.</p>
            )}
            {bookedLink && <a href={bookedLink} target="_blank" rel="noopener noreferrer" className="mt-5 block text-sm font-semibold text-primary hover:underline">View calendar event</a>}
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Book a call{repName ? " with " + repName : ""}</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">Choose an Eastern Time (ET) slot.</h1>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">All appointment slots are shown in Eastern Time (ET), regardless of your location. Your local equivalent appears underneath.</p>
            <label className="mt-6 block text-xs font-semibold text-foreground" htmlFor="rep-timezone">Compare to your local time (optional)</label>
            <select id="rep-timezone" value={visitorZone} onChange={(e) => setVisitorZone(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground">
              {options.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
            </select>
            {isLoading && <p className="mt-6 text-sm text-muted-foreground" role="status">Loading availability…</p>}
            {loadError && <p className="mt-6 text-sm text-[#B91C1C]" role="alert">{loadError}</p>}
            {!isLoading && !loadError && slots.length === 0 && (
              <p className="mt-6 text-sm text-muted-foreground">No appointments are currently available. Please contact the host directly.</p>
            )}
            {!selectedSlot && !loadError && !isLoading && Object.keys(grouped).length > 0 && (
              <div className="mt-6 grid gap-4">
                {Object.entries(grouped).map(([day, daySlots]) => (
                  <div key={day}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{day}</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {daySlots.map((iso) => (
                        <button key={iso} type="button" onClick={() => setSelectedSlot(iso)}
                          className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-semibold text-[#334155] hover:border-primary hover:text-primary">
                          <span className="block">{meetingClock(iso, HOST_TIME_ZONE)}</span>
                          {visitorZone !== HOST_TIME_ZONE && <span className="mt-1 block text-[10px] font-normal text-muted-foreground">Local: {meetingClock(iso, visitorZone)}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedSlot && (
              <div className="mt-6 grid gap-4">
                <div className="rounded-lg border border-primary/20 bg-primary/[0.05] p-3 text-sm">
                  <p className="font-bold"><strong>Booking Eastern Time:</strong> {meetingDateTime(selectedSlot, HOST_TIME_ZONE)}</p>
                  {visitorZone !== HOST_TIME_ZONE && <p className="mt-2"><strong>Your local equivalent:</strong> {meetingDateTime(selectedSlot, visitorZone)}</p>}
                  <button type="button" onClick={() => setSelectedSlot(null)} className="mt-3 text-xs font-semibold uppercase text-primary hover:underline">Change</button>
                </div>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                  Your name
                  <input type="text" value={contactName} maxLength={100} onChange={(e) => setContactName(e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                  Your email
                  <input type="email" value={contactEmail} maxLength={255} onChange={(e) => setContactEmail(e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                  Anything to add? (optional)
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={650} rows={2} className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                </label>
                {bookError && <p className="text-sm text-[#B91C1C]" role="alert">{bookError}</p>}
                <button type="button" onClick={() => void handleBook()} disabled={isBooking || !contactName.trim() || !contactEmail.trim()}
                  className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground disabled:opacity-50">
                  {isBooking ? "Booking…" : "Confirm Meeting"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
