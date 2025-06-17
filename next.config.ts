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
      {
        protocol: 'https',
        hostname: "www.timesbull.com" 
      },
      {
        protocol: 'https',
        hostname: "images.samsung.com" 
      },
      {
        protocol: 'https',
        hostname: "www.livemint.com" 
      },
      {
        protocol: 'https',
        hostname: "media.croma.com" 
      },
      {
        protocol: 'https',
        hostname: "ringke.co.in" 
      },
    ],
  },
};

export default nextConfig;
