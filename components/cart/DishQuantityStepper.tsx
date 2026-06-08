"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DishQuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  className?: string;
}

export function DishQuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
  className,
}: DishQuantityStepperProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-2xl border-2 border-orange/30 bg-orange/10 px-1.5 sm:h-10",
        className,
      )}
      role="group"
      aria-label={`Quantity: ${quantity}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        className="flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-full bg-green-deep text-white transition-colors hover:bg-green-deep/90 disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span
        className="min-w-[2rem] text-center font-heading text-lg font-bold text-green-deep"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        className="flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-full bg-orange text-white transition-colors hover:bg-orange-neon disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
