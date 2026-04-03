"use client";

// components/providers/QueryProvider.tsx
// Sets up TanStack Query for the whole app.
// Most data fetching happens on the server in this project, but having
// QueryClient available means we can easily add client-side fetching later.
// The client is created inside useState so each page load gets a fresh instance.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState with a factory function creates the client once per mount
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
