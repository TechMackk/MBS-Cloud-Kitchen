/**
 * Shared Auth.js config for auth.ts (Node runtime only).
 * Keep free of providers and Node-only imports — providers live in auth.ts.
 * Admin route protection is handled in middleware.ts via session cookie check.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [] as const,
  trustHost: true,
};
