import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { CONTACT, SITE, whatsappUrl } from "@/lib/constants";

export function Hero() {
  return (
    <section
      className="hero-pattern relative flex min-h-[80vh] items-center bg-hero-gradient"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <Logo className="h-20 w-20 text-2xl" />
          </div>

          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-green-soft">
            {SITE.subTagline}
          </p>

          <h1
            id="hero-heading"
            className="font-heading text-4xl font-bold tracking-tight text-green-deep sm:text-5xl lg:text-6xl"
          >
            {SITE.tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text/70 sm:text-xl">
            Authentic Telangana Specials, Delivered Fresh
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild variant="default" size="lg">
              <a
                href={whatsappUrl(
                  CONTACT.whatsappOrdersRaw,
                  "Hi, I'd like to place an order!",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Order on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/menu">View Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
