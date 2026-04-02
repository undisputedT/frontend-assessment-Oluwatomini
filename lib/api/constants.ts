/**
 * lib/api/constants.ts
 *
 * Shared configuration values for the PokéAPI integration.
 * Centralising these here means cache durations and pagination size
 * can be changed in one place rather than scattered across fetch calls.
 */

/** Base URL for all PokéAPI v2 endpoints. */
export const POKEAPI_BASE = "https://pokeapi.co/api/v2";

/**
 * Number of Pokémon to fetch and display per page.
 * 20 balances visual density with the parallel fetch cost —
 * each page triggers 20 concurrent detail requests.
 */
export const PAGE_SIZE = 20;

/**
 * Cache revalidation durations (in seconds).
 *
 * Next.js uses these to decide how long to serve a cached fetch response
 * before revalidating it in the background (stale-while-revalidate pattern).
 *
 * On Cloudflare Workers, these act as in-memory hints per Worker instance
 * rather than globally shared cache, unless a KV store is configured.
 */

/** 24 hours — used for individual Pokémon and static reference data that rarely changes. */
export const REVALIDATE_DETAIL = 86400;

/** 1 hour — used for paginated listings and type membership lists. */
export const REVALIDATE_LISTING = 3600;

/** 24 hours — used for the type list (21 types, static across game generations). */
export const REVALIDATE_TYPE = 86400;
