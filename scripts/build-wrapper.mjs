#!/usr/bin/env node
// Cross-platform build wrapper: runs prestart probe then Next build.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${cmd} ${args.join(' ')}`);
    const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    p.on('exit', code => {
      console.log(`Command completed with exit code: ${code}`);
      if (code === 0) {
        resolve(0);
      } else {
        reject(new Error(`${cmd} exited with ${code}`));
      }
    });
    p.on('error', (error) => {
      console.error(`Process error:`, error);
      reject(error);
    });
  });
}

(async () => {
  const prestart = path.join(root, 'scripts', 'prestart.js');
  try {
    await run('node', [prestart]);
    console.log('Prestart completed successfully');
  } catch (e) {
    console.warn('[BUILD-WRAPPER] Prestart failed (continuing):', e.message);
  }
  
  try {
    await run('npx', ['next', 'build']);
    console.log('Next.js build completed successfully');
  } catch (e) {
    console.error('[BUILD-WRAPPER] Next.js build failed:', e.message);
    process.exit(1);
  }
})().catch((error) => {
  console.error('Build wrapper failed:', error);
  process.exit(1);
});
