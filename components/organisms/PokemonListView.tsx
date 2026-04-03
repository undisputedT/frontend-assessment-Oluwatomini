// components/organisms/PokemonListView.tsx
// Renders the Pokémon listing in either grid or list layout.
// The active view comes from the URL (?view=list) and is read server-side,
// so this is a plain server component with no client state.

import { PokemonCard as PokemonCardType } from "@/types/pokemon";
import { PokemonCard } from "@/components/molecules/PokemonCard";
import { PokemonListCard } from "@/components/molecules/PokemonListCard";

interface PokemonListViewProps {
  pokemon: PokemonCardType[];
  view: "grid" | "list";
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

export function PokemonListView({ pokemon, view }: PokemonListViewProps) {
  if (pokemon.length === 0) return <EmptyState />;

  if (view === "list") {
    return (
      <ul className="flex flex-col gap-2" aria-label="Pokémon list">
        {pokemon.map((p, i) => (
          <li key={p.id}>
            <PokemonListCard pokemon={p} priority={i < 4} />
          </li>
        ))}
      </ul>
    );
  }

  return (
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
  );
}
