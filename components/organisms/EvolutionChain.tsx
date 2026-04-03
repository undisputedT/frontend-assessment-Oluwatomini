// components/organisms/EvolutionChain.tsx
// Shows the evolution chain for a Pokémon — e.g. Bulbasaur → Ivysaur → Venusaur.
// Each stage is a clickable card that takes you to that Pokémon's detail page.
//
// This is an async server component that fetches its own data.
// On the detail page it's wrapped in a Suspense boundary, so it loads
// after the rest of the page without blocking anything.
//
// For Pokémon with branching evolutions (like Eevee), we only show the first branch.
// Pokémon with no evolutions return null, so the section is hidden entirely.

import Image from "next/image";
import Link from "next/link";
import { getEvolutionChain } from "@/features/detail/getEvolutionChain";

interface EvolutionChainProps {
  pokemonId: number;
}

export async function EvolutionChain({ pokemonId }: EvolutionChainProps) {
  const steps = await getEvolutionChain(pokemonId);

  // Single-stage Pokémon (no evolutions) — don't show the section at all
  if (steps.length <= 1) return null;

  return (
    <section aria-labelledby="evolution-heading">
      <h2
        id="evolution-heading"
        className="mb-4 text-lg font-bold text-gray-800"
      >
        Evolution Chain
      </h2>
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <li key={step.id} className="flex items-center gap-2">
            {/* Arrow between stages — hidden from screen readers */}
            {i > 0 && (
              <span className="text-gray-400" aria-hidden="true">
                →
              </span>
            )}
            <Link
              href={`/pokemon/${step.id}`}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              aria-label={`View ${step.name}`}
            >
              <Image
                src={step.imageUrl}
                alt={step.name}
                width={64}
                height={64}
                className="object-contain"
              />
              <span className="mt-1 text-xs font-medium capitalize text-gray-700">
                {step.name}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Shown while the evolution chain is loading.
// Three placeholder blocks approximate a typical 3-stage chain.
export function EvolutionChainSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-6 w-40 rounded bg-gray-200" />
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 w-20 rounded-xl bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
