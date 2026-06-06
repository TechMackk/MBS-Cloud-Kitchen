"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DishDetailModal = dynamic(
  () =>
    import("@/components/menu/DishDetailModal").then(
      (mod) => mod.DishDetailModal,
    ),
  { ssr: false },
);
import { MenuFilters } from "@/components/menu/MenuFilters";
import { MenuGrid } from "@/components/menu/MenuGrid";
import type { MenuItem } from "@/lib/data/menu";

export interface MenuPageClientProps {
  items: MenuItem[];
  totalCount: number;
}

export function MenuPageClient({ items, totalCount }: MenuPageClientProps) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleDetailsClick(item: MenuItem) {
    setSelectedItem(item);
    setModalOpen(true);
  }

  function handleResetFilters() {
    router.replace("/menu", { scroll: false });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <MenuFilters />

      <MenuGrid
        items={items}
        totalCount={totalCount}
        onDetailsClick={handleDetailsClick}
        onResetFilters={handleResetFilters}
      />

      <DishDetailModal
        item={selectedItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
