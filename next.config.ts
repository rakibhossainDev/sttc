import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Turbopack configuration to bypass server-side canvas dependency */
  experimental: {
    turbopack: {
      resolveAlias: {
        canvas: 'unenv/runtime/mock/empty',
      },
    },
  },
  // Keep webpack fallback as an alternative for normal Vercel non-turbo builds
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
};

export default nextConfig;
