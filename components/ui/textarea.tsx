import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-green-soft/30 bg-bg px-4 py-3 text-sm text-text transition-colors placeholder:text-text/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-neon focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-orange focus-visible:ring-orange",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
