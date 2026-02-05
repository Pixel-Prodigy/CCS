import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dsevoicivvokvrylhqtw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Use dynamic rendering for all pages to prevent prerender errors
  // This is necessary for apps that use authentication via cookies/headers
  experimental: {
    dynamicIO: true,
  },
};

export default nextConfig;
