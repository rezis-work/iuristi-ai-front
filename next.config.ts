import type { NextConfig } from "next";

// Microservices – development-ში ორი backend
const IAM_URL = process.env.NEXT_PUBLIC_IAM_URL ?? "http://localhost:3001";
const LAWYER_URL = process.env.NEXT_PUBLIC_LAWYER_URL ?? "http://localhost:3002";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      // მეტი სპეციფიკური routes პირველად – lawyer-agent (Chat, Search)
      return [
        { source: "/api/chat/:path*", destination: `${LAWYER_URL}/chat/:path*` },
        { source: "/api/search/:path*", destination: `${LAWYER_URL}/search/:path*` },
        { source: "/api/ingest/:path*", destination: `${LAWYER_URL}/search/:path*` },
        // ყველა დანარჩენი → iam-service (Auth, Users, Orgs, Profile, ფაილები)
        { source: "/api/:path*", destination: `${IAM_URL}/:path*` },
      ];
    }
    return [];
  }, // production-ში nginx აკეთებს proxy
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
