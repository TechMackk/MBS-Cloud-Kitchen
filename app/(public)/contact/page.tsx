import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { ContactHero } from "@/components/sections/ContactHero";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { ContactMap } from "@/components/sections/ContactMap";
import { InquiryForm } from "@/components/sections/InquiryForm";
import { buildMetadata } from "@/lib/seo";
import {
  getBreadcrumbSchema,
  getRestaurantSchema,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Contact MBS Cloud Kitchen — Hyderabad",
  description:
    "Get in touch with MBS Cloud Kitchen in Hyderabad. Call, WhatsApp, or visit us for orders, catering enquiries, and directions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          getRestaurantSchema(),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <ContactHero />
      <ContactInfo />
      <ContactMap />
      <InquiryForm />
    </>
  );
}
