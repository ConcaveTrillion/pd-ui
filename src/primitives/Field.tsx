import * as React from 'react';
import { cn } from './cn.js';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The label text for the field */
  label?: string;
  /** The htmlFor attribute — links the label to the input by id */
  htmlFor?: string;
  /** Error message — renders the error slot when set */
  error?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { className, label, htmlFor, error, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('field', className)} {...props}>
      {label !== undefined && (
        <label htmlFor={htmlFor}>{label}</label>
      )}
      {children}
      {error !== undefined && error !== '' && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Field.displayName = 'Field';
