"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin/auth";
import { captureHandledError, withAdminAction } from "@/lib/sentry/admin";
import type { ActionResult } from "@/lib/admin/types";
import type { OrderRecord, OrderStatus } from "@/lib/data/orders";
import {
  getOrderByNumber,
  updateOrderInternalNotes,
  updateOrderStatus,
} from "@/lib/db/orders";
import { sendOrderStatusUpdate } from "@/lib/whatsapp/index";

const ORDER_PATHS = ["/admin/orders"] as const;

function revalidateOrderPaths(orderNumber: string) {
  for (const path of ORDER_PATHS) {
    revalidatePath(path);
  }
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath(`/order/${orderNumber}`);
}

export async function updateOrderStatusAction(
  orderNumber: string,
  status: OrderStatus,
  options?: { eta?: string; reason?: string },
): Promise<ActionResult<OrderRecord>> {
  return withAdminAction("updateOrderStatus", async () => {
  try {
    await requireAdminSession();

    const existing = await getOrderByNumber(orderNumber);
    if (!existing) {
      return { success: false, error: "Order not found" };
    }

    const messageId = await sendOrderStatusUpdate(existing, status, options);

    const updated = await updateOrderStatus(orderNumber, status, {
      whatsappMessageId: messageId ?? undefined,
    });

    if (!updated) {
      return { success: false, error: "Failed to update order" };
    }

    revalidateOrderPaths(orderNumber);
    return { success: true, data: updated };
  } catch (error) {
    captureHandledError(error, { action: "updateOrderStatus" });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }
  });
}

export async function cancelOrderAction(
  orderNumber: string,
  reason: string,
): Promise<ActionResult<OrderRecord>> {
  return updateOrderStatusAction(orderNumber, "CANCELLED", { reason });
}

export async function addInternalNoteAction(
  orderNumber: string,
  note: string,
): Promise<ActionResult<OrderRecord>> {
  return withAdminAction("addInternalNote", async () => {
  try {
    await requireAdminSession();

    const updated = await updateOrderInternalNotes(orderNumber, note);
    if (!updated) {
      return { success: false, error: "Failed to save note" };
    }

    revalidateOrderPaths(orderNumber);
    return { success: true, data: updated };
  } catch (error) {
    captureHandledError(error, { action: "addInternalNote" });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }
  });
}
