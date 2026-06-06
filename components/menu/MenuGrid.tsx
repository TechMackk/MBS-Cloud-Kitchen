"use client";

import { DishCard } from "@/components/menu/DishCard";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@/lib/data/menu";

export interface MenuGridProps {
  items: MenuItem[];
  totalCount: number;
  onDetailsClick: (item: MenuItem) => void;
  onResetFilters: () => void;
}

export function MenuGrid({
  items,
  totalCount,
  onDetailsClick,
  onResetFilters,
}: MenuGridProps) {
  return (
    <>
      <p className="mb-6 mt-8 text-sm text-text/60">
        Showing {items.length} of {totalCount} dishes
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-green-soft/20 bg-cream/30 px-6 py-16 text-center">
          <p className="font-heading text-lg font-semibold text-green-deep">
            No dishes match your filters
          </p>
          <p className="mt-2 text-sm text-text/60">
            Try adjusting your category, diet, or search terms.
          </p>
          <Button variant="outline" className="mt-6" onClick={onResetFilters}>
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              variant="full"
              onDetailsClick={onDetailsClick}
            />
          ))}
        </div>
      )}
    </>
  );
}
