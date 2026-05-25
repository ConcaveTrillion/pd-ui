/**
 * MarqueeSelectLayer — renders selected word bboxes in the `selection` slot.
 *
 * Use as the `selection` slot fill to show highlighted boxes for currently
 * selected words:
 *
 * ```tsx
 * <PageImageCanvas words={words} selection={sel} ...>
 *   {{
 *     selection: (p) => (
 *       <MarqueeSelectLayer {...p} words={words} />
 *     ),
 *   }}
 * </PageImageCanvas>
 * ```
 *
 * Tolerates `selection` being undefined (renders nothing).
 */

import { memo } from 'react';
import { Rect } from 'react-konva';
import type { SlotRenderProps, CanvasWord } from '../types';
import { bboxToRect } from '../types';

interface MarqueeSelectLayerProps extends SlotRenderProps {
  /** Full word array (needed to look up bboxes for selected IDs). */
  words: CanvasWord[];
  /** Derive a stable string ID for a word. */
  getWordId?: (word: CanvasWord) => string;
  /** Fill color for selected boxes (default: uses --accent token). */
  fill?: string;
  /** Stroke color for selected boxes (default: uses --accent token). */
  stroke?: string;
}

function defaultId(w: CanvasWord): string {
  const bb = w.bounding_box;
  return `${bb.top_left.x},${bb.top_left.y}`;
}

function MarqueeSelectLayerInner({
  selection,
  words,
  getWordId = defaultId,
  fill = 'var(--accent-fill, rgba(37,99,235,0.20))',
  stroke = 'var(--accent, #1d4ed8)',
}: MarqueeSelectLayerProps) {
  if (!selection || selection.ids.size === 0) return null;

  const selected = words.filter((w) => selection.ids.has(getWordId(w)));

  return (
    <>
      {selected.map((word) => {
        const rect = bboxToRect(word.bounding_box);
        if (!rect) return null;
        const id = getWordId(word);
        return (
          <Rect
            key={id}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={fill}
            stroke={stroke}
            strokeWidth={3}
            opacity={1}
            listening={false}
            perfectDrawEnabled={false}
          />
        );
      })}
    </>
  );
}

export const MarqueeSelectLayer = memo(MarqueeSelectLayerInner);
MarqueeSelectLayer.displayName = 'MarqueeSelectLayer';
