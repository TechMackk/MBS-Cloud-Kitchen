import { expect, test } from "@playwright/test";
import path from "node:path";

const adminEmail = process.env.TEST_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL;
const adminPassword =
  process.env.TEST_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;

test.describe("Admin menu CRUD", () => {
  test.skip(
    !adminEmail || !adminPassword,
    "TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD required",
  );

  test("creates, edits, and deletes a menu item", async ({ page }) => {
    const uniqueName = `E2E Test Dish ${Date.now()}`;
    const slug = uniqueName.toLowerCase().replace(/\s+/g, "-");

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(adminEmail!);
    await page.getByLabel("Password").fill(adminPassword!);
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect(page).toHaveURL(/\/admin/);

    await page.goto("/admin/menu/new");
    await page.getByLabel(/^Name/i).fill(uniqueName);
    await page.getByLabel(/^Slug/i).fill(slug);
    await page.getByLabel(/^Description/i).fill("E2E test dish description");
    await page.getByLabel(/Long description/i).fill(
      "Long description for automated test dish.",
    );
    await page.getByLabel(/^Price/i).fill("199");

    const fixturePath = path.join(
      process.cwd(),
      "tests",
      "fixtures",
      "test-dish.jpg",
    );
    await page.locator("#image").setInputFiles(fixturePath);

    await page.getByRole("button", { name: /Create Menu Item/i }).click();
    await expect(page).toHaveURL(/\/admin\/menu/, { timeout: 20_000 });
    await expect(page.getByText(uniqueName)).toBeVisible();

    await page.getByRole("link", { name: /Edit/i }).first().click();
    await page.getByLabel(/^Price/i).fill("219");
    await page.getByRole("button", { name: /Save|Update/i }).click();

    await page.goto("/menu");
    await expect(page.getByText("₹219")).toBeVisible({ timeout: 15_000 });

    await page.goto("/admin/menu");
    await page
      .getByRole("row", { name: new RegExp(uniqueName) })
      .getByLabel(/Delete/i)
      .click();
    await page.getByRole("button", { name: /Confirm|Delete/i }).click();

    await expect(page.getByText(uniqueName)).not.toBeVisible();
  });
});
