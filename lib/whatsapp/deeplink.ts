import { format } from "date-fns";

import { whatsappUrl } from "@/lib/constants";
import type { CateringRequestRecord } from "@/lib/data/catering-requests";
import type { OrderRecord } from "@/lib/data/orders";
import {
  CATERING_DIET_LABELS,
  OCCASION_LABELS,
  SESSION_LABELS,
  type CateringDietPreference,
  type OccasionType,
  type SessionType,
} from "@/lib/data/catering-menu";
import { toWaMePhone } from "@/lib/utils/phone";
import {
  getCateringWhatsAppNumber,
  getOrdersWhatsAppNumber,
} from "@/lib/whatsapp/config";

export type CateringFormInput = {
  requestNumber?: string;
  occasion: OccasionType | string;
  session: SessionType | string;
  eventDate: Date;
  guestCount: number;
  dietPreference: CateringDietPreference | string;
  selectedItems: Array<{ name: string; pricePerPlate: number }>;
  name: string;
  phone: string;
  email?: string;
  eventLocation: string;
  specialInstructions?: string;
  estimatedTotal: number;
};

export function buildOrderMessage(order: OrderRecord): string {
  const itemLines = order.items
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} — ₹${item.subtotal.toLocaleString("en-IN")}`,
    )
    .join("\n");

  return `Hi MBS Cloud Kitchen! I'd like to place an order.

🧾 *Order #${order.orderNumber}*

📦 *Items*
${itemLines}

💰 *Subtotal:* ₹${order.subtotal.toLocaleString("en-IN")}
💰 *Total:* ₹${order.total.toLocaleString("en-IN")}

👤 *Customer*
Name: ${order.customerName}
Phone: ${order.customerPhone}
Address: ${order.deliveryAddress}${order.notes ? `\n\n📝 *Notes*\n${order.notes}` : ""}

Please confirm availability and delivery time. Thank you!`;
}

function isCateringRequestRecord(
  input: CateringFormInput | CateringRequestRecord,
): input is CateringRequestRecord {
  return "requestNumber" in input && "customerName" in input;
}

export function buildCateringMessage(
  request: CateringFormInput | CateringRequestRecord,
): string {
  const requestNumber = isCateringRequestRecord(request)
    ? request.requestNumber
    : request.requestNumber;

  const menuItems = isCateringRequestRecord(request)
    ? request.items.map((item) => ({
        name: item.name,
        pricePerPlate: item.pricePerPlate,
      }))
    : request.selectedItems;

  const menuLines = menuItems
    .map((item) => `• ${item.name} — ₹${item.pricePerPlate}/plate`)
    .join("\n");

  const occasion = request.occasion as OccasionType;
  const session = request.session as SessionType;
  const dietPreference = request.dietPreference as CateringDietPreference;

  const customerName = isCateringRequestRecord(request)
    ? request.customerName
    : request.name;
  const customerPhone = isCateringRequestRecord(request)
    ? request.customerPhone
    : request.phone;
  const customerEmail = isCateringRequestRecord(request)
    ? request.customerEmail
    : request.email;
  const instructions = isCateringRequestRecord(request)
    ? request.instructions
    : request.specialInstructions;

  const eventDate =
    request.eventDate instanceof Date
      ? request.eventDate
      : new Date(request.eventDate);

  return `Hi MBS Cloud Kitchen! I'd like to enquire about catering.

${requestNumber ? `📋 *Request #${requestNumber}*\n\n` : ""}📅 *Event Details*
Occasion: ${OCCASION_LABELS[occasion] ?? request.occasion}
Session: ${SESSION_LABELS[session] ?? request.session}
Date: ${format(eventDate, "dd MMM yyyy")}
Guests: ${request.guestCount}
Diet: ${CATERING_DIET_LABELS[dietPreference] ?? request.dietPreference}

🍽️ *Selected Menu*
${menuLines || "— To be discussed —"}

Estimated: ₹${request.estimatedTotal.toLocaleString("en-IN")} (${menuItems.length} dishes × ${request.guestCount} guests)

👤 *Contact*
Name: ${customerName}
Phone: ${customerPhone}${customerEmail ? `\nEmail: ${customerEmail}` : ""}
Location: ${request.eventLocation}${instructions ? `\n\n📝 *Special Instructions*\n${instructions}` : ""}

Please confirm availability and share a detailed quote. Thank you!`;
}

export function buildOrderLink(order: OrderRecord): string {
  const message = buildOrderMessage(order);
  return whatsappUrl(getOrdersWhatsAppNumber(), message);
}

export function buildCateringLink(
  input: CateringFormInput | CateringRequestRecord,
): string {
  const message = buildCateringMessage(input);
  return whatsappUrl(getCateringWhatsAppNumber(), message);
}

export function buildAdminLink(customerPhone: string, message?: string): string {
  const phone = toWaMePhone(customerPhone);
  return whatsappUrl(phone, message);
}

/** @deprecated Use cart checkout instead */
export function buildSingleItemOrderLink(item: {
  name: string;
  price: number;
}): string {
  const message = `Hi MBS Cloud Kitchen! I'd like to order:

${item.name} — ₹${item.price}

Please confirm availability and delivery time.`;

  return whatsappUrl(getOrdersWhatsAppNumber(), message);
}
