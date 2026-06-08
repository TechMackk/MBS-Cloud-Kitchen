"use client";

import Image from "next/image";
import { Flame } from "lucide-react";

import { DishQuantityStepper } from "@/components/cart/DishQuantityStepper";
import { VegBadge } from "@/components/menu/VegBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { showAddedToCartToast } from "@/lib/cart/toast";
import { useCartStore } from "@/lib/cart/store";
import type { MenuItem } from "@/lib/data/menu";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";
import { getTagRibbonClasses } from "@/lib/menu/tags";
import { cn } from "@/lib/utils";

export interface DishCardProps {
  item: MenuItem;
  variant?: "featured" | "full";
  onDetailsClick?: (item: MenuItem) => void;
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
          className="h-3.5 w-3.5 text-red-600"
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function NutritionStrip({
  calories,
  protein,
}: {
  calories: number;
  protein: number;
}) {
  return (
    <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-xl border border-green-soft/30 bg-cream/30">
      <div className="border-r border-green-soft/30 px-2 py-1.5 text-center sm:px-3 sm:py-2">
        <p className="text-[9px] uppercase tracking-wide text-text/50 sm:text-[10px]">
          Calories
        </p>
        <p className="font-heading text-xs font-bold text-green-deep sm:text-sm">
          {calories} kcal
        </p>
      </div>
      <div className="px-2 py-1.5 text-center sm:px-3 sm:py-2">
        <p className="text-[9px] uppercase tracking-wide text-text/50 sm:text-[10px]">
          Protein
        </p>
        <p className="font-heading text-xs font-bold text-green-deep sm:text-sm">
          {protein}g
        </p>
      </div>
    </div>
  );
}

export function DishCard({
  item,
  variant = "full",
  onDetailsClick,
  priority = false,
}: DishCardProps) {
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
    <Card
      className={cn(
        "group relative flex h-full w-full min-w-0 flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-card-neon hover:ring-1 hover:ring-green-neon/25",
        !item.isAvailable && "opacity-90",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            !item.isAvailable && "grayscale",
          )}
        />
        {primaryTag && (
          <div className="absolute left-0 top-3 z-10">
            <span
              className={cn(
                "max-w-[85%] truncate rounded-r-lg px-2 py-1 text-[9px] font-bold uppercase tracking-wide shadow-sm sm:max-w-none sm:px-3 sm:text-[10px]",
                getTagRibbonClasses(primaryTag),
              )}
            >
              {primaryTag}
            </span>
          </div>
        )}
        <div className="absolute right-3 top-3">
          <VegBadge diet={item.diet} />
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-deep/60">
            <span className="rounded-xl bg-bg px-4 py-2 text-sm font-semibold text-green-deep">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base leading-snug sm:text-lg">
              {item.name}
            </CardTitle>
            {item.spiceLevel && (
              <div className="mt-1">
                <SpiceIndicator level={item.spiceLevel} />
              </div>
            )}
            {showNutrition && (
              <NutritionStrip
                calories={item.calories!}
                protein={item.protein!}
              />
            )}
          </div>
          <span className="shrink-0 font-heading text-base font-bold text-orange sm:text-lg">
            ₹{item.price}
          </span>
        </div>
      </CardHeader>

      {variant === "full" && (
        <CardContent className="pb-4">
          <CardDescription className="line-clamp-2">
            {item.description}
          </CardDescription>
        </CardContent>
      )}

      <CardFooter className="mt-auto flex-col gap-2">
        {variant === "full" && onDetailsClick && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onDetailsClick(item)}
          >
            Details
          </Button>
        )}
        {item.isAvailable && quantity > 0 ? (
          <DishQuantityStepper
            quantity={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        ) : (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="neon-btn-orange w-full"
            disabled={!item.isAvailable}
            onClick={handleOrderNow}
          >
            {item.isAvailable ? "Order Now" : "Unavailable"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
