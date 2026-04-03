// features/search/getAllPokemonNames.ts
// Returns the full list of all Pokémon names and IDs for the search feature.
//
// PokéAPI has no search endpoint — to search by name we have to download
// the full name list and filter it ourselves on the server.
// This keeps the ~96 KB list out of the browser completely.
//
// The underlying fetch uses force-cache, so it's only downloaded once
// per deployment. After that, repeated calls are free.

import { fetchAllPokemonNames } from "@/lib/api/pokeapi";
import { extractIdFromUrl } from "@/lib/utils/extractIdFromUrl";
import { PokemonListItem } from "@/types/pokemon";

/** Returns all Pokémon as a flat array of { name, id }. */
export async function getAllPokemonNames(): Promise<PokemonListItem[]> {
  const data = await fetchAllPokemonNames();
  return data.results.map((r) => ({
    name: r.name,
    id: extractIdFromUrl(r.url),
  }));
}
