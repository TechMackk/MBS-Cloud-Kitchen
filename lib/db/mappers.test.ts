import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { MENU_CATEGORIES } from "@/lib/data/categories";
import {
  categoryFromDb,
  categoryToDb,
  dietFromDb,
  dietToDb,
  toCateringItem,
  toMenuItem,
} from "@/lib/db/mappers";

describe("diet mappers", () => {
  it("maps diet types bidirectionally", () => {
    expect(dietToDb("veg")).toBe("VEG");
    expect(dietFromDb("VEG")).toBe("veg");
    expect(dietToDb("non-veg")).toBe("NON_VEG");
    expect(dietFromDb("NON_VEG")).toBe("non-veg");
    expect(dietToDb("egg")).toBe("EGG");
    expect(dietFromDb("EGG")).toBe("egg");
  });
});

describe("category mappers", () => {
  it("maps all menu categories bidirectionally", () => {
    for (const category of MENU_CATEGORIES) {
      const dbValue = categoryToDb(category);
      expect(categoryFromDb(dbValue)).toBe(category);
    }
  });
});

describe("toMenuItem", () => {
  it("converts a Prisma row to a MenuItem with decimal price", () => {
    const row = {
      id: "item-1",
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      description: "Hyderabadi style",
      longDescription: "Long description",
      prepNotes: ["Fresh spices"],
      category: "BIRYANI" as const,
      diet: "NON_VEG" as const,
      price: new Prisma.Decimal(249),
      imageUrl: "https://example.com/biryani.jpg",
      isAvailable: true,
      isFeatured: true,
      spiceLevel: 2,
      servingSize: "Serves 2",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const item = toMenuItem(row);

    expect(item.price).toBe(249);
    expect(item.category).toBe("biryani");
    expect(item.diet).toBe("non-veg");
    expect(item.spiceLevel).toBe(2);
  });
});

describe("toCateringItem", () => {
  it("converts a Prisma catering row", () => {
    const row = {
      id: "cat-1",
      slug: "veg-meal",
      name: "Veg Meal",
      diet: "VEG" as const,
      category: "RICE" as const,
      pricePerPlate: new Prisma.Decimal(180),
      description: "Festive veg spread",
      imageUrl: "https://example.com/veg.jpg",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const item = toCateringItem(row);

    expect(item.pricePerPlate).toBe(180);
    expect(item.diet).toBe("veg");
    expect(item.category).toBe("rice");
  });
});
