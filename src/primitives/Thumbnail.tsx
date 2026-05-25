import * as React from 'react';
import { cn } from './cn.js';

export type ThumbnailDensity = 's' | 'm' | 'l';

export interface ThumbnailProps {
  /** Image source URL. */
  imageUrl: string;
  /** Alt text for the image. */
  imageAlt?: string;
  /** Page-number badge content (string or richer ReactNode). */
  pageNumber?: React.ReactNode;
  /** Density modifier — affects card size + which overlays are visible. */
  density?: ThumbnailDensity;
  /** Currently-selected; drives data-selected attr. */
  selected?: boolean;
  /** Click handler for the card body. When provided, image is wrapped in a button. */
  onClick?: () => void;
  /** Optional ARIA label for the click action (e.g. "Open page 17"). */
  onClickLabel?: string;
  /** Status indicator dot — typically a small colored span with data-status. */
  statusSlot?: React.ReactNode;
  /** Top-left corner overlay (e.g. checkbox, page-number badge). */
  overlayTopLeft?: React.ReactNode;
  /** Top-right corner overlay (e.g. role badge, status pip). */
  overlayTopRight?: React.ReactNode;
  /** Bottom-left corner overlay (e.g. flag pills). */
  overlayBottomLeft?: React.ReactNode;
  /** Bottom-right corner overlay (e.g. time estimate, confidence). */
  overlayBottomRight?: React.ReactNode;
  /** Full-image overlay (e.g. bbox rectangle); positioned absolutely over the image. */
  imageOverlay?: React.ReactNode;
  /** Footer row beneath the image area (e.g. role select, action buttons). */
  footer?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

/**
 * Thumbnail — slot-based per-page image card (Phase 2 promotion).
 *
 * Replaces stage-specific thumb cards (Source `ThumbCard`, Grayscale `GrayThumb`,
 * `CropCard`, future stage thumbs). Stages supply their data + corner overlays
 * via slots; this component owns only the layout chrome.
 *
 * Token-only styling; no hex literals.
 */
export function Thumbnail({
  imageUrl,
  imageAlt,
  pageNumber,
  density = 'm',
  selected,
  onClick,
  onClickLabel,
  statusSlot,
  overlayTopLeft,
  overlayTopRight,
  overlayBottomLeft,
  overlayBottomRight,
  imageOverlay,
  footer,
  className,
  'data-testid': testId,
}: ThumbnailProps): React.ReactElement {
  const articleProps: React.HTMLAttributes<HTMLElement> & {
    'data-density': ThumbnailDensity;
    'data-selected'?: true;
    'data-testid'?: string;
  } = {
    className: cn('thumbnail', className),
    'data-density': density,
    ...(selected ? { 'data-selected': true as const } : {}),
    ...(testId !== undefined ? { 'data-testid': testId } : {}),
  };

  return (
    <article {...articleProps}>
      <div className="thumbnail__image-wrap">
        {onClick != null ? (
          <button
            type="button"
            className="thumbnail__image-button"
            aria-label={onClickLabel ?? 'Open thumbnail'}
            aria-pressed={selected}
            onClick={onClick}
          >
            <img src={imageUrl} alt={imageAlt ?? ''} className="thumbnail__image" />
          </button>
        ) : (
          <img src={imageUrl} alt={imageAlt ?? ''} className="thumbnail__image" />
        )}
        {imageOverlay != null && <div className="thumbnail__image-overlay">{imageOverlay}</div>}
        {pageNumber !== undefined && <span className="thumbnail__page-no">{pageNumber}</span>}
        {statusSlot != null && <span className="thumbnail__status">{statusSlot}</span>}
        {overlayTopLeft != null && (
          <div className="thumbnail__corner thumbnail__corner--tl">{overlayTopLeft}</div>
        )}
        {overlayTopRight != null && (
          <div className="thumbnail__corner thumbnail__corner--tr">{overlayTopRight}</div>
        )}
        {overlayBottomLeft != null && (
          <div className="thumbnail__corner thumbnail__corner--bl">{overlayBottomLeft}</div>
        )}
        {overlayBottomRight != null && (
          <div className="thumbnail__corner thumbnail__corner--br">{overlayBottomRight}</div>
        )}
      </div>
      {footer != null && <div className="thumbnail__footer">{footer}</div>}
    </article>
  );
}

Thumbnail.displayName = 'Thumbnail';
