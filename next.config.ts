import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache TTL for optimized images (1 hour)
    minimumCacheTTL: 3600,
    // Remote image patterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "notarius.ancorathemes.com",
      
      },
    ],
  },
};

export default nextConfig;
