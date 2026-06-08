"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/lib/cart/types";

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  incrementQuantity: (menuItemId: string) => void;
  decrementQuantity: (menuItemId: string) => void;
  getQuantity: (menuItemId: string) => number;
  clearCart: () => void;
  getSubtotal: () => number;
  getCount: () => number;
  openDrawer: () => void;
  closeDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (row) => row.menuItemId === item.menuItemId,
          );

          if (existing) {
            return {
              items: state.items.map((row) =>
                row.menuItemId === item.menuItemId
                  ? { ...row, quantity: row.quantity + 1 }
                  : row,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((row) => row.menuItemId !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(menuItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((row) =>
            row.menuItemId === menuItemId ? { ...row, quantity } : row,
          ),
        }));
      },

      incrementQuantity: (menuItemId) => {
        const existing = get().items.find(
          (row) => row.menuItemId === menuItemId,
        );
        if (!existing) {
          return;
        }
        get().updateQuantity(menuItemId, existing.quantity + 1);
      },

      decrementQuantity: (menuItemId) => {
        const existing = get().items.find(
          (row) => row.menuItemId === menuItemId,
        );
        if (!existing) {
          return;
        }
        get().updateQuantity(menuItemId, existing.quantity - 1);
      },

      getQuantity: (menuItemId) => {
        const existing = get().items.find(
          (row) => row.menuItemId === menuItemId,
        );
        return existing?.quantity ?? 0;
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),

      getCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
    }),
    {
      name: "mbs-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
