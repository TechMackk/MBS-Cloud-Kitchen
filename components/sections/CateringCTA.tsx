import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import { CONTACT, whatsappUrl } from "@/lib/constants";

const CHECKLIST = [
  "Weddings",
  "Birthday Functions",
  "Housewarming",
  "Temple Events",
] as const;

export function CateringCTA() {
  return (
    <section
      className="relative overflow-hidden bg-royal-bg-secondary py-16 sm:py-20"
      aria-labelledby="catering-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 royal-arch-pattern opacity-40"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-w-0 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 min-w-0 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-primary sm:text-sm">
              For Every Occasion
            </p>
            <h2
              id="catering-cta-heading"
              className="mt-3 font-heading text-3xl font-bold text-cream-warm sm:text-4xl"
            >
              Catering &amp; Bulk Orders
            </h2>
            <p className="mt-4 max-w-lg text-base text-cream-warm/70 sm:text-lg">
              Authentic Telangana cuisine at scale
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-cream-warm/90"
                >
                  <Check
                    className="h-4 w-4 shrink-0 text-gold-primary"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/catering"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gold-dark/35 bg-orange px-7 text-sm font-semibold text-white transition-colors hover:bg-orange-neon hover:shadow-[0_0_26px_rgba(212,175,55,0.40)] sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-royal-bg-secondary"
              >
                <span>Get Catering Quote</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              <a
                href={whatsappUrl(
                  CONTACT.whatsappCateringRaw,
                  "Hi, I'd like to enquire about catering!",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#25D366] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#22c55e] sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-royal-bg-secondary"
              >
                WhatsApp Catering
              </a>
            </div>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-full overflow-hidden rounded-2xl border-2 border-gold-primary shadow-[0_0_32px_rgba(212,175,55,0.18)] sm:max-w-md lg:max-w-none">
              <Image
                src="/catering-banner.jpg"
                alt="MBS catering spread"
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
