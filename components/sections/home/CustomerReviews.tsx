import { Star, StarHalf } from "lucide-react";

import { getCustomerReviews } from "@/lib/home/reviews";

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(1, rating));
  const fullStars = Math.floor(clamped);
  const hasHalfStar = clamped - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${clamped} out of 5 stars`}
    >
      {Array.from({ length: fullStars }, (_, index) => (
        <Star
          key={`full-${index}`}
          className="h-4 w-4 fill-[var(--feast-primary)] text-[var(--feast-primary)]"
          aria-hidden="true"
        />
      ))}
      {hasHalfStar ? (
        <StarHalf
          className="h-4 w-4 fill-[var(--feast-primary)] text-[var(--feast-primary)]"
          aria-hidden="true"
        />
      ) : null}
      {Array.from({ length: emptyStars }, (_, index) => (
        <Star
          key={`empty-${index}`}
          className="h-4 w-4 text-[var(--feast-text)]/20"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function formatReviewDate(isoDate: string | undefined): string | null {
  if (!isoDate?.trim()) {
    return null;
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function CustomerReviews() {
  const reviews = getCustomerReviews();

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 sm:py-24"
      aria-labelledby="customer-reviews-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="customer-reviews-heading"
            className="font-heading text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--feast-secondary)" }}
          >
            Loved By Our Customers
          </h2>
          <p className="mt-4 text-base text-[var(--feast-text)]/70 sm:text-lg">
            Real experiences from customers who enjoy MBS Cloud Kitchen.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reviews.map((review) => {
            const formattedDate = formatReviewDate(review.date);

            return (
              <li key={review.id}>
                <article className="feast-glass-card flex h-full min-w-0 flex-col rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className="font-heading text-base font-bold sm:text-lg"
                      style={{ color: "var(--feast-secondary)" }}
                    >
                      {review.author}
                    </p>
                    <StarRating rating={review.rating} />
                  </div>

                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[var(--feast-text)]/75 sm:text-base">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>

                  {formattedDate ? (
                    <time
                      dateTime={review.date}
                      className="mt-4 text-xs text-[var(--feast-text)]/50 sm:text-sm"
                    >
                      {formattedDate}
                    </time>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
