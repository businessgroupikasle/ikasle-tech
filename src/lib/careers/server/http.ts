import { NextResponse, type NextRequest } from "next/server";

export const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

/** Browsers always send Origin on cross-site POST/PATCH/DELETE; reject anything not from this site. */
export const isCrossOrigin = (req: NextRequest) => {
  const origin = req.headers.get("origin");
  return Boolean(origin && origin !== req.nextUrl.origin);
};

export const jsonError = (code: string, message: string, status: number, headers?: HeadersInit) =>
  NextResponse.json({ ok: false, code, message }, { status, headers });

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
