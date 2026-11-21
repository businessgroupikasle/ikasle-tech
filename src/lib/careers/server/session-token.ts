import { createHmac, timingSafeEqual } from "node:crypto";

/** Signed admin session tokens (no framework imports, so both src/proxy.ts and route handlers can use them). */

export const ADMIN_COOKIE = "ikt_careers_admin";
export const SESSION_SECONDS = 8 * 60 * 60;

const secret = () => process.env.CAREERS_SESSION_SECRET?.trim() ?? "";
export const isAdminConfigured = () => Boolean(process.env.CAREERS_ADMIN_PASSWORD) && secret().length >= 32;

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
};

/** Constant-time password check (compares HMACs so the lengths always match). */
export function passwordMatches(candidate: string): boolean {
  const expected = process.env.CAREERS_ADMIN_PASSWORD ?? "";
  if (!expected || !isAdminConfigured()) return false;
  return safeEqual(sign(`pw:${candidate}`), sign(`pw:${expected}`));
}

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !isAdminConfigured()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}
