import { DishCard } from "@/components/menu/DishCard";
import { getFeaturedMenuItems } from "@/lib/db/menu";

export async function FeaturedDishes() {
  const featuredItems = await getFeaturedMenuItems();

  return (
    <section
      className="bg-cream/30 py-16 sm:py-24"
      aria-labelledby="specials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="specials-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Today&apos;s Specials
          </h2>
          <p className="mt-4 text-text/70">
            Handpicked Telangana favourites, made fresh every day.
          </p>
        </div>

        {featuredItems.length === 0 ? (
          <p className="text-center text-text/60">
            Featured dishes will appear here soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item, index) => (
              <DishCard
                key={item.id}
                item={item}
                variant="featured"
                priority={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
