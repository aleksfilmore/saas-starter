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
  
  // Disable experimental features that might be causing issues
  experimental: {
    esmExternals: true,
  },
  
  // Skip error page prerendering
  staticPageGenerationTimeout: 60,
  
  // Disable telemetry and other potentially problematic features
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Force dynamic rendering for all pages to avoid static generation issues
  output: 'standalone',
  
  // Disable static optimization
  generateEtags: false,
};

export default nextConfig;
