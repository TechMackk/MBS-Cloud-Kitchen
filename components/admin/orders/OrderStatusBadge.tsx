import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/lib/data/orders";
import { cn } from "@/lib/utils";

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const colors = ORDER_STATUS_COLORS[status];

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        colors.bg,
        colors.text,
        className,
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
