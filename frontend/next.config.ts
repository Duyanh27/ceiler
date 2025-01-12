import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Ensure React runs in strict mode
  env: {
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com", // Allow images from img.clerk.com
        port: "",
        pathname: "/**", // Match all paths
      },
    ],
  },
};

export default nextConfig;
