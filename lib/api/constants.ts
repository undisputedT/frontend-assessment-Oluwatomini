// lib/api/constants.ts
// Shared values used across API calls.
// Putting them here means we change them in one place, not scattered everywhere.

/** The base URL for all PokéAPI calls. */
export const POKEAPI_BASE = "https://pokeapi.co/api/v2";

// Default number of Pokémon shown per page
export const DEFAULT_PAGE_SIZE = 10;

// The options available in the "Show: N" dropdown
export const LIMIT_OPTIONS = [10, 20, 50, 100];

// How long (in seconds) Next.js will keep a cached response before checking for fresh data.
// These use Next.js's stale-while-revalidate caching — the page serves instantly from cache,
// then quietly refreshes in the background if the time has passed.

/** 24 hours — for individual Pokémon data, which almost never changes. */
export const REVALIDATE_DETAIL = 86400;

/** 1 hour — for listing and type data, which can change when new Pokémon are added. */
export const REVALIDATE_LISTING = 3600;

/** 24 hours — for the type list, which is basically static. */
export const REVALIDATE_TYPE = 86400;
