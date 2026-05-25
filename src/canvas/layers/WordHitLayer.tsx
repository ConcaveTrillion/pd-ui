/**
 * WordHitLayer — renders invisible Konva <Rect>s for hit-testing words.
 *
 * Use this as the `overlay` slot fill when you want precise hover detection
 * without a visible bbox:
 *
 * ```tsx
 * <PageImageCanvas ...>
 *   {{
 *     overlay: (p) => <WordHitLayer key={...} {...p} onHover={setHover} />,
 *   }}
 * </PageImageCanvas>
 * ```
 *
 * The hit targets are transparent but `listening=true` so they capture
 * pointer events on the Konva stage.
 */

import { memo } from 'react';
import { Rect } from 'react-konva';
import type { WordSlotProps, CanvasWord } from '../types';
import { bboxToRect } from '../types';

interface WordHitLayerProps extends WordSlotProps {
  /** Called when the pointer enters the word's bounding box. */
  onHover?: (word: CanvasWord | null) => void;
  /** Called when the user clicks the word. */
  onClick?: (word: CanvasWord) => void;
}

function WordHitLayerInner({ word, onHover, onClick }: WordHitLayerProps) {
  const rect = bboxToRect(word.bounding_box);
  if (!rect) return null;

  return (
    <Rect
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      fill="transparent"
      strokeWidth={0}
      listening={true}
      onMouseEnter={() => onHover?.(word)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(word)}
      perfectDrawEnabled={false}
    />
  );
}

export const WordHitLayer = memo(WordHitLayerInner);
WordHitLayer.displayName = 'WordHitLayer';
