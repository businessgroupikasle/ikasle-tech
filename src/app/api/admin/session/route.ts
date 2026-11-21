import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, createSessionToken, isAdminConfigured, passwordMatches, sessionCookieOptions } from "@/lib/careers/server/admin-auth";
import { clientIp, isCrossOrigin, jsonError } from "@/lib/careers/server/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Admin log in: { password } → sets the session cookie. */
export async function POST(req: NextRequest) {
  if (isCrossOrigin(req)) return jsonError("bad_request", "Cross-origin requests are not allowed.", 403);
  if (!isAdminConfigured()) return jsonError("not_configured", "Admin access isn't set up. Add CAREERS_ADMIN_PASSWORD and CAREERS_SESSION_SECRET.", 503);

  const limit = rateLimit(`admin-login:${clientIp(req)}`, 8, 15 * 60_000);
  if (!limit.allowed) return jsonError("rate_limited", "Too many attempts. Please wait a few minutes.", 429, { "Retry-After": String(limit.retryAfter) });

  let password = "";
  try {
    password = String(((await req.json()) as { password?: unknown }).password ?? "");
  } catch {
    return jsonError("bad_request", "Invalid request.", 400);
  }
  if (!password || password.length > 200 || !passwordMatches(password)) return jsonError("invalid", "Incorrect password.", 401);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions);
  return res;
}

/** Admin log out: clears the session cookie. */
export async function DELETE(req: NextRequest) {
  if (isCrossOrigin(req)) return jsonError("bad_request", "Cross-origin requests are not allowed.", 403);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
