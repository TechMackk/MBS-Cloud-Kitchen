"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuantityControlProps {
  quantity: number;
  onChange: (quantity: number) => void;
  className?: string;
  size?: "sm" | "md";
}

export function QuantityControl({
  quantity,
  onChange,
  className,
  size = "md",
}: QuantityControlProps) {
  const buttonSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={buttonSize}
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      <span
        className={cn(
          "min-w-[1.5rem] text-center font-medium text-green-deep",
          size === "sm" ? "text-sm" : "text-base",
        )}
        aria-live="polite"
      >
        {quantity}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={buttonSize}
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}
