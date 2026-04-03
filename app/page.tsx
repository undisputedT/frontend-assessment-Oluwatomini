// app/page.tsx
// The main listing page. Reads the current search/filter/page from the URL,
// fetches the matching Pokémon and the type list at the same time,
// then passes everything to the display components.
//
// FilterBar is loaded lazily (next/dynamic) so its code isn't included in
// the initial HTML bundle — the grid loads faster because of this.
// In Next.js 16, searchParams is a Promise and needs to be awaited.

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getFilteredPokemon } from "@/features/listing/getFilteredPokemon";
import { fetchTypes } from "@/lib/api/pokeapi";
import { PokemonListView } from "@/components/organisms/PokemonListView";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import { DEFAULT_PAGE_SIZE, LIMIT_OPTIONS } from "@/lib/api/constants";

// Load FilterBar separately so it doesn't slow down the initial page render
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // URL params can also be string[] if the key is repeated — we only want a single string
  const search = typeof params.search === "string" ? params.search : "";
  const type = typeof params.type === "string" ? params.type : "";
  const page =
    typeof params.page === "string"
      ? Math.max(1, parseInt(params.page, 10) || 1)
      : 1;
  const rawLimit =
    typeof params.limit === "string" ? parseInt(params.limit, 10) : DEFAULT_PAGE_SIZE;
  // Only allow the values available in the dropdown — reject anything else
  const limit = LIMIT_OPTIONS.includes(rawLimit) ? rawLimit : DEFAULT_PAGE_SIZE;

  // Fetch Pokémon and the type list at the same time — they don't depend on each other
  const [{ pokemon, total }, typesData] = await Promise.all([
    getFilteredPokemon({ search, type, page, limit }),
    fetchTypes(),
  ]);

  // "unknown" and "shadow" aren't real battle types — skip them in the dropdown
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

      <PokemonListView pokemon={pokemon} />

      {/* PaginationControls reads from the URL, so it needs a Suspense boundary */}
      <Suspense fallback={null}>
        <PaginationControls total={total} />
      </Suspense>
    </>
  );
}
