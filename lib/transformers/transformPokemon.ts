/**
 * lib/transformers/transformPokemon.ts
 *
 * Transforms raw PokéAPI Pokémon responses into the domain types used
 * by the UI. This is the only place in the codebase that knows about
 * the raw API shape — everything downstream works with PokemonCard
 * or PokemonDetail.
 *
 * Keeping transformation logic here means:
 *   - Components stay clean (no inline data wrangling in JSX)
 *   - Transformations are easy to unit test with plain objects
 *   - API changes require updates in one file, not across the whole app
 */

import { PokeAPIPokemon } from "@/types/api";
import { PokemonCard, PokemonDetail, PokemonType } from "@/types/pokemon";
import { buildSpriteUrl } from "@/lib/utils/buildSpriteUrl";

/**
 * A module-level Set of all valid PokemonType values.
 * Created once when the module loads (not on every function call).
 * Used to safely cast API type name strings — the API occasionally includes
 * "shadow" or "unknown" types that have no real Pokémon or colour mapping.
 */
const VALID_TYPES = new Set<string>([
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
]);

/**
 * Converts a raw API type name string to a typed PokemonType.
 * Falls back to "normal" for any unrecognised value — this is a defensive
 * measure rather than a silent failure; "normal" will render a neutral badge
 * rather than crashing or leaving the type blank.
 */
function toSafeType(name: string): PokemonType {
  return VALID_TYPES.has(name) ? (name as PokemonType) : "normal";
}

/**
 * Transforms a raw Pokémon API response into a PokemonCard.
 * PokemonCard is the lean shape used by the listing grid — it contains
 * only what's needed to render a card without over-fetching.
 *
 * Image URL: prefers the official-artwork PNG (higher quality, transparent
 * background) and falls back to buildSpriteUrl if the artwork field is null.
 */
export function transformPokemonCard(raw: PokeAPIPokemon): PokemonCard {
  // The HP stat is always present but findIndex is safer than hardcoding [0]
  // since the API doesn't guarantee stat order.
  const hpStat = raw.stats.find((s) => s.stat.name === "hp");

  return {
    id: raw.id,
    name: raw.name,
    imageUrl:
      raw.sprites.other["official-artwork"].front_default ??
      buildSpriteUrl(raw.id),
    types: raw.types.map((t) => toSafeType(t.type.name)),
    primaryStat: {
      name: "hp",
      value: hpStat?.base_stat ?? 0,
    },
    height: raw.height, // stored in decimetres — UI divides by 10 for metres
    weight: raw.weight, // stored in hectograms — UI divides by 10 for kilograms
  };
}

/**
 * Transforms a raw Pokémon API response into the full PokemonDetail shape.
 * Builds the card first (reusing transformPokemonCard) then spreads in
 * the extra fields needed only on the detail page.
 *
 * Moves are capped at 10 — the full list can exceed 100 entries and the
 * detail page only shows a sample. Showing all would require a scrollable
 * list and clutters the UI without adding much value.
 */
export function transformPokemonDetail(raw: PokeAPIPokemon): PokemonDetail {
  const card = transformPokemonCard(raw);
  return {
    ...card,
    baseExperience: raw.base_experience,
    stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    moves: raw.moves.slice(0, 10).map((m) => m.move.name),
  };
}
