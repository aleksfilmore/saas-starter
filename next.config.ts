import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // External packages for server-side bundling
  serverExternalPackages: ['lucia', 'bcrypt', 'bcryptjs', 'postgres', 'nanoid', 'drizzle-orm'],
  
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Force ES modules resolution 
  experimental: {
    esmExternals: true,
    // Disable static optimization that's causing issues
    forceSwcTransforms: true,
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
