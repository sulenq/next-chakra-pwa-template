import type { NextConfig } from "next";
import createNextPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  webpack(config, { dev, isServer }) {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      zlib: false,
    };

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
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.mapgis.cloud", pathname: "/**" },
      { protocol: "https", hostname: "doc.rimbaexium.org", pathname: "/**" },
      { protocol: "https", hostname: "doc-rimba.exium.my.id", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    qualities: [60, 70, 80, 90, 100],
  },
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    fallbacks: {
      document: "/offline.html",
    },
    buildExcludes: [/\.map$/, /asset-manifest\.json$/],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    // turbo: {
    //   resolveAlias: {
    //     canvas: "./src/libs/canvas-mock.js",
    //   },
    // },
  },
};

export default createNextPWA()(nextConfig);
