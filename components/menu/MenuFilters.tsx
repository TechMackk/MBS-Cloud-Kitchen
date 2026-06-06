"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORY_FILTER_LABELS,
  DIET_LABELS,
  isDietType,
  isMenuCategory,
  MENU_FILTER_CATEGORIES,
  type DietFilter,
  type MenuCategoryFilter,
} from "@/lib/data/categories";
import { cn } from "@/lib/utils";

const DIET_OPTIONS: { value: DietFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "veg", label: DIET_LABELS.veg },
  { value: "non-veg", label: DIET_LABELS["non-veg"] },
  { value: "egg", label: DIET_LABELS.egg },
];

export function MenuFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") ?? "all";
  const dietParam = searchParams.get("diet") ?? "all";
  const searchParam = searchParams.get("q") ?? "";

  const category: MenuCategoryFilter =
    categoryParam === "all" || isMenuCategory(categoryParam)
      ? (categoryParam as MenuCategoryFilter)
      : "all";

  const diet: DietFilter =
    dietParam === "all" || isDietType(dietParam)
      ? (dietParam as DietFilter)
      : "all";

  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const updateParams = useCallback(
    (updates: {
      category?: MenuCategoryFilter;
      diet?: DietFilter;
      search?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      const nextCategory = updates.category ?? category;
      const nextDiet = updates.diet ?? diet;
      const nextSearch =
        updates.search !== undefined ? updates.search : searchParam;

      if (nextCategory === "all") {
        params.delete("category");
      } else {
        params.set("category", nextCategory);
      }

      if (nextDiet === "all") {
        params.delete("diet");
      } else {
        params.set("diet", nextDiet);
      }

      if (nextSearch.trim()) {
        params.set("q", nextSearch.trim());
      } else {
        params.delete("q");
      }

      const query = params.toString();
      router.replace(query ? `/menu?${query}` : "/menu", { scroll: false });
    },
    [category, diet, router, searchParam, searchParams],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchInput !== searchParam) {
        updateParams({ search: searchInput });
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, searchParam, updateParams]);

  const hasActiveFilters = useMemo(
    () => category !== "all" || diet !== "all" || searchParam.trim() !== "",
    [category, diet, searchParam],
  );

  function resetFilters() {
    setSearchInput("");
    router.replace("/menu", { scroll: false });
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search dishes..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="pl-11"
          aria-label="Search dishes by name"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-green-deep">Category</p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {MENU_FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateParams({ category: cat })}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-neon focus-visible:ring-offset-2",
                category === cat
                  ? "bg-green-deep text-cream shadow-glow"
                  : "border border-green-soft/30 bg-bg text-text/80 hover:border-green-soft hover:text-green-deep",
              )}
              aria-pressed={category === cat}
            >
              {CATEGORY_FILTER_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-green-deep">Diet</p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by diet"
        >
          {DIET_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateParams({ diet: option.value })}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-neon focus-visible:ring-offset-2",
                diet === option.value
                  ? "bg-orange text-white shadow-glow-orange"
                  : "border border-green-soft/30 bg-bg text-text/80 hover:border-orange/50 hover:text-green-deep",
              )}
              aria-pressed={diet === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="gap-2"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Reset filters
        </Button>
      )}
    </div>
  );
}
