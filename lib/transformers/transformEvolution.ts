/**
 * lib/transformers/transformEvolution.ts
 *
 * Transforms the recursive PokéAPI evolution chain tree into a flat,
 * ordered array that the EvolutionChain component can render directly.
 */

import { PokeAPIChainLink } from "@/types/api";
import { EvolutionStep } from "@/types/pokemon";
import { extractIdFromUrl } from "@/lib/utils/extractIdFromUrl";
import { buildSpriteUrl } from "@/lib/utils/buildSpriteUrl";

/**
 * Walks the evolution chain tree and returns an ordered list of steps.
 *
 * The PokéAPI represents evolution as a nested recursive structure:
 *   { species: Bulbasaur, evolves_to: [{ species: Ivysaur, evolves_to: [...] }] }
 *
 * We flatten this into [Bulbasaur, Ivysaur, Venusaur] by always following
 * the first item in evolves_to. This covers all linear chains correctly.
 * For branching chains (e.g. Eevee → 8 evolutions), only the first branch
 * is shown — a known trade-off documented in the README.
 *
 * Images are constructed from IDs using buildSpriteUrl rather than requiring
 * a separate detail fetch for each evolution step.
 */
export function flattenEvolutionChain(chain: PokeAPIChainLink): EvolutionStep[] {
  const steps: EvolutionStep[] = [];
  let current: PokeAPIChainLink | undefined = chain;

  while (current) {
    const id = extractIdFromUrl(current.species.url);
    steps.push({
      id,
      name: current.species.name,
      imageUrl: buildSpriteUrl(id),
    });
    // Move to the next stage; undefined terminates the loop
    current = current.evolves_to[0];
  }

  return steps;
}
