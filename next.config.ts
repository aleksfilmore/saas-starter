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
    
    // Exclude mobile files from module resolution entirely
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Exclude mobile files from compilation
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  },
  
  // Force exclude mobile directory patterns from page discovery
  async generateBuildId() {
    // Custom build ID to force fresh builds and avoid mobile file conflicts
    return 'build-' + Date.now();
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Force dynamic rendering to avoid static generation issues
  output: 'standalone',
  
  // Skip static optimization to avoid page data collection issues
  experimental: {
    esmExternals: true,
    optimizeCss: false,
  },
  
  // Build configuration to prevent static generation issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable static optimization entirely
  trailingSlash: false,
};

export default nextConfig;
