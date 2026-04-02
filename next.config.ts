import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers does not run the Sharp-based image optimisation pipeline.
    // Setting unoptimized:true passes src through directly while preserving
    // layout-stable width/height and priority preload hints on <Image>.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/**",
      },
    ],
  },
};

export default nextConfig;
