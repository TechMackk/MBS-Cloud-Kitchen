import { toast } from "sonner";

import { useCartStore } from "@/lib/cart/store";

export function showAddedToCartToast() {
  toast.success("Added to cart", {
    duration: 1500,
    position: "bottom-center",
    action: {
      label: "View cart",
      onClick: () => useCartStore.getState().openDrawer(),
    },
  });
}
