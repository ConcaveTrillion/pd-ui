/**
 * Store factory tests — covering #162.
 *
 * Each factory must:
 *  - Return a fresh Zustand store (never a singleton)
 *  - Expose the documented state shape
 *  - Fire state updates via the returned store
 */
import { describe, it, expect } from 'vitest';
import { createSelectionStore, createViewportStore, createWorklistStore } from './index.js';

// ─── createSelectionStore ──────────────────────────────────────────────────────

describe('createSelectionStore (#162)', () => {
  it('returns a new store each call', () => {
    const a = createSelectionStore();
    const b = createSelectionStore();
    expect(a).not.toBe(b);
  });

  it('initial state has empty ids', () => {
    const store = createSelectionStore();
    expect(store.getState().ids.size).toBe(0);
  });

  it('select() adds an id', () => {
    const store = createSelectionStore();
    store.getState().select('w1');
    expect(store.getState().ids.has('w1')).toBe(true);
  });

  it('deselect() removes an id', () => {
    const store = createSelectionStore();
    store.getState().select('w1');
    store.getState().deselect('w1');
    expect(store.getState().ids.has('w1')).toBe(false);
  });

  it('clearSelection() empties ids', () => {
    const store = createSelectionStore();
    store.getState().select('w1');
    store.getState().select('w2');
    store.getState().clearSelection();
    expect(store.getState().ids.size).toBe(0);
  });

  it('setSelection() replaces ids with a new Set', () => {
    const store = createSelectionStore();
    store.getState().select('w1');
    store.getState().setSelection(new Set(['w2', 'w3']));
    const ids = store.getState().ids;
    expect(ids.has('w1')).toBe(false);
    expect(ids.has('w2')).toBe(true);
    expect(ids.has('w3')).toBe(true);
  });
});

// ─── createViewportStore ───────────────────────────────────────────────────────

describe('createViewportStore (#162)', () => {
  it('returns a new store each call', () => {
    const a = createViewportStore();
    const b = createViewportStore();
    expect(a).not.toBe(b);
  });

  it('initial scale is 1.0', () => {
    const store = createViewportStore();
    expect(store.getState().scale).toBe(1.0);
  });

  it('initial pan is { x: 0, y: 0 }', () => {
    const store = createViewportStore();
    const { pan } = store.getState();
    expect(pan.x).toBe(0);
    expect(pan.y).toBe(0);
  });

  it('setScale() updates scale', () => {
    const store = createViewportStore();
    store.getState().setScale(2.5);
    expect(store.getState().scale).toBeCloseTo(2.5);
  });

  it('setPan() updates pan', () => {
    const store = createViewportStore();
    store.getState().setPan({ x: 100, y: 200 });
    expect(store.getState().pan).toEqual({ x: 100, y: 200 });
  });

  it('reset() restores initial state', () => {
    const store = createViewportStore();
    store.getState().setScale(3);
    store.getState().setPan({ x: 50, y: 50 });
    store.getState().reset();
    expect(store.getState().scale).toBe(1.0);
    expect(store.getState().pan).toEqual({ x: 0, y: 0 });
  });
});

// ─── createWorklistStore ──────────────────────────────────────────────────────

describe('createWorklistStore (#162)', () => {
  it('returns a new store each call', () => {
    const a = createWorklistStore();
    const b = createWorklistStore();
    expect(a).not.toBe(b);
  });

  it('initial activeIndex is null', () => {
    const store = createWorklistStore();
    expect(store.getState().activeIndex).toBeNull();
  });

  it('initial filter is ""', () => {
    const store = createWorklistStore();
    expect(store.getState().filter).toBe('');
  });

  it('setActiveIndex() updates activeIndex', () => {
    const store = createWorklistStore();
    store.getState().setActiveIndex(5);
    expect(store.getState().activeIndex).toBe(5);
  });

  it('setFilter() updates filter', () => {
    const store = createWorklistStore();
    store.getState().setFilter('foo');
    expect(store.getState().filter).toBe('foo');
  });

  it('clearFilter() resets filter to ""', () => {
    const store = createWorklistStore();
    store.getState().setFilter('hello');
    store.getState().clearFilter();
    expect(store.getState().filter).toBe('');
  });
});
