"use server";

import { track } from "@vercel/analytics/server";
import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin/auth";
import { captureHandledError, withAdminAction } from "@/lib/sentry/admin";
import { parseMenuFormData } from "@/lib/admin/schemas";
import type { ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/client";
import {
  categoryToDb,
  dietToDb,
} from "@/lib/db/mappers";
import { resolveUniqueMenuSlug } from "@/lib/db/menu";
import { deleteImageByUrl } from "@/lib/storage/delete";
import { MENU_BUCKET } from "@/lib/storage/constants";
import { uploadImage } from "@/lib/storage/upload";
import {
  safeIndexMenuItem,
  safeRemoveMenuItem,
} from "@/lib/knowledge/indexer";
import { slugify } from "@/lib/utils/slugify";

const MENU_PATHS = ["/menu", "/", "/admin/menu"] as const;

function revalidateMenuPaths() {
  for (const path of MENU_PATHS) {
    revalidatePath(path);
  }
}

function isFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

export async function createMenuItem(
  formData: FormData,
): Promise<ActionResult<{ slug: string }>> {
  return withAdminAction("createMenuItem", async () => {
  try {
    await requireAdminSession();

    const parsed = parseMenuFormData(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid form data" };
    }

    const data = parsed.data;
    const normalizedSlug = slugify(data.slug || data.name);
    const slug = await resolveUniqueMenuSlug(normalizedSlug);

    const imageFile = formData.get("image");
    if (!isFile(imageFile)) {
      return { success: false, error: "Image is required" };
    }

    let uploadedPath: string | null = null;
    let imageUrl: string;

    try {
      const upload = await uploadImage(imageFile, MENU_BUCKET, slug);
      uploadedPath = upload.path;
      imageUrl = upload.url;

      await prisma.menuItem.create({
        data: {
          slug,
          name: data.name,
          description: data.description,
          longDescription: data.longDescription,
          prepNotes: data.prepNotes,
          category: categoryToDb(data.category),
          diet: dietToDb(data.diet),
          price: data.price,
          imageUrl,
          isAvailable: data.isAvailable,
          isFeatured: data.isFeatured,
          spiceLevel:
            data.spiceLevel && data.spiceLevel !== "none"
              ? data.spiceLevel
              : null,
          servingSize: data.servingSize ?? null,
        },
      });
    } catch (error) {
      if (uploadedPath) {
        const { deleteImage } = await import("@/lib/storage/delete");
        await deleteImage(uploadedPath, MENU_BUCKET);
      }
      throw error;
    }

    revalidateMenuPaths();
    await safeIndexMenuItem(slug);
    track("menu_item_created");
    return { success: true, data: { slug } };
  } catch (error) {
    captureHandledError(error, { action: "createMenuItem" });
    const message =
      error instanceof Error ? error.message : "Failed to create menu item";
    return { success: false, error: message };
  }
  });
}

export async function updateMenuItem(
  slug: string,
  formData: FormData,
): Promise<ActionResult> {
  return withAdminAction("updateMenuItem", async () => {
  try {
    await requireAdminSession();

    const existing = await prisma.menuItem.findUnique({ where: { slug } });
    if (!existing) {
      return { success: false, error: "Menu item not found" };
    }

    const parsed = parseMenuFormData(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid form data" };
    }

    const data = parsed.data;
    const imageFile = formData.get("image");
    let imageUrl = existing.imageUrl;
    let newUploadedPath: string | null = null;

    if (isFile(imageFile)) {
      const upload = await uploadImage(imageFile, MENU_BUCKET, slug);
      newUploadedPath = upload.path;
      imageUrl = upload.url;
    }

    try {
      await prisma.menuItem.update({
        where: { slug },
        data: {
          name: data.name,
          description: data.description,
          longDescription: data.longDescription,
          prepNotes: data.prepNotes,
          category: categoryToDb(data.category),
          diet: dietToDb(data.diet),
          price: data.price,
          imageUrl,
          isAvailable: data.isAvailable,
          isFeatured: data.isFeatured,
          spiceLevel:
            data.spiceLevel && data.spiceLevel !== "none"
              ? data.spiceLevel
              : null,
          servingSize: data.servingSize ?? null,
        },
      });

      if (newUploadedPath && existing.imageUrl !== imageUrl) {
        await deleteImageByUrl(existing.imageUrl, MENU_BUCKET);
      }
    } catch (error) {
      if (newUploadedPath) {
        const { deleteImage } = await import("@/lib/storage/delete");
        await deleteImage(newUploadedPath, MENU_BUCKET);
      }
      throw error;
    }

    revalidateMenuPaths();
    await safeIndexMenuItem(slug);
    return { success: true };
  } catch (error) {
    captureHandledError(error, { action: "updateMenuItem" });
    const message =
      error instanceof Error ? error.message : "Failed to update menu item";
    return { success: false, error: message };
  }
  });
}

export async function deleteMenuItem(slug: string): Promise<ActionResult> {
  return withAdminAction("deleteMenuItem", async () => {
  try {
    await requireAdminSession();

    const existing = await prisma.menuItem.findUnique({ where: { slug } });
    if (!existing) {
      return { success: false, error: "Menu item not found" };
    }

    await prisma.menuItem.delete({ where: { slug } });
    await deleteImageByUrl(existing.imageUrl, MENU_BUCKET);

    revalidateMenuPaths();
    await safeRemoveMenuItem(slug);
    track("menu_item_deleted");
    return { success: true };
  } catch (error) {
    captureHandledError(error, { action: "deleteMenuItem" });
    const message =
      error instanceof Error ? error.message : "Failed to delete menu item";
    return { success: false, error: message };
  }
  });
}

export async function toggleAvailability(slug: string): Promise<ActionResult<boolean>> {
  return withAdminAction("toggleAvailability", async () => {
  try {
    await requireAdminSession();

    const item = await prisma.menuItem.findUnique({ where: { slug } });
    if (!item) {
      return { success: false, error: "Menu item not found" };
    }

    const updated = await prisma.menuItem.update({
      where: { slug },
      data: { isAvailable: !item.isAvailable },
    });

    revalidateMenuPaths();
    await safeIndexMenuItem(slug);
    return { success: true, data: updated.isAvailable };
  } catch (error) {
    captureHandledError(error, { action: "toggleAvailability" });
    const message =
      error instanceof Error ? error.message : "Failed to toggle availability";
    return { success: false, error: message };
  }
  });
}

export async function toggleFeatured(slug: string): Promise<ActionResult<boolean>> {
  return withAdminAction("toggleFeatured", async () => {
  try {
    await requireAdminSession();

    const item = await prisma.menuItem.findUnique({ where: { slug } });
    if (!item) {
      return { success: false, error: "Menu item not found" };
    }

    if (!item.isFeatured) {
      const featuredCount = await prisma.menuItem.count({
        where: { isFeatured: true },
      });
      if (featuredCount >= 10) {
        return {
          success: false,
          error: "Maximum 10 featured items allowed. Unfeature another item first.",
        };
      }
    }

    const updated = await prisma.menuItem.update({
      where: { slug },
      data: { isFeatured: !item.isFeatured },
    });

    revalidateMenuPaths();
    return { success: true, data: updated.isFeatured };
  } catch (error) {
    captureHandledError(error, { action: "toggleFeatured" });
    const message =
      error instanceof Error ? error.message : "Failed to toggle featured";
    return { success: false, error: message };
  }
  });
}
