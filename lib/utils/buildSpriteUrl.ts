/**
 * lib/utils/buildSpriteUrl.ts
 *
 * Constructs the official-artwork sprite URL for a given Pokémon ID.
 *
 * PokéAPI's sprite URLs follow a predictable pattern, so we can build
 * them from just the ID without an extra network request. This is used
 * as a fallback when the official-artwork field in the API response is null,
 * and also to generate URLs for evolution chain steps before fetching detail data.
 */

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

/**
 * Returns the official high-resolution artwork URL for a Pokémon.
 * These images are hosted on GitHub and are stable across API versions.
 *
 * @example buildSpriteUrl(1) → "https://raw.githubusercontent.com/.../1.png"
 */
export function buildSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}
