import type { CateringRequestRecord } from "@/lib/data/catering-requests";
import type { OrderRecord, OrderStatus } from "@/lib/data/orders";
import { format } from "date-fns";

export const TEMPLATES = {
  ORDER_RECEIVED: "mbs_order_received",
  ORDER_ACKNOWLEDGED: "mbs_order_acknowledged",
  ORDER_CONFIRMED: "mbs_order_confirmed",
  ORDER_OUT_FOR_DELIVERY: "mbs_order_out_for_delivery",
  ORDER_DELIVERED: "mbs_order_delivered",
  ORDER_CANCELLED: "mbs_order_cancelled",
  CATERING_RECEIVED: "mbs_catering_received",
  CATERING_ACKNOWLEDGED: "mbs_catering_acknowledged",
  CATERING_CONFIRMED: "mbs_catering_confirmed",
} as const;

export type TemplateName = (typeof TEMPLATES)[keyof typeof TEMPLATES];

export function getOrderReceivedParams(order: OrderRecord): Record<string, string> {
  return {
    customer_name: order.customerName,
    order_number: order.orderNumber,
    total: order.total.toLocaleString("en-IN"),
  };
}

export function getOrderStatusParams(
  order: OrderRecord,
  status: OrderStatus,
  options?: { eta?: string; reason?: string },
): { template: TemplateName; params: Record<string, string> } | null {
  const base = {
    customer_name: order.customerName,
    order_number: order.orderNumber,
  };

  switch (status) {
    case "ACKNOWLEDGED":
      return { template: TEMPLATES.ORDER_ACKNOWLEDGED, params: base };
    case "CONFIRMED":
      return {
        template: TEMPLATES.ORDER_CONFIRMED,
        params: { ...base, eta: options?.eta ?? "soon" },
      };
    case "OUT_FOR_DELIVERY":
      return { template: TEMPLATES.ORDER_OUT_FOR_DELIVERY, params: base };
    case "DELIVERED":
      return { template: TEMPLATES.ORDER_DELIVERED, params: base };
    case "CANCELLED":
      return {
        template: TEMPLATES.ORDER_CANCELLED,
        params: { ...base, reason: options?.reason ?? "Unavailable" },
      };
    default:
      return null;
  }
}

export function getCateringReceivedParams(
  request: CateringRequestRecord,
): Record<string, string> {
  return {
    customer_name: request.customerName,
    request_number: request.requestNumber,
    event_date: format(request.eventDate, "dd MMM yyyy"),
  };
}

export function getCateringStatusParams(
  request: CateringRequestRecord,
  status: CateringRequestRecord["status"],
): { template: TemplateName; params: Record<string, string> } | null {
  const base = {
    customer_name: request.customerName,
    request_number: request.requestNumber,
  };

  switch (status) {
    case "ACKNOWLEDGED":
      return { template: TEMPLATES.CATERING_ACKNOWLEDGED, params: base };
    case "CONFIRMED":
      return { template: TEMPLATES.CATERING_CONFIRMED, params: base };
    default:
      return null;
  }
}
