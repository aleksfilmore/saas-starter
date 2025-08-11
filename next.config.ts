import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // External packages that should not be bundled
  serverExternalPackages: ['postgres', 'bcryptjs'],
  
  // Disable problematic optimizations that might cause build issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Simple webpack config
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
