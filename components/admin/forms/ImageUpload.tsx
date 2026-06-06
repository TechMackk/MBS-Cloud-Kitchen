"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
} from "@/lib/storage/constants";
import { cn } from "@/lib/utils";

export interface ImageUploadProps {
  currentImageUrl?: string;
  required?: boolean;
  error?: string;
  onFileChange: (file: File | null) => void;
}

export function ImageUpload({
  currentImageUrl,
  required = false,
  error,
  onFileChange,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const displayUrl = previewUrl ?? currentImageUrl ?? null;

  const validateAndSetFile = useCallback(
    (file: File | null) => {
      setLocalError(null);

      if (!file) {
        setPreviewUrl(null);
        onFileChange(null);
        return;
      }

      if (
        !(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)
      ) {
        setLocalError("Invalid file type. Use JPEG, PNG, or WebP.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setLocalError(`File too large. Maximum ${MAX_IMAGE_SIZE_MB}MB.`);
        return;
      }

      setPreviewUrl(URL.createObjectURL(file));
      onFileChange(file);
    },
    [onFileChange],
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    validateAndSetFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    validateAndSetFile(file);
  }

  function handleRemove() {
    setPreviewUrl(null);
    setLocalError(null);
    onFileChange(null);
  }

  const showError = error ?? localError;

  return (
    <div className="space-y-2">
      <input
        type="file"
        id="image"
        name="image"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        className="sr-only"
        onChange={handleInputChange}
        aria-invalid={Boolean(showError)}
      />

      {displayUrl ? (
        <div className="space-y-3">
          <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-2xl border border-green-soft/20">
            <Image
              src={displayUrl}
              alt="Upload preview"
              fill
              className="object-cover"
              unoptimized={Boolean(previewUrl)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" asChild>
              <label htmlFor="image" className="cursor-pointer">
                Replace
              </label>
            </Button>
            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="gap-1"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor="image"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors",
            isDragging
              ? "border-green-neon bg-cream/50"
              : showError
                ? "border-orange bg-orange/5"
                : "border-green-soft/40 hover:border-green-soft hover:bg-cream/30",
          )}
        >
          <Upload className="mb-3 h-8 w-8 text-green-soft" aria-hidden="true" />
          <p className="text-sm font-medium text-green-deep">
            Click or drag to upload
          </p>
          <p className="mt-1 text-xs text-text/50">
            JPEG, PNG, WebP — max {MAX_IMAGE_SIZE_MB}MB
            {required ? " (required)" : ""}
          </p>
          <ImageIcon className="mt-2 h-4 w-4 text-text/30" aria-hidden="true" />
        </label>
      )}

      {showError && (
        <p className="text-sm text-orange" role="alert">
          {showError}
        </p>
      )}
    </div>
  );
}
