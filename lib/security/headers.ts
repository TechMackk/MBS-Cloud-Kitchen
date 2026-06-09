/**
 * Edge-safe security header helpers for middleware.
 * Uses only Web Standard APIs — no Node.js modules (crypto, Buffer, fs, process).
 */

type HeaderResponse = {
  headers: Headers;
};

/**
 * Generates a CSP nonce for inline scripts on each request.
 */
export function createNonce(): string {
  return globalThis.crypto.randomUUID().replace(/-/g, "");
}

/**
 * Builds the Content-Security-Policy directive string for a request nonce.
 */
export function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://vercel.live https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://*.ingest.sentry.io https://vitals.vercel-insights.com https://*.openai.com https://generativelanguage.googleapis.com https://graph.facebook.com",
    "frame-src 'self' https://www.google.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export type SecurityHeaderOptions = {
  /** When true, emit Content-Security-Policy-Report-Only instead of enforcing. */
  cspReportOnly?: boolean;
};

/**
 * Applies security headers to a Next.js middleware or route response.
 */
export function applySecurityHeaders(
  response: HeaderResponse,
  nonce: string,
  options: SecurityHeaderOptions = {},
): void {
  const csp = buildCsp(nonce);
  const cspHeader = options.cspReportOnly
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
