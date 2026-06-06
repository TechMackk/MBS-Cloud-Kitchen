import { PrismaClient } from "@prisma/client";

import { CATERING_ITEMS } from "../lib/data/catering-menu";
import { MENU_ITEMS } from "../lib/data/menu";
import {
  categoryToDb,
  dietToDb,
} from "../lib/db/mappers";

const prisma = new PrismaClient();

async function seedMenuItems(): Promise<number> {
  let count = 0;

  for (const item of MENU_ITEMS) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        longDescription: item.longDescription,
        prepNotes: item.prepNotes,
        category: categoryToDb(item.category),
        diet: dietToDb(item.diet),
        price: item.price,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
        spiceLevel: item.spiceLevel ?? null,
        servingSize: item.servingSize ?? null,
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        longDescription: item.longDescription,
        prepNotes: item.prepNotes,
        category: categoryToDb(item.category),
        diet: dietToDb(item.diet),
        price: item.price,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
        spiceLevel: item.spiceLevel ?? null,
        servingSize: item.servingSize ?? null,
      },
    });
    count += 1;
  }

  return count;
}

async function seedCateringItems(): Promise<number> {
  let count = 0;

  for (const item of CATERING_ITEMS) {
    await prisma.cateringItem.upsert({
      where: { slug: item.id },
      update: {
        name: item.name,
        diet: dietToDb(item.diet),
        category: categoryToDb(item.category),
        pricePerPlate: item.pricePerPlate,
        description: item.description,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
      },
      create: {
        slug: item.id,
        name: item.name,
        diet: dietToDb(item.diet),
        category: categoryToDb(item.category),
        pricePerPlate: item.pricePerPlate,
        description: item.description,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
      },
    });
    count += 1;
  }

  return count;
}

async function main() {
  const menuCount = await seedMenuItems();
  const cateringCount = await seedCateringItems();

  console.log(`Seeded ${menuCount} menu items, ${cateringCount} catering items`);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
