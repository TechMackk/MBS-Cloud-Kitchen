"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function FinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 24 };

  const animateTo = { opacity: 1, y: 0 };

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      aria-labelledby="final-cta-heading"
      style={{
        background:
          "linear-gradient(135deg, var(--feast-secondary) 0%, #0f3d22 55%, var(--feast-secondary) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(168, 224, 99, 0.12) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "var(--feast-primary)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: "var(--feast-accent)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h2
          id="final-cta-heading"
          className="font-heading text-3xl font-bold leading-tight text-[var(--feast-bg)] sm:text-4xl lg:text-5xl"
          initial={fadeUp}
          whileInView={animateTo}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          Not Just Food.
          <span className="mt-2 block text-[var(--feast-primary)]">
            A Telangana Experience.
          </span>
        </motion.h2>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--feast-bg)]/85 sm:text-lg"
          initial={fadeUp}
          whileInView={animateTo}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
        >
          Freshly prepared meals, authentic recipes, premium ingredients and
          unforgettable flavors delivered to your doorstep.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          initial={fadeUp}
          whileInView={animateTo}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.16 }}
        >
          <Button
            asChild
            variant="default"
            size="lg"
            className="feast-btn-primary w-full min-w-[200px] sm:w-auto"
          >
            <Link href="/menu">Order Now</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full min-w-[200px] border-[var(--feast-bg)]/40 bg-transparent text-[var(--feast-bg)] hover:bg-[var(--feast-bg)]/10 hover:text-[var(--feast-bg)] sm:w-auto"
          >
            <Link href="/catering">Book Catering</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
