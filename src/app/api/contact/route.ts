import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, type ContactFormValues, type ContactResponse } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/mail";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;
/** Humans take longer than this to fill the form; most bots don't. */
const MIN_FILL_MS = 3_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60_000;

const json = (body: ContactResponse, status: number, headers?: HeadersInit) => NextResponse.json(body, { status, headers });

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  // Same-origin check: browsers always send Origin on cross-site POSTs.
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) {
    return json({ ok: false, code: "bad_request", message: "Cross-origin requests are not allowed." }, 403);
  }

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return json({ ok: false, code: "bad_request", message: "Message is too large." }, 413);
  }

  const limit = rateLimit(`contact:${clientIp(req)}`);
  if (!limit.allowed) {
    return json(
      { ok: false, code: "rate_limited", message: "Too many messages from this connection. Please try again a little later." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, code: "bad_request", message: "Invalid request body." }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactFormValues | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // A filled honeypot means a bot: accept silently so it doesn't retry.
    if (fieldErrors.website) return json({ ok: true }, 200);
    return json({ ok: false, code: "validation", message: "Please check the highlighted fields.", fieldErrors }, 422);
  }

  const elapsed = Date.now() - parsed.data.startedAt;
  if (elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
    return json({ ok: false, code: "spam", message: "That was quick! Please review your message and submit again." }, 400);
  }

  const result = await sendContactEmail(parsed.data);
  switch (result.status) {
    case "sent":
      return json({ ok: true }, 200);
    case "not_configured":
      return json(
        {
          ok: false,
          code: "not_configured",
          message: "Online enquiries are not connected yet, so your message was not sent. Please reach us through another channel for now.",
        },
        503,
      );
    case "failed":
      console.error("[contact] delivery failed:", result.detail);
      return json({ ok: false, code: "delivery_failed", message: "We couldn't deliver your message right now. Please try again in a few minutes." }, 502);
  }
}
