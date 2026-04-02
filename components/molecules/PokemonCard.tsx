/**
 * components/molecules/PokemonCard.tsx
 *
 * The card tile rendered in the listing grid. Each card is a Next.js Link so
 * the entire surface area is clickable and keyboard-navigable without
 * wrapping an <a> inside a <button>.
 *
 * This is a Server Component — it receives pre-fetched data as props and
 * contains no client-side state or effects. Keeping it on the server means
 * the card's JavaScript is not included in the client bundle at all.
 *
 * Performance:
 *   - The first 4 cards on each page receive priority={true} (passed by the
 *     parent PokemonGrid) so their images are not lazy-loaded. Those cards
 *     are above the fold on most viewports and should register as the LCP
 *     element — skipping lazy-loading eliminates the decode delay.
 *   - The card uses FallbackImage rather than next/image directly so a broken
 *     sprite URL never surfaces a broken-image icon to the user.
 */

import Link from "next/link";
import { PokemonCard as PokemonCardType } from "@/types/pokemon";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { FallbackImage } from "@/components/atoms/FallbackImage";

interface PokemonCardProps {
  pokemon: PokemonCardType;
  /** Mark the image as priority (above-the-fold) for LCP optimisation */
  priority?: boolean;
}

/**
 * Renders a single Pokémon as a card tile linking to /pokemon/[id].
 * Shows the official artwork, name, type badges, and HP stat.
 * The hover state scales the image slightly for a tactile feel without
 * requiring any client-side JavaScript.
 */
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

      {/* Pokémon number — padded to 3 digits to match the games' convention */}
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

      {/* HP is the most broadly understood stat — shown as a quick reference */}
      <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
        <span className="font-semibold uppercase">HP</span>
        <span className="font-bold text-gray-800">{primaryStat.value}</span>
      </div>
    </Link>
  );
}
