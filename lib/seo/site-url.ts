import { SITE } from "@/lib/constants";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url;
}
