import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware — imports ONLY from next/server.
 * No next-auth, no @/ path aliases, no Node.js APIs.
 * Admin gate: session cookie presence (JWT validated server-side in auth.ts).
 */

const CSP_REPORT_ONLY = process.env.CSP_REPORT_ONLY === "true";

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "__Host-authjs.session-token",
] as const;

function createNonce(): string {
  return globalThis.crypto.randomUUID().replace(/-/g, "");
}

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://vercel.live https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://*.ingest.sentry.io https://vitals.vercel-insights.com https://*.openai.com https://graph.facebook.com",
    "frame-src 'self' https://www.google.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function applySecurityHeaders(response: NextResponse, nonce: string): void {
  const csp = buildCsp(nonce);
  const cspHeader = CSP_REPORT_ONLY
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";

  response.headers.set(cspHeader, csp);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=()",
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");
}

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

export function middleware(request: NextRequest) {
  const nonce = createNonce();

  const authRedirect = enforceAdminAccess(request);
  if (authRedirect) {
    applySecurityHeaders(authRedirect, nonce);
    return authRedirect;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  applySecurityHeaders(response, nonce);
  return response;
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
