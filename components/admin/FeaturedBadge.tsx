import { Star } from "lucide-react";

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium text-orange">
      <Star className="h-3 w-3 fill-orange" aria-hidden="true" />
      Featured
    </span>
  );
}
