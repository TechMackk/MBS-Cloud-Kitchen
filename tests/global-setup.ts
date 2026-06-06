import { execSync } from "node:child_process";

export default async function globalSetup() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn("[global-setup] DATABASE_URL not set — skipping DB seed");
    return;
  }

  try {
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: process.env,
    });
    execSync("npx prisma db seed", {
      stdio: "inherit",
      env: process.env,
    });

    const adminEmail = process.env.TEST_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL;
    const adminPassword =
      process.env.TEST_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      execSync("npm run create-admin", {
        stdio: "inherit",
        env: {
          ...process.env,
          ADMIN_EMAIL: adminEmail,
          ADMIN_PASSWORD: adminPassword,
          ADMIN_NAME: process.env.TEST_ADMIN_NAME ?? "Test Admin",
        },
      });
    }
  } catch (error) {
    console.warn("[global-setup] Database setup failed:", error);
  }
}
