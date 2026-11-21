import type { NextRequest } from "next/server";

export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");

    if (host && originUrl.host.toLowerCase() === host.toLowerCase()) return true;
    if (origin === req.nextUrl.origin) return true;

    const nextPort = req.nextUrl.port || "3029";
    const originPort = originUrl.port || (originUrl.protocol === "https:" ? "443" : "80");
    const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(originUrl.hostname);
    if (isLocal && (originPort === nextPort || !originUrl.port)) return true;

    const allowedDomains = ["ikasletechnologies.com", "www.ikasletechnologies.com"];
    if (allowedDomains.includes(originUrl.hostname.toLowerCase())) return true;

    return false;
  } catch {
    return false;
  }
}

export function isCrossOrigin(req: NextRequest): boolean {
  return !isAllowedOrigin(req);
}

