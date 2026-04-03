// features/detail/getEvolutionChain.ts
// Gets the evolution chain for a Pokémon.
// This needs two separate API calls because the chain URL isn't on the main
// Pokémon endpoint — we have to fetch the species first, get the chain URL from
// that, then fetch the chain itself.
// The two calls run one after the other (sequential) because the second URL
// isn't known until the first call finishes.

import { fetchSpecies, fetchEvolutionChain } from "@/lib/api/pokeapi";
import { flattenEvolutionChain } from "@/lib/transformers/transformEvolution";
import { EvolutionStep } from "@/types/pokemon";

export async function getEvolutionChain(
  pokemonId: number
): Promise<EvolutionStep[]> {
  const species = await fetchSpecies(pokemonId);
  const chain = await fetchEvolutionChain(species.evolution_chain.url);
  return flattenEvolutionChain(chain.chain);
}
