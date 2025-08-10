#!/usr/bin/env node
// Cross-platform build wrapper: runs prestart probe then Next build.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    p.on('exit', code => code === 0 ? resolve(0) : reject(new Error(`${cmd} exited with ${code}`)));
  });
}

(async () => {
  const prestart = path.join(root, 'scripts', 'prestart.js');
  try {
    await run('node', [prestart]);
  } catch (e) {
    console.warn('[BUILD-WRAPPER] Prestart failed (continuing):', e.message);
  }
  await run('npx', ['next', 'build']);
})();
