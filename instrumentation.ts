export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { initServerSentry } = await import("@/lib/sentry/init-server");
  initServerSentry();
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
