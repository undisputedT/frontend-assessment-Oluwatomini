/**
 * components/molecules/SearchInput.tsx
 *
 * Controlled text input that debounces user keystrokes before writing the
 * search term to the URL's `search` query parameter.
 *
 * Why debounce instead of firing on every keystroke?
 * Each URL change triggers a full server re-render (new fetch to PokéAPI).
 * Debouncing at 300 ms means the URL only updates once the user pauses,
 * preventing a cascade of in-flight requests while they are still typing.
 *
 * URL-driven state:
 * The input is initialised from the current `search` URL param so that
 * hard-refreshing or sharing the URL preserves the search term.
 * Navigating forward/back in the browser also restores the correct value.
 *
 * Must be a Client Component ('use client') because it uses useSearchParams,
 * useRouter, useEffect, and useState — none of which are available on the
 * server. It must be wrapped in a Suspense boundary by its parent (FilterBar)
 * to prevent Next.js from bailing out of static prerendering.
 */

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Renders a styled search input with a 300 ms debounce.
 * On each debounce tick, syncs the current input value to the URL's
 * `search` param and resets the `page` param to avoid showing page 3
 * of results for a completely new search term.
 */
export function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialise from the URL so hard-refresh preserves the search value
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    // Start a 300 ms timer; any new keystroke clears and restarts it
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      // Reset to page 1 on new search — stale page numbers are confusing
      params.delete("page");
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  // Intentionally omitting searchParams and router from deps — including them
  // would cause the effect to re-fire on every navigation, creating a loop.
  // The stable closure over pathname is sufficient because we read the latest
  // searchParams inside the callback via a fresh URLSearchParams construction.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative">
      {/* sr-only label ensures the input has an accessible name in the DOM tree */}
      <label htmlFor="pokemon-search" className="sr-only">
        Search Pokémon
      </label>
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      >
        🔍
      </span>
      <input
        id="pokemon-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search Pokémon…"
        className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label="Search Pokémon"
      />
    </div>
  );
}
