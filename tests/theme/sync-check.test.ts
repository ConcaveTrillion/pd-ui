import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'child_process';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SYNC_SCRIPT = resolve(__dirname, '../../scripts/sync-design-system.mjs');
const NODE = process.execPath;

function buildInSyncWorkspace(): string {
  const tmpRoot = mkdtempSync(resolve(tmpdir(), 'pd-ui-check-test-'));

  const themeDir = resolve(tmpRoot, 'pd-ui', 'theme');
  mkdirSync(themeDir, { recursive: true });

  const docsDir = resolve(tmpRoot, 'docs', 'design-system');
  mkdirSync(docsDir, { recursive: true });

  const scriptsDir = resolve(tmpRoot, 'pd-ui', 'scripts');
  mkdirSync(scriptsDir, { recursive: true });

  const content = ':root { --sync: test; }';
  writeFileSync(resolve(themeDir, 'tokens.css'), content, 'utf-8');
  writeFileSync(resolve(themeDir, 'primitives.css'), content, 'utf-8');
  writeFileSync(resolve(docsDir, 'tokens.css'), content, 'utf-8');
  writeFileSync(resolve(docsDir, 'primitives.css'), content, 'utf-8');

  return tmpRoot;
}

function runCheckScript(tmpRoot: string, args: string[] = []): ReturnType<typeof spawnSync> {
  const patchedScriptPath = resolve(tmpRoot, 'pd-ui', 'scripts', 'sync-design-system.mjs');

  const originalScript = readFileSync(SYNC_SCRIPT, 'utf-8');
  const pdUiRootTmp = resolve(tmpRoot, 'pd-ui');
  const patchedScript = originalScript.replace(
    /const pdUiRoot = resolve\(__dirname, '\.\.'\)/,
    `const pdUiRoot = ${JSON.stringify(pdUiRootTmp)}`,
  );
  writeFileSync(patchedScriptPath, patchedScript, 'utf-8');

  return spawnSync(NODE, [patchedScriptPath, '--check', ...args], {
    encoding: 'utf-8',
    cwd: resolve(tmpRoot, 'pd-ui'),
  });
}

let tmpRoot: string;

beforeEach(() => {
  tmpRoot = buildInSyncWorkspace();
});

afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe('codegen:theme-check (sync --check mode)', () => {
  it('exits 0 when pd-ui/theme/ and docs/design-system/ are in sync', () => {
    const result = runCheckScript(tmpRoot);
    expect(
      result.status,
      `stderr: ${String(result.stderr ?? '')}\nstdout: ${String(result.stdout ?? '')}`,
    ).toBe(0);
  });

  it('exits non-zero when pd-ui/theme/tokens.css has been mutated', () => {
    // Mutate the pd-ui/theme/tokens.css to simulate drift
    writeFileSync(
      resolve(tmpRoot, 'pd-ui', 'theme', 'tokens.css'),
      ':root { --drifted: yes; }',
      'utf-8',
    );

    const result = runCheckScript(tmpRoot);
    expect(result.status).not.toBe(0);
    const output = String(result.stderr ?? '') + String(result.stdout ?? '');
    expect(output).toMatch(/diff detected|CHANGED/);
  });

  it('exits non-zero when pd-ui/theme/primitives.css has been mutated', () => {
    writeFileSync(
      resolve(tmpRoot, 'pd-ui', 'theme', 'primitives.css'),
      '.btn { drifted: true; }',
      'utf-8',
    );

    const result = runCheckScript(tmpRoot);
    expect(result.status).not.toBe(0);
  });
});
