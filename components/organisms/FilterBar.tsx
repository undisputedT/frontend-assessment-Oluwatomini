"use client";

// components/organisms/FilterBar.tsx
// Search input, type dropdown, and grid/list toggle — all in one row.
// Each component that reads from the URL needs its own Suspense boundary.

import { Suspense } from "react";
import { SearchInput } from "@/components/molecules/SearchInput";
import { TypeFilterSelect } from "@/components/molecules/TypeFilterSelect";
import { ViewToggle } from "@/components/molecules/ViewToggle";

interface FilterBarProps {
  types: string[];
}

export function FilterBar({ types }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Suspense fallback={<div className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <div className="flex-1 sm:w-44 sm:flex-none">
          <Suspense fallback={<div className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />}>
            <TypeFilterSelect types={types} />
          </Suspense>
        </div>
        <Suspense fallback={<div className="h-11 w-20 shrink-0 rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />}>
          <ViewToggle />
        </Suspense>
      </div>
    </div>
  );
}
