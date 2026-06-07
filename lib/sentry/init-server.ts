import "server-only";

import * as Sentry from "@sentry/nextjs";

import { sentrySharedOptions } from "@/lib/sentry/shared";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

declare global {
  // eslint-disable-next-line no-var
  var __mbsSentryServerInit: boolean | undefined;
}

if (dsn && !globalThis.__mbsSentryServerInit) {
  globalThis.__mbsSentryServerInit = true;

  Sentry.init({
    ...sentrySharedOptions,
    dsn,
  });
}
