// lib/api/pokeapi.ts
// All API calls to PokéAPI go through this file — nothing else in the app calls fetch() directly.
// This keeps caching and error handling in one place.

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

// Internal helper used by all the functions below.
// Makes the fetch call and throws an error if the response wasn't successful.
// The generic <T> tells TypeScript what shape to expect back from the JSON.
async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`PokéAPI request failed: ${res.status} ${url}`);
  }
  return res.json() as Promise<T>;
}

// Fetches one page of Pokémon from the list endpoint.
// Only returns name + URL per item — we fetch full details separately.
// Cached for 1 hour.
export function fetchPokemonList(
  limit: number,
  offset: number
): Promise<PokeAPIList> {
  return apiFetch<PokeAPIList>(
    `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    { next: { revalidate: REVALIDATE_LISTING } }
  );
}

// Fetches all ~1,350 Pokémon names at once.
// Used to power the search — we filter this list by name, then only fetch
// full details for the ones that matched.
// force-cache means it's fetched once per deployment and never re-fetched.
export function fetchAllPokemonNames(): Promise<PokeAPIList> {
  return apiFetch<PokeAPIList>(`${POKEAPI_BASE}/pokemon?limit=1350`, {
    cache: "force-cache",
  });
}

// Fetches the full detail object for a single Pokémon by ID or name.
// Called for every card on the listing page (20 at a time) and on the detail page.
// Next.js automatically deduplicates identical calls within the same page render,
// so fetching the same Pokémon twice only hits the network once.
// Cached for 24 hours.
export function fetchPokemon(idOrName: string | number): Promise<PokeAPIPokemon> {
  return apiFetch<PokeAPIPokemon>(`${POKEAPI_BASE}/pokemon/${idOrName}`, {
    next: { revalidate: REVALIDATE_DETAIL },
  });
}

// Fetches the list of all Pokémon types (fire, water, etc.).
// Used to populate the type filter dropdown.
// Cached for 24 hours — there are only 21 types and they rarely change.
export function fetchTypes(): Promise<PokeAPIList> {
  return apiFetch<PokeAPIList>(`${POKEAPI_BASE}/type`, {
    next: { revalidate: REVALIDATE_TYPE },
  });
}

// Fetches every Pokémon that belongs to a given type.
// The API doesn't support pagination here, so we get the full list (up to ~160)
// and do the slicing ourselves.
// Cached for 1 hour.
export function fetchPokemonByType(typeName: string): Promise<PokeAPITypeDetail> {
  return apiFetch<PokeAPITypeDetail>(`${POKEAPI_BASE}/type/${typeName}`, {
    next: { revalidate: REVALIDATE_LISTING },
  });
}

// Fetches species data for a Pokémon.
// We need this because the evolution chain URL lives here — there's no direct
// link to it from the main Pokémon endpoint.
// Cached for 24 hours.
export function fetchSpecies(id: number): Promise<PokeAPISpecies> {
  return apiFetch<PokeAPISpecies>(`${POKEAPI_BASE}/pokemon-species/${id}`, {
    next: { revalidate: REVALIDATE_DETAIL },
  });
}

// Fetches an evolution chain using the full URL from fetchSpecies.
// We pass the full URL because the chain ID can't be derived from the Pokémon ID.
// Cached for 24 hours.
export function fetchEvolutionChain(url: string): Promise<PokeAPIEvolutionChain> {
  return apiFetch<PokeAPIEvolutionChain>(url, {
    next: { revalidate: REVALIDATE_DETAIL },
  });
}
