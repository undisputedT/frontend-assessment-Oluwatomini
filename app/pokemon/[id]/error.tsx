"use client";

// app/pokemon/[id]/error.tsx
// Shown when the detail page throws an error.
// Gives the user two options: try again, or go back to the listing.
// Must be a client component to use the reset() callback.

import { useEffect } from "react";
import Link from "next/link";

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
