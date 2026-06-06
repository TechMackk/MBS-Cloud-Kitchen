/**
 * Converts a display name into a URL-safe slug.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Picks the next available slug when the base slug is already taken.
 * Returns base, then base-2, base-3, etc.
 */
export function resolveSlugCollision(
  baseSlug: string,
  isTaken: (slug: string) => boolean,
): string {
  let candidate = baseSlug;
  let counter = 2;

  while (isTaken(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}

/**
 * Async variant for database-backed slug uniqueness checks.
 */
export async function resolveSlugCollisionAsync(
  baseSlug: string,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  let candidate = baseSlug;
  let counter = 2;

  while (await isTaken(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}
