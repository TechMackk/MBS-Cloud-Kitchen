import { expect, test } from "@playwright/test";

test.describe("Public ordering flow", () => {
  test("homepage shows hero and featured dishes", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Mind, Body & Soul/i })).toBeVisible();

    const specials = page.getByRole("heading", { name: /Today's Specials/i });
    await expect(specials).toBeVisible();

    const dishCards = page.locator("section", {
      has: page.getByRole("heading", { name: /Today's Specials/i }),
    }).getByRole("button", { name: /Add to Cart/i });

    await expect(dishCards.first()).toBeVisible({ timeout: 15_000 });
    expect(await dishCards.count()).toBeGreaterThanOrEqual(1);
  });

  test("menu filter, search, cart, and checkout", async ({ page }) => {
    await page.goto("/menu");

    await page.getByLabel("Filter by diet").selectOption("veg");
    await expect(page.getByText(/\d+ dishes?/i)).toBeVisible();

    await page.getByLabel("Search dishes by name").fill("biryani");
    await page.getByLabel("Search dishes by name").press("Enter");

    const biryaniCard = page.getByRole("heading", { name: /biryani/i }).first();
    await expect(biryaniCard).toBeVisible({ timeout: 15_000 });

    const addButton = page.getByRole("button", { name: /Add to Cart/i }).first();
    await addButton.click();

    await expect(
      page.getByRole("button", { name: /Shopping cart, 1 items/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Shopping cart/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByLabel("Increase quantity").click();
    await expect(page.getByText(/₹/)).toBeVisible();

    await page.getByRole("link", { name: /Checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    await page.getByLabel("Customer Name").fill("Test Customer");
    await page.getByLabel(/Phone \(\+91\)/i).fill("9876543210");
    await page.getByLabel("Delivery Address").fill(
      "Road No 3, Hyderabad, 500091",
    );

    await page
      .getByRole("button", { name: /Place Order via WhatsApp/i })
      .click();

    await expect(page).toHaveURL(/\/order\/MBS-/, { timeout: 20_000 });
    await expect(page.getByText(/Order Confirmed|MBS-/i)).toBeVisible();
  });
});
