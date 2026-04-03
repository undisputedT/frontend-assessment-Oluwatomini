// components/organisms/PokemonGrid.tsx
// Renders the grid of Pokémon cards, or an empty state message if nothing matched.
// Uses a <ul> so screen readers automatically announce how many items are in the list.
// The first 4 cards get priority image loading since they're visible straight away.

import { PokemonCard as PokemonCardType } from "@/types/pokemon";
import { PokemonCard } from "@/components/molecules/PokemonCard";

interface PokemonGridProps {
  pokemon: PokemonCardType[];
}

// Shown when the search/filter returns no results
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl" aria-hidden="true">
        🔍
      </p>
      <h2 className="mt-4 text-xl font-bold text-gray-800">No Pokémon found</h2>
      <p className="mt-2 text-sm text-gray-500">
        Try a different name or clear the type filter.
      </p>
    </div>
  );
}

export function PokemonGrid({ pokemon }: PokemonGridProps) {
  if (pokemon.length === 0) return <EmptyState />;

  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Pokémon list"
    >
      {pokemon.map((p, i) => (
        <li key={p.id}>
          {/* First 4 are visible on load — tell the browser to load them immediately */}
          <PokemonCard pokemon={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
