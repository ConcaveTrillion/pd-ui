import * as React from 'react';
import { cn } from './cn.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('card', className)} {...props} />;
});

Card.displayName = 'Card';
