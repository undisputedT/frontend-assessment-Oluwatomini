"use client";

// app/error.tsx
// Shown when the listing page throws an error (e.g. the API is down).
// The "Try again" button re-runs the failed fetch without a full page reload.
// Must be a client component to use the reset() callback from Next.js.

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
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
        className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
