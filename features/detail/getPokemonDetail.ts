// features/detail/getPokemonDetail.ts
// Fetches the full data for a single Pokémon and returns it in the
// clean format the detail page needs.
// Throws if the fetch fails (e.g. bad ID) so the page can show a 404.

import { fetchPokemon } from "@/lib/api/pokeapi";
import { transformPokemonDetail } from "@/lib/transformers/transformPokemon";
import { PokemonDetail } from "@/types/pokemon";

export async function getPokemonDetail(id: number): Promise<PokemonDetail> {
  const raw = await fetchPokemon(id);
  return transformPokemonDetail(raw);
}
