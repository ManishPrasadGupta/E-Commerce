import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.zdnet.com',
      },
      {
        protocol: 'https',
        hostname: "5.imimg.com"
      },
      {
        protocol: 'https',
         hostname: "ik.imagekit.io"
      },
    ],
  },
};

export default nextConfig;
