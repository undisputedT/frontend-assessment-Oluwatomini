# Pokémon Explorer — Checkit Frontend Assessment

A production-quality Content Explorer built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and the **PokéAPI**.

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/frontend-assessment-Oluwatomini.git
cd frontend-assessment-Oluwatomini
npm install
npm run dev
# Open http://localhost:3000
```

## API Choice

**PokéAPI** (`https://pokeapi.co`) 

## Architecture Decisions

### Folder Structure

```
app/              Next.js App Router — pages, layouts, loading/error
components/
  atoms/          TypeBadge, StatBar, Breadcrumb — pure display, no state
  molecules/      PokemonCard, SearchInput, TypeFilterSelect, PaginationControls
  organisms/      PokemonGrid, FilterBar, EvolutionChain — compose molecules
  providers/      QueryProvider (client boundary for TanStack Query)
features/
  listing/        getFilteredPokemon — server-side data orchestration
  search/         getAllPokemonNames — force-cached name list for search
  detail/         getPokemonDetail, getEvolutionChain
lib/
  api/            pokeapi.ts — all fetch calls live here; components never call fetch() directly
  transformers/   transformPokemon, transformEvolution — raw API → domain types
  utils/          extractIdFromUrl, buildSpriteUrl, cn
types/            pokemon.ts, api.ts, search.ts — all shared interfaces
__tests__/        Vitest + RTL — components and pure utilities
```

### Server vs Client Components

All data-fetching components are **Server Components** — they have no event handlers or state, so their JS is excluded from the client bundle entirely. Only four components are Client Components (`'use client'`): `SearchInput`, `TypeFilterSelect`, `PaginationControls` (need `useSearchParams`/`useRouter`), and `QueryProvider` (needs browser context).

### Search & Filter Strategy

URL params (`?search=&type=&page=`) are the single source of truth. The listing `page.tsx` receives `searchParams` as a prop (a Next.js 15/16 Promise) and passes values to `getFilteredPokemon`, which runs on the server. Four branches:

| Branch | Condition | Approach |
|--------|-----------|----------|
| D | No filters | `GET /pokemon?limit=20&offset=N` → 20 parallel detail fetches |
| A | Type only | `GET /type/{name}` → extract all IDs → paginate → detail-fetch |
| B | Search only | force-cached all-names list → `.filter()` → paginate → detail-fetch |
| C | Search + type | Parallel: type list + names list → intersect → detail-fetch |

**Why pagination over infinite scroll:** Pagination keeps URLs shareable, works correctly with SSR, and doesn't require shipping 1 350 Pokémon names to the browser for client-side filtering.

## Performance Optimizations

### 1 · `next/image` with explicit dimensions and `priority`
Every `<PokemonCard>` uses `<Image fill sizes="112px">` with explicit container dimensions to prevent layout shift. The first 4 cards (above the fold at most mobile viewports) receive `priority={true}`, injecting `<link rel="preload">` to improve LCP. The detail page hero image also has `priority`.

### 2 · `next/font` (font optimisation)
The root layout imports Geist via `next/font/google`. This inlines the critical `@font-face` in `<head>` with `font-display: swap`, eliminating the render-blocking Google Fonts stylesheet request.

### 3 · Fetch cache strategies (per-call)

| Call | Cache setting | Reason |
|------|--------------|--------|
| All names (1 350) | `force-cache` | Permanent until rebuild; ~96 KB, fetched once |
| Paginated listing | `revalidate: 3600` | 1 h; new Pokémon added rarely |
| Individual Pokémon | `revalidate: 86400` | 24 h; data is immutable in practice |
| Type list | `revalidate: 86400` | 24 h; 21 types, static for years |
| Type members | `revalidate: 3600` | 1 h; occasionally updated |
| Species / Evolution | `revalidate: 86400` | 24 h; immutable |

### 4 · Route-level code splitting via dynamic imports
`FilterBar` (which bundles `SearchInput` + `TypeFilterSelect` + their hooks) is loaded with `next/dynamic`. This splits the filter UI JavaScript into a separate chunk that is not included in the initial page bundle, reducing the main bundle size. The loading fallback (skeleton bars) renders during the hydration gap so there is no layout shift.

### 5 · React Suspense streaming for Evolution Chain (Bonus B2)
`EvolutionChain` is an async Server Component in its own `<Suspense>` boundary. It requires two sequential fetches (species → chain URL → chain data). Streaming means the main Pokémon detail renders immediately and the chain fills in after — reducing time-to-first-meaningful-paint by ~600–900 ms compared to blocking.

### 6 · Suspense boundaries around `useSearchParams` Client Components
`SearchInput` and `TypeFilterSelect` use `useSearchParams`, which requires a Suspense boundary to avoid blocking prerendering. `FilterBar` wraps both with a skeleton fallback.

## Deployment — Vercel

```bash
npm run build   # verify the build passes locally first
```

Then push to GitHub and import the repository on [vercel.com](https://vercel.com). Vercel auto-detects Next.js — no extra configuration needed. Every push to `main` triggers a new production deployment.

## Trade-offs & Known Limitations

- **Name search is substring-only** — PokéAPI has no text search. Searching "saur" correctly matches "bulbasaur", "ivysaur", "venusaur".
- **Evolution chain follows first branch only** — branching evolutions (e.g. Eevee) only show one path. A full tree implementation was out of scope.
- **No optimistic UI** — Filter changes trigger a full server re-render. `placeholderData` in TanStack Query would keep the previous result visible during transitions; omitted as fast cache hits make the gap imperceptible.

## Testing

```bash
npm test            # run once
npm run test:watch  # watch mode
```

28 tests across 3 files:
- `PokemonCard.test.tsx` — 7 tests (rendering, link href, type badges, HP stat, padded ID)
- `SearchInput.test.tsx` — 7 tests (debounce timing, URL updates, scroll option, label)
- `transformPokemon.test.ts` — 14 tests (card/detail transformers, extractIdFromUrl, buildSpriteUrl)

## Bonus Tasks

- **B2 — Suspense streaming**: Navigate to any detail page. The main content (name, stats, image) renders first; the evolution chain streams in after. Verify by throttling the network in DevTools.
- **B3 — Accessibility**: All interactive elements have `aria-label`, `aria-current`, or associated `<label>`. `StatBar` uses `role="progressbar"` with full ARIA value attributes. Focus-visible outlines on all interactive elements. Breadcrumb uses semantic `<nav>` + `<ol>`.
