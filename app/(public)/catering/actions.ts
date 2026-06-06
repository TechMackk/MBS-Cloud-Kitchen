"use server";

import { track } from "@vercel/analytics/server";
import { headers } from "next/headers";

import type { ActionResult } from "@/lib/admin/types";
import { cateringLimiter } from "@/lib/rate-limit";
import { captureHandledError } from "@/lib/sentry/admin";
import { getClientIp } from "@/lib/utils/request-ip";
import { createCateringRequest } from "@/lib/db/catering-requests";
import { isValidIndianPhone, normalizePhone } from "@/lib/utils/phone";
import { buildCateringLink } from "@/lib/whatsapp/deeplink";
import { isWhatsAppApiEnabled } from "@/lib/whatsapp/config";
import { notifyCateringReceived } from "@/lib/whatsapp/index";
import { z } from "zod";

const cateringRequestSchema = z.object({
  occasion: z.string().min(1),
  session: z.string().min(1),
  eventDate: z.string().min(1),
  guestCount: z.coerce.number().int().min(10),
  dietPreference: z.string().min(1),
  selectedMenuItems: z.array(z.string()).min(1),
  name: z.string().min(2),
  phone: z
    .string()
    .min(10)
    .refine(isValidIndianPhone, "Enter a valid Indian phone number"),
  email: z.string().optional(),
  eventLocation: z.string().min(5),
  specialInstructions: z.string().optional(),
  items: z.array(
    z.object({
      cateringItemId: z.string().optional(),
      name: z.string(),
      pricePerPlate: z.number().positive(),
    }),
  ),
  estimatedTotal: z.number().positive(),
});

/** Submits a catering enquiry from the multi-step public form. */
export async function createCateringRequestAction(
  formData: FormData,
): Promise<
  ActionResult<{
    requestNumber: string;
    whatsappUrl?: string;
    usedCloudApi: boolean;
  }>
> {
  try {
    const headersList = await headers();
    const ip = getClientIp(headersList);
    const rateLimit = await cateringLimiter.limit(ip);

    if (!rateLimit.success) {
      return {
        success: false,
        error:
          "Too many recent catering requests. Please WhatsApp us directly.",
      };
    }

    const itemsRaw = formData.get("items");
    const selectedRaw = formData.get("selectedMenuItems");

    let items: Array<{
      cateringItemId?: string;
      name: string;
      pricePerPlate: number;
    }> = [];
    let selectedMenuItems: string[] = [];

    if (typeof itemsRaw === "string") {
      items = JSON.parse(itemsRaw) as typeof items;
    }
    if (typeof selectedRaw === "string") {
      selectedMenuItems = JSON.parse(selectedRaw) as string[];
    }

    const parsed = cateringRequestSchema.safeParse({
      occasion: formData.get("occasion"),
      session: formData.get("session"),
      eventDate: formData.get("eventDate"),
      guestCount: formData.get("guestCount"),
      dietPreference: formData.get("dietPreference"),
      selectedMenuItems,
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email") || undefined,
      eventLocation: formData.get("eventLocation"),
      specialInstructions: formData.get("specialInstructions") || undefined,
      items,
      estimatedTotal: Number(formData.get("estimatedTotal")),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "Invalid form data",
      };
    }

    const data = parsed.data;
    const apiEnabled = isWhatsAppApiEnabled();

    const request = await createCateringRequest({
      customerName: data.name,
      customerPhone: normalizePhone(data.phone),
      customerEmail: data.email,
      eventDate: new Date(data.eventDate),
      occasion: data.occasion,
      session: data.session,
      guestCount: data.guestCount,
      dietPreference: data.dietPreference,
      eventLocation: data.eventLocation,
      instructions: data.specialInstructions,
      estimatedTotal: data.estimatedTotal,
      channel: apiEnabled ? "WA_CLOUD_API" : "WA_DEEPLINK",
      items: data.items,
    });

    if (apiEnabled) {
      const messageId = await notifyCateringReceived(request);
      if (messageId) {
        const { updateCateringWhatsappMessageId } = await import(
          "@/lib/db/catering-requests"
        );
        await updateCateringWhatsappMessageId(
          request.requestNumber,
          messageId,
        );
      }

      track("catering_request_submitted");

      return {
        success: true,
        data: {
          requestNumber: request.requestNumber,
          usedCloudApi: true,
        },
      };
    }

    const whatsappUrl = buildCateringLink(request);

    track("catering_request_submitted");

    return {
      success: true,
      data: {
        requestNumber: request.requestNumber,
        whatsappUrl,
        usedCloudApi: false,
      },
    };
  } catch (error) {
    captureHandledError(error, { action: "createCateringRequest" });
    console.error("[createCateringRequest]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit catering request",
    };
  }
}
