import type { Metadata } from "next";

import { CateringFAQ } from "@/components/catering/CateringFAQ";
import { CateringForm } from "@/components/catering/CateringForm";
import { CateringHero } from "@/components/catering/CateringHero";
import { CateringInfo } from "@/components/catering/CateringInfo";
import { CateringMenuPreview } from "@/components/catering/CateringMenuPreview";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCateringItems } from "@/lib/db/catering";
import { buildMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Catering Services — Hyderabad",
  description:
    "MBS Cloud Kitchen catering in Hyderabad — veg and non-veg menus for weddings, birthdays, corporate events, and festivals. Custom menu planning with hygiene-certified kitchen standards.",
  path: "/catering",
});

export default async function CateringPage() {
  const cateringItems = await getCateringItems();

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Catering", path: "/catering" },
        ])}
      />
      <CateringHero />
      <CateringInfo />
      <CateringMenuPreview items={cateringItems} />
      <CateringForm items={cateringItems} />
      <CateringFAQ />
    </>
  );
}
