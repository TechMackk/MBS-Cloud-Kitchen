import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/**
 * Runs axe WCAG 2A/2AA checks and fails on serious or critical violations.
 */
export async function checkA11y(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );

  if (blocking.length > 0) {
    console.warn(
      "Accessibility violations:",
      JSON.stringify(blocking, null, 2),
    );
  }

  expect(blocking).toEqual([]);
}
