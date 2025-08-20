#!/usr/bin/env node
// Cross-platform build wrapper: runs prestart probe then Next build.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Handle unhandled rejections with more detail
process.on('unhandledRejection', (error) => {
  console.error('=== UNHANDLED PROMISE REJECTION ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  if (error.message.includes('INVALID_DEFAULT_EXPORT')) {
    console.error('=== DETECTED INVALID_DEFAULT_EXPORT ERROR ===');
    console.error('This indicates a missing or malformed default export in a page/layout file');
  }
  process.exit(1);
});

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${cmd} ${args.join(' ')}`);
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=4096 --unhandled-rejections=strict'
      }
    });    p.on('exit', code => {
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
    console.log('=== STARTING NEXT.JS BUILD ===');
    await run('npx', ['next', 'build']);
    console.log('Next.js build completed successfully');
  } catch (e) {
    console.error('=== NEXT.JS BUILD FAILED ===');
    console.error('Error message:', e.message);
    console.error('Error stack:', e.stack);
    process.exit(1);
  }
})().catch((error) => {
  console.error('=== BUILD WRAPPER FAILED ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});
