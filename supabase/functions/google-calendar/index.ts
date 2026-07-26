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

// Business hours are intentionally fixed (9-5, weekdays, 30-min slots,
// 10 business days out) rather than configurable per rep - a simple,
// predictable default that's easy to explain, with room to make it
// per-rep configurable later if that turns out to matter.
const generateCandidateSlots = (): { start: Date; end: Date }[] => {
  const slots: { start: Date; end: Date }[] = [];
  const now = new Date();
  let daysAdded = 0;
  let cursor = new Date(now);
  cursor.setUTCHours(0, 0, 0, 0);
  cursor.setUTCDate(cursor.getUTCDate() + 1); // start tomorrow, never same-day

  while (daysAdded < 10) {
    const day = cursor.getUTCDay(); // 0 Sun, 6 Sat
    if (day !== 0 && day !== 6) {
      for (let hour = 9; hour < 17; hour++) {
        for (const minute of [0, 30]) {
          const start = new Date(cursor);
          start.setUTCHours(hour, minute, 0, 0);
          const end = new Date(start.getTime() + 30 * 60 * 1000);
          slots.push({ start, end });
        }
      }
      daysAdded += 1;
    }
    cursor = new Date(cursor);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return slots;
};

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
      await db(`team_members?id=eq.${payload.repId}`, {
        method: "PATCH",
        body: JSON.stringify({ google_refresh_token: null, google_calendar_connected: false, google_calendar_email: null }),
      });
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
      const freeBusyResponse = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ timeMin, timeMax, items: [{ id: "primary" }] }),
      });
      if (!freeBusyResponse.ok) {
        return new Response(JSON.stringify({ error: "Couldn't read calendar availability." }), {
          status: 502,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      const freeBusy = (await freeBusyResponse.json()) as { calendars?: { primary?: { busy?: { start: string; end: string }[] } } };
      const busy = freeBusy.calendars?.primary?.busy ?? [];
      const openSlots = candidates.filter((slot) => {
        return !busy.some((b) => {
          const busyStart = new Date(b.start).getTime();
          const busyEnd = new Date(b.end).getTime();
          return slot.start.getTime() < busyEnd && slot.end.getTime() > busyStart;
        });
      });
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
      const start = new Date(startIso);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const eventResponse = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            summary: `${rep.name ?? "RevHub"} <> ${contactName}`,
            description: notes || "Booked via RevHub Outreach.",
            start: { dateTime: start.toISOString() },
            end: { dateTime: end.toISOString() },
            attendees: [{ email: contactEmail }, ...(rep.email ? [{ email: rep.email }] : [])],
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
