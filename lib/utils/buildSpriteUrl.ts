// lib/utils/buildSpriteUrl.ts
// Builds the image URL for a Pokémon using just its ID.
// PokéAPI hosts all artwork on GitHub in a predictable pattern,
// so we can construct the URL without making an extra API call.
// Used as a fallback when the API response has a null image field,
// and also to get images for evolution chain steps.

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

/** Returns the official artwork image URL for a given Pokémon ID. */
export function buildSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}
