"use client";

import { cn } from "@/lib/utils";

export interface HeroSteamProps {
  className?: string;
}

/**
 * Premium CSS-only steam overlay. No canvas, video, or Lottie.
 */
export function HeroSteam({ className }: HeroSteamProps) {
  return (
    <div
      className={cn("hero-steam pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
    >
      <span className="hero-steam-wisp hero-steam-wisp-1" />
      <span className="hero-steam-wisp hero-steam-wisp-2" />
      <span className="hero-steam-wisp hero-steam-wisp-3" />
    </div>
  );
}
