const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Watch for changes in the parent directory (shared code)
config.watchFolders = [
  path.resolve(__dirname, '../lib'),
  path.resolve(__dirname, '../components'),
  path.resolve(__dirname, '../styles'),
];

// Resolve modules from parent directory
config.resolver.alias = {
  '@': path.resolve(__dirname, '..'),
  '@/lib': path.resolve(__dirname, '../lib'),
  '@/components': path.resolve(__dirname, '../components'),
  '@/styles': path.resolve(__dirname, '../styles'),
};

// Support for shared TypeScript files
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;
