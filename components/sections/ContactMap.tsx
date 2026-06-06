"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  buildDirectionsUrl,
  buildMapsPlaceUrl,
  getMapsEmbedUrl,
  requestUserLocation,
} from "@/lib/geo";

export function ContactMap() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGetDirections() {
    setIsLoading(true);

    try {
      const coords = await requestUserLocation();
      window.open(
        buildDirectionsUrl(coords.lat, coords.lng),
        "_blank",
        "noopener,noreferrer",
      );
    } catch {
      window.open(buildDirectionsUrl(), "_blank", "noopener,noreferrer");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenInMaps() {
    window.open(buildMapsPlaceUrl(), "_blank", "noopener,noreferrer");
  }

  return (
    <section
      className="bg-cream/30 py-16 sm:py-24"
      aria-labelledby="contact-map-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="contact-map-heading"
          className="mb-8 text-center font-heading text-3xl font-bold text-green-deep sm:text-4xl"
        >
          Find Us on the Map
        </h2>

        <div className="overflow-hidden rounded-2xl border border-green-soft/20 shadow-sm">
          <iframe
            title="MBS Cloud Kitchen location on Google Maps"
            src={getMapsEmbedUrl()}
            width="100%"
            height="400"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-[300px] w-full border-0 lg:min-h-[500px]"
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="default"
            size="lg"
            onClick={handleGetDirections}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Getting location…" : "Get Directions"}
          </Button>
          <Button variant="outline" size="lg" onClick={handleOpenInMaps}>
            Open in Google Maps
          </Button>
        </div>
      </div>
    </section>
  );
}
