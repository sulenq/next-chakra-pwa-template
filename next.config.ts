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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "doc.rimbaexium.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "doc-rimba.exium.my.id",
        pathname: "/**",
      },
    ],
    qualities: [60, 70, 80, 90, 100],
  },
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
