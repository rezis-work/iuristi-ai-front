import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "token";

/**
 * Protects private routes - redirects to login if user is not authenticated.
 * Auth is checked via "token" cookie.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname.startsWith("/me") || pathname.startsWith("/ai-chat");

  if (isProtectedRoute && !token?.trim()) {
    const nextPath = pathname + (request.nextUrl.search || "");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/me/:path*", "/ai-chat/:path*"],
};
