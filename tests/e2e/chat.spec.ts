import { expect, test } from "@playwright/test";

test.describe("Chat widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/chat", async (route) => {
      const stream =
        '0:"Our Chicken Biryani is a Hyderabadi favourite. Browse /menu or WhatsApp us to order."\n';

      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Vercel-AI-Data-Stream": "v1",
        },
        body: stream,
      });
    });
  });

  test("opens chat, shows suggestions, and responds", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", { name: /Open MBS Assistant chat/i })
      .click();
    await expect(
      page.getByRole("dialog", { name: /MBS Assistant chat/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /popular biryani/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /popular biryani/i }).click();

    await expect(page.getByText(/Chicken Biryani|WhatsApp/i)).toBeVisible({
      timeout: 15_000,
    });

    await page.getByLabel("Chat message").fill("I want to order");
    await page.getByLabel("Send message").click();

    await expect(page.getByText(/order|cart|WhatsApp/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
