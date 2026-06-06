"use client";

import Link from "next/link";

import { CartItemRow } from "@/components/cart/CartItemRow";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart/store";

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const subtotal = getSubtotal();

  return (
    <Sheet open={isOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review items before checkout via WhatsApp.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="font-heading text-lg font-semibold text-green-deep">
              Your cart is empty
            </p>
            <p className="mt-2 text-sm text-text/60">
              Browse our menu and add your favourites.
            </p>
            <Button asChild className="mt-6" onClick={() => setDrawerOpen(false)}>
              <Link href="/menu">View Menu</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <CartItemRow
                  key={item.menuItemId}
                  item={item}
                  onQuantityChange={(qty) =>
                    updateQuantity(item.menuItemId, qty)
                  }
                  onRemove={() => removeItem(item.menuItemId)}
                />
              ))}
            </ul>

            <div className="border-t border-green-soft/20 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-text/70">Subtotal</span>
                <span className="font-heading text-lg font-bold text-orange">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <Button asChild className="w-full" onClick={() => setDrawerOpen(false)}>
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
