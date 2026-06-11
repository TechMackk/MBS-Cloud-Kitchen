import type { ReactNode } from "react";

const LAST_UPDATED = "June 11, 2026";

export function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-royal-bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-gold-dark/30 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-primary">
            Legal
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-cream-warm sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-cream-warm/60">
            Last updated: {LAST_UPDATED}
          </p>
        </header>
        <div className="space-y-10">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={title.replace(/\s+/g, "-").toLowerCase()}>
      <h2
        id={title.replace(/\s+/g, "-").toLowerCase()}
        className="font-heading text-xl font-semibold text-cream-warm sm:text-2xl"
      >
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-cream-warm/80 sm:text-base">
        {children}
      </div>
    </section>
  );
}
