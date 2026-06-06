import { beforeEach, describe, expect, it } from "vitest";

import { createLimiter } from "@/lib/rate-limit";

describe("createLimiter", () => {
  beforeEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = "";
    process.env.UPSTASH_REDIS_REST_TOKEN = "";
  });

  it("allows requests within the configured window", async () => {
    const limiter = createLimiter({
      requests: 3,
      window: "1m",
      prefix: "test-allow",
    });

    const first = await limiter.limit("user-1");
    const second = await limiter.limit("user-1");

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
  });

  it("blocks requests after the limit is exceeded", async () => {
    const limiter = createLimiter({
      requests: 2,
      window: "1m",
      prefix: "test-block",
    });

    await limiter.limit("user-2");
    await limiter.limit("user-2");
    const third = await limiter.limit("user-2");

    expect(third.success).toBe(false);
  });
});
