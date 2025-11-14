import type { NextConfig } from "next";
import createNextPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "doc.rimbaexium.org", pathname: "/**" },
      { protocol: "https", hostname: "doc-rimba.exium.my.id", pathname: "/**" },
    ],
    qualities: [60, 70, 80, 90, 100],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  webpack(config, { dev, isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }
    if (dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
  pwa: {
    dest: "public", // boleh tetap dipakai di sini
    disable: process.env.NODE_ENV === "development",
    fallbacks: {
      document: "/offline.html",
    },
    buildExcludes: [/\.map$/, /asset-manifest\.json$/],
  },
};

export default createNextPWA()(nextConfig);
