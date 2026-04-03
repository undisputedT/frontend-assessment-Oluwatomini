import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from the GitHub repo where PokéAPI hosts its sprites
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
