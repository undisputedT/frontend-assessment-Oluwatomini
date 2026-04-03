// app/pokemon/[id]/page.tsx
// The detail page for a single Pokémon.
// Shows the artwork, types, height/weight, base stats, moves, and evolution chain.
// If the ID in the URL isn't valid or doesn't exist, we show the 404 page.
// In Next.js 16, params is a Promise and needs to be awaited.

import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPokemonDetail } from "@/features/detail/getPokemonDetail";
import { Breadcrumb } from "@/components/atoms/Breadcrumb";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { StatBar } from "@/components/atoms/StatBar";
import { FallbackImage } from "@/components/atoms/FallbackImage";
import {
  EvolutionChain,
  EvolutionChainSkeleton,
} from "@/components/organisms/EvolutionChain";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Sets the page title, description, and social sharing image
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return {};

  try {
    const pokemon = await getPokemonDetail(numId);
    const capitalised = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    return {
      title: capitalised,
      description: `${capitalised} is a ${pokemon.types.join("/")} type Pokémon with ${pokemon.stats[0]?.value ?? 0} HP and ${pokemon.baseExperience ?? "?"} base experience.`,
      openGraph: {
        title: capitalised,
        images: [{ url: pokemon.imageUrl, width: 475, height: 475 }],
      },
    };
  } catch {
    return {};
  }
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  // Reject non-numeric URLs like /pokemon/abc
  if (isNaN(numId) || numId < 1) notFound();

  let pokemon;
  try {
    pokemon = await getPokemonDetail(numId);
  } catch {
    // The ID was valid but the API returned an error — treat as not found
    notFound();
  }

  // API names are lowercase — capitalise for headings
  const capitalised =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <>
      {/* Back button + breadcrumb trail */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          ← Back
        </Link>
        <Breadcrumb
          items={[
            { label: "All Pokémon", href: "/" },
            { label: capitalised },
          ]}
        />
      </div>

      {/* Two columns: image on the left, stats on the right */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — artwork, name, types, height/weight */}
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-gray-400">
            #{String(pokemon.id).padStart(3, "0")}
          </p>
          <h1 className="mt-1 text-3xl font-bold capitalize text-gray-900">
            {pokemon.name}
          </h1>

          <div className="relative mt-4 h-56 w-56">
            <FallbackImage
              src={pokemon.imageUrl}
              alt={pokemon.name}
              fill
              sizes="224px"
              priority
              className="object-contain drop-shadow-xl"
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} className="px-4 py-1 text-sm" />
            ))}
          </div>

          {/* Height and weight — API stores in decimetres/hectograms, we show metres/kg */}
          <dl className="mt-6 grid w-full grid-cols-2 divide-x divide-gray-100 rounded-xl bg-gray-50 text-center">
            <div className="p-4">
              <dt className="text-xs font-medium text-gray-500">Height</dt>
              <dd className="mt-0.5 text-base font-bold text-gray-800">
                {(pokemon.height / 10).toFixed(1)} m
              </dd>
            </div>
            <div className="p-4">
              <dt className="text-xs font-medium text-gray-500">Weight</dt>
              <dd className="mt-0.5 text-base font-bold text-gray-800">
                {(pokemon.weight / 10).toFixed(1)} kg
              </dd>
            </div>
          </dl>
        </div>

        {/* Right — base stats and moves */}
        <div className="flex flex-col gap-6">
          <section
            aria-labelledby="stats-heading"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2
              id="stats-heading"
              className="mb-4 text-lg font-bold text-gray-800"
            >
              Base Stats
            </h2>
            <div className="flex flex-col gap-2">
              {pokemon.stats.map((stat) => (
                <StatBar key={stat.name} label={stat.name} value={stat.value} />
              ))}
            </div>
          </section>

          {/* Shows the first 10 moves — the full list can be over 100 */}
          <section
            aria-labelledby="moves-heading"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2
              id="moves-heading"
              className="mb-3 text-lg font-bold text-gray-800"
            >
              Moves
            </h2>
            <ul className="flex flex-wrap gap-2">
              {pokemon.moves.map((move) => (
                <li
                  key={move}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700"
                >
                  {move}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Evolution chain loads separately so it doesn't delay the rest of the page */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Suspense fallback={<EvolutionChainSkeleton />}>
          <EvolutionChain pokemonId={pokemon.id} />
        </Suspense>
      </div>
    </>
  );
}
