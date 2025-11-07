import type { NextConfig } from "next";

// Configuration for Next.js - allows external images from Grok AI
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgen.x.ai',
        pathname: '/xai-imgen/**',
      },
    ],
  },
};

export default nextConfig;

