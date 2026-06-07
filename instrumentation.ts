export async function register() {
  // Edge middleware must never load Sentry — the edge bundle inlines this file
  // with NEXT_RUNTIME=edge, so guard on nodejs only (no edge branch at all).
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  await import("./sentry.server.config");
}

export async function onRequestError(
  ...args: Parameters<
    typeof import("@sentry/nextjs").captureRequestError
  >
): Promise<void> {
  if (
    process.env.NEXT_RUNTIME !== "nodejs" ||
    !process.env.NEXT_PUBLIC_SENTRY_DSN
  ) {
    return;
  }

  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(...args);
}
