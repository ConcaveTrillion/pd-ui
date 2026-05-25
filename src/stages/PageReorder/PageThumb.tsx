import * as React from 'react';
import { Icon } from '../../icons/index.js';
import { REORDER_PAGE_THUMB } from '../../testids/index.js';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface PageRef {
  id: string;
  number: number | string;
  /** Optional thumbnail URL. When absent, a placeholder block is rendered. */
  thumbnailUrl?: string;
}

export interface PageThumbProps {
  pageA: PageRef;
  pageB: PageRef;
  /** Override the root element's data-testid. Defaults to `REORDER_PAGE_THUMB`. */
  'data-testid'?: string;
}

// ─── Internal: single thumb cell ─────────────────────────────────────────────

function ThumbCell({ page }: { page: PageRef }): React.ReactElement {
  return (
    <div className="page-thumb__cell">
      <div className="page-thumb__img-wrap">
        {page.thumbnailUrl != null ? (
          <img className="page-thumb__img" src={page.thumbnailUrl} alt={`Page ${page.number}`} />
        ) : (
          <div className="page-thumb__placeholder" aria-hidden="true" />
        )}
      </div>
      <span className="page-thumb__number">{page.number}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PageThumb — reorder-specific page thumbnail pair with a central swap icon.
 *
 * Renders two page thumbnails side-by-side (pageA left, pageB right) with an
 * `ArrowLeftRight` swap icon between them. Distinct from Source's `ThumbCard`;
 * no role badges, no selection state — reorder context only.
 *
 * Design source: wf09/pages-tab.jsx lines 379-412.
 */
export function PageThumb({
  pageA,
  pageB,
  'data-testid': testId = REORDER_PAGE_THUMB,
}: PageThumbProps): React.ReactElement {
  return (
    <div className="page-thumb" data-testid={testId}>
      <ThumbCell page={pageA} />
      <span className="page-thumb__arrow" aria-hidden="true">
        <Icon name="swap" size={16} />
      </span>
      <ThumbCell page={pageB} />
    </div>
  );
}

PageThumb.displayName = 'PageThumb';
