/**
 * lib/api/pokeapi.ts
 *
 * All network calls to the PokéAPI live here — nowhere else in the codebase
 * calls fetch() directly. This single entry point means:
 *   - Cache strategies are visible in one file
 *   - Error handling is consistent
 *   - Swapping the data source only requires changes here
 *
 * Each exported function sets its own Next.js cache option based on
 * how frequently that data actually changes in the real world.
 */

import {
  PokeAPIList,
  PokeAPIPokemon,
  PokeAPITypeDetail,
  PokeAPISpecies,
  PokeAPIEvolutionChain,
} from "@/types/api";
import {
  POKEAPI_BASE,
  REVALIDATE_DETAIL,
  REVALIDATE_LISTING,
  REVALIDATE_TYPE,
} from "./constants";

/**
 * Internal fetch wrapper that adds consistent error handling.
 * The generic type parameter T tells TypeScript what shape to expect
 * from the JSON response — callers get a fully-typed return value.
 *
 * Throws if the HTTP status is not 2xx (e.g. 404, 500).
 */
async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`PokéAPI request failed: ${res.status} ${url}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetches one page of Pokémon from the paginated list endpoint.
 * Returns only name + URL per item — detail data requires individual fetches.
 *
 * Cache: revalidate every hour. New Pokémon are released infrequently;
 * a 1-hour stale window is acceptable and avoids hammering the API.
 */
export function fetchPokemonList(
  limit: number,
  offset: number
): Promise<PokeAPIList> {
  return apiFetch<PokeAPIList>(
    `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    { next: { revalidate: REVALIDATE_LISTING } }
  );
}

/**
 * Fetches all ~1,350 Pokémon names in a single request.
 * Used server-side to power the name search filter.
 *
 * Cache: force-cache (permanent until next build).
 * The names list only changes when a new game adds new Pokémon, which
 * coincides with a new deployment. Fetching once per build saves ~96 KB
 * of repeated network traffic.
 */
export function fetchAllPokemonNames(): Promise<PokeAPIList> {
  return apiFetch<PokeAPIList>(`${POKEAPI_BASE}/pokemon?limit=1350`, {
    cache: "force-cache",
  });
}

/**
 * Fetches the full detail object for a single Pokémon by ID or name.
 * This is called for every card on the listing page (20 in parallel per page)
 * and for the detail page.
 *
 * Cache: revalidate every 24 hours. Individual Pokémon data is immutable
 * in practice — base stats and sprites don't change between games.
 * Next.js also deduplicates concurrent identical fetch calls within a
 * single render pass, so parallel calls to the same ID cost only one request.
 */
export function fetchPokemon(idOrName: string | number): Promise<PokeAPIPokemon> {
  return apiFetch<PokeAPIPokemon>(`${POKEAPI_BASE}/pokemon/${idOrName}`, {
    next: { revalidate: REVALIDATE_DETAIL },
  });
}

/**
 * Fetches the list of all Pokémon types (fire, water, grass, etc.).
 * Used to populate the type filter dropdown.
 *
 * Cache: revalidate every 24 hours. There are 21 types and they have
 * been stable across multiple game generations.
 */
export function fetchTypes(): Promise<PokeAPIList> {
  return apiFetch<PokeAPIList>(`${POKEAPI_BASE}/type`, {
    next: { revalidate: REVALIDATE_TYPE },
  });
}

/**
 * Fetches all Pokémon belonging to a given type.
 * The response contains up to ~160 entries (water has the most).
 * We paginate client-side after fetching the full list since the API
 * doesn't support paginated type queries.
 *
 * Cache: revalidate every hour. Type memberships change occasionally
 * when new Pokémon are added in game updates.
 */
export function fetchPokemonByType(typeName: string): Promise<PokeAPITypeDetail> {
  return apiFetch<PokeAPITypeDetail>(`${POKEAPI_BASE}/type/${typeName}`, {
    next: { revalidate: REVALIDATE_LISTING },
  });
}

/**
 * Fetches species data for a Pokémon.
 * The species endpoint is a stepping stone — it contains the URL to the
 * evolution chain, which is on a completely separate endpoint.
 *
 * Cache: revalidate every 24 hours. Species data is immutable.
 */
export function fetchSpecies(id: number): Promise<PokeAPISpecies> {
  return apiFetch<PokeAPISpecies>(`${POKEAPI_BASE}/pokemon-species/${id}`, {
    next: { revalidate: REVALIDATE_DETAIL },
  });
}

/**
 * Fetches an evolution chain by its full URL (obtained from fetchSpecies).
 * The URL is used directly because the chain ID isn't derivable from the
 * Pokémon ID — every species must be looked up individually.
 *
 * Cache: revalidate every 24 hours. Evolution chains are fixed per species.
 */
export function fetchEvolutionChain(url: string): Promise<PokeAPIEvolutionChain> {
  return apiFetch<PokeAPIEvolutionChain>(url, {
    next: { revalidate: REVALIDATE_DETAIL },
  });
}
