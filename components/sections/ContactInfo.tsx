import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTACT, whatsappUrl } from "@/lib/constants";
import { buildMapsPlaceUrl } from "@/lib/geo";

const CONTACT_HOURS = "Mon – Sun: 11:00 AM – 11:00 PM";

export function ContactInfo() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="contact-info-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="contact-info-heading" className="sr-only">
          Contact Information
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div
                className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-orange"
                aria-hidden="true"
              >
                <Phone className="h-6 w-6" />
              </div>
              <CardTitle>Call Us</CardTitle>
              <CardDescription>Speak directly with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={`tel:${CONTACT.callPrimaryRaw}`}
                className="block text-sm font-medium text-green-deep transition-colors hover:text-orange"
                aria-label={`Call ${CONTACT.callPrimary}`}
              >
                {CONTACT.callPrimary}
              </a>
              <a
                href={`tel:${CONTACT.callSecondaryRaw}`}
                className="block text-sm font-medium text-green-deep transition-colors hover:text-orange"
                aria-label={`Call ${CONTACT.callSecondary}`}
              >
                {CONTACT.callSecondary}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div
                className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-green-soft"
                aria-hidden="true"
              >
                <MessageCircle className="h-6 w-6" />
              </div>
              <CardTitle>WhatsApp Us</CardTitle>
              <CardDescription>
                Quick orders and catering enquiries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={whatsappUrl(
                  CONTACT.whatsappOrdersRaw,
                  "Hi, I'd like to place an order!",
                )}
                className="block text-sm font-medium text-green-deep transition-colors hover:text-orange"
                aria-label={`WhatsApp orders: ${CONTACT.whatsappOrders}`}
              >
                Orders: {CONTACT.whatsappOrders}
              </a>
              <a
                href={whatsappUrl(
                  CONTACT.whatsappCateringRaw,
                  "Hi, I'd like to enquire about catering!",
                )}
                className="block text-sm font-medium text-green-deep transition-colors hover:text-orange"
                aria-label={`WhatsApp catering: ${CONTACT.whatsappCatering}`}
              >
                Catering: {CONTACT.whatsappCatering}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div
                className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-orange"
                aria-hidden="true"
              >
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle>Visit Us</CardTitle>
              <CardDescription>Find us in Hyderabad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <address className="text-sm not-italic leading-relaxed text-text/70">
                {CONTACT.address}
              </address>
              <Button asChild variant="outline" size="sm">
                <a
                  href={buildMapsPlaceUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Maps
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-green-soft/20 bg-cream/30 px-6 py-4">
          <Clock className="h-5 w-5 text-orange" aria-hidden="true" />
          <p className="text-sm font-medium text-green-deep">{CONTACT_HOURS}</p>
        </div>
      </div>
    </section>
  );
}
