// app/layout.tsx
// The shell that wraps every page — header, main content area, and footer.
// request and the font loads faster.
// The header is sticky so it stays visible while scrolling through a long list.

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

// next/font handles the font loading — no Google Fonts stylesheet needed
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

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
          {/* sticky + z-50 keeps the header above cards and dropdowns while scrolling */}
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

          {/* flex-1 stretches main so the footer stays at the bottom on short pages */}
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
