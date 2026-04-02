/**
 * components/atoms/FallbackImage.tsx
 *
 * A thin wrapper around next/image that handles broken image URLs gracefully.
 * When the underlying <Image> fires an onError event (network failure, 404,
 * invalid URL, etc.), the component switches to a neutral placeholder instead
 * of showing the browser's default broken-image icon.
 *
 * Must be a Client Component ('use client') because it uses useState to track
 * the error state — Server Components cannot hold interactive state.
 */

"use client";

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src: string;
  alt: string;
  /** Pass true to use CSS-based fill layout (parent must be position:relative) */
  fill?: boolean;
  sizes?: string;
  /** Mark as priority to skip lazy-loading for LCP images */
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Wraps next/image with a graceful onError fallback.
 * When the image URL fails to load (network error, 404, etc.),
 * it renders a neutral placeholder instead of a broken image icon.
 *
 * The placeholder uses role="img" and an accessible aria-label so
 * screen readers still announce that an image was expected here.
 */
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
