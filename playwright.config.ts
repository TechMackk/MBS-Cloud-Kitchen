import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./tests/global-setup.ts",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/mbs_test",
      DIRECT_URL:
        process.env.DIRECT_URL ??
        "postgresql://postgres:postgres@localhost:5432/mbs_test",
      AUTH_SECRET: "test-auth-secret-minimum-32-characters-long",
      NEXTAUTH_SECRET: "test-auth-secret-minimum-32-characters-long",
      NEXTAUTH_URL: baseURL,
      ENABLE_WHATSAPP_API: "false",
      NEXT_PUBLIC_SENTRY_DSN: "",
      OPENAI_API_KEY: "test-key",
    },
  },
});
