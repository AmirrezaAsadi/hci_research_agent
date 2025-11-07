import type { NextConfig } from "next";

// Configuration for Next.js - al lows external images from Grok AI and Cloudflare R2
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgen.x.ai',
        pathname: '/xai-imgen/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-3e9e9dcc1ea149b28b88785900cc6351.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

