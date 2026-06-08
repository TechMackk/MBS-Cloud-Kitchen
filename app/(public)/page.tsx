import { JsonLd } from "@/components/seo/JsonLd";
import { CateringCTA } from "@/components/sections/CateringCTA";
import { Hero } from "@/components/sections/Hero";
import { SignatureSpecials } from "@/components/sections/SignatureSpecials";
import { SmartCategories } from "@/components/sections/SmartCategories";
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
    <div className="home-feast">
      <JsonLd data={getRestaurantSchema()} />

      <Hero />
      <SignatureSpecials />
      <SmartCategories />
      <CateringCTA />
    </div>
  );
}
