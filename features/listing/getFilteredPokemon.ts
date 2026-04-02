/**
 * features/listing/getFilteredPokemon.ts
 *
 * The main server-side data orchestrator for the listing page.
 * It receives the parsed URL filter state and returns a page of Pokémon cards.
 *
 * Four execution branches, chosen based on which filters are active:
 *
 *   Branch D (no filters)
 *     Uses the efficient paginated /pokemon endpoint. Sends only 1 request
 *     to get the current page's 20 items, then fetches their details in parallel.
 *
 *   Branch A (type filter only)
 *     Fetches all members of the selected type (up to ~160 entries), then slices
 *     to the current page and detail-fetches those 20. Pagination is done here
 *     because the type endpoint doesn't support server-side pagination.
 *
 *   Branch B (search only)
 *     Loads the force-cached all-names list (~1,350 names), filters by substring,
 *     then detail-fetches the matched page slice. The name list costs nothing
 *     after the first request since it's permanently cached.
 *
 *   Branch C (search + type)
 *     Runs type fetch and names fetch in parallel (Promise.all), intersects
 *     the results, then detail-fetches the matched page slice.
 *
 * All individual Pokémon detail fetches are parallelised with Promise.all.
 * Next.js deduplicates identical fetch calls within a single render pass,
 * so visiting the same Pokémon's card across pages costs only one network request.
 */

import { fetchPokemonList, fetchPokemonByType, fetchPokemon } from "@/lib/api/pokeapi";
import { getAllPokemonNames } from "@/features/search/getAllPokemonNames";
import { transformPokemonCard } from "@/lib/transformers/transformPokemon";
import { extractIdFromUrl } from "@/lib/utils/extractIdFromUrl";
import { FilterState } from "@/types/search";
import { PokemonCard, PokemonPageResult } from "@/types/pokemon";
import { PAGE_SIZE } from "@/lib/api/constants";

/**
 * Fetches and transforms a batch of Pokémon detail objects in parallel.
 * Using .then() chaining avoids creating an intermediate array — fetch and
 * transform happen in one pipeline per item.
 */
async function fetchDetailBatch(ids: number[]): Promise<PokemonCard[]> {
  return Promise.all(ids.map((id) => fetchPokemon(id).then(transformPokemonCard)));
}

/**
 * Resolves the correct data branch based on the active filters and
 * returns the Pokémon cards for the requested page along with the total
 * matched count (needed by PaginationControls).
 */
export async function getFilteredPokemon(
  filter: FilterState
): Promise<PokemonPageResult> {
  const { search, type, page } = filter;
  const offset = (page - 1) * PAGE_SIZE;
  const hasSearch = search.trim().length > 0;
  const hasType = type.trim().length > 0;

  // Branch D — most common case; the API handles pagination natively
  if (!hasSearch && !hasType) {
    const list = await fetchPokemonList(PAGE_SIZE, offset);
    const ids = list.results.map((r) => extractIdFromUrl(r.url));
    const pokemon = await fetchDetailBatch(ids);
    return { pokemon, total: list.count };
  }

  // For filtered branches, we first build a complete list of matching IDs,
  // then slice it to the current page before fetching details.
  let candidateIds: number[];

  if (hasType && !hasSearch) {
    // Branch A — fetch all Pokémon of the given type, extract their IDs
    const typeData = await fetchPokemonByType(type);
    candidateIds = typeData.pokemon.map((p) => extractIdFromUrl(p.pokemon.url));

  } else if (hasSearch && !hasType) {
    // Branch B — filter the cached name list by substring
    const allNames = await getAllPokemonNames();
    const query = search.trim().toLowerCase();
    candidateIds = allNames.filter((p) => p.name.includes(query)).map((p) => p.id);

  } else {
    // Branch C — run both fetches concurrently, then intersect the results
    const [typeData, allNames] = await Promise.all([
      fetchPokemonByType(type),
      getAllPokemonNames(),
    ]);
    const query = search.trim().toLowerCase();
    // Build a Set of type IDs for O(1) lookup during the name filter
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
