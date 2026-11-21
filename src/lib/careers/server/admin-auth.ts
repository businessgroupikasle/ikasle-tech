import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSessionToken, SESSION_SECONDS } from "./session-token";

/**
 * Admin access for the careers dashboard: one shared password (CAREERS_ADMIN_PASSWORD) and a signed, httpOnly
 * session cookie (signed with CAREERS_SESSION_SECRET, at least 32 characters). Sessions last 8 hours.
 * Token logic is in session-token.ts so src/proxy.ts can use it too.
 */
export { ADMIN_COOKIE, createSessionToken, isAdminConfigured, isValidSessionToken, passwordMatches, SESSION_SECONDS } from "./session-token";

/** True when the current request carries a valid admin session (server components and route handlers). */
export async function isAdmin(): Promise<boolean> {
  return isValidSessionToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};
