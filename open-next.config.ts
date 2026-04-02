/**
 * open-next.config.ts
 *
 * Configuration for the @opennextjs/cloudflare adapter that wraps the Next.js
 * build output for deployment on Cloudflare Workers.
 *
 * Two execution environments are configured:
 *
 *   default (Worker):
 *     Handles all Next.js route requests. Uses the "cloudflare-node" wrapper
 *     which provides a Node.js-compatible runtime shim inside the Worker, and
 *     the "edge" converter which transforms the request/response objects
 *     between the Cloudflare Fetch API and Next.js's internal format.
 *
 *     incrementalCache: "dummy" — ISR (Incremental Static Regeneration) cache
 *     writes are no-ops. The fetch cache we rely on (force-cache, revalidate)
 *     is stored in-memory per Worker instance and survives within a single
 *     request, which is sufficient for this app's needs. For true cross-region
 *     ISR persistence, a Cloudflare KV binding + the official KV adapter would
 *     be required.
 *
 *   middleware (Edge Worker):
 *     Handles Next.js middleware (rewrites, redirects, auth checks) at the
 *     network edge before the request reaches the main Worker. Uses the
 *     "cloudflare-edge" wrapper + "fetch" for proxying external requests.
 */

import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      // No persistent KV store configured — ISR uses in-memory cache per Worker instance.
      // For cross-region ISR persistence, add a KV binding and the @opennextjs/cloudflare KV adapter.
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
};

export default config;
