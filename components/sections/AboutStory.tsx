import Image from "next/image";

export interface AboutStoryProps {
  children: React.ReactNode;
}

export function AboutStory({ children }: AboutStoryProps) {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="about-story-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="about-story-heading"
          className="mb-12 text-center font-heading text-3xl font-bold text-green-deep sm:text-4xl"
        >
          Our Story
        </h2>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="prose prose-green max-w-none prose-headings:font-heading prose-headings:text-green-deep prose-p:text-text/80 prose-strong:text-green-deep prose-li:text-text/80">
            {children}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-green-soft/20 shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
              alt="Chef preparing food in a traditional Indian kitchen"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
