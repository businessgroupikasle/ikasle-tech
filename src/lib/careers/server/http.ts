import { NextResponse, type NextRequest } from "next/server";
import { isCrossOrigin } from "@/lib/origin-check";

export const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

export { isCrossOrigin };

export const jsonError = (code: string, message: string, status: number, headers?: HeadersInit) =>
  NextResponse.json({ ok: false, code, message }, { status, headers });

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
