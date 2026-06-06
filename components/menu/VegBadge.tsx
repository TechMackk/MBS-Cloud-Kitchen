import { cn } from "@/lib/utils";
import { DIET_LABELS, type DietType } from "@/lib/data/categories";

export interface VegBadgeProps {
  diet: DietType;
  className?: string;
}

const DIET_STYLES: Record<
  DietType,
  { border: string; fill: string; label: string }
> = {
  veg: {
    border: "border-[#22c55e]",
    fill: "bg-[#22c55e]",
    label: DIET_LABELS.veg,
  },
  "non-veg": {
    border: "border-[#ef4444]",
    fill: "bg-[#ef4444]",
    label: DIET_LABELS["non-veg"],
  },
  egg: {
    border: "border-[#eab308]",
    fill: "bg-[#eab308]",
    label: DIET_LABELS.egg,
  },
};

export function VegBadge({ diet, className }: VegBadgeProps) {
  const style = DIET_STYLES[diet];

  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded-sm border-2 bg-bg shadow-sm",
        style.border,
        className,
      )}
      aria-label={style.label}
      title={style.label}
    >
      <span
        className={cn("h-2.5 w-2.5 rounded-sm", style.fill)}
        aria-hidden="true"
      />
    </span>
  );
}
