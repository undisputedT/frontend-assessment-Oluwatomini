// lib/transformers/transformEvolution.ts
// Converts the evolution chain from the API's tree structure into a simple flat array.
// The API gives us a nested object: Bulbasaur → { evolves_to: [Ivysaur → { evolves_to: [Venusaur] }] }
// We flatten that into: [Bulbasaur, Ivysaur, Venusaur]

import { PokeAPIChainLink } from "@/types/api";
import { EvolutionStep } from "@/types/pokemon";
import { extractIdFromUrl } from "@/lib/utils/extractIdFromUrl";
import { buildSpriteUrl } from "@/lib/utils/buildSpriteUrl";

// Walks through the evolution tree and returns each stage as a flat list.
// We always follow the first branch in evolves_to, so for Pokémon like Eevee
// that have multiple evolutions, we only show the first one.
// This is a known limitation — supporting all branches would need a tree layout.
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
    // Move to the next stage — undefined stops the loop
    current = current.evolves_to[0];
  }

  return steps;
}
