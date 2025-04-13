import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost', 'nginx', 'my-laravel-backend.local'],
  },
};

export default nextConfig;
