/**
 * types/api.ts
 *
 * Raw response shapes from the PokéAPI.
 *
 * These types are intentionally kept separate from the domain types in
 * types/pokemon.ts. The API shape is the API's contract — it can have
 * snake_case fields, null unions, and nested structures we don't care about.
 * By isolating them here, transformers in lib/transformers/ act as the boundary:
 * anything outside lib/ never sees these raw shapes.
 */

/** A generic { name, url } pair that PokéAPI uses as a reference to another resource. */
export interface PokeAPINamedResource {
  name: string;
  url: string;
}

/** The envelope PokéAPI wraps around paginated list endpoints. */
export interface PokeAPIList {
  count: number;           // total number of resources available
  next: string | null;     // URL for the next page, or null if on the last page
  previous: string | null; // URL for the previous page, or null if on the first page
  results: PokeAPINamedResource[];
}

/** A Pokémon's type assignment. `slot` is 1 for primary type, 2 for secondary. */
export interface PokeAPITypeSlot {
  slot: number;
  type: PokeAPINamedResource;
}

/** A single base stat entry (e.g. hp: 45, attack: 52). */
export interface PokeAPIStat {
  base_stat: number;
  effort: number; // EV yield — we don't use this but it's part of the shape
  stat: PokeAPINamedResource;
}

/**
 * The sprites object on a Pokémon response.
 * We only use the official-artwork image; front_default is kept
 * as a fallback in case the artwork URL is null.
 */
export interface PokeAPISprites {
  front_default: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
    };
  };
}

/** A move reference on a Pokémon — we only need the name. */
export interface PokeAPIMove {
  move: PokeAPINamedResource;
}

/** The full Pokémon detail response from GET /pokemon/{id}. */
export interface PokeAPIPokemon {
  id: number;
  name: string;
  height: number;          // in decimetres (divide by 10 for metres)
  weight: number;          // in hectograms (divide by 10 for kilograms)
  base_experience: number | null;
  sprites: PokeAPISprites;
  types: PokeAPITypeSlot[];
  stats: PokeAPIStat[];
  moves: PokeAPIMove[];
}

/** Response from GET /type/{name} — includes all Pokémon of that type. */
export interface PokeAPITypeDetail {
  id: number;
  name: string;
  pokemon: Array<{
    pokemon: PokeAPINamedResource;
    slot: number; // 1 = primary type, 2 = secondary type
  }>;
}

/**
 * Response from GET /pokemon-species/{id}.
 * We fetch this to obtain the evolution_chain URL — there's no direct
 * link from the Pokémon endpoint to the evolution chain.
 */
export interface PokeAPISpecies {
  evolution_chain: { url: string };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: PokeAPINamedResource;
    version: PokeAPINamedResource;
  }>;
}

/** Response from GET /evolution-chain/{id}. The chain is a recursive tree. */
export interface PokeAPIEvolutionChain {
  chain: PokeAPIChainLink;
}

/**
 * A single node in the evolution chain tree.
 * `evolves_to` can have multiple entries (e.g. Eevee's eight evolutions).
 * We follow only the first branch — a deliberate scope trade-off.
 */
export interface PokeAPIChainLink {
  species: PokeAPINamedResource;
  evolves_to: PokeAPIChainLink[];
}
