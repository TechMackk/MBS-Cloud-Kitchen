import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";
import { cn } from "@/lib/utils";

export interface MenuItemImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  placeholderClassName?: string;
  useBlurPlaceholder?: boolean;
}

export function MenuItemImage({
  src,
  alt,
  fill = true,
  priority = false,
  sizes,
  className,
  placeholderClassName,
  useBlurPlaceholder = true,
}: MenuItemImageProps) {
  const hasImage = Boolean(src?.trim());

  if (!hasImage) {
    return (
      <div
        className={cn(
          fill && "absolute inset-0",
          "flex items-center justify-center bg-cream/40",
          placeholderClassName,
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageIcon
          className="h-10 w-10 text-green-soft/35 sm:h-12 sm:w-12"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      placeholder={useBlurPlaceholder ? "blur" : undefined}
      blurDataURL={useBlurPlaceholder ? IMAGE_BLUR_DATA_URL : undefined}
      className={className}
    />
  );
}
