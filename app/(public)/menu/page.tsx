import type { Metadata } from "next";
import { Suspense } from "react";

import { JsonLd } from "@/components/seo/JsonLd";
import { MenuPageClient } from "@/components/menu/MenuPageClient";
import {
  isDietType,
  isMenuCategory,
  type DietType,
  type MenuCategory,
} from "@/lib/data/categories";
import { countMenuItems, getMenuItems } from "@/lib/db/menu";
import { buildMetadata } from "@/lib/seo";
import { getBreadcrumbSchema, getMenuSchema } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Menu — Authentic Telangana Specials",
  description:
    "Explore our full menu of authentic Telangana dishes — biryanis, fried rice, noodles, starters, and more. Veg, non-veg, and egg options, freshly prepared daily in Hyderabad.",
  path: "/menu",
});

type MenuPageProps = {
  searchParams: Promise<{
    category?: string;
    diet?: string;
    q?: string;
  }>;
};

function MenuFiltersFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-40 animate-pulse rounded-2xl bg-cream/50" />
    </div>
  );
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;

  const category =
    params.category && isMenuCategory(params.category)
      ? (params.category as MenuCategory)
      : undefined;

  const diet =
    params.diet && isDietType(params.diet)
      ? (params.diet as DietType)
      : undefined;

  const q = params.q?.trim() || undefined;

  const [items, totalCount] = await Promise.all([
    getMenuItems({ category, diet, q }),
    countMenuItems({ category, diet, q }),
  ]);

  return (
    <>
      <JsonLd
        data={[
          getMenuSchema(items),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Menu", path: "/menu" },
          ]),
        ]}
      />
      <section
        className="hero-pattern bg-hero-gradient py-12 sm:py-16"
        aria-labelledby="menu-hero-heading"
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1
            id="menu-hero-heading"
            className="font-heading text-4xl font-bold text-green-deep sm:text-5xl"
          >
            Our Menu
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text/70">
            Authentic Telangana flavors, freshly prepared
          </p>
        </div>
      </section>

      <Suspense fallback={<MenuFiltersFallback />}>
        <MenuPageClient items={items} totalCount={totalCount} />
      </Suspense>
    </>
  );
}
