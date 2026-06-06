"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORY_FILTER_LABELS,
  DIET_LABELS,
  isDietType,
  isMenuCategory,
  MENU_FILTER_CATEGORIES,
  type DietType,
  type MenuCategory,
} from "@/lib/data/categories";
import { cn } from "@/lib/utils";

export function AdminMenuFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.replace(`/admin/menu?${params.toString()}`);
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const current = searchParams.get("q") ?? "";
      if (search !== current) {
        updateParam("q", search.trim() || null);
      }
    }, 300);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const category = searchParams.get("category");
  const diet = searchParams.get("diet");
  const availability = searchParams.get("availability");

  return (
    <div className="mb-6 space-y-4">
      <Input
        type="search"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateParam("category", null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium",
            !category ? "bg-green-deep text-cream" : "border border-green-soft/30",
          )}
        >
          All Categories
        </button>
        {MENU_FILTER_CATEGORIES.filter((c) => c !== "all").map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => updateParam("category", cat)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              category === cat
                ? "bg-green-deep text-cream"
                : "border border-green-soft/30",
            )}
          >
            {CATEGORY_FILTER_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "veg", "non-veg", "egg"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => updateParam("diet", d === "all" ? null : d)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              (d === "all" && !diet) || diet === d
                ? "bg-orange text-white"
                : "border border-green-soft/30",
            )}
          >
            {d === "all" ? "All Diets" : DIET_LABELS[d as DietType]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: null, label: "All Status" },
            { key: "available", label: "Available" },
            { key: "unavailable", label: "Unavailable" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => updateParam("availability", opt.key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              availability === opt.key || (!availability && !opt.key)
                ? "bg-green-soft/30 text-green-deep"
                : "border border-green-soft/30",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {(category || diet || availability || search) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.replace("/admin/menu")}
        >
          Reset filters
        </Button>
      )}
    </div>
  );
}
