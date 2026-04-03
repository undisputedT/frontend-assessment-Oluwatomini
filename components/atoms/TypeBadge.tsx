// components/atoms/TypeBadge.tsx
// A small coloured pill that shows a Pokémon type like "fire" or "water".
// Each type has its own colour based on the official Pokémon games.

import { PokemonType } from "@/types/pokemon";
import { cn } from "@/lib/utils/cn";

// Colour map for every type.
// We use arbitrary hex values (e.g. bg-[#F08030]) because Tailwind's built-in
// colour palette doesn't include the exact Pokémon brand colours.
// Types with a light background use dark text so the label stays readable.
const TYPE_COLORS: Record<PokemonType, string> = {
  normal:   "bg-[#A8A878] text-white",
  fire:     "bg-[#F08030] text-white",
  water:    "bg-[#6890F0] text-white",
  electric: "bg-[#F8D030] text-gray-800",
  grass:    "bg-[#78C850] text-white",
  ice:      "bg-[#98D8D8] text-gray-800",
  fighting: "bg-[#C03028] text-white",
  poison:   "bg-[#A040A0] text-white",
  ground:   "bg-[#E0C068] text-gray-800",
  flying:   "bg-[#A890F0] text-white",
  psychic:  "bg-[#F85888] text-white",
  bug:      "bg-[#A8B820] text-white",
  rock:     "bg-[#B8A038] text-white",
  ghost:    "bg-[#705898] text-white",
  dragon:   "bg-[#7038F8] text-white",
  dark:     "bg-[#705848] text-white",
  steel:    "bg-[#B8B8D0] text-gray-800",
  fairy:    "bg-[#EE99AC] text-white",
};

interface TypeBadgeProps {
  type: PokemonType;
  className?: string; // lets callers override size — e.g. larger badges on the detail page
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        TYPE_COLORS[type],
        className
      )}
    >
      {type}
    </span>
  );
}
