import { describe, expect, it } from "vitest";

import { resolveSlugCollision, slugify } from "@/lib/utils/slugify";

describe("slugify", () => {
  it("converts a normal name to a slug", () => {
    expect(slugify("Chicken Biryani")).toBe("chicken-biryani");
  });

  it("strips special characters", () => {
    expect(slugify("Paneer 65 (Spicy!)")).toBe("paneer-65-spicy");
  });

  it("handles empty and whitespace input", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
  });
});

describe("resolveSlugCollision", () => {
  it("returns base slug when available", () => {
    const taken = new Set(["other-item"]);
    expect(
      resolveSlugCollision("chicken-biryani", (slug) => taken.has(slug)),
    ).toBe("chicken-biryani");
  });

  it("appends -2 and -3 suffixes for duplicates", () => {
    const taken = new Set(["chicken-biryani", "chicken-biryani-2"]);
    expect(
      resolveSlugCollision("chicken-biryani", (slug) => taken.has(slug)),
    ).toBe("chicken-biryani-3");
  });
});
