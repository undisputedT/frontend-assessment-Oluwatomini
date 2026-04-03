// vitest.config.ts
// Test configuration. jsdom gives us a browser-like environment so React
// components can render in Node.js. The @ alias mirrors tsconfig so imports
// like "@/components/..." work the same way in tests as in the app.

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true, // lets us use describe/it/expect without importing them
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
