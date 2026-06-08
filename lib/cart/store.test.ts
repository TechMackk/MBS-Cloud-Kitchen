// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import { useCartStore } from "@/lib/cart/store";

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isDrawerOpen: false });
  });

  it("adds a new item with quantity 1", () => {
    useCartStore.getState().addItem({
      menuItemId: "item-1",
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      price: 249,
      imageUrl: "https://example.com/biryani.jpg",
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.quantity).toBe(1);
  });

  it("increments quantity when adding an existing item", () => {
    const addItem = useCartStore.getState().addItem;
    const item = {
      menuItemId: "item-1",
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      price: 249,
      imageUrl: "https://example.com/biryani.jpg",
    };

    addItem(item);
    addItem(item);

    expect(useCartStore.getState().items[0]?.quantity).toBe(2);
  });

  it("removes item when quantity is set to 0", () => {
    useCartStore.getState().addItem({
      menuItemId: "item-1",
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      price: 249,
      imageUrl: "https://example.com/biryani.jpg",
    });

    useCartStore.getState().updateQuantity("item-1", 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates subtotal correctly", () => {
    useCartStore.getState().addItem({
      menuItemId: "item-1",
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      price: 249,
      imageUrl: "https://example.com/biryani.jpg",
    });
    useCartStore.getState().updateQuantity("item-1", 2);

    expect(useCartStore.getState().getSubtotal()).toBe(498);
  });

  it("clears all cart items", () => {
    useCartStore.getState().addItem({
      menuItemId: "item-1",
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      price: 249,
      imageUrl: "https://example.com/biryani.jpg",
    });

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("returns quantity for a cart item", () => {
    useCartStore.getState().addItem({
      menuItemId: "item-1",
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      price: 249,
      imageUrl: "https://example.com/biryani.jpg",
    });
    useCartStore.getState().updateQuantity("item-1", 3);

    expect(useCartStore.getState().getQuantity("item-1")).toBe(3);
    expect(useCartStore.getState().getQuantity("missing")).toBe(0);
  });

  it("increments and decrements quantity", () => {
    useCartStore.getState().addItem({
      menuItemId: "item-1",
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      price: 249,
      imageUrl: "https://example.com/biryani.jpg",
    });

    useCartStore.getState().incrementQuantity("item-1");
    expect(useCartStore.getState().getQuantity("item-1")).toBe(2);

    useCartStore.getState().decrementQuantity("item-1");
    expect(useCartStore.getState().getQuantity("item-1")).toBe(1);

    useCartStore.getState().decrementQuantity("item-1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
