import { format } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";

import type { OrderRecord } from "@/lib/data/orders";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "created", label: "Order Placed" },
  { key: "acknowledged", label: "Acknowledged" },
  { key: "delivered", label: "Delivered" },
] as const;

export interface OrderTimelineProps {
  order: OrderRecord;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const acknowledged = Boolean(order.acknowledgedAt);
  const delivered = Boolean(order.deliveredAt);

  const states = [
    { done: true, date: order.createdAt, label: STEPS[0].label },
    {
      done: acknowledged || order.status === "CANCELLED",
      date: order.acknowledgedAt,
      label: STEPS[1].label,
    },
    {
      done: delivered,
      date: order.deliveredAt,
      label: STEPS[2].label,
    },
  ];

  return (
    <ol className="space-y-4">
      {states.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          {step.done ? (
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-green-soft"
              aria-hidden="true"
            />
          ) : (
            <Circle
              className="mt-0.5 h-5 w-5 shrink-0 text-green-soft/40"
              aria-hidden="true"
            />
          )}
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                step.done ? "text-green-deep" : "text-text/40",
              )}
            >
              {step.label}
            </p>
            {step.date && (
              <p className="text-xs text-text/50">
                {format(step.date, "dd MMM yyyy, h:mm a")}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
