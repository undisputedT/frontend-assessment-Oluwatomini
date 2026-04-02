/**
 * vitest.config.ts
 *
 * Vitest configuration for the project's unit and component test suite.
 *
 * Key choices:
 *
 *   environment: "jsdom"
 *     Provides a browser-like DOM environment (window, document, etc.) so
 *     React components can be rendered and queried in Node.js. Required for
 *     React Testing Library to work.
 *
 *   setupFiles: ["./vitest.setup.ts"]
 *     Runs setup code before each test file. Used to import jest-dom matchers
 *     and mock next/image globally.
 *
 *   globals: true
 *     Makes describe, it, expect, etc. available without explicit imports.
 *     Matches Jest's API so test files are portable between runners.
 *
 *   alias: { "@": "." }
 *     Mirrors the TypeScript path alias defined in tsconfig.json so that
 *     imports like "@/components/..." resolve correctly inside tests.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
