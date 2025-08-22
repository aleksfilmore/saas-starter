// Backup of the original simplified next.config.ts
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  reactStrictMode: true,
  
  // Performance optimizations
  swcMinify: true,
  
  // Image optimization
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
  },
  
  // Headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/api',
        destination: '/api/status',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
