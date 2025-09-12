import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactDevOverlay: false,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
