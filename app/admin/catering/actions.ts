"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin/auth";
import { captureHandledError, withAdminAction } from "@/lib/sentry/admin";
import { parseCateringFormData } from "@/lib/admin/schemas";
import type { ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/client";
import {
  categoryToDb,
  dietToDb,
} from "@/lib/db/mappers";
import { resolveUniqueCateringSlug } from "@/lib/db/catering";
import { deleteImageByUrl } from "@/lib/storage/delete";
import { CATERING_BUCKET } from "@/lib/storage/constants";
import { uploadImage } from "@/lib/storage/upload";
import { slugify } from "@/lib/utils/slugify";

const CATERING_PATHS = ["/catering", "/admin/catering"] as const;

function revalidateCateringPaths() {
  for (const path of CATERING_PATHS) {
    revalidatePath(path);
  }
}

function isFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

export async function createCateringItem(
  formData: FormData,
): Promise<ActionResult<{ slug: string }>> {
  return withAdminAction("createCateringItem", async () => {
  try {
    await requireAdminSession();

    const parsed = parseCateringFormData(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid form data" };
    }

    const data = parsed.data;
    const normalizedSlug = slugify(data.slug || data.name);
    const slug = await resolveUniqueCateringSlug(normalizedSlug);

    const imageFile = formData.get("image");
    if (!isFile(imageFile)) {
      return { success: false, error: "Image is required" };
    }

    let uploadedPath: string | null = null;
    let imageUrl: string;

    try {
      const upload = await uploadImage(imageFile, CATERING_BUCKET, slug);
      uploadedPath = upload.path;
      imageUrl = upload.url;

      await prisma.cateringItem.create({
        data: {
          slug,
          name: data.name,
          diet: dietToDb(data.diet),
          category: categoryToDb(data.category),
          pricePerPlate: data.pricePerPlate,
          description: data.description,
          imageUrl,
          isAvailable: data.isAvailable,
        },
      });
    } catch (error) {
      if (uploadedPath) {
        const { deleteImage } = await import("@/lib/storage/delete");
        await deleteImage(uploadedPath, CATERING_BUCKET);
      }
      throw error;
    }

    revalidateCateringPaths();
    return { success: true, data: { slug } };
  } catch (error) {
    captureHandledError(error, { action: "createCateringItem" });
    const message =
      error instanceof Error ? error.message : "Failed to create catering item";
    return { success: false, error: message };
  }
  });
}

export async function updateCateringItem(
  slug: string,
  formData: FormData,
): Promise<ActionResult> {
  return withAdminAction("updateCateringItem", async () => {
  try {
    await requireAdminSession();

    const existing = await prisma.cateringItem.findUnique({ where: { slug } });
    if (!existing) {
      return { success: false, error: "Catering item not found" };
    }

    const parsed = parseCateringFormData(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid form data" };
    }

    const data = parsed.data;
    const imageFile = formData.get("image");
    let imageUrl = existing.imageUrl;
    let newUploadedPath: string | null = null;

    if (isFile(imageFile)) {
      const upload = await uploadImage(imageFile, CATERING_BUCKET, slug);
      newUploadedPath = upload.path;
      imageUrl = upload.url;
    }

    try {
      await prisma.cateringItem.update({
        where: { slug },
        data: {
          name: data.name,
          diet: dietToDb(data.diet),
          category: categoryToDb(data.category),
          pricePerPlate: data.pricePerPlate,
          description: data.description,
          imageUrl,
          isAvailable: data.isAvailable,
        },
      });

      if (newUploadedPath && existing.imageUrl !== imageUrl) {
        await deleteImageByUrl(existing.imageUrl, CATERING_BUCKET);
      }
    } catch (error) {
      if (newUploadedPath) {
        const { deleteImage } = await import("@/lib/storage/delete");
        await deleteImage(newUploadedPath, CATERING_BUCKET);
      }
      throw error;
    }

    revalidateCateringPaths();
    return { success: true };
  } catch (error) {
    captureHandledError(error, { action: "updateCateringItem" });
    const message =
      error instanceof Error ? error.message : "Failed to update catering item";
    return { success: false, error: message };
  }
  });
}

export async function deleteCateringItem(slug: string): Promise<ActionResult> {
  return withAdminAction("deleteCateringItem", async () => {
  try {
    await requireAdminSession();

    const existing = await prisma.cateringItem.findUnique({ where: { slug } });
    if (!existing) {
      return { success: false, error: "Catering item not found" };
    }

    await prisma.cateringItem.delete({ where: { slug } });
    await deleteImageByUrl(existing.imageUrl, CATERING_BUCKET);

    revalidateCateringPaths();
    return { success: true };
  } catch (error) {
    captureHandledError(error, { action: "deleteCateringItem" });
    const message =
      error instanceof Error ? error.message : "Failed to delete catering item";
    return { success: false, error: message };
  }
  });
}

export async function toggleCateringAvailability(
  slug: string,
): Promise<ActionResult<boolean>> {
  return withAdminAction("toggleCateringAvailability", async () => {
  try {
    await requireAdminSession();

    const item = await prisma.cateringItem.findUnique({ where: { slug } });
    if (!item) {
      return { success: false, error: "Catering item not found" };
    }

    const updated = await prisma.cateringItem.update({
      where: { slug },
      data: { isAvailable: !item.isAvailable },
    });

    revalidateCateringPaths();
    return { success: true, data: updated.isAvailable };
  } catch (error) {
    captureHandledError(error, { action: "toggleCateringAvailability" });
    const message =
      error instanceof Error ? error.message : "Failed to toggle availability";
    return { success: false, error: message };
  }
  });
}
