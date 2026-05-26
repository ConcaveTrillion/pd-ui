import * as React from 'react';
import { cn } from './cn.js';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup.js';

export interface ThumbSizeOption {
  id: string;
  label: string;
  /** Target thumbnail width in pixels — for consumer layout calculations. */
  px: number;
}

/**
 * Default thumbnail size options aligned with the design's THUMB_SIZE_CFG.
 * Consumers may pass a custom `sizes` array to override.
 */
export const THUMB_SIZES: ThumbSizeOption[] = [
  { id: 'sm', label: 'SM', px: 100 },
  { id: 'md', label: 'MD', px: 160 },
  { id: 'lg', label: 'LG', px: 240 },
];

export interface ThumbSizeToggleProps {
  /**
   * Currently active size id.
   * Pass `undefined` (or omit) when no size is pre-selected.
   * The component maps undefined → `''` internally so Radix ToggleGroup
   * always stays in controlled mode and never fires the
   * uncontrolled→controlled console.error.
   */
  value?: string;
  /** Called with the new size id when the user selects an option. */
  onValueChange: (value: string) => void;
  /** Override the available size options. Defaults to THUMB_SIZES. */
  sizes?: ThumbSizeOption[];
  className?: string;
}

/**
 * ThumbSizeToggle — segmented control for picking thumbnail grid size.
 *
 * Composes ToggleGroup (Radix) with the standard THUMB_SIZES vocabulary.
 * Used in wf03/wf11/wf-pw page-list thumbnail views.
 * Token-only styling; no hex literals.
 */
export function ThumbSizeToggle({
  value,
  onValueChange,
  sizes = THUMB_SIZES,
  className,
}: ThumbSizeToggleProps): React.ReactElement {
  // Map undefined → '' so Radix ToggleGroup stays in controlled mode for the
  // full lifetime of the component. Without this, a consumer that starts with
  // value={undefined} and later provides a string triggers Radix's
  // uncontrolled→controlled console.error. Radix uses '' to mean "nothing
  // selected" in a single-type ToggleGroup, matching the onValueChange guard
  // below which filters out '' before calling the consumer callback.
  const controlledValue = value ?? '';
  return (
    <ToggleGroup
      type="single"
      value={controlledValue}
      onValueChange={(v) => {
        if (v !== '') onValueChange(v);
      }}
      className={cn('thumb-size-toggle', className)}
    >
      {sizes.map((size) => (
        <ToggleGroupItem key={size.id} value={size.id} aria-label={size.label}>
          {size.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

ThumbSizeToggle.displayName = 'ThumbSizeToggle';
