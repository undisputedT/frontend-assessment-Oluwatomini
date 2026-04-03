// app/not-found.tsx
// Shown when a URL doesn't match any route, or when notFound() is called
// (e.g. a Pokémon ID that doesn't exist).

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl" aria-hidden="true">
        🌫️
      </p>
      <h2 className="mt-4 text-xl font-bold text-gray-800">
        Page not found
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        That Pokémon (or page) doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Back to listing
      </Link>
    </div>
  );
}
