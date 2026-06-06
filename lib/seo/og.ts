import { SITE } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo/site-url";

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_COLORS = {
  background: "#1F3A3D",
  accent: "#E86F2A",
  text: "#F5F0E8",
  muted: "#8FBF9F",
} as const;

export function getDefaultOgImageUrl(): string {
  return `${getSiteUrl()}/og-image.png`;
}

export function getOgImageAlt(title?: string): string {
  return title ? `${title} — ${SITE.name}` : SITE.name;
}
