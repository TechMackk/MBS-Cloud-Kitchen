"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useCartStore } from "@/lib/cart/store";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false },
);
import { cn } from "@/lib/utils";

export function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const count = useCartStore((state) => state.getCount());
  const openDrawer = useCartStore((state) => state.openDrawer);
  const [pulse, setPulse] = useState(false);
  const prevCount = useCartStore((state) => state.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && count > 0) {
      setPulse(true);
      const timeout = window.setTimeout(() => setPulse(false), 400);
      return () => window.clearTimeout(timeout);
    }
  }, [count, mounted, prevCount]);

  if (!mounted) {
    return (
      <button
        type="button"
        className="relative rounded-xl p-2 text-green-deep"
        aria-label="Shopping cart"
        disabled
      >
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        className={cn(
          "relative rounded-xl p-2 text-green-deep transition-colors hover:bg-cream",
          pulse && "scale-110",
        )}
        aria-label={`Shopping cart, ${count} items`}
      >
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      <CartDrawer />
    </>
  );
}
