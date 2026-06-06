import {
  CATERING_STATUS_COLORS,
  CATERING_STATUS_LABELS,
  type CateringRequestStatus,
} from "@/lib/data/catering-requests";
import { cn } from "@/lib/utils";

export interface CateringStatusBadgeProps {
  status: CateringRequestStatus;
  className?: string;
}

export function CateringStatusBadge({
  status,
  className,
}: CateringStatusBadgeProps) {
  const colors = CATERING_STATUS_COLORS[status];

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        colors.bg,
        colors.text,
        className,
      )}
    >
      {CATERING_STATUS_LABELS[status]}
    </span>
  );
}
