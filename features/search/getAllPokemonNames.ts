/**
 * features/search/getAllPokemonNames.ts
 *
 * Provides the complete list of Pokémon names and IDs for server-side
 * name search. This is the foundation of the search feature.
 *
 * Why server-side search?
 * PokéAPI has no text search endpoint. The only way to search by name is
 * to have the full list and filter it ourselves. Doing this on the server
 * keeps the ~96 KB name list out of the browser bundle entirely.
 */

import { fetchAllPokemonNames } from "@/lib/api/pokeapi";
import { extractIdFromUrl } from "@/lib/utils/extractIdFromUrl";
import { PokemonListItem } from "@/types/pokemon";

/**
 * Returns all Pokémon as a flat array of { name, id } objects.
 *
 * The underlying fetch uses `cache: "force-cache"`, so the API call is made
 * only once per build. Subsequent calls during the same deployment are served
 * from Next.js's fetch cache in memory — zero network cost.
 *
 * Callers (getFilteredPokemon) then filter this list by substring and fetch
 * full detail only for the matched page slice — not all 1,350.
 */
export async function getAllPokemonNames(): Promise<PokemonListItem[]> {
  const data = await fetchAllPokemonNames();
  return data.results.map((r) => ({
    name: r.name,
    id: extractIdFromUrl(r.url),
  }));
}
