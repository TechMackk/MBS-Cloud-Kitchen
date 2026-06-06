import Image from "next/image";

import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

export function CateringHero() {
  return (
    <section
      className="relative flex min-h-[40vh] items-center overflow-hidden"
      aria-labelledby="catering-hero-heading"
    >
      <Image
        src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&h=800&fit=crop"
        alt="Indian wedding food spread with traditional dishes"
        fill
        priority
        placeholder="blur"
        blurDataURL={IMAGE_BLUR_DATA_URL}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-green-deep/70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1
          id="catering-hero-heading"
          className="font-heading text-4xl font-bold text-cream sm:text-5xl"
        >
          Catering Services
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream/90">
          From intimate gatherings to grand celebrations — Telangana cuisine,
          your way
        </p>
      </div>
    </section>
  );
}
