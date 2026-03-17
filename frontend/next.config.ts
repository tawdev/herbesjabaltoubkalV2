import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
    ],
    qualities: [75, 80],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
