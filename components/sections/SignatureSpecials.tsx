import { DarkDishCard } from "@/components/menu/DarkDishCard";
import { getFeaturedMenuItems } from "@/lib/db/menu";

export async function SignatureSpecials() {
  const featuredItems = (await getFeaturedMenuItems()).slice(0, 8);

  return (
    <section
      className="relative overflow-hidden bg-royal-bg-primary py-16 sm:py-24"
      aria-labelledby="signature-specials-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 royal-arch-pattern opacity-50"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-primary sm:text-sm">
            Our Top Picks
          </p>
          <h2
            id="signature-specials-heading"
            className="mt-3 font-heading text-3xl font-bold text-cream-warm sm:text-4xl"
          >
            Signature Specials
          </h2>
          <div
            className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-gold-primary to-transparent"
            aria-hidden="true"
          />
        </div>

        {featuredItems.length === 0 ? (
          <p className="text-center text-cream-warm/60">
            Signature specials will appear here soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {featuredItems.map((item, index) => (
              <DarkDishCard
                key={item.id}
                item={item}
                priority={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
