/** All booking times are absolute instants (ISO 8601), never floating local clock times. */
export const HOST_TIME_ZONE = "America/New_York";
export const TIME_ZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern Time (New York)" },
  { value: "America/Chicago", label: "Central Time (Chicago)" },
  { value: "America/Denver", label: "Mountain Time (Denver)" },
  { value: "America/Phoenix", label: "Arizona Time (Phoenix, no DST)" },
  { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles)" },
  { value: "America/Anchorage", label: "Alaska Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
  { value: "America/Toronto", label: "Eastern Time (Toronto)" },
  { value: "Europe/London", label: "London Time" },
  { value: "Europe/Paris", label: "Central European Time (Paris)" },
  { value: "Asia/Dubai", label: "Dubai Time" },
  { value: "Asia/Kolkata", label: "India Time" },
  { value: "Asia/Singapore", label: "Singapore Time" },
  { value: "Asia/Tokyo", label: "Japan Time" },
  { value: "Australia/Sydney", label: "Sydney Time" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
] as const;

export function validTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(0);
    return true;
  } catch {
    return false;
  }
}
export function getBrowserTimeZone(): string {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return zone && validTimeZone(zone) ? zone : HOST_TIME_ZONE;
}
export function timeZoneLabel(zone: string): string {
  return TIME_ZONE_OPTIONS.find((x) => x.value === zone)?.label ??
    zone.replaceAll("_", " ").replaceAll("/", " / ");
}
export function meetingDay(iso: string, zone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone, weekday: "long", month: "long", day: "numeric", year: "numeric",
  }).format(new Date(iso));
}
export function meetingClock(iso: string, zone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone, hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(new Date(iso));
}
export function meetingDateTime(iso: string, zone: string): string {
  return meetingDay(iso, zone) + " at " + meetingClock(iso, zone);
}
