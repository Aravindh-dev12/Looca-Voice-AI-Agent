import { spawn } from 'node:child_process';
import path from 'node:path';

const isRender =
  process.env.RENDER === 'true' ||
  Boolean(process.env.RENDER_SERVICE_ID) ||
  Boolean(process.env.RENDER_EXTERNAL_HOSTNAME);

const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
const port = process.env.PORT || '3000';

const args = isRender
  ? [nextBin, 'start', '--hostname', '0.0.0.0', '--port', port]
  : [nextBin, 'dev'];

console.log(
  isRender
    ? `Starting Looca production server on 0.0.0.0:${port}`
    : 'Starting Looca local development server'
);

const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    ...(isRender ? { NODE_ENV: 'production' } : {}),
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
