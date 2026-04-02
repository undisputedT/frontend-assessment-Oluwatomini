/**
 * components/molecules/PaginationControls.tsx
 *
 * Previous / Next pagination bar rendered below the Pokémon grid.
 * Page state is stored in the URL (`?page=2`) rather than component state
 * so that the browser back button works correctly and URLs are shareable.
 *
 * URL hygiene: navigating to page 1 deletes the `page` param entirely
 * (producing `/?search=pika` instead of `/?search=pika&page=1`) so that the
 * canonical first page always has the cleanest possible URL.
 *
 * The component returns null when there is only one page, avoiding an
 * empty navigation element in the DOM.
 *
 * Must be a Client Component ('use client') because it reads the current page
 * from useSearchParams and pushes new URLs via useRouter.
 */

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PAGE_SIZE } from "@/lib/api/constants";

interface PaginationControlsProps {
  /** The total number of Pokémon matched by the current filter */
  total: number;
}

/**
 * Renders Prev / Next buttons and the current page indicator.
 * Returns null when the total fits on a single page — no point showing
 * pagination UI when there is nothing to paginate.
 */
export function PaginationControls({ total }: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page") ?? "1");
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  /**
   * Pushes a new URL for the given page number.
   * Page 1 omits the param; all other pages set it explicitly.
   * scroll:true scrolls the user back to the top of the listing on navigation.
   */
  function navigate(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
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
