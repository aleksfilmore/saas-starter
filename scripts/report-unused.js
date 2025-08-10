#!/usr/bin/env node
/**
 * Runs the focused unused variable lint and produces a concise JSON + text summary
 * of the top offending files (by error count). Designed to be ephemeral tooling
 * while cleaning up the codebase.
 */

const { spawnSync } = require('child_process');

function run() {
  const eslintArgs = [
    '-c', '.eslint-unused.cjs',
    '--ext', '.ts,.tsx',
    '--format', 'json',
    'app', 'components', 'lib'
  ];
  const proc = spawnSync('npx', ['eslint', ...eslintArgs], { encoding: 'utf8' });
  if (proc.error) {
    console.error('Failed to execute ESLint:', proc.error);
    process.exit(1);
  }
  if (proc.status !== 0 && proc.status !== 1) {
    console.error('ESLint exited with unexpected status', proc.status);
    console.error(proc.stdout || proc.stderr);
    process.exit(proc.status || 1);
  }
  let report; 
  try {
    report = JSON.parse(proc.stdout);
  } catch (e) {
    console.error('Could not parse ESLint JSON output. Raw output follows:');
    console.log(proc.stdout);
    console.error(proc.stderr);
    process.exit(1);
  }
  const unusedRule = '@typescript-eslint/no-unused-vars';
  const fileCounts = [];
  for (const file of report) {
    const unusedProblems = file.messages.filter(m => m.ruleId === unusedRule);
    if (unusedProblems.length) {
      fileCounts.push({ filePath: file.filePath, count: unusedProblems.length });
    }
  }
  fileCounts.sort((a,b) => b.count - a.count);
  const top = fileCounts.slice(0, 20);
  const total = fileCounts.reduce((s, f) => s + f.count, 0);
  const summary = { totalUnusedFindings: total, filesWithUnused: fileCounts.length, topFiles: top };
  console.log('Unused variable summary (top 20 by count):');
  for (const f of top) {
    console.log(`${f.count.toString().padStart(4,' ')}  ${f.filePath}`);
  }
  console.log('\nJSON summary:');
  console.log(JSON.stringify(summary, null, 2));
  if (proc.status === 0) {
    // No lint errors, exit success
    process.exit(0);
  } else {
    // Return non-zero so CI can still notice remaining issues if desired.
    process.exit(1);
  }
}

run();
