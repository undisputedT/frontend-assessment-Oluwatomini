/**
 * app/pokemon/[id]/page.tsx
 *
 * The Pokémon detail page. Renders the full profile for a single Pokémon:
 * image, types, height/weight, base stats, sample moves, and evolution chain.
 *
 * Routing:
 * The dynamic segment [id] is expected to be a numeric Pokémon ID (1–1025+).
 * Non-numeric segments and IDs below 1 call notFound() which renders the
 * global 404 page. If the API fetch itself fails (e.g. ID exists in URL but
 * not in PokéAPI), notFound() is also called so users see a clear message
 * rather than an unhandled error.
 *
 * Next.js 16 note: `params` is a Promise and must be awaited before accessing
 * `id`. The same applies to generateMetadata.
 *
 * generateMetadata: runs independently of the page render and provides
 * title, description, and og:image for social sharing and SEO.
 *
 * Evolution chain: rendered in a Suspense boundary so the two sequential
 * fetches (species → chain) stream in after the main page content without
 * blocking the initial paint. EvolutionChainSkeleton is shown while loading.
 */

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
  /** In Next.js 16 App Router, params is a Promise — it must be awaited */
  params: Promise<{ id: string }>;
}

/**
 * Generates the <title>, meta description, and og:image for the detail page.
 * Falls back to empty metadata for invalid IDs rather than throwing, because
 * generateMetadata errors are surfaced differently from page-level errors.
 */
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

/**
 * Renders the full detail page for a single Pokémon.
 * Validates the ID param, fetches the detail, and renders the two-column layout:
 * left column = image + types + physical stats; right column = base stats + moves.
 * Evolution chain is streamed below via Suspense.
 */
export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  // Guard against non-numeric segments or IDs below the valid range
  if (isNaN(numId) || numId < 1) notFound();

  let pokemon;
  try {
    pokemon = await getPokemonDetail(numId);
  } catch {
    // API returned an error (e.g. 404 for an ID that doesn't exist yet)
    notFound();
  }

  // Capitalise for headings — API names are all lowercase
  const capitalised =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <>
      {/* Navigation row: back button + breadcrumb trail */}
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

      {/* Two-column layout: image/types left, stats/moves right */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — hero image, number, name, type badges, height/weight */}
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

          {/* Physical dimensions — API values are in decimetres/hectograms, converted to m/kg */}
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

        {/* Right — base stats bar chart + sample moves */}
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

          {/* Moves — capped at 10 in the transformer; full list can exceed 100 */}
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

      {/* Evolution chain — streamed via Suspense so it doesn't block the page paint */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Suspense fallback={<EvolutionChainSkeleton />}>
          <EvolutionChain pokemonId={pokemon.id} />
        </Suspense>
      </div>
    </>
  );
}
