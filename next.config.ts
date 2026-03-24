import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/ai-quote', destination: '/ai', permanent: true },
      { source: '/unsubscribe', destination: '/subscribe', permanent: true },
      { source: '/verify', destination: '/subscribe/verify', permanent: true },
    ]
  },
};

export default nextConfig;
