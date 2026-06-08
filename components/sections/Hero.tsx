import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Drumstick,
  Leaf,
  Sprout,
  Star,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

const FOOD_CIRCLES = [
  {
    id: "biryani",
    label: "Biryanis",
    src: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=240&h=240&fit=crop",
    position: "top-0 left-1/2 -translate-x-1/2",
    mobilePosition: "col-start-1 row-start-1",
    delay: "0s",
  },
  {
    id: "non-veg",
    label: "Non-Veg Curries",
    src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=240&h=240&fit=crop",
    position: "right-0 top-1/2 -translate-y-1/2",
    mobilePosition: "col-start-2 row-start-1",
    delay: "0.5s",
  },
  {
    id: "veg",
    label: "Veg Meals",
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=240&h=240&fit=crop",
    position: "bottom-0 left-1/2 -translate-x-1/2",
    mobilePosition: "col-start-1 row-start-2",
    delay: "1s",
  },
  {
    id: "andhra",
    label: "Andhra Meals",
    src: "https://images.unsplash.com/photo-1589302168068-964664d93f?w=240&h=240&fit=crop",
    position: "left-0 top-1/2 -translate-y-1/2",
    mobilePosition: "col-start-2 row-start-2",
    delay: "1.5s",
  },
] as const;

const TRUST_BADGES = [
  { icon: Star, value: "4.9", label: "Customer Rating" },
  { icon: Clock, value: "30 Min", label: "Delivery Time" },
  { icon: Leaf, value: "Fresh", label: "Ingredients" },
  { icon: Drumstick, value: "Healthy", label: "Non-Veg" },
  { icon: Sprout, value: "Pure", label: "Veg" },
] as const;

function TrustBadge({
  icon: Icon,
  value,
  label,
  compact = false,
}: {
  icon: (typeof TRUST_BADGES)[number]["icon"];
  value: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "neon-trust-badge flex min-w-0 items-center gap-2 rounded-lg border border-green-soft/40 bg-white px-2 py-2 shadow-sm"
          : "neon-trust-badge flex min-w-0 items-center gap-2.5 rounded-xl border border-green-soft/40 bg-white px-3 py-2.5 shadow-sm hover:-translate-y-0.5"
      }
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-green-neon/15 ${compact ? "h-6 w-6" : "h-7 w-7"}`}
        aria-hidden="true"
      >
        <Icon
          className={`text-green-neon ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`}
        />
      </div>
      <div className="min-w-0">
        <p
          className={`font-bold leading-none text-green-deep ${compact ? "text-xs" : "text-sm"}`}
        >
          {value}
        </p>
        <p className="mt-0.5 text-[10px] leading-tight text-text/60">{label}</p>
      </div>
    </div>
  );
}

function FoodCircle({
  label,
  src,
  position,
  mobilePosition,
  delay,
  variant,
}: {
  label: string;
  src: string;
  position: string;
  mobilePosition: string;
  delay: string;
  variant: "desktop" | "mobile";
}) {
  const size =
    variant === "desktop"
      ? `absolute h-20 w-20 sm:h-24 sm:w-24 ${position}`
      : `relative h-16 w-16 justify-self-center sm:h-20 sm:w-20 ${mobilePosition}`;

  return (
    <div
      className={`${size} neon-food-ring motion-safe:animate-hero-float overflow-hidden rounded-full border-4 border-white ring-2 ring-green-neon/30`}
      style={{ animationDelay: delay }}
    >
      <Image
        src={src}
        alt={label}
        width={96}
        height={96}
        className="h-full w-full object-cover"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="hero-pattern relative overflow-hidden bg-hero-gradient"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-green-soft/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-green-neon/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-green-neon/50 motion-safe:animate-neon-dot-pulse"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[18%] top-[28%] h-1.5 w-1.5 rounded-full bg-green-neon/40 motion-safe:animate-neon-dot-pulse"
        style={{ animationDelay: "1.2s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[22%] left-[28%] h-2.5 w-2.5 rounded-full bg-green-neon/35 motion-safe:animate-neon-dot-pulse"
        style={{ animationDelay: "2.4s" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20">
        <div className="grid min-w-0 items-center gap-8 sm:gap-10 lg:grid-cols-[3fr_2fr] lg:gap-8 xl:gap-12">
          <div className="order-1 min-w-0 lg:order-none">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange sm:text-sm sm:tracking-[0.2em]">
              Telangana&apos;s Healthiest Cloud Kitchen
            </p>

            <h1
              id="hero-heading"
              className="font-heading text-3xl font-bold leading-tight tracking-tight break-words sm:text-4xl lg:text-5xl xl:text-[3.25rem]"
            >
              <span className="block text-green-deep">
                Authentic Telangana Flavors,
              </span>
              <span className="neon-text-glow-green block text-green-soft">
                Crafted Fresh Every Day
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-text/70 sm:text-lg">
              Veg &amp; Non-Veg meals made with farm-fresh ingredients, no
              shortcuts, no compromises.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                variant="default"
                size="lg"
                className="neon-btn-orange w-full sm:w-auto"
              >
                <Link href="/menu">Order Now &rarr;</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/menu">Explore Menu</Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex -space-x-2" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-soft/20"
                  >
                    <User className="h-4 w-4 text-green-deep" />
                  </div>
                ))}
              </div>
              <p className="min-w-0 text-sm text-text/70">
                <span className="font-semibold text-green-deep">4.9★</span> rated
                by 2K+ happy customers
              </p>
            </div>

            <div
              className="mt-6 grid grid-cols-2 gap-2 lg:hidden"
              aria-label="Trust badges"
            >
              {TRUST_BADGES.map((badge, index) => (
                <div
                  key={badge.label}
                  className={index === TRUST_BADGES.length - 1 ? "col-span-2" : undefined}
                >
                  <TrustBadge {...badge} compact />
                </div>
              ))}
            </div>
          </div>

          <div className="order-2 flex min-w-0 justify-center lg:order-none">
            <div className="relative w-full max-w-[60vw] rounded-3xl bg-hero-radial px-2 py-6 sm:max-w-md sm:px-4 sm:py-8 lg:max-w-sm">
              <div className="relative mx-auto hidden aspect-square w-full max-w-[280px] sm:max-w-[320px] lg:block">
                <div className="neon-food-ring absolute left-1/2 top-1/2 z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white bg-white ring-2 ring-green-neon/30 sm:h-36 sm:w-36">
                  <Logo className="h-full w-full rounded-full" imageClassName="p-2" />
                </div>
                {FOOD_CIRCLES.map((circle) => (
                  <FoodCircle
                    key={circle.id}
                    {...circle}
                    variant="desktop"
                  />
                ))}
              </div>

              <div className="lg:hidden">
                <div className="mx-auto mb-4 flex justify-center sm:mb-6">
                  <div className="neon-food-ring h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white ring-2 ring-green-neon/30 sm:h-28 sm:w-28">
                    <Logo className="h-full w-full rounded-full" imageClassName="p-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {FOOD_CIRCLES.map((circle) => (
                    <FoodCircle
                      key={circle.id}
                      {...circle}
                      variant="mobile"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex xl:right-8"
        aria-label="Trust badges"
      >
        {TRUST_BADGES.map((badge) => (
          <TrustBadge key={badge.label} {...badge} />
        ))}
      </div>
    </section>
  );
}
