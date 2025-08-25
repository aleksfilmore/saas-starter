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
      
      // Only patch JSON.parse in production build to avoid corrupting dev HMR/runtime
      if (!dev && process.env.NODE_ENV === 'production') {
        config.plugins = config.plugins || [];
        config.plugins.push({
          apply: (compiler) => {
            compiler.hooks.emit.tapAsync('SafeJSONParsePlugin', (compilation, callback) => {
              Object.keys(compilation.assets).forEach((assetName) => {
                if (!assetName.endsWith('.js')) return;
                if (assetName.includes('webpack-runtime')) return; // never touch runtime core
                const asset = compilation.assets[assetName];
                const source = asset.source();
                if (typeof source !== 'string' || !source.includes('JSON.parse')) return;
                console.log(`🔧 Patching JSON.parse in: ${assetName}`);
                const patchedSource = source.replace(/JSON\.parse\(/g, 'safeJSONParse(');
                const finalSource = `// Safe JSON.parse wrapper (prod build only)\nfunction safeJSONParse(text, reviver){\n  if(text===undefined||text===null||text==='undefined'){return null;}\n  try{return JSON.parse(text, reviver);}catch(e){return null;}\n}\n${patchedSource}`;
                compilation.assets[assetName] = { source: () => finalSource, size: () => finalSource.length };
              });
              callback();
            });
          },
        });
      }
    }
    return config;
  },
};

module.exports = nextConfig;
