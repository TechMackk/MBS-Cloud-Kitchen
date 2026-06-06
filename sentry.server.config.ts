import * as Sentry from "@sentry/nextjs";

import { sentrySharedOptions } from "@/lib/sentry/shared";

Sentry.init({
  ...sentrySharedOptions,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
