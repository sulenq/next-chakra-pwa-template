import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline.html",
  },
  buildExcludes: [/\.map$/, /asset-manifest\.json$/],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  webpack(config, { dev }) {
    if (dev) {
      config.cache = {
        type: "memory",
      };
    }
    return config;
  },
};

module.exports = withPWA(nextConfig);
