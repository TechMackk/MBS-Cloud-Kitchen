import { format } from "date-fns";
import { describe, expect, it } from "vitest";

import {
  generateCateringRequestNumber,
  generateOrderNumber,
} from "@/lib/utils/reference-number";

describe("generateOrderNumber", () => {
  it("uses MBS-YYYYMMDD-XXXX format", () => {
    const orderNumber = generateOrderNumber();
    const date = format(new Date(), "yyyyMMdd");

    expect(orderNumber).toMatch(/^MBS-\d{8}-\d{4}$/);
    expect(orderNumber).toContain(`MBS-${date}-`);
  });

  it("generates mostly unique values across many runs", () => {
    const values = new Set(
      Array.from({ length: 100 }, () => generateOrderNumber()),
    );

    // 4-digit suffix has a small collision chance; expect high uniqueness
    expect(values.size).toBeGreaterThanOrEqual(95);
  });
});

describe("generateCateringRequestNumber", () => {
  it("uses MBS-CAT-YYYYMMDD-XXXX format", () => {
    const requestNumber = generateCateringRequestNumber();
    const date = format(new Date(), "yyyyMMdd");

    expect(requestNumber).toMatch(/^MBS-CAT-\d{8}-\d{4}$/);
    expect(requestNumber).toContain(`MBS-CAT-${date}-`);
  });
});
