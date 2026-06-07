import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "__Host-authjs.session-token",
] as const;

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => {
    const value = request.cookies.get(name)?.value;
    return typeof value === "string" && value.length > 0;
  });
}

function enforceAdminAccess(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const isLoggedIn = hasSessionCookie(request);

  if (pathname.startsWith("/admin/login")) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return null;
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return null;
}

export default function middleware(request: NextRequest) {
  const authRedirect = enforceAdminAccess(request);
  if (authRedirect) {
    return authRedirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
