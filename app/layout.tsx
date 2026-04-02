/**
 * app/layout.tsx
 *
 * The root layout — wraps every page in the application with the shared
 * shell: font loading, global styles, sticky header, main content area,
 * and footer.
 *
 * Font: Geist is loaded via next/font/google. This eliminates the external
 * Google Fonts stylesheet request that would otherwise block rendering; the
 * @font-face declaration is inlined into <head> at build time with
 * font-display:swap so text is visible immediately using the system fallback
 * while Geist loads.
 *
 * Header: sticky top-0 z-50 keeps the nav bar visible while the user scrolls
 * through a long Pokémon grid. The z-index (50) keeps it above card hover
 * shadows and the FilterBar inputs.
 *
 * QueryProvider: wraps the body so that any Client Component anywhere in the
 * tree can access TanStack Query's context if needed.
 */

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

// next/font: inlines @font-face in <head>, adds font-display:swap,
// eliminates the render-blocking Google Fonts stylesheet request
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

/** Site-wide metadata defaults. Individual pages override title via the template. */
export const metadata: Metadata = {
  title: {
    default: "Pokémon Explorer",
    template: "%s | Pokémon Explorer",
  },
  description:
    "Browse, search and filter all Pokémon. Built with Next.js 16, TypeScript, and the PokéAPI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body
        className="flex min-h-full flex-col font-[var(--font-geist),system-ui,sans-serif]"
        style={{ fontFamily: "var(--font-geist, system-ui, sans-serif)" }}
      >
        <QueryProvider>
          {/* sticky top-0 z-50: header stays visible while scrolling */}
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <span className="text-2xl" aria-hidden="true">
                ⚡
              </span>
              <span className="text-xl font-bold text-gray-900">
                Pokémon Explorer
              </span>
            </div>
          </header>

          {/* flex-1 stretches the main area so the footer is pinned to the bottom */}
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>

          <footer className="mt-auto border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
            Data from{" "}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              PokéAPI
            </a>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
