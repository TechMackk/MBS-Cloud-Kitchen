import { JsonLd } from "@/components/seo/JsonLd";
import { CateringCTA } from "@/components/sections/CateringCTA";
import { FeaturedDishes } from "@/components/sections/FeaturedDishes";
import { Hero } from "@/components/sections/Hero";
import { LocationPreview } from "@/components/sections/LocationPreview";
import {
  CustomerReviews,
  FestivalBanner,
  FinalCTA,
  FoodJourneyTimeline,
  MindBodySoul,
  WhyMBS,
} from "@/components/sections/home";
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
      <MindBodySoul />
      <FeaturedDishes />
      <FoodJourneyTimeline />
      <WhyMBS />
      <CustomerReviews />
      <CateringCTA />
      <FinalCTA />
      <LocationPreview />

      {/* Phase D2 skeleton — not rendered until festival config is active */}
      <FestivalBanner />
    </div>
  );
}
