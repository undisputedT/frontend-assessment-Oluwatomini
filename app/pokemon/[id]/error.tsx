/**
 * app/pokemon/[id]/error.tsx
 *
 * Error boundary for the Pokémon detail page. Catches unhandled errors thrown
 * during the detail page's server render (e.g. API timeout, unexpected shape).
 *
 * Provides two recovery options:
 *   1. "Try again" — calls Next.js's reset() to retry the failed render
 *   2. "Back to listing" — navigates to the home page if the Pokémon is
 *      genuinely unavailable and retrying would not help
 *
 * Must be a Client Component ('use client') so it can receive the `reset`
 * callback and attach it to the button's onClick handler.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Renders a user-friendly error state for the detail page.
 * Logs the error for observability and offers two recovery paths.
 */
export default function Error({ error, reset }: ErrorProps) {
  // Log to console so the error surfaces in server logs / error monitoring
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl" aria-hidden="true">
        💥
      </p>
      <h2 className="mt-4 text-xl font-bold text-gray-800">
        Couldn&apos;t load this Pokémon
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        The Pokémon data failed to load. It may not exist or the API may be
        temporarily unavailable.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back to listing
        </Link>
      </div>
    </div>
  );
}
