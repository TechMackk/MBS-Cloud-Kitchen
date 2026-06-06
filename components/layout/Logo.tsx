"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export function Logo({ className, imageClassName }: LogoProps) {
  const [logoAvailable, setLogoAvailable] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setLogoAvailable(true);
      setChecked(true);
    };
    img.onerror = () => {
      setLogoAvailable(false);
      setChecked(true);
    };
    img.src = "/logo.png";
  }, []);

  if (!checked || !logoAvailable) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-green-deep font-heading font-bold text-cream",
          className,
        )}
        aria-label={`${SITE.name} logo`}
      >
        MBS
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      aria-label={`${SITE.name} logo`}
    >
      <Image
        src="/logo.png"
        alt={`${SITE.name} logo`}
        fill
        className={cn("object-contain", imageClassName)}
        priority
      />
    </div>
  );
}
