import * as React from 'react';
import { cn } from './cn.js';

export type ChipVariant = 'static' | 'dashed';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { className, variant, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn('chip', variant === 'static' ? undefined : variant, className)}
      {...props}
    />
  );
});

Chip.displayName = 'Chip';
