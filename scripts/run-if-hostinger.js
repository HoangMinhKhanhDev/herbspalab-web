#!/usr/bin/env node
/**
 * Guard script: only run the full Hostinger build pipeline when the
 * install is happening inside Hostinger's deploy container.
 *
 * Why: this script runs as `postinstall` for the root package.json.
 *   - On Hostinger Git Deploy, after cloning the repo and `npm install`,
 *     we want to build frontend + backend + install prod deps.
 *   - On local dev machines (or CI), running `npm install` at the repo
 *     root should NOT trigger this heavy build — otherwise contributors
 *     hit long installs and recursive npm calls.
 *
 * Detection (any one is enough):
 *   - env HOSTINGER_DEPLOY=1 (manual override / set in hPanel)
 *   - presence of typical Hostinger env vars / paths
 *   - cwd path contains "/domains/" and "/public_html"  (Hostinger layout)
 *
 * Safe-by-default: if none match → exit 0 (skip build).
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const cwd = process.cwd();
const isHostinger =
  process.env.HOSTINGER_DEPLOY === '1' ||
  process.env.HOSTINGER === '1' ||
  /\/domains\/[^/]+\/public_html/i.test(cwd) ||
  existsSync('/etc/hostinger') ||
  // Hostinger Node apps usually have PASSENGER_BASE_URI or are launched
  // from a path under /home/<user>/domains
  (/^\/home\/[^/]+\/domains\//i.test(cwd));

if (!isHostinger) {
  console.log('[postinstall] Not on Hostinger — skipping auto-build. ' +
    'Run `npm run build` manually if you want to build locally.');
  process.exit(0);
}

console.log('[postinstall] Hostinger environment detected — running full deploy build...');
console.log('[postinstall] cwd =', cwd);

try {
  execSync('npm run deploy:hostinger', { stdio: 'inherit', cwd });
  console.log('[postinstall] ✅ Build complete.');
} catch (err) {
  console.error('[postinstall] ❌ Build failed:', err.message);
  process.exit(1);
}
