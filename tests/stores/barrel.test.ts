/**
 * Stores barrel test — verifies the ./stores subpath exports each factory.
 * Covers M8.7 (#168).
 */
import { describe, it, expect } from 'vitest';
import {
  createSelectionStore,
  createViewportStore,
  createWorklistStore,
  createUIPrefsStore,
  SelectionStoreProvider,
  ViewportStoreProvider,
  WorklistStoreProvider,
  UIPrefsStoreProvider,
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

describe('stores barrel (#168)', () => {
  it('exports createSelectionStore as a function', () => {
    expect(typeof createSelectionStore).toBe('function');
  });

  it('exports createViewportStore as a function', () => {
    expect(typeof createViewportStore).toBe('function');
  });

  it('exports createWorklistStore as a function', () => {
    expect(typeof createWorklistStore).toBe('function');
  });

  it('exports createUIPrefsStore as a function', () => {
    expect(typeof createUIPrefsStore).toBe('function');
  });

  it('exports context providers as functions', () => {
    expect(typeof SelectionStoreProvider).toBe('function');
    expect(typeof ViewportStoreProvider).toBe('function');
    expect(typeof WorklistStoreProvider).toBe('function');
    expect(typeof UIPrefsStoreProvider).toBe('function');
  });

  it('exports context-bound hooks as functions', () => {
    expect(typeof useSelection).toBe('function');
    expect(typeof useViewport).toBe('function');
    expect(typeof useWorklist).toBe('function');
    expect(typeof useUIPrefs).toBe('function');
    expect(typeof useTheme).toBe('function');
    expect(typeof useDensity).toBe('function');
    expect(typeof useLayerColor).toBe('function');
    expect(typeof useStatusColor).toBe('function');
    expect(typeof useAccentColor).toBe('function');
    expect(typeof useSuiteSiblings).toBe('function');
  });

  it('exports GPU dispatch hooks as functions', () => {
    expect(typeof useStageCall).toBe('function');
    expect(typeof useLongJob).toBe('function');
  });

  it('each factory returns a different store instance', () => {
    const a = createSelectionStore();
    const b = createSelectionStore();
    expect(a).not.toBe(b);
  });
});
