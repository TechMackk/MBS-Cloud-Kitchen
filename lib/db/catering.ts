import type { DietType, MenuCategory } from "@/lib/data/categories";
import type { CateringItem } from "@/lib/data/catering-menu";
import { prisma } from "@/lib/db/client";
import {
  categoryToDb,
  dietToDb,
  toCateringItem,
} from "@/lib/db/mappers";

export type CateringSortField = "name" | "price";
export type SortOrder = "asc" | "desc";

export type CateringItemFilters = {
  diet?: DietType;
  category?: MenuCategory;
  q?: string;
  includeUnavailable?: boolean;
  availableOnly?: boolean;
  limit?: number;
  offset?: number;
  sort?: CateringSortField;
  order?: SortOrder;
};

function buildWhereClause(filters?: CateringItemFilters) {
  const availabilityFilter =
    filters?.includeUnavailable === true
      ? {}
      : filters?.availableOnly === false
        ? { isAvailable: false }
        : { isAvailable: true };

  return {
    ...(filters?.diet ? { diet: dietToDb(filters.diet) } : {}),
    ...(filters?.category
      ? { category: categoryToDb(filters.category) }
      : {}),
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
  sort?: CateringSortField,
  order?: SortOrder,
): Array<Record<string, SortOrder>> {
  const direction = order ?? "asc";

  if (sort === "price") {
    return [{ pricePerPlate: direction }, { name: "asc" }];
  }

  if (sort === "name") {
    return [{ name: direction }];
  }

  return [{ category: "asc" }, { name: "asc" }];
}

export async function getCateringItems(
  filters?: CateringItemFilters,
): Promise<CateringItem[]> {
  try {
    const rows = await prisma.cateringItem.findMany({
      where: buildWhereClause(filters),
      orderBy: buildOrderBy(filters?.sort, filters?.order),
      take: filters?.limit,
      skip: filters?.offset,
    });

    return rows.map(toCateringItem);
  } catch {
    return [];
  }
}

export async function countCateringItems(
  filters?: CateringItemFilters,
): Promise<number> {
  try {
    return await prisma.cateringItem.count({
      where: buildWhereClause(filters),
    });
  } catch {
    return 0;
  }
}

export async function getCateringItemBySlug(
  slug: string,
): Promise<CateringItem | null> {
  try {
    const row = await prisma.cateringItem.findUnique({
      where: { slug },
    });

    return row ? toCateringItem(row) : null;
  } catch {
    return null;
  }
}

export async function getCateringItemForAdmin(
  slug: string,
): Promise<CateringItem | null> {
  return getCateringItemBySlug(slug);
}

export async function getCateringStats(): Promise<{
  total: number;
  available: number;
}> {
  try {
    const [total, available] = await Promise.all([
      prisma.cateringItem.count(),
      prisma.cateringItem.count({ where: { isAvailable: true } }),
    ]);

    return { total, available };
  } catch {
    return { total: 0, available: 0 };
  }
}

export async function resolveUniqueCateringSlug(
  baseSlug: string,
  excludeSlug?: string,
): Promise<string> {
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    if (candidate === excludeSlug) {
      return candidate;
    }

    const existing = await prisma.cateringItem.findUnique({
      where: { slug: candidate },
      select: { slug: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}
