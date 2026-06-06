import { SITE } from "@/lib/constants";
import { createOgImageResponse } from "@/lib/seo/og-image";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImageResponse({
    title: SITE.tagline,
    subtitle: "Authentic Telangana Specials, Delivered Fresh",
    badge: SITE.subTagline,
  });
}
