"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import type { HeroSatelliteDish } from "@/lib/db/menu";

function MbsMonogram() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-royal-bg-tertiary"
      aria-hidden="true"
    >
      <span className="font-heading text-[10px] font-bold tracking-wider text-gold-primary sm:text-xs">
        MBS
      </span>
    </div>
  );
}

function SatelliteImage({ dish }: { dish: HeroSatelliteDish }) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(dish.imageUrl?.trim());

  if (!hasImage || failed) {
    return <MbsMonogram />;
  }

  return (
    <Image
      src={dish.imageUrl}
      alt={dish.name}
      fill
      sizes="(max-width: 1024px) 30vw, 14vw"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export function HeroThaliWheel({
  satellites,
  mode,
}: {
  satellites: HeroSatelliteDish[];
  mode: "mobile" | "desktop";
}) {
  const prefersReducedMotion = useReducedMotion();

  const visibleSatellites =
    mode === "desktop" ? satellites : satellites.slice(0, 4);

  const dims = useMemo(() => {
    if (mode === "desktop") {
      return { outer: 430, central: 232, sat: 58, radius: 158 };
    }
    return { outer: 280, central: 168, sat: 44, radius: 106 };
  }, [mode]);

  const center = dims.outer / 2;

  const angles =
    mode === "desktop"
      ? [0, 60, 120, 180, 240, 300]
      : [45, 135, 225, 315];

  return (
    <div className="relative mx-auto flex w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
      <div
        className="relative"
        style={{ width: dims.outer, height: dims.outer }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.00) 66%)",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-[3px] border-gold-primary bg-royal-bg-secondary/95"
          style={{ width: dims.central, height: dims.central }}
        >
          <div
            className="relative"
            style={{
              width: Math.round(dims.central * 0.9),
              height: Math.round(dims.central * 0.9),
            }}
          >
            <Image
              src="/logo-badge.png"
              alt="MBS Cloud Kitchen"
              fill
              priority
              sizes={
                mode === "desktop"
                  ? "(max-width: 1024px) 40vw, 232px"
                  : "(max-width: 1024px) 40vw, 168px"
              }
              className="object-contain"
            />
          </div>
        </div>

        {visibleSatellites.map((dish, idx) => {
          const angle = angles[idx] ?? 0;
          const radians = (angle * Math.PI) / 180;

          const x = center + dims.radius * Math.cos(radians) - dims.sat / 2;
          const y = center + dims.radius * Math.sin(radians) - dims.sat / 2;
          const direction = idx % 2 === 0 ? -1 : 1;

          return (
            <motion.div
              key={dish.slug}
              className="absolute overflow-hidden rounded-full border border-gold-primary/70 bg-royal-bg-tertiary/80 transition-shadow duration-300 hover:shadow-[0_0_16px_rgba(212,175,55,0.35)]"
              style={{ width: dims.sat, height: dims.sat, left: x, top: y }}
              initial={false}
              animate={
                prefersReducedMotion ? undefined : { y: [0, 7 * direction, 0] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: idx * 0.12,
                    }
              }
            >
              <SatelliteImage dish={dish} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
