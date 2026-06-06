"use client";

import { Send } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 500;

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [value]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  }

  const remaining = MAX_LENGTH - value.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="border-t border-green-soft/20 bg-bg p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Ask about our menu..."
          rows={1}
          disabled={disabled}
          aria-label="Chat message"
          className={cn(
            "max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-green-soft/30 bg-bg px-3 py-2 text-sm outline-none transition-colors focus:border-green-neon",
            isOverLimit && "border-orange",
          )}
        />
        <Button
          type="button"
          size="icon"
          disabled={disabled || !value.trim()}
          onClick={onSubmit}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <p
        className={cn(
          "mt-1 text-right text-[10px] text-text/40",
          remaining < 50 && "text-orange",
        )}
      >
        {value.length}/{MAX_LENGTH}
      </p>
    </div>
  );
}
