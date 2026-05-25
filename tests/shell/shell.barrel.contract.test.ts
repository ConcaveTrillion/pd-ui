/**
 * Shell barrel contract test — prevents docs/exports drift.
 *
 * The shell barrel (src/shell/index.ts) has two hooks in the SuiteSiblings
 * family:
 *   - useSuiteSiblingsContext  (low-level; lives in /shell)
 *   - useSuiteSiblings         (consumer alias; lives in /stores)
 *
 * This test guards against the inversion that was filed as issue #46:
 * the barrel JSDoc previously claimed to export `useSuiteSiblings` while
 * the actual export statement said `useSuiteSiblingsContext`.
 *
 * Strategy: parse the barrel source text statically so the test runs even
 * before `pnpm build`, and without importing the module (avoids React env
 * requirements here).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHELL_BARREL = resolve(__dirname, '../../src/shell/index.ts');

function readBarrel(): string {
  return readFileSync(SHELL_BARREL, 'utf-8');
}

describe('shell barrel exports contract (issue #46 guard)', () => {
  it('exports useSuiteSiblingsContext (low-level hook)', () => {
    const src = readBarrel();
    // Must have an actual export statement for the context hook.
    expect(src, 'shell barrel must export useSuiteSiblingsContext').toMatch(
      /export\s+\{[^}]*useSuiteSiblingsContext[^}]*\}/,
    );
  });

  it('does NOT export useSuiteSiblings (that alias belongs in /stores)', () => {
    const src = readBarrel();
    // useSuiteSiblings must NOT appear in an export { ... } statement.
    // We allow it in comments (the JSDoc or inline remarks).
    const exportStatements = src
      .split('\n')
      .filter((line) => /^\s*export\s+/.test(line))
      .join('\n');
    expect(
      exportStatements,
      'shell barrel must NOT export useSuiteSiblings — use @concavetrillion/pd-ui/stores instead',
    ).not.toMatch(/useSuiteSiblings[^C]/);
  });

  it('JSDoc header mentions useSuiteSiblingsContext, not useSuiteSiblings as the primary hook name', () => {
    const src = readBarrel();
    // The block comment at the top of the file must reference the correct name.
    const jsdocBlock = src.match(/^\/\*\*[\s\S]*?\*\//)?.[0] ?? '';
    expect(jsdocBlock, 'shell barrel JSDoc must reference useSuiteSiblingsContext').toContain(
      'useSuiteSiblingsContext',
    );
    // The bullet-point line for the SuiteSiblings section must name the hook
    // that /shell actually exports (useSuiteSiblingsContext), not the /stores
    // consumer alias (useSuiteSiblings).
    // We detect the pre-fix form: a jsdoc bullet listing "useSuiteSiblings" as
    // the hook WITHOUT "Context" suffix on the SuiteSiblingsProvider bullet line.
    // Parenthetical mentions of the alias are fine — only the bullet header is tested.
    const suiteSiblingsBullet = jsdocBlock
      .split('\n')
      .find((line) => line.includes('SuiteSiblingsProvider'));
    expect(
      suiteSiblingsBullet,
      'SuiteSiblingsProvider bullet must exist in shell barrel JSDoc',
    ).toBeTruthy();
    expect(
      suiteSiblingsBullet,
      'SuiteSiblingsProvider bullet must name useSuiteSiblingsContext (not bare useSuiteSiblings)',
    ).toContain('useSuiteSiblingsContext');
  });

  it('stores/useSuiteSiblings.ts re-exports useSuiteSiblingsContext as useSuiteSiblings', () => {
    const STORES_HOOK = resolve(__dirname, '../../src/stores/useSuiteSiblings.ts');
    const src = readFileSync(STORES_HOOK, 'utf-8');
    expect(
      src,
      'stores/useSuiteSiblings.ts must re-export useSuiteSiblingsContext as useSuiteSiblings',
    ).toMatch(/export\s+\{[^}]*useSuiteSiblingsContext\s+as\s+useSuiteSiblings[^}]*\}/);
  });
});
