/**
 * app/loading.tsx
 *
 * Next.js route-level loading UI for the listing page.
 * This file is automatically used as the Suspense fallback while the listing
 * page's async Server Component (app/page.tsx) is streaming its data.
 *
 * The skeleton mirrors the exact layout of the real page:
 *   - A title bar and count line
 *   - Two filter inputs (search + type select) side by side
 *   - A 4-column card grid with 20 skeleton cards
 *
 * Each skeleton element uses Tailwind's animate-pulse (opacity pulsing) to
 * give the user a clear "loading" signal without a disruptive spinner.
 * Using skeleton shapes rather than a bare spinner prevents layout shift
 * when real content arrives — the page structure is already in place.
 */

/** Skeleton for a single Pokémon card — matches PokemonCard layout */
function CardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4">
      {/* Circular artwork placeholder */}
      <div className="h-28 w-28 animate-pulse rounded-full bg-gray-200" />
      {/* ID number line */}
      <div className="mt-2 h-3 w-10 animate-pulse rounded bg-gray-200" />
      {/* Pokémon name */}
      <div className="mt-1 h-5 w-24 animate-pulse rounded bg-gray-200" />
      {/* Two type badge pills */}
      <div className="mt-2 flex gap-1">
        <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

/**
 * Full-page listing skeleton rendered while the server fetches Pokémon data.
 * Renders 20 card skeletons to match the PAGE_SIZE constant.
 */
export default function Loading() {
  return (
    <>
      {/* Page title and count placeholder */}
      <div className="mb-6">
        <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      {/* Filter bar placeholder */}
      <div className="mb-6 flex gap-3">
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-11 w-44 animate-pulse rounded-xl bg-gray-200" />
      </div>
      {/* Card grid — 20 items to match PAGE_SIZE */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <li key={i}>
            <CardSkeleton />
          </li>
        ))}
      </ul>
    </>
  );
}
