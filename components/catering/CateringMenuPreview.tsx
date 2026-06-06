"use client";

import { useMemo, useState } from "react";

import { VegBadge } from "@/components/menu/VegBadge";
import { CATEGORY_LABELS, CATERING_PREVIEW_GROUPS } from "@/lib/data/categories";
import type { CateringItem } from "@/lib/data/catering-menu";
import { cn } from "@/lib/utils";

type TabDiet = "veg" | "non-veg";

export interface CateringMenuPreviewProps {
  items: CateringItem[];
}

export function CateringMenuPreview({ items }: CateringMenuPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabDiet>("veg");

  const itemsByGroup = useMemo(() => {
    const filtered = items.filter(
      (item) => item.isAvailable && item.diet === activeTab,
    );

    return CATERING_PREVIEW_GROUPS.map((group) => ({
      ...group,
      items: filtered.filter((item) =>
        group.categories.includes(item.category),
      ),
    })).filter((group) => group.items.length > 0);
  }, [activeTab, items]);

  return (
    <section
      className="bg-cream/30 py-16 sm:py-24"
      aria-labelledby="catering-menu-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2
            id="catering-menu-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Sample Catering Menu
          </h2>
          <p className="mt-4 text-text/70">
            Final menu will be customized based on your event. Contact us for
            full options.
          </p>
        </div>

        <div
          className="mb-8 flex justify-center gap-2"
          role="tablist"
          aria-label="Catering menu diet tabs"
        >
          {(["veg", "non-veg"] as TabDiet[]).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-neon focus-visible:ring-offset-2",
                activeTab === tab
                  ? "bg-green-deep text-cream"
                  : "border border-green-soft/30 bg-bg text-text/80 hover:text-green-deep",
              )}
            >
              {tab === "veg" ? "Vegetarian" : "Non-Vegetarian"}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-3xl space-y-8">
          {itemsByGroup.length === 0 ? (
            <p className="text-center text-text/60">
              No catering items available for this selection.
            </p>
          ) : (
            itemsByGroup.map((group) => (
              <div key={group.key}>
                <h3 className="mb-4 font-heading text-lg font-semibold text-green-deep">
                  {group.label}
                </h3>
                <ul className="divide-y divide-green-soft/20 rounded-2xl border border-green-soft/20 bg-bg">
                  {group.items.map((item) => (
                    <CateringMenuRow key={item.id} item={item} />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CateringMenuRow({ item }: { item: CateringItem }) {
  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <VegBadge diet={item.diet} />
        <div className="min-w-0">
          <p className="font-medium text-green-deep">{item.name}</p>
          <p className="text-xs text-text/50">
            {CATEGORY_LABELS[item.category]}
          </p>
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold text-orange">
        ₹{item.pricePerPlate}/plate
      </span>
    </li>
  );
}
