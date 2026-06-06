import { createStorageClient } from "@/lib/storage/client";

export function extractStoragePath(
  imageUrl: string,
  bucket: string,
): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = imageUrl.indexOf(marker);
  if (index === -1) {
    return null;
  }
  return imageUrl.slice(index + marker.length);
}

export async function deleteImage(
  path: string,
  bucket: string,
): Promise<void> {
  try {
    const supabase = createStorageClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error(`Failed to delete image ${path}:`, error.message);
    }
  } catch (error) {
    console.error(`Failed to delete image ${path}:`, error);
  }
}

export async function deleteImageByUrl(
  imageUrl: string,
  bucket: string,
): Promise<void> {
  const path = extractStoragePath(imageUrl, bucket);
  if (path) {
    await deleteImage(path, bucket);
  }
}
