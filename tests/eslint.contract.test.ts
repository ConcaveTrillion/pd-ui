import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function runEslint(file: string): { exitCode: number; output: string } {
  try {
    const output = execSync(`pnpm exec eslint --no-ignore "${file}"`, {
      cwd: root,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { exitCode: 0, output };
  } catch (err: unknown) {
    const error = err as { status?: number; stdout?: string; stderr?: string };
    return {
      exitCode: error.status ?? 1,
      output: (error.stdout ?? '') + (error.stderr ?? ''),
    };
  }
}

describe('ESLint contract', () => {
  it('flags direct lucide-react import', () => {
    const file = resolve(root, 'tests/fixtures/lint-bad/lucide-direct.tsx');
    const result = runEslint(file);
    expect(result.exitCode).not.toBe(0);
    expect(result.output).toContain('lucide-react');
  });

  it('flags class-variance-authority import', () => {
    const file = resolve(root, 'tests/fixtures/lint-bad/cva.ts');
    const result = runEslint(file);
    expect(result.exitCode).not.toBe(0);
    expect(result.output).toContain('class-variance-authority');
  });

  it('passes clean file', () => {
    const file = resolve(root, 'tests/fixtures/lint-good/clean.ts');
    const result = runEslint(file);
    // Clean file should exit 0
    expect(result.exitCode).toBe(0);
  });
});
