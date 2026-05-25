import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// tsconfig.json is standard JSON (no comments) — parse directly
const tsconfig = JSON.parse(readFileSync(resolve(__dirname, '../tsconfig.json'), 'utf-8')) as {
  compilerOptions: Record<string, unknown>;
};

describe('tsconfig.json contract', () => {
  const opts = tsconfig.compilerOptions;

  it('has strict: true', () => {
    expect(opts['strict']).toBe(true);
  });

  it('has noUncheckedIndexedAccess: true', () => {
    expect(opts['noUncheckedIndexedAccess']).toBe(true);
  });

  it('has exactOptionalPropertyTypes: true', () => {
    expect(opts['exactOptionalPropertyTypes']).toBe(true);
  });

  it('uses bundler moduleResolution', () => {
    expect(opts['moduleResolution']).toBe('bundler');
  });

  it('uses react-jsx', () => {
    expect(opts['jsx']).toBe('react-jsx');
  });

  it('targets ES2022', () => {
    expect(opts['target']).toBe('ES2022');
  });
});
