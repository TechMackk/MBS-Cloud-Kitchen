import { getActiveFestival } from "@/lib/home/festivals";

/**
 * Phase A skeleton — config-driven festival banner (Phase D).
 * Renders nothing when no festival is active.
 */

export function FestivalBanner() {
  const active = getActiveFestival();

  if (!active) {
    return null;
  }

  return (
    <section
      aria-label={`${active.name} festival banner`}
      data-phase="feast-festival-banner-skeleton"
      className="hidden"
    />
  );
}
