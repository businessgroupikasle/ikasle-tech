import { NextResponse } from "next/server";

export { clientIp, isCrossOrigin } from "@/lib/request";

export const jsonError = (code: string, message: string, status: number, headers?: HeadersInit) =>
  NextResponse.json({ ok: false, code, message }, { status, headers });

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
