import { createContext, useContext } from 'react';

export interface FieldContextValue {
  /**
   * The stable id that the error span is rendered with.
   * `Input` and `Textarea` use this as `aria-describedby` when the field
   * has an active error.  `undefined` when there is no Field ancestor.
   */
  errorId: string | undefined;
  /**
   * Whether the parent Field currently has a non-empty error string.
   * `Input` and `Textarea` set `aria-invalid="true"` when this is `true`.
   */
  hasError: boolean;
}

const defaultValue: FieldContextValue = {
  errorId: undefined,
  hasError: false,
};

export const FieldContext = createContext<FieldContextValue>(defaultValue);

/**
 * Read the nearest Field's error association values.
 * Returns `{ errorId: undefined, hasError: false }` when used outside a Field.
 */
export function useFieldContext(): FieldContextValue {
  return useContext(FieldContext);
}
