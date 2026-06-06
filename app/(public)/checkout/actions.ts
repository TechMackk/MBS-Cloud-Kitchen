"use server";

import { track } from "@vercel/analytics/server";
import { headers } from "next/headers";

import type { ActionResult } from "@/lib/admin/types";
import { orderLimiter } from "@/lib/rate-limit";
import { captureHandledError } from "@/lib/sentry/admin";
import { getClientIp } from "@/lib/utils/request-ip";
import type { CartCheckoutItem } from "@/lib/cart/types";
import {
  createOrder,
  updateOrderWhatsappMessageId,
} from "@/lib/db/orders";
import { isValidIndianPhone, normalizePhone } from "@/lib/utils/phone";
import { buildOrderLink } from "@/lib/whatsapp/deeplink";
import { isWhatsAppApiEnabled } from "@/lib/whatsapp/config";
import { notifyOrderReceived } from "@/lib/whatsapp/index";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z
    .string()
    .min(10, "Valid phone required")
    .refine(isValidIndianPhone, "Enter a valid +91 phone number"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string(),
        name: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Cart is empty"),
});

/** Creates an order from checkout form data with optional WhatsApp deeplink. */
export async function createOrderAction(
  formData: FormData,
): Promise<
  ActionResult<{
    orderNumber: string;
    whatsappUrl?: string;
    usedCloudApi: boolean;
  }>
> {
  try {
    const headersList = await headers();
    const ip = getClientIp(headersList);
    const rateLimit = await orderLimiter.limit(ip);

    if (!rateLimit.success) {
      return {
        success: false,
        error:
          "Too many recent orders. Please WhatsApp us directly to place your order.",
      };
    }

    const itemsRaw = formData.get("items");
    let items: CartCheckoutItem[] = [];

    if (typeof itemsRaw === "string") {
      items = JSON.parse(itemsRaw) as CartCheckoutItem[];
    }

    const parsed = checkoutSchema.safeParse({
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      deliveryAddress: formData.get("deliveryAddress"),
      notes: formData.get("notes") || undefined,
      items,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "Invalid form data",
      };
    }

    const data = parsed.data;
    const apiEnabled = isWhatsAppApiEnabled();

    const order = await createOrder({
      customerName: data.customerName,
      customerPhone: normalizePhone(data.customerPhone),
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      channel: apiEnabled ? "WA_CLOUD_API" : "WA_DEEPLINK",
      items: data.items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    if (apiEnabled) {
      const messageId = await notifyOrderReceived(order);
      if (messageId) {
        await updateOrderWhatsappMessageId(order.orderNumber, messageId);
      }

      track("order_placed");

      return {
        success: true,
        data: {
          orderNumber: order.orderNumber,
          usedCloudApi: true,
        },
      };
    }

    const whatsappUrl = buildOrderLink(order);

    track("order_placed");

    return {
      success: true,
      data: {
        orderNumber: order.orderNumber,
        whatsappUrl,
        usedCloudApi: false,
      },
    };
  } catch (error) {
    captureHandledError(error, { action: "createOrder" });
    console.error("[createOrder]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to place order",
    };
  }
}
