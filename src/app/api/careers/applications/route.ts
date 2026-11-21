import { NextResponse, type NextRequest } from "next/server";
import { applicationSchema, type SubmitResponse } from "@/lib/careers/application-schema";
import { isDatabaseConfigured } from "@/lib/careers/server/db";
import { clientIp, isCrossOrigin } from "@/lib/careers/server/http";
import { notifyNewApplication } from "@/lib/careers/server/notify";
import { AttachmentError, createApplication } from "@/lib/careers/server/repository";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 60_000;
/** A real 7-step application takes far longer than this; bots don't. */
const MIN_FILL_MS = 20_000;

const reply = (body: SubmitResponse, status: number, headers?: HeadersInit) => NextResponse.json(body, { status, headers });

/** Submit a job application (JSON). Files are uploaded beforehand via /api/careers/uploads and referenced by ID. */
export async function POST(req: NextRequest) {
  if (isCrossOrigin(req)) return reply({ ok: false, code: "bad_request", message: "Cross-origin requests are not allowed." }, 403);
  if (!isDatabaseConfigured()) {
    return reply({ ok: false, code: "not_configured", message: "Online applications are not available right now. Please email your resume instead." }, 503);
  }
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return reply({ ok: false, code: "bad_request", message: "Application is too large." }, 413);

  const limit = rateLimit(`careers-apply:${clientIp(req)}`, 5, 60 * 60_000);
  if (!limit.allowed) {
    return reply({ ok: false, code: "rate_limited", message: "Too many applications from this connection. Please try again later." }, 429, { "Retry-After": String(limit.retryAfter) });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return reply({ ok: false, code: "bad_request", message: "Invalid request body." }, 400);
  }

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // A filled honeypot means a bot: accept silently so it doesn't retry.
    if (fieldErrors.nickname) return reply({ ok: true, reference: "IKT-0000-000000", position: "", submittedAt: new Date().toISOString() }, 200);
    return reply({ ok: false, code: "validation", message: "Please check the highlighted fields.", fieldErrors }, 422);
  }
  if (Date.now() - parsed.data.startedAt < MIN_FILL_MS) {
    return reply({ ok: false, code: "bad_request", message: "That was quick! Please review your application and submit again." }, 400);
  }

  try {
    const app = await createApplication(parsed.data);
    const mail = await notifyNewApplication(app, parsed.data);
    if (mail.status === "failed") console.error("[careers] notification email failed", mail.detail);
    return reply({ ok: true, reference: app.reference, position: app.title, submittedAt: app.submittedAt }, 201);
  } catch (error) {
    if (error instanceof AttachmentError) return reply({ ok: false, code: "validation", message: error.message, fieldErrors: { resume: error.message } }, 422);
    console.error("[careers] application failed", error);
    return reply({ ok: false, code: "server_error", message: "We couldn't submit your application right now. Please try again in a few minutes." }, 500);
  }
}
