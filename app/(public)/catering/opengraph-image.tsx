import { createOgImageResponse } from "@/lib/seo/og-image";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const alt = "MBS Cloud Kitchen Catering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImageResponse({
    title: "Catering Services",
    subtitle: "Weddings, corporate events, and celebrations in Hyderabad",
    badge: "Catering",
  });
}
