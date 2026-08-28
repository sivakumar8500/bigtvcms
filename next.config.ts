import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: isProd ? 'export' : undefined,
  trailingSlash: true,
  reactStrictMode: true,
  transpilePackages: ["@mui/system", "@mui/material", "@mui/icons-material"],
  compiler: {
    emotion: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.chotanews.com/:path*',
      },
      {
        source: '/s3-proxy/:path*',
        destination: 'https://s3.ap-south-1.amazonaws.com/:path*',
      },
    ];
  },
};

export default nextConfig;
