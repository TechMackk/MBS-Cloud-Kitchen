"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChefHat, Clock, Leaf, Sparkles } from "lucide-react";

import { HeroSteam } from "@/components/sections/home/HeroSteam";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

/**
 * Hero imagery — swap `src` to `localPath` when asset is placed in /public.
 * Do not embed remote URLs here; owner replaces via local file only.
 */
export const HERO_BIRYANI_IMAGE = {
  localPath: "/images/hero/hand-biryani.jpg",
  src: "/og-image.png",
  alt: "Premium handi biryani — MBS Cloud Kitchen signature dish",
  width: 1200,
  height: 900,
} as const;

const TRUST_PILLARS = [
  { icon: Leaf, label: "Fresh Ingredients" },
  { icon: ChefHat, label: "Healthy Cooking" },
  { icon: Clock, label: "Fast Delivery" },
  { icon: Sparkles, label: "Authentic Recipes" },
] as const;

const fadeEase = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const textReveal = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0 },
      };

  const imageReveal = prefersReducedMotion
    ? { hidden: { opacity: 1, scale: 1 }, visible: { opacity: 1, scale: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.97 },
        visible: { opacity: 1, scale: 1 },
      };

  return (
    <section
      className="feast-hero relative min-h-[88vh] overflow-hidden sm:min-h-[90vh] lg:min-h-[92vh]"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, var(--feast-bg) 0%, #fff9ee 45%, rgba(20, 83, 45, 0.06) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "var(--feast-primary)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: "var(--feast-secondary)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-14 sm:min-h-[90vh] sm:px-6 sm:py-16 lg:min-h-[92vh] lg:px-8 lg:py-20">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 xl:gap-16">
          <motion.div
            className="order-2 min-w-0 lg:order-1"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
          >
            <motion.p
              variants={textReveal}
              transition={{ duration: 0.6, ease: fadeEase }}
              className="mb-4 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide sm:text-sm"
              style={{
                borderColor: "color-mix(in srgb, var(--feast-primary) 35%, transparent)",
                backgroundColor:
                  "color-mix(in srgb, var(--feast-primary) 8%, var(--feast-bg))",
                color: "var(--feast-secondary)",
              }}
            >
              {SITE.tagline.replace(", ", " • ").replace(" & ", " • ")}
            </motion.p>

            <motion.h1
              id="hero-heading"
              variants={textReveal}
              transition={{ duration: 0.65, ease: fadeEase }}
              className="font-heading text-3xl font-bold leading-[1.12] tracking-tight text-[var(--feast-secondary)] sm:text-4xl lg:text-5xl xl:text-[3.35rem]"
            >
              Authentic Telangana Flavors Delivered Fresh
            </motion.h1>

            <motion.p
              variants={textReveal}
              transition={{ duration: 0.65, ease: fadeEase }}
              className="mt-5 max-w-xl text-base leading-relaxed text-[var(--feast-text)]/75 sm:text-lg"
            >
              Experience handcrafted Telangana meals, signature biryanis, healthy
              bowls and traditional favorites prepared fresh every day.
            </motion.p>

            <motion.ul
              variants={textReveal}
              transition={{ duration: 0.65, ease: fadeEase }}
              className="mt-8 grid grid-cols-2 gap-3 sm:gap-4"
              aria-label="Trust indicators"
            >
              {TRUST_PILLARS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border bg-white/70 px-3 py-2.5 text-sm font-medium shadow-sm backdrop-blur-sm"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--feast-secondary) 15%, transparent)",
                    color: "var(--feast-text)",
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--feast-primary) 12%, transparent)",
                      color: "var(--feast-primary)",
                    }}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 leading-tight">{label}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={textReveal}
              transition={{ duration: 0.65, ease: fadeEase }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                variant="default"
                size="lg"
                className="feast-btn-primary w-full sm:w-auto"
              >
                <Link href="/menu">Order Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="feast-btn-outline w-full sm:w-auto"
              >
                <Link href="/menu">Explore Menu</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="order-1 min-w-0 lg:order-2"
            initial="hidden"
            animate="visible"
            variants={imageReveal}
            transition={{ duration: 0.8, ease: fadeEase, delay: 0.15 }}
          >
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div
                className="relative aspect-[5/6] w-full overflow-hidden rounded-[2rem] shadow-2xl sm:aspect-[4/5] lg:aspect-[5/6]"
                style={{
                  boxShadow:
                    "0 24px 48px rgba(20, 83, 45, 0.18), 0 0 0 1px color-mix(in srgb, var(--feast-primary) 20%, transparent)",
                }}
              >
                <Image
                  src={HERO_BIRYANI_IMAGE.src}
                  alt={HERO_BIRYANI_IMAGE.alt}
                  width={HERO_BIRYANI_IMAGE.width}
                  height={HERO_BIRYANI_IMAGE.height}
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--feast-secondary)]/50 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <HeroSteam />
              </div>
              <div
                className="pointer-events-none absolute -bottom-4 -right-2 hidden h-24 w-24 rounded-full opacity-40 blur-2xl sm:block"
                style={{ backgroundColor: "var(--feast-primary)" }}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
