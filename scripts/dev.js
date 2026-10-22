import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const viteEntry = resolve(projectRoot, 'node_modules/vite/bin/vite.js');
const apiEntry = resolve(projectRoot, 'server/index.js');
const children = [
  spawn(process.execPath, [viteEntry, '--host', '127.0.0.1'], { cwd: projectRoot, stdio: 'inherit' }),
  spawn(process.execPath, [apiEntry], { cwd: projectRoot, stdio: 'inherit' }),
];
let stopping = false;

function stopAll(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  process.exitCode = code;
}

for (const child of children) {
  child.on('error', (error) => {
    console.error('Não foi possível iniciar um dos servidores de desenvolvimento:', error.message);
    stopAll(1);
  });
  child.on('exit', (code) => {
    if (!stopping && code !== 0) stopAll(code ?? 1);
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
