import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

// process.cwd() is the repo root in Vitest (jsdom doesn't support file:// import.meta.url)
const primitivesDir = resolve(process.cwd(), 'src/primitives');

function collectFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('no-cva: src/primitives must not reference class-variance-authority', () => {
  const files = collectFiles(primitivesDir);

  it('has at least one source file to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('contains no import statement for class-variance-authority', () => {
    // Check only for import statements, not comments/docs mentioning the name
    const cvaImportPattern =
      /(?:^|[\n\r])(?:import|require)[^'"`]*['"`]class-variance-authority['"`]/m;
    const violations: string[] = [];
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      if (cvaImportPattern.test(content)) {
        violations.push(file);
      }
    }
    expect(violations).toEqual([]);
  });

  it('contains no cva( function call (runtime usage)', () => {
    // Match cva( but not in comments (lines starting with //)
    const violations: string[] = [];
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      // Filter out comment lines before checking
      const nonCommentContent = content
        .split('\n')
        .filter((line) => !line.trimStart().startsWith('//') && !line.trimStart().startsWith('*'))
        .join('\n');
      if (nonCommentContent.includes('cva(')) {
        violations.push(file);
      }
    }
    expect(violations).toEqual([]);
  });
});
