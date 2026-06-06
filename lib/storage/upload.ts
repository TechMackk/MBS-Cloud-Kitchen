import { nanoid } from "nanoid";

import { createStorageClient } from "@/lib/storage/client";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  type AllowedImageType,
} from "@/lib/storage/constants";

export type UploadResult = {
  url: string;
  path: string;
};

function getExtension(mimeType: AllowedImageType): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function isAllowedImageType(type: string): type is AllowedImageType {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);
}

export function getPublicImageUrl(bucket: string, path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export async function uploadImage(
  file: File,
  bucket: string,
  slug: string,
): Promise<UploadResult> {
  if (!isAllowedImageType(file.type)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`File too large. Maximum size is ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`);
  }

  const ext = getExtension(file.type);
  const path = `${slug}-${nanoid(8)}.${ext}`;
  const supabase = createStorageClient();

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return {
    path,
    url: getPublicImageUrl(bucket, path),
  };
}
