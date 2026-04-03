"use client";

// components/organisms/PokemonListView.tsx
// Wraps the Pokémon listing with a grid/list view toggle.
// The user's preference is saved to localStorage so it persists between visits.

import { useState, useEffect } from "react";
import { PokemonCard as PokemonCardType } from "@/types/pokemon";
import { PokemonCard } from "@/components/molecules/PokemonCard";
import { PokemonListCard } from "@/components/molecules/PokemonListCard";

type View = "grid" | "list";

interface PokemonListViewProps {
  pokemon: PokemonCardType[];
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl" aria-hidden="true">🔍</p>
      <h2 className="mt-4 text-xl font-bold text-gray-800">No Pokémon found</h2>
      <p className="mt-2 text-sm text-gray-500">Try a different name or clear the type filter.</p>
    </div>
  );
}

// Grid icon SVG
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

// List icon SVG
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

export function PokemonListView({ pokemon }: PokemonListViewProps) {
  const [view, setView] = useState<View>("grid");

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("pokemon-view") as View | null;
    if (saved === "grid" || saved === "list") setView(saved);
  }, []);

  function switchView(v: View) {
    setView(v);
    localStorage.setItem("pokemon-view", v);
  }

  if (pokemon.length === 0) return <EmptyState />;

  return (
    <div>
      {/* Toggle buttons — top-right above the listing */}
      <div className="mb-4 flex justify-end gap-1">
        <button
          onClick={() => switchView("grid")}
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          className={`rounded-lg border p-2 transition ${
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
          className={`rounded-lg border p-2 transition ${
            view === "list"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:bg-gray-50"
          }`}
        >
          <ListIcon active={view === "list"} />
        </button>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <ul
          className="grid grid-cols-2 gap-4 max-[320px]:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Pokémon list"
        >
          {pokemon.map((p, i) => (
            <li key={p.id}>
              <PokemonCard pokemon={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}

      {/* List view */}
      {view === "list" && (
        <ul className="flex flex-col gap-2" aria-label="Pokémon list">
          {pokemon.map((p, i) => (
            <li key={p.id}>
              <PokemonListCard pokemon={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
