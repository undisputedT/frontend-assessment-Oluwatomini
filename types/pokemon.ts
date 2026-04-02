/**
 * types/pokemon.ts
 *
 * Domain model types used across components, features, and pages.
 *
 * These are deliberately different from the raw API shapes in types/api.ts.
 * The separation means UI components only depend on the domain model —
 * if the API changes, only the transformer layer (lib/transformers/) needs
 * updating, not every component that renders Pokémon data.
 */

/**
 * All 18 recognised battle types.
 * Using a string union (rather than an enum) keeps this compatible with
 * the Tailwind colour map in TypeBadge without any runtime conversion.
 */
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

/** A single base stat with its display name and numeric value. */
export interface PokemonStat {
  name: string;  // e.g. "hp", "attack", "special-attack"
  value: number; // base stat value (0–255)
}

/**
 * The minimal shape needed to render a card on the listing page.
 * Kept lean on purpose — the listing fetches 20 in parallel, so
 * every unnecessary field increases server memory and payload.
 */
export interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  primaryStat: PokemonStat; // always HP — shown on the card as a quick reference
  height: number;           // in decimetres (raw from API)
  weight: number;           // in hectograms (raw from API)
}

/**
 * Extends PokemonCard with the full data needed on the detail page.
 * Using extends keeps the transformer simple: build the card first,
 * then spread it and add the extra fields.
 */
export interface PokemonDetail extends PokemonCard {
  baseExperience: number | null; // null for some event/special Pokémon
  stats: PokemonStat[];          // all base stats (hp, attack, defense, etc.)
  moves: string[];               // first 10 move names — full move list is hundreds of entries
}

/**
 * The minimal shape returned by the all-names endpoint.
 * Used for server-side substring search — we only need name and id
 * to filter, then we fetch full details only for the matched page slice.
 */
export interface PokemonListItem {
  name: string;
  id: number;
}

/** A single step in a Pokémon's evolution chain (base → stage 1 → stage 2). */
export interface EvolutionStep {
  id: number;
  name: string;
  imageUrl: string;
}

/** Return shape of the listing page data fetcher. */
export interface PokemonPageResult {
  pokemon: PokemonCard[];
  total: number; // total matched count (used to calculate pagination)
}
