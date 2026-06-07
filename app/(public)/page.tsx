import { JsonLd } from "@/components/seo/JsonLd";
import { CateringCTA } from "@/components/sections/CateringCTA";
import { FeaturedDishes } from "@/components/sections/FeaturedDishes";
import { Hero } from "@/components/sections/Hero";
import { LocationPreview } from "@/components/sections/LocationPreview";
import { QualityPromise } from "@/components/sections/QualityPromise";
import { SmartCategories } from "@/components/sections/SmartCategories";
import { WhyUs } from "@/components/sections/WhyUs";
import { buildMetadata } from "@/lib/seo";
import { getRestaurantSchema } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Authentic Telangana Specials, Delivered Fresh",
  description:
    "MBS Cloud Kitchen — Mind, Body & Soul. Authentic Telangana Specials, delivered fresh to your door in Hyderabad.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={getRestaurantSchema()} />
      <Hero />
      <WhyUs />
      <SmartCategories />
      <FeaturedDishes />
      <CateringCTA />
      <QualityPromise />
      <LocationPreview />
    </>
  );
}
