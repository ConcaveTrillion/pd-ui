/**
 * TopNav — thin layout primitive for the top navigation bar.
 * Applies design-system surface classes; children supply nav items.
 */
import * as React from 'react';
import { cn } from '../primitives/cn.js';

export interface TopNavProps {
  children: React.ReactNode;
  className?: string;
}

export function TopNav({ children, className }: TopNavProps) {
  return (
    <header
      data-testid="top-nav"
      className={cn('top-nav', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-1)',
        gap: '8px',
        padding: '0 12px',
        overflow: 'hidden',
      }}
    >
      {children}
    </header>
  );
}

TopNav.displayName = 'TopNav';
