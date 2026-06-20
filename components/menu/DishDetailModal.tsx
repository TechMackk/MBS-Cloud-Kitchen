"use client";

import { CheckCircle2, Flame } from "lucide-react";

import { DishQuantityStepper } from "@/components/cart/DishQuantityStepper";
import { MenuItemImage } from "@/components/menu/MenuItemImage";
import { VegBadge } from "@/components/menu/VegBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showAddedToCartToast } from "@/lib/cart/toast";
import { useCartStore } from "@/lib/cart/store";
import type { MenuItem } from "@/lib/data/menu";
import { getTagBadgeClasses } from "@/lib/menu/tags";
import { cn } from "@/lib/utils";

export interface DishDetailModalProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DishDetailModal({
  item,
  open,
  onOpenChange,
}: DishDetailModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const quantity = useCartStore((state) => {
    if (!item) return 0;
    const cartItem = state.items.find((row) => row.menuItemId === item.id);
    return cartItem?.quantity ?? 0;
  });

  if (!item) {
    return null;
  }

  const hasNutrition =
    item.calories !== undefined || item.protein !== undefined;

  const cartItemPayload = {
    menuItemId: item.id,
    slug: item.slug,
    name: item.name,
    price: item.price,
    imageUrl: item.imageUrl,
  };

  function handleOrderNow() {
    addItem(cartItemPayload);
    showAddedToCartToast();
  }

  function handleIncrement() {
    incrementQuantity(cartItemPayload.menuItemId);
  }

  function handleDecrement() {
    decrementQuantity(cartItemPayload.menuItemId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <MenuItemImage
            src={item.imageUrl}
            alt={item.name}
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
          />
        </div>

        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-2xl">{item.name}</DialogTitle>
              <VegBadge diet={item.diet} />
            </div>
            {item.spiceLevel && (
              <span
                className="inline-flex items-center gap-1 text-sm text-red-600"
                aria-label={`Spice level ${item.spiceLevel} of 3`}
              >
                {Array.from({ length: item.spiceLevel }).map((_, index) => (
                  <Flame key={index} className="h-4 w-4" aria-hidden="true" />
                ))}
              </span>
            )}
          </div>
          <DialogDescription className="text-base leading-relaxed">
            {item.longDescription}
          </DialogDescription>
        </DialogHeader>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  getTagBadgeClasses(tag),
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {hasNutrition && (
          <div className="rounded-xl border border-green-soft/30 bg-cream/30 p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-green-deep">
              Nutrition Per Serving
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {item.calories !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-text/50">
                    Calories
                  </p>
                  <p className="font-heading text-lg font-bold text-green-deep">
                    {item.calories} kcal
                  </p>
                </div>
              )}
              {item.protein !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-text/50">
                    Protein
                  </p>
                  <p className="font-heading text-lg font-bold text-green-deep">
                    {item.protein}g
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-green-deep">
            Preparation Notes
          </h3>
          <ul className="space-y-2">
            {item.prepNotes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-2 text-sm text-text/80"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-soft"
                  aria-hidden="true"
                />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 border-t border-green-soft/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-2xl font-bold text-orange">
              ₹{item.price}
            </p>
            {item.servingSize && (
              <p className="text-sm text-text/60">{item.servingSize}</p>
            )}
          </div>
          {item.isAvailable && quantity > 0 ? (
            <DishQuantityStepper
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              className="w-full sm:max-w-xs"
            />
          ) : (
            <Button
              type="button"
              variant="default"
              size="lg"
              className="w-full sm:w-auto"
              disabled={!item.isAvailable}
              onClick={handleOrderNow}
            >
              {item.isAvailable ? "Order Now" : "Currently Unavailable"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
