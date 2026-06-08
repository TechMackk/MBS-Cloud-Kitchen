import Link from "next/link";
import {
  Briefcase,
  Drumstick,
  Flame,
  Sprout,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "healthy-veg",
    label: "Healthy Veg",
    href: "/menu?diet=veg",
    icon: Sprout,
  },
  {
    id: "healthy-non-veg",
    label: "Healthy Non-Veg",
    href: "/menu?diet=non-veg",
    icon: Drumstick,
  },
  {
    id: "biryani",
    label: "Biryani Specials",
    href: "/menu?category=biryani",
    icon: Flame,
  },
  {
    id: "family-packs",
    label: "Family Packs",
    href: "/menu",
    icon: Users,
  },
  {
    id: "catering",
    label: "Catering Orders",
    href: "/catering",
    icon: UtensilsCrossed,
  },
  {
    id: "corporate",
    label: "Corporate Lunches",
    href: "/catering",
    icon: Briefcase,
  },
] as const;

export function SmartCategories() {
  return (
    <section
      className="bg-cream/20 py-16 sm:py-20"
      aria-labelledby="smart-categories-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2
            id="smart-categories-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Smart Food Categories
          </h2>
          <div
            className="mt-3 h-1 w-16 rounded-full bg-green-soft"
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group flex min-w-0 flex-col items-center rounded-2xl border border-green-soft/20 bg-white px-2 py-4 text-center shadow-sm transition-all duration-300 hover:border-green-neon/50 hover:shadow-glow-card-neon sm:px-4 sm:py-5"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-cream transition-all duration-300 group-hover:border-green-neon group-hover:shadow-glow-green-neon sm:mb-3 sm:h-16 sm:w-16">
                  <Icon
                    className="h-5 w-5 text-green-deep motion-safe:animate-neon-pulse-subtle sm:h-7 sm:w-7"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-xs font-medium leading-tight text-green-deep sm:text-sm">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
