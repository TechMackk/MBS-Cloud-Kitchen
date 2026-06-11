import type { Metadata } from "next";
import Link from "next/link";

import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/LegalPageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONTACT } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "Terms and conditions for ordering food and catering from MBS Cloud Kitchen in Hyderabad — ordering, delivery, payments, cancellations, and refunds.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms" },
        ])}
      />
      <LegalPageLayout title="Terms & Conditions">
        <LegalSection title="Use of Services">
          <p>
            By using the MBS Cloud Kitchen website and placing orders, you agree
            to these terms. You must be at least 18 years of age, provide
            accurate contact and delivery information, and use our services only
            for lawful purposes.
          </p>
        </LegalSection>

        <LegalSection title="Ordering">
          <p>
            Orders are placed via WhatsApp using the links and checkout flows on
            our website. An order is considered received when you send the
            WhatsApp message; confirmation is provided by our team through
            WhatsApp once we verify availability and delivery details.
          </p>
        </LegalSection>

        <LegalSection title="Pricing & Payment">
          <p>
            All prices are listed in Indian Rupees (INR) and are subject to
            change without prior notice. Payment is typically collected on
            delivery unless otherwise agreed with the restaurant in writing (for
            example, for catering or bulk orders).
          </p>
        </LegalSection>

        <LegalSection title="Delivery">
          <p>
            We aim to deliver orders within an estimated 30–45 minutes,
            depending on your location and kitchen load. Delays may occur due to
            weather, traffic, peak hours, or other circumstances beyond our
            control. We will keep you informed via WhatsApp when possible.
          </p>
        </LegalSection>

        <LegalSection title="Cancellations & Refunds">
          <p>
            Cancellations are accepted only before your order has been prepared.
            Once preparation has started, we may not be able to cancel or refund
            the order. Approved refunds are processed within seven (7) working
            days to the original payment method or as mutually agreed.
          </p>
        </LegalSection>

        <LegalSection title="Catering Orders">
          <p>
            Catering and bulk orders require a minimum of forty-eight (48) hours
            advance notice. Confirmation of catering bookings requires a fifty
            percent (50%) advance payment unless otherwise agreed in writing.
            Final menus, guest counts, and event details must be confirmed
            before the preparation date.
          </p>
        </LegalSection>

        <LegalSection title="Food Safety">
          <p>
            MBS Cloud Kitchen maintains hygiene and food-safety standards in
            line with applicable regulations. Allergen information is available
            on request — please inform us of any allergies or dietary
            restrictions when placing your order.
          </p>
        </LegalSection>

        <LegalSection title="Limitation of Liability">
          <p>
            To the fullest extent permitted by law, MBS Cloud Kitchen is not
            liable for indirect, incidental, or consequential damages arising
            from the use of our services, including delays, third-party delivery
            issues, or events outside our reasonable control.
          </p>
        </LegalSection>

        <LegalSection title="Governing Law">
          <p>
            These terms are governed by the laws of Telangana, India. Any
            disputes shall be subject to the exclusive jurisdiction of the
            courts in Hyderabad, Telangana.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>For questions about these terms, contact us:</p>
          <ul className="list-none space-y-2 pl-0">
            <li>
              Email:{" "}
              <a
                href="mailto:hello@mbscloudkitchen.in"
                className="font-medium text-gold-primary underline-offset-2 hover:underline"
              >
                hello@mbscloudkitchen.in
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href={`tel:${CONTACT.callPrimaryRaw}`}
                className="font-medium text-gold-primary underline-offset-2 hover:underline"
              >
                {CONTACT.callPrimary}
              </a>
            </li>
            <li>WhatsApp orders: {CONTACT.whatsappOrders}</li>
            <li>WhatsApp catering: {CONTACT.whatsappCatering}</li>
          </ul>
          <p>
            Read our{" "}
            <Link
              href="/privacy"
              className="font-medium text-gold-primary underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </LegalSection>
      </LegalPageLayout>
    </>
  );
}
