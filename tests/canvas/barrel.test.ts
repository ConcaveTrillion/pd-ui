/**
 * Canvas subpath barrel test (M5.5, issue #149).
 *
 * Verifies that all expected exports are present in src/canvas/index.ts
 * and that vite.config.ts and package.json wire the canvas subpath.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../..');

describe('src/canvas/index.ts barrel', () => {
  it('exports PageImageCanvas', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('PageImageCanvas');
  });

  it('exports BBoxLayer', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('BBoxLayer');
  });

  it('exports WordHitLayer', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('WordHitLayer');
  });

  it('exports MarqueeSelectLayer', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('MarqueeSelectLayer');
  });

  it('exports useCanvasCoords', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('useCanvasCoords');
  });

  it('exports useViewport', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('useViewport');
  });

  it('exports useCanvasSelection', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('useCanvasSelection');
  });

  it('exports bboxToRect', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('bboxToRect');
  });

  it('exports CanvasProps type', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('CanvasProps');
  });

  it('vite.config.ts has canvas entry', () => {
    const viteConfig = readFileSync(join(REPO_ROOT, 'vite.config.ts'), 'utf-8');
    expect(viteConfig).toContain("canvas: resolve(__dirname, 'src/canvas/index.ts')");
  });

  it('package.json exports ./canvas points to dist/canvas', () => {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf-8')) as {
      exports?: Record<string, { import?: string; types?: string }>;
    };
    const canvasExport = pkg.exports?.['./canvas'];
    expect(canvasExport).toBeDefined();
    expect(canvasExport?.import).toContain('dist/canvas.js');
  });
});
