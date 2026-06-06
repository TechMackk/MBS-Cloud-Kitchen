import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  available: boolean;
}

export function StatusBadge({ available }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        available
          ? "bg-green-soft/20 text-green-deep"
          : "bg-orange/10 text-orange",
      )}
    >
      {available ? "Available" : "Unavailable"}
    </span>
  );
}
