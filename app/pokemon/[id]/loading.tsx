/**
 * app/pokemon/[id]/loading.tsx
 *
 * Next.js route-level loading UI for the detail page. Displayed while the
 * detail page's async Server Component is fetching Pokémon data.
 *
 * The skeleton mirrors the two-column layout of the real detail page:
 *   - A breadcrumb/back-button row
 *   - Left column: circular artwork + name + type pill badges
 *   - Right column: stats section + moves section
 *   - Full-width evolution chain section at the bottom
 *
 * animate-pulse gives a gentle breathing animation to signal loading state
 * without drawing attention away from the structural layout that tells the
 * user exactly what content is coming.
 */

/** Skeleton that mirrors the full detail page layout */
export default function Loading() {
  return (
    <>
      {/* Breadcrumb row placeholder */}
      <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />

      {/* Two-column layout */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: image card skeleton */}
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-9 w-36 animate-pulse rounded bg-gray-200" />
          {/* Circular artwork placeholder */}
          <div className="mt-4 h-56 w-56 animate-pulse rounded-full bg-gray-200" />
          {/* Type badge placeholders */}
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-16 animate-pulse rounded-full bg-gray-200" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Right: stats + moves section skeletons */}
        <div className="flex flex-col gap-6">
          <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>

      {/* Evolution chain section skeleton */}
      <div className="mt-8 h-36 animate-pulse rounded-2xl bg-gray-200" />
    </>
  );
}
