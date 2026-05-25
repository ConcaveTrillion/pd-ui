/**
 * Tests for canvas hooks (M5.2):
 *   - useCanvasCoords
 *   - useViewport
 *   - useCanvasSelection
 *
 * Each hook is tested:
 *   1. When called inside <PageImageCanvas> — returns the expected shape.
 *   2. When called outside <PageImageCanvas> — throws with a descriptive error.
 *
 * react-konva is mocked because jsdom can't run the canvas renderer.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Mock react-konva before any canvas imports
vi.mock('react-konva', () => ({
  Stage: ({
    children,
    width,
    height,
  }: {
    children?: React.ReactNode;
    width?: number;
    height?: number;
  }) => (
    <div data-testid="konva-stage" data-width={width} data-height={height}>
      {children}
    </div>
  ),
  Layer: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Rect: () => <div data-testid="konva-rect" />,
}));

import { PageImageCanvas } from '../../src/canvas/PageImageCanvas';
import { useCanvasCoords } from '../../src/canvas/hooks/useCanvasCoords';
import { useViewport } from '../../src/canvas/hooks/useViewport';
import { useCanvasSelection } from '../../src/canvas/hooks/useCanvasSelection';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockWord = {
  bounding_box: {
    is_normalized: false,
    top_left: { is_normalized: false, x: 10, y: 20 },
    bottom_right: { is_normalized: false, x: 60, y: 40 },
  },
  text: 'hello',
  ocr_confidence: 0.95,
  review: null,
  word_labels: [],
  text_style_labels: [],
};

const mockPage = {
  width: 400,
  height: 600,
  page_index: 0,
  name: 'page-1',
  image_path: '/img.png',
  items: [],
  review: null,
};

// ── useCanvasCoords ───────────────────────────────────────────────────────────

describe('useCanvasCoords', () => {
  it('returns CoordContext shape when inside PageImageCanvas', () => {
    let result: ReturnType<typeof useCanvasCoords> | undefined;

    function Consumer() {
      result = useCanvasCoords();
      return null;
    }

    render(
      <PageImageCanvas src="/test.png" page={mockPage} words={[mockWord]}>
        {{ hud: () => <Consumer /> }}
      </PageImageCanvas>,
    );

    expect(result).toBeDefined();
    expect(typeof result?.scale).toBe('number');
    expect(typeof result?.stageWidth).toBe('number');
    expect(typeof result?.stageHeight).toBe('number');
    expect(typeof result?.pageWidth).toBe('number');
    expect(typeof result?.pageHeight).toBe('number');
    expect(result?.pageWidth).toBe(400);
    expect(result?.pageHeight).toBe(600);
  });

  it('throws descriptive error when called outside PageImageCanvas', () => {
    function Consumer() {
      useCanvasCoords();
      return null;
    }
    expect(() => render(<Consumer />)).toThrow(/useCanvasCoords/);
    expect(() => render(<Consumer />)).toThrow(/PageImageCanvas/);
  });
});

// ── useViewport ───────────────────────────────────────────────────────────────

describe('useViewport', () => {
  it('returns ViewportState shape when inside PageImageCanvas', () => {
    let result: ReturnType<typeof useViewport> | undefined;

    function Consumer() {
      result = useViewport();
      return null;
    }

    render(
      <PageImageCanvas src="/test.png" page={mockPage} words={[mockWord]}>
        {{ hud: () => <Consumer /> }}
      </PageImageCanvas>,
    );

    expect(result).toBeDefined();
    expect(typeof result?.scale).toBe('number');
    expect(typeof result?.pan).toBe('object');
    expect(typeof result?.pan.x).toBe('number');
    expect(typeof result?.pan.y).toBe('number');
  });

  it('throws descriptive error when called outside PageImageCanvas', () => {
    function Consumer() {
      useViewport();
      return null;
    }
    expect(() => render(<Consumer />)).toThrow(/useViewport/);
    expect(() => render(<Consumer />)).toThrow(/PageImageCanvas/);
  });
});

// ── useCanvasSelection ────────────────────────────────────────────────────────

describe('useCanvasSelection', () => {
  it('returns SelectionState + setSelection when inside PageImageCanvas', () => {
    let result: ReturnType<typeof useCanvasSelection> | undefined;

    function Consumer() {
      result = useCanvasSelection();
      return null;
    }

    render(
      <PageImageCanvas src="/test.png" page={mockPage} words={[mockWord]}>
        {{ hud: () => <Consumer /> }}
      </PageImageCanvas>,
    );

    expect(result).toBeDefined();
    expect(result?.selection.ids).toBeInstanceOf(Set);
    expect(typeof result?.setSelection).toBe('function');
  });

  it('throws descriptive error when called outside PageImageCanvas', () => {
    function Consumer() {
      useCanvasSelection();
      return null;
    }
    expect(() => render(<Consumer />)).toThrow(/useCanvasSelection/);
    expect(() => render(<Consumer />)).toThrow(/PageImageCanvas/);
  });
});
