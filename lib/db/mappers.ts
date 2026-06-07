import type {
  CateringItem as PrismaCateringItem,
  MenuItem as PrismaMenuItem,
  DietType as PrismaDietType,
  MenuCategory as PrismaMenuCategory,
} from "@prisma/client";
import type { DietType, MenuCategory } from "@/lib/data/categories";
import type { CateringItem } from "@/lib/data/catering-menu";
import type { MenuItem } from "@/lib/data/menu";

const DIET_TO_DB: Record<DietType, PrismaDietType> = {
  veg: "VEG",
  "non-veg": "NON_VEG",
  egg: "EGG",
};

const DIET_FROM_DB: Record<PrismaDietType, DietType> = {
  VEG: "veg",
  NON_VEG: "non-veg",
  EGG: "egg",
};

const CATEGORY_TO_DB: Record<MenuCategory, PrismaMenuCategory> = {
  biryani: "BIRYANI",
  "fried-rice": "FRIED_RICE",
  noodles: "NOODLES",
  starter: "STARTER",
  rice: "RICE",
  curry: "CURRY",
  bread: "BREAD",
  dessert: "DESSERT",
  beverage: "BEVERAGE",
};

const CATEGORY_FROM_DB: Record<PrismaMenuCategory, MenuCategory> = {
  BIRYANI: "biryani",
  FRIED_RICE: "fried-rice",
  NOODLES: "noodles",
  STARTER: "starter",
  RICE: "rice",
  CURRY: "curry",
  BREAD: "bread",
  DESSERT: "dessert",
  BEVERAGE: "beverage",
};

/** Maps frontend diet slug to Prisma enum. */
export function dietToDb(diet: DietType): PrismaDietType {
  return DIET_TO_DB[diet];
}

/** Maps Prisma diet enum to frontend slug. */
export function dietFromDb(diet: PrismaDietType): DietType {
  return DIET_FROM_DB[diet];
}

/** Maps frontend category slug to Prisma enum. */
export function categoryToDb(category: MenuCategory): PrismaMenuCategory {
  return CATEGORY_TO_DB[category];
}

/** Maps Prisma category enum to frontend slug. */
export function categoryFromDb(category: PrismaMenuCategory): MenuCategory {
  const mapped = CATEGORY_FROM_DB[category];
  if (!mapped) {
    throw new Error(`Unknown menu category from database: ${category}`);
  }
  return mapped;
}

function decimalToNumber(
  value: { toNumber(): number } | number | string,
): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value.toNumber();
}

/** Converts a Prisma MenuItem row to the frontend MenuItem type. */
export function toMenuItem(row: PrismaMenuItem): MenuItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.longDescription,
    prepNotes: row.prepNotes ?? [],
    category: categoryFromDb(row.category),
    diet: dietFromDb(row.diet),
    price: decimalToNumber(row.price),
    imageUrl: row.imageUrl,
    isAvailable: row.isAvailable,
    isFeatured: row.isFeatured,
    spiceLevel:
      row.spiceLevel === 1 || row.spiceLevel === 2 || row.spiceLevel === 3
        ? row.spiceLevel
        : undefined,
    servingSize: row.servingSize ?? undefined,
    calories: row.calories ?? undefined,
    protein: row.protein ?? undefined,
    tags: row.tags.length > 0 ? row.tags : undefined,
  };
}

/** Converts a Prisma CateringItem row to the frontend CateringItem type. */
export function toCateringItem(row: PrismaCateringItem): CateringItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    diet: dietFromDb(row.diet),
    category: categoryFromDb(row.category),
    pricePerPlate: decimalToNumber(row.pricePerPlate),
    description: row.description,
    imageUrl: row.imageUrl,
    isAvailable: row.isAvailable,
  };
}
