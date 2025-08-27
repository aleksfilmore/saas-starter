// Jest setup: polyfills & globals (types loaded via dev tsconfig in test context)
// Jest setup: only run in test environment. Avoid declaring ambient `jest` to prevent
// TypeScript redeclaration errors during production build.
if (typeof (globalThis as any).jest !== 'undefined') {
	(globalThis as any).jest.setTimeout(30000);
}
