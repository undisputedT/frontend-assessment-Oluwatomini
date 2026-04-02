/**
 * app/page.tsx
 *
 * The listing page — the application's entry point and most frequently visited
 * route. It renders the search/filter bar and the paginated Pokémon grid.
 *
 * Data fetching strategy:
 * - getFilteredPokemon and fetchTypes run in parallel (Promise.all) to
 *   minimise the total time before the page can render. Neither depends on
 *   the other's result.
 * - searchParams is a Promise in Next.js 16 App Router and must be awaited
 *   before reading individual params.
 *
 * FilterBar is loaded via next/dynamic for route-level code splitting. This
 * moves SearchInput + TypeFilterSelect + their dependencies out of the initial
 * HTML bundle into a separate chunk that is fetched after the page first paints,
 * improving TTI. The dynamic loading fallback renders skeleton bars that match
 * the exact dimensions of the inputs to prevent layout shift.
 *
 * PaginationControls is wrapped in Suspense because it uses useSearchParams.
 */

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getFilteredPokemon } from "@/features/listing/getFilteredPokemon";
import { fetchTypes } from "@/lib/api/pokeapi";
import { PokemonGrid } from "@/components/organisms/PokemonGrid";
import { PaginationControls } from "@/components/molecules/PaginationControls";

// Dynamic import splits FilterBar (+ SearchInput + TypeFilterSelect) into a
// separate JS chunk that is not included in the initial page bundle.
// The Suspense fallback renders during the hydration gap.
const FilterBar = dynamic(
  () => import("@/components/organisms/FilterBar").then((m) => ({ default: m.FilterBar })),
  {
    loading: () => (
      <div className="flex gap-3">
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-11 w-44 animate-pulse rounded-xl bg-gray-200" />
      </div>
    ),
  }
);

interface PageProps {
  /** In Next.js 16 App Router, searchParams is a Promise — it must be awaited */
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Server Component that orchestrates data fetching for the listing page.
 * Reads URL params, fetches data in parallel, filters out non-battle types,
 * and passes the results down to purely presentational components.
 */
export default async function HomePage({ searchParams }: PageProps) {
  // Await the Promise before reading individual params (Next.js 16 requirement)
  const params = await searchParams;

  // Coerce params to strings — URL params can also be string[] for repeated keys
  const search = typeof params.search === "string" ? params.search : "";
  const type = typeof params.type === "string" ? params.type : "";
  const page =
    typeof params.page === "string"
      ? Math.max(1, parseInt(params.page, 10) || 1)
      : 1;

  // Run both fetches concurrently — they are independent of each other
  const [{ pokemon, total }, typesData] = await Promise.all([
    getFilteredPokemon({ search, type, page }),
    fetchTypes(),
  ]);

  // Exclude "unknown" and "shadow" — not real battle types, have no colour mapping
  const types = typesData.results
    .map((t) => t.name)
    .filter((n) => !["unknown", "shadow"].includes(n));

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Pokémon</h1>
        <p className="mt-1 text-sm text-gray-500">{total} Pokémon found</p>
      </div>

      <div className="mb-6">
        <Suspense
          fallback={
            <div className="flex gap-3">
              <div className="h-11 flex-1 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-11 w-44 animate-pulse rounded-xl bg-gray-200" />
            </div>
          }
        >
          <FilterBar types={types} />
        </Suspense>
      </div>

      <PokemonGrid pokemon={pokemon} />

      {/* PaginationControls uses useSearchParams — must be inside Suspense */}
      <Suspense fallback={null}>
        <PaginationControls total={total} />
      </Suspense>
    </>
  );
}
