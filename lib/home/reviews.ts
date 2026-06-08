/**
 * Homepage customer reviews — config only, no fake data.
 *
 * Add real entries to CUSTOMER_REVIEWS when available.
 * Section hides automatically when the validated list is empty.
 *
 * Future: Google Reviews sync can populate CUSTOMER_REVIEWS via a build-time
 * or scheduled script without changing the CustomerReviews component API.
 */

export type CustomerReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  /** ISO date string — omitted when source has no date */
  date?: string;
  /** e.g. "google", "manual" */
  source?: string;
};

/** Owner-populated list. Empty until real reviews are added. */
export const CUSTOMER_REVIEWS: CustomerReview[] = [];

/**
 * Reserved for future Google Places / Business Profile sync.
 * Not wired in Phase D1 — manual entries only.
 */
export type GoogleReviewsSyncConfig = {
  enabled: boolean;
  placeId?: string;
};

export const GOOGLE_REVIEWS_SYNC: GoogleReviewsSyncConfig = {
  enabled: false,
};

function isValidReview(review: CustomerReview): boolean {
  const author = review.author?.trim() ?? "";
  const text = review.text?.trim() ?? "";

  return (
    author.length > 0 &&
    text.length > 0 &&
    Number.isFinite(review.rating) &&
    review.rating >= 1 &&
    review.rating <= 5
  );
}

/** Returns only validated reviews safe for public display. */
export function getCustomerReviews(): CustomerReview[] {
  return CUSTOMER_REVIEWS.filter(isValidReview);
}

export function hasCustomerReviews(): boolean {
  return getCustomerReviews().length > 0;
}
