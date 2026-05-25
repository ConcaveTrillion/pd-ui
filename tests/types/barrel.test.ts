/**
 * Tests for src/types/index.ts barrel (M4.5, M4.6)
 *
 * Verifies that:
 * 1. WordLike, BlockLike, PageLike are exported from src/types/index.ts
 * 2. They re-export the generated types (Word, Block, Page)
 * 3. The types subpath exports are wired in vite.config.ts
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../..');

describe('src/types/index.ts barrel', () => {
  it('exports WordLike', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/index.ts'), 'utf-8');
    expect(content).toContain('WordLike');
  });

  it('exports BlockLike', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/index.ts'), 'utf-8');
    expect(content).toContain('BlockLike');
  });

  it('exports PageLike', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/index.ts'), 'utf-8');
    expect(content).toContain('PageLike');
  });

  it('re-exports from generated/book-tools', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/index.ts'), 'utf-8');
    expect(content).toContain("from './generated/book-tools'");
  });

  it('WordLike Pick includes bounding_box, text, ocr_confidence', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/index.ts'), 'utf-8');
    expect(content).toContain('bounding_box');
    expect(content).toContain('ocr_confidence');
    expect(content).toContain('text');
  });

  it('BlockLike Pick includes block_category, bounding_box, items, review', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/index.ts'), 'utf-8');
    expect(content).toContain('block_category');
    expect(content).toContain('items');
    expect(content).toContain('review');
  });

  it('PageLike Pick includes page_index, name, image_path, width, height', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/index.ts'), 'utf-8');
    expect(content).toContain('page_index');
    expect(content).toContain('image_path');
    expect(content).toContain('width');
    expect(content).toContain('height');
  });

  it('vite.config.ts has types entry', () => {
    const viteConfig = readFileSync(join(REPO_ROOT, 'vite.config.ts'), 'utf-8');
    expect(viteConfig).toContain("types: resolve(__dirname, 'src/types/index.ts')");
  });

  it('package.json exports ./types points to dist/types', () => {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf-8')) as {
      exports?: Record<string, { import?: string; types?: string }>;
    };
    const typesExport = pkg.exports?.['./types'];
    expect(typesExport).toBeDefined();
    expect(typesExport?.import).toContain('dist/types.js');
  });

  // Regression guard for pd-ui#15: JobState must stay exported from /types.
  // pd-ocr-simple-gui imports `JobState` from "@concavetrillion/pd-ui/types".
  it('exports JobState from job-state.ts', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/index.ts'), 'utf-8');
    expect(content, 'JobState must be re-exported from src/types/index.ts').toContain('JobState');
  });

  it('src/types/job-state.ts exists and exports JobState', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/types/job-state.ts'), 'utf-8');
    expect(content).toContain('JobState');
    // Must derive from the ocr-ops generated schema, not a hand-rolled union
    expect(content).toContain("components['schemas']['JobStatus']['state']");
  });
});
