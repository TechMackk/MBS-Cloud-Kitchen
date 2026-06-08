"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, User } from "lucide-react";
import { useMemo, useState } from "react";

import { Logo } from "@/components/layout/Logo";
import { MENU_IMAGES } from "@/lib/data/menu-images";

type ThaliSatellite = {
  id: string;
  label: string;
  imgSrc: string;
};

const PHONE_NUMBER_DISPLAY = "+91 98486 06161";
const PHONE_NUMBER_TEL = "+919848606161";

// Unsplash placeholders (existing dataset). Admin can replace later.
const THALI_SATELLITES: ThaliSatellite[] = [
  { id: "biryani", label: "Biryani", imgSrc: MENU_IMAGES.biryani },
  {
    id: "chicken",
    label: "Chicken curry",
    imgSrc: MENU_IMAGES.chickenStarter,
  },
  { id: "veg-thali", label: "Veg thali", imgSrc: MENU_IMAGES.vegStarter },
  { id: "paneer", label: "Paneer dish (placeholder)", imgSrc: MENU_IMAGES.noodles },
  {
    id: "fried-rice",
    label: "Fried rice",
    imgSrc: MENU_IMAGES.friedRice,
  },
  { id: "dosa", label: "Dosa (placeholder)", imgSrc: MENU_IMAGES.rice },
];

function ThaliWheel({ mode }: { mode: "mobile" | "desktop" }) {
  const prefersReducedMotion = useReducedMotion();
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const satellites =
    mode === "desktop" ? THALI_SATELLITES : THALI_SATELLITES.slice(0, 4);

  const dims = useMemo(() => {
    if (mode === "desktop") {
      return { outer: 430, central: 232, sat: 58, radius: 158 };
    }
    return { outer: 280, central: 168, sat: 44, radius: 106 };
  }, [mode]);

  const center = dims.outer / 2;

  // Fixed angles for predictable composition.
  const angles =
    mode === "desktop"
      ? [0, 60, 120, 180, 240, 300]
      : [45, 135, 225, 315];

  return (
    <div className="relative mx-auto flex w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
      <div
        className="relative"
        style={{ width: dims.outer, height: dims.outer }}
        aria-hidden="true"
      >
        {/* Soft halo behind wheel */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.00) 66%)",
          }}
        />

        {/* Central circle */}
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-royal-bg-secondary/95 border-[3px] border-gold-primary"
          style={{ width: dims.central, height: dims.central }}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Logo
              className="h-12 w-12 !rounded-full !bg-royal-bg-secondary !text-cream-warm"
              imageClassName="rounded-full"
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-light">
              MIND &bull; BODY &bull; SOUL
            </p>
          </div>
        </div>

        {/* Satellites */}
        {satellites.map((sat, idx) => {
          const angle = angles[idx] ?? 0;
          const radians = (angle * Math.PI) / 180;

          const x = center + dims.radius * Math.cos(radians) - dims.sat / 2;
          const y = center + dims.radius * Math.sin(radians) - dims.sat / 2;
          const direction = idx % 2 === 0 ? -1 : 1;

          return (
            <motion.div
              key={sat.id}
              className="absolute overflow-hidden rounded-full border border-gold-primary/70 bg-royal-bg-tertiary/80"
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
              {failed[sat.id] ? (
                <div className="flex h-full w-full items-center justify-center px-2 text-[10px] font-bold text-gold-light/90">
                  {sat.label.split(" ")[0]}
                </div>
              ) : (
                <Image
                  src={sat.imgSrc}
                  alt={sat.label}
                  fill
                  sizes="(max-width: 1024px) 30vw, 14vw"
                  className="object-contain p-2"
                  onError={() =>
                    setFailed((prev) => ({
                      ...prev,
                      [sat.id]: true,
                    }))
                  }
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-royal-bg-primary text-cream-warm"
      aria-labelledby="hero-heading"
    >
      {/* Subtle architectural texture + vignette */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="royal-arch-pattern absolute inset-0" />
        <div className="royal-vignette absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column: copy + CTAs */}
          <div className="order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-primary sm:text-sm">
              MIND &bull; BODY &bull; SOUL CLOUD KITCHEN
            </p>

            <a
              href={`tel:${PHONE_NUMBER_TEL}`}
              className="mt-5 inline-flex items-center gap-2 text-2xl font-heading font-bold text-gold-primary sm:text-3xl lg:text-4xl"
              aria-label={`Call ${PHONE_NUMBER_DISPLAY}`}
            >
              <Phone className="h-6 w-6" aria-hidden="true" />
              {PHONE_NUMBER_DISPLAY}
            </a>

            <h1
              id="hero-heading"
              className="mt-6 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-6xl"
            >
              <span className="text-cream-warm">Telangana </span>
              <span className="bg-gradient-to-r from-gold-light to-gold-primary bg-clip-text text-transparent">
                Specials
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-warm/70 sm:text-lg">
              Authentic flavors, freshly prepared every day
            </p>

            {/* CTA row */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/menu"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gold-dark/35 bg-orange px-7 text-sm font-semibold text-white transition-colors hover:bg-orange-neon hover:shadow-none hover:shadow-[0_0_26px_rgba(212,175,55,0.40)] sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-royal-bg-primary"
              >
                <span>Order Now</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              <Link
                href="/menu"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-gold-dark/55 bg-transparent px-7 text-sm font-semibold text-gold-primary transition-colors hover:bg-royal-bg-secondary/40 hover:text-gold-light sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-royal-bg-primary"
              >
                Explore Menu
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    className="-ml-2 first:ml-0 flex h-9 w-9 items-center justify-center rounded-full border border-gold-dark/30 bg-cream-warm text-royal-bg-primary"
                    aria-hidden="true"
                  >
                    <User className="h-4 w-4" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-cream-warm/90">
                <span className="text-gold-light">4.9&#9733;</span> rated by{" "}
                <span className="text-gold-light">2K+</span> happy customers
              </p>
            </div>
          </div>

          {/* Right column: thali wheel */}
          <div className="order-2 flex items-center justify-center">
            {/* Mobile wheel (4 satellites) */}
            <div className="block lg:hidden">
              <ThaliWheel mode="mobile" />
            </div>
            {/* Desktop wheel (6 satellites) */}
            <div className="hidden lg:block">
              <ThaliWheel mode="desktop" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

