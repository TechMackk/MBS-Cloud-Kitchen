import { describe, expect, it } from "vitest";

import { buildCsp, createNonce } from "@/lib/security/headers";

describe("security headers", () => {
  it("creates a hex nonce without dashes", () => {
    const nonce = createNonce();
    expect(nonce).toMatch(/^[a-f0-9]{32}$/);
  });

  it("embeds nonce in CSP script-src directive", () => {
    const csp = buildCsp("abc123");
    expect(csp).toContain("script-src 'self' 'nonce-abc123'");
    expect(csp).toContain("frame-ancestors 'none'");
  });
});
