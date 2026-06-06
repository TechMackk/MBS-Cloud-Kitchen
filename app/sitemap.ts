import type { MetadataRoute } from "next";

import { prisma } from "@/lib/db/client";
import { getSiteUrl } from "@/lib/seo/site-url";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/menu", changeFrequency: "daily", priority: 0.9 },
  { path: "/catering", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  let menuItems: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    menuItems = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      select: { slug: true, updatedAt: true },
      orderBy: { name: "asc" },
    });
  } catch {
    menuItems = [];
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const menuEntries: MetadataRoute.Sitemap = menuItems.map((item) => ({
    url: `${baseUrl}/menu#${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...menuEntries];
}
