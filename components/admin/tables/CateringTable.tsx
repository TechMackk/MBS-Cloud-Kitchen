"use client";

import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteCateringItem,
  toggleCateringAvailability,
} from "@/app/admin/catering/actions";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TableActions } from "@/components/admin/tables/TableActions";
import { VegBadge } from "@/components/menu/VegBadge";
import { Switch } from "@/components/ui/switch";
import { CATEGORY_LABELS } from "@/lib/data/categories";
import type { CateringItem } from "@/lib/data/catering-menu";

export interface CateringTableProps {
  items: CateringItem[];
  sort?: string;
  order?: string;
}

export function CateringTable({ items, sort, order }: CateringTableProps) {
  const [optimisticItems, setOptimisticItems] = useOptimistic(items);
  const [deleteTarget, setDeleteTarget] = useState<CateringItem | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleSort(field: "name" | "price") {
    const params = new URLSearchParams(window.location.search);
    const currentSort = params.get("sort");
    const currentOrder = params.get("order") ?? "asc";

    if (currentSort === field) {
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", field);
      params.set("order", "asc");
    }

    window.location.search = params.toString();
  }

  function handleToggleAvailability(item: CateringItem) {
    startTransition(async () => {
      setOptimisticItems(
        optimisticItems.map((row) =>
          row.slug === item.slug
            ? { ...row, isAvailable: !row.isAvailable }
            : row,
        ),
      );

      const result = await toggleCateringAvailability(item.slug);
      if (result.success) {
        toast.success("Availability updated");
      } else {
        toast.error(result.error);
        setOptimisticItems(items);
      }
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    const result = await deleteCateringItem(deleteTarget.slug);
    if (result.success) {
      toast.success("Catering item deleted");
      setDeleteTarget(null);
      window.location.reload();
    } else {
      toast.error(result.error);
    }
  }

  if (optimisticItems.length === 0) {
    return (
      <div className="rounded-2xl border border-green-soft/20 bg-bg px-6 py-16 text-center">
        <p className="font-heading text-lg font-semibold text-green-deep">
          No catering items yet.
        </p>
        <Link
          href="/admin/catering/new"
          className="mt-4 inline-block text-sm font-medium text-orange hover:underline"
        >
          Add New Catering Item
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-green-soft/20 bg-bg">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-green-soft/20 bg-cream/30">
            <tr>
              <th className="px-4 py-3 font-medium text-green-deep">Image</th>
              <th className="px-4 py-3 font-medium text-green-deep">
                <button
                  type="button"
                  onClick={() => toggleSort("name")}
                  className="hover:text-orange"
                >
                  Name {sort === "name" ? `(${order})` : ""}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-green-deep">Category</th>
              <th className="px-4 py-3 font-medium text-green-deep">Diet</th>
              <th className="px-4 py-3 font-medium text-green-deep">
                <button
                  type="button"
                  onClick={() => toggleSort("price")}
                  className="hover:text-orange"
                >
                  Price/Plate {sort === "price" ? `(${order})` : ""}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-green-deep">Available</th>
              <th className="px-4 py-3 font-medium text-green-deep">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-soft/10">
            {optimisticItems.map((item) => (
              <tr key={item.id} className={isPending ? "opacity-80" : ""}>
                <td className="px-4 py-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-green-deep">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-text/70">
                  {CATEGORY_LABELS[item.category]}
                </td>
                <td className="px-4 py-3">
                  <VegBadge diet={item.diet} />
                </td>
                <td className="px-4 py-3 font-semibold text-orange">
                  ₹{item.pricePerPlate}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => handleToggleAvailability(item)}
                      aria-label={`Toggle availability for ${item.name}`}
                    />
                    <StatusBadge available={item.isAvailable} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TableActions
                    editHref={`/admin/catering/${item.slug}/edit`}
                    onDelete={() => setDeleteTarget(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete catering item?"
        description={`This will permanently delete "${deleteTarget?.name}" and remove its image.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
