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

        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group flex w-28 shrink-0 flex-col items-center rounded-2xl border border-green-soft/20 bg-white px-4 py-5 text-center shadow-sm transition-all duration-300 hover:border-green-soft hover:shadow-glow-card sm:w-auto"
              >
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cream transition-colors group-hover:border group-hover:border-green-soft">
                  <Icon
                    className="h-7 w-7 text-green-deep"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-sm font-medium text-green-deep">
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
