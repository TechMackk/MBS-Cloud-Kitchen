import Image from "next/image";
import Link from "next/link";
import { Phone, User } from "lucide-react";

const PHONE_NUMBER_DISPLAY = "+91 98486 06161";
const PHONE_NUMBER_TEL = "+919848606161";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-royal-bg-primary text-cream-warm"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="royal-arch-pattern absolute inset-0" />
        <div className="royal-vignette absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-primary sm:text-sm">
              MIND &bull; BODY &bull; SOUL CLOUD KITCHEN
            </p>

            <a
              href={`tel:${PHONE_NUMBER_TEL}`}
              className="mt-5 inline-flex items-center gap-2 text-2xl font-heading font-bold text-gold-primary sm:text-3xl lg:text-4xl"
              aria-label={`Call ${PHONE_NUMBER_DISPLAY}`}
            >
              <Phone className="h-6 w-6" aria-hidden="true" />
              {PHONE_NUMBER_DISPLAY}
            </a>

            <h1
              id="hero-heading"
              className="mt-6 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-6xl"
            >
              <span className="text-cream-warm">Telangana </span>
              <span className="bg-gradient-to-r from-gold-light to-gold-primary bg-clip-text text-transparent">
                Specials
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-warm/70 sm:text-lg">
              Authentic flavors, freshly prepared every day
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/menu"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gold-dark/35 bg-orange px-7 text-sm font-semibold text-white transition-colors hover:bg-orange-neon hover:shadow-none hover:shadow-[0_0_26px_rgba(212,175,55,0.40)] sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-royal-bg-primary"
              >
                <span>Order Now</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              <Link
                href="/menu"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-gold-dark/55 bg-transparent px-7 text-sm font-semibold text-gold-primary transition-colors hover:bg-royal-bg-secondary/40 hover:text-gold-light sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-royal-bg-primary"
              >
                Explore Menu
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={`avatar-${idx}`}
                    className="-ml-2 first:ml-0 flex h-9 w-9 items-center justify-center rounded-full border border-gold-dark/30 bg-cream-warm text-royal-bg-primary"
                    aria-hidden="true"
                  >
                    <User className="h-4 w-4" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-cream-warm/90">
                <span className="text-gold-light">4.9&#9733;</span> rated by{" "}
                <span className="text-gold-light">2K+</span> happy customers
              </p>
            </div>
          </div>

          <div className="order-2 flex min-w-0 items-center justify-center">
            <div className="relative mx-auto w-full max-w-[280px] lg:max-w-[80%]">
              <div
                className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)",
                }}
                aria-hidden="true"
              />
              <div className="relative aspect-square w-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.02]">
                <Image
                  src="/logo-badge.png"
                  alt="MBS Cloud Kitchen"
                  fill
                  priority
                  sizes="(max-width: 1024px) 280px, 40vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
