"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSuggestionChipClasses,
  getTagBadgeClasses,
  MENU_TAG_SUGGESTIONS,
  type MenuTagSuggestion,
} from "@/lib/menu/tags";
import { cn } from "@/lib/utils";

export interface MenuTagsFieldProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function MenuTagsField({ value, onChange }: MenuTagsFieldProps) {
  const [inputValue, setInputValue] = useState("");

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= 10) {
      return;
    }
    onChange([...value, trimmed]);
    setInputValue("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((existing) => existing !== tag));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag(inputValue);
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="tags-input">Tags</Label>
      <Input
        id="tags-input"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter"
      />
      <p className="text-xs text-text/60">
        Click a suggestion or type custom tags. Maximum 10 tags.
      </p>

      <div className="flex flex-wrap gap-2">
        {MENU_TAG_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={value.includes(suggestion)}
            onClick={() => addTag(suggestion)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              getSuggestionChipClasses(suggestion as MenuTagSuggestion),
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                getTagBadgeClasses(tag),
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-black/5"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
