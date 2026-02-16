import type { NextConfig } from "next";
import createNextPWA from "@ducanh2912/next-pwa";

// --- PWA CONFIGURATION FIX ---
const withPWA = createNextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline.html",
  },
  // Type assertion 'as any' resolves the 'buildExcludes' error (ts(2353))
  buildExcludes: [/\.map$/, /asset-manifest\.json$/],
} as any);

const nextConfig: NextConfig = {
  // --- GENERAL CONFIG ---
  devIndicators: false,
  reactStrictMode: false,

  // --- WEBPACK & MEMORY LEAK FIX ---
  webpack(config, { dev, isServer }) {
    // Prevent server-side only modules from being bundled to the client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
      };
    }

    if (dev) {
      config.cache = {
        type: "filesystem",
      };
    }

    return config;
  },

  // --- IMAGE CONFIG ---
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "apiweb.exium.id", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    qualities: [60, 70, 80, 90, 100],
  },

  // --- EXPERIMENTAL CONFIG ---
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

// Apply the PWA wrapper to the main configuration
export default withPWA(nextConfig);
