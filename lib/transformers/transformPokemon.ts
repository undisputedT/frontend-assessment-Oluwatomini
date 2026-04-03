// lib/transformers/transformPokemon.ts
// Converts raw API responses into the clean shapes our UI actually uses.
// This is the only file that knows about the messy raw API format.
// Everything else in the app works with the clean versions.

import { PokeAPIPokemon } from "@/types/api";
import { PokemonCard, PokemonDetail, PokemonType } from "@/types/pokemon";
import { buildSpriteUrl } from "@/lib/utils/buildSpriteUrl";

// All 18 valid types in a Set so we can check membership in O(1).
// Created once when the module loads, not on every function call.
// The API occasionally returns "shadow" or "unknown" types — we treat those as "normal"
// so they get a neutral colour badge instead of crashing.
const VALID_TYPES = new Set<string>([
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
]);

// Returns the type string if it's a known battle type, or falls back to "normal".
function toSafeType(name: string): PokemonType {
  return VALID_TYPES.has(name) ? (name as PokemonType) : "normal";
}

// Converts a raw Pokémon response into the lean shape used by listing cards.
// We use the official-artwork image when available (better quality),
// and fall back to a constructed sprite URL if the field is null.
export function transformPokemonCard(raw: PokeAPIPokemon): PokemonCard {
  // Find HP by name rather than hardcoding [0] — the API doesn't guarantee stat order
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
    height: raw.height, // in decimetres — the detail page divides by 10 for metres
    weight: raw.weight, // in hectograms — the detail page divides by 10 for kilograms
  };
}

// Converts a raw Pokémon response into the full shape used by the detail page.
// Builds the card first (reusing the function above), then adds the extra fields.
// Moves are capped at 10 — the full list can be 100+ and we only show a sample.
export function transformPokemonDetail(raw: PokeAPIPokemon): PokemonDetail {
  const card = transformPokemonCard(raw);
  return {
    ...card,
    baseExperience: raw.base_experience,
    stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    moves: raw.moves.slice(0, 10).map((m) => m.move.name),
  };
}
