/**
 * components/atoms/TypeBadge.tsx
 *
 * Renders a pill-shaped badge for a single Pokémon type (e.g. "fire", "water").
 * Each type has its own canonical colour drawn from the official Pokémon games.
 *
 * The colour map lives at the module level so it is created once on import,
 * not on every render. All 18 battle types are covered; the transformer layer
 * normalises any unrecognised API types to "normal" before they reach here,
 * so the Record is always exhaustive.
 */

import { PokemonType } from "@/types/pokemon";
import { cn } from "@/lib/utils/cn";

/**
 * Maps every valid PokemonType to a Tailwind background + text colour pair.
 * Arbitrary hex values (e.g. bg-[#F08030]) are used because Tailwind's built-in
 * palette does not include the exact Pokémon brand colours.
 * Light-background types (electric, ice, ground, steel) use dark text for contrast.
 */
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
  /** Optional extra Tailwind classes — used on the detail page to increase badge size */
  className?: string;
}

/**
 * Renders a coloured pill badge for the given Pokémon type.
 * Accepts an optional className to allow callers to override size (e.g. the
 * detail page uses larger padding than the card grid).
 */
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
