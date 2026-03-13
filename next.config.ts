import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
  images : {
  remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  }
  // images: {
  //   domains: ['images.pexels.com','plus.unsplash.com', 'images.unsplash.com', 'dummyimage.com'],
  // },
};

export default nextConfig;



