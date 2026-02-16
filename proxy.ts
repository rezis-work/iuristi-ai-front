import { NextResponse, NextRequest } from "next/server";

const COOKIE_NAME = "token";

/**
 * Protects /me/* routes - redirects to login if user is not authenticated.
 * Auth is checked via "token" cookie (set on login alongside localStorage).
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const pathname = request.nextUrl.pathname;

  // Protect /me/* routes
  if (pathname.startsWith("/me")) {
    if (!token?.trim()) {
      const nextPath = pathname + (request.nextUrl.search || "");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", nextPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/me/:path*", "/me/profile", "/verify-email"],
};
