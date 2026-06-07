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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.id}
                className="rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-card"
              >
                <div
                  className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-green-soft/20"
                  aria-hidden="true"
                >
                  <Icon className="h-7 w-7 text-green-soft" />
                </div>
                <h3 className="font-heading text-lg font-bold text-green-deep">
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
