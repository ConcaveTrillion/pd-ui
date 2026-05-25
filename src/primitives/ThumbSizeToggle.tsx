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
  /** Currently active size id. */
  value: string;
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
  return (
    <ToggleGroup
      type="single"
      value={value}
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
