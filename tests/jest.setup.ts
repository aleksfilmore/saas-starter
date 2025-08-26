// Jest setup: polyfills & globals (types loaded via dev tsconfig in test context)
// Minimal ambient declaration so TypeScript doesn't error when test types stripped in production build
// (Netlify build excludes dev-only type resolution but we don't want compile to fail.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jest: any;

if (typeof jest !== 'undefined') {
	jest.setTimeout(30000);
}
