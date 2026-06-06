import { expect, test } from "@playwright/test";

import { checkA11y } from "./utils/axe";

test.describe("Accessibility", () => {
  test("home page passes axe checks", async ({ page }) => {
    await page.goto("/");
    await checkA11y(page);
  });

  test("menu page passes axe checks", async ({ page }) => {
    await page.goto("/menu");
    await page.getByLabel("Filter by diet").click();
    await checkA11y(page);
  });

  test("catering page passes axe checks", async ({ page }) => {
    await page.goto("/catering");
    await checkA11y(page);
  });

  test("about page passes axe checks", async ({ page }) => {
    await page.goto("/about");
    await checkA11y(page);
  });

  test("contact page passes axe checks", async ({ page }) => {
    await page.goto("/contact");
    await checkA11y(page);
  });

  test("admin login passes axe checks", async ({ page }) => {
    await page.goto("/admin/login");
    await checkA11y(page);
  });

  test("checkout with cart passes axe checks", async ({ page }) => {
    await page.goto("/menu");
    const addButton = page.getByRole("button", { name: /Add to Cart/i }).first();
    await addButton.click({ timeout: 15_000 });
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: /Checkout/i })).toBeVisible();
    await checkA11y(page);
  });

  test("skip link targets main content", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /Skip to main content/i });
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });
});
