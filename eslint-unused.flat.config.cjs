// Flat config dedicated to focused unused-vars cleanup without touching global lint setup yet.
const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat({ baseDirectory: __dirname });

// Import legacy config and adapt.
const legacyConfigs = compat.config({ extends: ['./.eslintrc.json'] });

// Strengthen unused vars rule.
for (const cfg of legacyConfigs) {
  cfg.rules = cfg.rules || {};
  cfg.rules['@typescript-eslint/no-unused-vars'] = ['error', { args: 'none', varsIgnorePattern: '^_' }];
}

module.exports = [
  ...legacyConfigs,
  {
    files: ['app/**/*.{ts,tsx}','components/**/*.{ts,tsx}','lib/**/*.{ts,tsx}']
  }
];
