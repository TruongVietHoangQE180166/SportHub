import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  eslint: {
    // 👇 Tắt ESLint khi build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
