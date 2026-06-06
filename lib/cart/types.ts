export interface CartItem {
  menuItemId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface CartCheckoutItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}
