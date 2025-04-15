import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  
  // 添加安全策略设置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' *.crazygames.com *.unity3d.com;
              frame-src 'self' * data:;
              img-src 'self' * data:;
              style-src 'self' 'unsafe-inline';
              connect-src 'self' *;
              font-src 'self' data:;
            `.replace(/\s+/g, ' ').trim()
          }
        ],
      },
    ]
  },
};

export default nextConfig; 