// Supabase Edge Function: google-calendar
//
// Backs the "grab time with me" link in outreach. A contact clicking that
// link lands on a public /schedule/:repId page (see src/pages/SchedulePage
// in the frontend) which calls this function to see real open slots and
// book one - without either the contact or the rep needing an account, and
// without the rep's Google refresh token (a long-lived secret) ever
// reaching the browser.
//
// Actions (all POST, JSON body with `action`, except oauth_callback which
// Google itself redirects to as a GET):
//
//   oauth_callback (GET, called by Google's redirect, not the frontend)
//     Query params: code, state (the team_member id, passed through the
//     authorize URL the frontend builds). Exchanges the code for tokens,
//     stores the refresh token, redirects back to the RevHub profile page.
//
//   get_available_slots
//     Input:  { repId: string }
//     Output: { slots: string[] (ISO datetimes), timezone: string } | { error }
//     Business hours are fixed at 9am-5pm, Monday-Friday, 30-minute slots,
//     next 10 business days - simple and predictable rather than
//     configurable, at least for this first version.
//
//   book_slot
//     Input:  { repId, startIso, contactName, contactEmail, notes? }
//     Output: { success: true, eventLink?: string } | { error }
//     Creates a calendar event on the rep's primary calendar with a Google
//     Meet link and the contact as an attendee (so they get an invite +
//     the event on their own calendar too).
//
// Deploy steps:
//   1. supabase functions deploy google-calendar
//   2. supabase secrets set GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=...
//      (from the OAuth client Chad creates in Google Cloud Console - see
//      the setup instructions handed off alongside this file)
//   3. Set the OAuth client's redirect URI in Google Cloud Console to:
//      https://<your-project-ref>.supabase.co/functions/v1/google-calendar
//      (must match exactly, including no trailing slash)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") ?? "";
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// Where Google redirects back to itself - must exactly match what's
// registered in Google Cloud Console AND what the frontend uses to build
// the authorize URL (see buildGoogleAuthUrl in projectContacts.ts).
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/google-calendar`;
// Where a rep lands after connecting/disconnecting - the Profile tab reads
// ?calendar=connected|error off the URL to show a message.
const APP_URL = Deno.env.get("APP_URL") ?? "https://aboutchad.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Direct PostgREST calls with the service role key - this function needs to
// read/write team_members.google_refresh_token regardless of who's asking
// (a contact booking a slot has no RevHub session at all), which is exactly
// what the service role key is for. It is never exposed to the frontend.
const db = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  return response;
};

const getAccessToken = async (refreshToken: string): Promise<string | null> => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
};

// Public scheduling uses 9 a.m. to 5 p.m. Eastern, not 9 a.m. UTC.
// Convert each local slot to UTC per date to correctly handle DST.
const TIME_ZONE = "America/New_York";
const MEETING_MINUTES = 30;
const BUFFER_MINUTES = 15;
const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
const easternParts = (date: Date) => {
  const vals = Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, Number(value)]));
  return { year: vals.year, month: vals.month, day: vals.day, hour: vals.hour, minute: vals.minute };
};
const easternDateToUtc = (y: number, m: number, d: number, h: number, min: number): Date => {
  const tentative = Date.UTC(y, m - 1, d, h, min);
  const p = easternParts(new Date(tentative));
  const apparent = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return new Date(tentative - (apparent - tentative));
};
const generateCandidateSlots = (): { start: Date; end: Date }[] => {
  const slots: { start: Date; end: Date }[] = [];
  const now = Date.now();
  const today = easternParts(new Date(now));
  const day = new Date(Date.UTC(today.year, today.month - 1, today.day + 1));
  let weekdays = 0;
  while (weekdays < 10) {
    if (day.getUTCDay() !== 0 && day.getUTCDay() !== 6) {
      for (let hour = 9; hour < 17; hour++) {
        for (const minute of [0, 30]) {
          const start = easternDateToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), hour, minute);
          if (start.getTime() < now + 12 * 60 * 60 * 1000) continue;
          slots.push({ start, end: new Date(start.getTime() + MEETING_MINUTES * 60000) });
        }
      }
      weekdays++;
    }
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return slots;
};
type BusyWindow = { start: string; end: string };
const calendarBusy = async (accessToken: string, timeMin: string, timeMax: string): Promise<BusyWindow[] | null> => {
  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: "Bearer " + accessToken, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: "primary" }] }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { calendars?: { primary?: { busy?: BusyWindow[]; errors?: unknown[] } } };
  if (!data.calendars?.primary || data.calendars.primary.errors?.length) return null;
  return data.calendars.primary.busy ?? [];
};
const slotIsFree = (slot: { start: Date; end: Date }, busy: BusyWindow[]): boolean =>
  !busy.some((b) => {
    const before = new Date(b.start).getTime() - BUFFER_MINUTES * 60000;
    const after = new Date(b.end).getTime() + BUFFER_MINUTES * 60000;
    return slot.start.getTime() < after && slot.end.getTime() > before;
  });

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Google's redirect after the rep grants (or denies) calendar access.
  if (req.method === "GET" && url.pathname.endsWith("/google-calendar")) {
    const code = url.searchParams.get("code");
    const teamMemberId = url.searchParams.get("state");
    if (!code || !teamMemberId) {
      return Response.redirect(`${APP_URL}/projects?calendar=error`, 302);
    }
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: FUNCTION_URL,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenResponse.ok) return Response.redirect(`${APP_URL}/projects?calendar=error`, 302);
    const tokens = (await tokenResponse.json()) as { refresh_token?: string; access_token?: string };
    if (!tokens.refresh_token) {
      // Google only issues a refresh token on the FIRST consent, or when
      // prompt=consent is forced (see the authorize URL the frontend
      // builds) - if this happens, the rep needs to revoke access in their
      // Google account and reconnect.
      return Response.redirect(`${APP_URL}/projects?calendar=error`, 302);
    }
    let calendarEmail: string | null = null;
    if (tokens.access_token) {
      const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (profileResponse.ok) calendarEmail = ((await profileResponse.json()) as { email?: string }).email ?? null;
    }
    await db(`team_members?id=eq.${teamMemberId}`, {
      method: "PATCH",
      body: JSON.stringify({ google_refresh_token: tokens.refresh_token, google_calendar_connected: true, google_calendar_email: calendarEmail }),
    });
    return Response.redirect(`${APP_URL}/projects?calendar=connected`, 302);
  }

  try {
    const payload = await req.json();

    if (payload.action === "disconnect") {
      // A public visitor must not be allowed to disconnect a rep's calendar.
      const bearer = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
      if (!bearer) return new Response(JSON.stringify({ error: "Authentication required." }), {
        status: 401, headers: { ...corsHeaders, "content-type": "application/json" },
      });
      const whoResponse = await fetch(SUPABASE_URL + "/auth/v1/user", {
        headers: { Authorization: "Bearer " + bearer, apikey: SUPABASE_SERVICE_ROLE_KEY },
      });
      if (!whoResponse.ok) return new Response(JSON.stringify({ error: "Invalid session." }), {
        status: 401, headers: { ...corsHeaders, "content-type": "application/json" },
      });
      const who = (await whoResponse.json()) as { email?: string };
      const memberResponse = await db("team_members?id=eq." + encodeURIComponent(payload.repId ?? "") + "&select=email");
      const [member] = (await memberResponse.json()) as { email?: string }[];
      if (!who.email || !member?.email || who.email.toLowerCase() !== member.email.toLowerCase()) {
        return new Response(JSON.stringify({ error: "Not authorized to disconnect this calendar." }), {
          status: 403, headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      const result = await db("team_members?id=eq." + encodeURIComponent(payload.repId), {
        method: "PATCH",
        body: JSON.stringify({ google_refresh_token: null, google_calendar_connected: false, google_calendar_email: null }),
      });
      if (!result.ok) throw new Error("Failed to disconnect calendar.");
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "content-type": "application/json" } });
    }

    if (payload.action === "get_available_slots") {
      const repResponse = await db(`team_members?id=eq.${payload.repId}&select=google_refresh_token,name`);
      const [rep] = (await repResponse.json()) as { google_refresh_token?: string; name?: string }[];
      if (!rep?.google_refresh_token) {
        return new Response(JSON.stringify({ error: "This rep hasn't connected their calendar yet." }), {
          status: 404,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      const accessToken = await getAccessToken(rep.google_refresh_token);
      if (!accessToken) {
        return new Response(JSON.stringify({ error: "Couldn't reach Google Calendar - try again shortly." }), {
          status: 502,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      const candidates = generateCandidateSlots();
      const timeMin = candidates[0].start.toISOString();
      const timeMax = candidates[candidates.length - 1].end.toISOString();
      const busy = await calendarBusy(accessToken, new Date(new Date(timeMin).getTime() - BUFFER_MINUTES * 60000).toISOString(), new Date(new Date(timeMax).getTime() + BUFFER_MINUTES * 60000).toISOString());
      if (!busy) return new Response(JSON.stringify({ error: "Couldn't read calendar availability." }), {
        status: 502, headers: { ...corsHeaders, "content-type": "application/json" },
      });
      const openSlots = candidates.filter((slot) => slotIsFree(slot, busy));
      return new Response(JSON.stringify({ repName: rep.name, slots: openSlots.slice(0, 40).map((s) => s.start.toISOString()) }), {
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    if (payload.action === "book_slot") {
      const { repId, startIso, contactName, contactEmail, notes } = payload as {
        repId: string; startIso: string; contactName: string; contactEmail: string; notes?: string;
      };
      const repResponse = await db(`team_members?id=eq.${repId}&select=google_refresh_token,name,email`);
      const [rep] = (await repResponse.json()) as { google_refresh_token?: string; name?: string; email?: string }[];
      if (!rep?.google_refresh_token) {
        return new Response(JSON.stringify({ error: "This rep hasn't connected their calendar yet." }), {
          status: 404,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      const accessToken = await getAccessToken(rep.google_refresh_token);
      if (!accessToken) {
        return new Response(JSON.stringify({ error: "Couldn't reach Google Calendar - try again shortly." }), {
          status: 502,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      // Only offer server-generated slots. Recheck Google just before creating the event.
      const start = new Date(startIso);
      const validName = typeof contactName === "string" ? contactName.trim() : "";
      const validEmail = typeof contactEmail === "string" ? contactEmail.trim() : "";
      if (!Number.isFinite(start.getTime()) || !validName || validName.length > 100 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail) || validEmail.length > 255 ||
          (notes && (typeof notes !== "string" || notes.length > 1200))) {
        return new Response(JSON.stringify({ error: "Please enter valid booking details." }), {
          status: 400, headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      const selectedSlot = generateCandidateSlots().find((slot) => slot.start.getTime() === start.getTime());
      if (!selectedSlot) return new Response(JSON.stringify({ error: "This time is outside the booking window." }), {
        status: 400, headers: { ...corsHeaders, "content-type": "application/json" },
      });
      const end = selectedSlot.end;
      const freshBusy = await calendarBusy(accessToken, new Date(start.getTime() - BUFFER_MINUTES * 60000).toISOString(), new Date(end.getTime() + BUFFER_MINUTES * 60000).toISOString());
      if (!freshBusy) return new Response(JSON.stringify({ error: "Couldn't verify current availability." }), {
        status: 502, headers: { ...corsHeaders, "content-type": "application/json" },
      });
      if (!slotIsFree(selectedSlot, freshBusy)) return new Response(JSON.stringify({ error: "That time was just taken. Choose another." }), {
        status: 409, headers: { ...corsHeaders, "content-type": "application/json" },
      });
      const eventResponse = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            summary: `Introductory Conversation: ${rep.name ?? "Chad"} & ${validName}`,
            description: (notes || "Booked via About Chad scheduling.").slice(0, 1200),
            start: { dateTime: start.toISOString() },
            end: { dateTime: end.toISOString() },
            attendees: [{ email: validEmail }, ...(rep.email && rep.email !== validEmail ? [{ email: rep.email }] : [])],
            conferenceData: { createRequest: { requestId: crypto.randomUUID() } },
          }),
        }
      );
      if (!eventResponse.ok) {
        return new Response(JSON.stringify({ error: "Couldn't book that slot - it may have just been taken. Try another." }), {
          status: 409,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      const event = (await eventResponse.json()) as { htmlLink?: string };
      return new Response(JSON.stringify({ success: true, eventLink: event.htmlLink }), {
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});
