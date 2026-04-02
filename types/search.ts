/**
 * types/search.ts
 *
 * Types related to the URL-driven search and filter state.
 *
 * The listing page uses URL search params as the single source of truth
 * for all filter state. This means filter state survives page refresh,
 * is shareable as a link, and is accessible to server components without
 * any client-side state management.
 */

/**
 * The parsed and normalised form of the listing page's URL search params.
 * Raw params arrive as strings — this interface represents them after
 * validation and type coercion in app/page.tsx.
 */
export interface FilterState {
  search: string; // substring to match against Pokémon name; empty string = no search
  type: string;   // Pokémon type to filter by (e.g. "fire"); empty string = all types
  page: number;   // 1-indexed page number; always >= 1
}
