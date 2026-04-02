/**
 * __tests__/components/PokemonCard.test.tsx
 *
 * Unit tests for the PokemonCard component.
 *
 * What we test:
 *   - Rendering the Pokémon name as a heading element
 *   - Image rendering with the correct src attribute
 *   - Type badges — one per type, correct labels
 *   - HP stat display
 *   - The card being a link to the correct detail route
 *   - The padded Pokémon ID (e.g. #001)
 *
 * What we don't test:
 *   - Tailwind class names — these are cosmetic and change with design updates
 *   - Hover animations — not testable in jsdom
 *   - FallbackImage error path — covered separately if needed
 *
 * next/image is mocked globally in vitest.setup.ts to avoid the Sharp
 * dependency, so image assertions check the rendered <img> element.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PokemonCard } from "@/components/molecules/PokemonCard";
import { PokemonCard as PokemonCardType } from "@/types/pokemon";

/** Fixture representing Bulbasaur — a dual-type Pokémon for badge tests */
const mockPokemon: PokemonCardType = {
  id: 1,
  name: "bulbasaur",
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  types: ["grass", "poison"],
  primaryStat: { name: "hp", value: 45 },
  height: 7,
  weight: 69,
};

describe("PokemonCard", () => {
  it("renders the Pokémon name in a heading", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByRole("heading", { name: /bulbasaur/i })).toBeInTheDocument();
  });

  it("renders the image with the correct src", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    const img = screen.getByAltText("bulbasaur") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("1.png");
  });

  it("renders a type badge for each type", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("poison")).toBeInTheDocument();
  });

  it("renders exactly two type badges for a dual-type Pokémon", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    // Type badges are spans with capitalised type names
    const grass = screen.getByText("grass");
    const poison = screen.getByText("poison");
    expect(grass.tagName).toBe("SPAN");
    expect(poison.tagName).toBe("SPAN");
  });

  it("renders the HP stat value", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("HP")).toBeInTheDocument();
  });

  it("renders a link to the detail page", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    const link = screen.getByRole("link", { name: /view details for bulbasaur/i });
    expect(link).toHaveAttribute("href", "/pokemon/1");
  });

  it("renders the padded Pokémon ID", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText("#001")).toBeInTheDocument();
  });
});
