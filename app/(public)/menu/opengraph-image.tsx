import { countMenuItems } from "@/lib/db/menu";
import { createOgImageResponse } from "@/lib/seo/og-image";

export const dynamic = "force-dynamic";
export const alt = "MBS Cloud Kitchen Menu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let dishCount = 0;

  try {
    dishCount = await countMenuItems();
  } catch {
    dishCount = 0;
  }

  return createOgImageResponse({
    title: "Our Menu",
    subtitle: `${dishCount > 0 ? `${dishCount}+ ` : ""}Authentic Telangana dishes — biryanis, starters, and more`,
    badge: "Menu",
  });
}
