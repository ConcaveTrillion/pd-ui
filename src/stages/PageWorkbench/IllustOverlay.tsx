/**
 * IllustOverlay — illustration bbox highlight rectangles.
 *
 * Renders Konva Rect shapes inside a PageImageCanvas slot fn (`underlay`).
 * Bboxes are decoration (non-interactive highlights), so `underlay` is
 * appropriate — they render above the image but below word overlays.
 *
 * Each bbox is normalized [x, y, w, h] relative to page dimensions.
 */

import { Rect } from 'react-konva';
import type { CoordContext } from '../../canvas/types.js';

export interface IllustBbox {
  id: string;
  /** Normalized [x, y, w, h] relative to image dimensions. */
  bbox: [number, number, number, number];
  label?: string;
}

export interface IllustOverlayProps {
  /** Coordinate context from SlotRenderProps. */
  coords: CoordContext;
  /** Illustration bboxes to highlight. */
  illustBboxes: IllustBbox[];
}

export function IllustOverlay({ coords, illustBboxes }: IllustOverlayProps) {
  return (
    <>
      {illustBboxes.map((ill) => {
        const [nx, ny, nw, nh] = ill.bbox;
        const x = nx * coords.pageWidth;
        const y = ny * coords.pageHeight;
        const w = nw * coords.pageWidth;
        const h = nh * coords.pageHeight;
        return (
          <Rect
            key={ill.id}
            data-testid={`illust-bbox-${ill.id}`}
            x={x}
            y={y}
            width={w}
            height={h}
            stroke="var(--info, #0ea5e9)"
            strokeWidth={2}
            fill="color-mix(in oklab, var(--info, #0ea5e9) 12%, transparent)"
            cornerRadius={2}
            listening={false}
            perfectDrawEnabled={false}
          />
        );
      })}
    </>
  );
}

IllustOverlay.displayName = 'IllustOverlay';
