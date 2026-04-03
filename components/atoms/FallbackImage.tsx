"use client";

// components/atoms/FallbackImage.tsx
// A wrapper around next/image that handles broken image URLs gracefully.
// If the image fails to load (404, network error, etc.), it shows a
// placeholder instead of a broken image icon.
// Needs to be a client component because it uses useState to track the error.

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src: string;
  alt: string;
  fill?: boolean;    // uses CSS fill layout — parent must have position: relative
  sizes?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export function FallbackImage({ src, alt, fill, sizes, priority, className, width, height }: FallbackImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded-xl bg-gray-100 text-4xl"
        role="img"
        aria-label={`${alt} image unavailable`}
      >
        ❓
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  );
}
