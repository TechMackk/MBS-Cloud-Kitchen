export function ContactHero() {
  return (
    <section
      className="hero-pattern relative flex min-h-[40vh] items-center bg-hero-gradient"
      aria-labelledby="contact-hero-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="contact-hero-heading"
            className="font-heading text-4xl font-bold tracking-tight text-green-deep sm:text-5xl"
          >
            Get in Touch
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text/70">
            We&apos;re here to take your order, answer questions, or plan your
            next catering event
          </p>
        </div>
      </div>
    </section>
  );
}
