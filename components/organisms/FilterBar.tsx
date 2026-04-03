"use client";

// components/organisms/FilterBar.tsx
// Puts the search input and type dropdown side by side.
// Both of those components read from the URL, which requires them to be inside
// a Suspense boundary — otherwise Next.js throws a build error.
// Each gets its own Suspense so they can load independently.
// The fallbacks are grey bars that match the exact size of the real inputs
// to avoid layout jumping during load.

import { Suspense } from "react";
import { SearchInput } from "@/components/molecules/SearchInput";
import { TypeFilterSelect } from "@/components/molecules/TypeFilterSelect";

interface FilterBarProps {
  types: string[];
}

export function FilterBar({ types }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <Suspense fallback={<div className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="sm:w-44">
        <Suspense fallback={<div className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />}>
          <TypeFilterSelect types={types} />
        </Suspense>
      </div>
    </div>
  );
}
