import { ChefHat } from "lucide-react";

import { SITE } from "@/lib/constants";

export function AboutHero() {
  return (
    <section
      className="hero-pattern relative flex min-h-[50vh] items-center bg-hero-gradient sm:min-h-[60vh]"
      aria-labelledby="about-hero-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-deep/10 text-green-deep"
            aria-hidden="true"
          >
            <ChefHat className="h-7 w-7" />
          </div>

          <h1
            id="about-hero-heading"
            className="font-heading text-4xl font-bold tracking-tight text-green-deep sm:text-5xl"
          >
            {SITE.tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text/70">
            The story behind {SITE.name}
          </p>
        </div>
      </div>
    </section>
  );
}
