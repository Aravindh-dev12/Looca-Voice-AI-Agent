/** @type {import('next').NextConfig} */
const apiTarget = process.env.LOOCA_API_HOSTPORT
  ? `http://${process.env.LOOCA_API_HOSTPORT}`
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
