/**
 * Rail — 64px wide vertical left rail sub-shell.
 *
 * Thin layout primitive. Children supply the buttons, icons, and labels.
 * Mode/target business logic stays in the consuming app.
 */
import * as React from 'react';
import { cn } from '../primitives/cn.js';

export interface RailProps {
  children?: React.ReactNode;
  className?: string;
  /** Width override. Defaults to '64px'. */
  width?: string;
}

export function Rail({ children, className, width = '64px' }: RailProps) {
  return (
    <div
      data-testid="rail"
      className={cn('rail', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-1)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

Rail.displayName = 'Rail';
