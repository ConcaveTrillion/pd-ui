import * as React from 'react';
import { cn } from './cn.js';
import { Button } from './Button.js';

export interface TableFooterProps {
  /** Current page number (1-indexed). */
  page: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called with the requested page number when prev/next is clicked. */
  onPageChange: (page: number) => void;
  /** Optional total row count displayed alongside pagination. */
  totalRows?: number;
  className?: string;
}

/**
 * TableFooter — pagination controls for a data table.
 *
 * Renders prev / next buttons with the current page position.
 * Disables prev on the first page and next on the last page.
 * Used in wf03/wf11/wf-pw page-list table views.
 * Token-only styling; no hex literals.
 */
export function TableFooter({
  page,
  totalPages,
  onPageChange,
  totalRows,
  className,
}: TableFooterProps): React.ReactElement {
  return (
    <div className={cn('table-footer', className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="table-footer__prev"
      >
        Prev
      </Button>
      <span className="table-footer__page">
        {page} / {totalPages}
        {totalRows != null ? (
          <span className="table-footer__total"> · {totalRows} rows</span>
        ) : null}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="table-footer__next"
      >
        Next
      </Button>
    </div>
  );
}

TableFooter.displayName = 'TableFooter';
