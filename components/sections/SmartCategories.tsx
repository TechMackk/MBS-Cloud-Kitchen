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
      className="relative overflow-hidden bg-royal-bg-primary py-16 sm:py-20"
      aria-labelledby="category-tiles-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-primary sm:text-sm">
            Category Tiles
          </p>
          <h2
            id="category-tiles-heading"
            className="mt-3 font-heading text-3xl font-bold text-cream-warm sm:text-4xl"
          >
            Browse by Category
          </h2>
          <div
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-gold-primary/80 to-transparent sm:mx-0"
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
                className="group relative flex min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-gold-dark/40 bg-royal-bg-secondary px-2 py-5 text-center transition-all duration-300 hover:border-gold-primary hover:shadow-[0_0_20px_rgba(212,175,55,0.22)] sm:px-3 sm:py-6"
                style={{ aspectRatio: "4 / 5" }}
              >
                <span
                  className="pointer-events-none absolute left-0 top-0 h-0 w-0 border-b-[28px] border-r-[28px] border-b-transparent border-r-gold-primary/35"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 border-l-[28px] border-t-[28px] border-l-transparent border-t-gold-primary/35"
                  aria-hidden="true"
                />

                <Icon
                  className="mb-3 h-12 w-12 text-gold-primary sm:mb-4 sm:h-16 sm:w-16"
                  aria-hidden="true"
                  strokeWidth={1.25}
                />
                <span className="text-xs font-medium leading-tight text-cream-warm sm:text-sm">
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
