// types/pokemon.ts
// The cleaner data shapes used throughout the app — components, pages, features.
// These are separate from types/api.ts (the raw API shapes) so that if the API
// ever changes, we only update the transformer, not every component.

// All 18 battle types as a TypeScript union.
// Using a union instead of an enum means we can use these values directly
// as keys in the TypeBadge colour map without any conversion.
export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

/** A stat with its name and value, e.g. { name: "hp", value: 45 }. */
export interface PokemonStat {
  name: string;  // e.g. "hp", "attack", "special-attack"
  value: number; // the base stat value (0–255)
}

// The minimal data needed to render a card on the listing page.
// We keep this lean because the listing fetches 20 cards at once —
// every extra field means more memory and a bigger response.
export interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  primaryStat: PokemonStat; // always HP — shown on the card as a quick reference
  height: number;           // raw from the API, in decimetres
  weight: number;           // raw from the API, in hectograms
}

// The full data needed on the detail page.
// Extends PokemonCard so we don't duplicate fields — the transformer
// builds the card first, then adds the extra stuff on top.
export interface PokemonDetail extends PokemonCard {
  baseExperience: number | null; // null for some special/event Pokémon
  stats: PokemonStat[];          // all base stats (hp, attack, defense, etc.)
  moves: string[];               // first 10 move names — the full list can be hundreds
}

// A minimal entry from the all-names list.
// We only need name + id to do the search filtering —
// full details are fetched only for the matched results.
export interface PokemonListItem {
  name: string;
  id: number;
}

/** One step in an evolution chain — Bulbasaur → Ivysaur → Venusaur. */
export interface EvolutionStep {
  id: number;
  name: string;
  imageUrl: string;
}

/** What the listing data fetcher returns to the page. */
export interface PokemonPageResult {
  pokemon: PokemonCard[];
  total: number; // total matched count, used to calculate how many pages there are
}
