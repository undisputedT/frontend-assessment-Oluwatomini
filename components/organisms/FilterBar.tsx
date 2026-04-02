/**
 * components/organisms/FilterBar.tsx
 *
 * Composes the SearchInput and TypeFilterSelect into a single filter row.
 * Both child components use useSearchParams, which requires each to be inside
 * its own Suspense boundary — Next.js bails out of static prerendering if a
 * component calls useSearchParams outside of Suspense at build time.
 *
 * Each child gets an individual Suspense boundary (rather than one shared one)
 * so that the search input can hydrate independently of the type select.
 * The fallbacks are skeleton bars that match the exact dimensions of each
 * input, preventing layout shift during the hydration gap.
 *
 * FilterBar itself is a Client Component ('use client') only because it
 * imports Client Components — it contains no state or effects of its own.
 * app/page.tsx loads it via next/dynamic so that the entire FilterBar chunk
 * is excluded from the initial server-rendered HTML bundle.
 */

"use client";

import { Suspense } from "react";
import { SearchInput } from "@/components/molecules/SearchInput";
import { TypeFilterSelect } from "@/components/molecules/TypeFilterSelect";

interface FilterBarProps {
  /** Available type names fetched in app/page.tsx and passed down as props */
  types: string[];
}

/**
 * Renders the search input and type filter side by side (stacked on mobile).
 * Each interactive child is wrapped in its own Suspense boundary with a
 * size-matched skeleton fallback to prevent layout shift during hydration.
 */
export function FilterBar({ types }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        {/* Suspense required: SearchInput calls useSearchParams */}
        <Suspense fallback={<div className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="sm:w-44">
        {/* Suspense required: TypeFilterSelect calls useSearchParams */}
        <Suspense fallback={<div className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />}>
          <TypeFilterSelect types={types} />
        </Suspense>
      </div>
    </div>
  );
}
