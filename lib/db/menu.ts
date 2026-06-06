import type { DietType, MenuCategory } from "@/lib/data/categories";
import type { MenuItem } from "@/lib/data/menu";
import { prisma } from "@/lib/db/client";
import { resolveSlugCollisionAsync } from "@/lib/utils/slugify";
import {
  categoryFromDb,
  categoryToDb,
  dietFromDb,
  dietToDb,
  toMenuItem,
} from "@/lib/db/mappers";

export type MenuSortField = "name" | "price";
export type SortOrder = "asc" | "desc";

export type MenuItemFilters = {
  category?: MenuCategory;
  diet?: DietType;
  q?: string;
  includeUnavailable?: boolean;
  availableOnly?: boolean;
  limit?: number;
  offset?: number;
  sort?: MenuSortField;
  order?: SortOrder;
};

function buildWhereClause(filters?: MenuItemFilters) {
  const availabilityFilter =
    filters?.includeUnavailable === true
      ? {}
      : filters?.availableOnly === false
        ? { isAvailable: false }
        : { isAvailable: true };

  return {
    ...(filters?.category
      ? { category: categoryToDb(filters.category) }
      : {}),
    ...(filters?.diet ? { diet: dietToDb(filters.diet) } : {}),
    ...(filters?.includeUnavailable
      ? filters?.availableOnly === false
        ? { isAvailable: false }
        : filters?.availableOnly === true
          ? { isAvailable: true }
          : {}
      : availabilityFilter),
    ...(filters?.q
      ? {
          name: {
            contains: filters.q,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };
}

function buildOrderBy(
  sort?: MenuSortField,
  order?: SortOrder,
): Array<Record<string, SortOrder>> {
  const direction = order ?? "asc";

  if (sort === "price") {
    return [{ price: direction }, { name: "asc" }];
  }

  if (sort === "name") {
    return [{ name: direction }];
  }

  return [{ category: "asc" }, { name: "asc" }];
}

export async function getMenuItems(
  filters?: MenuItemFilters,
): Promise<MenuItem[]> {
  try {
    const rows = await prisma.menuItem.findMany({
      where: buildWhereClause(filters),
      orderBy: buildOrderBy(filters?.sort, filters?.order),
      take: filters?.limit,
      skip: filters?.offset,
    });

    return rows.map(toMenuItem);
  } catch (error) {
    console.error("[getMenuItems] failed:", error);
    throw error;
  }
}

export async function countMenuItems(
  filters?: MenuItemFilters,
): Promise<number> {
  try {
    return await prisma.menuItem.count({
      where: buildWhereClause(filters),
    });
  } catch (error) {
    console.error("[countMenuItems] failed:", error);
    throw error;
  }
}

export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  try {
    const rows = await prisma.menuItem.findMany({
      where: { isFeatured: true, isAvailable: true },
      orderBy: { name: "asc" },
    });

    return rows.map(toMenuItem);
  } catch {
    return [];
  }
}

export async function getMenuItemBySlug(
  slug: string,
): Promise<MenuItem | null> {
  try {
    const row = await prisma.menuItem.findUnique({
      where: { slug },
    });

    return row ? toMenuItem(row) : null;
  } catch {
    return null;
  }
}

export async function getMenuItemForAdmin(
  slug: string,
): Promise<MenuItem | null> {
  return getMenuItemBySlug(slug);
}

export async function getMenuStats(): Promise<{
  total: number;
  available: number;
}> {
  try {
    const [total, available] = await Promise.all([
      prisma.menuItem.count(),
      prisma.menuItem.count({ where: { isAvailable: true } }),
    ]);

    return { total, available };
  } catch {
    return { total: 0, available: 0 };
  }
}

export async function resolveUniqueMenuSlug(
  baseSlug: string,
  excludeSlug?: string,
): Promise<string> {
  return resolveSlugCollisionAsync(baseSlug, async (candidate) => {
    if (candidate === excludeSlug) {
      return false;
    }

    const existing = await prisma.menuItem.findUnique({
      where: { slug: candidate },
      select: { slug: true },
    });

    return Boolean(existing);
  });
}

export { categoryFromDb, dietFromDb };
