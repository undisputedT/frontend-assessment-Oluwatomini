/**
 * lib/utils/extractIdFromUrl.ts
 *
 * PokéAPI returns resource URLs like "https://pokeapi.co/api/v2/pokemon/42/"
 * rather than IDs directly in list responses. This utility extracts the
 * numeric ID from the end of any such URL, avoiding the need to make an
 * extra fetch just to get an ID we can construct from the URL itself.
 */

/**
 * Extracts the numeric ID from a PokéAPI resource URL.
 *
 * @example
 * extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/42/") // → 42
 * extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/100")  // → 100
 *
 * @throws if the URL doesn't end with a numeric segment — this signals
 *         an unexpected API shape change that needs investigation.
 */
export function extractIdFromUrl(url: string): number {
  // Match the last numeric segment, with an optional trailing slash
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) throw new Error(`Could not extract ID from URL: ${url}`);
  return parseInt(match[1], 10);
}
