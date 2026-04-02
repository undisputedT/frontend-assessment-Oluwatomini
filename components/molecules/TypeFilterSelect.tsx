/**
 * components/molecules/TypeFilterSelect.tsx
 *
 * A styled dropdown for filtering the listing by Pokémon type.
 * Selecting a type immediately pushes the new value to the URL's `type`
 * query parameter, which triggers a server re-render with the filtered data.
 *
 * Styling approach:
 * The native <select> is reset with `appearance-none` to remove the OS-rendered
 * arrow, then a custom ▾ chevron is absolutely positioned to the right. This
 * keeps the semantics of a real <select> (keyboard navigation, screen reader
 * announcements, form submission) while giving us full visual control.
 *
 * Must be a Client Component ('use client') because it reads and writes URL
 * params via useSearchParams and useRouter. It must be wrapped in a Suspense
 * boundary by its parent (FilterBar) for the same reason as SearchInput.
 */

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface TypeFilterSelectProps {
  /** The list of available type names fetched server-side in app/page.tsx */
  types: string[];
}

/**
 * Renders a styled type-filter dropdown.
 * On change, updates the `type` URL param (or removes it for "All types")
 * and resets `page` to 1 so the user always lands on the first page of
 * filtered results rather than an arbitrary page from a previous filter.
 */
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
      // Empty string means "All types" — remove the param for a clean URL
      params.delete("type");
    }
    // Reset pagination when the filter changes
    params.delete("page");
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
      {/* Custom chevron — replaces the native OS arrow removed by appearance-none */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
        ▾
      </span>
    </div>
  );
}
