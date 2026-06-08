"use client";

import Image from "next/image";
import { Flame, Minus, Plus } from "lucide-react";

import { VegBadge } from "@/components/menu/VegBadge";
import { showAddedToCartToast } from "@/lib/cart/toast";
import { useCartStore } from "@/lib/cart/store";
import type { MenuItem } from "@/lib/data/menu";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";
import { cn } from "@/lib/utils";

export interface DarkDishCardProps {
  item: MenuItem;
  priority?: boolean;
}

function SpiceIndicator({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`Spice level ${level} of 3`}
    >
      {Array.from({ length: level }).map((_, index) => (
        <Flame
          key={index}
          className="h-3.5 w-3.5 text-red-royal"
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function DarkNutritionStrip({
  calories,
  protein,
}: {
  calories: number;
  protein: number;
}) {
  return (
    <div className="mt-3 flex overflow-hidden rounded-lg border border-gold-dark/30">
      <div className="flex-1 px-2 py-1.5 text-center sm:px-3 sm:py-2">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-gold-dark sm:text-[10px]">
          Cal
        </p>
        <p className="font-heading text-xs font-bold text-cream-warm sm:text-sm">
          {calories}
        </p>
      </div>
      <div className="w-px bg-gold-dark/40" aria-hidden="true" />
      <div className="flex-1 px-2 py-1.5 text-center sm:px-3 sm:py-2">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-gold-dark sm:text-[10px]">
          Protein
        </p>
        <p className="font-heading text-xs font-bold text-cream-warm sm:text-sm">
          {protein}g
        </p>
      </div>
    </div>
  );
}

function DarkQuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  disabled,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="flex h-10 w-full items-center justify-between rounded-2xl border border-gold-dark/25 bg-royal-bg-primary/60 px-2"
      role="group"
      aria-label={`Quantity: ${quantity}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        className="flex h-9 min-h-[44px] w-9 min-w-[44px] shrink-0 items-center justify-center rounded-full bg-royal-bg-tertiary text-cream-warm transition-colors hover:bg-royal-bg-tertiary/80 disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span
        className="min-w-[2rem] text-center font-heading text-lg font-bold text-cream-warm"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        className="flex h-9 min-h-[44px] w-9 min-w-[44px] shrink-0 items-center justify-center rounded-full bg-[#2ecc71] text-white transition-colors hover:bg-[#27ae60] disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function DarkDishCard({ item, priority = false }: DarkDishCardProps) {
  const quantity = useCartStore((state) => {
    const cartItem = state.items.find((row) => row.menuItemId === item.id);
    return cartItem?.quantity ?? 0;
  });
  const addItem = useCartStore((state) => state.addItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);

  const primaryTag = item.tags?.[0];
  const showNutrition =
    item.calories !== undefined && item.protein !== undefined;

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
    incrementQuantity(item.id);
  }

  function handleDecrement() {
    decrementQuantity(item.id);
  }

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gold-dark/40 bg-royal-bg-secondary transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)]",
        !item.isAvailable && "opacity-90",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            !item.isAvailable && "grayscale",
          )}
        />

        {primaryTag ? (
          <div className="absolute left-0 top-0 z-10 h-16 w-16 overflow-hidden">
            <span className="absolute left-[-28px] top-[18px] w-[120px] rotate-[-45deg] bg-red-royal py-1 text-center text-[9px] font-bold uppercase tracking-wide text-cream-warm shadow-md sm:text-[10px]">
              {primaryTag}
            </span>
          </div>
        ) : null}

        <div className="absolute right-3 top-3">
          <VegBadge
            diet={item.diet}
            className="border-gold-primary bg-royal-bg-secondary/90 shadow-[0_0_8px_rgba(212,175,55,0.25)]"
          />
        </div>

        {!item.isAvailable ? (
          <div className="absolute inset-0 flex items-center justify-center bg-royal-bg-primary/70">
            <span className="rounded-xl bg-royal-bg-tertiary px-4 py-2 text-sm font-semibold text-cream-warm">
              Currently Unavailable
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-bold leading-snug text-cream-warm">
              {item.name}
            </h3>
            {item.spiceLevel ? (
              <div className="mt-1">
                <SpiceIndicator level={item.spiceLevel} />
              </div>
            ) : null}
            {showNutrition ? (
              <DarkNutritionStrip
                calories={item.calories!}
                protein={item.protein!}
              />
            ) : null}
          </div>
          <p className="shrink-0 font-heading text-xl font-bold text-gold-primary">
            ₹{item.price}
          </p>
        </div>

        <div className="mt-4">
          {item.isAvailable && quantity > 0 ? (
            <DarkQuantityStepper
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          ) : (
            <button
              type="button"
              disabled={!item.isAvailable}
              onClick={handleOrderNow}
              className="flex h-10 w-full items-center justify-center rounded-2xl bg-[#2ecc71] text-sm font-semibold text-white transition-colors hover:bg-[#27ae60] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-royal-bg-secondary"
            >
              {item.isAvailable ? "Order Now" : "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
