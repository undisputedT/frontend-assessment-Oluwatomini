"use client";

// components/molecules/PaginationControls.tsx
// Previous / Next buttons shown below the Pokémon grid.
// The current page lives in the URL (?page=2) so the browser back button
// works correctly and you can share a link to any page.
// Going back to page 1 removes the param entirely for a cleaner URL.
// Returns nothing if everything fits on one page.

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PAGE_SIZE } from "@/lib/api/constants";

interface PaginationControlsProps {
  total: number; // total number of matched Pokémon (used to calculate how many pages)
}

export function PaginationControls({ total }: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page") ?? "1");
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function navigate(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page"); // page 1 is the default — no need to put it in the URL
    } else {
      params.set("page", String(newPage));
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: true });
  }

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <button
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Prev
      </button>

      <span className="text-sm text-gray-600">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next →
      </button>
    </nav>
  );
}
