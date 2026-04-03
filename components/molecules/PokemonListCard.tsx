// components/molecules/PokemonListCard.tsx
// The horizontal list-row variant of a Pokémon card.
// Used when the user switches to list view on the listing page.
// Same data as PokemonCard, just laid out side by side instead of stacked.

import Link from "next/link";
import { PokemonCard as PokemonCardType } from "@/types/pokemon";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { FallbackImage } from "@/components/atoms/FallbackImage";

interface PokemonListCardProps {
  pokemon: PokemonCardType;
  priority?: boolean;
}

export function PokemonListCard({ pokemon, priority = false }: PokemonListCardProps) {
  const { id, name, imageUrl, types, primaryStat } = pokemon;

  return (
    <Link
      href={`/pokemon/${id}`}
      className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      aria-label={`View details for ${name}`}
    >
      {/* Small sprite */}
      <div className="relative h-14 w-14 shrink-0">
        <FallbackImage
          src={imageUrl}
          alt={name}
          fill
          sizes="56px"
          priority={priority}
          className="object-contain drop-shadow transition group-hover:scale-105"
        />
      </div>

      {/* ID + name */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400">#{String(id).padStart(3, "0")}</p>
        <h2 className="truncate text-sm font-bold capitalize text-gray-800">{name}</h2>
      </div>

      {/* Type badges */}
      <div className="hidden flex-wrap justify-end gap-1 sm:flex">
        {types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>

      {/* HP stat */}
      <div className="shrink-0 text-right">
        <p className="text-xs font-semibold uppercase text-gray-400">HP</p>
        <p className="text-sm font-bold text-gray-800">{primaryStat.value}</p>
      </div>
    </Link>
  );
}
