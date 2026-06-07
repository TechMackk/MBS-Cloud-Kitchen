import * as Sentry from "@sentry/nextjs";

import { sentrySharedOptions } from "@/lib/sentry/shared";

export function initServerSentry(): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  Sentry.init({
    ...sentrySharedOptions,
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}
