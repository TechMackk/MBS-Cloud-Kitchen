import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const CHECKLIST = [
  "Weddings",
  "Housewarming",
  "Birthday Functions",
  "Temple Events & More",
] as const;

export function CateringCTA() {
  return (
    <section
      className="relative overflow-hidden bg-green-deep py-16 sm:py-20"
      aria-labelledby="catering-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(245, 239, 216, 0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="order-2 lg:order-none">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange">
              For Every Occasion
            </p>
            <h2
              id="catering-cta-heading"
              className="font-heading text-3xl font-bold text-cream sm:text-4xl"
            >
              Catering &amp; Bulk Orders
            </h2>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-cream/90"
                >
                  <Check
                    className="h-4 w-4 shrink-0 text-green-neon"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <Button asChild variant="default" size="lg" className="mt-8 w-full sm:w-auto">
              <Link href="/catering">Get Catering Quote &rarr;</Link>
            </Button>
          </div>

          <div className="order-1 lg:order-none">
            <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-2xl border-2 border-green-soft/30 shadow-xl lg:max-w-none">
              <Image
                src="https://images.unsplash.com/photo-1555244167-11ddee37523d?w=800&h=600&fit=crop"
                alt="Catering spread with traditional Indian dishes"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
