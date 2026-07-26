// Supabase Edge Function: rep-profile-ai
//
// Why this exists: RevHub Outreach is a static React app (deployed via
// GitHub Pages) with no server of its own - any API key placed in the
// frontend code ends up in the shipped JS bundle, visible to anyone who
// opens dev tools. An LLM call needs a real secret (an Anthropic API key),
// so it has to run somewhere that isn't the browser. Supabase Edge
// Functions are exactly that: a small serverless function tied to this
// same Supabase project, with secrets held server-side.
//
// Two things this function does, selected by `action` in the POST body:
//
//   1. action: "personalize"
//      Input:  { repBackground: string, repTags?: string, contact: { title, industry, sector } }
//      Output: { line: string }
//      Drafts ONE sentence blending the rep's own background with the
//      specific contact's role/industry - a step up from the static
//      credibility_line template match in getPersonalizationLine()
//      (src/lib/projectContacts.ts), which only decides whether to use the
//      rep's one saved line, not tailor new wording per contact.
//
//   2. action: "parse_resume"
//      Input:  { resumeBase64: string, mimeType: string }
//      Output: { credibility_line: string, background_tags: string, notable_wins: string[] }
//      Reads an uploaded resume and extracts the fields the Profile tab
//      wants, so a rep can upload once instead of writing a summary by hand.
//      PDF resumes are sent to Claude directly as a document - Claude's API
//      reads PDFs natively, no separate text-extraction library needed here.
//      .doc/.docx files aren't parsed by this function (Claude's document
//      support is PDF/image-based) - if that matters, convert to PDF before
//      upload, or extract text client-side first and send action:
//      "parse_resume_text" (not implemented here, but a small addition if
//      needed later).
//
// Deploy steps (from the project root, with the Supabase CLI installed):
//   1. supabase functions deploy rep-profile-ai
//   2. supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// The function reads the key from the environment at request time - it is
// never present in any file committed to the repo.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const ANTHROPIC_MODEL = "claude-sonnet-4-5";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PersonalizeBody = {
  action: "personalize";
  repBackground: string;
  repTags?: string;
  contact: { title?: string | null; industry?: string | null; sector?: string | null };
};

type ParseResumeBody = {
  action: "parse_resume";
  resumeBase64: string;
  mimeType: string;
};

const callClaude = async (body: unknown) => {
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Anthropic API error: ${response.status} ${await response.text()}`);
  return response.json();
};

const extractText = (claudeResponse: { content?: { type: string; text?: string }[] }): string =>
  claudeResponse.content?.find((block) => block.type === "text")?.text?.trim() ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY is not set - run: supabase secrets set ANTHROPIC_API_KEY=sk-ant-..." }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  try {
    const payload = (await req.json()) as PersonalizeBody | ParseResumeBody;

    if (payload.action === "personalize") {
      const { repBackground, repTags, contact } = payload;
      const prompt = `You write ONE short, natural-sounding sentence a sales rep can drop into a cold outreach email, connecting their own background to the specific person they're contacting. No greeting, no sign-off - just the sentence itself, ready to paste into the middle of an email.

Rep's background: ${repBackground}
Rep's areas of experience: ${repTags || "not specified"}

Contact's role: ${contact.title || "unknown"}
Contact's industry: ${contact.industry || "unknown"}
Contact's sector: ${contact.sector || "unknown"}

Write the single sentence now, nothing else.`;
      const result = await callClaude({
        model: ANTHROPIC_MODEL,
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      });
      return new Response(JSON.stringify({ line: extractText(result) }), {
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    if (payload.action === "parse_resume") {
      const { resumeBase64, mimeType } = payload;
      if (mimeType !== "application/pdf") {
        return new Response(JSON.stringify({ error: "Only PDF resumes can be auto-parsed today - upload a PDF, or fill in the fields by hand." }), {
          status: 400,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      const prompt = `Read the attached resume and return ONLY a JSON object (no markdown, no commentary) with exactly these keys:
{
  "credibility_line": "one sentence, first person, describing their background in a way that would build credibility with a stranger they're cold-emailing",
  "background_tags": "comma-separated list of 3-6 industries or keywords from their experience",
  "notable_wins": ["short phrase", "short phrase", "up to 4 total"]
}`;
      const result = await callClaude({
        model: ANTHROPIC_MODEL,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: resumeBase64 } },
              { type: "text", text: prompt },
            ],
          },
        ],
      });
      const raw = extractText(result);
      let parsed: { credibility_line?: string; background_tags?: string; notable_wins?: string[] };
      try {
        parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
      } catch {
        return new Response(JSON.stringify({ error: "Couldn't parse the model's response - try again or fill in the fields manually." }), {
          status: 502,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "content-type": "application/json" } });
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
