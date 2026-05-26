import * as React from 'react';
import { cn } from './cn.js';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Icon node rendered before the button label.
   * Accepts any ReactNode — typically a component from `@pdomain/pdomain-ui/icons`.
   */
  icon?: React.ReactNode;
  /**
   * Icon node rendered after the button label.
   * Accepts any ReactNode — typically a component from `@pdomain/pdomain-ui/icons`.
   */
  iconRight?: React.ReactNode;
  /**
   * When true the button stretches to fill 100% of its container width.
   * Adds the CSS class "full" which sets width: 100% in primitives.css.
   */
  full?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, icon, iconRight, full, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'btn',
        variant,
        size === 'md' ? undefined : size,
        full === true ? 'full' : undefined,
        className,
      )}
      {...props}
    >
      {icon != null ? (
        <span className="btn-icon btn-icon--left" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
      {iconRight != null ? (
        <span className="btn-icon btn-icon--right" aria-hidden="true">
          {iconRight}
        </span>
      ) : null}
    </button>
  );
});

Button.displayName = 'Button';
