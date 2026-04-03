// types/api.ts
// These are the raw shapes that come back from the PokéAPI.
// We keep them here in one place so if the API ever changes, we only need to update this file.

/** A simple { name, url } pair — the API uses this to reference other resources. */
export interface PokeAPINamedResource {
  name: string;
  url: string;
}

/** The wrapper the API puts around any paginated list of items. */
export interface PokeAPIList {
  count: number;           // total number of items across all pages
  next: string | null;     // URL to fetch the next page (null if on the last page)
  previous: string | null; // URL to fetch the previous page (null if on the first page)
  results: PokeAPINamedResource[];
}

/** One type entry on a Pokémon — slot 1 is the primary type, slot 2 is secondary. */
export interface PokeAPITypeSlot {
  slot: number;
  type: PokeAPINamedResource;
}

/** One base stat, like hp: 45 or attack: 52. */
export interface PokeAPIStat {
  base_stat: number;
  effort: number; // EV yield — we don't use this but it comes in the response
  stat: PokeAPINamedResource;
}

// The sprites object on a Pokémon response.
// We prefer the official-artwork image (higher quality), but fall back to front_default if it's null.
export interface PokeAPISprites {
  front_default: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
    };
  };
}

/** One move entry on a Pokémon — we only care about the name. */
export interface PokeAPIMove {
  move: PokeAPINamedResource;
}

/** The full response from GET /pokemon/{id}. */
export interface PokeAPIPokemon {
  id: number;
  name: string;
  height: number;          // in decimetres — divide by 10 to get metres
  weight: number;          // in hectograms — divide by 10 to get kilograms
  base_experience: number | null;
  sprites: PokeAPISprites;
  types: PokeAPITypeSlot[];
  stats: PokeAPIStat[];
  moves: PokeAPIMove[];
}

/** The response from GET /type/{name} — includes every Pokémon that belongs to that type. */
export interface PokeAPITypeDetail {
  id: number;
  name: string;
  pokemon: Array<{
    pokemon: PokeAPINamedResource;
    slot: number; // 1 = primary type, 2 = secondary type
  }>;
}

// The response from GET /pokemon-species/{id}.
// We fetch this just to get the evolution_chain URL — there's no shortcut to it from the Pokémon endpoint.
export interface PokeAPISpecies {
  evolution_chain: { url: string };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: PokeAPINamedResource;
    version: PokeAPINamedResource;
  }>;
}

/** The response from GET /evolution-chain/{id}. The chain is a tree structure. */
export interface PokeAPIEvolutionChain {
  chain: PokeAPIChainLink;
}

// One node in the evolution tree.
// evolves_to can have multiple branches (e.g. Eevee → 8 different evolutions).
// We only follow the first branch for simplicity.
export interface PokeAPIChainLink {
  species: PokeAPINamedResource;
  evolves_to: PokeAPIChainLink[];
}
