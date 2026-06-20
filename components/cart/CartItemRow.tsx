"use client";

import { MenuItemImage } from "@/components/menu/MenuItemImage";
import { QuantityControl } from "@/components/cart/QuantityControl";
import type { CartItem } from "@/lib/cart/types";

export interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  return (
    <li className="flex gap-3 border-b border-green-soft/10 py-4 last:border-0">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <MenuItemImage
          src={item.imageUrl}
          alt={item.name}
          sizes="64px"
          useBlurPlaceholder={false}
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-green-deep">{item.name}</p>
          <p className="shrink-0 text-sm font-semibold text-orange">
            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
          </p>
        </div>
        <p className="mt-0.5 text-xs text-text/50">₹{item.price} each</p>
        <div className="mt-2 flex items-center justify-between">
          <QuantityControl
            quantity={item.quantity}
            onChange={onQuantityChange}
            size="sm"
          />
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-text/50 hover:text-orange"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
