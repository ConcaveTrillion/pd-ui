/**
 * Build smoke test — regression guard for es2022 target compatibility.
 *
 * Asserts that `pnpm build` exits 0 and produces the expected dist files.
 * Red phase: fails when Vite's default target (chrome87/es2020) can't
 * transpile rest-destructuring in forwardRef components.
 * Green phase: passes after build.target is set to 'es2022'.
 *
 * Runs in Node environment (no jsdom) via @vitest/env-node shim.
 * Excluded from coverage thresholds (build-runner, not app code).
 */
import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const DIST_ENTRIES = [
  'index.js',
  'canvas.js',
  'worklist.js',
  'shell.js',
  'primitives.js',
  'icons.js',
  'types.js',
  'stores.js',
  'testids.js',
  'templates.js',
] as const;

describe('pnpm build smoke (es2022 transpile regression)', () => {
  // Run the build once for this describe block.
  // execSync throws on non-zero exit — that's the assertion for commit 1 (red).
  let buildError: Error | null = null;

  try {
    execSync('pnpm build', {
      cwd: ROOT,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
  } catch (err) {
    buildError = err as Error;
  }

  it('pnpm build exits 0 (no transpile errors)', () => {
    if (buildError) {
      const output =
        (buildError as NodeJS.ErrnoException & { stdout?: string; stderr?: string }).stdout ?? '';
      const stderr =
        (buildError as NodeJS.ErrnoException & { stdout?: string; stderr?: string }).stderr ?? '';
      throw new Error(
        `pnpm build failed:\nstdout: ${output.slice(0, 2000)}\nstderr: ${stderr.slice(0, 2000)}`,
      );
    }
    expect(buildError).toBeNull();
  });

  for (const entry of DIST_ENTRIES) {
    it(`dist/${entry} exists after build`, () => {
      expect(
        existsSync(resolve(ROOT, 'dist', entry)),
        `dist/${entry} missing — build may have failed`,
      ).toBe(true);
    });
  }

  it('dist/ directory exists', () => {
    expect(existsSync(resolve(ROOT, 'dist')), 'dist/ must exist after pnpm build').toBe(true);
  });
});
