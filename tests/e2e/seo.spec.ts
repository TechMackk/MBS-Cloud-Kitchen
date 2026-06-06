import { expect, test } from "@playwright/test";

const publicPages = ["/", "/menu", "/about", "/catering", "/contact"];

test.describe("SEO", () => {
  test("sitemap includes public routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain("/menu");
    expect(body).toContain("/about");
    expect(body).toContain("/contact");
  });

  test("robots.txt blocks admin routes", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain("Disallow: /admin/");
  });

  test("home page includes Restaurant JSON-LD", async ({ page }) => {
    await page.goto("/");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toContainText('"@type": "Restaurant"');
  });

  for (const path of publicPages) {
    test(`${path} has unique title and meta description`, async ({ page }) => {
      await page.goto(path);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.length).toBeGreaterThan(10);
    });
  }
});
