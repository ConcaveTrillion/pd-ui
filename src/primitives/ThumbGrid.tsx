import * as React from 'react';
import { cn } from './cn.js';

export interface ThumbGridProps<T> {
  /** Array of items to render as thumbnails. */
  items: T[];
  /**
   * Render-prop that returns the content for each grid cell.
   * Responsible for rendering the thumbnail image, overlay badges, etc.
   * The key should be set on the returned element by the consumer.
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * Optional empty-state node shown when `items` is empty.
   * If not provided, an empty grid is rendered.
   */
  emptyState?: React.ReactNode;
  /**
   * Target thumbnail width in pixels.
   * Forwarded as `--thumb-size` CSS custom property for grid layout.
   * Defaults to 160.
   */
  thumbSize?: number;
  className?: string;
}

/**
 * ThumbGrid — virtualization-ready thumbnail grid.
 *
 * Uses a render-prop pattern so consumers can supply any thumbnail component
 * (PageThumb, image, card, etc.) without ThumbGrid knowing the domain model.
 *
 * Grid layout is driven by CSS grid with `--thumb-size` as the column width,
 * enabling consumer control via ThumbSizeToggle.
 *
 * Used in wf03/wf11/wf-pw page-list thumbnail views.
 * Token-only styling; no hex literals.
 */
export function ThumbGrid<T>({
  items,
  renderItem,
  emptyState,
  thumbSize = 160,
  className,
}: ThumbGridProps<T>): React.ReactElement {
  if (items.length === 0 && emptyState != null) {
    return <div className={cn('thumb-grid thumb-grid--empty', className)}>{emptyState}</div>;
  }

  const style: React.CSSProperties = {
    ['--thumb-size' as string]: `${thumbSize}px`,
  };

  return (
    <div className={cn('thumb-grid', className)} style={style}>
      {items.map((item, i) => (
        <div key={i} className="thumb-grid__cell">
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}

ThumbGrid.displayName = 'ThumbGrid';
