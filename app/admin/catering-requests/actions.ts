"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin/auth";
import { captureHandledError, withAdminAction } from "@/lib/sentry/admin";
import type { ActionResult } from "@/lib/admin/types";
import type {
  CateringRequestRecord,
  CateringRequestStatus,
} from "@/lib/data/catering-requests";
import {
  getCateringRequestByNumber,
  updateCateringInternalNotes,
  updateCateringRequestStatus,
} from "@/lib/db/catering-requests";
import { sendCateringStatusUpdate } from "@/lib/whatsapp/index";

function revalidateCateringPaths(requestNumber: string) {
  revalidatePath("/admin/catering-requests");
  revalidatePath(`/admin/catering-requests/${requestNumber}`);
  revalidatePath(`/catering/request/${requestNumber}`);
}

export async function updateCateringStatusAction(
  requestNumber: string,
  status: CateringRequestStatus,
): Promise<ActionResult<CateringRequestRecord>> {
  return withAdminAction("updateCateringStatus", async () => {
  try {
    await requireAdminSession();

    const existing = await getCateringRequestByNumber(requestNumber);
    if (!existing) {
      return { success: false, error: "Request not found" };
    }

    const messageId = await sendCateringStatusUpdate(existing, status);

    const updated = await updateCateringRequestStatus(requestNumber, status, {
      whatsappMessageId: messageId ?? undefined,
    });

    if (!updated) {
      return { success: false, error: "Failed to update request" };
    }

    revalidateCateringPaths(requestNumber);
    return { success: true, data: updated };
  } catch (error) {
    captureHandledError(error, { action: "updateCateringStatus" });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }
  });
}

export async function addCateringInternalNoteAction(
  requestNumber: string,
  note: string,
): Promise<ActionResult<CateringRequestRecord>> {
  return withAdminAction("addCateringInternalNote", async () => {
  try {
    await requireAdminSession();

    const updated = await updateCateringInternalNotes(requestNumber, note);
    if (!updated) {
      return { success: false, error: "Failed to save note" };
    }

    revalidateCateringPaths(requestNumber);
    return { success: true, data: updated };
  } catch (error) {
    captureHandledError(error, { action: "addCateringInternalNote" });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }
  });
}
