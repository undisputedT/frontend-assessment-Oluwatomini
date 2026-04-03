"use client";

// components/molecules/ViewToggle.tsx
// Two icon buttons that switch between grid and list view.
// Writes ?view=grid or ?view=list to the URL — consistent with how
// search, type, and page state are stored.

import { useSearchParams, useRouter, usePathname } from "next/navigation";

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill={active ? "#2563eb" : "#9ca3af"} />
      <rect x="11" y="1" width="6" height="6" rx="1.5" fill={active ? "#2563eb" : "#9ca3af"} />
      <rect x="1" y="11" width="6" height="6" rx="1.5" fill={active ? "#2563eb" : "#9ca3af"} />
      <rect x="11" y="11" width="6" height="6" rx="1.5" fill={active ? "#2563eb" : "#9ca3af"} />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  const c = active ? "#2563eb" : "#9ca3af";
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="4" height="4" rx="1" fill={c} />
      <rect x="7" y="3" width="10" height="2" rx="1" fill={c} />
      <rect x="1" y="8" width="4" height="4" rx="1" fill={c} />
      <rect x="7" y="9" width="10" height="2" rx="1" fill={c} />
      <rect x="1" y="14" width="4" height="4" rx="1" fill={c} />
      <rect x="7" y="15" width="10" height="2" rx="1" fill={c} />
    </svg>
  );
}

export function ViewToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const view = searchParams.get("view") ?? "grid";

  function switchView(v: "grid" | "list") {
    const params = new URLSearchParams(searchParams.toString());
    if (v === "grid") {
      params.delete("view"); // grid is the default — keep the URL clean
    } else {
      params.set("view", v);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={() => switchView("grid")}
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        className={`rounded-lg border p-2.5 transition ${
          view === "grid"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:bg-gray-50"
        }`}
      >
        <GridIcon active={view === "grid"} />
      </button>
      <button
        onClick={() => switchView("list")}
        aria-label="List view"
        aria-pressed={view === "list"}
        className={`rounded-lg border p-2.5 transition ${
          view === "list"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:bg-gray-50"
        }`}
      >
        <ListIcon active={view === "list"} />
      </button>
    </div>
  );
}
