// components/molecules/PokemonCard.tsx
// One card in the Pokémon grid. The whole card is a link to the detail page.
// This is a server component — no interactivity, so no JavaScript is sent to the browser for it.

import Link from "next/link";
import { PokemonCard as PokemonCardType } from "@/types/pokemon";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { FallbackImage } from "@/components/atoms/FallbackImage";

interface PokemonCardProps {
  pokemon: PokemonCardType;
  priority?: boolean; // true for the first 4 cards — loads their images earlier for faster page paint
}

export function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  const { id, name, imageUrl, types, primaryStat } = pokemon;

  return (
    <Link
      href={`/pokemon/${id}`}
      className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      aria-label={`View details for ${name}`}
    >
      <div className="relative h-28 w-28">
        <FallbackImage
          src={imageUrl}
          alt={name}
          fill
          sizes="112px"
          priority={priority}
          className="object-contain drop-shadow-md transition group-hover:scale-105"
        />
      </div>

      {/* Padded ID like #001 to match the games' numbering style */}
      <p className="mt-2 text-xs font-medium text-gray-400">
        #{String(id).padStart(3, "0")}
      </p>

      <h2 className="mt-0.5 text-base font-bold capitalize text-gray-800">
        {name}
      </h2>

      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
        <span className="font-semibold uppercase">HP</span>
        <span className="font-bold text-gray-800">{primaryStat.value}</span>
      </div>
    </Link>
  );
}
