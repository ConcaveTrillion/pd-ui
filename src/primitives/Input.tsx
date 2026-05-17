import * as React from 'react';
import { cn } from './cn.js';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn('input', size === 'md' ? undefined : size, className)}
      {...props}
    />
  );
});

Input.displayName = 'Input';
