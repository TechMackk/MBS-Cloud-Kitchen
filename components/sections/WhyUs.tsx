import { ChefHat, Heart, Sprout, Truck } from "lucide-react";

const WHY_US_CARDS = [
  {
    id: "farm-fresh",
    title: "Farm Fresh Ingredients",
    description: "Sourced daily from trusted farms",
    icon: Sprout,
  },
  {
    id: "expert-chefs",
    title: "Expert Telangana Chefs",
    description: "Traditional recipes with modern healthy twist",
    icon: ChefHat,
  },
  {
    id: "fast-delivery",
    title: "Fast & Reliable Delivery",
    description: "On-time delivery guaranteed",
    icon: Truck,
  },
  {
    id: "healthy-cooking",
    title: "Healthy Cooking Methods",
    description: "Less oil, more health, great taste",
    icon: Heart,
  },
] as const;

export function WhyUs() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="why-us-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2
            id="why-us-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Why Customers Love MBS
          </h2>
          <div
            className="mt-3 h-1 w-16 rounded-full bg-green-soft"
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {WHY_US_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.id}
                className="min-w-0 rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-card-neon sm:p-6"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-soft to-green-neon sm:mb-5 sm:h-[60px] sm:w-[60px]"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6 text-green-deep sm:h-7 sm:w-7" />
                </div>
                <h3 className="font-heading text-base font-bold text-green-deep sm:text-lg">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text/60">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
