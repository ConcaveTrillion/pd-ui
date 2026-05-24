import * as React from 'react';
import { cn } from './cn.js';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SegmentedSize = 'sm' | 'md';

export interface SegmentedOption {
  /** Unique identifier for this segment. */
  value: string;
  /** Text label rendered inside the segment. */
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
}

export interface SegmentedProps {
  /** Ordered list of segment options. */
  options: SegmentedOption[];
  /**
   * Controlled active value.
   * If provided, `defaultValue` is ignored and `onChange` must update the value.
   */
  value?: string;
  /** Uncontrolled initial active value. */
  defaultValue?: string;
  /** Called with the newly selected value when a segment is activated. */
  onChange?: (value: string) => void;
  /** Visual size. Defaults to `'sm'`. */
  size?: SegmentedSize;
  /** When true, the control fills its container width with equal-width columns. */
  full?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Segmented atom — a mutually-exclusive inline selector rendered as a
 * pill-track with highlighted active segment.
 *
 * Ported from the `Seg2` design-system pattern (wf-pw/wf11 design bundles)
 * and the 4-column icon variant (wf01 ModalD).  Uses native ARIA radio-group
 * semantics; arrow-key navigation is implemented in the component (no Radix
 * dependency needed — the primitive is simple enough to own its own a11y).
 *
 * CSS tokens only — no hex literals.  Classes: `.segmented`, `.segmented--sm`,
 * `.segmented--md`, `.segmented--full`, `.segmented__item`, `.segmented__item--active`.
 */
export const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      size = 'sm',
      full = false,
      className,
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;

    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue ?? options[0]?.value ?? '',
    );

    const active = isControlled ? controlledValue : internalValue;

    const handleSelect = React.useCallback(
      (val: string) => {
        if (!isControlled) {
          setInternalValue(val);
        }
        onChange?.(val);
      },
      [isControlled, onChange],
    );

    // Arrow-key navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
        const len = options.length;
        let next: number | null = null;

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          next = (idx + 1) % len;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          next = (idx - 1 + len) % len;
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(options[idx]?.value ?? '');
          return;
        }

        if (next !== null) {
          const group = e.currentTarget.closest('[role="group"]');
          const buttons = group?.querySelectorAll<HTMLButtonElement>(
            'button[role="radio"]',
          );
          buttons?.[next]?.focus();
        }
      },
      [options, handleSelect],
    );

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'segmented',
          `segmented--${size}`,
          full && 'segmented--full',
          className,
        )}
      >
        {options.map((opt, idx) => {
          const isActive = opt.value === active;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={cn(
                'segmented__item',
                isActive && 'segmented__item--active',
              )}
              onClick={() => handleSelect(opt.value)}
              onKeyDown={e => handleKeyDown(e, idx)}
            >
              {opt.icon !== undefined && (
                <span className="segmented__icon" aria-hidden="true">
                  {opt.icon}
                </span>
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  },
);

Segmented.displayName = 'Segmented';
