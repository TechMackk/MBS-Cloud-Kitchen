import type { CateringRequestRecord } from "@/lib/data/catering-requests";
import type { OrderRecord, OrderStatus } from "@/lib/data/orders";
import { sendTemplateMessage } from "@/lib/whatsapp/cloud-api/client";
import {
  getCateringReceivedParams,
  getCateringStatusParams,
  getOrderReceivedParams,
  getOrderStatusParams,
  TEMPLATES,
} from "@/lib/whatsapp/cloud-api/templates";
import { isWhatsAppApiEnabled } from "@/lib/whatsapp/config";

export async function notifyOrderReceived(
  order: OrderRecord,
): Promise<string | null> {
  if (!isWhatsAppApiEnabled()) {
    return null;
  }

  const result = await sendTemplateMessage(
    order.customerPhone,
    TEMPLATES.ORDER_RECEIVED,
    getOrderReceivedParams(order),
  );

  return result?.messageId ?? null;
}

export async function sendOrderStatusUpdate(
  order: OrderRecord,
  status: OrderStatus,
  options?: { eta?: string; reason?: string },
): Promise<string | null> {
  if (!isWhatsAppApiEnabled()) {
    return null;
  }

  const mapping = getOrderStatusParams(order, status, options);
  if (!mapping) {
    return null;
  }

  const result = await sendTemplateMessage(
    order.customerPhone,
    mapping.template,
    mapping.params,
  );

  return result?.messageId ?? null;
}

export async function notifyCateringReceived(
  request: CateringRequestRecord,
): Promise<string | null> {
  if (!isWhatsAppApiEnabled()) {
    return null;
  }

  const result = await sendTemplateMessage(
    request.customerPhone,
    TEMPLATES.CATERING_RECEIVED,
    getCateringReceivedParams(request),
  );

  return result?.messageId ?? null;
}

export async function sendCateringStatusUpdate(
  request: CateringRequestRecord,
  status: CateringRequestRecord["status"],
): Promise<string | null> {
  if (!isWhatsAppApiEnabled()) {
    return null;
  }

  const mapping = getCateringStatusParams(request, status);
  if (!mapping) {
    return null;
  }

  const result = await sendTemplateMessage(
    request.customerPhone,
    mapping.template,
    mapping.params,
  );

  return result?.messageId ?? null;
}
