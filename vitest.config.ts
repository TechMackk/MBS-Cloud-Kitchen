import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: [
        "lib/utils/slugify.ts",
        "lib/utils/reference-number.ts",
        "lib/utils/request-ip.ts",
        "lib/db/mappers.ts",
        "lib/whatsapp/deeplink.ts",
        "lib/cart/store.ts",
        "lib/knowledge/chunker.ts",
        "lib/rate-limit.ts",
        "lib/security/headers.ts",
      ],
      thresholds: {
        lines: 75,
        "lib/db/mappers.ts": { lines: 90 },
        "lib/whatsapp/deeplink.ts": { lines: 80 },
        "lib/cart/store.ts": { lines: 80 },
      },
    },
  },
});
