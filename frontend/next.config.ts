import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Ensure React runs in strict mode
  env: {
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
  },
};

export default nextConfig;
