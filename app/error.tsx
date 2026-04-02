/**
 * app/error.tsx
 *
 * Next.js error boundary for the listing page. Automatically activated when
 * the listing page's Server Component throws an unhandled error (e.g. a
 * PokéAPI network failure). The `reset` function provided by Next.js retries
 * the failed render, giving the user a recovery path without a full reload.
 *
 * Must be a Client Component ('use client') — error boundaries are a React
 * concept implemented with class component lifecycle hooks; Next.js requires
 * the error file to be a Client Component so it can receive the `reset`
 * callback and call it on button click.
 *
 * The error is logged to the console via useEffect so that it appears in
 * server logs / error monitoring tools without disrupting the UI render.
 */

"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Renders a user-friendly error state for the listing page.
 * Provides a "Try again" button that calls Next.js's reset() function to
 * re-attempt the failed server render without a full page reload.
 */
export default function Error({ error, reset }: ErrorProps) {
  // Log to console so the error surfaces in server logs / error monitoring
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl" aria-hidden="true">
        ⚠️
      </p>
      <h2 className="mt-4 text-xl font-bold text-gray-800">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        We couldn&apos;t load the Pokémon data. This might be a temporary issue
        with the PokéAPI.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
