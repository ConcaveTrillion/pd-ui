/**
 * Hook surface test — verifies all hooks listed in spec §6 are exported
 * by at least one subpath.
 * Covers M8.6 (#167).
 *
 * Canvas hooks are checked via file-content inspection (avoids Konva
 * node-canvas binary dependency in jsdom). Store/shell hooks are runtime
 * imported since they have no native-module dependencies.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../..');

// Runtime imports for non-canvas subpaths (safe in jsdom)
import {
  useSelection,
  useViewport,
  useWorklist,
  useUIPrefs,
  useTheme,
  useDensity,
  useLayerColor,
  useStatusColor,
  useAccentColor,
  useSuiteSiblings,
  useStageCall,
  useLongJob,
} from '../../src/stores/index.js';

import { useAppShell } from '../../src/shell/index.js';

describe('hook surface — canvas hooks (#167)', () => {
  it('canvas/index.ts exports useCanvasCoords', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('useCanvasCoords');
  });

  it('canvas/index.ts exports useCanvasSelection', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('useCanvasSelection');
  });

  it('canvas/index.ts exports useViewport (canvas-internal viewport hook)', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/canvas/index.ts'), 'utf-8');
    expect(content).toContain('useViewport');
  });
});

describe('hook surface — stores hooks (#167)', () => {
  it('useSelection exported from /stores', () => {
    expect(typeof useSelection).toBe('function');
  });

  it('useViewport exported from /stores', () => {
    expect(typeof useViewport).toBe('function');
  });

  it('useWorklist exported from /stores', () => {
    expect(typeof useWorklist).toBe('function');
  });

  it('useUIPrefs exported from /stores', () => {
    expect(typeof useUIPrefs).toBe('function');
  });

  it('useTheme exported from /stores', () => {
    expect(typeof useTheme).toBe('function');
  });

  it('useDensity exported from /stores', () => {
    expect(typeof useDensity).toBe('function');
  });

  it('useLayerColor exported from /stores', () => {
    expect(typeof useLayerColor).toBe('function');
  });

  it('useStatusColor exported from /stores', () => {
    expect(typeof useStatusColor).toBe('function');
  });

  it('useAccentColor exported from /stores', () => {
    expect(typeof useAccentColor).toBe('function');
  });

  it('useSuiteSiblings exported from /stores', () => {
    expect(typeof useSuiteSiblings).toBe('function');
  });

  it('useStageCall exported from /stores', () => {
    expect(typeof useStageCall).toBe('function');
  });

  it('useLongJob exported from /stores', () => {
    expect(typeof useLongJob).toBe('function');
  });
});

describe('hook surface — shell hooks (#167)', () => {
  it('useAppShell exported from /shell', () => {
    expect(typeof useAppShell).toBe('function');
  });
});
