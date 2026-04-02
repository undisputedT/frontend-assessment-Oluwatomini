/**
 * app/not-found.tsx
 *
 * Next.js global 404 page. Rendered when notFound() is called anywhere in
 * the app, or when a URL matches no route. Also handles non-numeric Pokémon
 * ID segments (e.g. /pokemon/abc) since the detail page calls notFound() on
 * invalid IDs.
 *
 * A direct "Back to listing" link is provided rather than relying on the
 * browser back button, which may not be available in all contexts (e.g.
 * deep-linked URLs opened in a new tab).
 */

import Link from "next/link";

/** Renders a friendly 404 message with a direct link back to the listing. */
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
