import * as React from 'react';
import { cn } from './cn.js';

export type BadgeVariant = 'default' | 'primary' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn('badge', variant === 'default' ? undefined : variant, className)}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';
