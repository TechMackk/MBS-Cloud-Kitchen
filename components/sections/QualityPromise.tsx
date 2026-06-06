import { CheckCircle2 } from "lucide-react";

import { QUALITY_PROMISES } from "@/lib/constants";

export function QualityPromise() {
  return (
    <section
      className="py-16 sm:py-24"
      aria-labelledby="quality-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="quality-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Our Quality Promise
          </h2>
          <p className="mt-4 text-text/70">
            What you eat matters. Here is our commitment to every meal we serve.
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-4">
          {QUALITY_PROMISES.map((promise) => (
            <li key={promise.id}>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-cream/50 px-5 py-3 text-sm font-medium text-green-deep transition-all duration-300 hover:border-orange hover:shadow-glow-orange">
                <CheckCircle2
                  className="h-5 w-5 text-orange"
                  aria-hidden="true"
                />
                {promise.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
