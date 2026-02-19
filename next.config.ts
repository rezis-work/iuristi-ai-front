import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [{ source: "/api/:path*", destination: "http://localhost:3001/:path*" }];
    }
    return [];
  }, // Required for Docker deployment
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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    webpackMemoryOptimizations: false,
  },
};

export default nextConfig;
