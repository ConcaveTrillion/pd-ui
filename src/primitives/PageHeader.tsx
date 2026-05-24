import * as React from 'react';
import { cn } from './cn.js';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary heading text. Rendered as an <h1>. */
  title: string;
  /** Optional subtitle rendered below the title. */
  sub?: string;
  /** Optional action slot (e.g. a Button) rendered at the trailing edge. */
  action?: React.ReactNode;
}

/**
 * PageHeader — page-level title band with optional subtitle and action slot.
 *
 * Distinct from AppShell bands. Placed at the top of a page content area
 * to introduce the page with a title, optional descriptive subtitle, and
 * an optional trailing action (e.g. a primary CTA button).
 *
 * Design source: docs/templates/design_handoff_pd_ui/design-system/ui-base.jsx
 */
export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  function PageHeader({ className, title, sub, action, ...props }, ref) {
    return (
      <div ref={ref} className={cn('page-header', className)} {...props}>
        <div className="page-header__heading">
          <h1 className="page-header__title">{title}</h1>
          {sub != null ? (
            <p
              className="page-header__sub"
              data-testid="page-header-sub"
            >
              {sub}
            </p>
          ) : null}
        </div>
        {action != null ? (
          <div
            className="page-header__action"
            data-testid="page-header-action"
          >
            {action}
          </div>
        ) : null}
      </div>
    );
  },
);

PageHeader.displayName = 'PageHeader';
