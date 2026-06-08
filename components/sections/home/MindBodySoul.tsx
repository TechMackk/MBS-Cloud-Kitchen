"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Brain, Drumstick, Flame } from "lucide-react";

import { cn } from "@/lib/utils";

const PILLARS = [
  {
    id: "mind",
    title: "Mind",
    description:
      "Healthy meals, millet bowls, balanced nutrition and lighter choices.",
    cta: "Explore Healthy Meals",
    href: "/menu?diet=veg",
    icon: Brain,
    accent: "var(--feast-secondary)",
  },
  {
    id: "body",
    title: "Body",
    description:
      "Protein-rich chicken, seafood and performance-focused meals.",
    cta: "Explore High Protein",
    href: "/menu?diet=non-veg",
    icon: Drumstick,
    accent: "var(--feast-primary)",
  },
  {
    id: "soul",
    title: "Soul",
    description:
      "Authentic Telangana biryanis, comfort food and traditional favorites.",
    cta: "Explore Telangana Specials",
    href: "/menu?category=biryani",
    icon: Flame,
    accent: "var(--feast-accent)",
  },
] as const;

function MindBodySoulCard({
  pillar,
  prefersReducedMotion,
}: {
  pillar: (typeof PILLARS)[number];
  prefersReducedMotion: boolean | null;
}) {
  const Icon = pillar.icon;

  return (
    <motion.article
      className={cn(
        "feast-glass-card group flex min-w-0 flex-col rounded-3xl p-6 sm:p-8",
      )}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -6, transition: { duration: 0.25, ease: "easeOut" } }
      }
    >
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: `color-mix(in srgb, ${pillar.accent} 12%, transparent)`,
          color: pillar.accent,
        }}
        aria-hidden="true"
      >
        <Icon className="h-7 w-7" />
      </div>

      <h3
        className="font-heading text-2xl font-bold"
        style={{ color: "var(--feast-secondary)" }}
      >
        {pillar.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--feast-text)]/70 sm:text-base">
        {pillar.description}
      </p>

      <Link
        href={pillar.href}
        className="mt-6 inline-flex items-center text-sm font-semibold transition-colors hover:underline sm:text-base"
        style={{ color: pillar.accent }}
      >
        {pillar.cta}
        <span aria-hidden="true" className="ml-1">
          &rarr;
        </span>
      </Link>
    </motion.article>
  );
}

export function MindBodySoul() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="py-16 sm:py-24"
      aria-labelledby="mind-body-soul-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm"
            style={{ color: "var(--feast-primary)" }}
          >
            Choose Your Intent
          </p>
          <h2
            id="mind-body-soul-heading"
            className="mt-3 font-heading text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--feast-secondary)" }}
          >
            Mind &bull; Body &bull; Soul
          </h2>
          <p className="mt-4 text-base text-[var(--feast-text)]/70 sm:text-lg">
            Tell us what you&apos;re craving — we&apos;ll guide you to the right
            menu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {PILLARS.map((pillar) => (
            <MindBodySoulCard
              key={pillar.id}
              pillar={pillar}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
