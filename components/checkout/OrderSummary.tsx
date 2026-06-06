"use client";

import type { CartItem } from "@/lib/cart/types";

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee?: number;
}

export function OrderSummary({
  items,
  subtotal,
  deliveryFee = 0,
}: OrderSummaryProps) {
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-2xl border border-green-soft/20 bg-bg p-6">
      <h2 className="mb-4 font-heading text-lg font-semibold text-green-deep">
        Order Summary
      </h2>
      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item.menuItemId} className="flex justify-between gap-4">
            <span className="text-text/80">
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium text-green-deep">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-2 border-t border-green-soft/20 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-text/70">Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text/70">Delivery fee</span>
          <span>₹{deliveryFee.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between font-heading text-base font-bold text-orange">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
