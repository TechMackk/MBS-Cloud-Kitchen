import {
  ChefHat,
  Heart,
  ShieldCheck,
  Sprout,
  Truck,
} from "lucide-react";

/**
 * Pillars derived from existing WhyUs + QualityPromise content.
 * No new marketing claims beyond what those sections already state.
 */
const PILLARS = [
  {
    id: "fresh-ingredients",
    title: "Fresh Ingredients",
    description: "Sourced daily from trusted farms",
    icon: Sprout,
  },
  {
    id: "authentic-recipes",
    title: "Authentic Telangana Recipes",
    description: "Traditional recipes with modern healthy twist",
    icon: ChefHat,
  },
  {
    id: "healthy-cooking",
    title: "Healthy Cooking Methods",
    description: "Less oil, more health, great taste",
    icon: Heart,
  },
  {
    id: "fast-delivery",
    title: "Fast Delivery",
    description: "On-time delivery guaranteed",
    icon: Truck,
  },
  {
    id: "quality-hygiene",
    title: "Quality & Hygiene",
    description:
      "Fresh daily prep in a hygienic kitchen — no frozen food, no reused oil",
    icon: ShieldCheck,
  },
] as const;

export function WhyMBS() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="why-mbs-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2
            id="why-mbs-heading"
            className="font-heading text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--feast-secondary)" }}
          >
            Why MBS
          </h2>
          <div
            className="mt-3 h-1 w-16 rounded-full"
            style={{ backgroundColor: "var(--feast-primary)" }}
            aria-hidden="true"
          />
          <p className="mt-4 text-base text-[var(--feast-text)]/70 sm:text-lg">
            What you eat matters. Here is our commitment to every meal we
            serve.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.id}
                className="feast-glass-card min-w-0 rounded-2xl p-5 transition-shadow duration-300 hover:shadow-lg sm:p-6"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--feast-primary) 12%, transparent)",
                    color: "var(--feast-primary)",
                  }}
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3
                  className="font-heading text-base font-bold sm:text-lg"
                  style={{ color: "var(--feast-secondary)" }}
                >
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--feast-text)]/65">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
