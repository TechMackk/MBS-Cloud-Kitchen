import { SITE } from "@/lib/constants";
import { createOgImageResponse } from "@/lib/seo/og-image";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const alt = "About MBS Cloud Kitchen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImageResponse({
    title: "Our Story",
    subtitle: `${SITE.tagline} — recipes passed down through generations`,
    badge: "About",
  });
}
