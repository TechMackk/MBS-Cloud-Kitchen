import type { Metadata } from "next";

import { AboutHero } from "@/components/sections/AboutHero";
import { AboutProcess } from "@/components/sections/AboutProcess";
import { AboutStory } from "@/components/sections/AboutStory";
import { AboutValues } from "@/components/sections/AboutValues";
import AboutContent from "@/content/about.mdx";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Our Story — Mind, Body & Soul",
  description:
    "Discover the story behind MBS Cloud Kitchen — authentic Telangana cuisine, prepared fresh daily in Hyderabad with care and tradition.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <AboutHero />
      <AboutStory>
        <AboutContent />
      </AboutStory>
      <AboutProcess />
      <AboutValues />
    </>
  );
}
