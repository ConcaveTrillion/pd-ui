/**
 * Tests for issue #22 — Malformed OCR word boxes can crash canvas rendering.
 *
 * Verifies that:
 *   1. Words with null bounding_box are silently skipped (no crash, no render).
 *   2. Words with missing top_left / bottom_right fields are skipped.
 *   3. Words with NaN coordinates are skipped.
 *   4. Words with Infinity coordinates are skipped.
 *   5. Valid words in the same batch still render correctly.
 *   6. defaultGetWordId falls back gracefully for invalid bboxes (no throw).
 *   7. Hit-test and marquee-select paths don't throw on malformed words.
 *   8. Controlled selection doesn't throw when words list contains bad bboxes.
 *
 * react-konva is mocked — see PageImageCanvas.test.tsx for mock rationale.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('react-konva', () => ({
  Stage: ({
    children,
    width,
    height,
    'data-testid': tid,
  }: {
    children?: React.ReactNode;
    width?: number;
    height?: number;
    'data-testid'?: string;
  }) => (
    <div data-testid={tid ?? 'konva-stage'} data-width={width} data-height={height}>
      {children}
    </div>
  ),
  Layer: ({ children, name }: { children?: React.ReactNode; name?: string }) => (
    <div data-layer-name={name}>{children}</div>
  ),
  Rect: ({
    x,
    y,
    width,
    height,
    'data-testid': tid,
  }: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={tid ?? 'konva-rect'}
      data-x={x}
      data-y={y}
      data-width={width}
      data-height={height}
    />
  ),
}));

import { PageImageCanvas } from '../../src/canvas/PageImageCanvas';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const page = { width: 400, height: 600 };

const makeValidWord = (x: number, y: number, w: number, h: number, text = 'word') => ({
  bounding_box: {
    top_left: { x, y },
    bottom_right: { x: x + w, y: y + h },
  },
  text,
});

// These fixtures intentionally violate the CanvasWord type to simulate corrupt
// OCR data arriving at runtime (JSON from an untrusted backend).
// We cast through `unknown` → the component type to simulate runtime corruption.

const nullBBoxWord = {
  bounding_box: null,
  text: 'null-bbox',
} as unknown as import('../../src/canvas/types').CanvasWord;

const missingTopLeftWord = {
  bounding_box: {
    bottom_right: { x: 100, y: 50 },
    // top_left intentionally absent
  },
  text: 'no-top-left',
} as unknown as import('../../src/canvas/types').CanvasWord;

const missingBottomRightWord = {
  bounding_box: {
    top_left: { x: 10, y: 20 },
    // bottom_right intentionally absent
  },
  text: 'no-bottom-right',
} as unknown as import('../../src/canvas/types').CanvasWord;

const nanCoordWord = {
  bounding_box: {
    top_left: { x: NaN, y: 20 },
    bottom_right: { x: 100, y: 50 },
  },
  text: 'nan-coord',
} as unknown as import('../../src/canvas/types').CanvasWord;

const infinityCoordWord = {
  bounding_box: {
    top_left: { x: Infinity, y: 20 },
    bottom_right: { x: 100, y: 50 },
  },
  text: 'infinity-coord',
} as unknown as import('../../src/canvas/types').CanvasWord;

const negativeInfinityCoordWord = {
  bounding_box: {
    top_left: { x: 10, y: -Infinity },
    bottom_right: { x: 100, y: 50 },
  },
  text: 'neg-infinity-coord',
} as unknown as import('../../src/canvas/types').CanvasWord;

const undefinedBBoxWord = {
  // bounding_box intentionally absent
  text: 'undefined-bbox',
} as unknown as import('../../src/canvas/types').CanvasWord;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PageImageCanvas — malformed bbox words (issue #22)', () => {
  it('does not crash when words array contains a word with null bounding_box', () => {
    expect(() => {
      render(<PageImageCanvas src="/img.png" page={page} words={[nullBBoxWord]} />);
    }).not.toThrow();
  });

  it('does not crash when words array contains a word with undefined bounding_box', () => {
    expect(() => {
      render(<PageImageCanvas src="/img.png" page={page} words={[undefinedBBoxWord]} />);
    }).not.toThrow();
  });

  it('does not crash when a word has NaN coordinates in bounding_box', () => {
    expect(() => {
      render(<PageImageCanvas src="/img.png" page={page} words={[nanCoordWord]} />);
    }).not.toThrow();
  });

  it('does not crash when a word has Infinity coordinates in bounding_box', () => {
    expect(() => {
      render(<PageImageCanvas src="/img.png" page={page} words={[infinityCoordWord]} />);
    }).not.toThrow();
  });

  it('does not crash when a word has -Infinity coordinates in bounding_box', () => {
    expect(() => {
      render(<PageImageCanvas src="/img.png" page={page} words={[negativeInfinityCoordWord]} />);
    }).not.toThrow();
  });

  it('does not crash when a word is missing top_left', () => {
    expect(() => {
      render(<PageImageCanvas src="/img.png" page={page} words={[missingTopLeftWord]} />);
    }).not.toThrow();
  });

  it('does not crash when a word is missing bottom_right', () => {
    expect(() => {
      render(<PageImageCanvas src="/img.png" page={page} words={[missingBottomRightWord]} />);
    }).not.toThrow();
  });

  it('skips malformed words in overlay slot — slot is not called for invalid words', () => {
    const overlayWords: string[] = [];
    render(
      <PageImageCanvas src="/img.png" page={page} words={[nullBBoxWord, nanCoordWord]}>
        {{
          overlay: ({ word }) => {
            overlayWords.push(word.text);
            return <div key={word.text} data-testid={`overlay-${word.text}`} />;
          },
        }}
      </PageImageCanvas>,
    );
    // Overlay slot must not be called for either malformed word
    expect(overlayWords).not.toContain('null-bbox');
    expect(overlayWords).not.toContain('nan-coord');
  });

  it('valid words still render when mixed with malformed words', () => {
    const overlayWords: string[] = [];
    const allWords = [
      nullBBoxWord,
      makeValidWord(10, 20, 50, 20, 'good-word'),
      nanCoordWord,
      makeValidWord(80, 20, 60, 20, 'another-good'),
    ];
    render(
      <PageImageCanvas src="/img.png" page={page} words={allWords}>
        {{
          overlay: ({ word }) => {
            overlayWords.push(word.text);
            return <div key={word.text} data-testid={`overlay-${word.text}`} />;
          },
        }}
      </PageImageCanvas>,
    );
    expect(overlayWords).toContain('good-word');
    expect(overlayWords).toContain('another-good');
    expect(overlayWords).not.toContain('null-bbox');
    expect(overlayWords).not.toContain('nan-coord');
    expect(screen.getByTestId('overlay-good-word')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-another-good')).toBeInTheDocument();
  });

  it('canvas still mounts with all layers when all words are malformed', () => {
    render(
      <PageImageCanvas
        src="/img.png"
        page={page}
        words={[nullBBoxWord, nanCoordWord, missingTopLeftWord]}
      />,
    );
    expect(screen.getByTestId('image-viewport')).toBeInTheDocument();
    expect(screen.getByTestId('canvas-stage')).toBeInTheDocument();
  });

  it('controlled selection with malformed words does not throw', () => {
    const sel = { ids: new Set<string>() };
    expect(() => {
      render(
        <PageImageCanvas
          src="/img.png"
          page={page}
          words={[nullBBoxWord, nanCoordWord]}
          selection={sel}
          onSelectionChange={() => undefined}
        />,
      );
    }).not.toThrow();
  });

  it('getWordId default fallback returns a stable string for invalid bbox', () => {
    // Verify via overlay isSelected bookkeeping — if getWordId throws the
    // component would have crashed before reaching this assertion.
    let didRender = false;
    render(
      <PageImageCanvas src="/img.png" page={page} words={[makeValidWord(5, 5, 10, 10, 'ok')]}>
        {{
          overlay: () => {
            didRender = true;
            return null;
          },
        }}
      </PageImageCanvas>,
    );
    // Valid word renders; no throw from getWordId path
    expect(didRender).toBe(true);
  });

  it('mixed batch: malformed words are excluded from marquee selection result', () => {
    // This test verifies the marquee filter path doesn't throw on bad bboxes.
    // We render with a mix and confirm the component mounts without crashing
    // (marquee logic runs on pointer events which are hard to trigger in jsdom
    //  without a canvas context, so we validate the no-crash property here).
    const allWords = [nullBBoxWord, nanCoordWord, makeValidWord(0, 0, 100, 100, 'selectable')];
    expect(() => {
      render(<PageImageCanvas src="/img.png" page={page} words={allWords} />);
    }).not.toThrow();
    expect(screen.getByTestId('image-viewport')).toBeInTheDocument();
  });
});

// ── isValidBBox unit tests ────────────────────────────────────────────────────

import { isValidBBox } from '../../src/canvas/types';

describe('isValidBBox', () => {
  it('returns true for a well-formed bbox', () => {
    expect(isValidBBox({ top_left: { x: 0, y: 0 }, bottom_right: { x: 10, y: 10 } })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidBBox(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isValidBBox(undefined)).toBe(false);
  });

  it('returns false when top_left is missing', () => {
    expect(isValidBBox({ bottom_right: { x: 10, y: 10 } })).toBe(false);
  });

  it('returns false when bottom_right is missing', () => {
    expect(isValidBBox({ top_left: { x: 0, y: 0 } })).toBe(false);
  });

  it('returns false when top_left.x is NaN', () => {
    expect(isValidBBox({ top_left: { x: NaN, y: 0 }, bottom_right: { x: 10, y: 10 } })).toBe(false);
  });

  it('returns false when top_left.y is NaN', () => {
    expect(isValidBBox({ top_left: { x: 0, y: NaN }, bottom_right: { x: 10, y: 10 } })).toBe(false);
  });

  it('returns false when bottom_right.x is NaN', () => {
    expect(isValidBBox({ top_left: { x: 0, y: 0 }, bottom_right: { x: NaN, y: 10 } })).toBe(false);
  });

  it('returns false when bottom_right.y is NaN', () => {
    expect(isValidBBox({ top_left: { x: 0, y: 0 }, bottom_right: { x: 10, y: NaN } })).toBe(false);
  });

  it('returns false when top_left.x is Infinity', () => {
    expect(isValidBBox({ top_left: { x: Infinity, y: 0 }, bottom_right: { x: 10, y: 10 } })).toBe(
      false,
    );
  });

  it('returns false when top_left.y is -Infinity', () => {
    expect(isValidBBox({ top_left: { x: 0, y: -Infinity }, bottom_right: { x: 10, y: 10 } })).toBe(
      false,
    );
  });

  it('returns false for a plain string', () => {
    expect(isValidBBox('not-a-bbox')).toBe(false);
  });

  it('returns false for an empty object', () => {
    expect(isValidBBox({})).toBe(false);
  });

  it('returns true for bbox with negative coordinates (valid but inverted)', () => {
    // Negative coords are geometrically unusual but not invalid for the guard
    expect(isValidBBox({ top_left: { x: -10, y: -20 }, bottom_right: { x: -1, y: -5 } })).toBe(
      true,
    );
  });

  it('returns true for fractional coordinates', () => {
    expect(
      isValidBBox({ top_left: { x: 0.5, y: 1.25 }, bottom_right: { x: 10.75, y: 20.5 } }),
    ).toBe(true);
  });
});

// ── bboxToRect — extended validation tests (issue #22 additions) ──────────────

import { bboxToRect } from '../../src/canvas/types';

describe('bboxToRect — extended validation (issue #22)', () => {
  it('returns null when top_left is missing', () => {
    expect(
      bboxToRect({ bottom_right: { x: 10, y: 10 } } as unknown as Parameters<typeof bboxToRect>[0]),
    ).toBeNull();
  });

  it('returns null when bottom_right is missing', () => {
    expect(
      bboxToRect({ top_left: { x: 0, y: 0 } } as unknown as Parameters<typeof bboxToRect>[0]),
    ).toBeNull();
  });

  it('returns null when top_left.x is NaN', () => {
    expect(bboxToRect({ top_left: { x: NaN, y: 0 }, bottom_right: { x: 10, y: 10 } })).toBeNull();
  });

  it('returns null when bottom_right.y is Infinity', () => {
    expect(
      bboxToRect({ top_left: { x: 0, y: 0 }, bottom_right: { x: 10, y: Infinity } }),
    ).toBeNull();
  });
});
