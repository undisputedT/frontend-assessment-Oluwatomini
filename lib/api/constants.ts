// lib/api/constants.ts
// Shared values used across API calls.
// Putting them here means we change them in one place, not scattered everywhere.

/** The base URL for all PokéAPI calls. */
export const POKEAPI_BASE = "https://pokeapi.co/api/v2";

// How many Pokémon to show per page.
// 20 is a good balance — enough to fill the grid without fetching too many at once.
export const PAGE_SIZE = 20;

// How long (in seconds) Next.js will keep a cached response before checking for fresh data.
// These use Next.js's stale-while-revalidate caching — the page serves instantly from cache,
// then quietly refreshes in the background if the time has passed.

/** 24 hours — for individual Pokémon data, which almost never changes. */
export const REVALIDATE_DETAIL = 86400;

/** 1 hour — for listing and type data, which can change when new Pokémon are added. */
export const REVALIDATE_LISTING = 3600;

/** 24 hours — for the type list, which is basically static. */
export const REVALIDATE_TYPE = 86400;
