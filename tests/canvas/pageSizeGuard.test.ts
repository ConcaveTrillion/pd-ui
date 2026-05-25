/**
 * Tests for pageSizeGuard — issue #29.
 *
 * Verifies that page-level metadata (width/height) is validated and clamped
 * before being used to size the Konva stage.  Covers:
 *   - Normal dimensions (pass through unchanged)
 *   - Oversize dimensions (clamped to PAGE_DIMENSION_MAX)
 *   - Zero dimensions (rejected)
 *   - Negative dimensions (rejected)
 *   - NaN dimensions (rejected)
 *   - Infinity dimensions (rejected)
 *   - Missing/undefined dimensions (rejected via TypeScript but guarded at runtime)
 *   - Both axes oversized simultaneously
 *   - Asymmetric oversize (one axis clamped, one valid)
 */

import { describe, it, expect } from 'vitest';
import {
  PAGE_DIMENSION_MAX,
  validatePageDimensions,
  clampPageDimensions,
  isPageDimensionsValid,
} from '../../src/canvas/pageSizeGuard';

describe('PAGE_DIMENSION_MAX', () => {
  it('is a positive finite number at most 16384', () => {
    expect(PAGE_DIMENSION_MAX).toBeGreaterThan(0);
    expect(isFinite(PAGE_DIMENSION_MAX)).toBe(true);
    expect(PAGE_DIMENSION_MAX).toBeLessThanOrEqual(16384);
  });
});

describe('isPageDimensionsValid', () => {
  it('accepts normal dimensions', () => {
    expect(isPageDimensionsValid(400, 600)).toBe(true);
  });

  it('accepts dimensions equal to PAGE_DIMENSION_MAX', () => {
    expect(isPageDimensionsValid(PAGE_DIMENSION_MAX, PAGE_DIMENSION_MAX)).toBe(true);
  });

  it('rejects zero width', () => {
    expect(isPageDimensionsValid(0, 600)).toBe(false);
  });

  it('rejects zero height', () => {
    expect(isPageDimensionsValid(400, 0)).toBe(false);
  });

  it('rejects negative width', () => {
    expect(isPageDimensionsValid(-1, 600)).toBe(false);
  });

  it('rejects negative height', () => {
    expect(isPageDimensionsValid(400, -1)).toBe(false);
  });

  it('rejects NaN width', () => {
    expect(isPageDimensionsValid(NaN, 600)).toBe(false);
  });

  it('rejects NaN height', () => {
    expect(isPageDimensionsValid(400, NaN)).toBe(false);
  });

  it('rejects Infinity width', () => {
    expect(isPageDimensionsValid(Infinity, 600)).toBe(false);
  });

  it('rejects Infinity height', () => {
    expect(isPageDimensionsValid(400, Infinity)).toBe(false);
  });

  it('rejects -Infinity', () => {
    expect(isPageDimensionsValid(-Infinity, 600)).toBe(false);
  });

  it('rejects dimensions exceeding PAGE_DIMENSION_MAX on width', () => {
    expect(isPageDimensionsValid(PAGE_DIMENSION_MAX + 1, 600)).toBe(false);
  });

  it('rejects dimensions exceeding PAGE_DIMENSION_MAX on height', () => {
    expect(isPageDimensionsValid(400, PAGE_DIMENSION_MAX + 1)).toBe(false);
  });

  it('rejects both axes over limit', () => {
    expect(isPageDimensionsValid(PAGE_DIMENSION_MAX + 1, PAGE_DIMENSION_MAX + 1)).toBe(false);
  });
});

describe('validatePageDimensions', () => {
  it('returns { valid: true } for normal dimensions', () => {
    const result = validatePageDimensions(400, 600);
    expect(result.valid).toBe(true);
  });

  it('returns { valid: false } with a reason for zero width', () => {
    const result = validatePageDimensions(0, 600);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(typeof result.reason).toBe('string');
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });

  it('returns { valid: false } for NaN height', () => {
    const result = validatePageDimensions(400, NaN);
    expect(result.valid).toBe(false);
  });

  it('returns { valid: false } for oversize width', () => {
    const result = validatePageDimensions(99999, 600);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toMatch(/exceed/i);
    }
  });

  it('returns { valid: false } for negative dimensions', () => {
    const result = validatePageDimensions(-100, -200);
    expect(result.valid).toBe(false);
  });
});

describe('clampPageDimensions', () => {
  it('passes through valid dimensions unchanged', () => {
    expect(clampPageDimensions(400, 600)).toEqual({ width: 400, height: 600 });
  });

  it('clamps an oversized width to PAGE_DIMENSION_MAX', () => {
    const { width, height } = clampPageDimensions(99999, 600);
    expect(width).toBe(PAGE_DIMENSION_MAX);
    expect(height).toBe(600);
  });

  it('clamps an oversized height to PAGE_DIMENSION_MAX', () => {
    const { width, height } = clampPageDimensions(400, 99999);
    expect(width).toBe(400);
    expect(height).toBe(PAGE_DIMENSION_MAX);
  });

  it('clamps both axes when both are oversized', () => {
    const { width, height } = clampPageDimensions(99999, 99999);
    expect(width).toBe(PAGE_DIMENSION_MAX);
    expect(height).toBe(PAGE_DIMENSION_MAX);
  });

  it('returns fallback dimensions for zero width', () => {
    const { width, height } = clampPageDimensions(0, 600);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  it('returns fallback dimensions for negative height', () => {
    const { width, height } = clampPageDimensions(400, -50);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  it('returns fallback dimensions for NaN', () => {
    const { width, height } = clampPageDimensions(NaN, NaN);
    expect(Number.isFinite(width)).toBe(true);
    expect(Number.isFinite(height)).toBe(true);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  it('returns fallback dimensions for Infinity', () => {
    const { width, height } = clampPageDimensions(Infinity, 600);
    expect(width).toBe(PAGE_DIMENSION_MAX);
    expect(Number.isFinite(height)).toBe(true);
  });
});
