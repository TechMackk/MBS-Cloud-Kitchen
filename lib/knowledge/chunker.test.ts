import { describe, expect, it } from "vitest";

import type { MenuItem } from "@/lib/data/menu";
import { chunkMdxByHeadings, chunkMenuItem } from "@/lib/knowledge/chunker";

const sampleMenuItem: MenuItem = {
  id: "item-1",
  slug: "chicken-biryani",
  name: "Chicken Biryani",
  description: "Hyderabadi style",
  longDescription: "Aromatic basmati rice with tender chicken.",
  prepNotes: ["Slow cooked"],
  category: "biryani",
  diet: "non-veg",
  price: 249,
  imageUrl: "https://example.com/biryani.jpg",
  isAvailable: true,
  isFeatured: true,
  spiceLevel: 2,
  servingSize: "Serves 2",
};

describe("chunkMenuItem", () => {
  it("creates a knowledge chunk with menu metadata", () => {
    const chunk = chunkMenuItem(sampleMenuItem);

    expect(chunk.source).toBe("menu");
    expect(chunk.title).toBe("Chicken Biryani");
    expect(chunk.content).toContain("₹249");
    expect(chunk.metadata.slug).toBe("chicken-biryani");
  });
});

describe("chunkMdxByHeadings", () => {
  it("splits MDX content by H2 headings", () => {
    const raw = `# About Us

## Our Story
We started in Hyderabad.

## Our Values
Fresh ingredients daily.
`;

    const chunks = chunkMdxByHeadings(raw, "about", "about");

    expect(chunks).toHaveLength(2);
    expect(chunks[0]?.title).toBe("Our Story");
    expect(chunks[1]?.title).toBe("Our Values");
  });

  it("handles empty content gracefully", () => {
    const chunks = chunkMdxByHeadings("# Title only\n", "policy", "policy");

    expect(chunks).toHaveLength(0);
  });
});
