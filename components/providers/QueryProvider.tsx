/**
 * components/providers/QueryProvider.tsx
 *
 * Wraps the component tree with TanStack Query's QueryClientProvider.
 * Although this project does most data fetching on the server (Server
 * Components + Next.js fetch cache), QueryClient is included as a
 * foundation for any future client-side fetching needs (e.g. infinite scroll,
 * real-time updates) without requiring a major refactor.
 *
 * Must be a Client Component ('use client') because QueryClientProvider uses
 * React context which is not available in Server Components.
 *
 * The QueryClient is initialised inside useState with a factory function.
 * This is the pattern recommended by TanStack for Next.js App Router because:
 *   - It ensures each request gets a fresh client instance (prevents
 *     cross-request state leakage on the server during SSR)
 *   - The [client] tuple means the client is only created once per component
 *     mount, not on every re-render
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Provides a TanStack QueryClient to the entire component tree.
 * The client is created once per component mount via useState to prevent
 * cross-request cache sharing in server-side rendering contexts.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState ensures each request gets a fresh client (prevents cross-request cache sharing on the server)
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
