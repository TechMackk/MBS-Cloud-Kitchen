import * as Sentry from "@sentry/nextjs";

export async function withAdminAction<T>(
  actionName: string,
  handler: () => Promise<T>,
  tags?: Record<string, string>,
): Promise<T> {
  return Sentry.startSpan(
    {
      name: `admin.${actionName}`,
      op: "admin.action",
    },
    async () => {
      Sentry.setTag("action", actionName);
      Sentry.setTag("user_role", "admin");

      if (tags) {
        for (const [key, value] of Object.entries(tags)) {
          Sentry.setTag(key, value);
        }
      }

      try {
        return await handler();
      } catch (error) {
        Sentry.captureException(error, {
          tags: { action: actionName, ...tags },
        });
        throw error;
      }
    },
  );
}

export function captureHandledError(
  error: unknown,
  context?: Record<string, string>,
): void {
  Sentry.captureException(error, {
    tags: context,
  });
}
