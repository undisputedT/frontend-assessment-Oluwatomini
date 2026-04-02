/**
 * features/detail/getEvolutionChain.ts
 *
 * Orchestrates the two-step fetch required to build the evolution chain:
 *   1. fetchSpecies(pokemonId)  → species record containing the chain URL
 *   2. fetchEvolutionChain(url) → the full recursive chain tree
 *
 * The two calls must be sequential because the chain URL is not known until
 * the species record arrives. This function is called from the async
 * EvolutionChain Server Component which is wrapped in a Suspense boundary,
 * so the sequential latency is streamed and does not block the initial paint.
 */

import { fetchSpecies, fetchEvolutionChain } from "@/lib/api/pokeapi";
import { flattenEvolutionChain } from "@/lib/transformers/transformEvolution";
import { EvolutionStep } from "@/types/pokemon";

/**
 * Fetches species → evolution chain for a given Pokémon ID.
 * Two sequential fetches are intentional — the chain URL is only known
 * after fetching the species. This function is called from EvolutionChain,
 * which is wrapped in a Suspense boundary on the detail page so the
 * sequential latency is streamed and does not block initial page paint.
 */
export async function getEvolutionChain(
  pokemonId: number
): Promise<EvolutionStep[]> {
  const species = await fetchSpecies(pokemonId);
  const chain = await fetchEvolutionChain(species.evolution_chain.url);
  return flattenEvolutionChain(chain.chain);
}
