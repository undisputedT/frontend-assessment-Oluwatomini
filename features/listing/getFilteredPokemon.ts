// features/listing/getFilteredPokemon.ts
// The main data-fetching function for the listing page.
// Takes the current filter state (search term, type, page) and returns
// a page of Pokémon cards plus the total matched count.
//
// There are 4 different paths depending on which filters are active:
//
//   No filters → use the paginated /pokemon endpoint directly (fastest)
//   Type only  → fetch all Pokémon of that type, slice to the current page
//   Search only → filter the cached name list by substring, fetch matched slice
//   Search + type → run both fetches at the same time, intersect the results

import { fetchPokemonList, fetchPokemonByType, fetchPokemon } from "@/lib/api/pokeapi";
import { getAllPokemonNames } from "@/features/search/getAllPokemonNames";
import { transformPokemonCard } from "@/lib/transformers/transformPokemon";
import { extractIdFromUrl } from "@/lib/utils/extractIdFromUrl";
import { FilterState } from "@/types/search";
import { PokemonCard, PokemonPageResult } from "@/types/pokemon";
import { PAGE_SIZE } from "@/lib/api/constants";

// Fetches multiple Pokémon at once by their IDs and transforms each one into a card.
// All fetches run in parallel — .then() lets us transform each result right away
// without creating an intermediate array.
async function fetchDetailBatch(ids: number[]): Promise<PokemonCard[]> {
  return Promise.all(ids.map((id) => fetchPokemon(id).then(transformPokemonCard)));
}

export async function getFilteredPokemon(
  filter: FilterState
): Promise<PokemonPageResult> {
  const { search, type, page } = filter;
  const offset = (page - 1) * PAGE_SIZE;
  const hasSearch = search.trim().length > 0;
  const hasType = type.trim().length > 0;

  // No filters — the API handles pagination natively, so we just ask for the right page
  if (!hasSearch && !hasType) {
    const list = await fetchPokemonList(PAGE_SIZE, offset);
    const ids = list.results.map((r) => extractIdFromUrl(r.url));
    const pokemon = await fetchDetailBatch(ids);
    return { pokemon, total: list.count };
  }

  // For filtered paths, we first build a full list of matching IDs,
  // then slice it to the right page before fetching details.
  let candidateIds: number[];

  if (hasType && !hasSearch) {
    // Type filter only — fetch all Pokémon of that type and grab their IDs
    const typeData = await fetchPokemonByType(type);
    candidateIds = typeData.pokemon.map((p) => extractIdFromUrl(p.pokemon.url));

  } else if (hasSearch && !hasType) {
    // Search only — filter the cached name list by the search term
    const allNames = await getAllPokemonNames();
    const query = search.trim().toLowerCase();
    candidateIds = allNames.filter((p) => p.name.includes(query)).map((p) => p.id);

  } else {
    // Both filters — run both fetches at the same time, then keep only the overlap
    const [typeData, allNames] = await Promise.all([
      fetchPokemonByType(type),
      getAllPokemonNames(),
    ]);
    const query = search.trim().toLowerCase();
    // Put the type IDs in a Set so we can check membership in O(1) during the name filter
    const typeIds = new Set(typeData.pokemon.map((p) => extractIdFromUrl(p.pokemon.url)));
    candidateIds = allNames
      .filter((p) => p.name.includes(query) && typeIds.has(p.id))
      .map((p) => p.id);
  }

  const total = candidateIds.length;
  const pageSlice = candidateIds.slice(offset, offset + PAGE_SIZE);
  const pokemon = await fetchDetailBatch(pageSlice);

  return { pokemon, total };
}
