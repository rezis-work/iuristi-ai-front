import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAMES = ["token", "refreshToken", "refresh_token"];

/**
 * Protects private routes - redirects to login if user is not authenticated.
 * Auth is checked via access or refresh cookie.
 */
export function proxy(request: NextRequest) {
  const hasAuthCookie = AUTH_COOKIE_NAMES.some((name) =>
    Boolean(request.cookies.get(name)?.value?.trim()),
  );
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname.startsWith("/me") || pathname.startsWith("/ai-chat");

  if (isProtectedRoute && !hasAuthCookie) {
    const nextPath = pathname + (request.nextUrl.search || "");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/me", "/me/:path*", "/ai-chat", "/ai-chat/:path*"],
};
