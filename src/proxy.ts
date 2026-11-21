import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/careers/server/session-token";

/**
 * Sends logged-out visitors on admin pages to the login page with a real HTTP redirect, before anything renders.
 * Pages and admin API routes still check the session themselves; this is the first line, not the only one.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (isValidSessionToken(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
