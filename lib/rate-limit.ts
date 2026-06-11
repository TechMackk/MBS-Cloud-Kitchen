import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

type WindowDuration = "1m" | "15m" | "1h";

type LimiterConfig = {
  requests: number;
  window: WindowDuration;
  prefix: string;
};

type Limiter = {
  limit: (key: string) => Promise<RateLimitResult>;
};

const memoryStores = new Map<
  string,
  Map<string, { count: number; resetAt: number }>
>();
const upstashLimiters = new Map<string, Ratelimit>();

function parseWindowMs(window: WindowDuration): number {
  switch (window) {
    case "1m":
      return 60_000;
    case "15m":
      return 15 * 60_000;
    case "1h":
      return 60 * 60_000;
  }
}

function toUpstashWindow(window: WindowDuration): "1 m" | "15 m" | "1 h" {
  switch (window) {
    case "1m":
      return "1 m";
    case "15m":
      return "15 m";
    case "1h":
      return "1 h";
  }
}

function getMemoryStore(
  prefix: string,
): Map<string, { count: number; resetAt: number }> {
  let store = memoryStores.get(prefix);
  if (!store) {
    store = new Map();
    memoryStores.set(prefix, store);
  }
  return store;
}

function checkMemoryRateLimit(
  key: string,
  config: LimiterConfig,
): RateLimitResult {
  const now = Date.now();
  const store = getMemoryStore(config.prefix);
  const windowMs = parseWindowMs(config.window);
  const fullKey = `${config.prefix}:${key}`;
  const entry = store.get(fullKey);

  store.forEach((value, mapKey) => {
    if (value.resetAt <= now) {
      store.delete(mapKey);
    }
  });

  if (!entry || entry.resetAt <= now) {
    store.set(fullKey, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: config.requests - 1,
      reset: now + windowMs,
    };
  }

  if (entry.count >= config.requests) {
    return { success: false, remaining: 0, reset: entry.resetAt };
  }

  entry.count += 1;
  store.set(fullKey, entry);
  return {
    success: true,
    remaining: config.requests - entry.count,
    reset: entry.resetAt,
  };
}

function getUpstashLimiter(config: LimiterConfig): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const cacheKey = `${config.prefix}:${config.requests}:${config.window}`;
  let limiter = upstashLimiters.get(cacheKey);

  if (!limiter) {
    const redis = new Redis({ url, token });
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        config.requests,
        toUpstashWindow(config.window),
      ),
      prefix: `mbs-${config.prefix}`,
    });
    upstashLimiters.set(cacheKey, limiter);
  }

  return limiter;
}

/**
 * Creates a rate limiter with Upstash Redis when configured, otherwise in-memory.
 */
export function createLimiter(config: LimiterConfig): Limiter {
  return {
    async limit(key: string): Promise<RateLimitResult> {
      const upstash = getUpstashLimiter(config);

      if (!upstash) {
        if (process.env.NODE_ENV === "production") {
          console.warn(
            `[rate-limit] Upstash not configured — using in-memory limiter for ${config.prefix}`,
          );
        }
        return checkMemoryRateLimit(key, config);
      }

      const result = await upstash.limit(key);
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
      };
    },
  };
}

function getHourlyLimit(): number {
  const value = Number(process.env.CHAT_RATE_LIMIT_PER_HOUR ?? "20");
  return Number.isFinite(value) && value > 0 ? value : 20;
}

function getSessionMessageLimit(): number {
  const value = Number(process.env.CHAT_MAX_MESSAGES_PER_SESSION ?? "50");
  return Number.isFinite(value) && value > 0 ? value : 50;
}

export const chatLimiter = createLimiter({
  requests: getHourlyLimit(),
  window: "1h",
  prefix: "chat",
});

export const loginEmailLimiter = createLimiter({
  requests: 5,
  window: "15m",
  prefix: "login-email",
});

export const loginIpLimiter = createLimiter({
  requests: 20,
  window: "15m",
  prefix: "login-ip",
});

export const orderLimiter = createLimiter({
  requests: 5,
  window: "1h",
  prefix: "order",
});

export const cateringLimiter = createLimiter({
  requests: 3,
  window: "1h",
  prefix: "catering",
});

export const webhookLimiter = createLimiter({
  requests: 100,
  window: "1m",
  prefix: "wh",
});

/** @deprecated Use chatLimiter.limit() */
export async function checkChatRateLimit(ip: string): Promise<RateLimitResult> {
  return chatLimiter.limit(ip);
}

/**
 * Rate-limits admin login by email and IP before credential verification.
 */
export async function checkLoginRateLimit(
  ip: string,
  email: string,
): Promise<RateLimitResult> {
  const [ipResult, emailResult] = await Promise.all([
    loginIpLimiter.limit(ip),
    loginEmailLimiter.limit(email),
  ]);

  if (!ipResult.success) {
    return ipResult;
  }

  return emailResult;
}
export function getSessionMessageLimitValue(): number {
  return getSessionMessageLimit();
}
