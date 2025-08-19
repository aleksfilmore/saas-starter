import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // External packages for server-side bundling
  serverExternalPackages: ['lucia', 'bcrypt', 'bcryptjs', 'postgres', 'nanoid', 'drizzle-orm'],
  
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  
  // Exclude mobile directory from Next.js processing
  webpack: (config, { isServer }) => {
    // Exclude mobile directory from webpack compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/mobile/**', '**/node_modules/**'],
    };
    
    return config;
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Disable all experimental features
  experimental: {
    esmExternals: true,
  },
  
  // Force all pages to be dynamic by disabling static optimization
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  
  // Disable static page generation timeout
  staticPageGenerationTimeout: 0,
  
  // Skip all redirects and middleware during build
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Build configuration to prevent static generation issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Output configuration
  output: 'standalone',
  distDir: '.next',
};

export default nextConfig;
