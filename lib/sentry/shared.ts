import type { ErrorEvent, EventHint } from "@sentry/nextjs";

import { scrubPiiFromEvent } from "@/lib/sentry/pii";

const IGNORED_ERRORS = [
  "ResizeObserver loop",
  "ResizeObserver loop limit exceeded",
  "AbortError",
  "The operation was aborted",
  "NetworkError",
  "Failed to fetch",
  "Load failed",
];

export function shouldIgnoreError(message: string): boolean {
  return IGNORED_ERRORS.some((pattern) => message.includes(pattern));
}

export function sentryBeforeSend(
  event: ErrorEvent,
  _hint: EventHint,
): ErrorEvent | null {
  const message = event.message ?? event.exception?.values?.[0]?.value ?? "";

  if (shouldIgnoreError(message)) {
    return null;
  }

  return scrubPiiFromEvent(event);
}

export const sentrySharedOptions = {
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  beforeSend: sentryBeforeSend,
};
