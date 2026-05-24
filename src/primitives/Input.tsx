import * as React from 'react';
import { cn } from './cn.js';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  /**
   * Optional suffix rendered to the right of the input inside a flex wrapper.
   * When provided, the component renders a composite div+input+span structure
   * instead of a bare <input>. Existing callers that omit `suffix` are unaffected.
   *
   * Design reference:
   *   docs/templates/design_handoff_pd_ui/design-system/ui-base.jsx → Input
   */
  suffix?: React.ReactNode;
  /**
   * When true, applies the focus-ring styling (blue border + box-shadow) to the
   * wrapper (or bare input if no suffix) unconditionally — useful for programmatic
   * focus-highlight without relying on the CSS :focus pseudo-class alone.
   *
   * Implemented as the CSS class `.input-focus-ring` in theme/primitives.css so
   * the rule stays token-only (var(--accent)) and no inline styles are needed.
   */
  autoFocusRing?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, suffix, autoFocusRing, ...props },
  ref,
) {
  const sizeClass = size === 'md' ? undefined : size;
  const focusRingClass = autoFocusRing ? 'input-focus-ring' : undefined;

  if (suffix !== undefined) {
    // Composite mode: wrapper div + input + suffix span.
    // The wrapper carries the visual border/background so it looks like one
    // unified input field; the inner <input> has no border of its own.
    return (
      <div className={cn('input-wrapper', focusRingClass)}>
        <input
          ref={ref}
          className={cn('input input-inner', sizeClass, className)}
          {...props}
        />
        <span className="input-suffix">{suffix}</span>
      </div>
    );
  }

  // Bare-input mode (back-compat — identical to pre-extension behavior)
  return (
    <input
      ref={ref}
      className={cn('input', sizeClass, focusRingClass, className)}
      {...props}
    />
  );
});

Input.displayName = 'Input';
