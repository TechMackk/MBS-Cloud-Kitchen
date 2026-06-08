"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ChefHat,
  CookingPot,
  Home,
  Leaf,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

const STEPS = [
  {
    id: "fresh-ingredients",
    title: "Fresh Ingredients",
    text: "Fresh vegetables, premium spices and quality ingredients sourced daily.",
    icon: Leaf,
  },
  {
    id: "kitchen-prep",
    title: "Kitchen Preparation",
    text: "Expert preparation following authentic Telangana recipes.",
    icon: ChefHat,
  },
  {
    id: "dum-cooking",
    title: "Dum Cooking",
    text: "Slow-cooked flavors and traditional techniques for maximum taste.",
    icon: CookingPot,
  },
  {
    id: "quality-check",
    title: "Quality Check",
    text: "Every meal is checked for freshness, quality and presentation.",
    icon: ShieldCheck,
  },
  {
    id: "fast-delivery",
    title: "Fast Delivery",
    text: "Packed securely and delivered quickly.",
    icon: Truck,
  },
  {
    id: "your-home",
    title: "Your Home",
    text: "Enjoy a fresh Telangana dining experience.",
    icon: Home,
  },
] as const;

function StepIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div
      className="feast-timeline-node flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16"
      aria-hidden="true"
    >
      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
    </div>
  );
}

function VerticalTimeline({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean | null;
}) {
  return (
    <ol className="feast-timeline-vertical mx-auto max-w-xl lg:hidden">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === STEPS.length - 1;

        return (
          <motion.li
            key={step.id}
            className="feast-timeline-vertical-step relative flex gap-4 sm:gap-5"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center">
              <StepIcon icon={Icon} />
              {!isLast ? (
                <div
                  className="feast-timeline-connector-vertical mt-2 w-0.5 flex-1 min-h-[2.5rem]"
                  aria-hidden="true"
                />
              ) : null}
            </div>

            <div className="min-w-0 pb-10 pt-1 sm:pb-12">
              <h3
                className="font-heading text-base font-bold sm:text-lg"
                style={{ color: "var(--feast-secondary)" }}
              >
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--feast-text)]/70">
                {step.text}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

function HorizontalTimeline({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean | null;
}) {
  return (
    <ol className="feast-timeline-horizontal relative hidden lg:grid lg:grid-cols-6 lg:gap-4">
      <div
        className="feast-timeline-connector-horizontal pointer-events-none absolute left-[8.333%] right-[8.333%] top-8 h-0.5"
        aria-hidden="true"
      />

      {STEPS.map((step, index) => {
        const Icon = step.icon;

        return (
          <motion.li
            key={step.id}
            className="relative flex min-w-0 flex-col items-center text-center"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
          >
            <StepIcon icon={Icon} />
            <h3
              className="mt-4 font-heading text-sm font-bold xl:text-base"
              style={{ color: "var(--feast-secondary)" }}
            >
              {step.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--feast-text)]/70 xl:text-sm">
              {step.text}
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}

export function FoodJourneyTimeline() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="py-16 sm:py-24"
      aria-labelledby="food-journey-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm"
            style={{ color: "var(--feast-primary)" }}
          >
            Our Process
          </p>
          <h2
            id="food-journey-heading"
            className="mt-3 font-heading text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--feast-secondary)" }}
          >
            From Farm to Feast
          </h2>
          <p className="mt-4 text-base text-[var(--feast-text)]/70 sm:text-lg">
            Every MBS meal follows a carefully crafted journey before it
            reaches your table.
          </p>
        </div>

        <VerticalTimeline prefersReducedMotion={prefersReducedMotion} />
        <HorizontalTimeline prefersReducedMotion={prefersReducedMotion} />
      </div>
    </section>
  );
}
