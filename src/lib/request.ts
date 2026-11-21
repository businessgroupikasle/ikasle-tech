import type { NextRequest } from "next/server";

/**
 * Shared request helpers for API routes (contact, chat, careers).
 *
 * The client IP comes from the platform's forwarding headers. On Vercel and similar hosts these are set by the
 * edge and can be trusted; behind a proxy you control, make sure it overwrites them.
 */
export const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

/** Browsers always send Origin on cross-site POST/PATCH/DELETE; anything not from this site is rejected. */
export const isCrossOrigin = (req: NextRequest) => {
  const origin = req.headers.get("origin");
  return Boolean(origin && origin !== req.nextUrl.origin);
};
