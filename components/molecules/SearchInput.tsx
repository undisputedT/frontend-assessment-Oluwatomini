"use client";

// components/molecules/SearchInput.tsx
// The search box in the filter bar.
// As the user types, we wait 300ms before updating the URL — this prevents
// firing a new server request on every single keystroke.
// The search term lives in the URL so it survives page refresh and can be shared.

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Start with whatever is already in the URL so hard-refresh preserves the value
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    // Wait 300ms after the user stops typing before updating the URL
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      // Reset to page 1 so a new search always starts from the beginning
      params.delete("page");
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  // We only want this to run when the input value changes.
  // Including searchParams/router would cause it to re-fire on every navigation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative">
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
