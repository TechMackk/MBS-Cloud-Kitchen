import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTACT, LOCATION } from "@/lib/constants";

export function LocationPreview() {
  return (
    <section
      className="bg-cream/30 py-16 sm:py-24"
      aria-labelledby="location-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="location-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Find Us
          </h2>
          <p className="mt-4 text-text/70">
            Visit our kitchen or get directions for pickup.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-green-soft/20 shadow-sm">
            <iframe
              title="MBS Cloud Kitchen location on Google Maps"
              src={LOCATION.mapsEmbedUrl}
              width="100%"
              height="400"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full border-0"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-1 h-6 w-6 shrink-0 text-orange"
                aria-hidden="true"
              />
              <address className="not-italic text-text/80 leading-relaxed">
                {CONTACT.address}
              </address>
            </div>

            <Button asChild variant="default" size="lg">
              <a
                href={LOCATION.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
