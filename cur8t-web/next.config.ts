import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack: (config, { isServer }) => {
    // Force case-sensitive path resolution
    config.resolve = config.resolve || {};
    config.resolve.caseSensitive = true;
    return config;
  },
};

export default nextConfig;
