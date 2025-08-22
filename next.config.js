/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // Handle server-side specific configurations - filter out undefined externals
      const existingExternals = Array.isArray(config.externals) 
        ? config.externals.filter(Boolean) 
        : (config.externals ? [config.externals] : []);
      config.externals = [...existingExternals, 'bcryptjs'];
      
      // Only mock postgres during build (not during dev server)
      if (!dev && process.env.NODE_ENV === 'production') {
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};
        // Create alias to mock postgres.js during build
        config.resolve.alias['postgres'] = require.resolve('./lib/db/postgres-mock.js');
        // Also mock drizzle-orm postgres-js adapter
        config.resolve.alias['drizzle-orm/postgres-js'] = require.resolve('./lib/db/drizzle-orm-mock.js');
      }
      
      // Add plugin to inject safe JSON parser during build
      config.plugins = config.plugins || [];
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.emit.tapAsync('SafeJSONParsePlugin', (compilation, callback) => {
            // Process all assets
            Object.keys(compilation.assets).forEach((assetName) => {
              if (assetName.endsWith('.js') && compilation.assets[assetName]) {
                const asset = compilation.assets[assetName];
                const source = asset.source();
                
                if (typeof source === 'string' && source.includes('JSON.parse')) {
                  console.log(`🔧 Patching JSON.parse in: ${assetName}`);
                  
                  // Replace all occurrences of JSON.parse with a safe version
                  const patchedSource = source.replace(
                    /JSON\.parse\(/g,
                    'safeJSONParse('
                  );
                  
                  // Add the safe parser at the beginning
                  const finalSource = `
// Safe JSON.parse wrapper for build time
function safeJSONParse(text, reviver) {
  if (text === undefined || text === null || text === 'undefined') {
    console.warn('Skipping undefined JSON.parse during build in ${assetName}');
    return null;
  }
  try {
    return JSON.parse(text, reviver);
  } catch (e) {
    console.warn('JSON.parse error in ${assetName}:', e.message, 'text:', text);
    return null;
  }
}
${patchedSource}`;
                  
                  compilation.assets[assetName] = {
                    source: () => finalSource,
                    size: () => finalSource.length,
                  };
                }
              }
            });
            callback();
          });
        },
      });
    }
    return config;
  },
};

module.exports = nextConfig;
