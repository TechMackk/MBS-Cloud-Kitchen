export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not Found", { status: 404 });
  }

  throw new Error("Sentry test error — Phase 8A verification");
}
