import type { NextConfig } from "next";

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
