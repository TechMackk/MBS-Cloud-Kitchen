import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminCateringFilters } from "@/components/admin/AdminCateringFilters";
import { AdminShell } from "@/components/admin/AdminShell";
import { CateringTable } from "@/components/admin/tables/CateringTable";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import {
  isDietType,
  isMenuCategory,
  type DietType,
  type MenuCategory,
} from "@/lib/data/categories";
import { countCateringItems, getCateringItems } from "@/lib/db/catering";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type AdminCateringPageProps = {
  searchParams: Promise<{
    category?: string;
    diet?: string;
    q?: string;
    availability?: string;
    sort?: string;
    order?: string;
    page?: string;
  }>;
};

export default async function AdminCateringPage({
  searchParams,
}: AdminCateringPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const category =
    params.category && isMenuCategory(params.category)
      ? (params.category as MenuCategory)
      : undefined;

  const diet =
    params.diet && isDietType(params.diet)
      ? (params.diet as DietType)
      : undefined;

  const q = params.q?.trim() || undefined;
  const sort = params.sort === "price" ? "price" : "name";
  const order = params.order === "desc" ? "desc" : "asc";

  const availableOnly =
    params.availability === "available"
      ? true
      : params.availability === "unavailable"
        ? false
        : undefined;

  const filters = {
    category,
    diet,
    q,
    includeUnavailable: true as const,
    availableOnly,
    sort: sort as "name" | "price",
    order: order as "asc" | "desc",
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const [items, total] = await Promise.all([
    getCateringItems(filters),
    countCateringItems({
      category,
      diet,
      q,
      includeUnavailable: true,
      availableOnly,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-green-deep">
            Catering Items
          </h1>
          <p className="text-sm text-text/60">{total} items total</p>
        </div>
        <Button asChild>
          <Link href="/admin/catering/new">Add New</Link>
        </Button>
      </div>

      <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-cream/50" />}>
        <AdminCateringFilters />
      </Suspense>

      <CateringTable items={items} sort={sort} order={order} />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            const query = new URLSearchParams();
            if (params.category) query.set("category", params.category);
            if (params.diet) query.set("diet", params.diet);
            if (params.q) query.set("q", params.q);
            if (params.availability)
              query.set("availability", params.availability);
            if (params.sort) query.set("sort", params.sort);
            if (params.order) query.set("order", params.order);
            query.set("page", String(pageNum));

            return (
              <Link
                key={pageNum}
                href={`/admin/catering?${query.toString()}`}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  pageNum === page
                    ? "bg-green-deep text-cream"
                    : "border border-green-soft/30 hover:bg-cream"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
