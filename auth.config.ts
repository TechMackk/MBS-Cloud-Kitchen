/**
 * Edge-safe Auth.js config shared by middleware and auth.ts.
 * Must not import Prisma, bcrypt, database clients, or other Node-only modules.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  trustHost: true,
  callbacks: {
    authorized({
      auth,
      request,
    }: {
      auth: { user?: unknown } | null;
      request: { nextUrl: URL };
    }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);

      if (pathname.startsWith("/admin/login")) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", request.nextUrl));
        }
        return true;
      }

      if (pathname.startsWith("/admin")) {
        return isLoggedIn;
      }

      return true;
    },
  },
};
