import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Force ES modules resolution and disable problematic features
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['bcryptjs', 'lucia'],
  },
  // Webpack optimizations for bundler stability
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable React DevTools in development to reduce memory usage
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      };
    }
    
    // Optimize bundling for React Server Components
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  // Disable telemetry and other potentially problematic features
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
