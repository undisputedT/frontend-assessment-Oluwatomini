"use client";

// components/molecules/TypeFilterSelect.tsx
// The type filter dropdown in the filter bar.
// Selecting a type immediately updates the URL and triggers a new filtered fetch.
//
// We use a real <select> element for accessibility (keyboard navigation, screen readers)
// but hide the native OS arrow with appearance-none and add our own ▾ icon instead.

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface TypeFilterSelectProps {
  types: string[]; // the list of available types, fetched server-side in app/page.tsx
}

export function TypeFilterSelect({ types }: TypeFilterSelectProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentType = searchParams.get("type") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("type", e.target.value);
    } else {
      params.delete("type"); // "All types" selected — remove the param for a clean URL
    }
    params.delete("page"); // reset to page 1 when the filter changes
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  return (
    <div className="relative">
      <label htmlFor="type-filter" className="sr-only">
        Filter by type
      </label>
      <select
        id="type-filter"
        value={currentType}
        onChange={handleChange}
        className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm capitalize focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label="Filter by Pokémon type"
      >
        <option value="">All types</option>
        {types.map((t) => (
          <option key={t} value={t} className="capitalize">
            {t}
          </option>
        ))}
      </select>
      {/* Custom arrow — appearance-none removes the native OS dropdown arrow */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
        ▾
      </span>
    </div>
  );
}
