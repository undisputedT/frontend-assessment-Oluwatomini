// __tests__/lib/transformPokemon.test.ts
// Tests for the transformer functions and URL utilities.
// These are pure functions with no React rendering — just input in, output out.

import { describe, it, expect } from "vitest";
import { transformPokemonCard, transformPokemonDetail } from "@/lib/transformers/transformPokemon";
import { extractIdFromUrl } from "@/lib/utils/extractIdFromUrl";
import { buildSpriteUrl } from "@/lib/utils/buildSpriteUrl";
import { PokeAPIPokemon } from "@/types/api";

// Charmander (id=4) with minimal but realistic data
const rawPokemon: PokeAPIPokemon = {
  id: 4,
  name: "charmander",
  height: 6,
  weight: 85,
  base_experience: 62,
  sprites: {
    front_default: null,
    other: {
      "official-artwork": {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
      },
    },
  },
  types: [{ slot: 1, type: { name: "fire", url: "" } }],
  stats: [
    { base_stat: 39, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 52, effort: 0, stat: { name: "attack", url: "" } },
  ],
  moves: [
    { move: { name: "scratch", url: "" } },
    { move: { name: "ember", url: "" } },
  ],
};

describe("transformPokemonCard", () => {
  it("maps id, name, height, weight correctly", () => {
    const card = transformPokemonCard(rawPokemon);
    expect(card.id).toBe(4);
    expect(card.name).toBe("charmander");
    expect(card.height).toBe(6);
    expect(card.weight).toBe(85);
  });

  it("uses the official-artwork URL when available", () => {
    const card = transformPokemonCard(rawPokemon);
    expect(card.imageUrl).toContain("official-artwork/4.png");
  });

  it("falls back to buildSpriteUrl when official-artwork is null", () => {
    const noArtwork: PokeAPIPokemon = {
      ...rawPokemon,
      sprites: {
        front_default: null,
        other: { "official-artwork": { front_default: null } },
      },
    };
    const card = transformPokemonCard(noArtwork);
    expect(card.imageUrl).toBe(buildSpriteUrl(4));
  });

  it("maps types to PokemonType array", () => {
    const card = transformPokemonCard(rawPokemon);
    expect(card.types).toEqual(["fire"]);
  });

  it("returns types length 1 for a single-type Pokémon", () => {
    const card = transformPokemonCard(rawPokemon);
    expect(card.types).toHaveLength(1);
  });

  it("maps the HP stat as primaryStat", () => {
    const card = transformPokemonCard(rawPokemon);
    expect(card.primaryStat).toEqual({ name: "hp", value: 39 });
  });
});

describe("transformPokemonDetail", () => {
  it("includes all PokemonCard fields", () => {
    const detail = transformPokemonDetail(rawPokemon);
    expect(detail.id).toBe(4);
    expect(detail.types).toEqual(["fire"]);
  });

  it("maps stats array correctly", () => {
    const detail = transformPokemonDetail(rawPokemon);
    expect(detail.stats).toEqual([
      { name: "hp", value: 39 },
      { name: "attack", value: 52 },
    ]);
  });

  it("maps moves to name strings (up to 10)", () => {
    const detail = transformPokemonDetail(rawPokemon);
    expect(detail.moves).toEqual(["scratch", "ember"]);
  });

  it("sets baseExperience from raw data", () => {
    const detail = transformPokemonDetail(rawPokemon);
    expect(detail.baseExperience).toBe(62);
  });
});

describe("extractIdFromUrl", () => {
  it("extracts numeric ID from a standard PokéAPI URL", () => {
    expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/42/")).toBe(42);
  });

  it("works with URLs that have no trailing slash", () => {
    expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/100")).toBe(100);
  });

  it("throws for a URL with no numeric segment", () => {
    expect(() => extractIdFromUrl("https://pokeapi.co/api/v2/type/fire/")).toThrow();
  });
});

describe("buildSpriteUrl", () => {
  it("returns the correct official-artwork URL", () => {
    expect(buildSpriteUrl(1)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    );
  });
});
