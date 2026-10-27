// Read-only live smoke test: never creates meetings.
const endpoint = process.env.VITE_PROPOSAL_DB_URL;
const publicKey = process.env.VITE_PROPOSAL_DB_PUBLIC;
if (!endpoint || !publicKey) throw new Error("Missing public calendar configuration");

const response = await fetch(endpoint + "/functions/v1/google-calendar", {
  method: "POST",
  headers: { "Content-Type": "application/json", apikey: publicKey },
  body: JSON.stringify({
    action: "get_available_slots",
    repId: "6bcb92db-2e21-4be9-8fd8-dceb085d4970",
  }),
});
const payload = await response.json();
if (!response.ok || payload.error || !Array.isArray(payload.slots) || payload.slots.length === 0) {
  throw new Error("Calendar availability unavailable: " + (payload.error || response.status));
}
for (const slot of payload.slots) {
  const components = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short", hour: "numeric", hourCycle: "h23",
  }).formatToParts(new Date(slot)).map(({ type, value }) => [type, value]));
  const hour = Number(components.hour);
  if (hour < 9 || hour >= 17 || components.weekday === "Sat" || components.weekday === "Sun") {
    throw new Error("Invalid slot outside 9 a.m.–5 p.m. Eastern weekdays");
  }
}
console.log("Read-only availability verified: " + payload.slots.length + " valid Eastern business-hour slots.");
