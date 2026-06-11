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
  title: "Privacy Policy",
  description:
    "Learn how MBS Cloud Kitchen collects, uses, and protects your personal information when you order food or request catering in Hyderabad.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <LegalPageLayout title="Privacy Policy">
        <LegalSection title="Information We Collect">
          <p>
            When you place an order or request catering through MBS Cloud
            Kitchen, we collect information you provide directly, including:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your name</li>
            <li>Phone number</li>
            <li>Delivery or event address</li>
            <li>
              Order or catering details (items, quantities, notes, and
              preferences)
            </li>
          </ul>
          <p>
            We also use essential cookies required for site functionality, and
            analytics cookies through Vercel Analytics to understand how
            visitors use our website.
          </p>
        </LegalSection>

        <LegalSection title="How We Use Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Process and fulfil food orders placed via WhatsApp</li>
            <li>Prepare and send catering quotes and confirmations</li>
            <li>Communicate with you about your order or enquiry</li>
            <li>Improve our menu, service quality, and website experience</li>
          </ul>
        </LegalSection>

        <LegalSection title="Information Sharing">
          <p>
            We do <strong className="text-cream-warm">not</strong> sell your
            personal information to third parties.
          </p>
          <p>
            We share information only when necessary to operate our service —
            for example, with delivery partners to complete your order, or with
            payment processors when a payment is processed on our behalf.
          </p>
        </LegalSection>

        <LegalSection title="Data Retention">
          <p>
            Order and catering records are retained for up to two (2) years to
            meet legal, accounting, and tax compliance requirements. After that
            period, data is securely deleted or anonymised unless a longer
            retention period is required by law.
          </p>
        </LegalSection>

        <LegalSection title="Cookies">
          <p>
            We use essential cookies only for core site functionality (such as
            session and security features). We use Vercel Analytics to collect
            aggregated, anonymised usage data. We do not use advertising or
            third-party tracking cookies.
          </p>
        </LegalSection>

        <LegalSection title="User Rights">
          <p>You have the right to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>
              Request deletion of your personal data, subject to legal
              obligations
            </li>
          </ul>
          <p>To exercise these rights, contact us using the details below.</p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>For privacy-related questions or requests, reach us at:</p>
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
          </ul>
          <p>
            See also our{" "}
            <Link
              href="/terms"
              className="font-medium text-gold-primary underline-offset-2 hover:underline"
            >
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </LegalSection>
      </LegalPageLayout>
    </>
  );
}
