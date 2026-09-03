/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  devIndicators: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', 'axios'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/py/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
