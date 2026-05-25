/**
 * Breadcrumb — thin layout primitive for breadcrumb navigation.
 * Applies design-system classes; children supply the crumb items.
 */
import * as React from 'react';
import { cn } from '../primitives/cn.js';

export interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ children, className }: BreadcrumbProps) {
  return (
    <nav data-testid="breadcrumb" aria-label="Breadcrumb" className={cn('breadcrumb', className)}>
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: '12px',
          color: 'var(--ink-2)',
        }}
      >
        {children}
      </ol>
    </nav>
  );
}

Breadcrumb.displayName = 'Breadcrumb';
