export type OrderStatus =
  | "NEW"
  | "ACKNOWLEDGED"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type SubmissionChannel = "WA_DEEPLINK" | "WA_CLOUD_API" | "WEB";

export interface OrderItemRecord {
  id: string;
  menuItemId: string | null;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes: string | null;
  internalNotes: string | null;
  status: OrderStatus;
  subtotal: number;
  total: number;
  channel: SubmissionChannel;
  whatsappMessageId: string | null;
  items: OrderItemRecord[];
  createdAt: Date;
  updatedAt: Date;
  acknowledgedAt: Date | null;
  deliveredAt: Date | null;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "New",
  ACKNOWLEDGED: "Acknowledged",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<
  OrderStatus,
  { bg: string; text: string }
> = {
  NEW: { bg: "bg-orange/15", text: "text-orange" },
  ACKNOWLEDGED: { bg: "bg-blue-100", text: "text-blue-700" },
  CONFIRMED: { bg: "bg-green-soft/20", text: "text-green-deep" },
  PREPARING: { bg: "bg-yellow-100", text: "text-yellow-800" },
  OUT_FOR_DELIVERY: { bg: "bg-cyan-100", text: "text-cyan-800" },
  DELIVERED: { bg: "bg-green-deep/15", text: "text-green-deep" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700" },
};
