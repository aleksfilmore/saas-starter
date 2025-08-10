#!/usr/bin/env node
/**
 * Same as lint-unused.cjs but applies auto-fixes.
 */
const { ESLint } = require('eslint');
const fs = require('fs');
const path = require('path');

(async () => {
  const eslint = new ESLint({ fix: true, overrideConfigFile: path.join(process.cwd(), 'eslint-unused.flat.config.cjs') });
  const results = await eslint.lintFiles(['app/**/*.{ts,tsx}','components/**/*.{ts,tsx}','lib/**/*.{ts,tsx}']);
  await ESLint.outputFixes(results);
  const unusedRule = '@typescript-eslint/no-unused-vars';
  let errorCount = 0;
  for (const r of results) {
    for (const m of r.messages) {
      if (m.ruleId === unusedRule) errorCount++;
    }
  }
  const formatter = await eslint.loadFormatter('stylish');
  const text = formatter.format(results);
  process.stdout.write(text);
  if (errorCount > 0) process.exit(1); else process.exit(0);
})();
