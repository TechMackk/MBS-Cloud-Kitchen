import { describe, expect, it } from "vitest";

import { getClientIp } from "@/lib/utils/request-ip";

describe("getClientIp", () => {
  it("reads the first IP from x-forwarded-for", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 70.41.3.18",
    });

    expect(getClientIp(headers)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({
      "x-real-ip": "198.51.100.42",
    });

    expect(getClientIp(headers)).toBe("198.51.100.42");
  });

  it("returns unknown when no proxy headers exist", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
