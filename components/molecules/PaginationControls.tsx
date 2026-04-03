"use client";

// components/molecules/PaginationControls.tsx
// The full pagination bar shown below the Pokémon grid.
// Left side: "Showing 1-10 from 141" + "Show: 10" dropdown
// Right side: < 1 2 3 ... 67 >

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DEFAULT_PAGE_SIZE, LIMIT_OPTIONS } from "@/lib/api/constants";

interface PaginationControlsProps {
  total: number;
}

// Builds the list of page buttons to show.
// Always shows the first and last page, and a window of pages around the current one.
// Gaps are represented by "..." strings.
function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (currentPage > 3) pages.push("...");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (currentPage < totalPages - 2) pages.push("...");

  pages.push(totalPages);
  return pages;
}

export function PaginationControls({ total }: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? DEFAULT_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  function navigatePage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: true });
  }

  function changeLimit(newLimit: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (newLimit === DEFAULT_PAGE_SIZE) {
      params.delete("limit");
    } else {
      params.set("limit", String(newLimit));
    }
    params.delete("page"); // reset to page 1 when the limit changes
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  if (total === 0) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-between">

      {/* Left side: showing range + per-page selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Showing <strong>{startItem}–{endItem}</strong> from <strong>{total}</strong>
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => changeLimit(Number(e.target.value))}
              className="appearance-none rounded-lg border border-gray-300 bg-white py-1.5 pl-3 pr-7 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Items per page"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400" aria-hidden="true">▾</span>
          </div>
        </div>
      </div>

      {/* Right side: page number navigation */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button
            onClick={() => navigatePage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            &lt;
          </button>

          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-gray-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => navigatePage(p as number)}
                aria-label={`Page ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
                className={`min-w-8 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition ${
                  p === currentPage
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => navigatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            &gt;
          </button>
        </nav>
      )}
    </div>
  );
}
