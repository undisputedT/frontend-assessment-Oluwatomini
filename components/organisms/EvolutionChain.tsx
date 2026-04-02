/**
 * components/organisms/EvolutionChain.tsx
 *
 * Renders the evolution chain for a single Pokémon as a horizontal list of
 * sprite + name tiles linked to each stage's detail page.
 *
 * Data fetching:
 * This is an async Server Component — it owns its own data fetch via
 * getEvolutionChain(), which makes two sequential API calls (species → chain).
 * It is placed inside a Suspense boundary on the detail page so those fetches
 * are streamed without blocking the initial page paint. The detail page hero
 * (image, types, stats) renders immediately while the evolution section loads.
 *
 * Branching chains (e.g. Eevee → 8 evolutions) show only the first branch
 * because flattenEvolutionChain always follows evolves_to[0]. This is a
 * documented trade-off — full branching support would require a tree layout
 * component and substantially more complexity.
 *
 * Single-step chains (Pokémon with no evolutions) return null so no section
 * heading or empty container is rendered.
 *
 * EvolutionChainSkeleton is co-exported and used as the Suspense fallback
 * on the detail page to match the eventual section dimensions.
 */

import Image from "next/image";
import Link from "next/link";
import { getEvolutionChain } from "@/features/detail/getEvolutionChain";

interface EvolutionChainProps {
  pokemonId: number;
}

/**
 * Async Server Component that fetches and renders the evolution chain.
 * Returns null for Pokémon with no evolutions (single-step chains),
 * so the enclosing container on the detail page is hidden entirely.
 */
export async function EvolutionChain({ pokemonId }: EvolutionChainProps) {
  const steps = await getEvolutionChain(pokemonId);

  // No evolution chain to display — skip the entire section
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
            {/* Arrow separator between stages — hidden from assistive technology */}
            {i > 0 && (
              <span className="text-gray-400" aria-hidden="true">
                →
              </span>
            )}
            <Link
              href={`/pokemon/${step.id}`}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
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

/**
 * Skeleton placeholder shown by the Suspense boundary while getEvolutionChain
 * is in-flight. Three bars approximate a typical 3-stage chain so the layout
 * does not jump when the real content arrives.
 */
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
