import { expect, test } from "@playwright/test";

test.describe("Catering request flow", () => {
  test("submits a multi-step catering enquiry", async ({ page }) => {
    await page.goto("/catering");

    await page.locator("#occasion").click();
    await page.getByRole("option", { name: /Wedding/i }).click();

    await page.getByLabel("Lunch").click();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    const dateValue = futureDate.toISOString().split("T")[0] ?? "2026-12-01";

    await page.getByLabel("Event Date").fill(dateValue);
    await page.getByLabel("Number of Guests").fill("50");

    await page.getByLabel("Veg Only").click();

    await page.getByRole("button", { name: /Next/i }).click();

    const menuCheckboxes = page.getByRole("checkbox");
    const count = await menuCheckboxes.count();
    expect(count).toBeGreaterThanOrEqual(3);

    await menuCheckboxes.nth(0).check();
    await menuCheckboxes.nth(1).check();
    await menuCheckboxes.nth(2).check();

    await page.getByRole("button", { name: /Next/i }).click();

    await page.getByLabel(/^Name /i).fill("Catering Test Host");
    await page.getByLabel(/^Phone /i).fill("9876543210");
    await page.getByLabel("Event Location").fill("Jubilee Hills, Hyderabad");

    await page
      .getByRole("button", { name: /Send Catering Request/i })
      .click();

    await expect(page).toHaveURL(/\/catering\/request\/MBS-CAT-/, {
      timeout: 20_000,
    });
    await expect(page.getByText(/Request Received/i)).toBeVisible();
  });
});
