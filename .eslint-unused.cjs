module.exports = {
  extends: ['./.eslintrc.json'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none', varsIgnorePattern: '^_' }]
  }
};
