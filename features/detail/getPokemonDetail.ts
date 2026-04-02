/**
 * features/detail/getPokemonDetail.ts
 *
 * Thin data-fetching wrapper for the Pokémon detail page.
 * Fetches a single Pokémon by numeric ID and returns the full PokemonDetail
 * shape (which extends PokemonCard with stats, moves, and baseExperience).
 *
 * Keeping this as a named function rather than inlining the fetch in the
 * page component makes it easier to test in isolation and to swap the
 * data source if the API shape ever changes.
 */

import { fetchPokemon } from "@/lib/api/pokeapi";
import { transformPokemonDetail } from "@/lib/transformers/transformPokemon";
import { PokemonDetail } from "@/types/pokemon";

/**
 * Fetches the full Pokémon record for the given numeric ID and returns the
 * transformed PokemonDetail object used by the detail page.
 * Throws if the fetch fails (e.g. 404), so callers can handle it via
 * Next.js notFound() or an error boundary.
 */
export async function getPokemonDetail(id: number): Promise<PokemonDetail> {
  const raw = await fetchPokemon(id);
  return transformPokemonDetail(raw);
}
