/**
 * components/organisms/PokemonGrid.tsx
 *
 * The main content area of the listing page. Renders the Pokémon as a
 * responsive CSS grid or, when the filtered result set is empty, an
 * inline empty-state message.
 *
 * The grid uses a <ul> (unordered list) of <li> items rather than a plain
 * <div> grid. This is semantically correct — the cards are a list of items —
 * and gives screen readers the item count automatically ("list, 20 items").
 *
 * LCP optimisation: the first 4 cards receive priority={true} which instructs
 * next/image to preload those images. On a standard desktop viewport the first
 * row holds 4 cards, so they are the likely Largest Contentful Paint candidates.
 *
 * EmptyState is co-located here because it is only ever used in this context.
 * Exporting it separately would expose an internal detail without adding value.
 */

import { PokemonCard as PokemonCardType } from "@/types/pokemon";
import { PokemonCard } from "@/components/molecules/PokemonCard";

interface PokemonGridProps {
  pokemon: PokemonCardType[];
}

/**
 * Renders a centred empty-state message when no Pokémon match the current filter.
 * Prompts the user with actionable suggestions rather than just "no results".
 */
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

/**
 * Renders all matched Pokémon as a responsive grid.
 * Falls back to EmptyState when the array is empty.
 * The first 4 cards are marked priority for LCP optimisation.
 */
export function PokemonGrid({ pokemon }: PokemonGridProps) {
  if (pokemon.length === 0) return <EmptyState />;

  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Pokémon list"
    >
      {pokemon.map((p, i) => (
        <li key={p.id}>
          {/* First 4 cards are above-the-fold on most viewports — mark as priority for LCP */}
          <PokemonCard pokemon={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
